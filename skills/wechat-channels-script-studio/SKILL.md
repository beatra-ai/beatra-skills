---
name: "wechat-channels-script-studio"
description: "Turn a product and its confirmed facts into a WeChat Channels short-video script you can film today. This WeChat Channels script writer lays the video out as a segment table second by second, writes the full spoken narration line by line, and places the product-link conversion beats against the exact segments where a viewer decides to tap through — then scores the draft across six dimensions so the weak part is visible before anyone shoots. Hand it a reference video that already sold and it carries that structure onto your own product. Storyboard frames and a voiced narration track are available on request, ready for your edit. Use it for WeChat Channels selling videos, spoken product recommendations, service explainers, private-domain traffic posts, store-link content, and creator accounts shipping a script a day."
---

# WeChat Channels Script Studio

Turn a product and the facts behind it into a WeChat Channels short-video script a person can film — the segment table, the narration in full, the product-link beats placed where they are earned, and a six-dimension score on the draft.

## Scope and adjacent routes

The route is: a fact sheet, a segment table, the full spoken narration, the product-link conversion beats placed against named segments, and a six-dimension self-check. The centre of gravity is the script. It fits when someone is selling on WeChat Channels and needs the words and the beat order before anything is filmed.

When the job is elsewhere, a sibling package fits better.

- Douyin rather than WeChat Channels — a different platform, a different distribution logic, and a different opening: `douyin-video-script-maker`.
- A finished vertical clip of a spoken recommendation, produced end to end rather than written: `oral-seeding-video-maker`.
- A real product photo that should become a product-display video: `wechat-channels-product-video`.
- A live selling session rather than a recorded post: `live-commerce-script-studio`.
- The cover image the post is judged by in the feed: `wechat-channels-cover-maker`.

## Inputs and defaults

One hard input: the product or service being sold, in one line. Ask for it if it is missing.

Ask once, together, for the four things that change the script — the confirmed facts the video may claim, who it is for, how the account already speaks, and any reference video whose structure should be reused. Then proceed on whatever came back. A product line alone is enough to draft; do not hold the work for the rest.

Reuse whatever the conversation already states about the account, the audience, the category, the offer, and the destination. When those are absent, choose from the product and name the choice in the delivery rather than asking.

Default to a 45-second target, the structure selected in [structuring the script](references/script-structure.md), a product link attached and its beats placed, spoken narration in the account's own register, and no rendered media unless asked for. Default to the opening segment carrying the hook rather than leading with a brand slogan. WeChat Channels distribution runs through the social graph, so the script is written to be worth passing on and not only worth finishing.

**Everything the script asserts about the product comes from the user.** Price, specification, ingredients, results, certifications, timeframes, offer terms, and stock are theirs to supply. When one is missing, write the beat around it and say plainly which parts were written around a gap — never produce a plausible-looking figure, because they are the one who answers for it. The same rule governs any claim about a reference video's real performance: describe its structure from what is actually visible, and treat view, sales, or conversion numbers as the user's to state.

## Golden path

Stages 1 to 6 cost nothing. No paid call happens before the script is approved.

1. **Build the fact sheet.** Separate what the user supplied from what the writing may frame freely, and list every gap by name per [structuring the script](references/script-structure.md).
2. **Choose the structure.** Take it from the reference video's segmentation when one was given, otherwise select one of the platform-native structures.
3. **Write the segment table.** Each row carries the segment, its in and out points in seconds, what is on screen, the spoken line, and the product-link beat when one falls there.
4. **Write the narration in full.** Verbatim, at speaking pace, in the account's register — the thing a person reads off a phone while filming.
5. **Place the product-link beats.** The three-beat conversion chain against specific segments, per [placing the product-link beats](references/product-link-beats.md).
6. **Score the draft and show everything for approval.** Six dimensions, the weakest one named, and a rewrite of anything under the floor before the user sees it.
7. When storyboard frames or a voiced narration are wanted, read the live `text_to_image` and `text_to_speech` cards with `beatra.models.list`, and select a voice with `beatra.voices.list`.
8. **Confirm production.** Show which segments become frames, which narration is voiced, the selected ready voice, the current estimate, and a stable request identifier for every planned paid call.
9. Render the frames with `beatra.images.generate`, one call per frame, and synthesize the narration with `beatra.speech.synthesize`. Read the actual returned duration, size, and MIME type.
10. Poll each task with `beatra.tasks.get` until terminal, deliver everything together, and review what you can actually see.

The script is the deliverable. Frames and narration audio are extras on top of it, so a run that stops at stage 6 is a complete run.

## Decisions that require confirmation

Confirm before spending once: the frame set and the voiced narration together, each with its price and request identifier. There is no second gate, because nothing here depends on an earlier paid artifact.

Also confirm, rather than deciding alone: a target past 90 seconds, a figure the user has not verified, a claim about a reference video's real performance, a register that departs from how the account already speaks, and any change after a frame or a take is approved. Each changed argument is new paid work with a new request identifier and fresh approval.

When a requested line cannot pass the claim screen as written — including a superlative, a regulated-category efficacy claim, a struck-through price the product never sold at, or a first-person account of using something the speaker did not use, each of them equally when the user supplied it themselves — offer the closest wording that the supplied facts support and continue from there.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"language":"zh-CN"}' | python3 scripts/mcp_client.py call beatra.voices.list
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the fact sheet with its gaps named, the segment table, the narration in full, the product-link beats against their segments, the six-dimension score, and — when they were produced — the frames with their returned dimensions, the narration audio with its real duration, each task ID, the returned artifact links, the resolved model, and `billing.net_charged_credits`. Report only facts the task actually returned.

When the host can view or play the returned media, check that each frame matches the segment it was written for and that the narration is audible and finishes cleanly. State which media details could not be inspected instead of inferring them from task metadata.

Say which parts of the script were written around a missing fact, and name the smallest input that would close each gap.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry. Redoing one frame reuses the other artifacts unchanged. `insufficient_balance` means nothing was charged and the identical request can be resubmitted after a top-up.

## References by task

- The fact sheet, the platform-native structures, segment timing, the narration rules, and the six-dimension self-check: [structuring the script](references/script-structure.md)
- Where the conversion chain lands, the three beat types, offer language, and the reference-video route: [placing the product-link beats](references/product-link-beats.md)
- Exact payloads, what the confirmation freezes, polling, redoing one frame, recovery, and cancellation: [script studio workflow](references/workflow.md)
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
