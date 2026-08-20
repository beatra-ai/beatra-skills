# Detail-module workflow

## Turn SKU facts into a module brief

Build a compact fact card before writing prompts. Separate seller-confirmed
facts from visual choices. The fact card has the exact SKU and variant, visible
must-keeps, approved benefits, dimensions or comparison facts, package and
included-item facts, use or care facts, product photos, page destination, and
ordered reference roles. A fact may enter a module only when the seller
supplied it or explicitly approved it.

Then prepare three to six ordered module cards. Four cards are the default:

| Module | Buyer question | Required fact source | Visual role |
| --- | --- | --- | --- |
| 1. Product promise | What is this product and why should I keep reading? | exact SKU and approved product focus | product-led opening visual |
| 2. Feature or material | What makes the product useful or well made? | approved feature or material fact | focused product-detail visual |
| 3. Use context | How does the product fit a real use moment? | approved use context and product reference | product-focused use scene |
| 4. Decision support | What confirmed fact helps a buyer choose? | size, comparison, included-item, or care fact | clear supporting visual |

Use a fifth or sixth card only when it has a distinct buyer question and a
confirmed source, such as package contents, a second material fact, a selected
audience use scene, or a brand-story moment. State the same product must-keeps
and visual family across all cards: palette, lighting, surface, camera
treatment, and brand energy. Keep dense text out of generated modules. Put
approved copy, hierarchy, and placement directions in the delivery handoff.

## Prepare references and the live model card

Upload each local product file with the bundled helper using its exact MIME
type. The helper completes the upload grant and returned HTTP PUT, then prints
the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-sku-front.png --mime-type image/png
```

Keep returned artifact IDs with their declared roles. For a transform, the
main exact-SKU product photo is `images[0]`; later images can be a confirmed
brand, scene, or composition reference and retain their supplied order. With
`canvas.aspect: "source"`, the last reference controls the resulting ratio, so
use a preset canvas whenever the product photo must remain the ratio anchor.

Before freezing a concrete model, price, canvas, control, output relationship,
or output count, call `beatra.models.list` with `image_to_image`. Read the live
card for compatible sources, maximum output images, canvas limits, supported
controls, candidate order, and current price. A normal module uses
`model: "auto"`, `count: 1`, and a module-specific prompt. Use an output
relationship only when the live card supports the selected option.

For a selected focused correction, read the `image_edit` card before choosing
any model or control. The accepted module is `images[0]`; later references
remain ordered. Keep the module canvas, facts, and visual role unless the
seller approves a new module.

## Freeze the module set and submit

Show one confirmation card before the first billable request. It must list:

- the ordered module cards, buyer questions, and confirmed fact sources;
- every source image and reference role in exact order;
- product must-keeps, shared visual direction, and one prompt per module;
- canvas, model behaviour, controls, and `count: 1` for every module;
- the current per-image price, total call count, maximum total price, and any
  live concurrency limit; and
- delivery order plus the visual and fact checks for the completed set.

After approval, create one opaque stable `client_request_id` per module.
Submit each transform once. Keep no more than two generation tasks in flight on
one MCP connection, or use a lower live limit when reported. Poll the first
completed pair to terminal status before starting the next pair. A changed
prompt, fact, source or reference order, canvas, model, count, control, or
module purpose creates new paid work and needs a new confirmation and ID.

Use a direct transform payload such as:

```text
printf '%s' '{
  "prompt":"Create module 2, the approved material-detail visual. Image 1 is the exact confirmed SKU. Preserve its product shape, colour, material appearance, visible label, and included items. Show the seller-confirmed material detail with the approved brand palette, lighting, and vertical detail-page composition. Leave space for the separately supplied short copy; do not create dense embedded copy.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"4:5"},
  "images":[{"type":"artifact","artifact_id":"sku-product-photo"}],
  "client_request_id":"opaque-detail-module-02"
}' | python3 scripts/mcp_client.py call beatra.images.transform
```

For a focused correction, put the accepted module first. Local regions use
normalised coordinates and must identify that accepted base image; use the
smallest requested adjustment.

## Review and hand off the module set

On accessible results, review first within each module, then across the set:

1. Check the product's shape, colour, label, material appearance, and included
   items against the fact card and product photos.
2. Check that every benefit, size, comparison, package, and care fact matches
   its confirmed source. Review generated text character by character when it
   is visible.
3. Check the module's buyer question, product focus, visual rhythm, palette,
   lighting, surface, camera treatment, and repeated composition across the
   planned page sequence.
4. Record only actual dimensions, format, resolved model, successful-image
   count, task state, and `billing.net_charged_credits` returned by the task.

Deliver artifacts in module order plus a handoff table containing the module
number, buyer question, visual role, approved fact source, source-reference
order, intended page width or aspect direction, optional approved copy, and
placement notes. When a result cannot be viewed, report that it has not been
visually inspected and provide the artifact for seller review. A selected local
revision is a newly approved paid request.

## Recover without duplicate work

After a create response, retain its task ID and use `beatra.tasks.get` for that
task. If a create response is genuinely unknown, repeat only the identical
frozen request with its original `client_request_id`. If a task ID is missing,
use `beatra.tasks.list` for the relevant capability and inspect candidates with
`beatra.tasks.get`; match a candidate to the module's time, source images,
prompt, canvas, and other known request facts. An ambiguous match, queued
task, or running task never authorizes a replacement request.

Call `beatra.tasks.cancel` only on the seller's request. Call it once and use
`beatra.tasks.get` to confirm the resulting task state. A conflict or
nonterminal cancellation remains the original task and does not permit a new
submission.
