import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { alignScenes } from "./align.mjs";
import { cmdCollect, collectedLedger, collectSpeechFiles, recoverDraft } from "./voice.mjs";

const voiceDir = path.join("draft", "voice");
const audioPath = path.join(voiceDir, "narration.mp3");
const speech = { url: "https://cdn.example.test/audio.mp3", subtitles: { url: "https://cdn.example.test/subtitles.json", format: "json" } };

for (const status of [null, undefined, "unknown", "submitted", "queued", "running"]) {
  test(`collecting ${status} preserves the existing paid request identity and submit guard`, () => {
    for (const previous of ["submitting", "submitted", "answer_unclear"]) {
      const ledger = { synth: { status: previous, client_request_id: "original-paid-request", task_id: "original-task", input_sha256: "original-input", payload: { input: "你好", voice: "v" } } };
      const result = collectedLedger(ledger, { status, task_id: "original-task" });
      assert.strictEqual(result, ledger);
      assert.deepEqual(result.synth, ledger.synth);
    }
  });
}

for (const status of ["failed", "canceled"]) {
  test(`a confirmed ${status} task permits a later confirmed request without replacing the recorded identity`, () => {
    const ledger = { synth: { status: "submitted", client_request_id: "original-paid-request", task_id: "original-task", payload: { input: "你好" } } };
    const result = collectedLedger(ledger, { status, task_id: "original-task" });
    assert.deepEqual(result, { ...ledger, synth: { ...ledger.synth, status: "failed" } });
    assert.equal(ledger.synth.status, "submitted");
  });
}

test("a foreign terminal task cannot release this draft's in-flight identity", () => {
  const ledger = { synth: { status: "submitted", client_request_id: "original-paid-request", task_id: "original-task" } };
  for (const status of ["succeeded", "failed", "canceled"]) {
    assert.strictEqual(collectedLedger(ledger, { status, task_id: "another-task" }), ledger);
  }
});

test("a terminal answer without a task identity cannot release the existing paid request", () => {
  for (const taskId of [null, "original-task"]) {
    const ledger = { synth: { status: "answer_unclear", client_request_id: "original-paid-request", task_id: taskId } };
    for (const status of ["succeeded", "failed", "canceled"]) {
      assert.strictEqual(collectedLedger(ledger, { status, task_id: null }), ledger);
    }
  }
});

test("an unknown synthesis task cannot adopt any terminal answer", () => {
  for (const taskId of [null, undefined, "", " ", 7]) {
    const ledger = { synth: { status: "answer_unclear", client_request_id: "original-paid-request", task_id: taskId } };
    for (const status of ["succeeded", "failed", "canceled"]) {
      assert.strictEqual(collectedLedger(ledger, { status, task_id: "unproven-task" }), ledger);
    }
  }
});

function draftFixture(t, ledger) {
  const draft = fs.mkdtempSync(path.join(os.tmpdir(), "whiteboard-voice-"));
  t.after(() => fs.rmSync(draft, { recursive: true, force: true }));
  const voice = path.join(draft, "voice");
  fs.mkdirSync(voice);
  const ledgerPath = path.join(voice, "ledger.json");
  const save = (value) => fs.writeFileSync(ledgerPath, JSON.stringify(value));
  save(ledger);
  return { draft, voice, ledgerPath, save, read: () => JSON.parse(fs.readFileSync(ledgerPath, "utf8")) };
}

test("collection rejects missing or foreign identities before downloads or ledger writes", async (t) => {
  const fixture = draftFixture(t, {});
  let downloads = 0;
  const collectFiles = async () => { downloads++; throw new Error("collection reached download"); };
  for (const knownId of [null, undefined, "", " ", 7, "original-task"]) {
    for (const resultId of [null, undefined, "", " ", 7, "foreign-task", "original-task"]) {
      if (knownId === "original-task" && resultId === knownId) continue;
      for (const status of ["succeeded", "failed", "canceled", "running"]) {
        fixture.save({ synth: { task_id: knownId, status: "answer_unclear", client_request_id: "paid-request" } });
        const before = fs.readFileSync(fixture.ledgerPath, "utf8");
        fs.writeFileSync(path.join(fixture.voice, "task.json"), JSON.stringify({
          structuredContent: { task_id: resultId, status, output: { audio: { url: speech.url } } },
        }));
        await assert.rejects(cmdCollect([fixture.draft], { collectFiles }), /Cannot collect this result:/);
        assert.equal(fs.readFileSync(fixture.ledgerPath, "utf8"), before);
      }
    }
  }
  assert.equal(downloads, 0);
});

function pendingLedger(status = "submitting") {
  return {
    synth: {
      task_id: null,
      status,
      client_request_id: "original-paid-request",
      input_sha256: "original-input",
      payload: { voice: "opaque-voice", input: "你好，世界！", model: "auto", language: "zh-CN", format: "mp3", speed: 1.2, volume: 1, pitch: 0, client_request_id: "original-paid-request" },
    },
    clone: { task_id: "clone-task", client_request_id: "clone-request" },
  };
}

