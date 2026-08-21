# Video restyle workflow

## Establish the restyle shot

Use one accessible source video that the host Agent can inspect, one target style or visual reference direction, and the source elements to preserve. Record the source video's actual MIME type, width, height, aspect ratio, duration, and byte size. Also record the subject, silhouette, key actions, camera movement, composition, scene, dominant palette, source audio, the requested target style, and user-named must-keeps.

Build a preservation brief from the source: subject identity, silhouette, key actions, camera movement, composition, scene, dominant palette, and source-audio intent. Then write one positive edit instruction that states a single visual thesis — the one dominant visual change this run should deliver. One dominant visual change keeps the result legible and reviewable; stacking unrelated restyle directions in one prompt degrades consistency.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./source-clip.mp4 --mime-type video/mp4
python3 scripts/mcp_client.py upload ./style-reference.png --mime-type image/png
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"video_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the live video-edit card

Before any paid restyle, call `beatra.models.list` with `{"capability":"video_edit"}` and inspect the current typed model cards. Require a current card that admits the source video's actual MIME type, dimensions, duration, and byte size. When optional ordered references are used, confirm each reference's actual MIME type, dimensions, and byte size against every advertised reference constraint. Confirm the live duration behavior, aspect-ratio handling, and price basis. Current cards may, for example, advertise a source maximum of 512 MiB, a duration maximum of 15 seconds, or particular accepted video codecs; these are examples of live facts to read, not permanent constants or a reason to hard-code a model. If any actual fact is unavailable or incompatible, stop before the paid call and request the smallest compatible source change.

Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Build and submit the restyle

Omit `aspect_ratio` so the route uses its declared source-derived ratio unless the destination or an explicit user decision needs another value and the live model card supports it. The restyle edit instruction should encode the one dominant visual change and reference the preservation brief implicitly through must-keeps. Optional ordered image or video references should clarify the target style rather than add unrelated content.

If a custom style frame must be created first, treat that as a separate image stage. Create and approve the style frame through a suitable image workflow before the video restyle, then reference it as ordered reference media on the video-edit call.

The normal restyle payload is:

```json
{
  "source_video": {
    "type": "artifact",
    "artifact_id": "art_source"
  },
  "instruction": "Restyle the clip into a soft hand-drawn anime look with warm cel shading, keeping the subject, action, and camera unchanged.",
  "client_request_id": "opaque-restyle-id"
}
```

When an ordered style reference is used, include it in the typed `references` array as the live card requires. Before creating `client_request_id` or submitting `beatra.videos.edit`, show the admission card with every field: route, tool, duration if set, resolution if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A request to make the clip is not approval. Freeze all arguments and one opaque stable request ID. Submit `beatra.videos.edit` exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for the restyle stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. Any change to source, instruction, model, duration, or another control creates new logical paid work: assign a new request ID, show a new admission card, and obtain fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful restyle, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the restyled clip for style match to the requested direction, subject and object structure, camera continuity, motion readability, temporal coherence, source-audio presence and behavior, ratio, and actual duration. Generative restyling does not guarantee frame-exact identity or deterministic per-object preservation. State visible drift and inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
