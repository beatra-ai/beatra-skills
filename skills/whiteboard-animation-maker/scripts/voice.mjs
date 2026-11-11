#!/usr/bin/env node
/**
 * Voiceover submit/collect for a whiteboard-animation-maker draft.
 *
 * Async tasks follow the Beatra paradigm: this script only submits; the
 * agent polls beatra.tasks.get and saves the final result as
 * <draft>/voice/task.json; `collect` then downloads and aligns.
 *
 *   node voice.mjs voices [--language zh-CN] [--category cloned]
 *   node voice.mjs estimate <outdir>
 *   node voice.mjs submit <outdir> --voice <voice_id>
 *   node voice.mjs recover <outdir>
 *   node voice.mjs collect <outdir>
 *   node voice.mjs clone-submit <sample> --name NAME --consent --draft <outdir>
 *   node voice.mjs align <outdir>
 *   node voice.mjs mux <outdir>
 *   node voice.mjs fetch <url> -o <path>
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import { pipeline } from "node:stream";
import { fileURLToPath } from "node:url";
import { alignDraft, parseScript, weight } from "./align.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mcpBin = path.join(skillRoot, "scripts/mcp_client.py");
const collectionIdentityError = "Cannot collect this result: its task id is not the known synthesis task for this draft. Reconcile the saved request first; use `voice.mjs recover <outdir>` only for a lost submission response.";
const recoveryError = "Cannot recover: this draft has no intact pending synthesis request. Keep the saved request unchanged and inspect voice/ledger.json.";

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function runMcp(args, { stdin = null, inherit = false } = {}) {
  // stderr inherit so authorization guidance stays visible while stdout
  // stays JSON. Run scripts/authorize.py when the client reports missing
  // or invalid credentials; this script never handles tokens itself.
  const r = spawnSync("python3", [mcpBin, ...args], {
    encoding: "utf8",
    input: stdin == null ? undefined : stdin,
    stdio: inherit ? "inherit" : ["pipe", "pipe", "inherit"],
    maxBuffer: 20 * 1024 * 1024,
  });
  if (inherit) {
    if (r.status !== 0) process.exit(r.status ?? 1);
    return null;
  }
  if (r.status !== 0) {
    die((r.stdout || `mcp_client.py exited ${r.status}`).trim());
  }
  const out = (r.stdout || "").trim();
  if (!out) return null;
  try {
    return JSON.parse(out);
  } catch {
    die(`mcp_client.py returned non-JSON:\n${out.slice(0, 400)}`);
  }
}

function callTool(name, args) {
  return runMcp(["call", name], { stdin: JSON.stringify(args) });
}

function structured(result) {
  return (result && result.structuredContent) || result || {};
}

function taskIdOf(result) {
  const s = structured(result);
  return s.task_id || s.task?.task_id || null;
}

function opaqueId(prefix) {
  return `${prefix}-${crypto.randomBytes(8).toString("hex")}`;
}

function speakableFromScript(scriptText) {
  return parseScript(scriptText)
    .map((s) => s.text)
    .join("");
}

function extractSpeech(result) {
  const s = structured(result);
  const task = s.task || s;
  const output = task.output || s.output || {};
  const audio = output.audio || {};
  const artifacts = s.artifacts || task.artifacts || task.links?.assets || [];
  const first = Array.isArray(artifacts) ? artifacts[0] : null;
  let url = null;
  for (const cand of [audio.url, audio, first, first?.url]) {
    if (typeof cand === "string" && /^https?:\/\//.test(cand)) url = cand;
    else if (cand && typeof cand.url === "string" && /^https?:\/\//.test(cand.url)) url = cand.url;
    if (url) break;
  }
  const duration = Number(audio.duration_seconds || first?.duration_seconds || output.duration_seconds || 0) || null;
  return {
    url,
    duration,
    artifact_id: audio.artifact_id || first?.artifact_id || null,
    mime_type: audio.mime_type || first?.mime_type || null,
    voice_id: output.voice_id || null,
    model: output.model || s.resolved_model || null,
    characters: output.characters ?? null,
    subtitles: output.subtitles || null,
    billing: s.billing || task.billing || null,
    status: s.status || task.status || null,
    task_id: s.task_id || s.task?.task_id || null,
  };
}

function ledgerPath(draft) {
  return path.join(draft, "voice", "ledger.json");
}

function readLedger(draft) {
  const p = ledgerPath(draft);
  if (!fs.existsSync(p)) return {};
  try {
    const ledger = JSON.parse(fs.readFileSync(p, "utf8"));
    return ledger && typeof ledger === "object" && !Array.isArray(ledger) ? ledger : {};
  } catch {
    return {};
  }
}

function writeLedger(draft, value) {
  const p = ledgerPath(draft);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`);
}

/** Only a matching terminal result can release an in-flight synthesis identity. */
export function collectedLedger(ledger, speech) {
  if (!matchesSynthesisTask(ledger, speech)) return ledger;
  if (!["succeeded", "failed", "canceled"].includes(speech.status)) return ledger;
  return {
    ...ledger,
    synth: {
      ...ledger.synth,
      status: speech.status === "succeeded" ? "succeeded" : "failed",
      ...(speech.status === "succeeded" ? { duration_seconds: speech.duration } : {}),
    },
  };
}

function nonemptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function matchesSynthesisTask(ledger, speech) {
  return nonemptyString(ledger?.synth?.task_id) && ledger.synth.task_id === speech?.task_id;
}

/** Explicit, single replay of the saved request after the agent reconciles a lost response. */
export async function recoverDraft(draft, { callTool: invoke = callTool } = {}) {
  const ledger = readLedger(draft);
  const synth = ledger.synth;
  if (nonemptyString(synth?.task_id)) {
    return { task_id: synth.task_id, client_request_id: synth.client_request_id };
  }
  if (
    !synth ||
    !["submitting", "answer_unclear"].includes(synth.status) ||
    (synth.task_id != null && synth.task_id !== "") ||
    !nonemptyString(synth.client_request_id) ||
    !synth.payload || typeof synth.payload !== "object" || Array.isArray(synth.payload) ||
    synth.payload.client_request_id !== synth.client_request_id
  ) {
    throw new Error(recoveryError);
  }

  const original = JSON.stringify(synth);
  const created = await invoke("beatra.speech.synthesize", synth.payload);
  const current = readLedger(draft);
  // A concurrent edit or another submit must never inherit this response.
  if (JSON.stringify(current.synth) !== original) throw new Error(recoveryError);
  const id = taskIdOf(created);
  if (!nonemptyString(id)) {
    writeLedger(draft, { ...current, synth: { ...current.synth, status: "answer_unclear" } });
    throw new Error("The synthesis response still has no task id. Keep the original request identity and reconcile before trying recovery again.");
  }
  writeLedger(draft, { ...current, synth: { ...current.synth, task_id: id, status: "submitted" } });
  return { task_id: id, client_request_id: current.synth.client_request_id };
}

function inputHash({ input, voice, speed, format, language }) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ input, voice, speed, format, language: language || "" }))
    .digest("hex");
}

