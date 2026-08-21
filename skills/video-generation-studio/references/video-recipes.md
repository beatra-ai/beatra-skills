# Video recipes

Use these recipes after the route and shot brief are settled. Current typed model cards are authoritative for availability, controls, media constraints, ratios, durations, resolutions, defaults, and provisional prices.

## Bundled client boundary

Inspect local media before sending it. The bundled upload command prepares remote artifact transport through `beatra.assets.upload`:

```text
python3 scripts/mcp_client.py upload ./approved-source.mov --mime-type video/quicktime
```

Retain the returned artifact ID. Never pass a local file path to a remote tool and never present upload as visual or audio review.

For ordinary tools, the tool name is the CLI argument and the JSON object goes on standard input:

```text
printf '%s' '{"capability":"video_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Use only this bundled client. Do not configure or use a host Beatra Connector and do not use REST/OpenAPI fallback.

## Live model and media admission

Map the route to one exact capability:

- `beatra.videos.generate` → `text_to_video`
- `beatra.videos.animate` → `image_to_video`
- `beatra.videos.interpolate` → `frames_to_video`
- `beatra.videos.generate_from_references` → `reference_to_video`
- `beatra.videos.edit` → `video_edit`
- `beatra.videos.extend` → `video_extend`

Call `beatra.models.list` for that capability. Choose only a current card whose input combination accepts the complete payload. Compare, as applicable:

- media kind and exact input role;
- MIME type and byte size;
- image width, height, aspect ratio, and alpha-channel presence;
- audio and video duration;
- reference kinds, order, per-kind count, total count, and combination;
- aggregate or per-video duration limits;
- prompt or instruction requirement and maximum;
- duration SKU, ratio, resolution, and explicit-control support;
- source-video duration behavior and billing basis;
- price meter, unit, scale, and billable quantity.

The request schema's broad bounds do not prove a particular live model accepts the media. If any required actual fact is missing or no current card admits the complete payload, stop before submission and request the smallest compatible source or setting change. Do not discover input incompatibility by making a paid call.

Keep `model: "auto"` unless the user names or selects a concrete eligible model. For auto, use the ordered eligible live candidates rather than guessing a remembered default. For a concrete model, evaluate it exactly and report incompatibility without substitution. Write the shortest integer `duration` that card admits. Do not omit duration on `model: "auto"` and do not hard-code 8, 10, or 15 when a shorter admitted integer exists. Use the lowest admitted resolution unless the user named a higher tier (Pro / 2K / 1080p).

## Text to video

Use only after a delivered keyframe and the video admission card, when the user still wants a text-led `beatra.videos.generate` call rather than animating that still:

```json
{
  "prompt": "One concise temporal shot direction.",
  "model": "auto",
  "client_request_id": "opaque-text-video-id"
}
```

`prompt` is required. Optional `audio`, duration, ratio, resolution, and other controls require live support. Do not add an audio input or generated-audio control because it exists on some model; use it only when the user wants it and the selected card admits it.

## Animate an exact opening image

Use when one image must be frame zero:

```json
{
  "image": {"type": "artifact", "artifact_id": "art_opening"},
  "prompt": "The subject turns once as the camera makes a slow push-in; the background remains calm.",
  "model": "auto",
  "client_request_id": "opaque-animate-id"
}
```

`image` is the strict first frame, not a loose reference. Omit `aspect_ratio` for the source-derived canvas unless the user approves another ratio and a live card accepts it. `driving_audio` is optional only for cards that admit `[image, driving_audio]`; its actual MIME, duration, and byte size must also pass admission.

## Interpolate two boundary frames

Use when both exact boundaries are supplied:

```json
{
  "first_frame": {"type": "artifact", "artifact_id": "art_first"},
  "last_frame": {"type": "artifact", "artifact_id": "art_last"},
  "prompt": "The package rotates gently as the light shifts into the final reveal.",
  "model": "auto",
  "client_request_id": "opaque-interpolate-id"
}
```

Admit both images, their relationship, and any optional driving audio. Check ratio and composition compatibility before spend. The two inputs define endpoints, not a guarantee about every generated intermediate frame.

## Generate from ordered references

Use when media guides a new clip without dictating frame boundaries:

```json
{
  "references": [
    {"kind": "image", "media": {"type": "artifact", "artifact_id": "art_product"}},
    {"kind": "video", "media": {"type": "artifact", "artifact_id": "art_motion"}},
    {"kind": "audio", "media": {"type": "artifact", "artifact_id": "art_rhythm"}}
  ],
  "prompt": "Reference 1 defines the product; reference 2 guides camera energy; reference 3 guides pacing.",
  "model": "auto",
  "client_request_id": "opaque-reference-video-id"
}
```

The selected live card defines the accepted reference count, kinds, combinations, and duration limits. Preserve input order. Add `role` only when the selected typed card advertises that exact `reference_roles` value. Add `reference_voice` only when the selected model card supports it and the media passes current input admission.

## Edit existing footage

Use when existing frames need a content or style change:

```json
{
  "source_video": {"type": "artifact", "artifact_id": "art_source_clip"},
  "instruction": "Change the tabletop to pale stone while keeping the product, timing, and overall framing recognizable.",
  "references": [],
  "model": "auto",
  "client_request_id": "opaque-video-edit-id"
}
```

`source_video` and a non-empty `instruction` are required. Optional ordered image, video, or audio references must all be admitted. `audio_setting` supports `"auto"` or `"origin"` only when the current card exposes it. A preservation request is a priority to inspect, not a guarantee. Current models can derive duration from the source or cap it, and some price both input and output video seconds; read the card before estimating.

## Extend one source clip

Use when new footage belongs directly before or after one source:

```json
{
  "video": {"type": "artifact", "artifact_id": "art_source_clip"},
  "direction": "after",
  "instruction": "Continue the slow push-in until the product fills the center of frame.",
  "duration": 10,
  "references": [],
  "model": "auto",
  "client_request_id": "opaque-video-extend-id"
}
```

Exactly one primary source video is extended. Additional video references are allowed only when the selected live card advertises them, and they guide that one extension. `duration` is a required integer final returned-video duration within the current live card and must be greater than the trusted source duration. It never means added seconds and cannot be `"auto"`. `direction` is exactly `"before"` or `"after"`.

## Optional controls

Controls such as `negative_prompt`, `seed`, `enhance_prompt`, `watermark`, `generate_audio`, `web_search`, and `return_last_frame` vary by route and model. Omit them unless the user's goal requires one and the current selected card exposes it. An explicit unsupported value narrows eligibility and is rejected rather than silently coerced.

Request `return_last_frame: true` only when a current card supports it and a reviewed last-frame image has a purpose, such as anchoring the next separately generated shot. It does not assemble clips.

## Estimate, admit, and submit once

Use current card pricing to show a provisional estimate based on the frozen model, duration, resolution, and any billable input-video quantity. Before any `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, `beatra.videos.generate_from_references`, `beatra.videos.edit`, or `beatra.videos.extend` call, show the admission card with route, MCP tool name, live-card duration, resolution, and aspect, the provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. The terminal `billing.net_charged_credits` is final. Planning, comparison, or “make the clip” is not approval. Do not create `client_request_id` or submit until the user confirms they have topped up or already have enough credits for this estimate.

Create one opaque stable `client_request_id` only after that confirmation. Record the tool and complete payload in a private ledger, submit once, and record the returned task ID immediately. A changed media item, reference order, model, instruction, prompt, direction, duration, ratio, resolution, or optional control creates a new request with a new ID and a new admission card. On `insufficient_balance`, relay the returned public message, keep the top-up URL exact, and retry the same frozen ID only after the user says they have topped up.

## Poll, recover, and cancel

Poll the exact task:

```text
printf '%s' '{"task_id":"task_video"}' | python3 scripts/mcp_client.py call beatra.tasks.get
```

Continue through queued and running states. On success, deliver actual artifacts and terminal facts. On failure, report the actual error and billing/refund outcome.

If the create response was lost, repeat only the identical frozen call with the same request ID. If the task ID was lost, list tasks for the route capability, inspect plausible candidates with `beatra.tasks.get`, and match exact ledger facts before any identical retry. Never submit a changed request as recovery.

Use `beatra.tasks.cancel` only after the user asks. Invoke it once and poll the same task to terminal. A 409 response means cancellation was not confirmed.
