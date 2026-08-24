---
name: "amazon-a-plus-module-pack"
description: "Turn seller-supplied selling points into one Amazon A+ module still per point. This A+ page still studio lays out each seller-supplied benefit as an Amazon A+ Content module for the A+ page. Use it for Amazon A+ modules, selling-point modules, and a brand-story A+ graphic."
---

# Amazon A+ Module Stills

Turn seller-supplied selling points into one A+ module still per point.
Use this Skill when a listing needs Amazon A+ Content stills that follow
the seller's own benefits, not a six-slot hero gallery.

Use `ecommerce-listing-image-set` when the seller wants a hero, lifestyle,
and detail gallery. Use `ecommerce-detail-module-studio` when the work
starts from product photos and needs a scrollable photo-transform story.
Keep Amazon main-image rule work on `amazon-main-image-set` or
`marketplace-main-image-preflight` when those packages are installed.
Do not look up public posts or marketplace catalogs for missing benefits.

## Collect confirmed selling points

Hard inputs are the exact SKU name and the seller-supplied selling points
that will appear on the modules. Do not invent a benefit, comparison
number, certification, or award to finish a slot. Reuse brand palette,
marketplace, language, and must-keeps already in the conversation.

Ask only for facts that change a module:

- exact SKU and variant;
- each selling point in the seller's words, with any number they already
  approved;
- destination (Amazon A+ Content or another A+ page) and language; and
- an optional product or brand still if the modules should match that
  look.

A photo is a visual reference, not a source for missing benefits.
Uploading makes media available to Beatra and does not inspect it. When
the host cannot view a file, keep the seller's declared role for it.

Default to one still per named selling point. If the seller wants a
standard A+ set and has not numbered the slots, plan up to four modules
from the facts already given: promise, feature, use, and comparison.
Leave a slot whose fact is missing on the plan. A single-module request
stays one still.

Keep the same product look, palette, and lighting across the set so the
modules read as one A+ page.

## Plan the free modules

Write a labeled module plan before any paid image. For each slot record
the selling point, language, visual role, canvas, and any optional
reference role. That plan is the free visible result. Planning is not
approval.

Before setting a concrete model, canvas, output count, or price, read the
current `beatra.models.list` card for `text_to_image`. Keep `model` as
`auto` and `count` at `1` per module. A seller who wants another
candidate adds a distinct slot and approves that new work.

Use `beatra.images.edit` only after the seller accepts a still and asks
for a local correction, with that accepted image as `images[0]`.

Read [A+ module workflow](references/workflow.md) when writing the
payload or recovering a task.

## Confirm once, create by module

Planning is free. Before the first billable call, show one current
production card and wait:

1. Work — one Amazon A+ module still per named selling point, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per module. Do not batch several points into
   one `count`.
4. Identity — one new opaque `client_request_id` per module. A changed
   prompt, selling point, file, model, or canvas mints a new ID.
5. If we stop here — the labeled module plan remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly (`https://console.beatra.ai/wallet?intent=buy`).
   Translate the prose; keep the URL. Do not retry until the seller
   says they have topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each module once. Keep no more than two generation
tasks in flight on one connection.

## Review, deliver, and recover

Review printed claims against the confirmed selling-point list. Report
only the text the host can actually see. Treat generated small type as a
review item, not as certified A+ copy.

Deliver the stills in module order, the module plan, observed dimensions
and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`. A focused correction is new paid work
with its own card and ID.

After a returned `task_id`, poll that task. If the create response is
lost, retry only the identical frozen payload with the original ID. If
the task ID is missing, use `beatra.tasks.list` and verify candidates
with `beatra.tasks.get` before another submit. Use `beatra.tasks.cancel`
only when the seller asks.

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
printf '%s' '{"prompt":"Create the approved Amazon A+ module still for the named selling point. Show only the confirmed benefit. Keep the shared A+ page look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"16:9"},"client_request_id":"opaque-aplus-module-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For selling-point lists, payloads, confirmation, polling, recovery,
  and review, read [A+ module workflow](references/workflow.md).
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
