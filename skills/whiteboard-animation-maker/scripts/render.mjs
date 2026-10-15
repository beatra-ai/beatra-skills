#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { muxDraft } from "./voice.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

// A silent draft whose only motion is stroke drawing hides every shape at
// load (draw.js prepHidden) and trips hyperframes' static-sweep heuristic,
// which samples bounding boxes and opacity. The sweep never sees a
// dashoffset progress, so check fails with sweep_static alone. Rendering is
// the ground truth for those drafts: warn and continue when that is the ONLY
// error; any other check error still aborts.
function checkDraft(draft) {
  const r = spawnSync(
    "npx",
    ["--yes", "hyperframes@0.8.20", "check", ".", "--json"],
    { cwd: draft, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }
  );
  if (r.status === 0) return;
  let onlySweepStatic = false;
  try {
    const report = JSON.parse((r.stdout || "").trim());
    const sections = [report.lint, report.runtime, report.layout, report.motion, report.contrast].filter(Boolean);
    const errors = sections.flatMap((section) => section.findings || []).filter((f) => f.severity === "error");
    onlySweepStatic = errors.length > 0 && errors.every((f) => f.code === "sweep_static");
  } catch {
    onlySweepStatic = false;
  }
  if (onlySweepStatic) {
    console.error(
      "WARN: hyperframes check reports only sweep_static. Stroke-drawn silent drafts trip this sweep" +
        " (all shapes start hidden; the sweep samples boxes and opacity, never dashoffset progress)." +
        " Continuing to render; the render output is the ground truth."
    );
    return;
  }
  const rerun = spawnSync("npx", ["--yes", "hyperframes@0.8.20", "check", "."], { cwd: draft, stdio: "inherit" });
  if ((rerun.status ?? 1) !== 0) process.exit(rerun.status ?? 1);
}

function ensureSkillDeps() {
  const gsap = path.join(skillRoot, "node_modules/gsap/dist/gsap.min.js");
  const hanzi = path.join(skillRoot, "node_modules/hanzi-writer-data");
  if (!fs.existsSync(gsap) || !fs.existsSync(hanzi)) {
    run("npm", ["install"], skillRoot);
  }
}

const arg = process.argv[2];
const draft = path.resolve(arg ? arg : process.cwd());
if (!fs.existsSync(path.join(draft, "index.html")) || !fs.existsSync(path.join(draft, "hyperframes.json"))) {
  die(
    `usage: node ${path.join(skillRoot, "scripts/render.mjs")} <outdir>\nNeed index.html and hyperframes.json in that directory.`
  );
}

ensureSkillDeps();
fs.mkdirSync(path.join(draft, "assets"), { recursive: true });
fs.copyFileSync(
  path.join(skillRoot, "node_modules/gsap/dist/gsap.min.js"),
  path.join(draft, "assets/gsap.min.js")
);

const html = fs.readFileSync(path.join(draft, "index.html"), "utf8");
const modeFile = ["mode.txt", "mode"].map((name) => path.join(draft, name)).find((p) => fs.existsSync(p));
const mode = modeFile ? fs.readFileSync(modeFile, "utf8").trim() : "";
fs.copyFileSync(path.join(skillRoot, "scripts/scene.js"), path.join(draft, "scene.js"));
fs.copyFileSync(path.join(skillRoot, "scripts/captions.js"), path.join(draft, "captions.js"));
if (mode === "text" || html.includes("draw.js")) {
  fs.copyFileSync(path.join(skillRoot, "scripts/draw.js"), path.join(draft, "draw.js"));
}

checkDraft(draft);
run(
  "npx",
  ["--yes", "hyperframes@0.8.20", "render", ".", "-o", "renders/out.mp4", "-f", "30", "-q", "standard", "--browser-timeout", "120"],
  draft
);
const out = path.join(draft, "renders/out.mp4");
if (fs.existsSync(path.join(draft, "voice/narration.mp3"))) {
  muxDraft(draft);
}
previewFrames(draft, out);
console.log(`OUTPUT=${out}`);

function loadVoice(dir) {
  const p = path.join(dir, "voice.js");
  if (!fs.existsSync(p)) return null;
  const src = fs.readFileSync(p, "utf8");
  const m = src.match(/window\.__voice\s*=\s*(\{[\s\S]*\});?\s*$/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function previewFrames(dir, video) {
  if (!fs.existsSync(video)) return;
  const voice = loadVoice(dir);
  const scenes = voice && Array.isArray(voice.scenes) ? voice.scenes : [];
  const cuts = scenes.length
    ? scenes.map((s) => {
        const start = Number(s.start) || 0;
        const hold = Math.max((Number(s.end) || 0) - start, 0.4);
        return { id: s.id || "s", t: start + hold * 0.85 };
      })
    : [{ id: "mid", t: 1 }];
  const destDir = path.join(dir, "renders/preview");
  fs.mkdirSync(destDir, { recursive: true });
  for (const { id, t } of cuts) {
    const dest = path.join(destDir, `${id}.jpg`);
    const r = spawnSync(
      "ffmpeg",
      ["-y", "-ss", t.toFixed(3), "-i", video, "-frames:v", "1", "-q:v", "3", dest],
      { stdio: "ignore" }
    );
    if (r.status !== 0) console.error(`preview ${id} failed`);
  }
  console.log(`PREVIEW=${destDir}`);
}
