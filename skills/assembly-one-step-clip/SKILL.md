---
name: "assembly-one-step-clip"
description: "Turn authorized stills and seller-supplied step facts into one assembly step video per still. This one-step clip studio turns each still into a product assembly clip. Use it for furniture assembly video and how-to step clip work that stays one photo one clip."
---

# Assembly One-Step Clips

Turn authorized assembly stills and seller-supplied step facts into one
short clip per step. Deliver the clips in step order. Do not stitch
them.

## Scope and adjacent routes

Use this Skill when a seller or listing team wants one short motion
clip for each assembly step they already photographed.

Route a talking product demo from one photo plus a script to
`product-video-studio`. Route listing room stills to
`listing-room-video-pack`. Route a generic still that is not an
assembly step to `image-to-motion`. Do not look up public posts for
missing steps.

## Inputs and defaults

The hard inputs are:

- at least one accessible still the host Agent can inspect, in step
  order;
- seller-supplied step facts that name what each still shows (part,
  action, or sequence number).

Do not invent a missing step, torque spec, tool list, or warning. A
still is not a source for unstated instructions. Reuse SKU name,
language, destination, and must-keeps already in the conversation.
Ask only for a missing hard input.

Default to one `beatra.videos.animate` call per still, `model: "auto"`,
the still as the strict first frame, no `driving_audio`, and a
source-derived aspect ratio. Choose a supported integer duration in
the 2–15s range with the user; if they do not pick, use 5s.

## Golden path

1. Inspect every still. Record MIME type, width, height, aspect ratio,
   byte size, and whether it has an alpha channel. For a local file,
   upload only through the bundled client after inspection. Never pass
   a local path to a remote tool.
2. Write a labeled one-step plan from the seller's facts and what the
   stills actually show. Keep step order. Leave a still whose fact is
   missing on the plan. That plan is the free visible result. Planning
   is not approval.
3. Call `beatra.models.list` with `{"capability":"image_to_video"}`.
   Admit each still against a current card that accepts a first-frame
   image without driving audio. Compare every image fact and the
   chosen duration with advertised constraints. If any required media
   fact is unavailable or incompatible, stop before video.
4. Show one current production card and wait before any video
   `client_request_id` or `beatra.videos.animate` call:

   1. Work — one assembly-step clip per named still, a generate call
      (`beatra.videos.animate`).
   2. Credits — the live `image_to_video` price just read. Do not reuse
      a remembered number.
   3. Count — one paid call per still. Do not batch steps into one
      submit.
   4. Identity — one new opaque `client_request_id` per still. A
      changed prompt, still, duration, model, or control mints a new
      ID.
   5. If we stop here — the labeled step plan remains usable.
   6. If the balance is insufficient — relay the official message and
      its top-up URL exactly
      (`https://console.beatra.ai/wallet?intent=buy`). Translate the
      prose; keep the URL. Do not retry until the seller says they
      have topped up. Do not recommend ¥198.

   Do not submit until the user confirms they have topped up or already
   have enough credits.
5. Submit `beatra.videos.animate` exactly once per admitted still
   through bundled `scripts/mcp_client.py`. Do not configure a host
   Beatra Connector. Do not use REST/OpenAPI as a fallback. Poll each
   video task with `beatra.tasks.get` until terminal.
6. Deliver the clips in step order with actual dimensions, duration,
   usage, and `billing.net_charged_credits`. Review step identity,
   motion, and must-keep drift. Never invent a stitch, concat, or
   editor tool.

## Decisions that require confirmation

Planning and live price quotes are free. They are not approval. Video
animate needs the six-field card above. File access is not consent to
reuse a still outside this step set.

## Recovery

Each paid still has its own frozen payload and ID. Recover a lost
create response only with that still's identical payload. Recover a
lost task ID through `beatra.tasks.list` and `beatra.tasks.get`. Call
`beatra.tasks.cancel` only when the user asks to cancel that still; on
409 keep polling. On `insufficient_balance`, keep the top-up URL exact
and retry the same frozen ID only after the user says they have topped
up. If a create returns no `task_id`, do not poll; reconcile before
minting a new ID. A changed still, prompt, duration, or model is new
work and a new card.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For step plans, payloads, confirmation, polling, recovery, and
  review, read [Assembly one-step workflow](references/workflow.md).
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
a paid video request. The setting persists for this installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
