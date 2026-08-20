# REDnote Food Note workflow

Use this reference after the food story is selected. It defines the image routes,
confirmation boundary, task handling, and final review. Every remote operation
runs through bundled `scripts/mcp_client.py`: pass one JSON object on standard
input after `call <tool-name>`, never a host Beatra Connector or REST/OpenAPI.

## 1. Plan the ordered food note

Use four slides unless the user explicitly chooses another scope. The shared
anchors are user-confirmed food must-keeps, palette, lighting family, and story
angle.

| Slide | Visual job | Default composition |
| --- | --- | --- |
| Cover | Invite a click and introduce the food story | Appealing food focal point with upper or side title space |
| Signature dish | Make the main dish and plating clear | Close or medium food frame anchored on the dish |
| Detail | Show a memorable food or table moment | Tight crop on texture, lift, cut, garnish, tableware, or approved packaging |
| Dining atmosphere | Close the visit story | Table, restaurant, or dining scene that completes the food story |

Keep a private declared role for each source. Describe only visual information
that is accessible. User-supplied dishes, ingredients, plating, tableware,
packages, restaurant facts, and preferences are must-keeps; they do not become
invented menu or taste claims. See [food-note planning](food-note-planning.md).

## 2. Prepare media and the live model card

Upload local sources through the bundle and retain returned artifact references:

```text
python3 scripts/mcp_client.py upload ./dish-reference.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./restaurant-mood-reference.png --mime-type image/png
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For transform the main food reference is `images[0]`; at most three later
references guide named styling, palette, composition, or setting in the user's
order. Use the explicit `2K` / `3:4` preset for this package. If
`aspect: "source"` is used instead, the final reference determines the ratio.

Read matching `beatra.models.list` before deciding a model, price, canvas,
optional control, count, or output relationship: `image_to_image` for a source
photo, `text_to_image` for a concept, and `image_edit` for a chosen slide. The
default proceeds only when the live card accepts `count: 4`,
`output_relationship: "sequence"`, the `2K` / `3:4` canvas, and selected
controls. Calculate maximum charge from its billing basis. Keep `model: "auto"`
and model-managed controls unless the user has made that decision.

## 3. Submit one coordinated sequence

For a source-photo note, call transform with the primary food artifact at
`images[0]` and explicit roles:

```json
{
  "images": [
    {"type": "artifact", "artifact_id": "dish-reference"},
    {"type": "artifact", "artifact_id": "restaurant-mood-reference"}
  ],
  "prompt": "Create the approved four-slide REDnote food note as one coordinated vertical 3:4 sequence. Image 1 is the user's primary dish reference; retain user-confirmed dish, plating, visible tableware, packaging, and named visual details. Image 2 guides only the approved restaurant mood and palette. Slide 1 is the appetizing cover with upper title space. Slide 2 is the main-dish close-up. Slide 3 focuses on the approved texture, lifted or cut food moment, or tabletop detail. Slide 4 is the dining-atmosphere closing image with a final detail that supports the food recommendation post. Keep palette, light, and food-story direction coherent across all slides.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "model": "auto",
  "count": 4,
  "output_relationship": "sequence",
  "client_request_id": "opaque-food-note-sequence-id"
}
```

For a concrete dish or visit concept with no source photo, call generate with
the same canvas, count, and relationship:

```json
{
  "prompt": "Create the approved four-slide REDnote food note as one coordinated vertical 3:4 sequence for the user's confirmed dish and visit concept. Slide 1 is the appetizing cover with upper title space. Slide 2 is a close view of the described signature dish and plating. Slide 3 shows the approved food texture, serving moment, or tabletop detail. Slide 4 is the described dining-atmosphere closing image with a final detail that supports the food recommendation post. Keep the user-confirmed dish, setting, palette, light, and food-story direction coherent across all slides.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "model": "auto",
  "count": 4,
  "output_relationship": "sequence",
  "client_request_id": "opaque-food-note-concept-sequence-id"
}
```

If the live card cannot make the approved coordinated sequence, show supported
count, relationship, price basis, and resulting call count. Let the user choose
the revised paid plan; never silently turn it into independent slides.

For a selected slide, call edit with the accepted image at `images[0]`. Use no
more than two normalized `edit_regions`, both with `image_index: 0`, only for
local corrections. Omit regions for image-wide light, color, or background
refinement. Editing is a new single-image paid revision, not a sequence
substitute.

## 4. Freeze paid work once

Before the first paid call, show one confirmation block with:

- the ordered slide roles;
- source and later reference roles in exact order;
- the full prompt and all user-confirmed food must-keeps;
- canvas, model behaviour, controls, `count: 4`, and
  `output_relationship: "sequence"`;
- current maximum charge from the matching live billing basis and total calls;
  and
- review and delivery plan, including free caption and tag package.

After approval, assign one opaque stable `client_request_id` to this logical
sequence and submit it once. A changed slide, prompt, source, reference order,
canvas, model, control, count, or relationship is fresh confirmed work with a
fresh ID.

## 5. Track, review, and deliver

Save frozen payload, approval, create response, and `task_id`. Poll only the
original task using `beatra.tasks.get` to `succeeded`, `failed`, or `canceled`;
`queued` and `running` are progress only. Completed-task facts are authoritative
for artifact URLs or IDs, dimensions, format, resolved model, and
`billing.net_charged_credits`.

Review accessible outputs in post order for user-confirmed food, plating,
tableware, packaging, each slide's role, unified warm or natural light and
dining mood, `3:4`, and cover title-safe space. Deliver artifacts in note order
with actual facts, title shortlist, caption beats, tag set, and at most one
focused unexecuted revision suggestion.

## 6. Recover without duplicate work

| Situation | Action |
| --- | --- |
| Create response is genuinely unknown | Replay only the byte-equivalent frozen payload with its original `client_request_id`. |
| Task ID is missing | Use `beatra.tasks.list` (narrow by capability when useful), match candidates to saved prompt, reference order, canvas, model, count, and timing, then verify using `beatra.tasks.get`. |
| Task is queued or running | Continue polling the original task. |
| Upload grant expires or validation rejects a file | Obtain a fresh grant through bundled upload while preserving the rest of the frozen request. |
| Model validation changes options | Refresh matching `beatra.models.list` before proposing changed work. |
| User requests cancellation | Call `beatra.tasks.cancel` once. A `409` means the original remains in control: poll and report cancellation only when terminal `status` is `canceled`. |

Slow polling, connection or authentication trouble, update failure, or a partial
sequence result never authorizes replacement paid work.
