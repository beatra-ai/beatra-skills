---
name: "tiktok-creator-to-brief-stills"
description: "Turn a TikTok creator homepage and recent posts into a collaboration brief still set. This TikTok creator brief studio reads the public profile and recent works, then lays out each already-written collab term as its own creator homepage brief card. Media buyers use it for TikTok creator briefs, collaboration brief stills, and a brief still pack they can hand off one file at a time."
---

# TikTok Creator Brief Stills

Turn a TikTok creator homepage and recent posts into one collaboration
brief still per chosen term. Deliver 4 to 8 stills.

## Scope and adjacent routes

Use this Skill when a media buyer already chose one TikTok creator
and wants collaboration brief stills from that homepage and recent
works, plus collab terms they already wrote.

Route a shortlist of who to approach to `influencer-fit-analyzer`.
Route an account diagnosis and first post to
`creator-account-teardown`. Route a talking clip out of this package.

This package reads one TikTok profile and one page of posts and
makes brief stills. It does not post on TikTok. If this connection
has no TikTok user or posts operation, work from pasted lines only.

## Collect the creator and the terms

Hard inputs are:

- a public TikTok profile URL or `@handle`, or the homepage facts
  and recent works already copied;
- already-written collab terms the cards may print (product,
  deliverable, fee or barter, deadline, must-keeps);
- how many cards the pack should contain, or permission to use the
  default of 6.

Reuse already-known brand palette and destination. Ask only for a
missing hard input. A count outside 4 to 8 is still doable: confirm
that pack size and its live cost.

Do not invent a handle, follower count, play count, or collab term.
An optional brand still is a look reference, not a source for
missing terms. File access is not consent.

Inspect every still the user supplies. Record MIME type, width,
height, aspect ratio, byte size, and whether it has an alpha channel.
For a local file, upload only through the bundled client after
inspection (`scripts/mcp_client.py` / `beatra.assets.upload`). Keep
the returned artifact id. Never pass a local path to
`beatra.images.generate`, `beatra.images.transform`, or
`beatra.images.edit`.

## Plan the free memo and still list

Write a labeled lookup memo and still list before any paid lookup
or image. Default six slots unless the user names another count in
4 to 8. Each slot records the creator fact it uses (looked up or
pasted), the printed collab term from operator-supplied copy,
layout, canvas, and whether a brand still drives the look.

That list is the free visible result from whatever the user already
pasted. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per slot;
- `model: "auto"` unless the user chose a live SKU;
- `count` 1 per slot;
- square 2K unless the user named another destination ratio.

## Look up the profile on its own card

A profile URL or handle does not authorize a lookup. When the user
wants this connection to read the public TikTok homepage or recent
works, follow [creator lookup](references/creator-lookup.md): search
or inspect, then show a six-field lookup card and wait:

1. Work — one public TikTok user search, profile read, or posts
   page for the named creator (`beatra.social.execute` with the
   inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just returned.
   Quote that live number, not a remembered one.
3. Count — one prepaid lookup. A user search is its own billed
   execute. The profile read is another. The posts page is another.
   The next page is another charge.
4. Identity — one new opaque `client_request_id` per execute.
5. If we stop here — the pasted-homepage plan remains usable.
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

1. Work — one collaboration brief still per named slot
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times the
   slot count. Do not reuse a remembered number.
3. Count — one paid generate call per slot. Do not batch several
   terms into one `count`.
4. Identity — one new opaque `client_request_id` per slot.
5. If we stop here — the labeled still list remains usable.
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

Review that each still prints the picked creator fact and only the
operator-supplied collab term. Report only the text the host can
actually see. Treat generated small type as a review item, not as a
certified offer. After each terminal paid task, deliver actual bytes
plus MIME, dimensions, and size when present, and
`billing.net_charged_credits`. Do not promise the prepaid estimate
is the final charge.

After a returned `task_id`, poll that task. If the create response
is lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed creator fact, collab term,
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
printf '%s' '{"query":"creator","platform":"tiktok","capability_family":"creator"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

```text
printf '%s' '{"prompt":"Create the approved collaboration brief still for the named creator term. Print only the operator-supplied collab line.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-tiktok-brief-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For still lists, lookup, payloads, and recovery, read
  [brief still workflow](references/workflow.md) and
  [creator lookup](references/creator-lookup.md).
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
