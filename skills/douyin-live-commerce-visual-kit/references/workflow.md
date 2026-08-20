# Douyin live-commerce visual workflow

Use this reference after the live-commerce card is selected. It creates three
intentional static assets for one live event, not a set of interchangeable
image variants. Every remote operation uses bundled `scripts/mcp_client.py`:
put the MCP tool name after `call` and one JSON object on standard input. Never
configure a host Beatra Connector or use REST/OpenAPI as a fallback.

## 1. Shape the live-commerce card

Record only merchant-provided facts for price, discount, stock, campaign time,
qualification, availability, product specification, and outcome claim. Visible
details from an accessible product or brand image can shape the visual brief;
they do not create factual marketing claims.

| Asset | Visual job | Must settle before confirmation |
| --- | --- | --- |
| Pre-live promo cover | Make the live theme and product or host focus immediate | Destination surface, hook, title-safe area, lead product or host, approved event facts |
| Product selling-point card | Make one approved product reason easy to grasp | Product anchor, exact approved claim, demonstration or detail moment, copy-safe area |
| Background or overlay visual | Support the host and product without competing with them | Destination surface, host/product clear zone, palette, logo placement, room or campaign mood |

Keep the same product, brand palette, host direction, offer story, and named
must-keeps across the kit. Generate the assets as separate `count: 1` requests
because they serve different destination surfaces and may require different
canvases. They are not a fake ordered sequence.

## 2. Prepare media and admit live options

Inspect accessible local image media before upload. Record its MIME type,
dimensions, aspect ratio, byte size, alpha-channel state, visible product or
brand details, and declared role. Upload it only through the bundle:

```text
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./brand-reference.png --mime-type image/png
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For a product or brand source, use `image_to_image` with that source at
`images[0]`; later images, up to three, remain ordered references with a named
role. For a concept-only asset, use `text_to_image`. For a focused revision,
use the accepted asset at `images[0]` with `image_edit`.

Before choosing a model, canvas, control, count, or cost, read the matching
live model card. Keep `model: "auto"` and model-managed controls unless the
user asks to choose a model, compare compatibility, or compare price. Confirm
the actual destination/canvas from the user's live surface and source media;
do not invent a universal live-room canvas.

## 3. Prepare three asset payloads

Use one stable opaque ID for each logical paid image request. The following
transform payload illustrates the first asset; replace placeholders only with
the frozen approved values:

```json
{
  "images": [
    {"type": "artifact", "artifact_id": "art_product"},
    {"type": "artifact", "artifact_id": "art_brand_reference"}
  ],
  "prompt": "Create the approved Douyin live-commerce pre-live promo cover. Image 1 is the merchant's primary product source; preserve the user-confirmed product shape, label, colour, material, and visible brand details. Image 2 guides only the approved brand palette and visual direction. Make the confirmed live theme and product focus immediate, keep the supplied host or product clear, reserve the approved title-safe area, and use only merchant-confirmed campaign facts as copy direction.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "the confirmed destination aspect"},
  "model": "auto",
  "count": 1,
  "client_request_id": "opaque-live-promo-cover-id"
}
```

For the product selling-point card, retain the product must-keeps and name one
merchant-confirmed benefit or use moment. For the background/overlay asset,
make the host/product clear zone explicit and keep the background visually
quiet. The exact canvas, prompt, model, controls, and request IDs are separate
for each asset.

For a concept-only asset, call `beatra.images.generate` with the approved
prompt, canvas, `count: 1`, model choice, and stable ID. For a focused revision,
call `beatra.images.edit` with the accepted original at `images[0]`. Name no
more than two normalized regions when a local correction needs them; omit
regions for whole-image light, colour, or composition refinement.

## 4. Confirm and submit once

Before any paid request, present one confirmation block containing:

- all three asset roles and their exact destination surfaces;
- each full prompt, merchant-approved facts, and user-confirmed must-keeps;
- source/reference order and every reference role;
- canvas, model behaviour, controls, `count: 1`, and current maximum charge for each request;
- total paid call count, review plan, and all three opaque stable request IDs; and
- the free live-title and on-screen-copy shortlist to deliver with the assets.

After approval, submit each frozen request once through the bundled client and
save the returned task ID. A changed asset role, source, product fact, prompt,
reference order, canvas, model, control, or count is new paid work with new
approval and a new ID.

## 5. Track, review, and deliver

Poll each original task with `beatra.tasks.get` until `succeeded`, `failed`, or
`canceled`. `queued` and `running` are progress only. Completed-task facts are
authoritative for artifact URLs or IDs, dimensions, format, resolved model, and
`billing.net_charged_credits`.

When accessible, review each returned image for the correct asset role,
merchant-confirmed product and brand details, copy-safe or host-clear area,
cross-asset visual cohesion, destination fit, and the user's named must-keeps.
Report only what is visible. Deliver the cover, selling-point card, and
background/overlay visual in role order with actual task facts, the title/copy
shortlist, and at most one focused unexecuted revision suggestion.

## 6. Recover without duplicate work

| Situation | Action |
| --- | --- |
| Create response is genuinely unknown | Replay only the byte-equivalent frozen payload with its original `client_request_id`. |
| Task ID is missing | Use `beatra.tasks.list`, match candidates to the saved asset role, prompt, references, canvas, model, and timing, then verify through `beatra.tasks.get`. |
| Task is queued or running | Continue polling the original task. |
| Upload grant expires or a file is rejected | Obtain a fresh bundled upload grant while preserving the rest of the frozen request. |
| Live model validation changes options | Refresh the matching `beatra.models.list` before proposing newly confirmed paid work. |
| User requests cancellation | Call `beatra.tasks.cancel` once. A `409` keeps the original task in control; poll it and report cancellation only at terminal `status: "canceled"`. |

Slow polling, an unavailable result preview, connection trouble, or an update
failure never authorizes replacement paid work.
