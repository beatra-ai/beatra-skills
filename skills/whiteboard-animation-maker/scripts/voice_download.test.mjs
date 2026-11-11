import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { PassThrough, Writable } from "node:stream";
import { test } from "node:test";
import { collectSpeechFiles, download } from "./voice.mjs";

const audioUrl = "https://cdn.example.test/audio.mp3";
const subtitleUrl = "https://cdn.example.test/subtitles.json";

function filesFixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "whiteboard-download-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const dest = path.join(dir, "narration.mp3");
  fs.writeFileSync(dest, "previous valid audio");
  return { dir, dest };
}

// Only in-memory streams stand in for HTTPS. The real downloader still owns
// redirects, response validation, the deadline, file writes, and atomic rename.
function fakeHttps(...steps) {
  const calls = [];
  const requests = [];
  const responses = [];
  const get = (url, options, onResponse) => {
    const step = steps[calls.length];
    calls.push(url);
    const req = new PassThrough();
    requests.push(req);
    queueMicrotask(() => {
      if (req.destroyed) return;
      if (!step) { req.destroy(new Error("unexpected_request")); return; }
      step({
        req, url,
        respond: (statusCode = 200, headers = {}) => {
          const res = new PassThrough();
          res.statusCode = statusCode;
          res.headers = headers;
          res.complete = false;
          responses.push(res);
          res.once("close", () => req.destroy());
          onResponse(res);
          return res;
        },
      });
    });
    return req;
  };
  return { get, calls, requests, responses };
}

const complete = (body) => ({ respond }) => {
  const res = respond();
  res.complete = true;
  res.end(body);
};

const redirect = (location) => ({ respond }) => {
  // No redirect body is needed; the downloader must dispose of this response.
  respond(302, { location });
};

