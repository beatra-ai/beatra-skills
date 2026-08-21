---
name: "douyin-ugc-ad-creator"
description: "Create a Douyin shopping video, Douyin UGC ad, or AI creator product pitch from a product photo, product details, and an on-camera direction. This AI UGC ad creator composes a vertical presenter frame with the product, shapes a conversational hook and spoken recommendation, and delivers a short Douyin product video for launches, creator-style reviews, demonstrations, unboxings, and paid social creative."
---

# Douyin UGC Ad Creator

Turn one inspectable product photo, verified product details, and a creator direction into one short vertical Douyin UGC-style product video. The normal route creates a product-led presenter frame, prepares a concise spoken pitch, and directs one narration-driven ad clip.

## Scope and adjacent routes

Use this Skill when the product needs to be seen and spoken about by an AI creator in one short, vertical, creator-style ad. It covers Douyin shopping videos, Douyin UGC ads, product demonstrations, unboxings, recommendation angles, and short paid-social creative.

Route a product-only clip with no creator or on-camera pitch to `product-video-studio`. Route a supplied portrait that only needs to deliver an existing message to `talking-avatar-video`. Route narration with no video to `short-form-voiceover-audio`. Route multi-shot, existing-video, or non-presenter video work to `beatra-ai-video-studio`. When evidence or rights are missing, stop at a labelled draft and do not enter paid film. Style must not imply a first-person experience the user did not supply.

## Inputs and defaults

The hard inputs are one accessible product photo that the host Agent can inspect; the merchant's own product details and experience source for every factual claim; evidence that any objective effect claim can be traced back to; the rights file; and the disclosure file. Ask for them only when absent. An objective effect claim must trace to user-supplied evidence. Reuse the product name, target buyer, selling angle, destination, brand direction, script, creator traits, and must-keeps already known in the conversation.

Default to one creator-style clip, a vertical 9:16 delivery frame, one product moment, a concise 8–12 second spoken pitch, and a conversational but focused presenter direction. Confirm the final canvas before the first paid call. Keep appearance, product shape, label, colour, visible material, supplied creator reference, setting, and approved product claims as must-keeps; review actual result drift after delivery rather than promising exact preservation.

For a local product photo or optional creator reference the host can inspect, upload it only through the bundled client:

```text
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
```

Upload is transport, not visual review. Retain the returned artifact reference and never pass a local path to a remote tool.

## Golden path

1. Inspect the product photo and record its actual MIME type, dimensions, aspect ratio, byte size, alpha channel, visible features, and any merchant-supplied claims. Shape one product moment: unboxing, first use, a problem-to-product reveal, a close demonstration, or a casual recommendation. Keep factual claims limited to the merchant's supplied details.
2. Read the live `image_to_image`, `text_to_speech`, and `image_to_video` model cards with `beatra.models.list`. Select an image route that admits the product source and confirmed vertical canvas. Select a speech route that admits the language and voice. Select a video model that explicitly admits `[image, driving_audio]`, the planned media facts, and a duration that can contain the entire spoken pitch.
3. Compose one creator-style first frame with `beatra.images.transform`: product first, then an optional creator reference. The creator direction should describe one person, one setting, one product interaction, a direct-to-camera frame, and a calm handheld or phone-shot feel. Use `beatra.images.edit` only after an accepted first frame needs one focused revision.
4. Write a short conversational hook, product moment, and clear recommendation from the visible product and merchant-approved claims. Select a ready voice with `beatra.voices.list` if the user has not chosen one.
5. **Confirm preparation.** Show the product claims, creator direction, canvas, complete script, selected voice, every paid first-frame or focused-frame edit request, the narration request, their live estimates, and one opaque stable `client_request_id` for each planned paid request. Planning and copy drafting are free; a clear request to make the prepared assets authorizes only the frozen preparation stage.
6. Submit each approved preparation request exactly once through `scripts/mcp_client.py`. Poll each returned task with `beatra.tasks.get`. Present the actual first frame and narration whenever the host can access them, report their real media facts, and ask the user to approve the accessible preparation before the dependent video stage.
7. Re-read the current `image_to_video` card and admit the accepted first frame plus the actual narration MIME type, size, and duration. Use the smallest supported integer video duration that fully contains the narration. Keep the video model explicit because the route depends on its driving-audio support.
8. **Show the video admission card.** Show route `image_to_video`, tool `beatra.videos.animate`, the exact approved frame and narration artifacts, product and creator must-keeps, motion direction, selected video model, audio-led duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved preparation does not authorize the video. Do not create a video `client_request_id` or submit until the user confirms they have topped up or already have enough credits for this estimate. Then submit one `beatra.videos.animate` request once, then poll the returned task until terminal.
9. Deliver the returned video artifact or link, resolved model, actual dimensions and duration, and `billing.net_charged_credits`. Review only media the host can actually access for product presence, understandable narration, creator delivery, motion, ending, and destination fit. Offer one focused next change without executing it.

## Paid choices, recovery, and cancellation

The first-frame preparation, optional focused first-frame edit, narration, and video are separate paid stages. Every changed product source, claim, creator reference, prompt, source order, canvas, script, voice, model, duration, or control is new paid work with a new confirmation and a new opaque request ID. A video-stage change also needs a new admission card and fresh top-up or balance confirmation. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

For every stage, invoke Beatra only through the bundled `scripts/mcp_client.py`, with the MCP tool name as the CLI argument and JSON on standard input. Do not configure or use a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Record each task ID immediately. If a create response is genuinely lost, replay only the byte-equivalent frozen payload with the same ID. If a task ID is lost, use `beatra.tasks.list`, verify candidates with `beatra.tasks.get`, and recover the original task before considering a retry. Queued and running tasks remain the original work.

Call `beatra.tasks.cancel` only when the user asks. Call it once; if cancellation returns `409`, continue polling that original task. A slow task, connection issue, update issue, or authorization issue never creates replacement paid work.

## References by task

- Read [Douyin UGC ad workflow](references/workflow.md) for the product-to-presenter route, current-model admission, payloads, confirmations, results, recovery, and cancellation.
- Read [Installation and authentication](references/installation-and-auth.md) only for authorization or shared-credential issues.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) and [billing, errors, and recovery](references/billing-errors-and-recovery.md) for shared task, artifact, billing, and structured-error facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Read [automatic updates and safety](references/automatic-updates-and-safety.md) for update guarantees and controls.
- Read [uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours per installation. When a higher version is available, it installs automatically without separate confirmation. It downloads only from fixed official Beatra discovery and immutable CDN paths for this package, channel, and locale, verifies discovery, archive, manifest, and every packaged file before replacement, and replaces only package-owned files. Update checks, downloads, verification, replacement, and recovery fail open: the current installation remains usable and the original command continues. The choice persists across later commands.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files. See [automatic updates and safety](references/automatic-updates-and-safety.md).
