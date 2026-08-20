---
name: "product-on-model-locale-studio"
description: "Create AI product-on-model images and clothing try-on presentations from apparel and wearable-accessory product photos for localized ecommerce campaigns. Plan one fashion-model visual per market with market-specific casting, styling, pose, and shopping scene, then prepare product-on-model photography for fashion listings, apparel ads, Shopify storefronts, Amazon Fashion pages, and social commerce launches."
---

# AI Product-on-Model Locale Studio

Create one on-model or worn-product visual for each sales market from a
confirmed single SKU. Use this Skill for apparel, footwear, bags, jewellery,
and other wearable accessories when the selling job is to show that exact item
on a model in a market-specific ecommerce scene.

Use `product-photo-studio` for one product-only image, background treatment,
or focused product-image correction. Keep a broader multi-image gallery as a
separate seller-selected workflow; this Skill plans and delivers the distinct
on-model visual for each selected market.

## Build a market-ready product brief

Reuse the SKU, sales surface, brand direction, target markets, and protected
product details already present in the conversation. The hard input is at
least one real product photo of the confirmed SKU. Also collect only the facts
that change the visual:

- the exact SKU and variant, garment or wearable type, colour, material,
  silhouette, visible graphics or logo placement, hardware, and included
  pieces that must remain recognisable;
- one or more sales markets, along with the destination such as a fashion
  listing, storefront, apparel ad, or social-commerce campaign;
- the selected framing, pose or use moment, styling, and scene direction for
  each market; and
- any ordered brand, pose, styling, or scene references. When a person
  reference is supplied, record its stated role as a visual guide and use it
  only with the seller's authority.

Default to one market, a three-quarter or full-body ecommerce composition
that makes the wearable product readable, and a clean destination-appropriate
canvas. If the seller has named several markets, make a separate market card
for each; do not silently combine them into one generic image. Ask only when a
missing SKU fact, market, or creative choice would make the result materially
different.

Write protected product details as must-keeps before drafting a prompt. Source
images and references guide the rendition rather than prove a pixel-identical
garment, person, or product. Treat the completed image as a candidate: compare
accessible results with the must-keeps and report material visible drift for
seller review.

## Plan one card for every market

For each market, make a concise visual card with:

| Card field | Record |
| --- | --- |
| SKU anchor | exact variant, must-keeps, and product-photo role |
| Market and destination | sales market, customer surface, and desired canvas |
| Model direction | seller-selected casting, pose, framing, and product visibility |
| Styling and scene | outfit coordination, setting, lighting, palette, and brand cues |
| Reference order | SKU first, then any model, pose, styling, scene, or brand guide |
| Review focus | product readability, protected details, pose, styling, scene, and destination fit |

Keep the product photo in `images[0]` for the normal
`beatra.images.transform` route. Later inputs remain in their stated order and
must be labelled by role in the prompt. Use `beatra.images.edit` only after a
seller has accepted a completed market image and wants a bounded correction;
the accepted image is then `images[0]`.

Before choosing a concrete model, canvas, optional control, or price, call
`beatra.models.list` for `image_to_image` or `image_edit`. Read the live card
for permitted sources, reference count, canvas, output count, controls, and
current price. Keep `model: "auto"` unless the seller selects an eligible
named model. Every market is a distinct `count: 1` image request; do not turn
several market versions into a multi-output call.

Read [market visual workflow](references/workflow.md) for the card template,
ordered-reference preparation, exact request shape, result review, and safe
recovery.

## Confirm the market set and create once

Planning is free. Before any billable call, present one confirmation that
lists every market card, source and reference order, must-keeps, prompt,
canvas, model behaviour, `count: 1` per market, live per-image price, total
maximum charge, and number of requests. A seller can approve the frozen set in
one decision when all of those details are explicit.

After approval, give each market its own opaque stable `client_request_id` and
submit it once. Keep at most two image tasks in flight on one MCP connection,
or a lower current connection limit when reported. Poll a terminal result
before submitting the next frozen market. A changed SKU fact, market, prompt,
source or reference order, canvas, model, count, or control is new paid work
and needs a new approval and identifier.

## Execute through the bundled client

Use only this package's bundled `scripts/mcp_client.py` for every remote
Beatra operation. The tool name follows `call` and its JSON object is passed on
standard input. Do not configure or call a host Beatra Connector, and do not
use REST/OpenAPI as a fallback.

Upload a local source with the bundled helper, which completes the upload grant
and returned HTTP PUT before printing its artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-sku.jpg --mime-type image/jpeg
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"images":[{"type":"artifact","artifact_id":"confirmed-sku"}],"prompt":"Create the approved Japan market fashion-listing visual. Image 1 is the confirmed wearable SKU; preserve its approved silhouette, colour, material, visible graphics, hardware, and included pieces. Use the approved model direction, three-quarter pose, styling, and retail setting.","canvas":{"type":"preset","tier":"2K","aspect":"4:5"},"model":"auto","count":1,"client_request_id":"opaque-jp-market-image-id"}' | python3 scripts/mcp_client.py call beatra.images.transform
```

Never put a local path in a remote image request. Uploading makes bytes
available to the remote tool; it does not establish visual facts that the host
has not actually inspected.

## Review, deliver, and recover

Save each returned `task_id` and poll it with `beatra.tasks.get` until it is
terminal. For accessible results, review the protected SKU details first, then
product readability on the model, the chosen pose and framing, styling and
scene direction, and canvas fit. Compare the market cards as a set without
claiming a reference, seed, or earlier success makes people or garments
identical across renderings. Deliver each market image with its card, artifact
link, observed dimensions and format, task ID, resolved model, and returned
`billing.net_charged_credits`.

If the create response is genuinely lost, repeat only the identical frozen
payload with its original identifier. If a task ID is missing, use
`beatra.tasks.list` to find candidates and confirm the matching task through
`beatra.tasks.get` before considering another submission. Queued or running
work remains the original work. Call `beatra.tasks.cancel` only when the
seller asks, then continue tracking that same task. A focused correction to an
accepted result is fresh paid work with its own confirmation and identifier.

## References by task

- For market cards, source roles, live-card admission, request payloads,
  confirmation, task recovery, and quality review, read [market visual
  workflow](references/workflow.md).
- For first authorization and non-billable installation registration, read
  [installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md).
- For task, billing, and connection details, read [tasks and results](references/tasks-and-results.md), [billing, errors, and recovery](references/billing-errors-and-recovery.md), and [Bundled MCP Client diagnostics](references/mcp-connection.md).
- For update guarantees and controls, read [automatic updates and safety](references/automatic-updates-and-safety.md). For removal, read [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24
hours per installation. When a newer version is available, it installs
automatically without separate confirmation. It downloads only from the fixed
official Beatra discovery and immutable CDN paths for this package, channel,
and locale, verifies discovery data, archive, manifest, and every packaged
file, and replaces only package-owned files.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the original command
continues. An update failure never authorizes retrying a paid image request.
The setting persists for this installation. See [automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
