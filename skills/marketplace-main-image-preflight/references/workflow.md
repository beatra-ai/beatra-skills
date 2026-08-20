# Main image preflight workflow

This workflow turns one existing listing image into a preflight card and one
seller-approved repair. It is a focused finishing route: do not turn it into a
new product-photo campaign or a multi-image listing set.

Use the bundled client for every remote Beatra operation. The remote tool name
is a command argument and its JSON arguments are passed through standard input:

```text
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Upload a local source image through the bundled helper and retain its returned
artifact ID:

```text
python3 scripts/mcp_client.py upload ./listing-main.jpg --mime-type image/jpeg
```

Do not configure a host Beatra Connector or use REST/OpenAPI as a fallback.
Never put a local path into a remote image request.

## 1. Establish the evidence used by the card

Record these fields before suggesting a repair:

```text
marketplace:
region:
category:
image slot: main / hero
requirements source: seller-provided current guidance or a supplied official URL/text
source image: visible to host / seller-reported visual facts
must keep: product identity, label, logo, color, shape, included items
```

Use a platform, region, and category already given by the seller. Ask for the
missing target only if it changes the requirements. When current requirement
text is unavailable, ask the seller to provide the relevant listing guidance
or state clearly that the item remains `needs review`; never fill an unknown
rule with a remembered requirement.

## 2. Produce the preflight card

Use this compact form:

| Requirement or check | Evidence used | Status | Next action |
| --- | --- | --- | --- |
| Target listing scope | Marketplace, region, category, and image slot | ready | Use this scope for the review |
| Background and distractions | Visible image facts or seller-reported facts plus current requirement | ready / needs review / repair proposed | Name one focused action |
| Product identity and included items | Visible or seller-provided product facts | ready / needs review | Preserve every listed detail |
| Framing and canvas | Actual visible or task-returned dimensions plus the supplied requirement | ready / needs review / repair proposed | Keep source canvas or specify a new one |
| Text, marks, and decorative elements | Visible or seller-reported facts plus current requirement | ready / needs review / repair proposed | Name one focused action |

An image that the host cannot see has no visual findings. Keep the seller's
description visible in the evidence column, rather than labeling it as an
observed check.

## 3. Select and freeze one paid edit

The preflight card itself is free. It may propose one repair.

Choose `beatra.images.edit` when the first image should remain the base. The
source image must be `images[0]`; later ordered references, if any, guide the
edit. A localized `edit_region` is optional and requires known normalized
coordinates. Use `beatra.images.transform` only when the one approved repair
needs a fresh clean background or reframing.

Call `beatra.models.list` only when a current model, canvas, control, or price
decision matters. Use the matching capability (`image_edit` or
`image_to_image`), then use `model: "auto"` when no explicit selection is
needed. Do not cache a price or supported-control claim.

Show the seller one confirmation block containing the card, exact repair,
must-keep details, source/target canvas, selected or automatic model behavior,
count `1`, and current cost information when it was consulted. A clear request
to proceed authorizes that single frozen call.

Create one opaque stable `client_request_id` for that payload. A new prompt,
image, image order, model, canvas, output count, or control is a new request
and needs a new approval and ID.

### Targeted edit example

```json
{
  "images": [{ "type": "artifact", "artifact_id": "art_listing_main" }],
  "prompt": "Keep the exact product, label, logo, color, shape, and included items. Remove the one identified background distraction and retain the current composition.",
  "count": 1,
  "model": "auto",
  "client_request_id": "opaque-main-image-edit-id"
}
```

### Background or framing treatment example

```json
{
  "images": [{ "type": "artifact", "artifact_id": "art_listing_main" }],
  "prompt": "Keep the exact product, label, logo, color, shape, and included items. Create the seller-approved clean listing background and preserve the requested framing.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "1:1" },
  "count": 1,
  "model": "auto",
  "client_request_id": "opaque-main-image-transform-id"
}
```

Use an explicit canvas only after the seller has confirmed that it belongs to
the target listing. With `canvas.aspect: "source"`, transform follows its last
ordered input image; inspect the returned artifact for actual dimensions.

## 4. Track the result and complete the card

Submit the approved call exactly once. Save its `task_id` immediately and poll
with `beatra.tasks.get` using bounded backoff until `succeeded`, `failed`, or
`canceled`. The terminal task is authoritative for the resolved model,
artifacts, charged credits, and refunded credits.

When the resulting image is visible, review only the repair requested, the
listed must-keep product details, and the output canvas. Update the card with
what was actually seen; if viewing is unavailable, say which result checks
remain seller review. Deliver:

- the preflight card with its source and status for each row;
- the artifact link and actual returned dimensions;
- the task ID, resolved model, and `billing.net_charged_credits`; and
- one optional next repair, left unexecuted until separately approved.

## 5. Recover safely

Keep a private record of the seller approval, frozen payload,
`client_request_id`, create response, and task ID.

| Situation | Action |
| --- | --- |
| Create response lost | Retry the exact same frozen payload with the same `client_request_id`. |
| Task ID lost | List recent tasks with `beatra.tasks.list`, match candidates to the private record, then inspect the chosen one with `beatra.tasks.get`. |
| Task queued or running | Continue polling the original task. |
| Upload grant expired or MIME/length mismatch | Obtain a new upload grant and preserve the otherwise frozen request. |
| Model validation error | Refresh the relevant `beatra.models.list` card before choosing a changed request. |
| Insufficient balance | Ask for a balance action; after it is resolved, submit the identical frozen request under the same ID. |
| Seller asks to cancel | Call `beatra.tasks.cancel` once and poll the original task. A `409` means cancellation is unconfirmed, so continue tracking it. |

Never make a replacement paid task merely because polling is slow, an update
check fails, or a task response is incomplete.
