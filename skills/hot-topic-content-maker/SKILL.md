---
name: "hot-topic-content-maker"
description: "Turn a trending topic into a post you can publish today. Bring the hot topic, moment, or seasonal peg — or have it read the public trending boards on Douyin, TikTok, and X, or name a topic and have it search what people are actually posting about it on Xiaohongshu and Douyin, and pick the ones worth a look. This trending content workflow finds the angles that genuinely connect the topic to your brand or account, judges which one is worth your name on it, then builds the chosen angle into a finished post: cover wording and a rendered cover image, the caption, the hashtags, a beat-by-beat plan for a short cut, and the narrated vertical clip itself. Use it for trendjacking, newsjacking, trend-riding, trend discovery, seasonal and holiday campaigns, festival and shopping-event content, moment marketing, and getting a same-day social post or short video out of a topic while it is still moving. The finished post fits Douyin, Xiaohongshu, WeChat Channels, TikTok, Reels, and Shorts."
---

# Hot Topic Content Maker

A topic is only worth anything while it is still moving. This route goes from the topic to a publishable post in one pass: angles, a pick, a cover, a caption, and hashtags — plus a short clip when you want one.

## Scope and adjacent routes

The route is: a topic, a set of angles, one chosen angle, and a finished post. It fits when someone has a trending topic, a moment, or a calendar peg and needs something out fast.

When there is no topic in hand, another workflow fits better. An evergreen product recommendation belongs in a seeding-video workflow. A reference clip to rebuild belongs in a teardown-and-remake workflow. A cover for an existing post belongs in a cover workflow.

## Inputs and defaults

Two hard inputs: the topic, and the account it is being posted from.

The topic comes from the user — one they name, a list they paste, a screenshot of a trending board, or a calendar date that matters to them. Any of those is enough, and none of them costs anything.

When the user instead wants to see what is moving right now, or wants the topic they named checked against what people are actually posting, this package can read the public trend boards on Douyin, TikTok, and X, and search what people are posting about a topic the user names on Douyin, TikTok, X, and Xiaohongshu. There is no Xiaohongshu board to browse — a Xiaohongshu lookup needs a topic first. Every lookup is paid, optional, and confirmed on its own before anything else happens, per [looking up what is trending](references/trend-lookup.md). There is no trend board at all for Instagram, YouTube, or WeChat Channels; a post headed there still takes its topic from the user or from one of the platforms above, said plainly. Without a lookup, work from what the user brought rather than describing a trend you have not seen.

The account is the industry, brand, or persona posting. Without it, angles have nothing to connect to and the output is generic trend commentary.

Reuse whatever the conversation already states about the platform, the audience, and the campaign goal. Default to a 9:16 vertical canvas, three angles offered, one post produced, and a cover-only run — a cover, a caption, and hashtags are a complete publishable post. Offer the clip once when the angle is picked; when it is wanted, default to 12 seconds with a narration voice matched to short social content. **The finished clip must fit the selected live model card's supported duration**, and only the opening frame is animated into it while the other beat frames are delivered as stills. Name each default in the confirmation instead of asking about it.

Speed is the constraint that shapes everything here. Offer the angles in the first reply, not after a round of questions.

## Golden path

Stages 1 to 3 cost nothing. The one paid call that can precede them is the optional trend lookup, and it happens only when the user asks for it and confirms its own price. Nothing else is charged before the user has picked an angle and approved the plan.

**Before stage 1, only when the user asks for it:** read a trend board or search recent posts about the topic, per [looking up what is trending](references/trend-lookup.md). Skip it whenever the user brought the topic — that is the ordinary shape of this route, and the angles are just as good.

