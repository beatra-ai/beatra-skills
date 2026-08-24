---
name: "procurement-rfp-cover"
description: "Turn seller-supplied tender facts into one RFP cover still per project. This tender cover studio lays out the seller-supplied project title and agency lines as a bidding-document cover and RFP cover graphic. Use it for tender document covers, bid-file covers, and RFP cover stills."
---

# RFP Cover Stills

Make one RFP cover still per project from facts the seller
already wrote. Deliver 4 to 8 stills. Keep each still as its own file.

## Scope and adjacent routes

Use this Skill when a seller wants short tender-cover listing stills
from a written project note and named projects.

Route origin-story listing stills to `origin-story-module`. Route
nutrition-panel stills to `nutrition-panel-art`. Route Amazon
selling-point A+ stills to `amazon-a-plus-module-pack`. Route a full
listing gallery to `ecommerce-listing-image-set`. Do not look up
public posts for a missing agency name.

## Collect confirmed facts

Hard inputs are:

- at least one named project;
- the tender facts the seller already wrote (project title, agency
  lines, and any deadline they supplied);
- how many stills the pack should contain, or permission to use the
  default of 4.

Reuse brand palette, destination, language, and must-keeps already in
the conversation. Ask only for a missing hard input. A count outside
4 to 8 is still doable: confirm that pack size and its live cost.

Do not invent a tender number, agency, bid-opening date, official
seal, or face. A letterhead photo is a visual reference, not a source
for missing tender facts. File access is not consent.

Inspect every optional still. Record MIME type, width, height, aspect
ratio, byte size, and whether it has an alpha channel. For a local
file, upload only through the bundled client after inspection
(`scripts/mcp_client.py` / `beatra.assets.upload`). Keep the returned
artifact id. Never pass a local path to `beatra.images.generate` or
`beatra.images.edit`.

## Plan the free card list

Write a labeled cover list before any paid image. Default four
projects unless the seller names another count in 4 to 8. Each item
records the project, the printed tender lines from the written note,
language, layout, canvas, and any optional reference role.

That list is the free visible result. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per project;
- `model: "auto"` and `count: 1`;
- canvas `{"type":"preset","tier":"2K","aspect":"1:1"}` unless the
  seller named another destination;
- `beatra.images.edit` only after the seller accepts a card and asks
  for a local correction, with that accepted image as `images[0]`.

## Confirm once, create by project

Planning is free. Before the first billable call, read
`beatra.models.list` for `text_to_image`:

```json
{"capability": "text_to_image"}
```

Show one current production card and wait:

1. Work — one RFP cover still per named project
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   project count. Do not reuse a remembered number.
3. Count — one paid call per project card. Do not batch several
   projects into one `count`.
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

After approval, submit each project once. Keep no more than two
generation tasks in flight on one connection.

A later local correction is new paid work. Read the live `image_edit`
card first. Show a separate six-field edit card. Use a new
`client_request_id`.

## Review, deliver, and recover

Review printed lines against the confirmed project note. Report
only the text the host can actually see. Treat generated small type
as a review item, not as a certified tender claim.

Deliver the stills in project order, the card list, observed
dimensions and formats, task IDs, resolved models, and returned
`billing.net_charged_credits`.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with `beatra.tasks.get`
before replay. Reuse an ID only with
byte-identical arguments. A changed project, tender line, canvas,
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
printf '%s' '{"prompt":"Create the approved RFP cover still for the named project. Print only the confirmed tender lines.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-procurement-project-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For fact lists, payloads, confirmation, polling, recovery, and review,
  read [RFP cover workflow](references/workflow.md).
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
