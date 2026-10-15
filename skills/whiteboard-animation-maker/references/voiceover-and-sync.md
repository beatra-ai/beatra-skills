# Voiceover, cloning, timestamps, and picture sync

Narration synthesis and voice cloning run only through Beatra MCP on this
connection. Authentication, the bundled client, and the no-REST rule are in
[installation and authentication](installation-and-auth.md) and
[Bundled MCP Client diagnostics](mcp-connection.md).

```bash
python3 "$SKILL/scripts/mcp_client.py" verify
```

## Narration file

How to write narration is [script copywriting](script-copywriting.md).
`<draft>/script.txt` holds only spoken words; scene notes live in
`DESIGN.md`. One block per scene, ids matching the HTML's `#s1` `#s2`:

```text
# s1
你跟聊天模型说话，它答完就停。
# s2
给它一个目标，它拆步骤、调工具、看结果。
```

Punctuation is the pause. No timecodes, scene numbers, or stage directions
inside the narration.

With voiceover, narration is the reading track. `align` cuts caption cues
from `script.txt` lines (splitting long lines at pauses) and writes
`voice.js`; `captions.js` shows one line per timestamp. No timecodes, no
full paragraphs.

## Choosing a voice or cloning

`beatra.speech.synthesize` and `beatra.voices.clone` are billable. Before
each paid call, show the six-field current production card from the package
root and wait. A changed script, voice, or speed is new paid work: new
card, new `client_request_id`, never an automatic resubmit.

Weighted characters: Hanzi count 2, everything else 1. Before quoting a
synthesis price, call `beatra.models.list`:

```json
{"capability": "text_to_speech"}
```

Before quoting a clone price, call `beatra.models.list`:

```json
{"capability": "voice_clone"}
```

Never quote a remembered number. `voice.mjs estimate` prints character
counts only; it is not the live credit figure.

```bash
node "$SKILL/scripts/voice.mjs" voices --language zh-CN
node "$SKILL/scripts/voice.mjs" estimate <outdir>
```

Use only the opaque `voice_id` from the listing; never synthesize with a
display name.

Cloning requires the user to state that this is their own voice or that the
speaker authorized it. Having the file, a celebrity name, or a public
recording is not consent. The sample runs about 10 seconds to 5 minutes,
single speaker, clean speech. Submit the clone through the guarded
subcommand — it refuses to run without `--consent`:

```bash
node "$SKILL/scripts/voice.mjs" clone-submit <sample.wav> --name '我的声' --consent --draft <outdir>
```

The subcommand uploads the sample, submits one `beatra.voices.clone` call
with `consent_attested: true` and a fresh `client_request_id`, records both
ids in `voice/ledger.json`, and refuses a second clone submit while one is
unresolved. Poll with `beatra.tasks.get`, then record the returned
`voice_id` in `DESIGN.md`.

## Synthesis: submit, poll, collect

One film is one synthesis (the whole `script.txt` read together). Never one
paid call per scene. Async tasks follow the package paradigm — the script
submits, the agent polls, the script collects:

1. **Submit.**

   ```bash
   node "$SKILL/scripts/voice.mjs" submit <outdir> --voice <voice_id> --language zh-CN
   ```

   The script hashes script + voice + speed + format. If an identical
   synthesis already succeeded and `voice/narration.mp3` exists, it reports
   `reused: true` and re-aligns only — no second charge. If an identical
   submit is still in flight or its answer was lost, it refuses to mint a
   second id and prints the recorded `task_id` and `client_request_id` —
   reconcile with `beatra.tasks.list` and `beatra.tasks.get`, then replay
   byte-identical arguments under the same id. Otherwise it records the id
   and exact payload in `voice/ledger.json` **before** calling
   `beatra.speech.synthesize` once, so a lost response stays recoverable.

2. **Poll.** Call `beatra.tasks.get` with that `task_id` until the task is
   terminal, per [tasks and results](tasks-and-results.md). When it
   finishes, save the final result JSON as `<outdir>/voice/task.json` and
   report the real duration and `billing.net_charged_credits` to the user.

3. **Collect.**

   ```bash
   node "$SKILL/scripts/voice.mjs" collect <outdir>
   ```

   The script verifies the saved task matches the ledger's submit, that it
   succeeded, then downloads the audio and any subtitle file into `voice/`,
   updates the ledger, and runs alignment. A task result that belongs to a
   different submit is rejected.

Default `speed: 1.2`. Use 1.0 only when the user asks for slower.

When the script, voice, and speed are all unchanged and only the picture
changes: skip synthesis entirely, run `render.mjs` directly. Never re-submit
paid synthesis for a picture-only change.

Without voiceover, write timings by reading pace. With voiceover, always
collect before rendering — a silent render with audio glued on afterwards
drifts out of sync.

Self-supplied audio is supported: copy it to
`<outdir>/voice/narration.mp3` and run
`node "$SKILL/scripts/voice.mjs" align <outdir>`.

## Where timestamps come from

The MCP task does not always return per-word subtitles. Alignment takes the
first available source and stops:

1. **Subtitle cues** (when the task returned `subtitles`: MiniMax JSON,
   SRT, or VTT). Map narration text onto cues for per-scene bounds.
2. **Silence segmentation** (`ffmpeg silencedetect`). When there are enough
   spoken segments, one segment maps to one scene.
3. **Weighted split.** Hanzi weights plus punctuation pauses distribute
   `duration_seconds` across scenes; boundaries snap to silence points when
   they exist.

Never hand-type millisecond timecodes. The method used is recorded in
`voice/alignment.json` under `method`.

## How the picture follows

Never hardcode absolute seconds. Use `scene.js`:

```js
drawKids('#art1', sceneDraw('s1', 2.4), sceneT('s1', 0.04));
xfade('#s1', '#s2', sceneStart('s2'));
tl.from('#h1', {y: 18, opacity: 0, duration: 0.4}, sceneT('s1', 0.02));
```

- `sceneStart('s1')` — this scene's narration begins
- `sceneT('s1', 0.04)` — a fractional position inside the scene window
- `sceneDraw('s1', 2.4)` — planned draw duration, compressed to about 72% of
  the scene when needed so the drawing settles before the sentence ends

Aim `xfade` at the next scene's `sceneStart`. Narration longer than the
drawing: the drawing settles and the sentence finishes. Narration shorter:
compress the drawing into the window; never pre-draw the next scene.

Without `voice.js`, `scene.js` divides `data-duration` evenly across
`#root`'s `.scene` elements.

## Final film

After `render.mjs` renders, if `voice/narration.mp3` exists the renderer
snapshots the silent cut to `renders/picture.mp4` and muxes
`renders/out.mp4`. Never reuse a previous `picture.mp4` — durations differ.
System `ffmpeg` / `ffprobe` are required.
