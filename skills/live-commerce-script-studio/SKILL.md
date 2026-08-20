---
name: "live-commerce-script-studio"
description: "Turn a product lineup into a live shopping script your host can actually read on air. This live commerce script studio builds the run of show for the whole session as a minute-by-minute live selling schedule, writes a seven-step product demo talk track for every featured product, fills a library of ready-to-read lines for opening, holding, interacting, urgency, and closing, and runs a compliance pass over the wording — then renders the talking-point card and countdown card your host and floor manager work from, plus spoken takes of the lines that have to land on delivery. Reuse it as a live commerce script template session after session. Use it for livestream selling on Douyin, WeChat Channels, Taobao, Kuaishou, and Xiaohongshu, for brand-owned streams, creator collaborations, new-product sessions, clearance runs, and for getting a first-time live host through a session without freezing."
---

# Live Commerce Script Studio

Turn a product lineup into a run of show a host can read on air — the schedule, the per-product talk track, the ready-to-read lines, the compliance pass, and the cards and spoken takes that make it usable in the room.

## Scope and adjacent routes

The route is: a session plan, a talk track per product, a line library, a compliance pass, and the artifacts the room actually uses. It fits when someone is going live to sell and needs words in front of them.

When the job is elsewhere, another workflow fits better. Room decoration built from product photography — backdrops, overlays, promo covers — belongs in a live-commerce visual workflow. A short recorded video rather than a live session belongs in a seeding-video or product-video workflow. Narration for an edited clip belongs in a voiceover workflow.

## Inputs and defaults

Two hard inputs: the category or theme of the session, and at least one featured product with its regular price and live price.

Both prices are needed because the offer is framed as the gap between them. Stock is needed only where a figure is actually rendered or spoken: a stock-type urgency line, a held slot's fixed release quantity, or a take that states a quantity. The countdown card carries a blank slot the floor manager fills, so it needs none. Ask for all three together, once, rather than one at a time, and proceed on the two prices when stock is not yet known.

Reuse whatever the conversation already states about the platform, the session goal, the length, and who is on air. When those are absent, default to a four-hour session, a host plus a floor manager, a creator-led selling format, and the goal implied by the lineup. Name each default in the confirmation instead of asking about it.

Everything the session claims about the products comes from the merchant. Prices, stock, specifications, ingredients, certifications, awards, comparison figures, and promotional terms are theirs to supply. When one is missing, write the beat around it; never produce a plausible figure, because they are the one who answers for it on air.

## Golden path

Stages 1 to 5 cost nothing. No paid call happens before the four written pieces are approved.

1. **Set the session frame.** Platform, goal, length, on-air roles, and the lineup order per [planning the session](references/session-plan.md).
2. **Build the minute-by-minute schedule.** The whole session across its three phases, with each product's slot placed on the six-stage selling chain.
3. **Write a talk track for every featured product.** Seven steps, in order, per [writing the talk track](references/talk-track.md).
4. **Write the line library.** Twelve categories of lines the host can read as written, per [writing the talk track](references/talk-track.md).
5. **Run the compliance pass and show all four pieces for approval.** Every line is screened before anything is produced, because a line that fails on air costs more than a line rewritten here.
6. Read the live `text_to_image` and `text_to_speech` cards with `beatra.models.list`, and select a voice with `beatra.voices.list`.
7. **Confirm production.** Show which cards will be rendered, which lines get spoken takes, the selected ready voice, the current estimate, and a stable request ID for every planned paid call.
8. Render the cards with `beatra.images.generate`, one call per card, and synthesize the spoken takes with `beatra.speech.synthesize`. Read the actual returned duration, size, and MIME type for each take.
9. Poll each task with `beatra.tasks.get` until terminal, deliver everything together, and review what you can actually see.

## Decisions that require confirmation

Confirm before spending once: the card set and the spoken takes together, each with its price and request ID. There is no second gate, because nothing here depends on an earlier paid artifact.

Also confirm, rather than deciding alone: a session longer than six hours, a lineup past eight featured products, a price or stock figure the merchant has not verified, and any change after a card or take is approved. Each changed argument is new paid work with a new request identifier and fresh approval.

When a requested line cannot pass the compliance screen as written, offer the closest wording that does and continue from there.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"language":"zh-CN"}' | python3 scripts/mcp_client.py call beatra.voices.list
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the schedule, the talk tracks, the line library, the compliance pass, the rendered cards with their returned dimensions, the spoken takes with their real durations, each task ID, the returned artifact links, the resolved model, and `billing.net_charged_credits`. Report only facts the task actually returned.

When the host can view or play the returned media, check that each card's figures match the approved schedule and that each take is audible and finishes cleanly. Card text is generated artwork, so read the numbers back against the source and say plainly when a figure did not render correctly or legibly — a crisply rendered wrong digit is the dangerous case, and a wrong price on a card in the room is worse than no card.

State which media details could not be inspected instead of inferring them from task metadata.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry. Redoing one card reuses the other artifacts unchanged. `insufficient_balance` means nothing was charged and the identical request can be resubmitted after a top-up.

## References by task

- Session frame, the three phases, the six-stage chain, lineup order, and the minute-by-minute schedule: [planning the session](references/session-plan.md)
- The seven-step product talk track, the twelve line categories, urgency types, and the compliance screen: [writing the talk track](references/talk-track.md)
- Exact payloads, what the confirmation freezes, polling, redoing one card, recovery, and cancellation: [live session workflow](references/workflow.md)
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
