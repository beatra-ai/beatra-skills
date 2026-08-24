---
name: "indiegogo-gallery-set"
description: "Turn a written campaign and reward-tier plan into one gallery still per named slot. This crowdfunding gallery studio lays out each named reward-tier still and campaign scene as its own still. Use it for Indiegogo gallery stills, Kickstarter gallery frames, reward-tier tiles, and campaign gallery sets."
---

# Crowdfunding Gallery Stills

Turn a written campaign and reward-tier plan into one gallery still per
named slot. Use this Skill when a crowdfunding page needs gallery stills
or reward-tier tiles that follow the plan already on file, not a
six-slot product listing gallery.

Use `ecommerce-listing-image-set` when the seller wants a hero, lifestyle,
and detail gallery for one SKU. Use `amazon-a-plus-module-pack` when the
work is Amazon A+ selling-point modules. Keep a later
`kickstarter-reward-tile` package for a single perk tile when that
package is installed. Do not look up public posts or live campaign pages
for missing perks or prices.

## Collect the written plan

Hard inputs are the exact campaign or product name and the
already-written reward-tier or gallery plan that will appear on the
stills. Do not invent a perk, price, stretch goal, backer count, or
ship date to finish a slot. Reuse platform (Indiegogo, Kickstarter, or
another gallery), language, palette, and must-keeps already in the
conversation.

Ask only for facts that change a still:

- exact campaign or product name;
- each named gallery or reward-tier slot in the writer's words, with
  any price they already approved;
- destination gallery and language; and
- an optional product or brand still if the set should match that look.

A photo is a visual reference, not a source for missing perks.
Uploading makes media available to Beatra and does not inspect it. When
the host cannot view a file, keep the writer's declared role for it.

Default to one still per named gallery or reward-tier slot. If the
writer wants a standard set and has not numbered the slots, plan up to
four stills from the facts already given: campaign hero, product still,
reward-tier tile, and use scene. Leave a slot whose fact is missing on
the plan. A single-tile request stays one still.

Keep the same product look, palette, and lighting across the set so the
stills read as one campaign gallery.

## Plan the free gallery

Write a labeled gallery plan before any paid image. For each slot record
the campaign name, reward or scene line, language, visual role, canvas,
and any optional reference role. That plan is the free visible result.
Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read the
current `beatra.models.list` card for `text_to_image`. Keep `model` as
`auto` and `count` at `1` per still. A writer who wants another
candidate adds a distinct slot and approves that new work.

Use `beatra.images.edit` only after the writer accepts a still and asks
for a local correction, with that accepted image as `images[0]`.

Read [crowdfunding gallery workflow](references/workflow.md) when writing
the payload or recovering a task.

## Confirm once, create by slot

Planning is free. Before the first billable call, show one current
production card and wait:

1. Work — one crowdfunding gallery still per named slot, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per still. Do not batch several slots into
   one `count`.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, perk line, file, model, or canvas mints a new ID.
5. If we stop here — the labeled gallery plan remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly (`https://console.beatra.ai/wallet?intent=buy`).
   Translate the prose; keep the URL. Do not retry until the writer
   says they have topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each still once. Keep no more than two generation
tasks in flight on one connection.

## Review, deliver, and recover

Review printed claims against the confirmed gallery plan. Report only
the text the host can actually see. Treat generated small type as a
review item, not as a live campaign perk.

Deliver the stills in slot order, the gallery plan, observed dimensions
and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`. A focused correction is new paid work
with its own card and ID.

After a returned `task_id`, poll that task. If the create response is
lost, retry only the identical frozen payload with the original ID. If
the task ID is missing, use `beatra.tasks.list` and verify candidates
with `beatra.tasks.get` before another submit. Use `beatra.tasks.cancel`
only when the writer asks.

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
printf '%s' '{"prompt":"Create the approved crowdfunding gallery still for the named slot. Show only the confirmed campaign name and written reward or scene line. Keep the shared gallery look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"16:9"},"client_request_id":"opaque-gallery-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For gallery lists, payloads, confirmation, polling, recovery, and
  review, read [crowdfunding gallery workflow](references/workflow.md).
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