test("a completed response atomically replaces audio after the final byte", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(({ respond }) => {
    const res = respond();
    res.write("new ");
    setImmediate(() => {
      assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
      res.complete = true;
      res.end("audio");
    });
  });
  assert.equal(await download(audioUrl, dest, { get: network.get }), dest);
  assert.equal(fs.readFileSync(dest, "utf8"), "new audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("HTTPS downloads follow up to five relative and absolute redirects", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(
    redirect("../one"),
    redirect("/two"),
    redirect("https://assets.example.test/three"),
    redirect("four"),
    redirect("?version=original"),
    complete("paid audio"),
  );
  await download("https://cdn.example.test/draft/start", dest, { get: network.get });
  assert.deepEqual(network.calls, [
    "https://cdn.example.test/draft/start", "https://cdn.example.test/one", "https://cdn.example.test/two",
    "https://assets.example.test/three", "https://assets.example.test/four", "https://assets.example.test/four?version=original",
  ]);
  assert.equal(fs.readFileSync(dest, "utf8"), "paid audio");
  assert.ok(network.responses.every((res) => res.destroyed));
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("a sixth redirect rejects and preserves previously valid audio", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(...Array.from({ length: 6 }, () => redirect("/again")));
  await assert.rejects(download(audioUrl, dest, { get: network.get }), /download_redirect_limit/);
  assert.equal(network.calls.length, 6);
  assert.ok(network.requests.every((req) => req.destroyed));
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("non-HTTPS sources and redirects are rejected before any insecure request", async (t) => {
  const { dest } = filesFixture(t);
  for (const url of ["http://cdn.example.test/audio.mp3", "ftp://cdn.example.test/audio.mp3", "invalid-url"]) {
    const network = fakeHttps();
    await assert.rejects(download(url, dest, { get: network.get }), /download_requires_https/);
    assert.deepEqual(network.calls, []);
  }
  const network = fakeHttps(redirect("http://cdn.example.test/audio.mp3"));
  await assert.rejects(download(audioUrl, dest, { get: network.get }), /download_requires_https/);
  assert.deepEqual(network.calls, [audioUrl]);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
});

test("an HTTP failure destroys its response and preserves the previous file", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(({ respond }) => respond(503));
  await assert.rejects(download(audioUrl, dest, { get: network.get }), /download_http_status:503/);
  assert.ok(network.responses[0].destroyed);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("a request error rejects without replacing an existing audio file", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(({ req }) => req.destroy(new Error("ECONNRESET")));
  await assert.rejects(download(audioUrl, dest, { get: network.get }), /ECONNRESET/);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("a request that never responds is bounded by the overall deadline", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(() => {});
  await assert.rejects(download(audioUrl, dest, { get: network.get, timeoutMs: 25 }), /download_timeout/);
  assert.ok(network.requests[0].destroyed);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("redirects share one deadline instead of restarting it for each request", async (t) => {
  const { dest } = filesFixture(t);
  const network = fakeHttps(
    ({ req, respond }) => setTimeout(() => { if (!req.destroyed) respond(302, { location: "/final" }); }, 20),
    ({ req, respond }) => setTimeout(() => {
      if (req.destroyed) return;
      const res = respond();
      res.complete = true;
      res.end("too late");
    }, 20),
  );
  await assert.rejects(download(audioUrl, dest, { get: network.get, timeoutMs: 30 }), /download_timeout/);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
});

for (const failure of ["aborted", "reset", "premature_close", "incomplete_end"]) {
  test(`an HTTP 200 ${failure} rejects and removes the partial audio`, async (t) => {
    const { dir, dest } = filesFixture(t);
    const network = fakeHttps(({ req, respond }) => {
      const res = respond();
      res.write("partial audio");
      setImmediate(() => {
        if (failure === "aborted") {
          res.emit("aborted");
          // Multiple late failures must not settle twice or become unhandled.
          req.destroy(new Error("ECONNRESET"));
          res.destroy(new Error("ECONNRESET"));
        } else if (failure === "reset") res.destroy(new Error("ECONNRESET"));
        else if (failure === "incomplete_end") res.end();
        else res.destroy();
      });
    });
    await assert.rejects(download(audioUrl, dest, { get: network.get }));
    assert.ok(network.requests[0].destroyed);
    assert.ok(network.responses[0].destroyed);
    assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
    assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
  });
}

test("a write error rejects and preserves existing audio", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(complete("new audio"));
  await assert.rejects(download(audioUrl, dest, {
    get: network.get,
    createWriteStream: () => new Writable({ write(chunk, encoding, done) { done(new Error("ENOSPC")); } }),
  }), /ENOSPC/);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

test("a write that never completes is bounded by the overall deadline", async (t) => {
  const { dir, dest } = filesFixture(t);
  const network = fakeHttps(complete("new audio"));
  await assert.rejects(download(audioUrl, dest, {
    get: network.get,
    timeoutMs: 25,
    createWriteStream: () => new Writable({ write() {} }),
  }), /download_timeout/);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
});

for (const failure of ["aborted", "reset", "timeout"]) {
  test(`HTTP 200 subtitle ${failure} falls back through the real downloader with paid audio intact`, async (t) => {
    const { dir, dest } = filesFixture(t);
    for (const ext of ["json", "srt", "vtt"]) fs.writeFileSync(path.join(dir, `subtitles.${ext}`), "old cues");
    const network = fakeHttps(complete("paid audio"), ({ respond }) => {
      const res = respond();
      res.write("partial subtitles");
      if (failure !== "timeout") setImmediate(() => {
        if (failure === "aborted") { res.emit("aborted"); res.destroy(); }
        else res.destroy(new Error("ECONNRESET"));
      });
    });
    const result = await collectSpeechFiles({ url: audioUrl, subtitles: { url: subtitleUrl, format: "json" } }, dir, {
      downloadFile: (url, file) => download(url, file, { get: network.get, timeoutMs: 40 }),
    });
    assert.deepEqual(result, { audioPath: dest, subtitlePath: null });
    assert.equal(fs.readFileSync(dest, "utf8"), "paid audio");
    assert.deepEqual(network.calls, [audioUrl, subtitleUrl]);
    assert.deepEqual(fs.readdirSync(dir), ["narration.mp3"]);
  });
}

test("a real audio download failure preserves the existing audio and cues without fetching subtitles", async (t) => {
  const { dir, dest } = filesFixture(t);
  const subtitlePath = path.join(dir, "subtitles.json");
  fs.writeFileSync(subtitlePath, "previous cues");
  const network = fakeHttps(({ respond }) => {
    const res = respond();
    res.write("partial audio");
    setImmediate(() => res.destroy(new Error("ECONNRESET")));
  });
  await assert.rejects(collectSpeechFiles({ url: audioUrl, subtitles: { url: subtitleUrl, format: "json" } }, dir, {
    downloadFile: (url, file) => download(url, file, { get: network.get }),
  }), /ECONNRESET/);
  assert.equal(fs.readFileSync(dest, "utf8"), "previous valid audio");
  assert.equal(fs.readFileSync(subtitlePath, "utf8"), "previous cues");
  assert.deepEqual(network.calls, [audioUrl]);
  assert.deepEqual(fs.readdirSync(dir), ["narration.mp3", "subtitles.json"]);
});
