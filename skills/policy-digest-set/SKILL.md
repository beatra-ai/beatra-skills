---
name: "policy-digest-set"
description: "Turn user-supplied public policy digest points into one policy digest still per page. This public points page still studio lays out each public digest page from the supplied digest. Use it for policy digest set layouts, page-by-page policy stills, and policy digest graphic work."
---

# Policy Digest Pages

Make one digest still per named page or step from public points the
office already supplied. Use this Skill when a street window needs a
page-by-page public-policy still set, not a four-to-eight gallery and
not a talking clip.

Use `fund-page-set` when the work is a fund factsheet page. Use
`unit-map-set` when the work is a unit map. Use `hanzi-card-set` when
the work is character cards. Do not look up public posts for missing
digest lines. Do not forge an official document, stamp, letterhead, or
red-head notice.

## Collect supplied pages

Hard inputs are the digest title the office already uses and the
user-supplied public policy digest points that will appear on the
stills. Do not invent a statute number, effective date, subsidy amount,
eligibility line, or official stamp to finish a page. Reuse destination
(handout, screen, print), language, and must-keeps already in the
conversation.

Ask only for facts that change the pages:

- the digest title already in use;
- the page or step titles the office wants printed;
- the public points the office has already approved for each page;
- destination surface and language; and
- an optional brand still if the pages should match that look.

A scan or photo is a visual reference, not a source for missing
statute text. Uploading makes media available to Beatra and does not
inspect it. When the host cannot view a file, keep the user's
declared role for it.

Default to one still per named page or step. Several pages are
several stills, each with its own point list. Omit a line whose fact
is missing and keep that gap on the plan so the office can add it
later.

## Plan the free page list

Write a labeled page list before any paid image. For each page record
the printed lines, language, layout (title, body points, optional
footer), canvas, and any optional reference role. That list is the
free visible result. Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`. Keep `model`
as `auto` and `count` at `1` per page. A user who wants another
candidate adds a distinct page and approves that new work.

Use `beatra.images.edit` only after the user accepts a page and asks
for a local correction, with that accepted image as `images[0]`.

Read [policy-digest workflow](references/workflow.md) when writing the
payload or recovering a task.

## Confirm once, create by page

Planning is free. Before the first billable call, show one current
production card and wait:

1. Work — one digest still per named page or step, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per page still. Do not batch several pages
   into one `count`.
4. Identity — one new opaque `client_request_id` per page. A changed
   prompt, fact line, file, model, or canvas mints a new ID.
5. If we stop here — the labeled page list remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly (`https://console.beatra.ai/wallet?intent=buy`).
   Translate the prose; keep the URL. Do not retry until the user
   says they have topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each page once. Keep no more than two generation
tasks in flight on one connection.

## Review, deliver, and recover

Review printed lines against the confirmed page list. Report only the
text the host can actually see. Treat generated small type as a review
item, not as a certified official notice.

Deliver the stills in page order, the page list, observed dimensions
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
printf '%s' '{"prompt":"Create the approved public-policy digest page still for the named page. Print only the confirmed public digest points.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"3:4"},"client_request_id":"opaque-policy-page-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For page lists, payloads, confirmation, polling, recovery, and review,
  read [policy-digest workflow](references/workflow.md).
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
