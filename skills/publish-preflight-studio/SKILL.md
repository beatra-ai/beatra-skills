---
name: "publish-preflight-studio"
description: "Check a post before it goes out, then fix what it finds. Paste the caption, title, script, on-screen text, or tags — this pre-publish content check reads the wording against advertising-copy restrictions and regulated-category claim rules and returns a replacement for every phrase it flags, reads the post back through the people you are writing for and names the exact line that loses each of them, scores the hook and the reason to share with the evidence behind each score, then hands back the corrected copy and renders the cover carrying the fixed wording. Use it as a social media copy check and a banned words checker before publishing, for ad-copy review, superlative screening, audience reaction testing, hook strength scoring, and pre-checking brand or client copy before it reaches an approver, for Instagram, TikTok, Facebook, YouTube, and LinkedIn."
---

# Publish Preflight Studio

Read a post the way a reviewer will, the way its audience will, and the way the feed will — then fix what those three reads turn up and rebuild the cover.

## Scope and adjacent routes

The route is: copy in, three reads, corrected copy out, and a cover rendered from the corrected wording. It fits when something is written and about to be published.

When the starting point is different, another workflow fits better. An existing cover image to diagnose and improve belongs in a cover-performance workflow. Copy that has not been written yet belongs in the workflow for that format — a seeding video, a note, an article. A finished script that needs a voice belongs in a voiceover workflow.

## Inputs and defaults

The one hard input is the copy: a caption, a title, a script, on-screen text, a tag set, or all of them together. Ask for it if it is missing; ask for nothing else up front.

Reuse whatever the conversation already states about the platform, the category, the audience, and whether this is organic or paid. Category matters more than the rest — the claim rules that apply to a supplement post are not the ones that apply to a restaurant post — so when it is not stated, read it from the copy and name what you read rather than asking.

Default to all three reads, five reader profiles built from the copy's evident audience, and a cover rendered only when the copy carries cover wording and the user wants it. Name each default with the result instead of asking about it.

Run the compliance read first and return it fast. It is the one with a deadline attached, and it is often all the user came for.

## Golden path

Stages 1 to 4 cost nothing. The only paid work here is rendering a cover.

1. **Compliance read.** Screen every line against the restrictions in [screening the copy](references/compliance-screen.md). For each flagged phrase, give the phrase, why it is flagged, and a replacement that keeps the selling intent. A flag without a replacement is half a finding.
2. **Audience read.** Build reader profiles from the copy's evident audience and read the post back through each, per [reading it as the audience](references/audience-read.md). Name the exact line that loses each profile, not a general impression.
3. **Reach read.** Score the hook, the reason to keep reading, and the reason to share, each with the line or structural feature that justifies the score.
4. **Deliver the corrected copy.** One clean version incorporating every accepted replacement, ready to paste — plus the list of what changed and why, so the user can reject any of it.
5. When a cover is wanted, choose the route: a fresh render, or — when the user has the existing cover — upload it and re-render from it so the approved layout survives. Read the matching live card with `beatra.models.list`, then **confirm production**: the exact corrected cover wording, the route, the canvas, and the current estimate.
6. Render it with the tool that matches the route — `beatra.images.generate` for a fresh cover, `beatra.images.edit` when re-rendering from the uploaded one — poll with `beatra.tasks.get` until terminal, and read the rendered wording back against what was approved.

A run that stops after step 4 costs nothing and is a complete, useful result. Say so rather than steering toward the paid step.

## Decisions that require confirmation

Confirm before the cover render: the exact wording it will carry, the route, the canvas, and the price. That is the only paid boundary here.

Also confirm, rather than deciding alone: any change after the wording is approved. A replacement that changes the substance of a claim is not a separate gate — it is marked as such in the change list, which the user rejects line by line.

The compliance read reports what the wording exposes; whether to publish is the user's call. When a flagged line is one they want to keep, say what it exposes them to, offer the closest wording that does not, and proceed with whichever they choose.

Reader profiles are constructed from the copy and any audience detail the user supplied. They are a structured read, not measured research — say that once, plainly, when the audience read is delivered.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
python3 scripts/mcp_client.py upload ./current-cover.jpg --mime-type image/jpeg
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the three reads, the corrected copy as one pasteable block, the change list, and — when rendered — the cover with its wording, the task ID, the returned artifact link, the resolved model, the returned dimensions, and `billing.net_charged_credits`.

Cover wording is generated artwork. Read the rendered text back against the approved wording character by character and say plainly when it did not render legibly, rather than describing an uninspected cover as correct. State which media details could not be inspected.

## Recovery

Record the task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry. `insufficient_balance` means nothing was charged and the identical request can be resubmitted after a top-up.

## References by task

- Restricted phrasing, regulated-category claim rules, price and comparison requirements, and how to write a replacement: [screening the copy](references/compliance-screen.md)
- Building reader profiles, running the read, locating the losing line, and scoring reach: [reading it as the audience](references/audience-read.md)
- Exact payloads, what the confirmation freezes, polling, recovery, and cancellation: [preflight workflow](references/workflow.md)
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
