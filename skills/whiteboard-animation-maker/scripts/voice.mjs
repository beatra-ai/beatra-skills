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
import { fileURLToPath } from "node:url";
import { alignDraft, parseScript, weight } from "./align.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mcpBin = path.join(skillRoot, "scripts/mcp_client.py");

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
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return {};
  }
}

function writeLedger(draft, value) {
  const p = ledgerPath(draft);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, `${JSON.stringify(value, null, 2)}\n`);
}

function inputHash({ input, voice, speed, format, language }) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify({ input, voice, speed, format, language: language || "" }))
    .digest("hex");
}

export function download(url, dest) {
  // Artifact URLs are public CDN addresses; a plain GET needs no MCP client.
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const finish = (err) => (err ? reject(err) : resolve(dest));
    https
      .get(url, { headers: { "User-Agent": "whiteboard-animation-maker/1.0.0" } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(new URL(res.headers.location, url).toString(), dest).then(finish, finish);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`download returned HTTP ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(finish));
        file.on("error", finish);
      })
      .on("error", finish);
  });
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

async function cmdCollect(argv) {
  const outArg = argv.find((a) => !a.startsWith("--"));
  if (!outArg) die("usage: voice.mjs collect <outdir>  (after saving the final tasks.get result as voice/task.json)");
  const draft = path.resolve(outArg);
  const taskPath = path.join(draft, "voice", "task.json");
  if (!fs.existsSync(taskPath)) die(`missing ${taskPath}; save the terminal beatra.tasks.get result there first`);
  const ledger = readLedger(draft);
  if (!ledger.synth) {
    die(
      "no synthesis ledger for this draft. If this is self-supplied audio, copy it to " +
        "voice/narration.mp3 and run `voice.mjs align <outdir>` instead."
    );
  }
  const speech = extractSpeech(JSON.parse(fs.readFileSync(taskPath, "utf-8")));
  if (speech.status !== "succeeded") {
    // Record the terminal failure so a later submit may open a new confirmed
    // request with a new id instead of staying blocked as in-flight.
    writeLedger(draft, {
      ...ledger,
      synth: { ...ledger.synth, task_id: speech.task_id || ledger.synth.task_id, status: "failed" },
    });
    die(`task ended ${speech.status}; see voice/task.json`);
  }
  if (!speech.url) die("task succeeded but returned no audio url");
  if (ledger.synth.task_id && speech.task_id && ledger.synth.task_id !== speech.task_id) {
    die(
      `voice/task.json (task ${speech.task_id}) does not match the ledger's synthesis ` +
        `(task ${ledger.synth.task_id}); save the result of the submitted task, not another one.`
    );
  }

  const voiceDir = path.join(draft, "voice");
  const audioPath = path.join(voiceDir, "narration.mp3");
  await download(speech.url, audioPath);
  if (speech.subtitles?.url) {
    const ext = speech.subtitles.format === "srt" ? "srt" : speech.subtitles.format === "vtt" ? "vtt" : "json";
    await download(speech.subtitles.url, path.join(voiceDir, `subtitles.${ext}`));
  }
  writeLedger(draft, {
    ...ledger,
    synth: {
      ...ledger.synth,
      task_id: speech.task_id || ledger.synth.task_id,
      status: "succeeded",
      duration_seconds: speech.duration,
    },
  });

  const alignment = alignDraft(draft);
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
