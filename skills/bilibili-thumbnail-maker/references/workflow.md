# Workflow

## Build one thumbnail request

Use `beatra.images.generate` for a topic, title, or script. Use
`beatra.images.transform` when a key-frame screenshot, portrait, product, or
other image reference affects the cover. If a video is the only input, request
one exported frame before using the image route. Invoke all remote tools only
through `python3 scripts/mcp_client.py call <tool-name>` with one JSON object on
standard input; never use a host connector or REST fallback.

```json
{
  "prompt": "Video thumbnail for a phone-camera review. Image 1 is the featured phone and must keep its visible color and silhouette. Clear single hero subject, high-contrast studio background, readable visual hierarchy at thumbnail size, and clean left-side headline-safe space.",
  "model": "auto",
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "16:9"},
  "images": [{"type": "artifact", "artifact_id": "<source-image-artifact-id>"}],
  "client_request_id": "bilibili-thumbnail-opaque-request-id"
}
```

The example canvas is valid only after it matches the confirmed destination.
For transform, image order is significant: state every role in the prompt and
keep the must-preserve source first. For an accepted thumbnail, use
`beatra.images.edit` with that image fixed at `images[0]` and at most two
normalized `edit_regions` on `image_index: 0`.

## Confirmation and task recovery

Freeze prompt, exact canvas, references and order, text treatment, model,
controls, and count before one paid submission. Create one opaque stable
request ID, submit once, and poll the returned `task_id` with
`beatra.tasks.get`. If response delivery is truly unknown, only the identical
payload and ID may be replayed. If the task ID is missing, search with
`beatra.tasks.list` and verify a candidate with `tasks.get`.

Cancellation is user-directed only. A `409` cancellation response means the
original task continues. Report only artifacts, dimensions, usage, and billing
values present in the terminal task result.
