# Workflow

## Build one share-graphic request

Use `beatra.images.generate` for a campaign, offer, activity, or product brief.
Use `beatra.images.transform` when a product photo, logo, portrait, or brand
reference must shape the result. Invoke a remote tool only via
`python3 scripts/mcp_client.py call <tool-name>` with a single JSON object on
standard input. Do not use a host connector or REST fallback.

```json
{
  "prompt": "Square WeChat Moments promotion for a neighborhood bakery. Image 1 is the featured cake and must preserve its product shape and visible decoration. Warm celebratory color palette, one clear product hero, and clean upper-third space for a short offer callout.",
  "model": "auto",
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "1:1"},
  "images": [{"type": "artifact", "artifact_id": "<product-photo-artifact-id>"}],
  "client_request_id": "moments-poster-opaque-request-id"
}
```

State reference roles in prompt order. For edits, use `beatra.images.edit` with
the approved poster at `images[0]`; use zero to two normalized `edit_regions`
on `image_index: 0`. A user-selected vertical final format replaces the example
canvas only after it is included in the confirmation.

## Confirm, monitor, and recover

Freeze prompt, canvas, source order, message treatment, model, controls, and
count before a single paid call. Generate one opaque stable request ID, submit
once, and poll its `task_id` using `beatra.tasks.get`. Only if delivery of that
creation response is genuinely unknown may the exact payload be replayed with
the same ID. A missing task ID is recovered through `beatra.tasks.list` followed
by `tasks.get` verification.

Only the user may request `beatra.tasks.cancel`; a `409` continues the original
task. Deliver no assumed artifact, size, or billing data—only terminal fields
returned by Beatra.