export function download(url, dest, {
  timeoutMs = 120_000,
  get = https.get,
  createWriteStream = fs.createWriteStream,
} = {}) {
  // Artifact URLs are public CDN addresses; a plain GET needs no MCP client.
  return new Promise((resolve, reject) => {
    const requests = new Set();
    const responses = new Set();
    const temp = `${dest}.part-${crypto.randomBytes(8).toString("hex")}`;
    let file;
    let settled = false;
    const timer = setTimeout(() => finish(new Error("download_timeout")), timeoutMs);

    async function finish(err) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) {
        for (const req of requests) req.destroy();
        for (const res of responses) res.destroy();
        if (file && !file.closed) {
          // Wait for a pending open to close before removing its temporary file.
          const closed = new Promise((done) => file.once("close", done));
          file.destroy();
          await closed;
        }
        try { fs.rmSync(temp, { force: true }); } catch { /* Preserve the transport error. */ }
        reject(err);
      } else {
        resolve(dest);
      }
    }

    function follow(address, redirects) {
      if (settled) return;
      let target;
      try { target = new URL(address); } catch { finish(new Error("download_requires_https")); return; }
      if (target.protocol !== "https:") { finish(new Error("download_requires_https")); return; }
      let discarded = false;
      let receivedResponse = false;
      let req;
      try {
        req = get(target.toString(), { headers: { "User-Agent": "whiteboard-animation-maker/1.0.0" } }, (res) => {
          receivedResponse = true;
          responses.add(res);
          res.on("error", (err) => { if (!discarded) finish(err); });
          res.on("aborted", () => { if (!discarded) finish(new Error("download_aborted")); });
          res.on("close", () => {
            if (!discarded && (res.complete === false || !res.readableEnded)) finish(new Error("download_premature_close"));
          });
          if (settled) { res.destroy(); return; }
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            if (redirects >= 5) { finish(new Error("download_redirect_limit")); return; }
            let next;
            try { next = new URL(res.headers.location, target).toString(); } catch { finish(new Error("download_requires_https")); return; }
            discarded = true;
            res.destroy();
            req?.destroy();
            follow(next, redirects + 1);
            return;
          }
          if (res.statusCode !== 200) {
            finish(new Error(`download_http_status:${res.statusCode}`));
            return;
          }
          try {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            file = createWriteStream(temp, { flags: "wx" });
            pipeline(res, file, (err) => {
              if (settled) return;
              if (err) { finish(err); return; }
              if (res.complete === false) { finish(new Error("download_premature_close")); return; }
              // Rename only after both the response and the file have completed.
              try { fs.renameSync(temp, dest); } catch (error) { finish(error); return; }
              finish();
            });
          } catch (err) { finish(err); }
        });
        requests.add(req);
        req.on("error", (err) => { if (!discarded) finish(err); });
        req.on("close", () => {
          if (!discarded && !receivedResponse) finish(new Error("download_premature_close"));
        });
        if (settled || discarded) req.destroy();
      } catch (err) { finish(err); }
    }

    follow(url, 0);
  });
}

/** Collect the paid audio even when the optional subtitles cannot be downloaded. */
export async function collectSpeechFiles(speech, voiceDir, {
  downloadFile = download,
  removeFile = (file) => fs.rmSync(file, { force: true }),
} = {}) {
  const audioPath = path.join(voiceDir, "narration.mp3");
  await downloadFile(speech.url, audioPath);
  // Another take's cues must not be used for this audio when its own cues are missing or unreadable.
  for (const ext of ["json", "srt", "vtt"]) {
    try { removeFile(path.join(voiceDir, `subtitles.${ext}`)); } catch { /* Optional files cannot block audio delivery. */ }
  }
  let subtitlePath = null;
  if (speech.subtitles?.url) {
    const ext = speech.subtitles.format === "srt" ? "srt" : speech.subtitles.format === "vtt" ? "vtt" : "json";
    const dest = path.join(voiceDir, `subtitles.${ext}`);
    try {
      await downloadFile(speech.subtitles.url, dest);
      subtitlePath = dest;
    } catch {
      try { removeFile(dest); } catch { /* alignDraft explicitly skips this file. */ }
    }
  }
  return { audioPath, subtitlePath };
}

function cmdVoices(argv) {
  const args = {};
  const lang = flag(argv, "--language");
  const category = flag(argv, "--category");
  if (lang) args.language = lang;
  if (category) args.category = category;
  const result = callTool("beatra.voices.list", args);
  const s = structured(result);
  const data = s.voices || s.data || [];
  _print({ voices: data });
  if (Array.isArray(data)) {
    for (const v of data) {
      const ready = v.status && v.status !== "ready" ? ` [${v.status}]` : "";
      console.error(`${v.voice_id}\t${v.display_name || ""}${ready}\t${v.language || ""}`);
    }
  }
}

function readSpeakable(draft) {
  const scriptPath = path.join(draft, "script.txt");
  if (!fs.existsSync(scriptPath)) die(`missing ${scriptPath}`);
  const input = speakableFromScript(fs.readFileSync(scriptPath, "utf8"));
  if (!input) die("script.txt has no spoken lines");
  if (input.length > 50000) die("script exceeds 50000 characters; split the draft");
  return input;
}

