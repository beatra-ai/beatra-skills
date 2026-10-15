#!/usr/bin/env node
// Runs the ffmpeg steps lesson_kit.py planned, and reads media durations.
// Every child process is an argv array; nothing goes through a shell.
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

function fail(message) {
  console.error(`error: ${message}`);
  process.exit(2);
}

function probe(file) {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "json", file],
    { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 }
  );
  if (result.error) fail(result.error.code === "ENOENT" ? "ffprobe is not installed or not on PATH" : result.error.message);
  if (result.status !== 0) fail(`ffprobe could not read ${file}: ${result.stderr.trim()}`);
  const seconds = Number(JSON.parse(result.stdout).format?.duration);
  if (!(seconds > 0)) fail(`no duration in ${file}`);
  console.log(JSON.stringify({ file, seconds }));
}

function run(jobPath) {
  const job = JSON.parse(readFileSync(jobPath, "utf8"));
  const total = job.steps.length;
  job.steps.forEach((step, index) => {
    const result = spawnSync("ffmpeg", step.argv, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
    if (result.error) fail(result.error.code === "ENOENT" ? "ffmpeg is not installed or not on PATH" : result.error.message);
    if (result.status !== 0) {
      const tail = (result.stderr || "").trim().split("\n").slice(-15).join("\n");
      fail(`step ${index + 1}/${total} (${step.makes}) failed:\n${tail}`);
    }
    console.log(`ok ${index + 1}/${total} ${step.makes}`);
  });
  for (const output of Object.values(job.outputs)) {
    if (!existsSync(output)) fail(`expected output is missing: ${output}`);
  }
  console.log(JSON.stringify({ done: true, outputs: job.outputs }));
}

const [command, target] = process.argv.slice(2);
if (command === "probe" && target) probe(target);
else if (command === "run" && target) run(target);
else fail("usage: node lesson_run.mjs probe <media-file> | run <render-job.json>");
