---
name: "project-handover-sign-set"
description: "Turn contractor-supplied project names, unit names, and handover dates into three handover sign stills, then turn the rest of that project into a matching set. This project handover sign studio lays out each named completion board from the inscriptions you already have. Use it for project completion signs, handover sign boards, and matching completion-sign packs."
---

# Project Handover Sign Set

Turn three named handover signs into print-ready stills, then turn the
rest of that project into a labeled set. The first delivery is three
complete completion-sign stills the contractor can review.

## Scope and adjacent routes

Use this Skill when a contractor, general contractor, or supervisor
wants matching handover sign stills from inscriptions they already
have: project completion signs, handover sign boards, or another
completion-sign pack.

Route field inspection stills — one still per named check item — to
`field-check-set`.

## Collect the project signs

Hard inputs are:

- the project or pack name;
- each sign title that will appear on a board;
- every statutory inscription that sign must print (handover date,
  unit names, and project name).

Reuse already-known destination (print, screen, slide), language,
palette, and must-keeps. Ask only for a missing hard input. Do not
invent, infer, or complete a handover date, unit name, project name,
or other statutory inscription. A missing inscription stays a named
gap.

A full project set is welcome. The first paid stills are still three
named signs. Remaining signs wait until those first three are
accepted. If they name fewer than three signs, keep that count. A
typical project set is five to ten signs in total. Do not invent extra
boards to fill a quota.

A scan or photo is a visual reference, not a source for missing
inscriptions. Uploading makes media available to Beatra and does not
inspect it. When the host cannot view a file, keep the user's declared
role for it.

Keep the same type, palette, and layout across the pack so the stills
read as one project handover sign set.

## Plan the free 3-sign pack list

Write a labeled 3-sign pack list before any paid image. For each of
the first three named signs record the printed title, statutory
inscriptions, language, layout, canvas, and any optional reference
role. Remaining named signs stay on that list as later slots. That
list is the free visible result. Planning is not approval.

Safe defaults:

- `model: "auto"` unless the user chose a live SKU.
- `count` at `1` per still. Do not batch several signs into one
  `count`.
- Default canvas is 3:4 2K for print boards. Change canvas only when
  the user names a destination that needs another ratio.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`. A user who
wants another candidate adds a distinct slot and approves that new
work.

Use `beatra.images.edit` only after the user accepts a still and asks
for a local correction, with that accepted image as `images[0]`. Read
the live `image_edit` card first.

Read [project handover sign workflow](references/workflow.md) when
writing the payload or recovering a task.

## Confirm the first three signs, then the set

Before any billable still, read the current `beatra.models.list` card
for `text_to_image`. Show one current generate production card for the
first three named signs and wait:

1. Work — three named handover sign stills, each a generate call
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times three.
   Do not reuse a remembered number.
3. Count — three paid calls, one per named sign. Do not batch the
   three into one `count`. This approval does not cover the remaining
   project set or retries.
4. Identity — one new opaque `client_request_id` per sign. A changed
   prompt, inscription, file, model, or canvas mints a new ID.
5. If we stop here — the labeled 3-sign pack list remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the contractor says they
   have topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After those first three stills are accepted, remaining named signs are
a new pack. Show a fresh six-field card for that frozen remaining set
and wait:

1. Work — one handover sign still per remaining named board, each a
   generate call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   remaining slot count. Do not reuse a remembered number.
3. Count — one paid call per remaining slot. Do not batch slots into
   one `count`. This approval does not cover retries.
4. Identity — one new opaque `client_request_id` per remaining slot.
   A changed prompt, inscription, file, model, or canvas mints a new
   ID for the changed slots.
5. If we stop here — the first accepted three stills and the remaining
   labeled slots remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the contractor says they have topped up. Do not recommend
   ¥198.

Do not treat acceptance of the first three signs as approval of the
rest.

After approval, submit each still once. Keep no more than two
generation tasks in flight on one connection.

## Review, deliver, and recover

Review printed titles and inscriptions against the confirmed pack
list. Report only the text the host can actually see. Treat generated
small type as a review item, not as an official completion filing, a
legal certificate, or a published acceptance notice.

Deliver the stills in sign order, the pack list, observed dimensions
and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`. A focused correction is new paid work
with its own card and ID. Read the live `image_edit` card before
`beatra.images.edit`.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the contractor asks.

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

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_edit"}
```

```text
printf '%s' '{"prompt":"Create the approved project-handover sign still for the named board. Print only the confirmed sign title and statutory inscriptions. Keep the shared pack look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"3:4"},"client_request_id":"opaque-handover-sign-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For pack lists, payloads, confirmation, polling, recovery, and review,
  read [project handover sign workflow](references/workflow.md).
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
a paid image request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
