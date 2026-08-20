# Workflow

## Verify the ordered-carousel route

For a two-to-four-slide carousel, first call `beatra.models.list` through the
bundled client and verify live support for the intended generation or transform
capability, the selected count, final 3:4 canvas, and
`output_relationship: "sequence"`. The default is `model: "auto"`; do not make
up a compatible concrete model. If live compatibility is absent, show that fact
and obtain the user's choice between one image or several separate paid calls.
Never replace a requested sequence with independent candidates without consent.

## Build one confirmed sequence request

Use `beatra.images.generate` from a content outline or
`beatra.images.transform` when a photo set or image references must guide the
set. Submit remote calls only with `python3 scripts/mcp_client.py call
<tool-name>` and one JSON object on standard input; do not use a host connector
or REST fallback.

```json
{
  "prompt": "Create a four-slide Xiaohongshu carousel in a coherent 3:4 visual system. Slide 1: hook cover showing the hero product with clean upper-third headline-safe space. Slide 2: product detail in the same warm cream and coral palette. Slide 3: three-step usage scene with one central action. Slide 4: lifestyle closing scene with a clean call-to-action-safe area. Keep the same product, palette, lighting, and editorial style across the ordered sequence.",
  "model": "auto",
  "count": 4,
  "output_relationship": "sequence",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "client_request_id": "rednote-carousel-opaque-request-id"
}
```

For transforms, preserve the declared image order and label every reference
role in the prompt. The must-preserve source is first. To refine an accepted
individual slide, call `beatra.images.edit` with it at `images[0]` and no more
than two normalized regions on `image_index: 0`.

## Confirm, monitor, and recover

Before the paid call, freeze the prompt, slide roles and count, `sequence`
relationship, canvas, source order, text treatment, model, and controls. Use
one opaque stable request ID and submit once. Only an unknown creation response
may be retried with the identical payload and same ID. Recover a lost task ID
through `beatra.tasks.list` followed by `beatra.tasks.get` verification.

Call `beatra.tasks.cancel` only at the user's instruction. A `409` means the
original sequence task continues. Deliver slide artifacts in the returned
order, with only dimensions and billing values actually present in the terminal
task result.
