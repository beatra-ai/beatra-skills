---
name: "real-estate-listing-set"
description: "Turn seller-supplied floor-plan facts into one listing still per room. This listing still studio lays out the seller-supplied room names and layout lines as a listing still and property-page graphic. Use it for listing still sets, room listing stills, and property-page listing cards."
---

# Listing Still Sets

Make one listing still per room from facts the seller already
wrote. Deliver 4 to 8 stills. Keep each still as its own file.

## Scope and adjacent routes

Use this Skill when a seller wants short listing stills from a
written floor-plan note and named rooms.

Route a talking listing-room video to `listing-room-video-pack`.
Route an office-floor clip to `office-floor-tour`. Route a product
listing gallery to `ecommerce-listing-image-set`. Do not look up
public posts for a missing address.

## Collect confirmed facts

Hard inputs are:

- at least one named listing;
- the floor-plan facts the seller already wrote (room names, layout
  lines, and any area they supplied);
- how many stills the pack should contain, or permission to use the
  default of 4.

Reuse brand palette, destination, language, and must-keeps already in
the conversation. Ask only for a missing hard input. A count outside
4 to 8 is still doable: confirm that pack size and its live cost.

Do not invent an address, price, area, school district, or face. A
room photo is a visual reference, not a source for missing listing
facts. File access is not consent.

Inspect every optional still. Record MIME type, width, height, aspect
ratio, byte size, and whether it has an alpha channel. For a local
file, upload only through the bundled client after inspection
(`scripts/mcp_client.py` / `beatra.assets.upload`). Keep the returned
artifact id. Never pass a local path to `beatra.images.generate` or
`beatra.images.edit`.

## Plan the free card list

Write a labeled listing-still list before any paid image. Default
four rooms unless the seller names another count in 4 to 8. Each item
records the room, the printed layout lines from the written note,
language, layout, canvas, and any optional reference role.

That list is the free visible result. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per room;
- `model: "auto"` and `count: 1`;
- canvas `{"type":"preset","tier":"2K","aspect":"1:1"}` unless the
  seller named another destination;
- `beatra.images.edit` only after the seller accepts a card and asks
  for a local correction, with that accepted image as `images[0]`.

## Confirm once, create by room

Planning is free. Before the first billable call, read
`beatra.models.list` for `text_to_image`:

```json
{"capability": "text_to_image"}
```

Show one current production card and wait:

1. Work — one listing still per named room
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   room count. Do not reuse a remembered number.
3. Count — one paid call per room card. Do not batch several
   rooms into one `count`.
4. Identity — one new opaque `client_request_id` per card.
5. If we stop here — the labeled card list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

After approval, submit each room once. Keep no more than two
generation tasks in flight on one connection.

A later local correction is new paid work. Read the live `image_edit`
card first. Show a separate six-field edit card. Use a new
`client_request_id`.

## Review, deliver, and recover

Review printed lines against the confirmed floor-plan note. Report
only the text the host can actually see. Treat generated small type
as a review item, not as a certified listing claim.

Deliver the stills in room order, the card list, observed
dimensions and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with `beatra.tasks.get`
before replay. Reuse an ID only with
byte-identical arguments. A changed room, layout line, canvas,
model, or prompt is a new card and a new ID. Cancel only when the
seller asks.

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
printf '%s' '{"prompt":"Create the approved listing still for the named room. Print only the confirmed layout lines.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-listing-room-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For fact lists, payloads, confirmation, polling, recovery, and review,
  read [Listing still workflow](references/workflow.md).
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
