# First-and-last-frame workflow

## Establish the transition shot

Use two approved endpoint images with clear identities — a first frame and a last frame — that the host Agent can inspect, plus the event that should occur between them. Record each image's actual MIME type, width, height, aspect ratio, and byte size. Also record the subject identity, geometry, framing, background, lighting, the visual deltas between the two frames, and the requested event.

Build a transition map from the two endpoints: fixed elements (what stays the same), changing elements (what transforms), direction of motion, camera, and the intended landing moment on the last frame. Then write one positive transition instruction that states a single event — the one change the motion should deliver. One clear event keeps the transition legible; stacking unrelated transformations in one prompt degrades the path between the frames.

Endpoint-first planning is the core of this route: describe what changes between frame A and B, then choose motion, camera, subject path, and reveal timing that make the transition readable.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./first-frame.png --mime-type image/png
python3 scripts/mcp_client.py upload ./last-frame.png --mime-type image/png
python3 scripts/mcp_client.py upload ./driving-audio.mp3 --mime-type audio/mpeg
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"frames_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Create an endpoint image when one is missing

If either endpoint does not yet exist, make and approve it as a separate image stage before the video run. Before quoting that stage, read the current text-to-image card and match every `pricing.options` dimension against the admitted image request. An empty dimensions object is the default; a preset canvas tier supplies a returned `resolution` dimension. If target-canvas normalization or request-dependent routing leaves multiple eligible options, show the live range and use its maximum as the approval ceiling. Apply the returned estimate formula to output count only and never multiply it by source-image count. Do not store model names, dimension values, thresholds, or prices in this Skill. Use `beatra.images.generate` once with a frozen prompt, then have the user approve the returned image. Treat this as its own paid image stage with its own opaque stable request ID and task record.

A transition that depends on a not-yet-created frame cannot be submitted until that frame exists and its real MIME type, bytes, and dimensions have passed downstream admission. When both endpoints are approved artifacts, proceed to the frames-to-video preflight.

## Preflight the live frames-to-video card

Before any paid transition, call `beatra.models.list` with `{"capability":"frames_to_video"}` and inspect the current typed model cards. Require a current card that admits both endpoint images' actual MIME types, dimensions, and byte sizes. Confirm the live duration behavior, aspect-ratio handling, whether driving audio is admitted for this exact image/audio combination, and the price basis. Write the shortest integer `duration` that card admits. Do not omit duration on `model=auto` hoping a default will admit, and do not hard-code 8 / 10 / 15 when the card allows a shorter integer.

Optional driving audio belongs only on a live frames-to-video card that admits the exact image/audio combination. Because Beatra does not trim audio, match the real audio duration to a supported video duration so the requested audio excerpt fits in full; when the audio would be generated first, prove at least one downstream card can admit the planned images plus target audio format and duration before paying for the upstream call, then repeat admission with the terminal audio's real MIME type, bytes, and duration before proposing the video call.

Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Build and submit the transition

Submit strict `first_frame` and `last_frame`. Encode the transition map in one positive prompt that names the single event and preserves the fixed elements. The normal transition payload is:

```json
{
  "first_frame": {
    "type": "artifact",
    "artifact_id": "art_first"
  },
  "last_frame": {
    "type": "artifact",
    "artifact_id": "art_last"
  },
  "prompt": "Transform the subject from the daytime outfit to the evening outfit with a smooth camera push-in, keeping the face and background aligned.",
  "duration": 5,
  "client_request_id": "opaque-interpolate-id"
}
```

Replace `5` with the shortest integer the current card actually admits. When driving audio is admitted and used, include it as typed audio media and choose the smallest admitted whole second at or above the real audio length so the excerpt fits in full. Before creating `client_request_id` or submitting `beatra.videos.interpolate`, show the admission card with every field: route, tool, duration, resolution if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A request to make the clip is not approval. A separately created endpoint image does not authorize the interpolate call.

## Poll, recover, and cancel

Keep a private ledger entry for the transition stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. (A separately created endpoint image keeps its own stage entry.) Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. Any change to frames, prompt, model, duration, or another control creates new logical paid work: assign a new request ID, show a new admission card, and obtain fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful transition, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. First confirm the clip truly starts on the approved first frame and ends on the approved last frame, then inspect the middle motion, subject and lettering drift, direction of motion, duration against what was requested, and audio presence and behavior. State inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
