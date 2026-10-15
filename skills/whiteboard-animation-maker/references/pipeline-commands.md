# Pipeline commands and runtime prerequisites

This package renders locally (skill-matrix R10): the film is assembled on
the user's machine from an HTML composition, not fetched from a generation
model. `$SKILL` is this package directory.

## Prerequisites

- Node.js 18 or newer, with `npm`.
- Python 3.10 or newer (the bundled MCP client and `text_svg.py`).
- System `ffmpeg` and `ffprobe` (mux, previews, silence alignment).
- First use of a draft runs `npm install` inside `$SKILL` automatically to
  fetch the pinned dependency (`gsap` 3.14.2; the stroke data packages —
  `hanzi-writer-data` 2.0.1 for Chinese characters — install alongside).
  Latin stroke data ships inside the package under `assets/`. Rendering
  also fetches the pinned renderer `hyperframes@0.8.20` through `npx` on
  first run. Say so when a step needs the network.

`node_modules` never ships inside the package and is never committed.

## Draft lifecycle

1. **Create the draft** (after Gate B only):

   ```bash
   node "$SKILL/scripts/new_draft.mjs" <outdir> --mode text|program
   ```

   Writes the mode template, `DESIGN.md`, and `script.txt`. Put the approved
   narration into `script.txt` and the storyboard into `DESIGN.md`.

2. **Draw the composition** in `<outdir>/index.html`. `#root` carries
   `data-composition-id="main"`, `data-duration`, `data-width="1080"`,
   `data-height="1920"`. The GSAP timeline must be `paused: true` and
   assigned to `window.__timelines.main`. Keep the `@font-face { src:
   local(...) }` blocks. Drive time with `sceneT` / `sceneStart` /
   `sceneDraw`; never hardcode absolute seconds. Call `mountCaptions(tl)`
   before assigning `window.__timelines.main`, or captions freeze out of the
   rendered timeline. Mode rules: [text mode](mode-text.md),
   [program mode](mode-program.md).

3. **On-screen words** come from stroke data, never `<text>` with a system
   font — Chinese characters and short English words alike:

   ```bash
   python3 "$SKILL/scripts/text_svg.py" '目标' --id goalText --cx 540 --cy 280 --size 80
   python3 "$SKILL/scripts/text_svg.py" 'Goal' --id goalWord --cx 540 --cy 280 --size 96
   ```

   A missing character fails the build. Words large, strokes thin. Long
   English sentences use a Georgia wipe; see
   [text mode](mode-text.md).

4. **Voiceover** follows [voiceover and sync](voiceover-and-sync.md):
   submit, poll, collect. Skip when the film is silent.

5. **Render**:

   ```bash
   node "$SKILL/scripts/render.mjs" <outdir>
   ```

   Produces `<outdir>/renders/out.mp4` (audio muxed in when present) and
   preview frames `<outdir>/renders/preview/sN.jpg`. Review the previews:
   the word or object on screen at a moment must be the noun spoken at that
   moment. Mismatches are fixed in the HTML and re-rendered, never by
   rewriting approved narration.

## Local files contract

Everything the pipeline writes stays inside the draft directory:
`script.txt`, `DESIGN.md`, `index.html`, `voice/` (ledger, task result,
audio, subtitles, alignment), `renders/` (picture, out, previews). Drafts
belong to the user's working directory, never to `$SKILL`. The renderer
copies `scene.js`, `captions.js`, and `draw.js` into the draft; treat them
as generated.

## Failure handling

A missing `ffmpeg`, a failed `npm install`, or a render error is reported
as-is with the failing step named; fix the prerequisite and re-run the same
command. These failures never touch the Beatra connection or billing. Paid
calls inside the pipeline (synthesis, cloning, lookup) follow their own
recovery rules in [voiceover and sync](voiceover-and-sync.md) and
[benchmark lookup](benchmark-lookup.md).

One check finding does not block the render: when the checker's only error
is `sweep_static`, the renderer warns and continues. That sweep samples
element boxes and opacity, so a silent draft whose only motion is stroke
drawing (every shape starts hidden) reads as static to it; the rendered film
is the ground truth. Every other check error still aborts the render.
