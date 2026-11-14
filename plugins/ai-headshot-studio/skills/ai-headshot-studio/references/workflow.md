# Workflow

## Build one headshot brief

Translate the professional context, industry, style direction, background,
lighting, and any visual references into a single coherent prompt. Keep the
prompt focused on composition, background, attire, lighting, and identity
preservation—not on altering the person's facial features.

## Prepare the selected route

### Transform a selfie into a professional headshot

Use `beatra.images.transform` with the source selfie as the first ordered
reference. Label the person's identity cues explicitly. Specify the square 1:1
canvas, the industry style, and the background.

```json
{
  "prompt": "Studio-quality professional corporate headshot, square 1:1 composition. Image 1 is the source person; preserve their facial structure, skin tone, eye color, and hair exactly. Professional navy suit with white shirt, confident approachable expression with a slight smile, direct eye contact. Clean soft gray background, softly blurred. Soft studio key light at 45 degrees with gentle fill, sharp focus on the eyes, even professional lighting. Head-and-shoulders framing, face within the center 60% of the frame for circular crop compatibility.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<source-selfie-artifact-id>"}
  ],
  "client_request_id": "headshot-transform-corporate-001"
}
```

### Transform with a background reference

Use `beatra.images.transform` with the source selfie first and the background
reference second. Label each image's role explicitly so the model preserves the
person and uses the second image only for the background or setting.

```json
{
  "prompt": "Studio-quality professional tech-industry headshot, square 1:1 composition. Image 1 is the source person; preserve their facial structure, skin tone, eye color, and hair exactly. Image 2 guides only the desired background and environment mood—use it as a softly blurred office setting behind the person, not as a person reference. Smart casual attire: blazer over open-collar shirt. Confident approachable expression, direct eye contact. Bright natural-feeling lighting as if from a large window, sharp focus on the eyes. Head-and-shoulders framing with the face centered for circular crop compatibility.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<source-selfie-artifact-id>"},
    {"type": "artifact", "artifact_id": "<background-reference-artifact-id>"}
  ],
  "client_request_id": "headshot-transform-bg-ref-001"
}
```

When more than one reference is supplied, their order matters. The source selfie
should always be `images[0]`. Later images guide background, style, or
environment only. The last image anchors the output ratio when canvas aspect is
`source`.

### Edit an accepted headshot

Use `beatra.images.edit` with the accepted headshot as `images[0]`. Use at most
two normalized `edit_regions` for targeted fixes; omit regions for a whole-image
adjustment.

```json
{
  "prompt": "Brighten the overall lighting slightly and add a gentle fill light from the left to reduce shadow on the right side of the face. Keep the person's identity, attire, background, and composition unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-headshot-artifact-id>"}
  ],
  "client_request_id": "headshot-refine-lighting-001"
}
```

For a localized fix—adjusting the background in one area or refining a specific
detail—use `edit_regions`:

```json
{
  "prompt": "Smooth the small shadow gradient in the lower-right background area to create a more uniform background. Keep everything else unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-headshot-artifact-id>"}
  ],
  "edit_regions": [
    {
      "image_index": 0,
      "x": 0.60,
      "y": 0.55,
      "width": 0.35,
      "height": 0.40
    }
  ],
  "client_request_id": "headshot-refine-bg-001"
}
```

## Apply model controls

Keep `model=auto` unless the user explicitly requests a concrete model. Keep
`count=1`—a headshot requires precision and identity fidelity, not variation.
Call `beatra.models.list` with the relevant capability (`image_to_image` or
`image_edit`) only when the user asks about model availability, compatibility,
or price.

## Confirm, submit once, and monitor

Present one final confirmation card containing the complete prompt, ordered
references, canvas, style direction, background, lighting, count, and model.
After approval, create one stable opaque `client_request_id` and submit once.
Record the returned `task_id` and poll with `beatra.tasks.get`.

A changed prompt, reference set or order, canvas, style direction, background,
model, count, or control value is new paid work requiring a new confirmation
and a new `client_request_id`.
