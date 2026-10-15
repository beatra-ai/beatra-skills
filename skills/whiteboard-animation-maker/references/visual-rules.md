# Default visuals

When the user specifies otherwise, follow their spec. Otherwise use this
set.

## Canvas

- 1080×1920, background `#FFFFFF`, lines/characters/arrows `#111111`.
  Fills are white or black only. No cream paper, no colored clip-art, no
  photos of real hands.
- `#root` must be `position: relative`, or captions stick to the viewport
  bottom.
- Draw inside y≈200–1480; the bottom belongs to captions. Line weight
  3.2–3.6px. Words are large with thin strokes; see
  [text mode](mode-text.md).
- Captions sit **240px** above the canvas bottom (`.cap { bottom: 240px }`,
  `#caps` height 400px). Xiaohongshu's 9:16 bottom safe area is roughly
  140px (like bar, note title, progress bar); 240px also clears the home
  indicator and two title lines. Never pin to the very bottom.
- No top bars, bottom bars, progress bars, corner badges, or big text
  banners; no whole-frame pan/zoom as the main motion.
- Black fill belongs to the current subject only. Transitions are short
  cross-fades.

## Dual text tracks

With voiceover there are two tracks — never write the same sentence twice:

| Track | Content | Written by |
|---|---|---|
| Bottom captions | The spoken line, one per screen | `captions.js` from `voice.js` cues |
| On-screen words | The noun in that line, 2–6 characters (or one short English word), cover-frame quality | stroke paths or Georgia |

- Captions render around 48px, one line at a time. No timecodes, no colored
  backing bar, never hand-write `.cap` blocks in the HTML.
- The on-screen word is not the caption. The caption can ramble; the screen
  writes the noun.
- Without voiceover the on-screen words are the reading track and no
  separate captions are attached.
- On-screen words are stroke-drawn — Chinese characters and short English
  words alike — through `text_svg.py`. `<text>` with a system font is
  forbidden for these; generating words with an image model is forbidden.
- Long English sentences use Georgia `<text>` with a wipe or fade (a
  sentence is too many strokes for one scene); the split rule lives in
  [text mode](mode-text.md). Write product names; never paste colored
  logos.

## One idea, one object

- One scene, one thing. The word or object being drawn this second is the
  noun being spoken this second.
- Write the on-screen word first, then draw the object. People stay off
  screen by default; when unavoidable, shrink them — no full-frame figures,
  no stick figures, no identical face reposed every scene.
- Objects must be recognizable (folder, scissors, dog-eared document).
  Slightly curved paths, optional short hatching. Empty boxes and ruler
  rectangles are not objects.
- The default production line is SVG plus stroke-by-stroke words. No
  image-model reveal layers, no Rough.js jitter lines, no image-to-video
  hand-drawn imitations.
- A scene's on-screen word `sceneT` targets the sentence containing the
  spoken noun; never write the whole word the instant the scene starts and
  then idle.
