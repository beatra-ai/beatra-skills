# Listing-set workflow

## Turn SKU facts into ordered slot cards

Build a small fact card before writing prompts. Separate facts the seller has
confirmed from creative choices. The fact card has the exact SKU and variant,
visible must-keeps, included items, package contents, approved benefits,
dimensions or fit facts, destination surfaces, product photos, and reference
roles. A fact only belongs in a slot when the seller supplied it or explicitly
approved it.

Then prepare four to eight ordered slot cards. Six cards are the default:

| Slot | Buyer question | Required source | Visual role |
| --- | --- | --- | --- |
| 1. Product hero | What is the exact product? | product photo and SKU variant | clean, product-led opening image |
| 2. Feature | Which approved benefit should be noticed first? | approved benefit and visible product detail | close detail or focused feature view |
| 3. Detail or use | How does the product's next feature, material, or use appear? | approved fact and product reference | a distinct secondary product view |
| 4. Lifestyle | Where or how is the product used? | approved use context and product reference | contextual scene with product as focal point |
| 5. Size or fit | What scale or fit fact helps a buyer decide? | confirmed size, fit, or scale fact | clear scale or dimension-oriented composition |
| 6. Package or in-box | What arrives with the SKU? | confirmed packaging and included-items list | package or included-item composition |

Choose a 4–8 image count when the destination, product category, or seller's
brief calls for it. Give each replacement card its own buyer question and fact
source. Do not fill a missing fact with a plausible-looking accessory, claim,
dimension, certification, packaging detail, or copy. For all cards, state the
same product must-keeps and shared visual direction: palette, lighting,
surface, camera family, and brand styling.

## Prepare references and the model card

Upload a local product file through the bundled helper using its exact MIME
type; it completes the upload grant and returned HTTP PUT, then prints the
artifact reference:

```text
python3 scripts/mcp_client.py upload ./verified-sku-front.png --mime-type image/png
```

Keep every returned artifact ID. For a transform, use the main product photo as
`images[0]`; later images can be confirmed brand, scene, or angle references
and retain their order. With `canvas.aspect: "source"`, the last reference
controls the resulting ratio, so select a preset canvas whenever the product
photo needs to remain the ratio anchor.

Before a concrete model, price, canvas, control, output count, or output
relationship is selected, call `beatra.models.list` with `image_to_image`.
Read the live card for compatible sources, maximum output images, canvas limits,
candidate order, and current price. A normal gallery creates one image per
slot: `count: 1`, `model: "auto"`, and a purpose-specific prompt. Do not assume
that one model supports a related-image output relationship; use it only when
the live card confirms it.

Use `beatra.images.edit` only after a seller accepts a card and requests a
bounded correction. The accepted result is `images[0]`; later references remain
ordered. Inspect the `image_edit` live card before choosing any model or
control. Keep an accepted card's canvas and product facts unless the seller
approves a replacement card.

## Freeze the set and submit by slot

Show one confirmation card before the first billable request. It must list:

- the ordered slot cards, buyer questions, and confirmed fact sources;
- all source image and later-reference roles in their exact order;
- product must-keeps, shared direction, and one prompt per slot;
- canvas, model behaviour, controls, and `count: 1` for every slot;
- the current per-image price, six-call total for a default set, and any live
  concurrency limit; and
- delivery order and the review checks for the completed gallery.

After approval, create one opaque stable `client_request_id` per slot. Submit
each transform once. Keep at most two generation tasks in flight on one MCP
connection. When the connection reports a lower limit, use that limit. Poll
each returned task to terminal status before adding more work, and preserve the
original slot-to-ID mapping. A changed prompt, fact, source/reference order,
canvas, model, count, control, or slot purpose creates new paid work and needs
a new confirmation and ID.

Use a direct transform payload such as:

```text
printf '%s' '{
  "prompt":"Create slot 1, the approved clean product hero. Image 1 is the exact verified SKU. Preserve its shape, colour, label, material appearance, and included items. Use the approved clean background, lighting, and square product-gallery canvas.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "images":[{"type":"artifact","artifact_id":"sku-product-photo"}],
  "client_request_id":"opaque-listing-slot-01"
}' | python3 scripts/mcp_client.py call beatra.images.transform
```

For a focused correction, use the accepted slot image first. Local regions use
normalised coordinates and must identify the accepted base image; use the
smallest requested adjustment.

## Recover and review the gallery

After a create response, retain the task ID and use `beatra.tasks.get` for that
task. If a create response is genuinely unknown, repeat only the identical
frozen request with its original `client_request_id`. If a task ID is missing,
use `beatra.tasks.list` for the relevant capability and inspect candidates with
`beatra.tasks.get`; match the candidate to the slot's time, source images,
prompt, canvas, and other known request facts. An ambiguous match, a queued
task, or a running task never authorizes a replacement request.

On visible results, review first within each slot, then across the set:

1. Check the product's shape, colour, label, material appearance, and included
   items against the fact card and product photos.
2. Check that feature, size or fit, and package facts match their confirmed
   source. Review any generated text character by character when it is visible.
3. Check image purpose, product focus, lighting, palette, surfaces, and visual
   repetition across the ordered gallery.
4. Record only actual dimensions, format, resolved model, successful-image
   count, task state, and `billing.net_charged_credits` returned by the task.

When a result cannot be viewed, report that it has not been visually inspected
and give the artifact for seller review. Deliver every artifact in slot order,
the source fact used for that slot, observed task facts, and any visible issue.
Offer one selected focused revision; its execution is a new paid request.

Call `beatra.tasks.cancel` only on the seller's request. Call it once and use
`beatra.tasks.get` to confirm the resulting task state. A conflict or
nonterminal cancellation remains the original task and does not permit a new
submission.
