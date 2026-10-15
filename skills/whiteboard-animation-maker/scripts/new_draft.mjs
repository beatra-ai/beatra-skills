#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function die(msg) {
  console.error(msg);
  process.exit(1);
}

const args = process.argv.slice(2);
const outArg = args.find((a) => !a.startsWith("--"));
const modeFlag = args.find((a) => a.startsWith("--mode=")) || "";
const mode = modeFlag.replace("--mode=", "") || (args.includes("--mode") ? args[args.indexOf("--mode") + 1] : "");

if (!outArg || (mode !== "text" && mode !== "program")) {
  die(`usage: node ${path.join(skillRoot, "scripts/new_draft.mjs")} <outdir> --mode text|program`);
}

const dest = path.resolve(outArg);
if (fs.existsSync(dest)) die(`already exists: ${dest}`);

if (!fs.existsSync(path.join(skillRoot, "node_modules/gsap/dist/gsap.min.js"))) {
  const r = spawnSync("npm", ["install"], { cwd: skillRoot, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const slug = path.basename(dest);
fs.cpSync(path.join(skillRoot, "templates", mode), dest, { recursive: true });
fs.writeFileSync(path.join(dest, "mode.txt"), `${mode}\n`);
fs.copyFileSync(path.join(skillRoot, "scripts/scene.js"), path.join(dest, "scene.js"));
fs.copyFileSync(path.join(skillRoot, "scripts/captions.js"), path.join(dest, "captions.js"));
if (mode === "text") {
  fs.copyFileSync(path.join(skillRoot, "scripts/draw.js"), path.join(dest, "draw.js"));
}

fs.writeFileSync(
  path.join(dest, "DESIGN.md"),
  `# ${slug}

Mode: ${mode}

## Direction

- Concept:
- One takeaway:
- Angle:
- Duration:
- Voiceover:

## Storyboard

| Scene | ~sec | Narration | On-screen word | Object | Motion |
|---|---|---|---|---|---|
| s1 |  |  |  |  |  |
`
);
fs.writeFileSync(
  path.join(dest, "script.txt"),
  `# s1\n\n`
);
fs.writeFileSync(path.join(dest, "note.md"), `# ${slug}\n\nMode: ${mode}\nFilm: renders/out.mp4\n`);

const textBin = path.join(skillRoot, "scripts/text_svg.py");
const renderBin = path.join(skillRoot, "scripts/render.mjs");
const voiceBin = path.join(skillRoot, "scripts/voice.mjs");
console.log(`created ${dest} (${mode})`);
console.log(`edit ${path.join(dest, "index.html")}`);
console.log(`edit ${path.join(dest, "script.txt")}  (one # sN block per scene)`);
if (mode === "text") {
  console.log(`stroke words: python3 ${textBin} '目标' --id id --cx 540 --cy 280 --size 80`);
}
console.log(`voices: node ${voiceBin} voices --language zh-CN`);
console.log(`submit: node ${voiceBin} submit ${dest} --voice <voice_id>`);
console.log(`collect (after the task result lands in voice/task.json): node ${voiceBin} collect ${dest}`);
console.log(`render: node ${renderBin} ${dest}`);
