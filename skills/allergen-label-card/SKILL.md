---
name: "allergen-label-card"
description: "Turn seller-supplied ingredient and allergen facts into one allergen explanation card per SKU. This allergen label card studio lays out the seller-supplied allergens and ingredients as an allergen listing still. Use it for food allergen notices, SKU allergen cards, and product-page ingredient explanation graphics."
---

# Allergen Explanation Cards

Make one allergen explanation still per SKU from facts the seller already
confirmed. Use this Skill when a food or personal-care listing needs a
clear allergen notice or ingredient explanation graphic, not a six-slot
product gallery.

Use `ecommerce-listing-image-set` when the seller wants a hero, lifestyle,
and detail gallery for one SKU. Use `marketplace-main-image-preflight` for
a main-image rule check. Keep nutrition-panel layout work for
`nutrition-panel-art` when that package is installed. Do not look up
public posts or marketplace catalogs for missing allergens.

## Collect confirmed facts

Hard inputs are the exact SKU name and the seller-supplied ingredient or
allergen list that will appear on the card. Do not invent an allergen,
contains-statement, may-contain line, certification, or serving claim to
finish the card. Reuse brand palette, destination (listing, packaging
insert, store notice), language, and must-keeps already in the
conversation.

Ask only for facts that change the card:

- exact SKU and variant;
- the ingredient list or named allergens the seller wants printed;
- contains / may-contain lines the seller has already approved;
- destination surface and language; and
- an optional pack or brand still if the card should match that look.

A photo is a visual reference, not a source for missing allergens.
Uploading makes media available to Beatra and does not inspect it. When
the host cannot view a file, keep the seller's declared role for it.

Default to one card per named SKU. Several SKUs are several cards, each
with its own fact list. Omit a line whose fact is missing and keep that
gap on the plan so the seller can add it later.

## Plan the free card

Write a labeled card plan before any paid image. For each SKU record the
printed lines, language, layout (title, allergen group, contains line,
optional footer), canvas, and any optional reference role. That plan is
the free visible result. Planning is not approval.

Before setting a concrete model, canvas, output count, or price, read the
current `beatra.models.list` card for `text_to_image`. Keep `model` as
`auto` and `count` at `1` per SKU. A seller who wants another candidate
adds a distinct card and approves that new work.

Use `beatra.images.edit` only after the seller accepts a card and asks
for a local correction, with that accepted image as `images[0]`.

Read [allergen-card workflow](references/workflow.md) when writing the
payload or recovering a task.

## Confirm once, create by SKU

Planning is free. Before the first billable call, show one current
production card and wait:

1. Work — one allergen explanation still per named SKU, a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per SKU card. Do not batch several SKUs into
   one `count`.
4. Identity — one new opaque `client_request_id` per card. A changed
   prompt, fact line, file, model, or canvas mints a new ID.
5. If we stop here — the labeled card plan remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly (`https://console.beatra.ai/wallet?intent=buy`).
   Translate the prose; keep the URL. Do not retry until the seller
   says they have topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each SKU once. Keep no more than two generation
tasks in flight on one connection.

## Review, deliver, and recover

Review printed lines against the confirmed fact list. Report only the
text the host can actually see. Treat generated small type as a review
item, not as a certified label.

Deliver the stills in SKU order, the card plan, observed dimensions and
formats, task IDs, resolved models, and returned
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
printf '%s' '{"prompt":"Create the approved allergen explanation card for the named SKU. Print only the confirmed allergen and ingredient lines.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-allergen-sku-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For fact lists, payloads, confirmation, polling, recovery, and review,
  read [allergen-card workflow](references/workflow.md).
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
