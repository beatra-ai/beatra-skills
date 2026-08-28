---
name: "comment-pin-card"
description: "Turn a finished video's comments into one pin comment still per original quote. This pinned comment card studio reads public comments or pasted lines, then makes a comment screenshot for each seller-picked quote. Use it for pin comment cards, video comment cards, and quote cards that keep the original words."
---

# Pin Comment Cards

Turn a finished video's comments into one pin still per original quote.
Use this Skill when an operator wants screenshot cards of lines that
can sit as a pinned comment, not a VOC brief.

Use `comment-voc-miner` when the work is a grouped audience brief.
This package reads comments and makes stills. It does not post or pin
on the platform. If this connection has no comment operation for the
platform, work from pasted lines only.

## Collect the original quotes

Hard inputs are either a public post link the host can open, or the
original comment lines already copied. Do not invent a comment, a
username, or a like count. Reuse platform, language, and must-keeps
already in the conversation. Ask only for a missing hard input.

Default to one still per seller-picked quote, up to six from the
comments already in hand. Leave a quote the seller has not chosen on
the plan.

## Plan the free pin cards

Write a labeled pin plan before any paid lookup or image. For each
slot record the original line, language, and visual role. That plan is
the free visible result from whatever the seller already pasted.
Planning is not approval.

## Look up comments on their own card

A post link does not authorize a lookup. When the seller wants this
connection to read a public post, follow
[comment lookup](references/comment-lookup.md): search, inspect, then
show a six-field lookup card and wait:

1. Work — one public comment page for the named post
   (`beatra.social.execute` with the inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just returned.
   Xiaohongshu comment reads often cost more than TikTok or YouTube;
   quote that live number, not a remembered one.
3. Count — one prepaid lookup. The next comments page is another
   charge.
4. Identity — one new opaque `client_request_id` per page.
5. If we stop here — the pasted-quote plan remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Do not show `schema_hash` to the seller. A confirmed lookup does not
authorize generate.

## Confirm generate separately

Before any billable image, read the current `beatra.models.list` card
for `text_to_image`. Keep `model` as `auto` and `count` at `1` per
card. Show one current generate production card and wait:

1. Work — one pin comment still per chosen original quote, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per card. Do not batch quotes into one
   `count`.
4. Identity — one new opaque `client_request_id` per card. A changed
   quote, prompt, file, model, or canvas mints a new ID.
5. If we stop here — the labeled pin plan remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

A confirmed lookup does not authorize generate. Submit once through
bundled `scripts/mcp_client.py`. Poll `beatra.tasks.get`. Deliver
actual bytes plus `billing.net_charged_credits`.

## Review, deliver, and recover

Review printed words against the chosen original quotes. Report only
the text the host can actually see.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the seller asks.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

```text
printf '%s' '{"query":"comments","platform":"douyin","capability_family":"comments"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For quote lists, lookup, generate payloads, and recovery, read
  [Pin comment workflow](references/workflow.md) and
  [comment lookup](references/comment-lookup.md).
- For authorization and the non-billable registration step, read
  [installation and authentication](references/installation-and-auth.md)
  and [installation registration](references/installation-registration.md).
- For shared task, billing, and connection details, read [tasks and
  results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [Bundled MCP
  Client diagnostics](references/mcp-connection.md).
- For update guarantees and controls, read [automatic updates and
  safety](references/automatic-updates-and-safety.md). For removal, read
  [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once
every 24 hours per installation. When a newer version is available, it
installs automatically without separate confirmation. It downloads only
from the fixed official Beatra discovery and immutable CDN paths for
this package, channel, and locale, verifies discovery data, archive,
manifest, and every packaged file, and replaces only package-owned
files.

Update checks, downloads, verification, replacement, rollback, and
recovery fail open: the current installation remains usable and the
original command continues. An update failure never authorizes retrying
a paid lookup or image request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
