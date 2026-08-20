---
name: "xiaohongshu-note-research"
description: "Turn a category, a note link, or notes you already copied into a research memo. This note analysis and Xiaohongshu research workflow reads public notes, comments, and a creator's recent notes on Xiaohongshu, or works from the titles, bodies, and comments you paste, then lays out title patterns, structure, verbatim comments, and followable angles. Use it for note analysis, Xiaohongshu research, note research, and competitor notes when you want the patterns a category is already using."
---

# Xiaohongshu Note Research

The job is a research memo: title patterns, structure, verbatim comments, and followable angles. A run that never looks anything up is a complete run — pasted notes are enough.

## Scope and adjacent routes

The route is: a category or a note, optional public reads, a research memo. It fits when someone needs how a category is already written, not a finished production pack.

A Xiaohongshu production pack belongs in a zhongcao workflow. A full account diagnosis belongs in an account-teardown workflow. One optional copy draft from this memo is still research-shaped: it shows an angle, it is not a publish-ready note set.

## Inputs and defaults

One hard input: the notes' source. That is a category, a public note link, or notes the user already copied. Any of those is enough.

Reuse the conversation's category, product, and what the research is for. Default to one search page or one note, one page of top-level comments if a lookup runs, and a memo with four blocks: title patterns, structure, verbatim comments, and followable angles. Name those defaults instead of asking.

When the user wants notes read from a public link or a category search, this package can look them up on Xiaohongshu. Every lookup is paid, optional, and confirmed on its own before it runs, per [looking up notes](references/note-lookup.md). If the platform has no operation in the whitelist, it has no lookup — work from what the user pasted. Without a lookup, write the memo from the pasted notes rather than inventing titles or comments.

## Golden path

The memo can be written at no cost from notes the user brought. The only paid call is an optional lookup, and it happens only when the user asks for it and confirms its own price.

**Before the memo, only when the user asks for it:** search one page of notes in a named category, or read one public note and one page of its comments, per [looking up notes](references/note-lookup.md). Skip the lookup whenever the user already pasted notes.

1. **Collect the notes.** From the lookup payload or from what the user pasted. Keep each title and comment attributed — looked up with its read time, or supplied.
2. **Read the patterns** in titles, structure, and comments, per [writing the research memo](references/research-memo.md).
3. **Write the memo:** title patterns, structure, verbatim comments, and followable angles. An optional one copy draft stays research-shaped. Offer one revision of the wording at no cost.
4. Deliver the memo. For a lookup, also deliver the task ID, terminal status, and `billing.net_charged_credits`. A lookup has no model, dimensions, or duration to report.

## Decisions that require confirmation

Confirm every lookup on its own, before it runs, without exception. Show what will be read, the operation it maps to, the credit price `beatra.social.tools.get` just returned, and how many lookups the plan contains, counting each page as one. Stopping here still leaves a usable memo from anything the user already pasted.

Also confirm, rather than deciding alone: a second page of notes or comments, a 60-credit Xiaohongshu search, image-note read, video-note read, comments page, or user-notes page, and any change after a lookup has already run. Each changed argument is new paid work with a new request identifier and fresh approval.

A figure that was looked up is labelled as looked up, with the date it was read. A figure the user supplied stays marked as supplied. A missing count is stated as missing. Never estimate, interpolate, or carry in typical like or save counts. Why a note performed well remains inference — mark it as inference and give the evidence.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"query":"notes","platform":"xiaohongshu","capability_family":"content"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the title patterns, the structure read, the verbatim comments, the followable angles, and any optional copy draft. For a lookup, deliver the returned payload, `task_id`, terminal status, and `billing.net_charged_credits`. Do not look for a resolved model or a generated media file. Report only facts the task actually returned.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the match with `beatra.tasks.get`, then replay byte-identical arguments under the same `client_request_id`. Writing only the replay half authorizes a duplicate charge.

On a failed lookup, keep `error.code` and read the platform wording in `error.message`. Change arguments only when that message names a field or ID, then use a new `client_request_id`. Otherwise keep the same ID and the same payload. Do not suggest changing a model.

## References by task

- Reading a note, its comments, a category search, or a creator's notes, what each lookup costs, and how figures are attributed: [looking up notes](references/note-lookup.md)
- Writing title patterns, structure, comments, and angles: [writing the research memo](references/research-memo.md)
- Exact payloads, confirmation, paging, and recovery: [note research workflow](references/workflow.md)
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
