# REDnote OOTD Lookbook workflow

Use this reference after the visual story is selected. It defines the image
routes, one confirmation boundary, task handling, and the final review.

Every remote operation runs through the bundled `scripts/mcp_client.py`. Pass
one JSON object on standard input after `call <tool-name>`; never configure a
host Beatra Connector or use REST/OpenAPI as a fallback.

## 1. Make the ordered lookbook plan

Use the four-slide default unless the user explicitly asks for a different
scope. Every slide has a distinct visual job and shares the same outfit
must-keeps, palette, lighting family, and story angle.

| Slide | Visual job | Default composition |
| --- | --- | --- |
| Cover | Invite a click and introduce the outfit story | Strong outfit focal point with clean upper or side title space |
| Full look | Make silhouette, layers, and proportions readable | Full body or three-quarter frame |
| Detail | Show the memorable styling move | Tight crop on texture, accessory, shoe, bag, or color pairing |
| Lifestyle | Place the outfit in its intended moment | Occasion-led scene with the outfit still readable |

For every source photo, keep a private note of its declared role. The host may
describe only visual information it can actually access. A user-supplied
garment, color, material, accessory, or person detail becomes a must-keep in
the prompt; it does not become an invented product claim.

Read [lookbook planning](lookbook-planning.md) when the story card, tone, or
caption angle needs more definition.

## 2. Prepare media and the current model card

Upload each local source with the bundled helper and retain the returned
artifact reference:

```text
python3 scripts/mcp_client.py upload ./ootd-reference.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./street-style-reference.png --mime-type image/png
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For `beatra.images.transform`, place the outfit reference at `images[0]`.
Later images guide the named composition, palette, scene, or styling direction
in the user's stated order. Use an explicit preset canvas for vertical slides;
when `aspect: "source"` is selected, the final reference determines the ratio.

Read the matching current `beatra.models.list` card before deciding a concrete
model, price, canvas, optional control, count, or output relationship. For the
normal source-photo route, inspect `image_to_image`; for a concept-only route,
inspect `text_to_image`; for an accepted-slide revision, inspect `image_edit`.
The normal four-slide route requires a card that accepts `count: 4`,
`output_relationship: "sequence"`, the vertical canvas, and the selected
controls. Calculate the maximum charge from the returned billing basis and
keep `model: "auto"` with model-managed controls when the user has not made a
choice that needs the live card.

## 3. Submit one coordinated sequence

For a source-photo lookbook, use one transform request that creates the four
approved slides as a sequence. Keep the source outfit at `images[0]` and
describe its role plus every frozen slide job in the prompt:

```json
{
  "images": [
    {"type": "artifact", "artifact_id": "outfit-reference"},
    {"type": "artifact", "artifact_id": "street-style-reference"}
  ],
  "prompt": "Create the approved four-slide REDnote OOTD lookbook as one coordinated vertical 3:4 editorial sequence. Image 1 is the creator's outfit reference. Preserve the stated garment silhouette, layer order, colors, visible patterns, material texture, and accessories. Image 2 guides only the approved street-style mood. Slide 1 is the cover with clear upper title space. Slide 2 is a readable full-body look. Slide 3 focuses on the approved texture and accessory detail. Slide 4 places the look in the approved soft-daylight urban lifestyle scene. Keep palette, light, and fashion direction coherent across all slides.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "model": "auto",
  "count": 4,
  "output_relationship": "sequence",
  "client_request_id": "opaque-ootd-lookbook-sequence-id"
}
```

For a styling idea with no source photo, call `beatra.images.generate` with the
same `3:4` canvas and one coordinated four-image sequence:

```json
{
  "prompt": "Create the approved four-slide REDnote OOTD lookbook as one coordinated vertical 3:4 editorial sequence for a relaxed spring commute look: cream knit polo, charcoal wide-leg trousers, tan leather tote, soft green urban morning palette. Slide 1 is the cover with clear upper title space. Slide 2 is the readable full look. Slide 3 shows the knit texture, trouser proportion, and tote detail. Slide 4 is a soft urban morning lifestyle scene. Keep the palette, light, and editorial fashion direction coherent across all slides.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "model": "auto",
  "count": 4,
  "output_relationship": "sequence",
  "client_request_id": "opaque-ootd-lookbook-concept-sequence-id"
}
```

When the matching live model card cannot make the approved four-image sequence,
show the supported output count, relationship, price basis, and resulting call
count. Ask the user to select the revised paid plan before submitting it; never
silently replace the coordinated request with independently generated slides.

For a selected slide that needs a focused improvement, use `beatra.images.edit`
with the accepted slide as `images[0]`. A local correction may carry one or two
normalized `edit_regions`; omit regions for an image-wide light, color, or
background refinement.

## 4. Freeze the paid set once

Before the first paid image call, show one confirmation block with:

- the ordered slides and their visual roles;
- the source and later reference roles in exact order;
- every full prompt and outfit must-keep;
- canvas, model behaviour, controls, `count: 4`, and
  `output_relationship: "sequence"` for the coordinated request;
- the current maximum charge from the matching live billing basis and call
  count; and
- the review and delivery plan, including the free caption and tag package.

After approval, assign the coordinated request one opaque stable
`client_request_id` and submit it once. A new slide, added candidate, or changed
source, reference order, prompt, canvas, model, count, output relationship, or
control is new paid work.

## 5. Track, review, and deliver

Store the frozen request, approval, create response, and returned `task_id` for
the sequence. Poll the original task with `beatra.tasks.get` until it reaches a
terminal state. The completed task is authoritative for artifacts, dimensions,
format, resolved model, and `billing.net_charged_credits`.

Review accessible outputs in post order:

1. Outfit must-keeps: silhouette, layers, colors, visible patterns, material,
   accessories, and user-named details.
2. Each slide's job: cover clarity, full-look readability, detail relevance,
   and lifestyle mood.
3. Set continuity: palette, light, setting language, vertical composition, and
   the progression from cover to closing slide.
4. Title-safe space and any visible detail that needs the user's decision.

Deliver the ordered artifacts with slide names, observed dimensions and format,
resolved model, task IDs, billing facts, a title shortlist, caption beats, and
a concise tag set. A selected focused correction begins a new approved request.

## 6. Recover without duplicate work

| Situation | Action |
| --- | --- |
| Create response is genuinely unknown | Replay only the identical frozen payload with the original `client_request_id`. |
| Task ID is missing | Use `beatra.tasks.list`, match candidate requests to the saved source order, prompt, canvas, model, count, and timing, then verify with `beatra.tasks.get`. |
| Task is queued or running | Continue polling the original task. |
| Upload grant expires or validation rejects a file | Get a fresh grant through the bundled upload helper while keeping the rest of the frozen request intact. |
| Model validation changes the available options | Refresh the matching `beatra.models.list` card before proposing a changed request. |
| The user requests cancellation | Call `beatra.tasks.cancel` once. A `409` means the original task remains in control, so poll it and report cancellation only after `status: canceled`. |

Slow polling, a connection problem, an update failure, or a partial sequence
result never creates a replacement paid image request.
