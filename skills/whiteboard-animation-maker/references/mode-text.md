# text mode (stroke-drawn words, Chinese and English)

Artwork: authored SVG `path` / `rect` / `circle` animated with
`drawKids('#id', sceneDraw('s1', seconds), sceneT('s1', frac))` via
`stroke-dashoffset`. `draw.js` and `scene.js` are copied from the skill into
the draft by render; never hand-edit the draft copies.

On-screen words are written stroke by stroke in one tool. Chinese characters
draw from verified stroke-order data; ASCII letters, digits, and punctuation
draw from bundled stroke-ordered letter data on the same math and the same
animation:

```bash
python3 "$SKILL/scripts/text_svg.py" '目标' --id goalText --cx 540 --cy 280 --size 80
python3 "$SKILL/scripts/text_svg.py" 'Goal' --id goalWord --cx 540 --cy 280 --size 96
```

Mixed words work in one group — Latin letters and Chinese characters in a
single call share the id. Paste the emitted group into
the SVG, then animate
`drawKids('#goalText', sceneDraw('s2', 1.4), sceneT('s2', 0.12))`. A missing
character fails the build; switching to a system font is forbidden. Drive
time with `sceneT` / `sceneStart` / `sceneDraw`, mapped to `script.txt`'s
`# sN`. With voiceover, synthesize before rendering; see
[voiceover and sync](voiceover-and-sync.md).

| Use | `--size` |
|---|---|
| Full sentence in a bubble (Chinese) | 80 |
| Word in a card or circle | 104 |
| On-screen word, two characters | 96–104 |
| Single character, cover-grade word | 110–120 |
| English word, title grade | 88–104 |

Visual stroke weight is about 3.2px (large words, thin strokes). Lines in
drawings run 3.2–3.6px; never 8px black clubs. Widen boxes per word width;
when it does not fit, break the line or the scene.

**Stroke-draw or wipe (English):** stroke-draw short words — titles,
on-screen nouns, product names. A long English sentence is twenty-plus
strokes and outruns its scene window; put sentences in Georgia `<text>` with
`wipe('#id', dur, at)` or `fade` instead. Accented or non-ASCII letters the
stroke data does not cover fail the build with that character named — draw
that word with a Georgia wipe, never a system-font imitation. With
voiceover, bottom captions and on-screen words are two separate tracks; see
[visual rules](visual-rules.md).

Timeline order: write the on-screen word first, then draw its object. People
are optional and shrunk. Point `drawKids` at the moment the spoken noun
arrives, never at the scene start. Cross scenes with
`xfade('#s1', '#s2', sceneStart('s2'))`. No coloring segments, no pasting
the original image at the end.
