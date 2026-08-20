---
name: "youtube-caption-studio"
description: "Turn a YouTube link or a pasted transcript into a Chinese spoken script and a remake structure. This video captions and caption extract workflow reads YouTube captions and optional comments, or works from the transcript you already copied, then writes spoken Chinese with the remake beats that follow the original. Use it for video captions, caption extract, YouTube captions, and YouTube transcript work when you need a spoken remake from what the video already said."
---

# YouTube Caption Studio

The job is a Chinese spoken script and a remake structure, written from captions. A run that never looks anything up is a complete run — a pasted transcript is enough.

## Scope and adjacent routes

The route is: a YouTube link or a transcript, optional public captions, a spoken Chinese script with remake beats. It fits when someone needs a spoken remake from what the video already said.

Captions exist only when the catalog returns them. A produced video remake belongs in a teardown-and-remake workflow.

## Inputs and defaults

One hard input: the words. That is a public YouTube link, or a transcript the user already copied. Either is enough.

Reuse the conversation's language, audience, and what the remake is for. Default to the captions when a lookup runs, skip comments unless the user asks, and a deliverable with two blocks: a Chinese spoken script and a remake structure. Name those defaults instead of asking.

When the user wants captions read from a public YouTube link, this package can look them up. Every lookup is paid, optional, and confirmed on its own before it runs, per [looking up captions](references/caption-lookup.md). If the platform has no operation in the whitelist, it has no lookup — work from what the user pasted. Without a lookup, write the script from the pasted transcript rather than inventing what the video said.

## Golden path

The script can be written at no cost from a transcript the user brought. The only paid call is an optional lookup, and it happens only when the user asks for it and confirms its own price.

**Before the script, only when the user asks for it:** read one YouTube video's captions, and optionally one page of its comments, per [looking up captions](references/caption-lookup.md). Skip the lookup whenever the user already pasted a transcript.

1. **Collect the words.** From the captions payload or from the transcript the user pasted. Keep the source attributed — looked up with its read time, or supplied.
2. **Write the Chinese spoken script** and the remake structure from those words, per [writing the script](references/script.md).
3. Offer one revision of the wording at no cost.
4. Deliver the script and the remake structure. For a lookup, also deliver the task ID, terminal status, and `billing.net_charged_credits`. A lookup has no model, dimensions, or duration to report.

## Decisions that require confirmation

Confirm every lookup on its own, before it runs, without exception. Show what will be read, the operation it maps to, the credit price `beatra.social.tools.get` just returned, and how many lookups the plan contains, counting each page as one. Stopping here still leaves a usable script from anything the user already pasted.

Also confirm, rather than deciding alone: a 60-credit captions read, a video metadata read before captions, a comments page, a second captions call after a language list, and any change after a lookup has already run. Each changed argument is new paid work with a new request identifier and fresh approval.

A line that was looked up is labelled as looked up, with the date it was read. A line the user supplied stays marked as supplied. A missing transcript is stated as missing. Never invent spoken lines the captions or paste did not contain. Why a beat should be kept remains inference — mark it as inference and give the evidence.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"query":"captions","platform":"youtube","capability_family":"captions"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the Chinese spoken script and the remake structure. For a lookup, deliver the returned payload, `task_id`, terminal status, and `billing.net_charged_credits`. Do not look for a resolved model or a generated media file. Report only facts the task actually returned.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the match with `beatra.tasks.get`, then replay byte-identical arguments under the same `client_request_id`. Writing only the replay half authorizes a duplicate charge.

On a failed lookup, keep `error.code` and read the platform wording in `error.message`. Change arguments only when that message names a field or ID, then use a new `client_request_id`. Otherwise keep the same ID and the same payload. Do not suggest changing a model.

## References by task

- Reading a YouTube video, its captions, or its comments, what each lookup costs, and how lines are attributed: [looking up captions](references/caption-lookup.md)
- Writing the Chinese spoken script and remake structure: [writing the script](references/script.md)
- Exact payloads, confirmation, paging, and recovery: [caption studio workflow](references/workflow.md)
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
