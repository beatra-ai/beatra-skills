---
name: "instagram-reel-to-pdp-clip"
description: "Instagram product video is one product detail video per product still after reading a competitor Reel. Use this Instagram PDP clip studio for a product page video and a Reel-to-PDP clip from the same still list."
---

# Instagram Product Videos

Turn product stills the seller already photographed into one
product-detail clip per still. Read a competitor Instagram Reel
for composition when the seller gives a link or account. Deliver
each clip as its own file.

## Scope and adjacent routes

Use this Skill when a seller wants one short product-detail clip
from each product still, after reading a competitor Reel or
working from composition notes they already wrote.

Route a stills-only PDP set to `instagram-reel-to-pdp-set` when
that package is the job. Route hotel amenity stills to
`hotel-amenity-clip`. Route assembly steps to
`assembly-one-step-clip`. Route a generic still that is not a
product-detail clip to `image-to-motion`.

This package reads public Instagram Reels and makes silent
product clips. It does not post to Instagram.

## Collect the product stills

Hard inputs are:

- at least one inspectable product still the host Agent can open;
- the SKU or product name for each still;
- either a public Instagram Reel URL, a competitor username, or
  composition notes already written;
- a duration in the 2–15s range, or permission to use 5s.

Reuse already-known language, aspect, and must-keeps. Ask only
for a missing hard input.

Do not invent a composition move, caption, view count, or SKU
the seller did not supply. File access is not consent to reuse a
still outside this product set.

If a still exists and its product name is empty, stop and collect
the name. Written composition notes skip lookup.

## Plan the free shot list

Write a labeled product-clip list before any paid lookup or
animate. One slot per still. Each slot records the product name
from the seller, the inspected still facts, the confirmed Reel
composition or written notes, and the chosen duration.

That list is the free visible result. Planning is not approval.

Safe defaults:

- one `beatra.videos.animate` call per still;
- `model: "auto"`;
- the still as the first frame;
- no `driving_audio`;
- a source-derived aspect ratio;
- duration 5s unless the seller names another supported integer
  in 2–15.

Inspect each still. Record MIME type, width, height, aspect
ratio, byte size, and whether it has an alpha channel. For a
local file, upload only through the bundled client after
inspection (`scripts/mcp_client.py` / `beatra.assets.upload`).
Keep the returned artifact id. Never pass a local path to
`beatra.videos.animate`.

## Look up Reels on their own card

A username or Reel URL does not authorize a lookup. When the
seller wants this connection to read a public Instagram Reel or
account, follow [Reel lookup](references/reel-lookup.md): search,
inspect, then show a six-field lookup card and wait:

1. Work — one public Instagram Reel or account page
   (`beatra.social.execute` with the inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just
   returned. Quote that live number, not a remembered one.
3. Count — one prepaid lookup. The next Reels page is another
   charge.
4. Identity — one new opaque `client_request_id` per execute.
5. If we stop here — the labeled shot list remains usable.
6. If the balance is insufficient — relay the official message
   and its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they
   have topped up. Do not recommend ¥198.

Do not show `schema_hash` to the seller. A confirmed lookup does
not authorize video. After a terminal lookup, report the payload,
task ID, terminal status, and `billing.net_charged_credits`. A
lookup has no model, dimensions, or duration to report.

## Confirm animate

Before video, call `beatra.models.list` for `image_to_video`:

```json
{"capability": "image_to_video"}
```

Admit each still against a current card that accepts a first-frame
image without driving audio. Compare every image fact and the
chosen duration with advertised constraints. If any required
media fact is unavailable or incompatible, stop before video.

Show one current production card and wait before any video
`client_request_id` or `beatra.videos.animate` call:

1. Work — one product-detail clip per named still
   (`beatra.videos.animate`).
2. Credits — the live `image_to_video` price just read. Do not
   reuse a remembered number.
3. Count — one paid call per still.
4. Identity — one new opaque `client_request_id` per still.
5. If we stop here — the labeled shot list remains usable.
6. If the balance is insufficient — relay the official message
   and its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they
   have topped up. Do not recommend ¥198.

Submit each still once through bundled `scripts/mcp_client.py`.
Poll `beatra.tasks.get`. Read actual video MIME, duration, size,
and `billing.net_charged_credits`. Do not promise the prepaid
estimate is the final charge. A storyboard preview is not the
clip review.

## Deliver and recover

Check that every clip keeps the product shown in that still.
Report only what the host can actually see.

After a returned `task_id`, poll that task. If the create
response is lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed still, prompt, duration, or
model is a new card and a new ID. Cancel only when the seller
asks.

## Execution

Invoke every remote Beatra operation only through this package's
bundled `scripts/mcp_client.py`. Put the MCP tool name after
`call` and send one JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"<the uploaded product still>"},"prompt":"<the written product name and confirmed Reel composition for this still>","duration":5,"client_request_id":"opaque-pdp-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For shot lists, payloads, and recovery, read
  [Product-detail clip workflow](references/workflow.md).
- For Instagram Reel lookup, read
  [Reel lookup](references/reel-lookup.md).
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
a paid video request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