for (const status of ["submitting", "answer_unclear"]) {
  test(`recovery replays the exact ${status} request once under its original identity`, async (t) => {
    const ledger = pendingLedger(status);
    const fixture = draftFixture(t, ledger);
    // A terminal file and an edited narration cannot establish ownership or alter the replay.
    fs.writeFileSync(path.join(fixture.voice, "task.json"), JSON.stringify({ task_id: "unproven-task", status: "succeeded" }));
    fs.writeFileSync(path.join(fixture.draft, "script.txt"), "edited narration");
    const calls = [];
    const result = await recoverDraft(fixture.draft, { callTool: (name, payload) => {
      calls.push({ name, payload });
      return { structuredContent: { task: { task_id: "original-task" } } };
    } });
    assert.deepEqual(calls, [{ name: "beatra.speech.synthesize", payload: ledger.synth.payload }]);
    assert.deepEqual(result, { task_id: "original-task", client_request_id: ledger.synth.client_request_id });
    assert.deepEqual(fixture.read(), { ...ledger, synth: { ...ledger.synth, task_id: "original-task", status: "submitted" } });
    const before = fs.readFileSync(fixture.ledgerPath, "utf8");
    const again = await recoverDraft(fixture.draft, { callTool: () => { throw new Error("unexpected second call"); } });
    assert.deepEqual(again, result);
    assert.equal(fs.readFileSync(fixture.ledgerPath, "utf8"), before);
  });
}

test("a known task is returned with its original request id without tools or writes", async (t) => {
  const fixture = draftFixture(t, {});
  for (const status of ["submitting", "answer_unclear", "submitted", "succeeded", "failed"]) {
    fixture.save({ synth: { task_id: "known-task", client_request_id: "original-request", status } });
    const before = fs.readFileSync(fixture.ledgerPath, "utf8");
    assert.deepEqual(await recoverDraft(fixture.draft, { callTool: () => { throw new Error("unexpected replay"); } }), {
      task_id: "known-task", client_request_id: "original-request",
    });
    assert.equal(fs.readFileSync(fixture.ledgerPath, "utf8"), before);
  }
});

test("recovery rejects an incomplete request or a state that is not a lost submission", async (t) => {
  const fixture = draftFixture(t, {});
  const { synth } = pendingLedger();
  const cases = [
    {}, { synth: null },
    ...["submitted", "succeeded", "failed", "canceled", "queued", "running", null].map((status) => ({ synth: { ...synth, status } })),
    ...[null, undefined, "", " ", 7].map((client_request_id) => ({ synth: { ...synth, client_request_id } })),
    ...[null, undefined, [], "payload"].map((payload) => ({ synth: { ...synth, payload } })),
    ...[null, undefined, "another-request"].map((client_request_id) => ({ synth: { ...synth, payload: { ...synth.payload, client_request_id } } })),
    { synth: { ...synth, task_id: 7 } },
    { synth: { ...synth, task_id: " " } },
  ];
  for (const ledger of cases) {
    fixture.save(ledger);
    const before = fs.readFileSync(fixture.ledgerPath, "utf8");
    await assert.rejects(recoverDraft(fixture.draft, { callTool: () => { throw new Error("unexpected replay"); } }), /Cannot recover:/);
    assert.equal(fs.readFileSync(fixture.ledgerPath, "utf8"), before);
  }
});

test("an unreadable ledger cannot trigger recovery or be rewritten", async (t) => {
  const fixture = draftFixture(t, {});
  for (const saved of ["null", "[]", "7", '"not a ledger"', "{partial"]) {
    fs.writeFileSync(fixture.ledgerPath, saved);
    await assert.rejects(recoverDraft(fixture.draft, { callTool: () => { throw new Error("unexpected replay"); } }), /Cannot recover:/);
    assert.equal(fs.readFileSync(fixture.ledgerPath, "utf8"), saved);
  }
});

test("a replay without a task id remains guarded and retains the complete saved request", async (t) => {
  const fixture = draftFixture(t, {});
  for (const response of [null, {}, { structuredContent: {} }, { task_id: "" }, { task_id: 7 }]) {
    const ledger = pendingLedger();
    fixture.save(ledger);
    let calls = 0;
    await assert.rejects(recoverDraft(fixture.draft, { callTool: () => { calls++; return response; } }), /The synthesis response still has no task id\./);
    assert.equal(calls, 1);
    assert.deepEqual(fixture.read(), { ...ledger, synth: { ...ledger.synth, status: "answer_unclear" } });
  }
});

test("an ambiguous replay failure makes no additional call and preserves the submit guard", async (t) => {
  const ledger = pendingLedger();
  const fixture = draftFixture(t, ledger);
  let calls = 0;
  await assert.rejects(recoverDraft(fixture.draft, { callTool: () => { calls++; throw new Error("response lost"); } }), /response lost/);
  assert.equal(calls, 1);
  assert.deepEqual(fixture.read(), ledger);
});

test("a replay response cannot be attached to a replaced synthesis request", async (t) => {
  const fixture = draftFixture(t, pendingLedger());
  const replacement = pendingLedger();
  replacement.synth.client_request_id = "replacement-request";
  replacement.synth.payload.client_request_id = "replacement-request";
  await assert.rejects(recoverDraft(fixture.draft, { callTool: () => {
    fixture.save(replacement);
    return { task_id: "original-task" };
  } }), /Cannot recover:/);
  assert.deepEqual(fixture.read(), replacement);
});

