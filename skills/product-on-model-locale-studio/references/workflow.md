# Market visual workflow

Create a separate on-model visual for each selected sales market. This is a
single-SKU, wearable-product workflow, not a generic portrait generator or a
multi-slot product-gallery plan.

Every remote operation uses the bundled `scripts/mcp_client.py`. Pass one JSON
object on standard input after `call <tool-name>`; do not configure a host
Beatra Connector or use REST/OpenAPI as a fallback.

## 1. Make the SKU and market cards

Confirm that the product is one apparel, footwear, bag, jewellery, or other
wearable SKU. Start a fact card from seller-provided information, separating
confirmed facts from visual decisions:

```text
SKU and exact variant:
wearable type:
must-keeps: silhouette / colour / material / visible graphics or logo / hardware / included pieces
product-photo role: exact SKU reference
sales markets and destination surfaces:
brand direction:
```

Then create one card per selected market:

```text
market and destination:
model direction: seller-selected casting / pose / product visibility / framing
styling: garment coordination / accessories / grooming direction where supplied
scene: setting / light / palette / surface
canvas:
references in order: SKU first, then model / pose / styling / scene / brand guides
review focus:
```

A product photo is not a source for missing sizes, textile composition, fit
claims, included accessories, or product copy. Keep any claim or measurement
out of the prompt until the seller supplies it. If a source cannot be viewed
by the host, retain its seller-declared role instead of calling it an observed
fact.

For a standard request, use one market and a three-quarter or full-body frame
that leaves the wearable item readable. Use a brand or model reference only in
the role that the seller states; it does not make the subject an identity
anchor. A package result is a market visual candidate, so the review records
visible differences from the protected product details rather than asserting
absolute product, garment, or person reproduction.

## 2. Prepare ordered media and the live model card

Use the bundled helper for a local file. It requests the upload grant, follows
the returned HTTP PUT instruction, and prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-sku.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./japan-style-guide.png --mime-type image/png
```

Keep every returned artifact ID. For `beatra.images.transform`, use the exact
SKU as `images[0]`; later inputs may be a seller-authorized model, pose,
styling, scene, or brand guide and preserve that stated order. There can be one
through four ordered inputs. When a chosen transform canvas uses
`aspect: "source"`, the last reference anchors its ratio, so use a confirmed
preset canvas when the product reference must remain the visual anchor.

Before committing to a model, price, canvas, output count, relationship, or
optional control, call the live `image_to_image` card:

```text
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Read the returned card for accepted source combinations, count and canvas
limits, supported controls, current price, and candidate model order. Use
`model: "auto"` and no optional control unless the seller chooses a compatible
specific value. One market always has one `count: 1` transform request. For a
bounded correction to an accepted market image, instead read the `image_edit`
card and use that accepted image as `images[0]`.

## 3. Freeze the paid market set

Before the first billable call, show the seller a single confirmation block
containing:

- every market card, in planned delivery order;
- all source and later-reference roles in their exact order;
- the protected SKU details and complete prompt for each market;
- canvas, model behaviour, optional controls, and `count: 1` for every
  market;
- the current per-image price, total maximum charge, number of calls, and live
  concurrency limit; and
- the result review and delivery plan.

Once approved, assign each market one stable opaque `client_request_id`.
Submit each transform only once and keep no more than two generation tasks in
flight on one connection; honor a lower live connection limit. Do not add a
market, variation, or another output to explore an alternative without a new
approved set. A changed prompt, product fact, source or reference order,
market, canvas, model, count, or control is new paid work with a new
confirmation and identifier.

Use a transform payload shaped like this:

```json
{
  "images": [
    { "type": "artifact", "artifact_id": "confirmed-sku" },
    { "type": "artifact", "artifact_id": "seller-authorized-market-guide" }
  ],
  "prompt": "Create the approved United States storefront on-model visual. Image 1 is the exact confirmed wearable SKU. Preserve its approved silhouette, colour, material, visible graphics, hardware, and included pieces. Image 2 is a seller-authorized visual guide for the selected pose and styling. Use the approved market card's three-quarter framing, natural retail light, and clean storefront scene.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "4:5" },
  "model": "auto",
  "count": 1,
  "client_request_id": "opaque-us-market-image-id"
}
```

## 4. Track, review, and deliver

Save the returned task ID for each market and poll it with `beatra.tasks.get`
until `succeeded`, `failed`, or `canceled`. The terminal task is authoritative
for artifacts, actual image dimensions and format, resolved model,
successful-image count, usage, and `billing.net_charged_credits`.

For accessible images, review the market card in this order:

1. The wearable SKU's named must-keeps: silhouette, colour, material, visible
   graphics or logo, hardware, and included pieces.
2. Whether the product is readable in the selected pose, framing, styling, and
   scene.
3. The market direction, light, palette, and destination canvas.
4. Any visible text or product detail that needs seller confirmation.

When an image cannot be viewed, deliver the artifact and state that its visual
review remains with the seller. Deliver results by market with the card,
artifact link, observed task facts, and visible drift note. Offer one selected,
unexecuted focused correction; a correction is a fresh paid request.

## 5. Recover without duplicate work

Keep a private record of the frozen card, approval, full request,
`client_request_id`, create response, and task ID for every market.

| Situation | Action |
| --- | --- |
| Create response is lost | Retry only the identical frozen payload with its original `client_request_id`. |
| Task ID is lost | Use `beatra.tasks.list`, match candidates to the saved market card and request facts, then verify with `beatra.tasks.get`. |
| Task is queued or running | Continue polling the original task; it is not permission to create another. |
| Upload grant expires or MIME/size validation fails | Obtain a fresh grant through the bundled upload helper while preserving the otherwise frozen request. |
| Model validation fails | Refresh the matching `beatra.models.list` card before proposing a changed request. |
| Balance is insufficient | Ask the seller to resolve the balance, then submit the identical approved request with the same identifier. |
| Seller requests cancellation | Call `beatra.tasks.cancel` once and track the original task. A `409` leaves the original task in control. |

Slow polling, a connection problem, an automatic-update failure, or a later
market result never authorizes a replacement paid task or an unapproved extra
market.
