# Cover craft

## One focal subject

A Xiaohongshu cover competes in a dual-column waterfall feed. At thumbnail size
the user sees roughly four covers on screen. The cover that wins the click has
one unmistakable focal subject. Build the prompt around a single hero element:

- the dish, not the entire table;
- the product, not the shelf;
- the person, not the crowd;
- the scene, not the panorama.

State the focal subject's role explicitly: "Image 1 is the hero dish; keep it
sharp, prominent, and centrally composed."

## Composition for vertical 3:4

Vertical composition differs from landscape. Key principles:

- **Fill the frame.** The focal subject should occupy 60-80% of the vertical
  canvas. Small subjects floating in empty space do not stop the scroll.
- **Rule of thirds, vertical bias.** Place the subject's most important
  feature—face, dish garnish, product label—at the upper-third intersection
  point. The eye lands there first in a vertical scroll.
- **Negative space for text.** Reserve the top third or a clean side panel for
  headline overlay. Do not fill every pixel with detail.
- **Leading lines.** Use natural lines—a table edge, a pathway, a shelf, an
  arm—to guide the eye toward the focal subject.

## Background discipline

The background must support, not compete:

- **Clean and simple.** A blurred, uncluttered background makes the subject
  pop. Avoid busy patterns, logos, or competing objects.
- **Color harmony.** The background color should complement the subject. Warm
  food on warm wood, cool skincare on cool marble, neutral fashion on neutral
  concrete.
- **Depth of field.** A shallow depth of field (sharp subject, soft background)
  separates the hero from distractions and creates a premium feel.

Include these constraints in the prompt: "clean, softly blurred background,
shallow depth of field, subject sharply in focus, color harmony between subject
and background."

## Lighting for Xiaohongshu aesthetic

REDnote's visual culture favors specific lighting qualities:

- **Bright and airy** — for beauty, skincare, lifestyle. Soft, diffused,
  high-key lighting with minimal shadows. White or light reflectors bounce light
  onto faces and products.
- **Warm and natural** — for food, cafe, home. Window light from the side,
  warm color temperature (3000-4000K), gentle shadows that add dimension.
- **Golden hour** — for travel, outdoor OOTD. Warm directional light just after
  sunrise or before sunset, long shadows, rich saturation.
- **Clean studio** — for product recommendation. Even, shadowless lighting on
  a white or light-gray sweep, subtle contact shadow for grounding.

State the light quality in the prompt to avoid flat or mismatched lighting.

## Color and saturation

Xiaohongshu rewards a specific color aesthetic:

- **Pastel and soft** for beauty and lifestyle—pink, peach, lavender, mint,
  cream.
- **Warm and appetizing** for food—amber, terracotta, warm brown, fresh green.
- **Neutral and editorial** for fashion—black, white, beige, camel, olive.
- **Vibrant and saturated** for travel—deep blue, emerald, sunset orange.

Avoid oversaturated HDR looks, heavy filters, or color casts that make skin
tone unnatural. The platform's audience values authenticity over artificial
enhancement.

## Text-safe area design

The text-safe zone is where the creator will add their headline overlay
(OOTD title, recipe name, tutorial heading). Design it as part of the
composition:

- **Top third clean zone** — keep the upper 33% of the frame relatively free of
  busy detail. A soft gradient, blurred background, or simple sky works well.
- **Contrast readiness** — the text-safe area should have enough brightness
  range to support both light and dark headline text without a separate text
  box background.
- **Subject offset** — when the text-safe zone is the top third, position the
  subject in the lower two-thirds. When it is the center, offset the subject
  slightly.

## Crop resilience

Xiaohongshu displays covers at different sizes: full-width in the note detail,
half-width in the feed waterfall, and tiny in the profile grid. The cover must
survive all three crops:

- keep the focal subject's most recognizable feature within the center 60% of
  the frame;
- avoid placing critical detail at the extreme edges;
- test legibility by imagining the cover at 200px wide.

## Canvas and output

- Default canvas: vertical `3:4` at `2K` tier (approx. 1080 × 1440 px or
  higher).
- Square `1:1` only on explicit request.
- A different ratio is a separate paid request with its own confirmation and
  `client_request_id`.
