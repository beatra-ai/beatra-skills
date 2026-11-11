import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseScript,
  htmlSceneIds,
  patchDuration,
  weight,
  parseCues,
  parseSrt,
  parseVtt,
  parseSilencedetect,
  speechIslands,
  weightedSplit,
  matchCues,
  alignScenes,
  emitVoiceJs,
  splitCaptionLines,
  buildCaptionCues,
} from "./align.mjs";

test("parseScript reads # sN blocks", () => {
  const scenes = parseScript("# s1\n第一句。\n# s2\n第二句。\n");
  assert.equal(scenes.length, 2);
  assert.equal(scenes[0].id, "s1");
  assert.equal(scenes[1].text, "第二句。");
});

test("parseScript falls back to sequential ids", () => {
  const scenes = parseScript("甲\n\n乙\n");
  assert.deepEqual(
    scenes.map((s) => s.id),
    ["s1", "s2"]
  );
});

test("htmlSceneIds and duration patch", () => {
  const html = `<div id="root" data-duration="20"><section id="s1" class="scene"></section><section id="s2" class="scene"></section></div>`;
  assert.deepEqual(htmlSceneIds(html), ["s1", "s2"]);
  const patched = patchDuration(html, 12.3456);
  assert.match(patched, /data-duration="12.346"/);
});

test("Han characters count as 2", () => {
  assert.equal(weight("你A"), 3);
});

test("weighted split covers duration", () => {
  const scenes = [
    { id: "s1", text: "短。" },
    { id: "s2", text: "这是一句更长的口播，用来拉长时间。" },
  ];
  const out = weightedSplit(scenes, 10);
  assert.equal(out[0].start, 0);
  assert.equal(out[out.length - 1].end, 10);
  assert.ok(out[1].end - out[1].start > out[0].end - out[0].start);
});

test("matchCues maps MiniMax-style word list", () => {
  const scenes = [
    { id: "s1", text: "你好" },
    { id: "s2", text: "世界" },
  ];
  const cues = [
    { text: "你", time_begin: 0, time_end: 200 },
    { text: "好", time_begin: 200, time_end: 450 },
    { text: "世", time_begin: 500, time_end: 700 },
    { text: "界", time_begin: 700, time_end: 900 },
  ];
  const mapped = matchCues(scenes, parseCues(cues));
  assert.equal(mapped[0].end, 0.45);
  assert.equal(mapped[1].start, 0.5);
  assert.equal(mapped[1].end, 0.9);
});

for (const time of [0, 50, 51]) {
  test(`parseCues reads contract ${time}ms as milliseconds`, () => {
    const cue = { text: "你好", time_begin: time, time_end: 100 };
    assert.deepEqual(parseCues([cue]), [{ text: "你好", start: time / 1000, end: 0.1 }]);
    assert.deepEqual(parseCues(JSON.stringify([cue]), "json"), parseCues([cue]));
  });
}

test("JSON cue fields determine the unit without a numeric threshold", () => {
  assert.deepEqual(parseCues([{ text: "a", start: 51, end: 52 }]), [{ text: "a", start: 51, end: 52 }]);
  assert.deepEqual(parseCues({ subtitles: [{ text: "a", time_begin: 0, time_end: 50 }] }), [{ text: "a", start: 0, end: 0.05 }]);
});

for (const cue of [
  null,
  { text: "a", time_end: 100 },
  { text: "a", time_begin: null, time_end: 100 },
  { text: "a", time_begin: "", time_end: 100 },
  { text: "a", time_begin: "50", time_end: 100 },
  { text: "a", time_begin: false, time_end: 100 },
  { text: "a", time_begin: -1, time_end: 100 },
  { text: "a", time_begin: NaN, time_end: 100 },
  { text: "a", time_begin: 0, time_end: Infinity },
  { text: "a", time_begin: 100, time_end: 100 },
  { text: "a", time_begin: 101, time_end: 100 },
  { text: {}, time_begin: 0, time_end: 100 },
  { text: " ", time_begin: 0, time_end: 100 },
  { text: "a", start: "", end: 1 },
]) {
  test(`parseCues rejects malformed data ${JSON.stringify(cue)}`, () => {
    assert.deepEqual(parseCues([cue]), []);
    assert.deepEqual(parseCues([{ text: "valid", time_begin: 0, time_end: 10 }, cue]), []);
  });
}

