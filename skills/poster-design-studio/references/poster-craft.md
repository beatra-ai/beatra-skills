# Poster craft

## One focal subject

A poster competes for attention on a wall, in a feed, and at thumbnail size.
The poster that wins the glance has one unmistakable focal subject. Build the
prompt around a single hero element:

- the performer, not the whole crowd;
- the product, not the shelf;
- the hero scene, not the panorama;
- the film still, not the montage.

State the focal subject's role explicitly: "Image 1 is the hero product; keep
it sharp, prominent, and centrally composed with a clean backdrop."

## Visual hierarchy

A poster is read in a fixed order in about one second. Design the hierarchy so
the eye lands in the right sequence:

1. **Hero visual** — the focal subject that stops the scroll. Largest, highest
   contrast, strongest placement (rule-of-thirds intersection or dead center).
2. **Headline** — the event name, film title, or offer. Reserve the top band or
   a bold center title-treatment zone with high contrast readiness.
3. **Details** — date, venue, price, call-to-action. Place in a structured lower
   band that stays clean and legible.

Build this order into the prompt: "strong visual hierarchy with a dominant hero
image, a clean headline band at the top, and a structured detail band at the
bottom."

## Composition principles

- **Fill the frame.** The focal subject should occupy 50-70% of the canvas.
  Small subjects floating in empty space do not hold attention.
- **Rule of thirds.** Place the subject's most important feature at a
  third-line intersection. The eye lands there first.
- **Negative space for text.** Reserve a clean band or side panel for headline
  and details. Do not fill every pixel with detail.
- **Leading lines.** Use natural lines—a stage beam, a pathway, a product edge,
  a spotlight—to guide the eye toward the focal subject.
- **Focal point emphasis.** One clear center of interest. Avoid competing
  subjects that split attention.

## Text-safe zone design

The text-safe zone is where the user adds the headline, dates, prices, and
call-to-action. Design it as part of the composition:

- **Clean band** — keep the chosen zone (top, center, or lower third) relatively
  free of busy detail. A soft gradient, blurred backdrop, or solid color panel
  works well.
- **Contrast readiness** — the text-safe area should have enough brightness
  range to support both light and dark headline text without a separate text-box
  background.
- **Subject offset** — when the text-safe zone is the top band, position the
  subject in the lower two-thirds. When it is the center, offset the subject
  slightly. When it is the lower third, keep the lower band structured.

State the zone in the prompt: "reserve a clean high-contrast text-safe band
across the top third for the headline overlay."

## Category styling

Match the visual treatment to the subject category:

- **Tech** — clean futuristic backgrounds, electric or neon accents, geometric
  light shapes, dark gradient or bright minimal surface, generous negative
  space.
- **Food** — warm appetizing tones, natural window light, shallow depth of
  field, steam and freshness cues, the dish filling most of the frame.
- **Fashion** — editorial bold composition, high-contrast or monochrome palette,
  strong typographic mood, full-frame subject, clean studio or urban backdrop.
- **Music** — vibrant saturated color, stage glow, motion and energy, bold
  dynamic type mood, performer as focal anchor.
- **Corporate** — professional clean grid, restrained brand palette, structured
  white space, logo and feature zones.
- **Education** — friendly approachable palette, rounded shapes, clear icon
  metaphors, generous text room.

## Color theory

- **Brand color integration.** When brand references are supplied, derive the
  dominant palette from them and keep accents complementary.
- **Complementary palettes.** Pair a dominant hue with a complementary accent
  for vibrancy (warm subject + cool backdrop, or vice versa).
- **High contrast vs subtle.** Posters that must read at a distance or at feed
  thumbnail size favor high contrast. Premium or editorial looks favor subtle,
  tonal palettes. State the intent in the prompt.
- **Mood through color.** Tech leans electric blue and violet, food leans amber
  and terracotta, music leans magenta and cyan, corporate leans navy and white,
  fashion leans black and a single bold accent.

## Lighting and depth

- **Cinematic** — for movie and music posters. Dramatic directional light, deep
  shadows, rich saturation, glow and atmosphere.
- **Clean studio** — for product launch and promotional. Even lighting on a
  gradient or solid sweep, subtle contact shadow for grounding.
- **Bright and airy** — for education and lifestyle. Soft diffused light,
  minimal shadows, fresh feel.
- **Depth of field** — a shallow depth of field separates the hero from
  distractions and creates a premium look.

State the light quality in the prompt to avoid flat or mismatched lighting.

## Canvas sizes and output

- **A-series print:** A3, A4 at `2K` tier—flyers, handouts, sale flyers.
- **Social media:** `1:1` square, `9:16` story, `16:9` banner—social graphics
  and promotional banners.
- **Standard poster:** `2:3`, `3:4` vertical at `2K` tier—event, music, movie,
  and product launch posters.
- Default canvas matches the destination named in the brief.
- A different ratio is a separate paid request with its own confirmation and
  `client_request_id`.

## Crop resilience

A poster appears at many sizes: full-size printed, scaled in a feed, and tiny
as a thumbnail. The poster must survive all three:

- keep the focal subject's most recognizable feature within the center 60% of
  the frame;
- avoid placing critical detail at the extreme edges;
- test legibility by imagining the poster at 300px wide.
