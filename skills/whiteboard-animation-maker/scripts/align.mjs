#!/usr/bin/env node
/**
 * Map spoken script scenes onto audio time, then write voice.js + patch data-duration.
 * Timestamp sources, first match wins: subtitle cues → ffmpeg silence islands → weighted split.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HAN = /[\u3400-\u9fff\uf900-\ufaff]/;
const STRONG_PAUSE = /[。！？!?]/g;
const WEAK_PAUSE = /[，、,;；：:]/g;

export function parseScript(text) {
  const lines = String(text || "").replace(/\r\n/g, "\n").split("\n");
  const scenes = [];
  let current = null;
  let usedHeaders = false;
  const header = /^#\s*(s\d+)\b(?:\s+(.*))?$/i;
  for (const raw of lines) {
    const line = raw.trim();
    const m = line.match(header);
    if (m) {
      usedHeaders = true;
      current = { id: m[1].toLowerCase(), text: "", lines: [] };
      scenes.push(current);
      continue;
    }
    if (!line) {
      if (current && current.text && !usedHeaders) current = null;
      continue;
    }
    if (!current) {
      current = { id: `s${scenes.length + 1}`, text: "", lines: [] };
      scenes.push(current);
    }
    current.lines.push(line);
    current.text = current.lines.join("");
  }
  return scenes.filter((s) => s.text);
}

export function htmlSceneIds(html) {
  const ids = [];
  const re = /<(?:section|div)[^>]*\bid=["'](s\d+)["'][^>]*>/gi;
  let m;
  while ((m = re.exec(html))) ids.push(m[1].toLowerCase());
  return [...new Set(ids)];
}

export function parseDurationAttr(html) {
  const m = String(html).match(/data-duration=["']([\d.]+)["']/);
  return m ? Number(m[1]) : null;
}

export function patchDuration(html, duration) {
  const value = round(duration);
  if (/data-duration=["'][\d.]+["']/.test(html)) {
    return html.replace(/data-duration=["'][\d.]+["']/, `data-duration="${value}"`);
  }
  return html.replace(
    /(<div id="root"[^>]*)(>)/,
    `$1 data-duration="${value}"$2`
  );
}

export function weight(text) {
  let w = 0;
  for (const ch of String(text)) {
    if (/\s/.test(ch)) continue;
    w += HAN.test(ch) ? 2 : 1;
  }
  return Math.max(w, 1);
}

export function pauseBonus(text) {
  const strong = (String(text).match(STRONG_PAUSE) || []).length * 0.35;
  const weak = (String(text).match(WEAK_PAUSE) || []).length * 0.12;
  return strong + weak;
}

export function round(n) {
  return Math.round(Number(n) * 1000) / 1000;
}

function norm(text) {
  return String(text).replace(/\s+/g, "").replace(/[“”"'\s]/g, "");
}

export function parseCues(raw, format = "") {
  if (raw == null || raw === "") return [];
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (format === "srt" || /^\d+\s*\n\d{2}:/.test(trimmed) || trimmed.includes(" --> ")) {
      if (trimmed.startsWith("WEBVTT") || format === "vtt") return parseVtt(trimmed);
      if (trimmed.includes(" --> ")) return parseSrt(trimmed);
    }
    try {
      return parseCues(JSON.parse(trimmed), format || "json");
    } catch {
      return [];
    }
  }
  if (Array.isArray(raw)) return raw.map(normalizeCue).filter(Boolean);
  if (typeof raw === "object") {
    if (Array.isArray(raw.subtitle)) return parseCues(raw.subtitle, format);
    if (Array.isArray(raw.cues)) return parseCues(raw.cues, format);
    if (Array.isArray(raw.words)) return parseCues(raw.words, format);
    if (Array.isArray(raw.data)) return parseCues(raw.data, format);
  }
  return [];
}

function asSeconds(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 50 ? value / 1000 : value;
  }
  if (typeof value === "string" && value.includes(":")) return clockToSec(value);
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return n > 50 ? n / 1000 : n;
}

function normalizeCue(item) {
  if (!item || typeof item !== "object") return null;
  const text = item.text ?? item.word ?? item.content ?? "";
  const start = asSeconds(item.start ?? item.time_begin ?? item.begin ?? item.ts);
  const end = asSeconds(item.end ?? item.time_end ?? item.stop ?? item.te);
  if (!text || start == null || end == null) return null;
  return { start, end, text: String(text) };
}

function clockToSec(value) {
  const m = String(value).trim().match(/(?:(\d+):)?(\d+):(\d+)[.,](\d+)/);
  if (!m) return null;
  const h = Number(m[1] || 0);
  const min = Number(m[2]);
  const s = Number(m[3]);
  const frac = Number(`0.${m[4]}`);
  return h * 3600 + min * 60 + s + frac;
}

export function parseSrt(text) {
  const blocks = String(text).replace(/\r\n/g, "\n").split(/\n{2,}/);
  const cues = [];
  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 2) continue;
    const timeLine = lines.find((l) => l.includes("-->"));
    if (!timeLine) continue;
    const [a, b] = timeLine.split("-->").map((s) => s.trim());
    const start = clockToSec(a);
    const end = clockToSec(b);
    const content = lines.filter((l) => l !== timeLine && !/^\d+$/.test(l)).join("");
    if (start == null || end == null || !content) continue;
    cues.push({ start, end, text: content });
  }
  return cues;
}

export function parseVtt(text) {
  return parseSrt(String(text).replace(/^WEBVTT[^\n]*\n/, ""));
}

export function parseSilencedetect(stderr) {
  const starts = [];
  const ends = [];
  for (const line of String(stderr).split(/\n/)) {
    const s = line.match(/silence_start:\s*([\d.]+)/);
    const e = line.match(/silence_end:\s*([\d.]+)/);
    if (s) starts.push(Number(s[1]));
    if (e) ends.push(Number(e[1]));
  }
  return { starts, ends };
}

export function speechIslands(duration, silence, minLen = 0.18) {
  const events = [];
  const n = Math.max(silence.starts.length, silence.ends.length);
  for (let i = 0; i < n; i++) {
    const start = silence.starts[i];
    const end = silence.ends[i] ?? duration;
    if (start != null) events.push({ start, end: Math.min(end, duration) });
  }
  events.sort((a, b) => a.start - b.start);
  const islands = [];
  let t = 0;
  for (const sil of events) {
    if (sil.start - t >= minLen) islands.push({ start: t, end: sil.start });
    t = Math.max(t, sil.end);
  }
  if (duration - t >= minLen) islands.push({ start: t, end: duration });
  return islands;
}

export function weightedSplit(scenes, duration) {
  const pauses = scenes.map((s) => pauseBonus(s.text));
  const weights = scenes.map((s) => weight(s.text));
  const pauseSum = pauses.reduce((a, b) => a + b, 0);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  let variable = duration - pauseSum;
  const usePause = variable >= scenes.length * 0.45;
  if (!usePause) variable = duration;
  const out = [];
  let t = 0;
  scenes.forEach((scene, i) => {
    const last = i === scenes.length - 1;
    const span = last
      ? duration - t
      : (usePause ? pauses[i] : 0) + variable * (weights[i] / weightSum);
    const end = last ? duration : t + Math.max(span, 0.35);
    out.push({ id: scene.id, text: scene.text, start: round(t), end: round(end), source: "weighted" });
    t = end;
  });
  return out;
}

export function matchCues(scenes, cues) {
  if (!cues.length) return null;
  const sceneNorm = scenes.map((s) => ({ id: s.id, text: s.text, n: norm(s.text) }));
  const cueNorm = cues.map((c) => ({ ...c, n: norm(c.text) }));
  const scriptJoined = sceneNorm.map((s) => s.n).join("");
  const cueJoined = cueNorm.map((c) => c.n).join("");
  if (!scriptJoined || cueJoined.length < scriptJoined.length * 0.5) return null;

  const ranges = [];
  let off = 0;
  for (const s of sceneNorm) {
    ranges.push({ id: s.id, text: s.text, start: off, end: off + s.n.length });
    off += s.n.length;
  }
  const cueRanges = [];
  let cOff = 0;
  for (const c of cueNorm) {
    cueRanges.push({ start: cOff, end: cOff + c.n.length, t0: c.start, t1: c.end });
    cOff += c.n.length;
  }
  const mapped = ranges.map((r) => {
    const covering = cueRanges.filter((c) => c.end > r.start && c.start < r.end);
    if (!covering.length) return null;
    return {
      id: r.id,
      text: r.text,
      start: covering[0].t0,
      end: covering[covering.length - 1].t1,
      source: "cues",
    };
  });
  if (mapped.some((m) => !m)) return null;
  return mapped;
}

export function snapToIslands(scenes, islands) {
  islands = (islands || []).filter((i) => i.end - i.start >= 1.2);
  // Extra pauses inside a sentence are not extra scenes. Only 1:1 islands
  // may drive windows; otherwise weighted split + boundary snap.
  if (islands.length !== scenes.length) return null;
  const picked = islands;
  return scenes.map((scene, i) => ({
    id: scene.id,
    text: scene.text,
    start: round(picked[i].start),
    end: round(picked[i].end),
    source: "silence",
  }));
}

export function snapBoundaries(aligned, islands, slack = 0.4) {
  if (!islands.length) return aligned;
  const edges = [];
  for (const island of islands) {
    edges.push(island.start, island.end);
  }
  return aligned.map((scene, i) => {
    if (i === 0) return scene;
    const target = scene.start;
    let best = target;
    let dist = slack + 1;
    for (const edge of edges) {
      const d = Math.abs(edge - target);
      if (d < dist) {
        dist = d;
        best = edge;
      }
    }
    if (dist <= slack) {
      const prev = aligned[i - 1];
      prev.end = round(best);
      scene.start = round(best);
    }
    return scene;
  });
}

export function stitch(aligned, duration) {
  if (!aligned.length) return aligned;
  aligned[0].start = 0;
  for (let i = 1; i < aligned.length; i++) {
    const mid = round((aligned[i - 1].end + aligned[i].start) / 2);
    aligned[i - 1].end = mid;
    aligned[i].start = mid;
  }
  aligned[aligned.length - 1].end = round(duration);
  for (const scene of aligned) {
    if (scene.end - scene.start < 0.3) scene.end = round(scene.start + 0.3);
  }
  aligned[aligned.length - 1].end = round(Math.max(aligned[aligned.length - 1].end, duration));
  return aligned;
}

export function alignScenes({ scenes, duration, cues = [], islands = [] }) {
  if (!scenes.length) throw new Error("no spoken scenes");
  if (!(duration > 0)) throw new Error("audio duration must be > 0");
  let aligned = matchCues(scenes, cues);
  let method = aligned ? "cues" : null;
  if (!aligned) {
    aligned = snapToIslands(scenes, islands);
    method = aligned ? "silence" : null;
  }
  if (!aligned) {
    aligned = weightedSplit(scenes, duration);
    method = "weighted";
    aligned = snapBoundaries(aligned, islands);
  }
  aligned = stitch(aligned, duration);
  return { duration: round(duration), method, scenes: aligned };
}

export const MAX_CAPTION_CHARS = 18;

function visibleLen(text) {
  return [...String(text).replace(/\s/g, "")].length;
}

export function splitCaptionLines(text, maxChars = MAX_CAPTION_CHARS) {
  const source = String(text || "").replace(/\r\n/g, "\n");
  const pieces = source
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks = [];
  for (const piece of pieces.length ? pieces : [source.trim()].filter(Boolean)) {
    pushCaptionSplit(piece, maxChars, chunks);
  }
  return chunks.length ? chunks : source.trim() ? [source.trim()] : [];
}

function pushCaptionSplit(piece, maxChars, chunks) {
  if (visibleLen(piece) <= maxChars) {
    chunks.push(piece);
    return;
  }
  const byStrong = piece.split(/(?<=[。！？!?])/).map((s) => s.trim()).filter(Boolean);
  if (byStrong.length > 1) {
    for (const part of byStrong) pushCaptionSplit(part, maxChars, chunks);
    return;
  }
  const byWeak = piece.split(/(?<=[，、,;；：:])/).map((s) => s.trim()).filter(Boolean);
  if (byWeak.length > 1) {
    let buf = "";
    for (const part of byWeak) {
      if (buf && visibleLen(buf + part) > maxChars) {
        chunks.push(buf);
        buf = part;
      } else {
        buf += part;
      }
    }
    if (buf) chunks.push(buf);
    return;
  }
  const chars = [...piece];
  for (let i = 0; i < chars.length; i += maxChars) {
    chunks.push(chars.slice(i, i + maxChars).join(""));
  }
}

export function buildCaptionCues(scenes, { linesById = {}, wordCues = [], islands = [] } = {}) {
  const parts = [];
  for (const scene of scenes) {
    const raw = linesById[scene.id];
    const source = Array.isArray(raw) && raw.length ? raw.join("\n") : scene.text;
    const lines = splitCaptionLines(source);
    lines.forEach((text, i) => {
      parts.push({ id: `${scene.id}-${i}`, scene: scene.id, text });
    });
  }
  if (!parts.length) return [];

  let timed = matchCues(parts, wordCues);
  if (timed) {
    timed = timed.map((row, i) => ({
      id: parts[i].id,
      scene: parts[i].scene,
      text: parts[i].text,
      start: row.start,
      end: row.end,
      source: "cues",
    }));
  } else {
    timed = [];
    const byScene = new Map();
    for (const part of parts) {
      if (!byScene.has(part.scene)) byScene.set(part.scene, []);
      byScene.get(part.scene).push(part);
    }
    for (const scene of scenes) {
      const sceneParts = byScene.get(scene.id) || [];
      if (!sceneParts.length) continue;
      const span = Math.max(scene.end - scene.start, 0.35);
      const split = weightedSplit(sceneParts, span);
      for (const row of split) {
        timed.push({
          id: row.id,
          scene: scene.id,
          text: row.text,
          start: round(scene.start + row.start),
          end: round(scene.start + row.end),
          source: "weighted",
        });
      }
    }
  }

  timed = snapBoundaries(timed, islands, 0.28);
  if (scenes.length) {
    timed = stitch(timed, scenes[scenes.length - 1].end);
  }
  return timed.map((row) => ({
    id: row.id,
    scene: row.scene || String(row.id).split("-")[0],
    text: row.text,
    start: row.start,
    end: row.end,
  }));
}

export function emitVoiceJs(alignment) {
  const payload = {
    duration: alignment.duration,
    method: alignment.method,
    audio: "voice/narration.mp3",
    scenes: alignment.scenes.map((s) => ({
      id: s.id,
      start: s.start,
      end: s.end,
      text: s.text,
    })),
    cues: (alignment.cues || []).map((c) => ({
      id: c.id,
      scene: c.scene,
      start: c.start,
      end: c.end,
      text: c.text,
    })),
  };
  return `window.__voice = ${JSON.stringify(payload, null, 2)};\n`;
}

export function probeDuration(file) {
  const r = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file],
    { encoding: "utf8" }
  );
  if (r.status !== 0) return null;
  const n = Number(String(r.stdout).trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function detectSilence(file) {
  const r = spawnSync(
    "ffmpeg",
    ["-i", file, "-af", "silencedetect=noise=-32dB:d=0.22", "-f", "null", "-"],
    { encoding: "utf8" }
  );
  const stderr = `${r.stderr || ""}${r.stdout || ""}`;
  return parseSilencedetect(stderr);
}

function readFirst(dir, names) {
  for (const name of names) {
    const p = path.join(dir, name);
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export function alignDraft(draft, { duration = null, audio = null } = {}) {
  const htmlPath = path.join(draft, "index.html");
  const scriptPath = path.join(draft, "script.txt");
  if (!fs.existsSync(htmlPath)) throw new Error(`missing ${htmlPath}`);
  if (!fs.existsSync(scriptPath)) throw new Error(`missing ${scriptPath}`);
  const html = fs.readFileSync(htmlPath, "utf8");
  const ids = htmlSceneIds(html);
  let scenes = parseScript(fs.readFileSync(scriptPath, "utf8"));
  if (ids.length && scenes.length && scenes.length !== ids.length) {
    throw new Error(
      `script.txt has ${scenes.length} scenes (${scenes.map((s) => s.id).join(",")}) but index.html has ${ids.length} (${ids.join(",")})`
    );
  }
  if (ids.length && !scenes.length) {
    throw new Error("script.txt has no spoken lines");
  }
  if (ids.length) {
    scenes = scenes.map((s, i) => ({ ...s, id: ids[i] || s.id }));
  }

  const voiceDir = path.join(draft, "voice");
  const audioPath =
    audio ||
    readFirst(voiceDir, ["narration.mp3", "narration.wav", "narration.m4a", "narration.flac"]);
  const taskPath = path.join(voiceDir, "task.json");
  let taskDuration = null;
  if (fs.existsSync(taskPath)) {
    try {
      const task = JSON.parse(fs.readFileSync(taskPath, "utf8"));
      taskDuration = Number(task.duration_seconds || task.audio?.duration_seconds || 0) || null;
    } catch {
      taskDuration = null;
    }
  }
  const probed = audioPath ? probeDuration(audioPath) : null;
  const dur = duration || probed || taskDuration;
  if (!(dur > 0)) throw new Error("need audio duration (ffprobe, task.json, or --duration)");

  let cues = [];
  const subPath = readFirst(voiceDir, ["subtitles.json", "subtitles.srt", "subtitles.vtt"]);
  if (subPath) {
    const raw = fs.readFileSync(subPath, "utf8");
    const ext = path.extname(subPath).slice(1);
    cues = parseCues(raw, ext);
  }

  let islands = [];
  if (audioPath) {
    try {
      islands = speechIslands(dur, detectSilence(audioPath));
    } catch {
      islands = [];
    }
  }

  const alignment = alignScenes({ scenes, duration: dur, cues, islands });
  const linesById = Object.fromEntries(scenes.map((s) => [s.id, s.lines || []]));
  alignment.cues = buildCaptionCues(alignment.scenes, {
    linesById,
    wordCues: cues,
    islands,
  });
  fs.mkdirSync(voiceDir, { recursive: true });
  fs.writeFileSync(path.join(voiceDir, "alignment.json"), `${JSON.stringify(alignment, null, 2)}\n`);
  fs.writeFileSync(path.join(draft, "voice.js"), emitVoiceJs(alignment));
  fs.writeFileSync(htmlPath, patchDuration(html, alignment.duration + 0.35));
  return alignment;
}

function isCli() {
  const self = fileURLToPath(import.meta.url);
  const invoked = process.argv[1] ? path.resolve(process.argv[1]) : "";
  return self === invoked;
}

if (isCli()) {
  const argv = process.argv.slice(2);
  const durationFlag = argv.find((a) => a.startsWith("--duration="));
  const durationIdx = argv.indexOf("--duration");
  const duration = durationFlag
    ? Number(durationFlag.split("=")[1])
    : durationIdx >= 0
      ? Number(argv[durationIdx + 1])
      : null;
  const skip = new Set();
  if (durationIdx >= 0) {
    skip.add(durationIdx);
    skip.add(durationIdx + 1);
  }
  const draftArg = argv.find((a, i) => !skip.has(i) && !a.startsWith("--"));
  const draft = path.resolve(draftArg || process.cwd());
  try {
    const alignment = alignDraft(draft, { duration: duration > 0 ? duration : null });
    console.log(`aligned ${alignment.scenes.length} scenes via ${alignment.method}  duration=${alignment.duration}s`);
    for (const s of alignment.scenes) {
      console.log(`  ${s.id}  ${s.start.toFixed(2)}–${s.end.toFixed(2)}  ${s.text.slice(0, 24)}`);
    }
  } catch (err) {
    console.error(String(err.message || err));
    process.exit(1);
  }
}
