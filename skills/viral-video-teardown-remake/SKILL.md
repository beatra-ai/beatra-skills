---
name: "viral-video-teardown-remake"
description: "Turn a short video that already worked into your own version. Paste the link and this viral video teardown and short-video remake workflow reads the reference itself on TikTok, Douyin, Xiaohongshu, Instagram, YouTube, or X — caption, author, visible metrics, the comments where the audience says what landed, and on YouTube the full transcript — or work from a file, screenshots, or your own description instead. It breaks the clip into its hook, body beats, and call to action, names the script pattern behind it, scores what carried the performance, then rewrites that structure around your product or topic — delivering a shot list with visuals and narration kept apart, generated shot frames, a voiced narration track, and one vertical clip animated from your opening beat. Use it to study a competitor's viral short, borrow a proven structure for Reels, Shorts, or WeChat Channels, rebuild a benchmark video under your own brand, or turn a saved reference into a content formula you can run again."
---

# Viral Video Teardown Remake

Take one short video that already performed, work out the structure underneath it, and rebuild that structure around the user's own subject — ending in shot frames, narration, and one finished vertical clip.

## Scope and adjacent routes

The route is: a reference clip, a teardown, a rewritten shot list, and a remade video. It fits when someone points at a specific video and wants their own version of it.

When there is no reference to work from, another workflow fits better. An original idea with no benchmark belongs in a storyboard workflow. A product photo that should become a selling video belongs in a product-video workflow. A finished script that only needs a voice belongs in a voiceover workflow. Restyling the reference footage itself, rather than rebuilding it, belongs in a video-restyle workflow.

## Inputs and defaults

Two hard inputs: the reference — and what the remake is about.

The reference can arrive in several shapes, and every shape works. A video file the host Agent can open is richest for anything visual. Screenshots of the key moments, a pasted transcript or caption, or the user's own description of what happens each beat are all enough to run the teardown. Take whatever form arrives and say plainly, once, which parts you read yourself and which came from the user's account of it. Never describe frames you did not see.

A link is the shape most people reach for first, and this package can read one directly: the post's caption, author, and visible metrics on TikTok, Douyin, Xiaohongshu, Instagram, YouTube, and X, its comments, and — on YouTube only — its transcript. Each of those is a paid lookup, each is optional, and each is confirmed on its own before it runs, per [reading the reference from a link](references/reference-lookup.md). A lookup never shows you a frame; framing, motion, and cutting rhythm still come from a file, from screenshots, or from the user.

The subject is the user's product, service, topic, or account. Reuse whatever the conversation already states about it rather than asking again.

Default to a 9:16 vertical canvas, a remake of the same length as the reference capped by the selected live model card, an opening frame plus any beats the user marks, and a narration voice matched to short social content. After the rewrite, default to checking that the remake's first 3 seconds carry the hook — the reason to keep watching — rather than restating the reference's opening credits or a self-introduction. Fix that in the still-free shot list before any generation confirmation. Name each default in the confirmation instead of asking about it.

Two facts shape every decision. **The clip must fit the selected live model card's supported duration**, and only the opening frame is animated into it — the other marked beats are delivered as stills for the user's own edit. Both are stated at the confirmation, not discovered after paying.

That live-card ceiling is a hard bound on the narration, not on the video alone. The clip has to be at least as long as the spoken track, so budget the whole script to read aloud inside the selected model's supported duration while it is still free text. Count it at roughly four to five Chinese characters or two to three English words per second, and cut the spoken fields until they fit before the shot list is shown for approval.

Claims split by source. Structure, pacing, and craft are yours to read off the reference. Specifications, prices, results, certifications, and promotions for the user's own subject come from the user. When those are missing, write around them; never produce a plausible figure, because the user is the one who answers for it.

## Golden path

Stages 1 to 5 cost nothing. The one paid call that can precede them is the optional reference lookup, and it happens only when the user asks for it and confirms its own price. Nothing else is charged before the user has seen the shot list and approved it.

**Before stage 1, only when the user brings a link and asks for it to be read:** look up the post, and — when the teardown needs them — its comments or its YouTube transcript, per [reading the reference from a link](references/reference-lookup.md). Skip it whenever the user already brought a file, screenshots, or a transcript; the teardown is just as real from those.

