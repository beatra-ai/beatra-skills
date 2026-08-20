---
name: "beatra-ai-video-studio"
description: "Plan and create short AI videos from a written shot, a supplied image, exact first and last frames, multimodal references, or existing footage. Beatra AI Video Studio supports text-to-video, image-to-video, reference-guided generation, AI video editing, and AI video extension for product videos, ad creative, social clips, b-roll, transitions, reveals, and cinematic concepts. Review each delivered clip for action, subject stability, camera, continuity, audio when requested or returned, and destination fit, then choose the smallest useful edit, extension, or new render."
---

# Beatra AI Video Studio

Turn an idea or supplied media into one directed short clip. Start with the user's outcome, shape one readable shot, choose the matching video operation, and review the real delivery before proposing another paid stage.

## Scope and adjacent routes

Use this Skill for video-prompt enhancement, text-to-video, an exact opening
image, an exact closing frame with an optional opening frame, loose multimodal
references, edits to existing footage, and footage added immediately before or
after one source clip. It is a broad video workspace for short ads, product
stories, social clips, b-roll, transitions, reveals, and cinematic concepts.

Captions, narration production, speech synthesis, and timeline assembly are separate jobs. A multi-shot request can be planned and delivered as separate clips, but this workflow does not claim to join them into one timeline. Use a focused talking-avatar or image-to-motion workflow when that narrower result is the whole request; remain here when the user needs broader route selection or several distinct shot types.

Prefer media the user already supplied. Offer an optional still-image preparation stage only when a missing or unsuitable anchor materially affects identity, product form, composition, or a required boundary frame. Do not silently replace a usable source or a direct-video request with image generation.

## Inputs and defaults

The minimum hard input is one of:

- a written description of the shot;
- one accessible image that must be the opening frame;
- one accessible image that must be the last frame, with an optional first-frame image;
- accessible image, video, or audio references within the selected live card's count and duration limits, with clear order and purpose; or
- one accessible source video plus a precise edit instruction or an extension direction.

Ask only for information that changes the route or result. Reuse known destination, duration, ratio, resolution, subject, action, camera, pacing, audio intent, visual references, and must-keeps. When these are unspecified, default to one short clip, one readable action, one primary camera move, `model: "auto"`, and the selected model's live defaults. Omit aspect ratio for source-led routes unless the user explicitly approves a canvas change.

For a local image, audio file, or video that the host Agent can access, inspect it first and use the bundled upload helper:

```text
python3 scripts/mcp_client.py upload ./approved-input.mp4 --mime-type video/mp4
```

Upload is transport, not media review. Keep the returned artifact reference and never pass a local path to a remote tool.

## Choose one video route

Select exactly one video operation for each logical paid stage:

1. The brief needs a stronger production prompt before generation: `beatra.videos.enhance_prompt` with `video_prompt_enhancement` model facts. This returns text only and is billed after successful completion from actual tokens.
2. No required visual source: `beatra.videos.generate` with `text_to_video` model facts.
3. One image is the strict opening frame: `beatra.videos.animate` with `image_to_video` model facts.
4. One image is the strict closing frame, with an optional strict opening frame: `beatra.videos.interpolate` with `frames_to_video` model facts.
5. Ordered image, video, or audio media guides a new clip without fixing boundary frames: `beatra.videos.generate_from_references` with `reference_to_video` model facts.
6. Existing footage must change: `beatra.videos.edit` with `video_edit` model facts.
7. Footage must be added immediately before or after exactly one source clip: `beatra.videos.extend` with `video_extend` model facts. Its required integer `duration` is the final returned-video duration, must exceed the trusted source duration, and is not the number of seconds to add.

Do not exchange these routes casually. Prompt enhancement returns text and
never starts generation. Editing changes existing content, extension continues
one clip, references guide a new clip, animation preserves one image as the
opening frame, and interpolation preserves a required closing frame with an
optional opening frame. `beatra.videos.extend` neither joins clips nor assembles
a timeline.

## Golden path

