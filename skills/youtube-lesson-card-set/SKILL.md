---
name: "youtube-lesson-card-set"
description: "Turn public YouTube lesson captions into a set of 4 to 8 takeaway cards. This lesson card studio reads the lesson captions, pulls the key points, and lays out one card per point for lessons and tutorial videos."
---

# YouTube Lesson Card Set

Turn YouTube lesson captions into one knowledge-point still per
picked caption point. Deliver 4 to 8 stills.

## Scope and adjacent routes

Use this Skill when a school teacher wants knowledge-point
stills that print points from public YouTube lesson captions.

Route a spoken remake script to `youtube-caption-studio`. Route a
YouTube cover to `youtube-thumbnail-maker`. Route L&D training-caption
handout stills to `youtube-train-caption-cards` when that package is
installed.

This package reads YouTube lesson captions and makes knowledge-point
stills. It does not post a video on YouTube. If this connection has
no YouTube search or caption operation, work from pasted lines only.

## Collect the captions

Hard inputs are:

- the named school lesson being turned into knowledge-point cards;
- either a public YouTube video link or search wording the host
  can open, or the original lesson captions already copied;
- how many cards the pack should contain, or permission to use the
  default of 4.

Reuse already-known lesson names, brand palette, and destination.
Ask only for a missing hard input. A count outside 4 to 8 is still
doable: confirm that pack size and its live cost.

Do not invent a caption line, video title, view count, or extra
curriculum point. An optional brand still is a look reference, not
a source for missing spoken lines. File access is not consent.

Inspect every still the user supplies. Record MIME type, width,
height, aspect ratio, byte size, and whether it has an alpha channel.
For a local file, upload only through the bundled client after
inspection (`scripts/mcp_client.py` / `beatra.assets.upload`). Keep
the returned artifact id. Never pass a local path to
`beatra.images.generate`, `beatra.images.transform`, or
`beatra.images.edit`.

## Plan the free slot list

Write a labeled caption-to-knowledge-point list before any paid lookup
or image. Default four slots unless the user names another count in
4 to 8. Each slot records the original caption wording, the
printed knowledge-point line taken from those captions, layout (caption
point, knowledge-point line, optional footer), canvas, and whether a brand
still drives the look.

That list is the free visible result from whatever the user already
pasted. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per slot;
- `model: "auto"` unless the user chose a live SKU;
- `count` 1 per slot;
- square 2K unless the user named another destination ratio.

## Look up captions on their own card

A video link or search wording does not authorize a lookup. When the
user wants this connection to read public YouTube lesson
captions, follow
[lesson caption lookup](references/caption-lookup.md): search,
inspect, then show a six-field lookup card and wait:

1. Work — one public YouTube video search or caption read for the
   named school lesson (`beatra.social.execute` with the
   inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just returned.
   Quote that live number, not a remembered one.
3. Count — one prepaid lookup. A video search is its own billed
   execute. A caption read is another. A language-list caption
   read followed by a language fetch is another. The next search
   page is another charge.
4. Identity — one new opaque `client_request_id` per execute.
5. If we stop here — the pasted-caption plan remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly. Translate the prose; keep the URL. Do
   not retry until the user says they have topped up.

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

1. Work — one knowledge-point still per named slot
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   slot count. Do not reuse a remembered number.
3. Count — one paid generate call per slot. Do not batch several
   caption points into one `count`.
4. Identity — one new opaque `client_request_id` per slot.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly. Translate the prose; keep the URL. Do
   not retry until the user says they have topped up.

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

Review that each still prints the picked caption point and only the
caption-backed knowledge-point line. Report only the text the host can
actually see. Treat generated small type as a review item, not as a
certified lesson certificate. After each terminal paid task, deliver
actual bytes plus MIME, dimensions, and size when present, and
`billing.net_charged_credits`. Do not promise the prepaid estimate
is the final charge.

After a returned `task_id`, poll that task. If the create response
is lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed caption, knowledge-point line,
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
printf '%s' '{"query":"captions","platform":"youtube","capability_family":"captions"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

```text
printf '%s' '{"prompt":"Create the approved knowledge-point still for the named caption point. Print only the caption-backed knowledge-point line.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-lesson-caption-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- For slot lists, lookup, payloads, and recovery, read
  [lesson knowledge-point workflow](references/workflow.md) and
  [lesson caption lookup](references/caption-lookup.md).
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
