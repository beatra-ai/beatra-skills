# Motion brief, request, and recovery

## Inspect and direct the still

The source must be one accessible image the host Agent can inspect before paid preparation. Record the visible subject, crop, horizon, lighting, background, destination, intended motion, framing, and every user-named must-keep. If the image is absent or inaccessible, request it and stop; upload cannot reveal or diagnose an image.

Turn known context into a compact brief:

```text
subject + one visible action + one primary camera move + pacing + must-keeps + destination
```

Prefer one readable action and one camera move that reinforce each other. For example: "Condensation gathers on the centered bottle while a restrained push-in brings the label forward; preserve the bottle geometry, label, logo, lighting, and composition for a vertical product-page hook." Treat must-keeps as priorities and review the result afterward; do not promise pixel-perfect later frames or make the user relax a viable request before execution.

## Upload and exact tool invocation

For a local source the host Agent has already inspected, use the bundled upload helper:

```text
python3 scripts/mcp_client.py upload ./selected-image.png --mime-type image/png
```

The helper uses `beatra.assets.upload` and completes the required upload transport. Preserve its returned artifact reference. Never send the local path to `beatra.videos.animate` and never describe upload as visual analysis.

For MCP calls, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass the tool arguments as JSON on standard input:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Live model, control, and price facts

Leave the model at `auto` unless the user chose a concrete eligible model. Always call `beatra.models.list` with `{"capability":"image_to_video"}` before naming compatibility, duration, resolution, or a numeric estimate. Admit the complete payload against one current card. Write the shortest integer `duration` that card admits. Omit aspect ratio, resolution, audio, and other optional controls unless a destination or explicit user choice requires one; when resolution is sent, use the lowest admitted tier unless the user named a higher one.

Every numeric cost estimate is provisional and requires a fresh live model lookup. State the returned pricing basis and assumptions. The terminal task's actual `billing.net_charged_credits`, not the estimate, is final.

Before creating `client_request_id` or submitting `beatra.videos.animate`, show the admission card with every field: route, tool, duration, resolution if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Do not generate a replacement still.

## Freeze the paid payload

`beatra.videos.animate` requires `image` and `client_request_id`. `prompt` is optional. Model, duration, aspect ratio, resolution, driving audio, generated audio, negative prompt, seed, prompt enhancement, watermark, web search, last-frame return, and all other controls are optional and capability-dependent. Send an optional field only when the destination or an explicit user choice requires it and the live model card supports it.

The smallest normal payload includes the admitted duration. Replace `5` with the shortest integer the current card actually admits:

```json
{
  "image": {
    "type": "artifact",
    "artifact_id": "art_opening"
  },
  "prompt": "The subject performs one readable action while the camera makes one restrained move.",
  "duration": 5,
  "client_request_id": "opaque-stable-id"
}
```

The supplied `image` is the strict first frame, not a loose reference. Omit `prompt` if the user wants no added motion instruction. Before submission, show the admission card. A request to make the clip is not approval until the user confirms top-up or sufficient credits.

Store the source reference, prompt presence/value, model, every optional field, stable request ID, approval, create response, and task ID in a private execution ledger. Submit the frozen JSON exactly once:

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"art_opening"},"duration":5,"client_request_id":"opaque-stable-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

## Poll, recover, and cancel

Record the task ID from the create response, then call `beatra.tasks.get` for that ID until the task reaches `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait. Preserve any returned retry guidance or deadline and never submit a replacement merely because processing is slow.

If the task ID is lost, call `beatra.tasks.list` with `{"capability":"image_to_video"}`. Treat that list only as candidates: call `beatra.tasks.get` for each plausible task and match returned source/prompt/model/control/timing facts against the private ledger. If the create response was lost and no task can be recovered, retry only the identical frozen payload with the same `client_request_id`.

On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

Any change to source, prompt, model, duration, aspect ratio, resolution, audio, or another control creates new logical paid work. Assign a new request ID, show a new admission card (including the 600-credit fact, exact top-up URL, and starter ¥29), and obtain fresh top-up or balance confirmation. A request to make the changed clip is not approval. Recover the original work before offering that changed submission.

Cancel only at the user's request by calling `beatra.tasks.cancel` once for the known task. Confirm the resulting terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; do not promise a stop, repeat cancellation automatically, or create replacement work.

## Deliver and review

Deliver every returned video artifact and link. Report only the task ID/status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits` actually returned by the terminal response. Do not infer omitted values or convert a provisional estimate into a settlement claim.

Compare inspectable frames with the source for must-keep drift, subject stability, unwanted deformation, intended action, camera coherence, pacing, and destination fit. Say what the host Agent could and could not inspect, especially if only a link, thumbnail, or metadata is available. Report visible drift honestly. If another paid version would help, recommend one focused change and wait for a new approval rather than silently submitting it.
