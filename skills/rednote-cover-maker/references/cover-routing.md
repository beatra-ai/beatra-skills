# Cover routing

## Start from the creator's actual starting point

A REDnote cover request arrives in one of three shapes. Identify which one
before choosing a tool.

| Starting point | What is enough to start | Route |
| --- | --- | --- |
| One photo + style or topic | The source image plus one target look | `beatra.images.transform` |
| One photo + multiple style references | Ordered references (source first, style/color after) | `beatra.images.transform` |
| Topic or note idea only, no source photo | A topic description and one style direction | `beatra.images.generate` |
| Accepted cover + specific fix | The accepted cover plus the requested change | `beatra.images.edit` |

A single photo with no explicit style preference is enough to propose a clean
category-appropriate background and include it in the single paid-call
confirmation.

## Extract the cover brief

Collect what is already known and fill gaps only when they materially change
the result.

- **Note topic and category.** What the note is about—beauty tutorial, food
  recipe, OOTD outfit, travel guide, home decor, product recommendation,
  knowledge tips, or lifestyle vlog. The category determines the visual
  language.
- **Focal subject.** The single element that anchors the cover—the dish, the
  product, the outfit, the person, or the scene. A Xiaohongshu cover works best
  with one clear focal point, not a busy collage.
- **Style direction.** Clean and bright (beauty, skincare), warm and appetizing
  (food, cafe), editorial and minimal (fashion, OOTD), cozy and atmospheric
  (home, lifestyle), or bold and high-contrast (knowledge, before/after).
- **Text-safe zone.** Where the user plans to add their headline overlay—top
  third, center, or bottom. The image composition must preserve clean,
  uncluttered space in that zone.
- **Visual references.** Style inspiration, desired color palette, or a
  competitor cover to match—ordered with the source photo first.

## Category visual language

REDnote's platform culture rewards specific aesthetics by category. When the
user names a category but not a style, infer from the category:

- **Beauty and skincare** — bright, clean, soft-focus backgrounds, pastel or
  white surfaces, natural skin tones, gentle diffused lighting. The product or
  face is the hero.
- **Food and cafe** — warm tones, natural window light, shallow depth of field,
  wooden or marble surfaces, steam or freshness cues. The dish fills most of
  the frame.
- **Fashion and OOTD** — editorial composition, full-body or half-body subject,
  clean urban or studio background, strong color coordination between outfit
  and environment.
- **Travel and scenery** — vibrant saturation, wide-angle sense of place, golden
  hour or blue hour lighting, a person or landmark as focal anchor.
- **Home and lifestyle** — cozy warm light, styled interior, natural materials
  (wood, linen, ceramic), shallow depth of field, lived-in authenticity.
- **Knowledge and tips** — clean flat background, high contrast, room for text
  overlay, infographic-friendly composition with one clear visual metaphor.
- **Product recommendation** — clean white or soft-gradient background, even
  lighting, product centered, subtle shadow for grounding, space for callout
  text.

These are starting points, not constraints. Override with the user's stated
preference whenever available.

## Canvas defaults that avoid unnecessary questions

- Canvas: vertical `3:4` at `2K` tier. This is the recommended Xiaohongshu
  cover format—it occupies the most feed space and drives the highest
  click-through.
- Square `1:1` only when the user explicitly requests it (some creators use it
  for cross-posting to Instagram).
- Horizontal `4:3` only when the user explicitly requests it (rarely used on
  Xiaohongshu).
- Count: 1 (a cover requires precision, not variation).
- Model: `auto`.

## Text-safe zone

A Xiaohongshu cover is rarely text-free. The creator typically adds a bold
headline overlay after receiving the image. The generated cover must preserve
space for that overlay:

- **Top third** — the most common placement. Keep the upper area clean and
  uncluttered.
- **Center** — for bold statement covers. Keep the center area relatively free
  of busy detail.
- **Bottom** — less common, used for subtitle or call-to-action text.

State the text-safe zone in the prompt: "reserve a clean text-safe area in the
upper third of the frame for headline overlay."

## Visual access

Local files enter the workflow through `beatra.assets.upload`. Upload makes the
bytes available to the remote tool; it does not itself inspect the image.
Review only visual facts the host can actually see. When the host cannot view an
image, state that visual verification was not possible and proceed on the
user's declared intent.
