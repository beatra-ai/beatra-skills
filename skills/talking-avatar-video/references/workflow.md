# Narration-first presenter workflow

## Establish the presenter shot

Use one accessible portrait that the host Agent can inspect and one approved source of speech: either a supplied recording or a short script paired with an available voice. This workflow does not clone a voice; if voice cloning is requested, route that separate step to the dedicated voice-cloning workflow and its required consent contract.

Record the portrait's actual MIME type, width, height, aspect ratio, byte size, and alpha-channel presence. For supplied audio, record actual MIME type, duration, and byte size. Also record the destination, language, pronunciation of names and numbers, message, eye line, expression, posture, movement limits, framing, background, and user-named must-keeps. Prefer one clear message and restrained movement. Treat identity, clothing, products, logos, composition, and background as review priorities rather than guarantees.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected or listened to:

```text
python3 scripts/mcp_client.py upload ./presenter-portrait.png --mime-type image/png
python3 scripts/mcp_client.py upload ./approved-speech.mp3 --mime-type audio/mpeg
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as visual or audio review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the complete media chain

Before any paid synthesis, confirm that the planned narration can feed a live video route. For a script route, call `beatra.models.list` with `{"capability":"text_to_speech"}` to inspect supported languages, formats, controls, and price when they affect the choice. For every route, call `beatra.models.list` with `{"capability":"image_to_video"}` and inspect current typed model cards.

Require a current video card whose `input_combinations` admits `[image, driving_audio]`. Compare the portrait's actual MIME type, width and height, aspect ratio, byte size, and alpha-channel presence against every image constraint currently advertised by that card. Compare supplied audio's actual MIME type, duration, and byte size against every driving-audio constraint. Also inspect eligible video durations so the complete speech can fit without upstream truncation. Current cards may, for example, advertise no PNG alpha support, an image maximum of 20 MiB, and a driving-audio maximum of 15 MiB; these are examples of live facts to read, not permanent constants or a reason to hard-code a model. If any actual fact is unavailable or incompatible, stop before paid TTS and request the smallest compatible source change.

For a script route, select a TTS format whose output the live video card can accept. When the user has not selected a format, use `mp3` only if the live speech card supports `mp3` and the video card accepts its expected `audio/mpeg` output. If the user selected `flac`, `opus`, or `pcm` and the live video route does not accept the resulting format, explain the mismatch before synthesis and obtain a compatible format choice. Do not silently substitute a format or hard-code a speech or video model. The preflight does not replace admission of the terminal audio's actual facts.

## Prepare and approve narration

When the user supplies a short script, make it natural to say: expand ambiguous abbreviations, clarify names and numbers, use punctuation for pauses, and keep the intended meaning. Call `beatra.voices.list` only if voice selection is unresolved. Use the user's selected available voice unchanged. Use the live `text_to_speech` card for language, format, control, model, and price facts; otherwise keep `model: "auto"`.

Before synthesis, show the final text, voice, language when set, format, model behavior, explicit controls, and provisional live estimate if requested. The terminal task's `billing.net_charged_credits` is final. Record approval and freeze one narration payload with one opaque stable request ID. The smallest normal request is:

```json
{
  "voice": "voice_selected",
  "input": "The approved short message.",
  "client_request_id": "opaque-narration-id"
}
```

Submit `beatra.speech.synthesize` once. Poll its task to terminal with `beatra.tasks.get`. A successful result supplies the real audio artifact, `task.output.audio.mime_type`, `task.output.audio.duration_seconds`, and `task.output.audio.size_bytes` when present; do not replace those values with a text-length estimate or requested format assumption. Present or play the returned audio when accessible and ask the user to review pronunciation, clarity, pace, tone, and completeness before any dependent video call. A script preview, voice preview, task metadata, or expected duration is not a review of the synthesized media.

A changed script, voice, language, speed, pitch, volume, emotion, format, sample rate, or model is a new narration request. Assign a new stable ID and obtain fresh paid approval.

## Fit approved speech to the video

Refresh or re-read the current `image_to_video` cards after narration succeeds. Recheck the portrait's actual MIME, dimensions, aspect ratio, byte size, and alpha-channel presence, then compare the approved audio's actual MIME type, duration, and byte size with the current card. If terminal audio size is absent, obtain it from trusted artifact metadata; if it is still unavailable, stop before video submission. The card must still admit `[image, driving_audio]` and every actual media fact. Apply this same actual-facts admission to user-supplied audio.

The approved audio must be at least the card's live minimum duration, currently 2 seconds, and no longer than either its live audio maximum or the longest eligible video duration that can contain the complete speech. Choose the smallest supported integer video duration at or above the actual speech length so the message is not clipped. Do not truncate or speed up approved audio or add silence merely to force a match. A fractional narration duration can leave the shortest unavoidable tail pause or held frame in an integral-duration video; disclose that possibility and inspect the ending after delivery.

If any image or audio fact is unavailable or not accepted, the audio is below the live minimum, the complete message exceeds the containable upper bound, or the user requires an exact ending, stop before video submission. Offer the smallest compatible portrait, narration, or recording change. Replacing synthesized narration is a new paid request with a new ID and approval; a new supplied recording must also be reviewed and admitted again. Keep `model: "auto"` unless the user selected a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

The portrait is the strict first frame. Omit `aspect_ratio` so the route uses its declared source-derived ratio. If a destination needs another frame, ask for a first-frame image already composed for that target or explicitly route through a suitable preprocessing workflow before returning with the new image. `beatra.videos.animate` is not a crop or canvas-override step. Never silently crop, stretch, or change the canvas. Omit resolution and all other optional fields unless the destination or an explicit user decision needs them and the live model card supports them.

Build a concise performance prompt from one message, steady eye line, restrained expression and posture, gentle natural movement, a stable camera and background, and named must-keeps. The normal video payload is:

```json
{
  "image": {
    "type": "artifact",
    "artifact_id": "art_portrait"
  },
  "driving_audio": {
    "type": "artifact",
    "artifact_id": "art_speech"
  },
  "prompt": "A steady presenter speaks directly to camera with restrained expression, subtle natural head movement, and a stable background.",
  "duration": 8,
  "client_request_id": "opaque-video-id"
}
```

Before creating a video `client_request_id` or submitting `beatra.videos.animate`, show the admission card with every field: route, tool, audio-led duration, resolution if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Approved narration is not video approval. A request to make the clip is not approval. Freeze all arguments and a new stable video request ID. Submit `beatra.videos.animate` exactly once.

## Poll, recover, and cancel each stage

Keep a private ledger entry for each narration and video stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record each returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

A stage whose submission was rejected or returned no `task_id` never became a task: nothing is queued, running, or billable for it. Never poll such a row with `beatra.tasks.get`. When a row stays empty or a retry outcome is unclear, reconcile first with `beatra.tasks.list`, then either drop the row or resubmit it with a NEW `client_request_id`. Poll only rows whose `task_id` came from a successful creation response.

If a stage's create response is lost, retry only its identical frozen payload with its same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse a narration ID for video, reuse an ID after any argument changes, or replace a slow task with a duplicate.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For successful narration, deliver the returned audio artifact or link and report only actual voice, model, duration, format, usage, and net charge facts. For successful video, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the final video for recognizable identity and must-keeps, speech clarity, credible mouth timing, restrained expression and movement, stable framing, camera and background, a clean ending, and destination fit. Audio-driven generation does not guarantee phoneme-perfect lip sync or exact identity across every frame. State visible drift and inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
