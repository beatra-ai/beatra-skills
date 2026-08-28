---
name: "store-new-item-launch"
description: "Turn three named new-item stills into a launch board you can post, then turn the rest of the set into a matching pack. This store new item launch studio writes a new-item still set and launch poster from the facts you already have. Use it for cafe launches, retail restocks, and chain-store new-item boards."
---

# Store New Item Launch

Turn three named new-item stills into a labeled new-item board, then
turn the rest of that set into a matching pack. The first delivery is
three complete stills the store can post.

## Scope and adjacent routes

Use this Skill when a cafe, retail shop, or chain store wants a
new-item still set from facts they already have: listing stills,
in-store launch posters, or a matching new-item board.

Route a restock talking clip to `restock-drop-talking`. Route a
new-drop talking teaser to `creator-drop-talking`. Route a one-SKU
marketplace gallery to `ecommerce-listing-image-set`. Do not animate a
still or make a talking-head clip.

## Collect the new item

Hard inputs are:

- the store or brand;
- the named new item;
- the language the stills should print.

Reuse already-known destination, palette, and must-keeps. Ask only for
a missing hard input. Do not invent an ingredient, price, or claim to
finish a still.

A full still set is welcome. The first paid board is still three
named stills. Remaining stills wait until those first three are
accepted.

A product photo is a visual reference, not a source for missing
ingredients, prices, or claims. File access is not consent. Inspect
every optional still. Record MIME type, width, height, aspect ratio,
byte size, and whether it has an alpha channel. For a local file,
upload only through the bundled client after inspection
(`scripts/mcp_client.py` / `beatra.assets.upload`). Keep the returned
artifact id. Never pass a local path to `beatra.images.generate` or
`beatra.images.edit`.

If they want a standard set and have not numbered stills, plan four
named visual roles from facts already given: listing still, in-store
poster, feature still, and one extra listing or poster still. A named
set is typically four or more. Omit a printed line whose fact is
missing and keep that gap on the plan.

Keep the same type, palette, and layout across the pack so the stills
read as one new-item set.

## Plan the free 3-still board

Write a labeled 3-still new-item board before any paid image. For each
of the first three named stills record the printed lines, language,
layout, canvas, and any optional reference role. Remaining named
stills stay on the same plan as a later pack. That board is the free
visible result. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per still;
- `model: "auto"` and `count: 1`;
- canvas `{"type":"preset","tier":"2K","aspect":"1:1"}` for listing.
  Change canvas only when the destination needs another ratio: `3:4`
  for Xiaohongshu, `9:16` for a story;
- `beatra.images.edit` only after the store accepts a still and asks
  for a local correction, with that accepted image as `images[0]`.

Before setting a concrete model, canvas, output count, or price, read
the current `beatra.models.list` card for `text_to_image`.

Read [Store new-item workflow](references/workflow.md) when writing
the payload or recovering a task.

## Confirm the first three, then the set

Planning is free. Before any billable still, read the current
`beatra.models.list` card for `text_to_image`. Show one current
generate production card for the first three named stills and wait:

1. Work — three new-item stills (or fewer if they named fewer), each a
   generate call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   first-still count. Do not reuse a remembered number.
3. Count — one paid call per first still. Do not batch the remaining
   named stills into this submit.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, fact line, file, model, or canvas mints a new ID.
5. If we stop here — the labeled 3-still new-item board remains
   usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the store says they have
   topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each of those first stills once. Keep no more
than two generation tasks in flight on one connection.

After those first three stills are accepted, remaining named stills
are a new pack. Show a fresh six-field card for that frozen set and
wait:

1. Work — one new-item still per remaining named slot, each a
   generate call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   remaining slot count. Do not reuse a remembered number.
3. Count — one paid call per remaining slot. Do not batch slots into
   one submit.
4. Identity — one new opaque `client_request_id` per slot. A changed
   prompt, fact line, file, model, or canvas mints a new ID for the
   changed slots.
5. If we stop here — the first accepted stills and the remaining
   labeled board remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the store says they have topped up. Do not recommend ¥198.

Do not treat acceptance of the first three stills as approval of the
rest.

A later local correction is new paid work. Read the live `image_edit`
card first:

```json
{"capability": "image_edit"}
```

Show a separate six-field edit card. Use the accepted still as
`images[0]` and a new `client_request_id`.

## Review, deliver, and recover

Review printed lines against the confirmed fact list. Report only the
text the host can actually see. Treat generated small type as a review
item, not as a certified menu, price, or ingredient label.

Deliver the stills in named order, the labeled 3-still board, observed
dimensions and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the store asks.

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
printf '%s' '{"prompt":"Create the approved store new-item still. Print only the confirmed item name and approved lines. Keep the shared pack look.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-store-launch-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For the 3-still board, payloads, confirmation, polling, recovery, and
  review, read [Store new-item workflow](references/workflow.md).
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
