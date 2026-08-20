---
name: "douyin-data-brief"
description: "Turn a Douyin link or a keyword into a one-page Douyin brief. Give a public post URL, a search term, or the caption, counts, and comments you already copied, and get play, like, comment, the hook, a verbatim audience line, and a follow-or-not. This Douyin data and Douyin analytics workflow reads a Douyin post, its comments, the creator, or the hot-search board, or works from what you paste, then writes an attributed same-day brief. Use it for Douyin data, Douyin analytics, Douyin brief, and Douyin post data when you need a clear read of what a clip or keyword is doing."
---

# Douyin Data Brief

The job is a one-page attributed brief: play, like, and comment if looked up, the hook, a verbatim comment, and a follow-or-not. A run that never looks anything up is a complete run — a pasted caption, counts, and comments are enough.

## Scope and adjacent routes

The route is: a Douyin link or a keyword, optional public reads, one attributed page. It fits when someone needs what a clip or a keyword is doing, not a post to publish today.

A today's publishable post belongs in a hot-topic workflow. A full account diagnosis belongs in an account-teardown workflow.

## Inputs and defaults

One hard input: the Douyin source. That is a public Douyin post link, a keyword, or the caption, counts, and comments the user already copied. Any of those is enough.

Reuse the conversation's product, category, and what the brief is for. Default to one post, one page of top-level comments if a lookup runs, and a brief with four blocks: the counts, the hook, a verbatim comment, and follow-or-not. Name those defaults instead of asking.

When the user wants a public Douyin post, comments, creator, keyword search, or the hot-search board read, this package can look them up. Every lookup is paid, optional, and confirmed on its own before it runs, per [looking up Douyin](references/douyin-lookup.md). If the platform has no operation in the whitelist, it has no lookup — work from what the user pasted. Without a lookup, write the brief from the pasted material rather than inventing play, like, or comment counts.

## Golden path

The brief can be written at no cost from material the user brought. The only paid call is an optional lookup, and it happens only when the user asks for it and confirms its own price.

**Before the brief, only when the user asks for it:** read one Douyin post and one page of its comments, or search one page of Douyin videos for a keyword and then read one post the user picks, per [looking up Douyin](references/douyin-lookup.md). Skip the lookup whenever the user already pasted the caption, counts, and comments.

1. **Collect the evidence.** From the lookup payload or from what the user pasted. Keep each figure attributed — looked up with its read time, or supplied.
2. **Read the clip** for the hook, the counts, and one verbatim comment, per [writing the brief](references/brief.md).
3. **Write the brief:** a one-page attributed read with play, like, and comment if present, the hook, a verbatim comment, and a follow-or-not. Offer one revision of the wording at no cost.
4. Deliver the brief. For a lookup, also deliver the task ID, terminal status, and `billing.net_charged_credits`. A lookup has no model, dimensions, or duration to report.

## Decisions that require confirmation

Confirm every lookup on its own, before it runs, without exception. Show what will be read, the operation it maps to, the credit price `beatra.social.tools.get` just returned, and how many lookups the plan contains, counting each page as one. Stopping here still leaves a usable brief from anything the user already pasted.

Also confirm, rather than deciding alone: a second page of comments or search results, a 60-credit Douyin video search, a creator read after a post read, the hot-search board, and any change after a lookup has already run. Each changed argument is new paid work with a new request identifier and fresh approval.

A figure that was looked up is labelled as looked up, with the date it was read. A figure the user supplied stays marked as supplied. A missing count is stated as missing. Never estimate, interpolate, or carry in typical play or like counts. Why a clip performed well remains inference — mark it as inference and give the evidence.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"query":"video","platform":"douyin","capability_family":"content"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the one-page brief, the play, like, and comment figures, the hook, the verbatim comment, and the follow-or-not. For a lookup, deliver the returned payload, `task_id`, terminal status, and `billing.net_charged_credits`. Do not look for a resolved model or a generated media file. Report only facts the task actually returned.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the match with `beatra.tasks.get`, then replay byte-identical arguments under the same `client_request_id`. Writing only the replay half authorizes a duplicate charge.

On a failed lookup, keep `error.code` and read the platform wording in `error.message`. Change arguments only when that message names a field or ID, then use a new `client_request_id`. Otherwise keep the same ID and the same payload. Do not suggest changing a model.

## References by task

- Reading a Douyin post, its comments, a creator, a keyword search, or the hot-search board, what each lookup costs, and how figures are attributed: [looking up Douyin](references/douyin-lookup.md)
- Writing the attributed brief: [writing the brief](references/brief.md)
- Exact payloads, confirmation, paging, and recovery: [Douyin brief workflow](references/workflow.md)
- First install or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Non-billable package registration: [installation registration](references/installation-registration.md)
- Task polling, artifacts, and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- When the bundled client cannot connect: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Update guarantees and controls: [automatic updates and safety](references/automatic-updates-and-safety.md)
- Removing the package or shared credentials: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours per installation. When a higher version is available it installs automatically without separate confirmation. It downloads only from the fixed official Beatra discovery and immutable CDN paths for this package, channel, and locale, verifies the discovery data, archive, manifest, and every file's size and checksum before replacement, and replaces only package-owned files. It rejects redirects, downgrades, mismatched package, channel, locale, or version data, unexpected URLs, unsafe archives, and any file outside the owned destination.

Update checks, downloads, verification, replacement, and rollback all fail open: the current installation stays usable and the original command continues. An update failure never authorizes retrying a paid lookup. The choice persists across later commands for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files. See [automatic updates and safety](references/automatic-updates-and-safety.md).