function cmdEstimate(argv) {
  const outArg = argv.find((a) => !a.startsWith("--"));
  if (!outArg) die("usage: voice.mjs estimate <outdir>");
  const input = readSpeakable(path.resolve(outArg));
  _print({ characters: input.length, weighted_characters: weight(input), input_preview: input.slice(0, 80) });
}

function cmdSubmit(argv) {
  const outArg = argv.find((a) => !a.startsWith("--"));
  if (!outArg) die("usage: voice.mjs submit <outdir> --voice <voice_id> [--language zh-CN] [--speed 1.2] [--format mp3]");
  const draft = path.resolve(outArg);
  const voice = flag(argv, "--voice");
  if (!voice) die("need --voice <opaque voice_id> from `voice.mjs voices` (never a display name)");
  const language = flag(argv, "--language") || "zh-CN";
  const speed = Number(flag(argv, "--speed") || 1.2);
  const format = flag(argv, "--format") || "mp3";
  const input = readSpeakable(draft);

  const hash = inputHash({ input, voice, speed, format, language });
  const ledger = readLedger(draft);
  const voiceDir = path.join(draft, "voice");
  fs.mkdirSync(voiceDir, { recursive: true });
  const audioPath = path.join(voiceDir, "narration.mp3");

  if (ledger.synth?.input_sha256 === hash && ledger.synth.status === "succeeded" && fs.existsSync(audioPath)) {
    // Byte-identical script, voice, and speed already paid and downloaded.
    // Re-run alignment only; never submit a second paid synthesis.
    const alignment = alignDraft(draft);
    _print({
      reused: true,
      task_id: ledger.synth.task_id,
      audio: audioPath,
      duration: alignment.duration,
      method: alignment.method,
    });
    return;
  }
  if (
    ledger.synth?.input_sha256 === hash &&
    (ledger.synth.status === "submitting" ||
      ledger.synth.status === "submitted" ||
      ledger.synth.status === "answer_unclear")
  ) {
    // An identical submit is already in flight or unanswered. Minting a new
    // id here would double-charge: reconcile with beatra.tasks.list and
    // beatra.tasks.get, then replay byte-identical arguments under the SAME
    // client_request_id recorded below.
    die(
      `an identical synthesis is already in flight (status ${ledger.synth.status}, ` +
        `task_id ${ledger.synth.task_id ?? "unknown"}, client_request_id ${ledger.synth.client_request_id}). ` +
        "Reconcile with beatra.tasks.list / beatra.tasks.get, then replay byte-identical " +
        "arguments under the same client_request_id. A new id needs a new confirmed request, " +
        "and only after this one reached a terminal state."
    );
  }

  const client_request_id = opaqueId("wb-speech");
  const payload = {
    voice,
    input,
    client_request_id,
    model: "auto",
    language,
    format,
    speed,
    volume: 1.0,
    pitch: 0,
  };
  // Persist the id and exact payload BEFORE the call so a lost response is
  // still recoverable and replayable under the same id.
  writeLedger(draft, {
    ...ledger,
    synth: {
      input_sha256: hash,
      voice,
      language,
      speed,
      format,
      client_request_id,
      task_id: null,
      status: "submitting",
      weighted_characters: weight(input),
      payload,
    },
  });
  const created = callTool("beatra.speech.synthesize", payload);
  const id = taskIdOf(created);
  if (!id) {
    writeLedger(draft, {
      ...readLedger(draft),
      synth: { ...readLedger(draft).synth, status: "answer_unclear" },
    });
    die(`synthesize did not return a task_id:\n${JSON.stringify(created, null, 2)}`);
  }
  writeLedger(draft, {
    ...readLedger(draft),
    synth: { ...readLedger(draft).synth, task_id: id, status: "submitted" },
  });
  _print({ reused: false, task_id: id, client_request_id });
}

async function cmdRecover(argv) {
  if (argv.length !== 1 || argv[0].startsWith("--")) {
    die("usage: voice.mjs recover <outdir>  (after reconciling a lost submission response)");
  }
  _print(await recoverDraft(path.resolve(argv[0])));
}

