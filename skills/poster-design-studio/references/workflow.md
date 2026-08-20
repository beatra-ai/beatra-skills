# Workflow

## Build one poster brief

Translate the poster type, headline message, style direction, canvas, and any
visual references into a single coherent prompt. Keep the prompt focused on
composition, visual hierarchy, category styling, color, lighting, and text-safe
zone—not on changing the source subject.

## Prepare the selected route

### Generate a poster from a topic

Use `beatra.images.generate` when no source photo is required. Turn the campaign
topic into a complete poster visual with explicit canvas, mood, hierarchy, and
text-safe zone.

```json
{
  "prompt": "Scroll-stopping music festival poster, vertical 2:3 composition. Vibrant energetic stage scene with a single performer silhouette as the focal anchor, glowing magenta and cyan stage lights, motion and atmosphere. Strong visual hierarchy: dominant hero image, clean high-contrast text-safe band across the top third for the headline, structured detail band at the bottom for date and venue. Bold dynamic mood, deep cinematic contrast, photo-rich finish.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "2:3"
  },
  "client_request_id": "poster-topic-festival-001"
}
```

### Generate a social media graphic from a topic

Use `beatra.images.generate` with the platform-native ratio.

```json
{
  "prompt": "Promotional sale graphic for social media, 1:1 square composition. Warm appetizing product hero centered, brand orange and cream palette, soft studio lighting with subtle contact shadow. Clean text-safe band across the lower third for the offer and call-to-action. High contrast readiness for bold headline text, friendly approachable mood.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "1:1"
  },
  "client_request_id": "poster-topic-sale-001"
}
```

### Transform a photo into a poster

Use `beatra.images.transform` with the source photo as the first ordered
reference. Label the subject's role explicitly. Specify the canvas and the
text-safe zone.

```json
{
  "prompt": "Scroll-stopping product launch poster, vertical 3:4 composition. Image 1 is the hero product; preserve its shape, color, and details exactly. Clean futuristic dark gradient background with electric blue accents, product sharply in focus and filling 60% of the frame, subtle contact shadow for grounding. Strong visual hierarchy with a clean text-safe band across the top third for the headline and a structured detail band at the bottom for the date.",
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
  "client_request_id": "poster-transform-launch-001"
}
```

### Transform with multiple references

Use `beatra.images.transform` with the source photo first and optional brand
color or style references after. Label each image's role.

```json
{
  "prompt": "Scroll-stopping fashion promotional banner, 16:9 composition. Image 1 is the model wearing the collection; preserve their appearance exactly. Image 2 guides only the brand color palette and editorial mood. Editorial bold composition, high-contrast neutral palette with a single bold accent, full-frame subject, clean studio backdrop. Subject positioned left-of-center, clean text-safe zone on the right third for the headline and call-to-action.",
  "model": "auto",
  "count": 1,
  "canvas": {
    "type": "preset",
    "tier": "2K",
    "aspect": "16:9"
  },
  "images": [
    {"type": "artifact", "artifact_id": "<source-photo-artifact-id>"},
    {"type": "artifact", "artifact_id": "<brand-color-reference-artifact-id>"}
  ],
  "client_request_id": "poster-transform-fashion-001"
}
```

When more than one reference is supplied, their order matters. The source photo
should always be `images[0]`. Later images guide style, color, brand palette, or
composition only. The last image anchors the output ratio when canvas aspect is
`source`.

### Edit an accepted draft

Use `beatra.images.edit` with the accepted poster as `images[0]`. Use at most
two normalized `edit_regions` for targeted fixes; omit regions for a whole-image
adjustment.

```json
{
  "prompt": "Warm the overall color temperature slightly and increase contrast for stronger headline readability. Keep the composition, hero subject, and text-safe zone unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-poster-artifact-id>"}
  ],
  "client_request_id": "poster-refine-001"
}
```

For a localized fix—cleaning a distracting element in one corner or sharpening
the text band—use `edit_regions`:

```json
{
  "prompt": "Clean up the small cluttered detail in the lower-left corner so the detail band stays legible. Keep everything else unchanged.",
  "model": "auto",
  "count": 1,
  "images": [
    {"type": "artifact", "artifact_id": "<accepted-poster-artifact-id>"}
  ],
  "edit_regions": [
    {
      "image_index": 0,
      "x": 0.05,
      "y": 0.75,
      "width": 0.18,
      "height": 0.18
    }
  ],
  "client_request_id": "poster-fix-corner-001"
}
```

## Apply model controls

Keep `model=auto` unless the user explicitly requests a concrete model. Keep
`count=1`—a poster requires precision, not variation. Call `beatra.models.list`
with the relevant capability (`text_to_image`, `image_to_image`, or
`image_edit`) only when the user asks about model availability, compatibility,
or price.

## Confirm, submit once, and monitor

Present one final confirmation card containing the complete prompt, ordered
references, canvas, poster type, style direction, text-safe zone, count, and
model. After approval, create one stable opaque `client_request_id` and submit
once. Record the returned `task_id` and poll with `beatra.tasks.get`.

A changed prompt, reference set or order, canvas, poster type, style direction,
model, count, or control value is new paid work requiring a new confirmation and
a new `client_request_id`.
