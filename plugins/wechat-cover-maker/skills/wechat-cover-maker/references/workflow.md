# WeChat cover workflow

## 1. Build one cover brief

Start from the input required by the chosen route: a title or topic for generate; ordered
visual references plus a clear cover goal for transform; or an accepted draft plus the
requested change for edit. Reuse conversation context and ask only for a material gap that
would change the selected route or result, such as audience, tone, target canvas,
title-in-image choice, or a detail that must remain recognizable. Write a compact brief
containing:

- one message and one visual hook;
- one focal subject and the supporting environment;
- one explicit target canvas;
- title-in-image or text-free title-safe-area treatment;
- must-keep and must-avoid constraints;
- ordered visual references, if any.

Do not write the article, invent a traffic promise, or split one request into multiple
ratios. See [intent and routing](intent-and-routing.md) for the route decision and [canvas
and cover craft](canvas-and-cover-craft.md) for the visual specification.

## 2. Prepare the selected route

Use only the bundled `scripts/mcp_client.py` for every call. For a local reference, run its
upload helper once with the correct MIME type and use the returned artifact reference.
Each upload uses a fresh grant; never reuse a grant. Uploading is transport, not visual
analysis.

### Generate without references

Call `beatra.images.generate` with an explicit canvas:

```json
{
  "prompt": "Editorial cover with one coral paper boat crossing a dark blue field, strong left-to-right movement, ivory negative space in the upper-right title-safe area, no text, no logos",
  "model": "auto",
  "canvas": {"type": "target", "width": 900, "height": 383},
  "count": 1,
  "client_request_id": "opaque-stable-id"
}
```

### Transform with ordered references

Call `beatra.images.transform` with one to four references in declared order and an
explicit canvas. State the role of each reference in the prompt. Never use `aspect:
"source"` here because it would inherit the last reference rather than the chosen cover
canvas.

```json
{
  "prompt": "Create an editorial WeChat article cover. Image 1 is the product whose silhouette and colors should remain recognizable. Image 2 guides only the restrained paper-cut style. Place one focal product left of center and reserve a clean high-contrast title-safe area on the right. No text.",
  "images": [
    {"type": "artifact", "artifact_id": "art_product"},
    {"type": "artifact", "artifact_id": "art_style"}
  ],
  "model": "auto",
  "canvas": {"type": "target", "width": 900, "height": 383},
  "count": 1,
  "client_request_id": "opaque-stable-id"
}
```

### Edit an accepted draft

Call `beatra.images.edit` with the accepted draft at `images[0]`; later images may only be
supporting references. For a local repair, use normalized `0..1` rectangles entirely
inside the base image, always set `image_index=0`, and use at most two regions. Omit
`edit_regions` for an image-wide light, color, or texture adjustment. For a local repair,
keep the accepted aspect ratio in a currently compatible explicit preset and include that
preset in the existing paid-call confirmation; do not silently submit an incompatible
small target or change the confirmed aspect ratio.

```json
{
  "prompt": "Increase contrast only behind the title-safe area while preserving the focal subject, composition, colors, and all other details.",
  "images": [{"type": "artifact", "artifact_id": "art_accepted_draft"}],
  "edit_regions": [
    {"image_index": 0, "x": 0.58, "y": 0.08, "width": 0.34, "height": 0.42}
  ],
  "model": "auto",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "900:383"},
  "count": 1,
  "client_request_id": "opaque-new-id"
}
```

## 3. Apply color and model controls sparingly

Write a single brand color directly in the prompt. Use structured `palette` only when the
brief needs three to ten exact `#RRGGBB` colors; every positive weight has at most four
decimal places and the weights sum exactly to `1.0000`. Do not silently remove an
unsupported palette.

Default to `model=auto`. Use `beatra.models.list` only when the user explicitly asks to
select or compare models, asks for current pricing, or when a genuine compatibility issue
must be resolved. Query `text_to_image` for generate, `image_to_image` for transform, and
`image_edit` for edit. Do not browse the model catalog speculatively.

## 4. Confirm, submit once, and monitor

Show the final prompt, reference order, canvas, model, controls, `count=1`, and that the
request is paid. After confirmation, freeze those parameters, create one opaque stable
`client_request_id`, and submit one call. Never submit separately for hidden variants or
extra canvases.

Poll the accepted task with `beatra.tasks.get`. Use the recovery rules in [review and
recovery](review-and-recovery.md); queued or running work is not permission to resubmit.
