---
name: "first-last-frame-video"
description: "Generate one short directed transition from an approved first frame to an approved last frame, turning two images into one clip that begins and ends on those images. This first-and-last-frame video and two-images-to-video generator creates outfit transformations, product reveals, before-and-after stories, day-to-night shifts, and scene teleports, and plans the motion, camera path, subject path, and reveal timing between the endpoints, then reviews that the clip truly starts and ends on the approved frames plus middle motion, direction, duration, and audio. Use it for transformations, product reveals, before-and-after stories, scene changes, and cinematic endpoints, with one transition per run and honest post-result review."
---

# First & Last Frame Video

Generate one short motion path that starts on an approved first frame and lands on an approved last frame. Use this Skill when the user has two endpoint images and asks for a first-and-last-frame clip, a two-image transition, a before/after transformation, an outfit transformation, a product reveal, a day-to-night shift, a scene teleport, or a loop-like visual return.

## Scope and adjacent routes

The normal route is two approved images and one transition clip between them. Route a request that animates one single starting image to an image-to-motion workflow; a request that adds footage before or after one source video to a video-continuation workflow; and a request that restyles an existing clip to a video-restyle workflow. Keep this route focused on a directed transition between two strict image endpoints.

## Inputs and defaults

The hard inputs are:

- two approved endpoint images with clear identities (a first frame and a last frame) the host Agent can inspect;
- the event that should occur between them.

Ask only for a missing hard input. Reuse the known scene, mood, aspect ratio, and audio preference. If either endpoint does not yet exist, it must be created and approved as a separate image stage before the video is generated.

For local endpoint images the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./first-frame.png --mime-type image/png
python3 scripts/mcp_client.py upload ./last-frame.png --mime-type image/png
```

Upload is transport, not creative review. Retain the returned artifact references and never pass a local path to a remote tool.

Default to one transition clip and `model: "auto"`. After the live `frames_to_video` card is read, write the shortest integer `duration` that card admits. Omit resolution and other optional controls unless the destination or an explicit user choice requires one; when resolution is required, use the lowest admitted tier unless the user named a higher one. Inspect both endpoints for subject identity, geometry, framing, aspect ratio, background, lighting, and visual deltas. Convert them into a transition map: fixed elements, changing elements, direction of motion, camera, and the intended landing moment on the last frame.

## Golden path

1. Inspect both endpoint images. Record each image's actual MIME type, width, height, aspect ratio, and byte size. Identify the subject identity, geometry, framing, background, lighting, the visual deltas between the two frames, and the requested event between them.
2. Build a transition map from the two endpoints: fixed elements, changing elements, direction of motion, camera, and the intended landing moment on the last frame. Then state one positive transition instruction that names the single event the motion should deliver.
3. If either endpoint must be created, make and approve it as a separate image stage through `beatra.images.generate` before the video run. Read the image card's live `pricing.options`, match their dimensions to the admitted canvas, and use the highest eligible option as the approval ceiling if one price cannot be known before admission. Never multiply the image estimate by input-image count. A transition that depends on a not-yet-created frame cannot be submitted until that frame exists and its real MIME type, bytes, and dimensions have been admitted downstream.
4. Call `beatra.models.list` with `{"capability":"frames_to_video"}` before naming compatibility, duration, resolution, or a numeric estimate. Admit the complete payload against one current card: both endpoint images' actual MIME types, dimensions, and byte sizes, live duration behavior, aspect-ratio handling, whether driving audio is admitted for this image/audio combination, and the price basis. Write the shortest admitted integer `duration`. Keep the model at `auto` unless the user chose a concrete eligible model. Any numeric estimate is provisional; the terminal task's `billing.net_charged_credits` is final.
5. Show an admission card before any `client_request_id` or `beatra.videos.interpolate` call: route `frames_to_video`, tool `beatra.videos.interpolate`, first and last frames, transition instruction, duration, resolution if set, output count, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A separately created endpoint image is its own paid image stage and does not authorize the interpolate call.
6. Freeze the first frame, last frame, transition instruction, optional driving audio when used, model, duration, and one opaque stable `client_request_id`; then submit one `beatra.videos.interpolate` call exactly once with strict `first_frame` and `last_frame`. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. Replace `5` with the shortest integer the current card actually admits:

   ```text
   printf '%s' '{"first_frame":{"type":"artifact","artifact_id":"art_first"},"last_frame":{"type":"artifact","artifact_id":"art_last"},"prompt":"Transform the subject from the daytime outfit to the evening outfit with a smooth camera push-in, keeping the face and background aligned.","duration":5,"client_request_id":"opaque-interpolate-id"}' | python3 scripts/mcp_client.py call beatra.videos.interpolate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.videos.interpolate` exactly once.
7. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output to confirm it truly starts and ends on the approved frames, then inspect the middle motion, subject and lettering drift, direction, duration, and audio. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

A transition is one paid video stage. A changed first frame, last frame, transition instruction, driving audio, model, duration, or control is new logical paid work with a new ID, a new admission card, and fresh top-up or balance confirmation. A separately created endpoint image is its own paid image stage with its own request ID. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [First-and-last-frame workflow](references/workflow.md) when building a transition map, creating an endpoint image, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing endpoint fidelity and middle motion.
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
