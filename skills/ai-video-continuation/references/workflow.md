# Video continuation workflow

## Establish the continuation shot

Use one accessible source video that the host Agent can inspect, one continuation direction (add footage before the start or after the end), and the next visual beat the new footage should reach. Record the source video's actual MIME type, width, height, aspect ratio, duration, and byte size. Also record the subject, pose and action vector, camera movement, framing, lens feel, lighting, color, environment, source audio, the requested before/after direction, and the intended next beat.

Build a continuity state from the source boundary the join happens at — the final portion for an after-extension, the opening portion for a before-extension: subject, pose and action vector, camera movement, framing, lens feel, lighting, color, environment, and source-audio intent. Then state one continuation beat, the single next event the new footage should reach. One clear next beat keeps the join legible and reviewable; stacking unrelated directions in one prompt degrades the seam.

The trusted source duration is a hard planning input, because the extension duration is sized against it. Multiple clips must not be disguised as a single video continuation.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./source-clip.mp4 --mime-type video/mp4
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"video_extend"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the live video-extend card

Before any paid extension, call `beatra.models.list` with `{"capability":"video_extend"}` and inspect the current typed model cards. Require a current card that admits the source video's actual MIME type, dimensions, duration, and byte size. Confirm the card's live final-duration maximum, the before/after direction control, every optional reference limit, and the price basis. If the card admits additional video references, they may guide the continuation of the one primary source clip; they do not turn the request into a video join. If any actual fact is unavailable or incompatible, stop before the paid call and request the smallest compatible source change.

Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Size the final duration and submit the extension

The request `duration` is the final returned-video duration, not seconds to add. It must be an integer that exceeds the trusted source duration and stays within the live maximum. Prefer the shortest admitted final duration that still exceeds the source. The value does not accept `auto`. If the source already meets or exceeds the current maximum, this route cannot enter; tell the user plainly rather than submitting a doomed call.

The required `direction` is `"before"` (add a lead-in) or `"after"` (extend the ending). Optional ordered image or audio references may reinforce the continuation only when a live card permits them. State the continuation beat in the required `instruction` field: one positive line that names the single next event and preserves the continuity state.

The normal extension payload is:

```json
{
  "video": {
    "type": "artifact",
    "artifact_id": "art_source"
  },
  "duration": 10,
  "direction": "after",
  "instruction": "Continue the shot forward: the subject turns and walks toward the window, keeping the same lens, lighting, and pacing.",
  "client_request_id": "opaque-extend-id"
}
```

Before creating `client_request_id` or submitting `beatra.videos.extend`, show the admission card with every field: route, tool, final duration, resolution if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A request to make the clip is not approval. Freeze all arguments and one opaque stable request ID. Submit `beatra.videos.extend` exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for the extension stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. Any change to source, direction, beat, final duration, model, or another control creates new logical paid work: assign a new request ID, show a new admission card, and obtain fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful extension, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the seam at the source boundary, motion direction, subject identity, camera and lighting continuity, audio behavior, the final duration against what was requested, and whether the new event advances naturally from the source. State inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
