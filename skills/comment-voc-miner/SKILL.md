---
name: "comment-voc-miner"
description: "Turn public comments into a usable brief. Give a post link, a category to search, or comments you already copied, and get the objections, verbatim lines, purchase worries, FAQ answers, live-commerce replies, and spoken hooks that come from what viewers actually wrote. This comment analysis workflow reads public comments on Douyin, TikTok, Xiaohongshu, Instagram, YouTube, and X, and reply threads on Douyin, TikTok, Xiaohongshu, Instagram, and YouTube, or works from comments you paste, then groups the real audience language into a same-day brief. Use it for comment analysis, comment-section analysis, comment mining, VOC insight, audience insight, user voice research, FAQ writing, and live-commerce answers that sound like the audience."
---

# Comment VOC Miner

The job is a brief written in the audience's own words: objections, verbatim lines, purchase worries, FAQ answers, live-commerce replies, and spoken hooks. A run that never looks anything up is a complete run — pasted comments are enough.

## Scope and adjacent routes

The route is: a post or a category, one page of comments, a grouped brief. It fits when someone needs the language viewers already used, not a new script from scratch.

A full account diagnosis belongs in an account-teardown workflow. Rebuilding one viral clip belongs in a teardown-and-remake workflow. A whole live-commerce show script belongs in a live-script workflow.

## Inputs and defaults

The hard input is a work link or the comment text itself. Do not start from a huge blind post set or scan a whole site. A named category search is allowed only when the user already pointed at one category, not as a substitute for a missing work.

Reuse the conversation's platform, product, and what the brief is for. Default to one page of top-level comments, no reply thread, and a brief with four blocks: objections, verbatim lines, FAQ answers, spoken hooks. Name those defaults instead of asking.

When the user wants comments read from a public post or a search, this package can look them up on Douyin, TikTok, Xiaohongshu, Instagram, YouTube, and X. Every lookup is paid, optional, and confirmed on its own before it runs, per [looking up comments](references/comment-lookup.md). If the platform has no comment operation in the whitelist, it has no lookup — work from what the user pasted. Without a lookup, write the brief from the pasted comments rather than inventing audience language.

## Golden path

The brief can be written at no cost from comments the user brought. The only paid call is an optional lookup, and it happens only when the user asks for it and confirms its own price.

**Before the brief, only when the user asks for it:** read one public post and one page of its comments, or search one page of posts in a named category and then read comments on one of them, per [looking up comments](references/comment-lookup.md). Skip the lookup whenever the user already pasted comments.

1. **Bound the works.** Collect comments from the named post, the named category page, or what the user pasted. Keep each line attributed — looked up with its read time, or supplied.
2. **Group them** into objections, FAQs, verbatim lines, and pain points, per [writing the brief](references/brief.md). Every line in the brief must point back to a source comment.
3. **Write the brief:** a short read of what the audience is actually saying, a list of verbatim lines, FAQ answers in their wording, live-commerce replies, and spoken hooks. Hooks come from those quotes, not from invented inspiration. Offer one revision of the wording at no cost.
4. Deliver the brief. For a lookup, also deliver the task ID, terminal status, and `billing.net_charged_credits`. A lookup has no model, dimensions, or duration to report.

## Decisions that require confirmation

Confirm every lookup on its own, before it runs, without exception. Show what will be read, the operation it maps to, the credit price `beatra.social.tools.get` just returned, and how many lookups the plan contains, counting each page as one. Stopping here still leaves a usable brief from anything the user already pasted.

Also confirm, rather than deciding alone: a second page of comments, a reply thread, a 60-credit Douyin or Xiaohongshu search, and any change after a lookup has already run. Each changed argument is new paid work with a new request identifier and fresh approval.

A figure that was looked up is labelled as looked up, with the date it was read. A figure the user supplied stays marked as supplied. A missing count is stated as missing. Never estimate, interpolate, or carry in typical comment counts. Why a line performed well remains inference — mark it as inference and give the evidence.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"query":"comments","platform":"douyin","capability_family":"comments"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the grouped brief, the verbatim lines, the FAQ answers, the live-commerce replies, and the spoken hooks. For a lookup, deliver the returned payload, `task_id`, terminal status, and `billing.net_charged_credits`. Do not look for a resolved model or a generated media file. Report only facts the task actually returned.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the match with `beatra.tasks.get`, then replay byte-identical arguments under the same `client_request_id`. Writing only the replay half authorizes a duplicate charge.

On a failed lookup, keep `error.code` and read the platform wording in `error.message`. Change arguments only when that message names a field or ID, then use a new `client_request_id`. Otherwise keep the same ID and the same payload. Do not suggest changing a model.

## References by task

- Reading a post, its comments, or a category search, what each lookup costs, and how figures are attributed: [looking up comments](references/comment-lookup.md)
- Grouping lines and writing the brief: [writing the brief](references/brief.md)
- Exact payloads, confirmation, paging, and recovery: [comment brief workflow](references/workflow.md)
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
