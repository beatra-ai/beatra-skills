# Bilibili storyboard planning and key frames

## Build the free chapter-led shot plan

Read the supplied Bilibili topic, title, outline, script, or chapter plan as a
creator and production brief. Before any media call, write a complete shot list
in viewing order. The plan should make the opening, each chapter, visual proof,
transitions, and final viewer prompt easy to review.

| Field | Include |
| --- | --- |
| Chapter and shot | Chapter label, shot number, story beat, and estimated time range |
| Visual | Subject, action, setting, evidence, props, lighting, and intended style |
| Camera | Shot size, angle, composition, and intended movement |
| Spoken and sound | Narration, dialogue, ambient sound, music, or effect cue when relevant |
| Editorial cue | B-roll, on-screen graphic, comparison, demonstration, or transition purpose |
| Frame brief | A concise still-frame prompt and must-keeps for a selected key-frame candidate |

Use a concise hook followed by a logical chapter progression. Let the stated
subject, audience, and duration determine the amount of detail rather than
inventing a runtime. Preserve supplied factual claims, product details, people,
locations, channel conventions, and reference roles. A Bilibili page URL or a
video file does not provide inspectable image input to an image route; use the
supplied transcript or outline for planning and exported screenshots for visual
direction.

## Select one image route per approved key frame

Read a live model card before deciding price, model, count, relationship, or
canvas:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

- **New visual beat:** `beatra.images.generate` creates one fresh key frame from
  the approved shot brief.
- **Reference-guided visual beat:** `beatra.images.transform` creates one fresh
  key frame from one to four ordered screenshots or image references and the
  approved shot brief.
- **Focused adjustment:** `beatra.images.edit` changes an accepted key frame;
  the base key frame is `images[0]` and later images remain ordered references.

For a local screenshot or reference image, use the bundled helper instead of
calling `beatra.assets.upload` directly:

```text
python3 scripts/mcp_client.py upload ./approved-reference.png --mime-type image/png
```

The helper requests the upload grant, completes its returned HTTP PUT, and
prints the artifact reference. Upload creates transport access only; inspect a
reference only when it is visible to the host.

## Freeze, confirm, and submit selected shots

For every selected shot, show its chapter and purpose, source reference order
and roles, complete prompt, must-keeps, canvas, count, relationship, controls,
model behavior, and live maximum price. The user can approve a clearly numbered
list of up to four independent key-frame requests at once.

Each storyboard shot is independent paid work. Submit it as `count: 1` with its
own opaque stable ID, and create no more than four key frames for one board.
Keep at most two generation tasks in flight: submit the first pair, poll both
to terminal results, and then submit the next pair. A count above one returns
variants for one image request and is not a substitute for an ordered video
storyboard.

For example, submit a new key frame once:

```text
printf '%s' '{"prompt":"Bilibili storyboard key frame for chapter 01, shot 01: use the approved subject, action, visual proof, composition, camera angle, and style.","count":1,"client_request_id":"opaque-bilibili-board-shot-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

For a reference-guided key frame, preserve source order in both payload and
prompt:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"art_channel_style"},{"type":"artifact","artifact_id":"art_product_or_location"}],"prompt":"Bilibili storyboard key frame for chapter 02, shot 03: use the first reference for the approved channel visual direction and the second for the named subject or location. Create the stated action, evidence moment, composition, camera angle, and lighting.","count":1,"client_request_id":"opaque-bilibili-board-shot-03"}' | python3 scripts/mcp_client.py call beatra.images.transform
```

For a focused correction, use the accepted key frame as `images[0]` with a new
stable ID and new confirmation. Do not silently change the shot, canvas, model,
count, or reference order.

## Track, recover, and deliver

Keep the returned task ID and poll only that task with `beatra.tasks.get`. A
lost create response may be replayed only with exactly the frozen arguments and
the same `client_request_id`. When the task ID is missing, list recent tasks
with `beatra.tasks.list`, then verify a candidate through `beatra.tasks.get`
against the recorded payload before any re-submission.

For accessible result images, review the chapter beat, subject, action, visual
proof, composition, camera intention, intended canvas, and named must-keeps.
Deliver the artifact reference and terminal facts actually returned, including
dimensions, format, resolved model, and charged credits when present. Report
visible drift in terms of the approved shot plan. A follow-up key frame or
focused correction is newly scoped paid work.

Cancel only at the user's request via `beatra.tasks.cancel`, then use
`beatra.tasks.get` to confirm the terminal state. An unconfirmed cancellation
continues as the existing task and does not justify a duplicate image request.
