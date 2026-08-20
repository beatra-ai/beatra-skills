# REDnote Local Business Note workflow

Use this reference after the business-note card is selected. It defines image
routes, paid confirmation, task handling, and delivery review. Every remote
operation runs through bundled `scripts/mcp_client.py`: pass one JSON object on
standard input after `call <tool-name>`, never a host Beatra Connector or
REST/OpenAPI.

## Plan the ordered local-business note

The default is three slides. They share user-provided facts, visual must-keeps,
palette, lighting family, and visitor angle.

| Slide | Visual job | Default composition |
| --- | --- | --- |
| Store-front cover | Make the business recognisable and invite discovery | Exterior, entrance, sign, or a clear place-led scene with title-safe space |
| Store or service highlight | Show one space, visitor experience, signature service, or featured product | Medium scene or close detail anchored on the stated focal point |
| Visit-ready close | Complete the visit story and give verified details a place to land | Calm local atmosphere with a clean upper, side, or lower text-safe area |

Keep a private declared role for every source. Describe only visual information
that is accessible. A user-provided storefront, space, service, product, brand,
and named visual details are must-keeps; city, address, hours, price, offer,
availability, booking details, credentials, results, and service claims appear
only when the user supplied them. See
[local-business note planning](local-business-note-planning.md).

## Prepare media and the live model card

Upload local sources through the bundle and retain the returned artifact
references:

```text
python3 scripts/mcp_client.py upload ./storefront-reference.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./brand-mood-reference.png --mime-type image/png
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For transform, place the business anchor at `images[0]`; at most three later
references guide named styling, palette, composition, or setting in the user's
order. Use the explicit `2K` / `3:4` preset for this package. If the user
chooses `aspect: "source"`, the final reference, not the first source, anchors
the ratio; disclose that order in the confirmation.

Read matching `beatra.models.list` before deciding a model, price, canvas,
optional control, count, or output relationship: `image_to_image` for source
photos, `text_to_image` for a concept, and `image_edit` for an accepted slide.
The default proceeds only when the live card accepts `count: 3`,
`output_relationship: "sequence"`, the `2K` / `3:4` canvas, and selected
controls. Calculate the maximum charge from its billing basis. Keep
`model: "auto"` and model-managed controls unless the user has made that
decision.

## Submit one coordinated sequence

For a source-photo note, call transform with the primary business artifact at
`images[0]` and explicit reference roles:

```json
{
  "images": [
    {"type": "artifact", "artifact_id": "storefront-reference"},
    {"type": "artifact", "artifact_id": "brand-mood-reference"}
  ],
  "prompt": "Create the approved three-slide REDnote local-business note as one coordinated vertical 3:4 sequence. Image 1 is the user's primary business anchor; preserve the stated storefront, space, signature service or product, brand details, and visible must-keeps. Image 2 guides only the approved visual mood and palette. Slide 1 is the recognisable store-front cover with title-safe space. Slide 2 makes the approved space, visitor experience, signature service, or featured product clear. Slide 3 is a coherent local-atmosphere closing image with clean space for the user's verified visit details. Use only the supplied business facts. Keep palette, light, and local-discovery direction coherent across all slides.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "model": "auto",
  "count": 3,
  "output_relationship": "sequence",
  "client_request_id": "opaque-local-business-note-sequence-id"
}
```

For a concept brief with no business photo, call generate with the same canvas,
count, and relationship. Identify it as an original concept visual in the
delivery; do not present it as an actual-location record.

If the live card cannot make the approved coordinated sequence, show supported
count, relationship, price basis, and resulting call count. Let the user choose
the revised paid plan; never silently turn it into independent slides.

For a selected slide, call edit with the accepted image at `images[0]`. Use no
more than two normalized `edit_regions`, both with `image_index: 0`, only for
local corrections. Omit regions for image-wide light, color, or background
refinement. Editing is a new single-image paid revision, not a sequence
substitute.

## Freeze paid work once

Before the first paid call, show one confirmation block with:

- ordered slide roles;
- source and later reference roles in exact order;
- full prompt, user-provided facts, and visual must-keeps;
- canvas, model behaviour, controls, `count: 3`, and
  `output_relationship: "sequence"`;
- exact embedded text and placement when the user asks for it;
- current maximum charge from the matching live billing basis and total calls;
  and
- review and delivery plan, including the free caption and tag package.

After approval, assign one opaque stable `client_request_id` to this logical
sequence and submit it once. A changed slide, fact, prompt, source, reference
order, canvas, model, control, count, relationship, or embedded text is fresh
confirmed work with a fresh ID.

## Track, review, and deliver

Save the frozen payload, approval, create response, and `task_id`. Poll only
the original task using `beatra.tasks.get` to `succeeded`, `failed`, or
`canceled`; `queued` and `running` are progress only. Completed-task facts are
authoritative for artifact URLs or IDs, dimensions, format, resolved model, and
`billing.net_charged_credits`.

Review accessible outputs in post order for user-confirmed visual must-keeps,
each slide's role, unified light and local mood, `3:4`, title-safe space, and
any visible supplied text. Deliver artifacts in note order with actual facts,
title shortlist, caption beats, fact checklist, tag set, and at most one
focused unexecuted revision suggestion.

## Recover without duplicate work

| Situation | Action |
| --- | --- |
| Create response is genuinely unknown | Replay only the byte-equivalent frozen payload with its original `client_request_id`. |
| Task ID is missing | Use `beatra.tasks.list` scoped to the original capability, following each returned `next_cursor` until the pages cover the creation window. The list returns capability, model, status, and timestamps but not the prompt, canvas, count, or reference order, so shortlist on those fields and confirm the candidate with `beatra.tasks.get` before treating it as the original. |
| A later call in an approved multi-call plan fails | Keep and deliver the slides that already succeeded, with their task IDs and billing. The failed call is new paid work: it needs a new confirmation and a new `client_request_id`, never a replay of the failed one, and never a re-run of a call that already succeeded. |
| Task is queued or running | Continue polling the original task. |
| Upload grant expires or validation rejects a file | Obtain a fresh grant through bundled upload while preserving the rest of the frozen request. |
| Model validation changes options | Refresh matching `beatra.models.list` before proposing changed work. |
| User requests cancellation | Call `beatra.tasks.cancel` once. A `409` means the original remains in control: poll and report cancellation only when terminal `status` is `canceled`. |

Slow polling, connection or authentication trouble, update failure, or a partial
sequence result never authorizes replacement paid work.
