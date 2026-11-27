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

Prefer media the user already supplied. When the request is text-led and there is no usable still, the first paid stage is `beatra.videos.enhance_prompt` or one `beatra.images.generate` keyframe, each with its own confirmation card. That gift-sized first win does not authorize `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, `beatra.videos.generate_from_references`, `beatra.videos.edit`, or `beatra.videos.extend`. Do not silently replace a usable source.

## Inputs and defaults

The minimum hard input is one of:

- a written description of the shot;
- one accessible image that must be the opening frame;
- one accessible image that must be the last frame, with an optional first-frame image;
- accessible image, video, or audio references within the selected live card's count and duration limits, with clear order and purpose; or
- one accessible source video plus a precise edit instruction or an extension direction.

Ask only for information that changes the route or result. Reuse known destination, duration, ratio, resolution, subject, action, camera, pacing, audio intent, visual references, and must-keeps. When these are unspecified, default to one short clip, one readable action, one primary camera move, `model: "auto"`, the shortest integer duration the selected live card admits, and the lowest admitted resolution unless the user named a higher tier (Pro / 2K / 1080p). Do not omit duration on `model: "auto"`, and do not hard-code 8, 10, or 15 when the card allows a shorter integer. Audio-led duration stays audio-led: write the smallest admitted whole second at or above the real speech or song length, and do not shorten words to cheapen the clip. `beatra.videos.extend` `duration` is the final returned length and must exceed the trusted source duration. Omit aspect ratio for source-led routes unless the user explicitly approves a canvas change.

For a local image, audio file, or video that the host Agent can access, inspect it first and use the bundled upload helper:

```text
python3 scripts/mcp_client.py upload ./approved-input.mp4 --mime-type video/mp4
```

Upload is transport, not media review. Keep the returned artifact reference and never pass a local path to a remote tool.

## Choose one video route

Select exactly one video operation for each logical paid stage:

1. Text-led with no usable still: first paid stage is `beatra.videos.enhance_prompt` with `video_prompt_enhancement` model facts, or one `beatra.images.generate` keyframe with `text_to_image` model facts. Each has its own confirmation card. Prompt enhancement returns text only and is billed after successful completion from actual tokens. The keyframe is one still. Neither authorizes a later video call.
2. After that gift delivery, or when a usable still is still absent and the prompt is ready: `beatra.videos.generate` with `text_to_video` model facts, only after the video admission card.
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

## Before the connection is ready

When `scripts/mcp_client.py` reports missing credentials or `BEATRA_AUTH_REQUIRED` (HTTP 401), always run `python3 scripts/authorize.py` first—even in headless, automated, or no-confirmation environments—because an open or pre-authorized session completes immediately and prints `Beatra is ready` (at most twice per turn; never stop at `scripts/mcp_client.py verify` alone; see [Installation and authentication](references/installation-and-auth.md)).

Only when `python3 scripts/authorize.py` exits with `BEATRA_AUTH_PENDING` (exit status `3`) after at most two runs in the turn, finish and deliver everything that needs no connection in the format the user asked for: the route choice, shot design, per-shot prompts, and a complete six-field offline video admission card with explicit unit-labeled target values and pending-live-card markers (**Work** naming the route, MCP tool, and requested target settings with units such as duration in seconds, aspect ratio, and resolution marked pending live `beatra.models.list` ceiling and combination checks, keeping `model: "auto"` or evaluating a user-named model once connected; **Credits** marked as 0 credits charged now with the live credit estimate pending `beatra.models.list` after Beatra is ready; **Count** of planned paid calls; **Identity** stating that `client_request_id` is withheld until live-card admission and approval and kept in Agent notes; **If they stop** keeping the delivered shot brief and prompts usable at zero charge; and **If balance fails** relaying Beatra's official message and verbatim top-up URL on `insufficient_balance` and retrying only after confirmed top-up), plus the exact `scripts/mcp_client.py` command sequence ready to run after Allow. Say in one line that the paid step continues on their next message after Allow; Allow only completes the connection, and every video stage still waits for its live admission card on that next message. Never use web search, another tool, or memory to invent or claim verified model names, supported duration or resolution ceilings, per-second credit prices, or task outcomes.

## Golden path

1. Inspect every accessible source. Record each media role plus its actual MIME type, byte size, dimensions and aspect ratio for images, duration for audio and video, and any other fact required by the live card. State the destination, one visible event, pacing, camera, audio intent, and must-keeps. If the host cannot inspect a property or the media itself, say so instead of inventing it.
2. Choose one of the seven routes. Read [Intent and routing](references/intent-and-routing.md) for ambiguous sources or multi-shot work, and [Shot design](references/shot-design.md) to turn the goal into a concise direction. When the request is text-led and there is no usable still, the first paid stage is prompt enhancement or one keyframe; read [Image-assisted video](references/image-assisted-video.md) for the still option.
3. Call `beatra.models.list` with that stage's exact capability JSON (`{"capability":"text_to_video"}`, `{"capability":"image_to_video"}`, `{"capability":"frames_to_video"}`, `{"capability":"reference_to_video"}`, `{"capability":"video_edit"}`, `{"capability":"video_extend"}`, `{"capability":"video_prompt_enhancement"}`, or `{"capability":"text_to_image"}`) before relying on model availability, accepted input combinations, media limits, controls, durations, ratios, resolutions, or price. Without a live card, do not name a model or a price, and never look up prices or model limits via web search; give the selection criteria and mark ceilings and live credits as pending the live card. Keep `model: "auto"` unless the user chose a concrete eligible model. An explicitly named model is evaluated as requested and is never silently replaced. Before `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, `beatra.videos.generate_from_references`, `beatra.videos.edit`, or `beatra.videos.extend`, write the shortest admitted integer duration (audio-led and extend rules unchanged) and the lowest admitted resolution unless the user named a higher tier.
4. Admit the complete payload against one current eligible model card. Compare actual media kind, MIME type, byte size, dimensions, aspect ratio, duration, reference counts and combinations, and supported controls as applicable. For editing and extension, include the trusted source-video duration. If a required fact is unavailable or no live card accepts the planned payload, stop before the paid call and request the smallest compatible source or plan change.
5. When the first paid stage is a gift-sized win, show that stage's six-field production card — **Work** (`beatra.videos.enhance_prompt` on `video_prompt_enhancement` with prompt and target duration/ratio if set, or one keyframe on `text_to_image` via `beatra.images.generate` with direction and canvas if set), **Credits** (live estimate just read), **Count** (one paid call), **Identity** (one fresh opaque `client_request_id` kept in Agent notes and never shown raw to the user), **If they stop** (the free shot brief stays usable), and **If balance fails** (relay Beatra's official message with the top-up URL unchanged and retry only after confirmed top-up) — wait for approval, submit once, and deliver the text or still. Use `beatra.images.transform` only for one to four ordered references that should form a new shot frame, or `beatra.images.edit` when `images[0]` is the base and a bounded part should change. Inspect the delivered still before constructing dependent video work. This gift card does not authorize any video call.
6. Show a six-field video admission card before any `client_request_id` or `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, `beatra.videos.generate_from_references`, `beatra.videos.edit`, or `beatra.videos.extend` call: **Work** (route, MCP tool name, and unit-labeled live-card duration, resolution, and aspect), **Credits** (provisional live estimate just read), **Count** (one charge for this video slot), **Identity** (one fresh opaque `client_request_id` minted after approval, kept in Agent notes, and never shown raw to the user), **If they stop** (the free brief and any delivered prompt or still stay usable at zero extra cost), and **If balance fails** (relay Beatra's official message with the top-up URL unchanged and retry only after confirmed top-up). Numeric estimates come only from current model cards; the terminal task's `billing.net_charged_credits` is final. Planning, comparison, or “make the clip” is not approval. Do not create `client_request_id` or submit until the user approves the card.
7. Freeze the exact payload with one opaque stable `client_request_id`. Invoke only the bundled client: put the MCP tool name after `call` and its JSON arguments on standard input. The example below uses admitted duration `5`; replace it with the shortest integer the current card actually admits:

   ```text
   printf '%s' '{"prompt":"A close product reveal with one slow push-in and a stable background.","model":"auto","duration":5,"client_request_id":"opaque-video-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate
   ```

   Do not configure, call, or depend on a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Submit the frozen request exactly once.
8. Record the returned task ID immediately and poll that same task with `beatra.tasks.get` until terminal. Queued and running are progress, not failure. Do not resubmit because a task is slow.
9. Deliver every returned video or image link or file. Lead the reply with the result and format the user asked for; the admission card, route choice, and cost notes follow it and never replace it. Report the real format, dimensions, duration, and `billing.net_charged_credits` in plain words, keeping field names, MIME strings, `task_id`, `artifact_id`, and resolved model IDs in Agent notes unless the user asks for them, and never promise the prepaid estimate is the final charge. Review what is accessible for the requested action, subject stability, camera, continuity, audio, must-keeps, and destination fit. State what the host Agent could and could not inspect.
10. Recommend the smallest useful next step: accept the clip, make one focused edit, extend it, or create a new render. Never imply that an unreviewed clip is a finished campaign asset.

## Multi-shot work and paid confirmation

For a multi-shot request, plan each shot as a separate delivered clip. Freeze the shot list, route and exact payload for each stage, dependencies, required or optional still stages, total paid-call count, and provisional estimate before execution. A text-led shot with no usable still still needs its gift-sized prompt or keyframe card first. One explicit confirmation of the plan does not authorize any video stage; each video generate, animate, interpolate, reference, edit, or extend call still needs its own admission card and approval. Every paid request still has its own stable ID and is submitted once.

Run dependent stages in order. Review an image before its video and review a clip or returned last frame before relying on it downstream. If a delivery materially changes the next approved shot, pause and re-plan that next stage rather than silently using stale assumptions. Deliver separate clips and explain that timeline assembly remains outside this workflow.

## Changes, recovery, and cancellation

A changed tool, model, source, source order, prompt or instruction, direction, duration, aspect ratio, resolution, or optional control is new logical paid work. Assign a new ID, show a new admission card for a video stage, and wait for the user's approval of that card. Never reuse an ID for changed arguments. On `insufficient_balance`, relay the returned public message, keep the top-up URL inside the balance error exact, translate the rest, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with its same request ID. If the task ID is lost or the user asks about an earlier clip, paginate `beatra.tasks.list` (omitting `cursor` on the first page and passing non-empty `next_cursor` on later pages), inspect plausible candidates with `beatra.tasks.get`, and match them to the private request ledger before considering an identical retry. When connection is still `BEATRA_AUTH_PENDING`, state that task states and charges live on Beatra's server, never guess terminal outcomes, and give the exact `beatra.tasks.list` and `beatra.tasks.get` commands plus matching fields (capability, requested duration, creation window, and `client_request_id` when known) to run right after Allow. Recover the original request before planning a replacement; never duplicate a paid submission or guess its artifact, charge, refund, or state.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 does not confirm cancellation, so continue polling the same task rather than creating replacement work.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- Read [Intent and routing](references/intent-and-routing.md) to classify supplied media, distinguish all seven routes, or plan separate multi-shot deliveries.
- Read [Shot design](references/shot-design.md) to shape subject action, camera, pacing, canvas, audio intent, and preservation priorities.
- Read [Image-assisted video](references/image-assisted-video.md) when there is no usable still, or when an unsuitable still needs a separate image stage.
- Read [Video recipes](references/video-recipes.md) for exact payload shapes, route-specific live model and media admission, the video admission card, upload semantics, and paid execution.
- Read [Review and iteration](references/review-and-iteration.md) to inspect a terminal result and choose one focused next operation.
- Read [Installation and authentication](references/installation-and-auth.md) when Beatra is newly installed, missing credentials, or recovering authorization.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
