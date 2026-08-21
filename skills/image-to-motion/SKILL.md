---
name: "image-to-motion"
description: "Turn a single photo, product image, portrait, illustration, or AI artwork into a short image-to-video clip. This AI photo animator and picture-to-video workflow helps you bring a still image to life with directed subject motion, camera movement, pacing, duration, and aspect ratio while treating recognizable faces, product shape, logos, and composition as must-keep priorities. Use it for product photo animation, social video hooks, cinematic motion, animated portraits, storyboard shots, and moving artwork, then review the delivered video for visual drift and motion quality."
---

# Image to Motion

Turn one still image the user supplied into one purposeful image-to-video clip. Use this Skill for a product image, portrait, photo, illustration, poster, or AI artwork when the desired result starts from that exact still and adds directed subject motion, camera movement, and pacing.

## Scope and adjacent routes

The trigger is one supplied still becoming one short clip. Route a text-only request to text-to-video; route strict first and last frames to a frames-to-video workflow; route changes or extensions to an existing video to video edit or extend; and route a speaking, lip-synced, or audio-driven presenter to a talking-avatar workflow. Keep a viable motion or video-edit request on its appropriate video route; never replace it with image generation.

## Inputs and defaults

The one hard input is an accessible image that the host Agent can visually inspect. If it is missing or inaccessible, ask only for that image and stop before diagnosis or paid preparation. Reuse a known destination, motion intent, must-keeps, and framing instead of asking again. If a local file is visible to the host Agent, upload it for transport with the bundled helper:

```text
python3 scripts/mcp_client.py upload ./selected-image.png --mime-type image/png
```

Upload is transport, not diagnosis. Inspect the visible source before upload, retain the returned artifact reference, and never pass a local path to a remote tool.

Default to one clip, `model: "auto"`, and the supplied image as the strict first frame. After the live `image_to_video` card is read, write the shortest integer `duration` that card admits. Omit aspect ratio, resolution, audio, and every other optional control unless the destination or an explicit user choice requires one; when resolution is required, use the lowest admitted tier unless the user named a higher one. Build the direction around one readable subject action and one primary camera movement. Treat requested faces, product shape, logos, typography, and composition as must-keeps; do not require the user to weaken those priorities in advance. Review the delivered clip for drift because generative motion cannot guarantee pixel-perfect later frames.

## Golden path

1. Inspect the visible image. Identify the subject, framing, protected details, destination, one subject action, one camera move, and pacing. Express them as a compact motion brief. Do not replace the supplied still with `beatra.images.generate` or `beatra.videos.enhance_prompt`.
2. Call `beatra.models.list` with `{"capability":"image_to_video"}` before naming compatibility, duration, resolution, or a numeric estimate. Keep `model: "auto"` unless the user chose a concrete eligible model. Admit the complete payload against one current card. Write the shortest admitted integer `duration`. Omit aspect ratio and other optional controls unless a user choice or destination requires them. Any numeric estimate is provisional; never quote a remembered price. The terminal task's `billing.net_charged_credits` is final.
3. Show an admission card before any `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, source, brief, duration, resolution if set, output count, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms they have topped up or already have enough credits for this estimate.
4. Freeze the image reference, prompt if used, model, duration, aspect ratio, resolution, audio, every optional control, and one opaque stable `client_request_id` in a private execution ledger. Invoke the bundled `scripts/mcp_client.py` only: the MCP tool name is the CLI argument and its tool arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"image":{"type":"artifact","artifact_id":"art_opening"},"prompt":"A restrained camera push while the product remains centered.","duration":5,"client_request_id":"opaque-stable-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.videos.animate` exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Queued and running are progress states, never reasons to resubmit.
6. Deliver every returned video artifact or link. Report only actual returned facts: task ID and status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Compare the result with the source for subject stability, intended and unwanted motion, camera coherence, pacing, must-keep drift, and destination fit. State the limits of what the host Agent could actually inspect; never claim to have reviewed frames or audio that were not accessible.

## Paid changes, recovery, and cancellation

A changed source, prompt, model, duration, aspect ratio, resolution, audio, or other control is new logical paid work: create a new ID, show the changed admission card, and obtain fresh top-up or balance confirmation. Never reuse an ID across changed arguments. On `insufficient_balance`, relay the returned message, keep the top-up URL exact, and retry the same frozen ID only after the user says they have topped up.

If the create response is lost, an identical retry is allowed only with the same frozen arguments and same ID. If the task ID is lost, call `beatra.tasks.list` with `{"capability":"image_to_video"}`, call `beatra.tasks.get` for plausible candidates, and match their returned facts against the private ledger before considering that identical retry. Recover the original task before planning changed work. Failures and timeouts do not authorize a duplicate submission or a guessed refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. A 409 means cancellation is not confirmed; continue polling that same task and do not create replacement work.

## References by task

- Read [Motion brief, request, and recovery](references/workflow.md) when constructing the brief or exact payload, checking live model facts, polling, recovering a task, cancelling, or reviewing delivery.
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
