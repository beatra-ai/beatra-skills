# Singing-photo workflow

## Establish the singing shot

Use one accessible portrait that the host Agent can inspect and one approved singing-audio excerpt. This workflow does not synthesize singing; speech synthesis creates speech, not singing, so do not represent voice cloning or ordinary TTS as a singing-audio generator.

Record the portrait's actual MIME type, width, height, aspect ratio, byte size, and alpha-channel presence. For supplied singing audio, record actual MIME type, duration, and byte size. Also record the occasion, face visibility, identity, framing, desired crop, background, performance direction, and user-named must-keeps. Prefer one clear front-facing portrait. Treat identity, clothing, framing, and background as review priorities rather than guarantees.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected or listened to:

```text
python3 scripts/mcp_client.py upload ./singing-portrait.png --mime-type image/png
python3 scripts/mcp_client.py upload ./song-excerpt.mp3 --mime-type audio/mpeg
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as visual or audio review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Prepare a new song as a separate stage

When the user does not have a singing excerpt yet, route the new-song stage to personalized-song-maker or ai-song-cover-studio. Before paying for that upstream music, prove the singing-photo video is reachable: call `beatra.models.list` with `{"capability":"image_to_video"}` and confirm a current card admits the portrait plus the planned audio format and a duration envelope the route can fully contain. An audio-accepting model card proves only that submission is allowed, not that the full audio will be present in the returned video, so verify the duration behavior now.

Because Beatra does not trim a returned song, the singing-photo video proceeds only once the user supplies a singing excerpt whose real duration fits a supported video duration and the current maximum. The upstream song stage is a separate paid request with its own frozen payload, stable request ID, and approval. Resume this workflow once an approved excerpt exists, then repeat live admission with its actual file.

## Preflight the complete media chain

For the singing-photo video, call `beatra.models.list` with `{"capability":"image_to_video"}` and inspect current typed model cards. Require a current card whose `input_combinations` admits `[image, driving_audio]`. Compare the portrait's actual MIME type, width and height, aspect ratio, byte size, and alpha-channel presence against every image constraint currently advertised by that card. Compare the singing audio's actual MIME type, duration, and byte size against every driving-audio constraint. Current cards may, for example, advertise no PNG alpha support, an image maximum of 20 MiB, and a driving-audio maximum of 15 MiB; these are examples of live facts to read, not permanent constants or a reason to hard-code a model.

The audio duration must be at least the card's live minimum duration, currently 2 seconds, and no longer than either its live audio maximum or the longest eligible video duration that can contain the complete excerpt. If terminal audio size is absent, obtain it from trusted artifact metadata; if it remains unavailable, stop before video submission. If any actual fact is unavailable or incompatible, stop before the paid call and request the smallest compatible source change.

## Fit the singing audio to the video

Choose the smallest supported integer video duration at or above the actual audio length so the singing is not clipped, using the selected live model card's duration range as the authority. Driving-audio behavior can truncate audio longer than the video and leave silence when audio is shorter. Do not truncate or speed up approved audio or add silence merely to force a match. A fractional excerpt can leave the shortest unavoidable tail pause or held frame in an integral-duration video; disclose that possibility and inspect the ending after delivery.

Keep `model: "auto"` unless the user chose a concrete eligible model. The portrait is the strict first frame. Omit `aspect_ratio` so the route uses its declared source-derived ratio. If a destination needs another frame, ask for a first-frame image already composed for that target or explicitly route through a suitable preprocessing workflow before returning with the new image; `beatra.videos.animate` is not a crop or canvas-override step. Never silently crop, stretch, or change the canvas. Omit resolution and all other optional fields unless the destination or an explicit user decision needs them and the live model card supports them.

Build a concise performance prompt from engaged facial energy, natural mouth movement, a stable background, and named must-keeps. The normal video payload is:

```json
{
  "image": {
    "type": "artifact",
    "artifact_id": "art_portrait"
  },
  "driving_audio": {
    "type": "artifact",
    "artifact_id": "art_song"
  },
  "prompt": "An expressive singing performance with natural mouth movement and engaged facial energy, keeping the portrait identity and background stable.",
  "duration": 10,
  "client_request_id": "opaque-singing-video-id"
}
```

Before creating `client_request_id` or submitting `beatra.videos.animate`, show the admission card with every field: route, tool, audio-led duration, resolution if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A request to make the clip is not approval. Freeze all arguments and one opaque stable request ID. Submit `beatra.videos.animate` exactly once.

## Poll, recover, and cancel each stage

Keep a private ledger entry for each music and video stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record each returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If a stage's create response is lost, retry only its identical frozen payload with its same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse a music ID for video, reuse an ID after any argument changes, or replace a slow task with a duplicate. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. A changed video payload needs a new ID, a new admission card, and fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful song stage, deliver the returned audio artifact or link and report only actual model, duration, format, usage, and net charge facts. For a successful singing-photo video, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the final video for recognizable identity and must-keeps, mouth and facial movement, singing performance energy, audio presence and synchronization, stable framing, background and wardrobe, a clean ending, ratio, and actual duration. Audio-driven generation does not guarantee phoneme-perfect lip sync or exact identity across every frame. State visible drift and inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