export async function cmdCollect(argv, { collectFiles = collectSpeechFiles } = {}) {
  const outArg = argv.find((a) => !a.startsWith("--"));
  if (!outArg) die("usage: voice.mjs collect <outdir>  (after saving the final tasks.get result as voice/task.json)");
  const draft = path.resolve(outArg);
  const taskPath = path.join(draft, "voice", "task.json");
  if (!fs.existsSync(taskPath)) die(`missing ${taskPath}; save the terminal beatra.tasks.get result there first`);
  const ledger = readLedger(draft);
  const speech = extractSpeech(JSON.parse(fs.readFileSync(taskPath, "utf-8")));
  if (!matchesSynthesisTask(ledger, speech)) throw new Error(collectionIdentityError);
  if (speech.status !== "succeeded") {
    // A running or unknown answer still owns its request id. Only a terminal
    // failure permits a later confirmed submit with a new identity.
    const next = collectedLedger(ledger, speech);
    if (next !== ledger) writeLedger(draft, next);
    die(`task ended ${speech.status}; see voice/task.json`);
  }
  if (!speech.url) die("task succeeded but returned no audio url");

  const voiceDir = path.join(draft, "voice");
  const { audioPath, subtitlePath } = await collectFiles(speech, voiceDir);
  writeLedger(draft, collectedLedger(ledger, speech));

  const alignment = alignDraft(draft, { subtitlePath });
  console.error(`aligned via ${alignment.method}; duration ${alignment.duration}s`);
  _print({
    reused: false,
    audio: audioPath,
    duration: alignment.duration,
    method: alignment.method,
    characters: speech.characters,
    client_request_id: ledger.synth.client_request_id,
    charged_credits: speech.billing?.net_charged_credits ?? null,
    scenes: alignment.scenes.map((s) => ({ id: s.id, start: s.start, end: s.end })),
  });
}

function cmdAlign(argv) {
  const outArg = argv.find((a) => !a.startsWith("--"));
  if (!outArg) die("usage: voice.mjs align <outdir>");
  const alignment = alignDraft(path.resolve(outArg));
  console.error(`aligned via ${alignment.method}; duration ${alignment.duration}s`);
  _print(alignment);
}

function cmdMux(argv) {
  const outArg = argv.find((a) => !a.startsWith("--"));
  if (!outArg) die("usage: voice.mjs mux <outdir>");
  muxDraft(path.resolve(outArg));
}

async function cmdFetch(argv) {
  const url = argv.find((a) => !a.startsWith("--"));
  const dest = flag(argv, "--output") || flag(argv, "-o");
  if (!url || !dest) die("usage: voice.mjs fetch <url> -o <path>");
  await download(url, path.resolve(dest));
}

function mimeOf(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".wav") return "audio/wav";
  if (ext === ".mp3") return "audio/mpeg";
  if (ext === ".m4a") return "audio/mp4";
  if (ext === ".flac") return "audio/flac";
  die(`unknown sample type ${ext}; use wav/mp3/m4a`);
}

