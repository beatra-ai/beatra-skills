---
name: "marketplace-main-image-preflight"
description: "Review an existing product main image for Amazon, Shopify, Etsy, or another marketplace and turn target listing requirements into a clear preflight card. This AI marketplace image checker and Amazon main image editor helps ecommerce sellers prepare white-background product photos, sharpen product framing, clean distracting details, and create one polished listing hero image for a specific store, region, and category."
---

# Marketplace Main Image Preflight

Turn one existing product main image into a concise, traceable preflight card
and one focused, seller-approved cleanup edit. Use this Skill when the seller
is close to listing a single SKU and needs to prepare one hero image for one
named marketplace, region, and category.

Route a seller to the separate `product-photo-studio` package when they need a
new product shoot, lifestyle scene, multi-image set, or broad creative art
direction. This Skill stays with the submitted main image, its listing
requirements, and one repair that directly follows the card.

## Collect the listing context

Start from the existing image and reuse the product, target marketplace,
region, category, and must-keep details already stated in the conversation.
The hard inputs are:

- the current main image;
- one target marketplace, region, and product category;
- the product's must-keep identity details, especially any label, logo, color,
  shape, or included item; and
- current listing requirements when a marketplace, region, or category changes
  their requirements.

When a target or category is missing, ask one compact question before making
the card. When the source image cannot be visually inspected in the current
host context, record the seller's description as seller-reported rather than
turning it into an observed fact.

Default to one existing image, one target listing surface, source canvas, and
one repair. Preserve the product identity and do not make a second variant
unless the seller explicitly starts new paid work.

## Make the preflight card

Build a card before any image generation. It should be useful to a seller who
wants to upload the current image, even if they decide not to edit it:

| Card section | Include |
| --- | --- |
| Listing scope | Marketplace, region, category, image slot, and the source of the supplied requirements |
| Image facts | What is visible to the host, or what the seller reports when it is not visible |
| Requirement check | Each relevant requirement, its source, and `ready`, `needs review`, or `repair proposed` |
| One repair | The smallest background, edge, distraction, or framing change that improves the card |
| Seller review | The remaining details the seller should compare with their current marketplace guidance before upload |

Treat each marketplace's own submission decision as the final check. The card
is a listing-preparation record, so it must name the requirements and evidence
it used rather than present a broad certification.

## Choose the smallest repair

Choose one route after the seller has seen the card:

- **Targeted cleanup:** use `beatra.images.edit` when the current main image
  remains the base canvas. Put it first in `images` and use a focused prompt
  for one issue such as a stray object, edge halo, reflection, or background
  cleanup. Use `edit_regions` only when the seller identifies a localized
  area and its coordinates are known.
- **Background or framing treatment:** use `beatra.images.transform` when the
  requested single repair requires a new clean background or a deliberate
  reframing. Keep the current main image as the first ordered reference and
  carry every must-keep product detail into the prompt.

Keep `count: 1` and `model: "auto"` unless a live model card is needed for a
specific model, canvas, supported control, or price decision. Read
`beatra.models.list` with `capability: "image_edit"` or
`capability: "image_to_image"` for that decision. Do not infer dimensions,
pixel values, product coverage, or platform rules from an image that the host
cannot actually inspect.

## Confirm, execute, and review

Planning and the preflight card are free. Before the single paid image call,
show the seller the card, exact repair prompt, base image, source or selected
canvas, model choice, output count, live price information when it was needed,
and the details that must remain unchanged. One clear instruction to proceed
approves that frozen request.

Use the bundled `scripts/mcp_client.py` to upload local media and call the
selected MCP tool; keep the returned artifact ID. The tool name is a command
argument and its JSON input is sent on standard input. Do not configure or
call a host Beatra Connector, and do not use REST/OpenAPI as a fallback.

Assign one stable opaque `client_request_id` to the approved logical request
and submit it exactly once. Record the returned `task_id` immediately, then
poll that task with `beatra.tasks.get` until it is terminal. When the output is
visible, compare the requested repair, protected product details, canvas fit,
and any card item that can genuinely be seen. Deliver the result link, actual
dimensions, task ID, resolved model, and `billing.net_charged_credits`, then
offer one proposed next repair without executing it.

## Recover without duplicate work

Keep the frozen request, approval, `client_request_id`, create response, and
task ID together. A slow `queued` or `running` task continues to be the same
work. If a create response is lost, retry only the identical request with the
same identifier. If the task ID is lost, use `beatra.tasks.list` to find
candidates and confirm the selected task with `beatra.tasks.get` before any
retry. A changed image, prompt, canvas, model, or repair is a new paid request
and needs its own approval and identifier.

For an expired upload grant or media mismatch, obtain a fresh upload grant.
For model validation, refresh the relevant live model card. For insufficient
balance, request a balance action before resubmitting the unchanged request.
Cancel only on the seller's request; if `beatra.tasks.cancel` returns `409`,
continue tracking the original task rather than creating a replacement.

## References by task

- Preparing the card, choosing an edit route, freezing a paid request, and
  handling task recovery: [main image preflight workflow](references/workflow.md)
- First install or expired authorization:
  [installation and authentication](references/installation-and-auth.md)
- Non-billable package registration:
  [installation registration](references/installation-registration.md)
- Task polling, artifacts, and result fields:
  [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors:
  [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Bundled client command usage and diagnostics:
  [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Update guarantees and controls:
  [automatic updates and safety](references/automatic-updates-and-safety.md)
- Removing this package or shared credentials:
  [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24
hours per installation. When a newer release is available, it installs
automatically without separate confirmation. A newer package is downloaded
only from the fixed official Beatra discovery and immutable CDN paths for this
package, channel, and locale. Before replacement, it verifies discovery data,
the archive, manifest, and every packaged file, and it replaces only
package-owned files.
If a check, download, replacement, or rollback fails, the current installation
stays usable and the original command continues. An update failure never
retries a paid image request. The setting persists for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

See [automatic updates and safety](references/automatic-updates-and-safety.md)
for official sources, integrity checks, replacement scope, and recovery.
