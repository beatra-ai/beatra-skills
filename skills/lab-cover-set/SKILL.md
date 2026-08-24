---
name: "lab-cover-set"
description: "Turn user-supplied assignment names and points into a four-to-eight still lab cover set. This lab report cover studio lays out each named assignment as its own still. Use it for assignment covers, experiment covers, lab report stills, and a matching cover pack."
---

# Lab Cover Set

Make a four-to-eight still pack from assignment names and points the
user already supplied. Use this Skill when a lab report needs a cover
set — one still per named assignment — not a session cover pack and
not a character-card pack.

Use `wealth-cover-set` when the work is one still per named investor
education session. Use `hanzi-card-set` when the work is one still per
named character. Use `art-demo-set` when the work is one classroom
still per drawing step. Do not look up public posts or textbooks for
missing assignment titles. Do not invent a score, rank, grade, or
experiment conclusion.

## Collect supplied assignments

Hard inputs are the exact set name and the user-supplied assignment
names and points that will appear on the covers. Do not invent an
assignment, score, rank, grade, or experiment conclusion to finish a
slot. Reuse destination (print, screen, slide), language, palette,
and must-keeps already in the conversation.

Ask only for facts that change the pack:

- exact set, unit, or class name;
- each named assignment and the points the user already approved;
- destination surface and language; and
- an optional brand still if the pack should match that look.

A scan or photo is a visual reference, not a source for missing
assignment titles. Uploading makes media available to Beatra and does
not inspect it. When the host cannot view a file, keep the user's
declared role for it.

Default to one still per named assignment, four to eight stills in
the pack. If they name fewer than four assignments, keep that count.
Cap the pack at eight. If they want a standard set and have not
numbered assignments, plan four stills from the names already given.
Omit a line whose fact is missing and keep that gap on the plan so
the user can add it later.

Keep the same type, palette, and layout across the pack so the stills
read as one lab cover set.

## Plan the free pack list

Write a labeled pack list before any paid image. For each assignment
record the printed lines, language, layout (assignment name, points,
optional footer), canvas, and any optional reference role. That list
is the free visible result. Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`. Keep `model`
as `auto` and `count` at `1` per still. Default canvas is 3:4 2K for
print lab-report covers. Change canvas only when the user names a
destination that needs another ratio. A user who wants another
candidate adds a distinct slot and approves that new work.

Use `beatra.images.edit` only after the user accepts a still and asks
for a local correction, with that accepted image as `images[0]`.

Read [lab cover pack workflow](references/workflow.md) when writing
the payload or recovering a task.

## Confirm once, create by assignment

Planning is free. Before the first billable call, show one current
production card that lists every named assignment cover, and wait:

1. Work — one assignment-cover still per named assignment, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per assignment still. This card lists every
   slot in the pack. Do not batch several assignments into one
   `count`. This approval does not cover retries.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, assignment line, file, model, or canvas mints a new ID.
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
item, not as a grade or an experiment conclusion.

Deliver the stills in assignment order, the pack list, observed
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
printf '%s' '{"prompt":"Create the approved assignment-cover still for the named lab assignment. Print only the confirmed assignment name and points. Keep the shared pack look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"3:4"},"client_request_id":"opaque-lab-cover-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For pack lists, payloads, confirmation, polling, recovery, and review,
  read [lab cover pack workflow](references/workflow.md).
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
