---
name: "field-check-set"
description: "Turn user-supplied on-site inspection check item names and check points into a four-to-eight still field check set. This check-item-to-still studio lays out each named inspection item as its own on-site check still. Use it for field check still packs, inspection checklist graphics, and matching on-site inspection still sets."
---

# Field Check Pack

Make a four-to-eight still pack from check item names and check points the
team already supplied. Use this Skill when a field team needs a
matching field check still pack — one still per named check item — not a
safety-sign pack and not an assembly clip.

Use `shop-safety-sign-set` when the work is one still per named safety
sign point. Use `cs-macro-card-set` when the work is one still per named
service macro. Use `assembly-one-step-clip` when the work is one still
photo to one 2–15s clip. Do not look up public posts for missing check
points. Do not invent a violation conclusion, compliance guarantee,
official stamp, penalty amount, or pass/fail result the user did not
supply.

## Collect supplied check items

Hard inputs are the exact pack name and the user-supplied check item
names and check points that will appear on the stills. Do not invent a
check item, violation conclusion, compliance guarantee, official stamp,
or pass/fail result to finish a slot. Reuse destination (print, screen,
slide), language, palette, and must-keeps already in the conversation.

Ask only for facts that change the pack:

- exact team, site, or pack name;
- each named check item and the check points the team already approved;
- destination surface and language; and
- an optional brand still if the pack should match that look.

A scan or photo is a visual reference, not a source for missing
check points. Uploading makes media available to Beatra and does
not inspect it. When the host cannot view a file, keep the user's
declared role for it.

Default to one still per named check item, four to eight stills in
the pack. If they name fewer than four items, keep that count.
Cap the pack at eight. If they want a standard set and have not
numbered items, plan four stills from the names already given.
Omit a line whose fact is missing and keep that gap on the plan so
the team can add it later.

Keep the same type, palette, and layout across the pack so the stills
read as one field check still pack.

## Plan the free pack list

Write a labeled pack list before any paid image. For each check item
record the printed lines, language, layout (item name, check points,
optional footer), canvas, and any optional reference role.
That list is the free visible result. Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`. Keep `model`
as `auto` and `count` at `1` per still. Default canvas is 3:4 2K for
print field check boards. Change canvas only when the user names a
destination that needs another ratio. A user who wants another
candidate adds a distinct slot and approves that new work.

Use `beatra.images.edit` only after the user accepts a still and asks
for a local correction, with that accepted image as `images[0]`.

Read [field check pack workflow](references/workflow.md) when writing
the payload or recovering a task.

## Confirm once, create by check item

Planning is free. Before the first billable call, show one current
production card that lists every named check item still, and wait:

1. Work — one check item still per named inspection line, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per check item still. This card lists every
   slot in the pack. Do not batch several items into one
   `count`. This approval does not cover retries.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, check point, file, model, or canvas mints a new ID.
5. If we stop here — the labeled pack list remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly (`https://console.beatra.ai/wallet?intent=buy`).
   Translate the prose; keep the URL. Do not retry until the user
   says they have topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each still once. Keep no more than two
generation tasks in flight on one connection.

## Review, deliver, and recover

Review printed lines against the confirmed pack list. Report only the
text the host can actually see. Treat generated small type as a review
item, not as an official inspection result, a compliance guarantee, or a
published regulatory notice.

Deliver the stills in check-item order, the pack list, observed
dimensions and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`. A focused correction is new paid work
with its own card and ID.

After a returned `task_id`, poll that task. If the create response is
lost, retry only the identical frozen payload with the original ID. If
the task ID is missing, use `beatra.tasks.list` and verify candidates
with `beatra.tasks.get` before another submit. Use `beatra.tasks.cancel`
only when the user asks.

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
printf '%s' '{"prompt":"Create the approved field-check still for the named item. Print only the confirmed check item name and check points. Keep the shared pack look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"3:4"},"client_request_id":"opaque-field-check-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For pack lists, payloads, confirmation, polling, recovery, and review,
  read [field check pack workflow](references/workflow.md).
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
a paid image request. The setting persists for this installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
