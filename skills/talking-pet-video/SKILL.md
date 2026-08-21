---
name: "talking-pet-video"
description: "Make a pet talk by animating one clear pet photo with a short message or prepared voice clip. This talking pet video and talking dog and cat generator workflow turns a single pet photo into a shareable talking-pet clip from one pet image and a short spoken line, and reviews breed and face identity, mouth motion, speech clarity, and synchronization. Use it for pet greetings, funny pet dialogue, pet reactions, pet stories, festive pet messages, and pet-creator content."
---

# Talking Pet Video

Turn one clear pet photo and a short message or prepared voice clip into a shareable talking-pet clip. Use this Skill for making a pet talk, a dog or cat voiceover, a pet greeting, a pet reaction, funny pet dialogue, a pet story, or a pet message video.

## Scope and adjacent routes

The normal route is one pet photo, one approved speech track, and one talking-pet clip. Use an existing approved speech recording directly, or prepare speech from a short script with an available voice. Route a request for a pet dance or motion without speech to an image-to-motion workflow; a human spoken portrait to the talking-avatar-video workflow; and a portrait that should sing to the photo-singing-video workflow. Keep the pet-talking route focused on one pet photo plus speech. Multi-speaker dialogue should arrive as an approved mixed track.

## Inputs and defaults

The hard inputs are:

- one accessible pet photo the host Agent can inspect;
- either an accessible, approved speech track or a short script plus an available voice choice.

Ask only for a missing hard input. Reuse the known occasion, language, framing, energy, background, and delivery intent. For a local image or audio file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./pet-photo.png --mime-type image/png
python3 scripts/mcp_client.py upload ./approved-message.mp3 --mime-type audio/mpeg
```

Upload is transport, not visual or audio review. Retain each returned artifact reference and never pass a local path to a remote tool.

Default to one talking-pet clip, `model: "auto"`, the pet photo as the strict first frame, and a source-derived aspect ratio. Omit resolution and other optional controls unless the destination or an explicit user choice requires them. Pet anatomy varies significantly; select a clear front-facing image and review the result rather than promising identical performance across animals. For synthesized speech, default an unspecified format to `mp3` only when a live speech card supports it and a live video card accepts its expected `audio/mpeg` output. Treat breed, coat, face identity, framing, and background as must-keeps and review the result for drift rather than promising exact preservation or perfect lip sync.

## Golden path

1. Inspect the pet photo. Record its actual MIME type, width, height, aspect ratio, byte size, and whether it has an alpha channel. Identify the breed, coat, face visibility, framing, background, and must-keeps. If the user supplied approved audio, review what is actually accessible and record its real MIME type, duration, and byte size; otherwise make the short script natural to say without changing its meaning.
2. For a script route, call `beatra.voices.list` only when a voice still needs to be selected. Call `beatra.models.list` with `{"capability":"text_to_speech"}` when selecting the language, output format, named model, optional control, or numeric estimate. Keep the speech model at `auto` unless the user chose a concrete compatible model. Numeric estimates are provisional and require live catalog facts.
3. Before any paid synthesis, call `beatra.models.list` with `{"capability":"image_to_video"}`. Confirm that a current card admits `[image, driving_audio]`. Compare the pet photo's actual MIME type, width and height, aspect ratio, byte size, and alpha-channel presence with every advertised image constraint; compare supplied audio's actual MIME type, duration, and byte size with every advertised driving-audio constraint. Also confirm that planned speech can fit a video duration the route can fully contain. If any required media fact is unavailable or incompatible, stop before TTS and request the smallest compatible source change. For a script route, use `mp3` only when the live speech card supports it and the live video card accepts the corresponding `audio/mpeg`.
4. Show the exact speech arguments and paid boundary. A clear instruction to synthesize that prepared line can count as approval; planning, auditioning, comparison, or an unresolved voice or format choice does not. Freeze the script, voice, language, model, format, optional controls, and one opaque stable `client_request_id`; then submit one `beatra.speech.synthesize` call exactly once.
5. Poll the speech task with `beatra.tasks.get` until terminal. On success, read the returned artifact plus the actual `task.output.audio.mime_type`, `task.output.audio.duration_seconds`, and `task.output.audio.size_bytes` when present. Present or play the real audio when the host can do so, and ask the user to approve it before the dependent video stage. Never treat a script preview, expected duration, requested format, or task metadata as an audio review.
6. Refresh or re-read the current `image_to_video` cards and admit the actual pet photo plus approved speech again. Recheck every image fact and compare the audio's actual MIME, duration, and byte size with the current driving-audio constraints. The audio duration must be at least the live minimum and must not exceed either the live audio maximum or the longest eligible video duration that can contain the complete message. Use the smallest supported integer video duration at or above the actual speech length so words are not truncated; do not add silence. If any media fact is unavailable or incompatible, stop before video submission and propose the smallest message, recording, or photo change.
7. Keep `model: "auto"` unless the user chose a concrete eligible video model. Preserve the photo-derived aspect ratio by omitting `aspect_ratio`. If the destination needs another frame, ask for a first-frame image already composed for that target or explicitly route through a suitable preprocessing workflow before returning with the new image; `beatra.videos.animate` is not a crop or canvas-override step. Never crop, stretch, or change the canvas silently.
8. Show an admission card before any video `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, pet photo, approved speech, prompt, audio-led duration, resolution if set, output count, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved speech does not authorize the video call. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Freeze them with a new opaque stable `client_request_id`. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"image":{"type":"artifact","artifact_id":"art_pet"},"driving_audio":{"type":"artifact","artifact_id":"art_speech"},"prompt":"A friendly pet speaks directly to camera with natural mouth movement and a stable body and background.","duration":6,"client_request_id":"opaque-pet-video-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.videos.animate` exactly once.
9. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for breed and coat identity, face identity, mouth motion, speech clarity, synchronization, body deformation, stable framing, background, ending quality, ratio, and actual duration. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

Speech and video are separate paid stages. Each has its own frozen payload, stable request ID, approval, create response, and task ID. A changed script, voice, language, speech control, image, audio, prompt, model, duration, aspect ratio, resolution, or video control is new logical paid work with a new ID and fresh approval. A video-stage change also needs a new admission card and fresh top-up or balance confirmation. A revised speech track also invalidates any unsubmitted dependent video plan that named the old audio. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Talking-pet workflow](references/workflow.md) when inspecting a pet photo, preparing or uploading speech, selecting a voice, checking duration and live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing pet identity and mouth motion.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md) for update guarantees and controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation. Before ordinary commands it silently checks for a newer release at most once every 24 hours per installation. Silent checks are enabled by default, and a newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable Beatra CDN path embedded for this package, channel, and locale. It verifies the discovery data, archive, manifest, and every file's size and checksum before replacement. It replaces only package-owned files and rejects redirects, downgrades, wrong package/channel/locale/version data, unexpected URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery fail open: the current installation remains usable and the user's original command continues. An update failure never authorizes retrying a paid generation. The automatic-update choice persists across later commands for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files.