test("recovery preserves updates outside the original synthesis request", async (t) => {
  const ledger = pendingLedger();
  const fixture = draftFixture(t, ledger);
  const updated = { ...ledger, clone: { ...ledger.clone, status: "succeeded" } };
  await recoverDraft(fixture.draft, { callTool: () => {
    fixture.save(updated);
    return { task_id: "original-task" };
  } });
  assert.deepEqual(fixture.read(), { ...updated, synth: { ...ledger.synth, status: "submitted", task_id: "original-task" } });
});

test("the recover CLI returns a known identity without invoking the bundled client", (t) => {
  const ledger = pendingLedger("submitted");
  ledger.synth.task_id = "known-task";
  const fixture = draftFixture(t, ledger);
  const cli = fileURLToPath(new URL("./voice.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [cli, "recover", fixture.draft], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { task_id: "known-task", client_request_id: ledger.synth.client_request_id });
  for (const args of [[], [fixture.draft, "arbitrary-task.json"]]) {
    const invalid = spawnSync(process.execPath, [cli, "recover", ...args], { encoding: "utf8" });
    assert.equal(invalid.status, 1);
    assert.match(invalid.stderr, /usage: voice\.mjs recover <outdir>/);
  }
});

test("a collected success records its duration under the original paid identity", () => {
  const ledger = { synth: { status: "submitted", client_request_id: "original-paid-request", task_id: "original-task", payload: { input: "你好" } }, clone: { task_id: "clone-task" } };
  assert.deepEqual(collectedLedger(ledger, { status: "succeeded", task_id: "original-task", duration: 4.2 }), {
    ...ledger,
    synth: { ...ledger.synth, status: "succeeded", duration_seconds: 4.2 },
  });
});

test("a failed subtitle download preserves audio and falls back without another fetch", async () => {
  const files = new Map(["json", "srt", "vtt"].map((ext) => [path.join(voiceDir, `subtitles.${ext}`), "old subtitles"]));
  const calls = [];
  const result = await collectSpeechFiles(speech, voiceDir, {
    downloadFile: async (url, dest) => {
      calls.push(url);
      if (url === speech.subtitles.url) {
        files.set(dest, "partial response");
        throw new Error("download returned HTTP 503");
      }
      files.set(dest, "paid audio");
    },
    removeFile: (file) => files.delete(file),
  });
  assert.deepEqual(result, { audioPath, subtitlePath: null });
  assert.deepEqual(calls, [speech.url, speech.subtitles.url]);
  assert.deepEqual([...files], [[audioPath, "paid audio"]]);
  const alignment = alignScenes({ scenes: [{ id: "s1", text: "你好" }, { id: "s2", text: "世界" }], duration: 4 });
  assert.equal(alignment.method, "weighted");
  assert.equal(alignment.scenes[alignment.scenes.length - 1].end, 4);
});

test("missing subtitles clear another take's cues and keep the audio", async () => {
  const removed = [];
  const calls = [];
  const result = await collectSpeechFiles({ url: speech.url }, voiceDir, {
    downloadFile: async (url) => calls.push(url),
    removeFile: (file) => removed.push(file),
  });
  assert.deepEqual(result, { audioPath, subtitlePath: null });
  assert.deepEqual(calls, [speech.url]);
  assert.deepEqual(removed, ["json", "srt", "vtt"].map((ext) => path.join(voiceDir, `subtitles.${ext}`)));
});

for (const format of ["json", "srt", "vtt"]) {
  test(`successful ${format} subtitles are passed to alignment`, async () => {
    const calls = [];
    const result = await collectSpeechFiles({ ...speech, subtitles: { ...speech.subtitles, format } }, voiceDir, {
      downloadFile: async (url, dest) => calls.push({ url, dest }),
      removeFile: () => {},
    });
    assert.deepEqual(result, { audioPath, subtitlePath: path.join(voiceDir, `subtitles.${format}`) });
    assert.deepEqual(calls, [{ url: speech.url, dest: audioPath }, { url: speech.subtitles.url, dest: result.subtitlePath }]);
  });
}

test("an audio download failure still fails and leaves existing cues alone", async () => {
  const calls = [];
  const removed = [];
  await assert.rejects(collectSpeechFiles(speech, voiceDir, {
    downloadFile: async (url) => { calls.push(url); throw new Error("audio unavailable"); },
    removeFile: (file) => removed.push(file),
  }), /audio unavailable/);
  assert.deepEqual(calls, [speech.url]);
  assert.deepEqual(removed, []);
});

test("subtitle cleanup failures still select alignment without a subtitle file", async () => {
  const result = await collectSpeechFiles(speech, voiceDir, {
    downloadFile: async (url) => { if (url === speech.subtitles.url) throw new Error("subtitle unavailable"); },
    removeFile: () => { throw new Error("read only"); },
  });
  assert.deepEqual(result, { audioPath, subtitlePath: null });
});