test("overlapping and unordered cues reject the whole optional file", () => {
  const first = { text: "你", time_begin: 0, time_end: 200 };
  assert.deepEqual(parseCues([first, { text: "好", time_begin: 100, time_end: 300 }]), []);
  assert.deepEqual(parseCues([{ text: "好", time_begin: 300, time_end: 400 }, first]), []);
  assert.deepEqual(parseCues("{not JSON}"), []);
});

test("coarser cues use the existing silence alignment instead", () => {
  const scenes = [{ id: "s1", text: "你好" }, { id: "s2", text: "世界" }];
  const cues = parseCues([{ text: "你好世界", time_begin: 0, time_end: 3900 }]);
  assert.equal(matchCues(scenes, cues), null);
  const result = alignScenes({ scenes, cues, duration: 4, islands: [{ start: 0.1, end: 1.8 }, { start: 2.1, end: 3.9 }] });
  assert.equal(result.method, "silence");
  assert.ok(result.scenes[0].end < result.scenes[1].end);
});

test("cue counts cannot hide a cue crossing a caption row", () => {
  const scenes = [{ id: "s1", text: "你好" }, { id: "s2", text: "世界" }];
  const cues = parseCues([
    { text: "你", time_begin: 0, time_end: 200 },
    { text: "好世", time_begin: 200, time_end: 600 },
    { text: "界", time_begin: 600, time_end: 900 },
  ]);
  assert.equal(matchCues(scenes, cues), null);
  assert.equal(alignScenes({ scenes, cues, duration: 2 }).method, "weighted");
});

test("script caption rows finer than a scene also require fallback", () => {
  const scenes = [{ id: "s1", text: "你好世界", lines: ["你好", "世界"] }];
  const cues = parseCues([{ text: "你好世界", time_begin: 0, time_end: 3900 }]);
  const result = alignScenes({ scenes, cues, duration: 4 });
  assert.equal(result.method, "weighted");
  assert.deepEqual(buildCaptionCues(result.scenes, { linesById: { s1: scenes[0].lines }, wordCues: cues }), [
    { id: "s1-0", scene: "s1", text: "你好", start: 0, end: 2 },
    { id: "s1-1", scene: "s1", text: "世界", start: 2, end: 4 },
  ]);
});

test("fine cues still align each caption row within a scene", () => {
  const scenes = [{ id: "s1", text: "你好世界", lines: ["你好", "世界"] }];
  const cues = parseCues([
    { text: "你好", time_begin: 0, time_end: 800 },
    { text: "世界", time_begin: 1200, time_end: 3900 },
  ]);
  const result = alignScenes({ scenes, cues, duration: 4 });
  assert.equal(result.method, "cues");
  const captions = buildCaptionCues(result.scenes, { linesById: { s1: scenes[0].lines }, wordCues: cues });
  assert.equal(captions[0].end, 1);
  assert.equal(captions[1].start, 1);
  assert.equal(captions[1].end, 4);
});

test("wrong, incomplete, and out-of-duration cues fall back", () => {
  const scenes = [{ id: "s1", text: "你好" }, { id: "s2", text: "世界" }];
  for (const raw of [
    [{ text: "甲乙", time_begin: 0, time_end: 1000 }, { text: "丙丁", time_begin: 1000, time_end: 2000 }],
    [{ text: "你好", time_begin: 0, time_end: 1000 }],
    [{ text: "你好", time_begin: 0, time_end: 1000 }, { text: "世界", time_begin: 1000, time_end: 3000 }],
  ]) {
    const cues = parseCues(raw);
    const result = alignScenes({ scenes, cues, duration: 2 });
    assert.equal(result.method, "weighted");
    const captions = buildCaptionCues(result.scenes, { wordCues: cues });
    assert.equal(captions[captions.length - 1].end, 2);
  }
});

