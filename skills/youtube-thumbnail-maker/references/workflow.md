# YouTube thumbnail workflow

## Thumbnail brief

Record the working title, the one promise the video makes, the audience, the
hero subject, the source images or exported key frame, the channel style, the
destination canvas, the must-keeps, and the words to avoid. Note which claims
in the title come from the user and which are still assumptions; a title claim
that is not the user's does not go into the image.

## Read the live card before deciding

Free work: building the brief, comparing directions, and drafting the prompt.
Paid work starts at the first image call.

```text
python3 scripts/mcp_client.py upload ./key-frame.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./channel-reference.png --mime-type image/png
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Every one of these runs through this package's bundled `scripts/mcp_client.py`.
Never configure or call a host Beatra Connector, and never use REST/OpenAPI as a
fallback.

Read the matching card before fixing a model, price, canvas, optional control,
or count: `image_to_image` for a supplied frame or portrait, `text_to_image` for
a concept, and `image_edit` for an accepted direction. Calculate the maximum
charge from the card's billing basis. Keep `model: "auto"` and model-managed
controls unless the user has made that decision.

YouTube thumbnails are `16:9`. Use the explicit `2K` / `16:9` preset. The
delivered pixel size is whatever the resolved model returns for that tier, so
report the returned dimensions rather than promising a number in advance; when
the user needs a specific pixel size, say so before the call rather than after.

## Submit one approved direction

With a supplied key frame or portrait, call transform with that image at
`images[0]`; at most three later references guide the approved channel look in
the user's stated order.

```json
{
  "images": [
    {"type": "artifact", "artifact_id": "<key-frame-artifact-id>"},
    {"type": "artifact", "artifact_id": "<channel-reference-artifact-id>"}
  ],
  "prompt": "Create the approved YouTube thumbnail as a single 16:9 image. Image 1 is the user's hero subject; preserve the stated face, product, logo, and visible must-keeps. Image 2 guides only the approved channel palette and treatment. Put the hero subject on one side with strong separation from the background and leave the opposite third clear for a headline. Keep the composition readable at small size.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "16:9"},
  "model": "auto",
  "count": 1,
  "client_request_id": "opaque-youtube-thumbnail-id"
}
```

For a concept with no supplied image, call generate with the same canvas and
count. Say in the delivery that it is an original concept rather than a frame
from the video.

For a refinement of an accepted thumbnail, call edit with that image at
`images[0]`. Use at most two normalized `edit_regions`, both with
`image_index: 0`, and only for a local correction. A region focuses the edit; it
does not guarantee that pixels outside it are unchanged, so review the returned
image rather than telling the user a nearby face or logo is safe. Omit regions
for image-wide light, color, or background work. An edit is a new single-image
paid revision.

## Freeze paid work once

Before the first paid call, show one confirmation block with the source and
reference order, the full prompt, the must-keeps, the resolved canvas, the
model behavior, the controls, `count`, the current maximum charge, and the
total call count. Then create one stable opaque `client_request_id`, submit
exactly once, and keep the returned task ID.

Changing the source, the reference order, the prompt, the canvas, the model,
the count, or any embedded text is new paid work with a new confirmation and a
new `client_request_id`.

When the user wants several directions rendered, show how they group into calls
and what the group costs before submitting any of them, rather than quietly
dropping directions or quietly spending more. `count` renders variants of one
prompt and accepts at most 4, so three distinct directions are three separate
calls rather than one call with `count: 3`.

## Recover without duplicate work

| Situation | Action |
| --- | --- |
| Create response is genuinely unknown | Replay only the byte-equivalent frozen payload with its original `client_request_id`. |
| Task ID is missing | Use `beatra.tasks.list` scoped to the original capability, following each returned `next_cursor` until the pages cover the creation window. The list returns capability, model, status, and timestamps but not the prompt, canvas, or count, so shortlist on those fields and confirm the candidate with `beatra.tasks.get` before treating it as the original. |
| Task is queued or running | Continue polling the original task with `beatra.tasks.get`. |
| A later call in an approved multi-call plan fails | Keep and deliver the directions that already succeeded, with their task IDs and billing. The failed call is new paid work needing a new confirmation and a new `client_request_id`, never a replay, and never a re-run of a call that succeeded. |
| Upload grant expires or a file is rejected | Obtain a fresh grant through the bundled upload while preserving the rest of the frozen request. |
| Model validation changes options | Refresh the matching `beatra.models.list` before proposing changed work. |
| User requests cancellation | Call `beatra.tasks.cancel` once. A `409` means the original remains in control: keep polling and report cancellation only when the terminal `status` is `canceled`. |

A terminal `failed` is a known response, not an unknown one: it needs a new
confirmation and a new request ID rather than a replay. Slow polling,
connection trouble, or an update failure never authorizes replacement paid work.

## Review and deliver

Review only images the host can actually access, against the user-confirmed
must-keeps, the hero subject, `16:9` composition, headline-safe space, small-size
readability, and any visible embedded text. Say plainly which of these the host
could not see.

Deliver only completed-task facts: artifact links, returned dimensions, format,
size, resolved model, task IDs, and `billing.net_charged_credits`. Present the
selected direction, the title-matching note, the channel rule that makes the
look repeatable, and at most one focused unexecuted revision suggestion.

Click-through rate depends on the video, the audience, and the surface a viewer
sees it on. Describe what the thumbnail does — subject, contrast, hierarchy,
headline space — rather than predicting how it will perform.
