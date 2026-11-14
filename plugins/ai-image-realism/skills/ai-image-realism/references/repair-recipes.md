# Repair recipes

Use an uploaded Beatra artifact for a local file, or another supported image reference
accepted by the live tool. Preserve the first image as the base for edits. Keep
`model=auto` unless the user chooses a verified live model, and keep `count=1`.

## Bounded anatomy repair

Call `beatra.images.edit` with at most two normalized base-image rectangles:

```json
{
  "prompt": "Repair the extra fingers on the subject's right hand. Keep the face, pose, clothing, background, lighting, crop, and all other details unchanged.",
  "images": [{"type": "artifact", "artifact_id": "art_base"}],
  "edit_regions": [{"image_index": 0, "x": 0.62, "y": 0.48, "width": 0.18, "height": 0.24}],
  "count": 1,
  "client_request_id": "opaque-new-id"
}
```

`edit_regions` are rectangles in normalized `0..1` coordinates, not masks. Clamp every
rectangle to the base-image bounds and cover only the confirmed defect.

## Whole-image texture repair

Call `beatra.images.edit` without regions when the issue spans the image:

```json
{
  "prompt": "Reduce plastic-looking skin and over-sharpened texture across the portrait while preserving identity, expression, hairstyle, clothing, background, composition, and lighting direction.",
  "images": [{"type": "artifact", "artifact_id": "art_base"}],
  "count": 1,
  "client_request_id": "opaque-new-id"
}
```

## Explicit recomposition

Call `beatra.images.transform` when the user asks for a new scene or composition. Reuse
every stated must-keep and ask only for missing details that change the result or paid
payload:

```json
{
  "prompt": "Recompose this product image into a less formulaic editorial scene. Keep the product shape, color, packaging, and brand mark recognizable; use the source only as composition guidance.",
  "images": [{"type": "artifact", "artifact_id": "art_base"}],
  "canvas": {"type": "preset", "tier": "2K", "aspect": "source"},
  "count": 1,
  "client_request_id": "opaque-new-id"
}
```

Transform treats source images as guidance, so review typography, logo geometry, identity,
and product fidelity after delivery and report any visible drift. Never silently switch an
ordinary edit request to transform or generation.