test("parseSrt", () => {
  const srt = `1
00:00:00,000 --> 00:00:01,200
你好

2
00:00:01,200 --> 00:00:02,000
世界
`;
  const cues = parseSrt(srt);
  assert.equal(cues.length, 2);
  assert.equal(cues[1].start, 1.2);
});

test("SRT and VTT malformed ranges cannot supply partial alignment", () => {
  for (const times of ["00:00:01,200 --> 00:00:01,000", "00:00:01,000 --> 00:00:01,000", "00:00:61,000 --> 00:01:02,000", "bad00:00:00,000 --> 00:00:01,000"]) {
    const text = `1\n00:00:00,000 --> 00:00:00,500\n你好\n\n2\n${times}\n世界\n`;
    assert.deepEqual(parseSrt(text), []);
    assert.deepEqual(parseVtt(`WEBVTT\n\n${text}`), []);
  }
});

test("silencedetect islands", () => {
  const sil = parseSilencedetect(`silence_start: 1.00
silence_end: 1.40 | silence_duration: 0.40
silence_start: 3.00
silence_end: 3.20
`);
  const islands = speechIslands(4, sil);
  assert.equal(islands[0].end, 1);
  assert.ok(islands.some((i) => i.start === 1.4));
});

test("short silence islands do not steal scene windows", () => {
  const result = alignScenes({
    scenes: [
      { id: "s1", text: "第一句比较长的口播。" },
      { id: "s2", text: "第二句也比较长的口播。" },
    ],
    duration: 10,
    islands: [
      { start: 0, end: 0.4 },
      { start: 0.5, end: 0.9 },
      { start: 1.0, end: 9.8 },
    ],
  });
  assert.equal(result.method, "weighted");
  assert.ok(result.scenes[0].end - result.scenes[0].start > 2);
});

test("parseScript keeps caption lines", () => {
  const scenes = parseScript("# s1\n第一句。\n第二句。\n");
  assert.deepEqual(scenes[0].lines, ["第一句。", "第二句。"]);
  assert.equal(scenes[0].text, "第一句。第二句。");
});

test("splitCaptionLines keeps script lines and splits long ones", () => {
  assert.deepEqual(splitCaptionLines("短句。\n另一句。"), ["短句。", "另一句。"]);
  const long = splitCaptionLines("你跟对话框说：明天汇报，帮我做个 PPT。");
  assert.ok(long.length >= 2);
  assert.ok(long.every((line) => [...line.replace(/\s/g, "")].length <= 18));
});

test("buildCaptionCues times one line per cue inside a scene", () => {
  const cues = buildCaptionCues(
    [{ id: "s1", text: "第一句。第二句。", start: 0, end: 4 }],
    { linesById: { s1: ["第一句。", "第二句。"] } }
  );
  assert.equal(cues.length, 2);
  assert.equal(cues[0].text, "第一句。");
  assert.equal(cues[0].start, 0);
  assert.equal(cues[1].end, 4);
  assert.ok(cues[1].start > cues[0].start);
});

test("alignScenes prefers cues then stitches", () => {
  const result = alignScenes({
    scenes: [
      { id: "s1", text: "你好" },
      { id: "s2", text: "世界" },
    ],
    duration: 2,
    cues: parseCues([
      { text: "你好", start: 0, end: 0.8 },
      { text: "世界", start: 0.9, end: 1.7 },
    ]),
  });
  assert.equal(result.method, "cues");
  assert.equal(result.scenes[0].start, 0);
  assert.equal(result.scenes[1].end, 2);
  assert.match(emitVoiceJs(result), /window\.__voice/);
});