1. Inspect every accessible source. Record each media role plus its actual MIME type, byte size, dimensions and aspect ratio for images, duration for audio and video, and any other fact required by the live card. State the destination, one visible event, pacing, camera, audio intent, and must-keeps. If the host cannot inspect a property or the media itself, say so instead of inventing it.
2. Choose one of the seven routes. Read [Intent and routing](references/intent-and-routing.md) for ambiguous sources or multi-shot work, and [Shot design](references/shot-design.md) to turn the goal into a concise direction.
3. Call `beatra.models.list` for that route's exact capability before relying on model availability, accepted input combinations, media limits, controls, durations, ratios, resolutions, or price. Keep `model: "auto"` unless the user chose a concrete eligible model. An explicitly named model is evaluated as requested and is never silently replaced.
4. Admit the complete payload against one current eligible model card. Compare actual media kind, MIME type, byte size, dimensions, aspect ratio, duration, reference counts and combinations, and supported controls as applicable. For editing and extension, include the trusted source-video duration. If a required fact is unavailable or no live card accepts the planned payload, stop before the paid call and request the smallest compatible source or plan change.
5. If a still-image stage is useful, explain what it controls, the separate paid call, and why it is the smallest useful preparation. Use `beatra.images.generate` for a missing still, `beatra.images.transform` for one to four ordered references that should form a new shot frame, or `beatra.images.edit` when `images[0]` is the base and a bounded part should change. Inspect and approve the delivered still before constructing dependent video work. Read [Image-assisted video](references/image-assisted-video.md).
6. Show the route, exact sources, direction, model behavior, duration, canvas, resolution, optional controls, provisional live estimate, and paid-call count. Numeric estimates come only from current model cards; the terminal task's `billing.net_charged_credits` is final. A clear request to make the prepared clip can authorize that frozen video stage. Planning, comparison, or an unresolved model, canvas, media, or count choice does not.
7. Freeze the exact payload with one opaque stable `client_request_id`. Invoke only the bundled client: put the MCP tool name after `call` and its JSON arguments on standard input. For example:

   ```text
   printf '%s' '{"prompt":"A close product reveal with one slow push-in and a stable background.","model":"auto","client_request_id":"opaque-video-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate
   ```

   Do not configure, call, or depend on a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Submit the frozen request exactly once.
8. Record the returned task ID immediately and poll that same task with `beatra.tasks.get` until terminal. Queued and running are progress, not failure. Do not resubmit because a task is slow.
9. Deliver every returned video or image artifact or link. Report only actual terminal status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review what is accessible for the requested action, subject stability, camera, continuity, audio, must-keeps, and destination fit. State what the host Agent could and could not inspect.
10. Recommend the smallest useful next step: accept the clip, make one focused edit, extend it, or create a new render. Never imply that an unreviewed clip is a finished campaign asset.

## Multi-shot work and paid confirmation

For a multi-shot request, plan each shot as a separate delivered clip. Freeze the shot list, route and exact payload for each stage, dependencies, optional still stages, total paid-call count, and provisional estimate before execution. One explicit confirmation may authorize the entire frozen sequence when the user asked for that sequence and all stages are visible; otherwise confirm each stage separately. Every paid request still has its own stable ID and is submitted once.

Run dependent stages in order. Review an image before its video and review a clip or returned last frame before relying on it downstream. If a delivery materially changes the next approved shot, pause and re-plan that next stage rather than silently using stale assumptions. Deliver separate clips and explain that timeline assembly remains outside this workflow.

## Changes, recovery, and cancellation

A changed tool, model, source, source order, prompt or instruction, direction, duration, aspect ratio, resolution, or optional control is new logical paid work. Assign a new ID and obtain fresh approval unless it was already included in a frozen approved multi-shot sequence. Never reuse an ID for changed arguments.

If a create response is lost, retry only the identical frozen payload with its same request ID. If the task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them to the private request ledger before considering an identical retry. Recover the original request before planning a replacement; never duplicate a paid submission or guess its artifact, charge, refund, or state.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 does not confirm cancellation, so continue polling the same task rather than creating replacement work.

## References by task

- Read [Intent and routing](references/intent-and-routing.md) to classify supplied media, distinguish all seven routes, or plan separate multi-shot deliveries.
- Read [Shot design](references/shot-design.md) to shape subject action, camera, pacing, canvas, audio intent, and preservation priorities.
- Read [Image-assisted video](references/image-assisted-video.md) only when a missing or unsuitable still anchor may justify a separate image stage.
- Read [Video recipes](references/video-recipes.md) for exact payload shapes, route-specific live model and media admission, upload semantics, and paid execution.
- Read [Review and iteration](references/review-and-iteration.md) to inspect a terminal result and choose one focused next operation.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
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
