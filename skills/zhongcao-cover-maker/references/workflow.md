# Workflow

## Build one cover brief

Translate the note topic, category, style direction, and any visual references
into a single coherent prompt. Keep the prompt focused on composition,
background, lighting, and text-safe area—not on changing the source subject.

## Prepare the selected route

### Transform a photo into a cover

Use `beatra.images.transform` with the source photo as the first ordered
reference. Label the subject's role explicitly. Specify the vertical 3:4 canvas
and the text-safe zone.

```json
{
  "prompt": "Scroll-stopping Xiaohongshu cover photo, vertical 3:4 composition. Image 1 is the hero subject; preserve its shape, color, and details exactly. Clean softly blurred background with shallow depth of field, subject sharply in focus and filling 70% of the frame. Bright airy lighting, warm natural color palette. Reserve a clean text-safe area in the upper third for headline overlay.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "3:4"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<source-photo-artifact-id>"}
  ],
  "client_request_id": "zhongcao-cover-transform-001"
}
```

### Transform with multiple references

Use `beatra.images.transform` with the source photo first and optional style or
color references after. Label each image's role.

```json
{
  "prompt": "Scroll-stopping Xiaohongshu OOTD cover, vertical 3:4 composition. Image 1 is the person wearing the outfit; preserve their appearance exactly. Image 2 guides only the desired background style and color mood. Editorial street-style background, clean and minimal, golden hour side lighting, warm neutral tones. Subject positioned in the lower two-thirds, clean sky in the upper third for headline text.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "3:4"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<source-photo-artifact-id>"},
    {"type": "artifact", "artifact_id": "<style-reference-artifact-id>"}
  ],
  "client_request_id": "zhongcao-cover-ootd-001"
}
```

When more than one reference is supplied, their order matters. The source photo
should always be `images[0]`. Later images guide style, color, or composition
only. The last image anchors the output ratio when canvas aspect is `source`.

### Generate a cover concept from a topic

Use `beatra.images.generate` when no source photo exists. Turn the topic into a
visual concept with explicit canvas, mood, and text-safe zone.

```json
{
  "prompt": "Xiaohongshu knowledge-tips cover concept, vertical 3:4 composition. Clean flat-lay of a tidy desk with a notebook, pen, and coffee cup on a soft cream background. Top-down view, bright even lighting, minimal shadows. Pastel accent colors. Large clean negative space in the center for headline text overlay. Modern, fresh, scroll-stopping aesthetic.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "3:4"
  },
  "client_request_id": "zhongcao-cover-concept-001"
}
```

### Edit an accepted cover

Use `beatra.images.edit` with the accepted cover as `images[0]`. Use at most
two normalized `edit_regions` for targeted fixes; omit regions for a whole-image
adjustment.

```json
{
  "prompt": "Brighten the overall image slightly and warm the color temperature by 200K. Keep the composition, subject, and text-safe area unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-cover-artifact-id>"}
  ],
  "client_request_id": "zhongcao-cover-refine-001"
}
```

For a localized fix—removing a distracting object or cleaning a blemish in one
corner—use `edit_regions`:

```json
{
  "prompt": "Remove the small dark spot in the lower-left corner background. Keep everything else unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-cover-artifact-id>"}
  ],
  "edit_regions": [
    {
      "image_index": 0,
      "x": 0.05,
      "y": 0.75,
      "width": 0.15,
      "height": 0.15
    }
  ],
  "client_request_id": "zhongcao-cover-fix-spot-001"
}
```

## Apply model controls

Keep `model=auto` unless the user explicitly requests a concrete model. Keep
`count=1`—a cover requires precision, not variation. Call `beatra.models.list`
with the relevant capability (`image_to_image`, `image_edit`, or
`text_to_image`) only when the user asks about model availability,
compatibility, or price.

## Confirm, submit once, and monitor

Present one final confirmation card containing the complete prompt, ordered
references, canvas, style direction, text-safe zone, count, and model. After
approval, create one stable opaque `client_request_id` and submit once. Record
the returned `task_id` and poll with `beatra.tasks.get`.

A changed prompt, reference set or order, canvas, style direction, model,
count, or control value is new paid work requiring a new confirmation and a new
`client_request_id`.
