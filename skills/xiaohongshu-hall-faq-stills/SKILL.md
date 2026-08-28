---
name: "xiaohongshu-hall-faq-stills"
description: "Turn Xiaohongshu hall FAQ complaints into a 4 to 8 still materials set. This hall FAQ still studio reads public hall FAQ notes and complaints, then lays out a materials still pack from confirmed document facts. Use it for hall materials graphics, a Xiaohongshu hall FAQ still, and a document checklist set."
---

# Xiaohongshu Hall FAQ Stills

Turn Xiaohongshu hall FAQ complaints into one materials still per
picked complaint. Deliver 4 to 8 stills.

## Scope and adjacent routes

Use this Skill when a hall or public-service team wants materials
stills that answer public Xiaohongshu hall-faq complaints from
document facts they already confirmed.

Route a research memo to `xiaohongshu-note-research`. Route Douyin
comment FAQ stills to `douyin-video-comments-to-faq`. Route talking
policy reads to `policy-digest-set` when that package is installed.

This package reads Xiaohongshu hall-faq notes and comments and
makes materials stills. It does not post a note on Xiaohongshu.
If this connection has no Xiaohongshu note or comment operation,
work from pasted lines only.

## Collect the complaints

Hard inputs are:

- the named hall service being explained;
- either a public Xiaohongshu note link or search wording the host
  can open, or the original hall-faq complaints already copied;
- confirmed official materials or document facts the cards may
  print;
- how many cards the pack should contain, or permission to use the
  default of 4.

Reuse already-known hall names, brand palette, and destination.
Ask only for a missing hard input. A count outside 4 to 8 is still
doable: confirm that pack size and its live cost.

Do not invent a complaint, username, like count, document, or
materials line. An optional brand still is a look reference, not a
source for missing documents. File access is not consent.

Inspect every still the user supplies. Record MIME type, width,
height, aspect ratio, byte size, and whether it has an alpha channel.
For a local file, upload only through the bundled client after
inspection (`scripts/mcp_client.py` / `beatra.assets.upload`). Keep
the returned artifact id. Never pass a local path to
`beatra.images.generate`, `beatra.images.transform`, or
`beatra.images.edit`.

## Plan the free slot list

Write a labeled complaint-to-materials list before any paid lookup
or image. Default four slots unless the user names another count in
4 to 8. Each slot records the original complaint wording, the
printed materials line from confirmed facts, layout (complaint,
materials line, optional footer), canvas, and whether a brand still
drives the look.

That list is the free visible result from whatever the user already
pasted. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per slot;
- `model: "auto"` unless the user chose a live SKU;
- `count` 1 per slot;
- square 2K unless the user named another destination ratio.

## Look up notes on their own card

A note link or search wording does not authorize a lookup. When the
user wants this connection to read public Xiaohongshu hall-faq
notes or comments, follow
[hall FAQ lookup](references/hall-faq-lookup.md): search, inspect,
then show a six-field lookup card and wait:

1. Work — one public Xiaohongshu note search, note read, or comment
   page for the named hall FAQ (`beatra.social.execute` with the
   inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just returned.
   Quote that live number, not a remembered one.
3. Count — one prepaid lookup. A note search is its own billed
   execute. An image-note or video-note read is another. The comment
   page is another. The next page is another charge.
4. Identity — one new opaque `client_request_id` per execute.
5. If we stop here — the pasted-complaint plan remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the user says they have
   topped up. Do not recommend ¥198.

Do not show `schema_hash` to the user. A confirmed lookup does not
authorize image work. After a terminal lookup, report the payload,
task ID, terminal status, and `billing.net_charged_credits`. A
lookup has no model, dimensions, or duration to report.

## Confirm generate, then optional transform or edit

Lookup and image work are separate paid stages. Each stage gets
its own six-field card and its own opaque `client_request_id` per
slot.

Before generate, call `beatra.models.list` for `text_to_image`:

```json
{"capability": "text_to_image"}
```

Show the generate card and wait:

1. Work — one materials still per named slot
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   slot count. Do not reuse a remembered number.
3. Count — one paid generate call per slot. Do not batch several
   complaints into one `count`.
4. Identity — one new opaque `client_request_id` per slot.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the user says they have
   topped up. Do not recommend ¥198.

Submit each generate slot once through bundled
`scripts/mcp_client.py`. Poll `beatra.tasks.get`. Read actual image
MIME, dimensions, and size, and `billing.net_charged_credits`.

If the user wants the accepted cards to follow a brand still,
read the live `image_to_image` card and wait on a separate
transform card before `beatra.images.transform`:

```json
{"capability": "image_to_image"}
```

Use `beatra.images.edit` only after the user accepts a card and
asks for a local correction, with that accepted image as
`images[0]`. Read the live `image_edit` card first:

```json
{"capability": "image_edit"}
```

Approved generate does not authorize transform or edit.

## Review, deliver, and recover

Review that each still prints the picked complaint and only the
confirmed materials line. Report only the text the host can actually
see. Treat generated small type as a review item, not as a certified
hall notice. After each terminal paid task, deliver actual bytes
plus MIME, dimensions, and size when present, and
`billing.net_charged_credits`. Do not promise the prepaid estimate
is the final charge.

After a returned `task_id`, poll that task. If the create response
is lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed complaint, materials line,
still, model, or canvas is a new card and a new ID. Cancel only
when the user asks.

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
{"capability": "image_to_image"}
```

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_edit"}
```

```text
printf '%s' '{"query":"notes","platform":"xiaohongshu","capability_family":"content"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

```text
printf '%s' '{"prompt":"Create the approved materials still for the named hall FAQ complaint. Print only the confirmed materials line.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-hall-faq-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For slot lists, lookup, payloads, and recovery, read
  [hall FAQ still workflow](references/workflow.md) and
  [hall FAQ lookup](references/hall-faq-lookup.md).
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
a paid lookup, generate, transform, or edit request. The setting persists
for this installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
