# Storyboard planning and key frames

## Create the free shot plan

Read the source material as a story and production brief. Before a media call,
write a reviewable shot list in scene order. Each row should contain:

| Field | Include |
| --- | --- |
| Shot | Scene and shot number, story beat, and estimated duration |
| Visual | Subject, action, location, key props, lighting, and visual style |
| Camera | Shot size, angle, composition, and intended camera movement |
| Sound | Dialogue, narration, music, ambience, or effect cue when relevant |
| Frame brief | A concise still-frame prompt and its must-keeps |

Keep the plan specific enough for a producer, designer, or later video route
to review. Preserve stated facts about a product, person, location, costume,
brand, or reference. When source material is incomplete, use a small coherent
interpretation and present it for review rather than expanding it into an
unrelated production plan.

## Select one image route per approved key frame

Use the live model card before price, model, count, relationship, or canvas
decisions:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

- **New shot:** `beatra.images.generate` creates a fresh key frame from the
  approved shot brief.
- **Reference-guided shot:** `beatra.images.transform` creates a fresh shot
  from one to four ordered source references and the approved shot brief.
- **Focused adjustment:** `beatra.images.edit` updates an accepted key frame;
  the base key frame is `images[0]` and later images are ordered references.

For a local reference, use the bundled helper rather than calling
`beatra.assets.upload` directly:

```text
python3 scripts/mcp_client.py upload ./approved-reference.png --mime-type image/png
```

The helper requests the upload grant, completes its returned HTTP PUT, and
prints the resulting artifact reference. Upload creates transport access only;
inspect a reference only when it is actually visible to the host.

## Freeze, confirm, and submit

For each selected shot, show the shot number and purpose, source reference
order and roles, complete prompt, must-keeps, canvas, count, relationship,
controls, model behavior, and live maximum price. The user can approve a clear
list of up to four independently numbered key-frame requests at once.

Different shots are independent paid work. Submit every distinct shot as
`count: 1` with its own stable ID, and make no more than four requests for one
storyboard. Keep at most two generation tasks in flight: submit the first pair,
poll both to terminal results, and only then submit the next pair. A `count`
above one produces multiple results for one image request; it is not evidence
of a sequential storyboard. Keep this per-shot route until a live card and a
representative sample establish a supported sequence path.

For example, submit an original key frame once:

```text
printf '%s' '{"prompt":"Shot 01 key frame: use the approved composition, subject, action, lighting, camera angle, and style.","count":1,"client_request_id":"opaque-storyboard-shot-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

For a reference-guided key frame, preserve the source order in both payload and
prompt:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"art_style"},{"type":"artifact","artifact_id":"art_character"}],"prompt":"Shot 02 key frame: use the first reference for the approved visual style and the second for the approved character traits. Create the stated composition, action, camera angle, and lighting.","count":1,"client_request_id":"opaque-storyboard-shot-02"}' | python3 scripts/mcp_client.py call beatra.images.transform
```

For a localized correction, use the accepted key frame as `images[0]` with a
new stable ID and new approval. Do not silently substitute a different canvas,
model, count, or reference order.

## Follow the task and review the result

Keep the returned task ID and poll only that task with `beatra.tasks.get`. A
lost create response may be retried only with exactly the frozen arguments and
same `client_request_id`. When the task ID is missing, list recent tasks with
`beatra.tasks.list`, then confirm a candidate through `beatra.tasks.get`
against the recorded payload before any re-submission.

For accessible result images, review the shot's subject, action, composition,
camera angle, visual style, intended canvas, and any named product or character
must-keeps. Deliver the artifact reference and terminal facts actually returned,
including dimensions, format, resolved model, and charged credits when present.
Report any visible drift in the terms of the shot plan. A follow-up key frame
or focused correction is newly scoped paid work.

Cancel only at the user's request via `beatra.tasks.cancel`, then use
`beatra.tasks.get` to confirm the terminal state. An unconfirmed cancellation
continues as the existing task and does not justify a duplicate image request.
