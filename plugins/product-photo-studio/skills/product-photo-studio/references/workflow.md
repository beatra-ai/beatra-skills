# Workflow

## Build one product image brief

Translate the product type, target marketplace, background or scene direction,
and any style references into a single coherent prompt. Keep the prompt focused
on the background and scene, not on changing the product.

## Prepare the selected route

### Transform to clean background

Use `beatra.images.transform` with the product photo as the first ordered
reference. Label the product's role explicitly.

```json
{
  "prompt": "Professional ecommerce product photo. Image 1 is the product reference; match its shape, color, label, and proportions closely. Place it on a pure white background, with even studio lighting, a subtle contact shadow, and clean edges with no halo.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<product-photo-artifact-id>"}
  ],
  "client_request_id": "product-clean-bg-001"
}
```

### Transform to lifestyle scene

Use `beatra.images.transform` with the product photo first and optional style
or background references after. Label each image's role.

```json
{
  "prompt": "Professional lifestyle product photo. Image 1 is the product reference; match its shape, color, label, and proportions closely. Image 2 guides only the desired scene style and color palette. Place the product on a warm wooden kitchen counter, soft morning window light from the left, shallow depth of field, natural contact shadow.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<product-photo-artifact-id>"},
    {"type": "artifact", "artifact_id": "<scene-style-artifact-id>"}
  ],
  "client_request_id": "product-lifestyle-001"
}
```

When more than one reference is supplied, their order matters. The product
photo should always be `images[0]`. Later images guide style, background, or
angle only. The last image anchors the output ratio when canvas aspect is
`source`.

### Edit an accepted draft

Use `beatra.images.edit` with the accepted image as `images[0]`. Use at most
two normalized `edit_regions` for targeted fixes; omit regions for a
whole-image adjustment.

```json
{
  "prompt": "Remove the small reflection on the lower left of the product bottle. Keep everything else unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-draft-artifact-id>"}
  ],
  "edit_regions": [
    {
      "image_index": 0,
      "x": 0.1,
      "y": 0.6,
      "width": 0.25,
      "height": 0.2
    }
  ],
  "client_request_id": "product-fix-reflection-001"
}
```

## Apply model controls

Keep `model=auto` unless the user explicitly requests a concrete model. Keep
`count=1`—product photography requires precision, not variation. Call
`beatra.models.list` with the relevant capability (`image_to_image` or
`image_edit`) only when the user asks about model availability, compatibility,
or price.

## Confirm, submit once, and monitor

Present one final confirmation card containing the complete prompt, ordered
references, canvas, background or scene direction, count, and model. After
approval, create one stable opaque `client_request_id` and submit once. Record
the returned `task_id` and poll with `beatra.tasks.get`.

A changed prompt, reference set or order, canvas, scene direction, model,
count, or control value is new paid work requiring a new confirmation and a new
`client_request_id`.