1. **Read the reference.** Segment it into a hook, the body beats, and the call to action, with second-level in and out points. Name the script pattern it follows and record what actually carried it — the structural move, the content substance, and the presentation craft, kept apart. Score the six dimensions in [reading the reference](references/teardown.md).
2. **Rewrite it onto the user's subject.** Keep the beat count, the beat functions, and the timing shape; replace every piece of content. Write each beat as two separate fields — what is on screen, and what is said — because a merged field cannot be shot. Budget the spoken fields against the selected live model card's duration ceiling and cut them until they fit. Screen the copy as described in [rewriting onto your subject](references/remake-plan.md).
3. Read the live `text_to_image`, `text_to_speech`, and `image_to_video` cards with `beatra.models.list`, and select a voice with `beatra.voices.list`. The video card's supported durations bound the shot list, so read it before the shot list is signed off.
4. **Show the teardown and the shot list, and get the shot list approved.** This is the artifact the rest of the run is built from, it is free to revise, and it is approved against the duration limits just read. The spoken script has to fit the card's longest supported duration before this approval, because nothing later can make an over-long narration fit.
5. **Confirm preparation.** Show which beats become frames, the 9:16 canvas and what changing it later would cost, the selected ready voice from `beatra.voices.list`, the current estimate, and a stable request ID for every planned paid call.
6. Generate the beat frames with `beatra.images.generate`, one call per frame. Synthesize the narration with `beatra.speech.synthesize`, then read the actual returned duration, size, and MIME type.
7. **Show the real materials.** Display the frames and play the narration whenever the host can access them, and report the true duration. Distinguish returned task facts from media the host could not inspect.
8. **Show the video admission card.** Compute `duration` as the smallest whole second at or above the real narration length. That value must be supported by the selected live model card. If the narration is longer than the card's maximum, stop and say so — shorten the spoken fields and synthesize again, which is the cheapest call in the run. Never lower the duration to reach the ceiling; that cuts off the closing words of a clip the user paid for. Once the value is admissible, show route `image_to_video`, tool `beatra.videos.animate`, approved opening frame, narration, audio-led duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved frames or narration do not authorize the video. Do not create a video `client_request_id` or submit until the user confirms they have topped up or already have enough credits for this estimate. Then call `beatra.videos.animate` once with the approved opening frame, the narration, an explicitly selected model, and that duration.
9. Poll that task with `beatra.tasks.get` until terminal, deliver the clip, and review what you can actually see.

Select the video model explicitly rather than leaving it to `auto`: only some models on this capability accept supplied narration, and one that does not will discard it.

The canvas is decided by the opening frame, so choosing it late means producing every paid artifact again.

## Decisions that require confirmation

Confirm before spending: any reference lookup on its own, before anything else, whenever one is run at all; then the frame set and the narration together with every one of their priced calls; then the final video. The video confirmation comes after the user has seen the accessible frames and heard the narration, because that call costs the most.

Also confirm, rather than deciding alone: a canvas other than 9:16, a beat count that departs from the reference, a claim about the user's subject that they have not verified, and any change after an artifact is approved. Each changed argument is new paid work with a new request identifier and fresh approval.

When the user asks for the reference's own footage, music, or on-screen person to be reproduced rather than its structure, say what this route does produce — an original clip built on the same structure — and continue from there.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"language":"zh-CN"}' | python3 scripts/mcp_client.py call beatra.voices.list
printf '%s' '{"query":"video by url","platform":"tiktok","capability_family":"content"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the teardown, the approved shot list, every frame as a delivered still, the narration, and the returned video artifact. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A reference lookup is reported differently — the returned payload, its task ID, the terminal status, and `billing.net_charged_credits`, with no resolved model, dimensions, or duration to report — per [reading the reference from a link](references/reference-lookup.md). Report only facts the task actually returned.

When the host can view or play the returned media, check that each frame matches the beat it was written for, that the narration is present and finishes cleanly, and that the clip fits the canvas. State which media details could not be inspected instead of inferring them from task metadata.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry — except for a reference lookup, which has no capability to list by and is matched on its saved `operation_key`, arguments, and `schema_hash`. Redoing one frame reuses the other artifacts unchanged. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

## References by task

- Reading a reference from a link, what each lookup costs, and how its results are attributed: [reading the reference from a link](references/reference-lookup.md)
- Segmenting the reference, naming the script pattern, attributing performance, and scoring the six dimensions: [reading the reference](references/teardown.md)
- Carrying the structure onto a new subject, writing paired visual and spoken fields, and screening the copy: [rewriting onto your subject](references/remake-plan.md)
- Exact payloads, what each confirmation freezes, polling, redoing one stage, recovery, and cancellation: [remake workflow](references/workflow.md)
- First install or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Non-billable package registration: [installation registration](references/installation-registration.md)
- Task polling, artifacts, and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- When the bundled client cannot connect: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Update guarantees and controls: [automatic updates and safety](references/automatic-updates-and-safety.md)
- Removing the package or shared credentials: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours per installation. When a higher version is available it installs automatically without separate confirmation. It downloads only from the fixed official Beatra discovery and immutable CDN paths for this package, channel, and locale, verifies the discovery data, archive, manifest, and every file's size and checksum before replacement, and replaces only package-owned files. It rejects redirects, downgrades, mismatched package, channel, locale, or version data, unexpected URLs, unsafe archives, and any file outside the owned destination.

Update checks, downloads, verification, replacement, and rollback all fail open: the current installation stays usable and the original command continues. An update failure never authorizes retrying a paid generation. The choice persists across later commands for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files. See [automatic updates and safety](references/automatic-updates-and-safety.md).
