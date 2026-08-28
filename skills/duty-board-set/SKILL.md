---
name: "duty-board-set"
description: "Turn user-supplied classroom duty roster slots and duty lines into a four-to-eight still duty board set. This roster-to-board studio lays out each named duty slot as its own classroom board still. Use it for duty roster board packs, classroom duty boards, and matching duty board graphics."
---

# Duty Board Pack

Make a four-to-eight still pack from duty roster slots and duty lines the
class already supplied. Use this Skill when a classroom needs a
matching duty board pack — one still per named duty slot — not a character-card
pack and not a session cover pack.

Use `hanzi-card-set` when the work is one still per named character.
Use `bank-desk-board-set` when the work is one still per named branch
window. Use `barber-walk-in-board` when the work is a walk-in queue
board. Do not look up public posts for missing duty titles. Do
not invent student names, grades, punishments, a school stamp, or an
official notice.

## Collect supplied duty slots

Hard inputs are the exact pack name and the user-supplied duty slot
names and duty lines that will appear on the stills. Do not invent a
slot, student name, grade, punishment, or school stamp to finish a
slot. Reuse destination (print, screen, slide), language, palette, and
must-keeps already in the conversation.

Ask only for facts that change the pack:

- exact class, grade, or pack name;
- each named duty slot and the duty lines the teacher already approved;
- destination surface and language; and
- an optional brand still if the pack should match that look.

A scan or photo is a visual reference, not a source for missing
duty titles. Uploading makes media available to Beatra and does
not inspect it. When the host cannot view a file, keep the user's
declared role for it.

Default to one still per named duty slot, four to eight stills in
the pack. If they name fewer than four slots, keep that count.
Cap the pack at eight. If they want a standard set and have not
numbered slots, plan four stills from the names already given.
Omit a line whose fact is missing and keep that gap on the plan so
the teacher can add it later.

Keep the same type, palette, and layout across the pack so the stills
read as one classroom duty board pack.

## Plan the free pack list

Write a labeled pack list before any paid image. For each duty slot
record the printed lines, language, layout (slot name, duty points,
optional footer), canvas, and any optional reference role.
That list is the free visible result. Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`. Keep `model`
as `auto` and `count` at `1` per still. Default canvas is 3:4 2K for
print classroom boards. Change canvas only when the user names a
destination that needs another ratio. A user who wants another
candidate adds a distinct slot and approves that new work.

Use `beatra.images.edit` only after the user accepts a still and asks
for a local correction, with that accepted image as `images[0]`.

Read [duty board pack workflow](references/workflow.md) when writing
the payload or recovering a task.

## Confirm once, create by duty slot

Planning is free. Before the first billable call, show one current
production card that lists every named duty slot still, and wait:

1. Work — one duty slot still per named roster line, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per duty slot still. This card lists every
   slot in the pack. Do not batch several slots into one
   `count`. This approval does not cover retries.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, duty line, file, model, or canvas mints a new ID.
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
item, not as an official notice, a punishment rule, or a published
school policy.

Deliver the stills in duty-slot order, the pack list, observed
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
printf '%s' '{"prompt":"Create the approved duty-board still for the named slot. Print only the confirmed duty slot name and duty lines. Keep the shared pack look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"3:4"},"client_request_id":"opaque-duty-board-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For pack lists, payloads, confirmation, polling, recovery, and review,
  read [duty board pack workflow](references/workflow.md).
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
