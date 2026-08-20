# Scene craft

## Anchor the result to the product

The product is the subject. Build the prompt around the source photo and
confirmed product details, then verify fidelity in the result:

- state explicitly that Image 1 is the product reference and ask the model to
  match its shape, color, label, and proportions closely;
- describe only the background, lighting, and scene around it;
- do not request changes to the product itself in a transform call—use
  `beatra.images.edit` for localized product fixes.

## Background quality

A professional product background has three properties:

- **clean edges** — the product's outline must have no halo, fringe, or
  ghosting where it meets the background;
- **consistent lighting** — the light direction on the product must match the
  light direction implied by the background (shadows fall the same way);
- **natural shadow** — the product should cast a subtle contact shadow on the
  surface beneath it; a floating product with no shadow looks artificial.

Include these constraints in the prompt: "clean product edges, consistent
lighting direction, natural contact shadow, no halo or fringe."

## Clean white background

For marketplace main images requiring pure white:

- state "pure white background, RGB 255 255 255" explicitly;
- request even, shadowless lighting for the background while keeping a subtle
  contact shadow under the product for grounding;
- avoid gradients, textures, or patterns unless the user explicitly requests
  them.

## Lifestyle scene composition

For lifestyle and contextual scenes:

- match the surface material to the product category (wood for food, marble
  for cosmetics, metal for tech);
- keep the product as the focal point—larger and more prominent than any prop
  or background element;
- use depth of field to separate the product from the background (sharp
  product, slightly soft background);
- ensure color temperature consistency (warm scene = warm product lighting,
  cool scene = cool product lighting).

## Lighting direction

State the light direction in the prompt to avoid conflicting shadows:

- **front light** — even, flat illumination; good for catalog accuracy;
- **side light** — dimensional, shows texture; good for food and crafts;
- **backlight** — dramatic silhouette rim; good for glass and transparent
  products;
- **top light** — natural overhead; good for flat-lay and top-down shots.

The chosen direction must be consistent between the product lighting and the
scene's implied light source.

## Color accuracy

Use the original photo as the color reference, then review the result for color
fidelity:

- do not describe the product's color in the prompt (let the reference image
  determine it);
- if the original photo has a color cast, note it and advise the user that
  color correction may be needed;
- structured `palette` is optional—use it only when the user provides exact
  brand or background color values.

## Canvas and output

- Default canvas for marketplace main images: square `1:1` at `2K` tier.
- For banner or hero images: `16:9` or `4:3` at `2K`.
- For edit: the default is `source`, which inherits the base image's ratio.
- A different ratio is a separate paid request with its own confirmation and
  `client_request_id`.
