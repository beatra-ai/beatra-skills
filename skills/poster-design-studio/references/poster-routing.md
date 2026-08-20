# Poster routing

## Start from the creator's actual starting point

A poster request arrives in one of three shapes. Identify which one before
choosing a tool.

| Starting point | What is enough to start | Route |
| --- | --- | --- |
| Topic or campaign description only, no source photo | A topic description and one style direction | `beatra.images.generate` |
| One photo + style or topic | The source image plus one target look | `beatra.images.transform` |
| One photo + multiple style references | Ordered references (source first, style/color after) | `beatra.images.transform` |
| Accepted draft + specific fix | The accepted poster plus the requested change | `beatra.images.edit` |

A topic-only brief with no explicit style preference is enough to propose a
category-appropriate look and include it in the single paid-call confirmation.

## Extract the poster brief

Collect what is already known and fill gaps only when they materially change
the result.

- **Poster type.** What the poster is for—event poster, promotional banner,
  music or concert poster, movie poster, product launch, sale or flyer, or
  social media graphic. The type determines the composition template and
  reading order.
- **Headline message.** The event name, film title, sale offer, or campaign
  line that sits at the top of the visual hierarchy.
- **Focal subject.** The single element that anchors the poster—the performer,
  the product, the hero scene, the film still, or the key visual. A strong
  poster works with one clear focal point, not a busy collage.
- **Style direction.** Clean and futuristic (tech), warm and appetizing (food),
  editorial and bold (fashion), vibrant and energetic (music), professional and
  clean (corporate), or friendly and approachable (education).
- **Canvas and destination.** A-series print (A3, A4), social media (1:1 square,
  9:16 story, 16:9 banner), or standard poster (2:3, 3:4). The destination
  decides the ratio and resolution tier.
- **Text-safe zone.** Where the user plans to place the headline and details—top
  band, center, or lower third. The image composition must preserve clean,
  uncluttered space in that zone.
- **Visual references.** Brand color reference, style inspiration, or a
  composition reference—ordered with the source photo first when one exists.

## Poster type matrix

Each poster type has a dominant layout pattern. When the user names a type but
no style, infer the look and composition from the type.

- **Event poster** — bold headline at the top, single hero visual below, date
  and venue details in a clean lower band. Strong color, energetic mood, one
  focal performer or scene.
- **Promotional banner** — product or offer as hero, value line prominent,
  horizontal-friendly composition, call-to-action space. High contrast, brand
  colors, clean negative space.
- **Music or concert poster** — vibrant and energetic, stage or performer as
  focal anchor, bold typographic mood, glow and stage-light atmosphere. 2:3 or
  3:4 vertical canvas.
- **Movie poster** — cinematic, dramatic lighting, title-treatment space at the
  bottom or center billing block, strong focal still or character composite.
  2:3 vertical canvas with deep contrast.
- **Product launch** — clean futuristic or premium look, product centered as
  hero, brand color integration, space for features and logo. Tech leans clean
  and futuristic; lifestyle leans editorial.
- **Sale or flyer** — warm and appetizing or high-energy, offer and discount as
  hero text area, product photo supporting, bold price callout zone. Print A4
  or square social.
- **Social media graphic** — platform-native ratio (1:1 square, 9:16 story, 16:9
  banner), single focal subject, large text-safe zone, high contrast readiness.

These are starting points, not constraints. Override with the user's stated
preference whenever available.

## Category style language

Posters reward a style matched to the subject category. When the user names a
category but not a style, infer from the category:

- **Tech** — clean, futuristic, dark or bright gradient backgrounds, neon or
  electric accents, geometric shapes, generous negative space.
- **Food** — warm and appetizing tones, natural light, shallow depth of field,
  steam and freshness cues, the dish as hero.
- **Fashion** — editorial and bold, strong typography, high-contrast or
  monochrome palette, full-frame subject.
- **Music** — vibrant and energetic, saturated color, glow, motion blur, stage
  atmosphere, dynamic type.
- **Corporate** — professional and clean, restrained palette, structured grid,
  generous white space, brand color integration.
- **Education** — friendly and approachable, rounded shapes, soft palette,
  clear icon metaphors, room for explanatory text.

## Canvas defaults that avoid unnecessary questions

- Topic-led event, music, movie, or product launch poster: vertical `2:3` or
  `3:4` at `2K` tier. This is the recommended standard poster proportion.
- Print flyer or handout: A-series (`A3` or `A4`) at `2K` tier.
- Social media graphic: `1:1` square, `9:16` story, or `16:9` banner depending
  on the named platform placement.
- Horizontal promotional banner: `16:9` at `2K` tier.
- Count: 1 (a poster requires precision, not variation).
- Model: `auto`.

## Text-safe zone

A poster carries headline text, dates, prices, and call-to-action lines. The
generated poster must preserve space for that text overlay:

- **Top band** — the most common placement for the headline and event name.
  Keep the upper area clean and high-contrast.
- **Center** — for bold statement posters and movie title treatments. Keep the
  center area relatively free of busy detail.
- **Lower third** — common for dates, venue, price, and billing block. Keep the
  lower band structured and uncluttered.

State the text-safe zone in the prompt: "reserve a clean text-safe band across
the top third of the frame for the headline and date overlay."

## Visual access

Local files enter the workflow through `beatra.assets.upload`. Upload makes the
bytes available to the remote tool; it does not itself inspect the image.
Review only visual facts the host can actually see. When the host cannot view an
image, state that visual verification was not possible and proceed on the
user's declared intent.