function cmdCloneSubmit(argv) {
  const sample = argv.find((a) => !a.startsWith("--"));
  const name = flag(argv, "--name");
  const consent = argv.includes("--consent");
  const language = flag(argv, "--language");
  const draftArg = flag(argv, "--draft");
  if (!sample || !name || !draftArg) {
    die("usage: voice.mjs clone-submit <sample> --name NAME --consent --draft <outdir> [--language zh-CN]");
  }
  if (!consent) {
    die("Refuse to clone without --consent. The user must say this is their voice or the speaker authorized it.");
  }
  const draft = path.resolve(draftArg);
  fs.mkdirSync(path.join(draft, "voice"), { recursive: true });
  const existingClone = readLedger(draft).clone;
  if (
    existingClone &&
    (existingClone.status === "submitting" ||
      existingClone.status === "submitted" ||
      existingClone.status === "answer_unclear")
  ) {
    die(
      `a clone submit is already in flight (status ${existingClone.status}, ` +
        `task_id ${existingClone.task_id ?? "unknown"}, client_request_id ${existingClone.client_request_id}). ` +
        "Reconcile with beatra.tasks.list / beatra.tasks.get, then replay byte-identical " +
        "arguments under the same client_request_id. A new id needs a new confirmed request, " +
        "and only after this one reached a terminal state."
    );
  }
  const uploaded = runMcp(["upload", path.resolve(sample), "--mime-type", mimeOf(sample)]);
  const client_request_id = opaqueId("wb-clone");
  const payload = {
    sample: uploaded,
    display_name: name,
    consent_attested: true,
    model: "auto",
    client_request_id,
  };
  if (language) payload.language = language;
  writeLedger(draft, {
    ...readLedger(draft),
    clone: { client_request_id, task_id: null, status: "submitting", payload },
  });
  const created = callTool("beatra.voices.clone", payload);
  const id = taskIdOf(created);
  if (!id) {
    writeLedger(draft, {
      ...readLedger(draft),
      clone: { ...readLedger(draft).clone, status: "answer_unclear" },
    });
    die(`clone did not return a task_id:\n${JSON.stringify(created, null, 2)}`);
  }
  writeLedger(draft, {
    ...readLedger(draft),
    clone: { ...readLedger(draft).clone, task_id: id, status: "submitted" },
  });
  _print({ task_id: id, client_request_id });
}

export function muxDraft(draft) {
  const picture = path.join(draft, "renders", "picture.mp4");
  const out = path.join(draft, "renders", "out.mp4");
  const audio = path.join(draft, "voice", "narration.mp3");
  if (!fs.existsSync(audio)) {
    console.error("no voice/narration.mp3; leaving silent render");
    return out;
  }
  if (!fs.existsSync(out)) die(`missing ${out}; render first`);
  // Always snapshot the just-rendered silent video. A leftover picture.mp4
  // from an older duration would otherwise be muxed over the new cut.
  fs.copyFileSync(out, picture);
  const r = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      picture,
      "-i",
      audio,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ac",
      "2",
      "-ar",
      "44100",
      "-shortest",
      "-movflags",
      "+faststart",
      out,
    ],
    { encoding: "utf8" }
  );
  if (r.status !== 0) die((r.stderr || "ffmpeg mux failed").slice(-1500));
  console.error(`MUX=${out}`);
  return out;
}

function flag(argv, name) {
  const eq = argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = argv.indexOf(name);
  if (i >= 0) return argv[i + 1];
  return null;
}

function _print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function isCli() {
  const self = fileURLToPath(import.meta.url);
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return self === invoked;
}

async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv.shift();
  const rest = argv;
  if (cmd === "voices") cmdVoices(rest);
  else if (cmd === "estimate") cmdEstimate(rest);
  else if (cmd === "submit") cmdSubmit(rest);
  else if (cmd === "recover") await cmdRecover(rest);
  else if (cmd === "collect") await cmdCollect(rest);
  else if (cmd === "clone-submit") cmdCloneSubmit(rest);
  else if (cmd === "align") cmdAlign(rest);
  else if (cmd === "mux") cmdMux(rest);
  else if (cmd === "fetch") await cmdFetch(rest);
  else if (cmd === "verify") runMcp(["verify"], { inherit: true });
  else {
    die(
      `usage:
  node ${path.join(skillRoot, "scripts/voice.mjs")} voices [--language zh-CN] [--category cloned]
  node ${path.join(skillRoot, "scripts/voice.mjs")} estimate <outdir>
  node ${path.join(skillRoot, "scripts/voice.mjs")} submit <outdir> --voice <voice_id>
  node ${path.join(skillRoot, "scripts/voice.mjs")} recover <outdir>
  node ${path.join(skillRoot, "scripts/voice.mjs")} collect <outdir>
  node ${path.join(skillRoot, "scripts/voice.mjs")} clone-submit <sample> --name NAME --consent --draft <outdir>
  node ${path.join(skillRoot, "scripts/voice.mjs")} align <outdir>
  node ${path.join(skillRoot, "scripts/voice.mjs")} mux <outdir>
  node ${path.join(skillRoot, "scripts/voice.mjs")} fetch <url> -o <path>`
    );
  }
}

if (isCli()) {
  main().catch((err) => die(err?.stack || String(err)));
}
