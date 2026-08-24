---
name: "risk-grade-set"
description: "Turn user-supplied risk-grade definitions into a four-to-eight still risk grade set. This risk grade still studio lays out each named grade as its own still. Use it for risk grade graphics, risk level cards, risk classification stills, and a risk grade pack."
---

# Risk Grade Set

Make a four-to-eight still pack from risk-grade definitions the user
already supplied. Use this Skill when a wealth session needs a risk
grade set — one still per named grade — not a page-by-page factsheet
and not a product gallery.

Use `fund-page-set` when the work is one prospectus still per named
page. Use `ecommerce-listing-image-set` for a hero, lifestyle, and
detail gallery. Keep session covers for `wealth-cover-set` when that
package is installed. Do not look up public posts or market quotes for
missing grade lines.

## Collect supplied grades

Hard inputs are the exact set name and the user-supplied risk-grade
definitions that will appear on the stills. Do not invent a grade, buy
or sell line, return figure, ranking, or regulator rating to finish a
slot. Reuse destination (handout, screen, print), language, palette,
and must-keeps already in the conversation.

Ask only for facts that change the pack:

- exact set, session, or material name;
- each named grade and the definition the user already approved;
- destination surface and language; and
- an optional brand still if the pack should match that look.

A scan or photo is a visual reference, not a source for missing
definitions. Uploading makes media available to Beatra and does not
inspect it. When the host cannot view a file, keep the user's
declared role for it.

Default to one still per named grade, four to eight stills in the
pack. If they name fewer than four grades, keep that count. Cap the
pack at eight. If they want a standard set and have not numbered
grades, plan four stills from the definitions already given. Omit a
line whose fact is missing and keep that gap on the plan so the user
can add it later.

Keep the same type, palette, and layout across the pack so the stills
read as one risk grade set.

## Plan the free pack list

Write a labeled pack list before any paid image. For each grade record
the printed lines, language, layout (grade name, definition, optional
footer), canvas, and any optional reference role. That list is the
free visible result. Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`. Keep `model`
as `auto` and `count` at `1` per still. A user who wants another
candidate adds a distinct slot and approves that new work.

Use `beatra.images.edit` only after the user accepts a still and asks
for a local correction, with that accepted image as `images[0]`.

Read [risk-grade pack workflow](references/workflow.md) when writing
the payload or recovering a task.

## Confirm once, create by grade

Planning is free. Before the first billable call, show one current
production card that lists every named grade still, and wait:

1. Work — one risk-grade still per named grade, a generate call
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per grade still. This card lists every slot
   in the pack. Do not batch several grades into one `count`. This
   approval does not cover retries.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, definition line, file, model, or canvas mints a new ID.
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
item, not as a certified risk rating or a buy recommendation.

Deliver the stills in grade order, the pack list, observed dimensions
and formats, task IDs, resolved models, and returned
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
printf '%s' '{"prompt":"Create the approved risk-grade still for the named grade. Print only the confirmed grade name and definition. Keep the shared pack look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"3:4"},"client_request_id":"opaque-risk-grade-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For pack lists, payloads, confirmation, polling, recovery, and review,
  read [risk-grade pack workflow](references/workflow.md).
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