1. **Read the topic and find the angles.** Produce three angles that connect the topic to the account, each with the connection stated plainly, per [finding the angle](references/angle-finding.md). Mark any angle that carries risk, and say what the risk is.
2. **The user picks one.** Or asks for different ones — that is free.
3. **Build the post plan and get it approved.** Cover wording, caption, and hashtags — plus, when a clip is included, its beats with on-screen and spoken fields kept apart, per [building the post](references/post-plan.md).
4. Read the live `text_to_image` card with `beatra.models.list` — and, only when a clip is included, the `text_to_speech` and `image_to_video` cards plus a voice from `beatra.voices.list`.
5. **Confirm production.** Show the cover, whether the clip is included, the 9:16 canvas and what changing it later would cost, the selected ready voice when a clip is included, the current estimate, and a stable request ID for every planned paid call.
6. Render the cover with `beatra.images.generate`. When the clip is included, generate its beat frames the same way and synthesize the narration with `beatra.speech.synthesize`, then read the actual returned duration, size, and MIME type.
7. **Show the real materials** whenever the host can access them, and report the true duration.
8. **Show the video admission card** when a clip was included. Show route `image_to_video`, tool `beatra.videos.animate`, approved opening frame, narration, audio-led duration (smallest supported whole second at or above the real narration length), resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved cover, frames, or narration do not authorize the video. Do not create a video `client_request_id` or submit until the user confirms they have topped up or already have enough credits for this estimate. Then call `beatra.videos.animate` once with the approved opening frame, the narration, an explicitly selected model, and that audio-led duration.
9. Poll each task with `beatra.tasks.get` until terminal, deliver everything together, and review what you can actually see.

A cover-only run skips step 8 and the clip work inside steps 4 to 7, and has one approval gate; it still polls and delivers at step 9. Say which shape is running when the estimate is shown.

Select the video model explicitly rather than leaving it to `auto`: only some models on this capability accept supplied narration, and one that does not will discard it.

## Decisions that require confirmation

Confirm before spending: the trend lookup on its own, before anything else, whenever one is run at all; then the cover and any frames and narration together; then the video separately when a clip was included.

Also confirm, rather than deciding alone: an angle the user has not picked, a canvas other than 9:16, a claim about the topic's facts that the user has not supplied, and any change after an artifact is approved. Each changed argument is new paid work with a new request identifier and fresh approval.

When an angle would attach the account to a topic where that association is the user's call — a live controversy, a loss, an unresolved public event, someone else's misfortune — surface it as a choice with the reason stated, offer the angles that do not carry it, and proceed with whichever the user picks. This is a judgment they own, not a gate.

What the topic actually is comes from the user, or from a lookup this package ran and attributed. Dates, figures, names, outcomes, and quotes are the user's to supply; a board position, a post count, or a recent post belongs to the lookup and carries the time it was read. The topic's own state — momentum, whether it is peaking or fading, how long it has left — stays inference either way: give the evidence behind it instead of asserting it. Write the post around a missing detail rather than producing a plausible one about a real event.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"query":"hot search","platform":"douyin","capability_family":"trends"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the angles considered, the chosen one and why, the cover with its wording, the caption, the hashtags, and — when a clip was included — the clip plan, every beat frame as a delivered still, and the finished clip. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A trend lookup is reported differently — payload, task ID, terminal status, and `billing.net_charged_credits`, with no model, dimensions, or duration to report — per [looking up what is trending](references/trend-lookup.md). Report only facts the task actually returned.

Cover wording is generated artwork. Read the rendered text back against the approved wording and say plainly when it did not render legibly, rather than describing an uninspected cover as correct. State which media details could not be inspected.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry — except for a trend lookup, which has no capability to list by and is matched on its saved `operation_key`, arguments, and `schema_hash`. Redoing the cover reuses the clip artifacts unchanged. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

## References by task

- Turning a topic into angles, judging fit, and the risk read: [finding the angle](references/angle-finding.md)
- Reading a trend board, searching recent posts, what each lookup costs, and how its results are attributed: [looking up what is trending](references/trend-lookup.md)
- Cover wording, caption, hashtags, and the clip's beats: [building the post](references/post-plan.md)
- Exact payloads, what each confirmation freezes, polling, redoing one stage, recovery, and cancellation: [hot topic workflow](references/workflow.md)
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
