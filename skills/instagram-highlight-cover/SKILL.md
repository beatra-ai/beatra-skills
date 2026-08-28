---
name: "instagram-highlight-cover"
description: "Instagram highlight covers are one still per named highlight after reading the account Reels and posts. Use this highlight cover set for highlight covers, cover stills, and a highlight cover group from the same highlight list."
---

# Instagram Highlight Covers

Make one Instagram highlight cover still per named highlight.
Use this Skill when an operator wants cover stills for Highlights
after reading an account's Reels and posts, or from a highlight
list already written down.

This package reads public Instagram accounts and makes stills. It
does not create Highlights, post, or change the live account. If
this connection has no Instagram account read, work from the
written highlight list only.

## Collect the highlight list

Hard inputs are either a public Instagram username or profile the
host can open, or highlight names already written plus the facts
that may appear on each cover. Do not invent a highlight title, a
caption, or a follower count. Reuse account, language, and
must-keeps already in the conversation. Ask only for a missing
hard input.

Default to one still per named highlight, up to six from the list
already in hand. Leave a highlight the operator has not named on
the plan.

## Plan the free cover set

Write a labeled cover plan before any paid lookup or image. For
each slot record the highlight name, the facts already given, and
the visual role. That plan is the free visible result from
whatever the operator already pasted. Planning is not approval.

## Look up the account on its own card

A username does not authorize a lookup. When the operator wants
this connection to read a public Instagram account, follow
[account lookup](references/account-lookup.md): search, inspect,
then show a six-field lookup card and wait:

1. Work — one public Instagram profile, posts page, Reels page, or
   single post for the named account
   (`beatra.social.execute` with the inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just
   returned. Quote that live number, not a remembered one.
3. Count — one prepaid lookup. The next posts or Reels page is
   another charge.
4. Identity — one new opaque `client_request_id` per page.
5. If we stop here — the written highlight plan remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

Do not show `schema_hash` to the operator. A confirmed lookup does
not authorize generate.

## Confirm generate separately

Before any billable image, read the current `beatra.models.list`
card for `text_to_image`. Keep `model` as `auto` and `count` at
`1` per cover. Show one current generate production card and wait:

1. Work — one highlight cover still per named highlight, a
   generate call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not
   reuse a remembered number.
3. Count — one paid call per cover. Do not batch highlights into
   one `count`.
4. Identity — one new opaque `client_request_id` per cover. A
   changed name, prompt, file, model, or canvas mints a new ID.
5. If we stop here — the labeled cover plan remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

A confirmed lookup does not authorize generate. Submit once
through bundled `scripts/mcp_client.py`. Poll `beatra.tasks.get`.
Deliver actual bytes plus `billing.net_charged_credits`.

Use `beatra.images.edit` only after the operator accepts a still
and asks for a change on that file.

## Review, deliver, and recover

Review printed words against the named highlight list. Report only
the text the host can actually see.

After a returned `task_id`, poll that task. If the create response
is lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the operator asks.

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
printf '%s' '{"query":"instagram user","platform":"instagram","capability_family":"creator"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For highlight lists, lookup, generate payloads, and recovery, read
  [Highlight cover workflow](references/workflow.md) and
  [account lookup](references/account-lookup.md).
- For installation, connection, task polling, billing errors, and
  disconnect, read [installation and authentication](references/installation-and-auth.md),
  [Bundled MCP Client diagnostics](references/mcp-connection.md),
  [tasks and results](references/tasks-and-results.md),
  [billing, errors, and recovery](references/billing-errors-and-recovery.md),
  and [uninstall and disconnect](references/uninstall-and-disconnect.md).
- For first-run registration, read [installation registration](references/installation-registration.md).

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours. When a higher version is available, it installs automatically without separate confirmation. It downloads only from the fixed official Beatra discovery and immutable CDN paths, verifies the archive, manifest, and every packaged file, and replaces only files owned by this package. If an update fails, the current installation remains usable and the original command continues. The setting persists for this installation. See [automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
