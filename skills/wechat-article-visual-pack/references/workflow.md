# Workflow

## Verify the linked article-pack route

For a two-to-four-image article pack, call `beatra.models.list` through the
bundled client before the paid request, for the chosen route only:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

For transform use `{"capability":"image_to_image"}`; for edit use
`{"capability":"image_edit"}`.

Verify live support for the selected generation or transform capability, final
count, final canvas, and `output_relationship: "sequence"`. Keep `model: "auto"`
unless an actual compatibility, control, availability, or price decision
requires otherwise. If
the compatible sequence route is not available, report it and obtain the user's
explicit choice between one image or multiple separate paid requests. Never
present independent candidates as a coordinated article sequence.

## Build one confirmed visual sequence

Use `beatra.images.generate` for article content and
`beatra.images.transform` for ordered brand assets or source images. Invoke all
remote tools only as `python3 scripts/mcp_client.py call <tool-name>` with a
single JSON object on standard input; do not use a host connector or REST
fallback.

```json
{
  "prompt": "Create a three-image WeChat Official Account article visual sequence in one calm blue-and-cream visual language. Image 1 is the article lead visual: a focused product explainer scene with top headline-safe space. Image 2 illustrates the first key section with one clear process step. Image 3 shows the outcome with a clean closing-callout-safe area. Keep subject treatment, palette, and lighting consistent across the ordered 16:9 sequence.",
  "model": "auto",
  "count": 3,
  "output_relationship": "sequence",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "16:9"},
  "client_request_id": "wechat-article-pack-opaque-request-id"
}
```

For `transform`, preserve reference order and label every role in the prompt;
the must-preserve source belongs first. Edit an accepted individual visual with
`beatra.images.edit`, fixed as `images[0]`, and use no more than two normalized
regions on `image_index: 0`.

## Confirm, monitor, and recover

Freeze the prompt, visual roles and order, count, `sequence` relationship,
canvas, source order, text treatment, model, and controls before one paid
submission. Submit once using one opaque stable request ID. Only an unknown
creation response permits an identical replay with that same ID. Recover a lost
task ID through `beatra.tasks.list`, then `beatra.tasks.get` verification.

Call `beatra.tasks.cancel` only at the user's direction. A `409` means the
original task continues. Deliver only the returned artifact order, dimensions,
and terminal usage or billing values.
