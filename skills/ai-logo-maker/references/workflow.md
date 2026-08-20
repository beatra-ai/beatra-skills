# Workflow

## Build one logo brief

Translate the brand name, industry cue, style direction, and logo type into a
single coherent prompt. Keep the prompt focused on the visual result, not on
process language. Include scalability constraints directly.

Example prompt structure:

> Professional logo for [brand name], [industry] industry, [style direction]
> [logo type]. Bold simple silhouette, maximum three solid colors, high
> contrast, no gradients, no fine detail, centered composition with generous
> safe area, recognizable at small sizes.

## Prepare the selected route

### Generate without references

Use `beatra.images.generate` when there are no source images.

```json
{
  "prompt": "Professional logo for Lumen, a tech startup, minimalist abstract mark. Bold geometric shape suggesting a light beam, deep blue and electric cyan, white background, strong silhouette, no text, no gradients, scalable to favicon.",
  "model": "auto",
  "count": 2,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "client_request_id": "lumen-logo-explore-001"
}
```

### Transform with ordered references

Use `beatra.images.transform` with one to four ordered references. Upload local
files through the bundled client helpers first, then reference the returned
artifact IDs. Label each image's role explicitly in the prompt so the model
understands which reference guides what.

```json
{
  "prompt": "Professional logo for Lumen. Image 1 is a hand-drawn sketch whose geometric outline and arrow motif should anchor the composition. Image 2 guides only the color palette (deep blue and electric cyan). Refine into a clean mark with strong silhouette, white background, centered, scalable to favicon.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<sketch-artifact-id>"},
    {"type": "artifact", "artifact_id": "<color-reference-artifact-id>"}
  ],
  "client_request_id": "lumen-logo-from-sketch-001"
}
```

When more than one reference is supplied, their order matters. The last image
anchors the output ratio when canvas aspect is `source`.

### Edit an accepted draft

Use `beatra.images.edit` with the draft as `images[0]`. Later entries are
optional references. Use at most two normalized `edit_regions` for targeted
work; omit regions for a whole-image adjustment.

```json
{
  "prompt": "Simplify the logo mark, reduce to two colors, strengthen the silhouette for small-size clarity, keep the overall composition.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-draft-artifact-id>"}
  ],
  "edit_regions": [
    {
      "image_index": 0,
      "x": 0.2,
      "y": 0.15,
      "width": 0.6,
      "height": 0.5
    }
  ],
  "client_request_id": "lumen-logo-refine-001"
}
```

## Apply brand colors and model controls

### Palette

When the user provides exact brand colors, encode them as a structured
`palette`:

```json
"palette": [
  {"r": 14, "g": 77, "b": 146, "weight": 0.6},
  {"r": 0, "g": 196, "b": 255, "weight": 0.3},
  {"r": 255, "g": 255, "b": 255, "weight": 0.1}
]
```

Rules: three to ten entries, each `r`/`g`/`b` 0–255, `weight` 0–1 with up to
four decimal places, all weights sum to exactly `1.0000`.

### Model and count

Keep `model=auto` unless the user explicitly requests a concrete model. Keep
`count=2` for initial generation exploration, `count=1` for transform and edit.
Call `beatra.models.list` with the relevant capability
(`text_to_image`, `image_to_image`, or `image_edit`) only when the user asks
about model availability, compatibility, or price.

## Confirm, submit once, and monitor

Present one final confirmation card containing the complete prompt, ordered
references, canvas, palette, logo type, count, and model. After approval,
create one stable opaque `client_request_id` and submit once. Record the
returned `task_id` and poll with `beatra.tasks.get`.

A changed prompt, reference set or order, canvas, palette, model, count, or
control value is new paid work requiring a new confirmation and a new
`client_request_id`.
