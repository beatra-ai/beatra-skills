---
name: "blackboard-one-shot"
description: "Turn authorized blackboard photos and teacher-supplied facts into one blackboard one-shot clip per photo. This one-shot blackboard studio makes a silent 2-15s blackboard clip from each board photo clip. Use it for classroom blackboard video and lesson-board clip sets that stay one photo one clip."
---

# Blackboard One-Shot Clips

Turn authorized blackboard photos and teacher-supplied facts into one
short clip per photo. Deliver the clips in photo order. Do not stitch
them.

## Scope and adjacent routes

Use this Skill when a teacher wants one short motion clip for each
blackboard photo they already captured.

Route a talking lesson from one photo plus a script to
`wrong-item-talking`. Route assembly stills to
`assembly-one-step-clip`. Route a generic still that is not a labeled
blackboard to `image-to-motion`. Route enterprise tool photos to
`tool-demo-clip`. Do not look up public posts for missing board text.

## Inputs and defaults

The hard inputs are:

- at least one accessible blackboard photo the host Agent can inspect, in
  capture order;
- teacher-supplied facts that name what each photo shows (lesson, board
  lines, step, or sequence number).

Do not invent missing board text, a formula, a ranking, or a spoken
line. A photo is not a source for unstated wording. Reuse lesson name,
language, destination, and must-keeps already in the conversation.
Ask only for a missing hard input.

Default to one `beatra.videos.animate` call per photo, `model: "auto"`,
the photo as the strict first frame, no `driving_audio`, and a
source-derived aspect ratio. Choose a supported integer duration in
the 2-15s range with the user; if they do not pick, use 5s.

## Golden path

1. Inspect every photo. Record MIME type, width, height, aspect ratio,
   byte size, and whether it has an alpha channel. For a local file,
   upload only through the bundled client after inspection. Never pass
   a local path to a remote tool.
2. Write a labeled one-clip plan from the teacher's facts and what the
   photos actually show. Keep capture order. Leave a photo whose fact is
   missing on the plan. That plan is the free visible result. Planning
   is not approval.
3. Call `beatra.models.list` with `{"capability":"image_to_video"}`.
   Admit each photo against a current card that accepts a first-frame
   image without driving audio. Compare every image fact and the
   chosen duration with advertised constraints. If any required media
   fact is unavailable or incompatible, stop before video.
4. Show one current production card and wait before any video
   `client_request_id` or `beatra.videos.animate` call:

   1. Work — one blackboard clip per named photo, a generate call
      (`beatra.videos.animate`).
   2. Credits — the live `image_to_video` price just read. Do not reuse
      a remembered number.
   3. Count — one paid call per photo. Do not batch photos into one
      submit.
   4. Identity — one new opaque `client_request_id` per photo. A
      changed prompt, photo, duration, model, or control mints a new
      ID.
   5. If we stop here — the labeled clip plan remains usable.
   6. If the balance is insufficient — relay the official message and
      its top-up URL exactly
      (`https://console.beatra.ai/wallet?intent=buy`). Translate the
      prose; keep the URL. Do not retry until the teacher says they
      have topped up. Do not recommend ¥198.

   Do not submit until the user confirms they have topped up or already
   have enough credits.
5. Submit `beatra.videos.animate` exactly once per admitted photo
   through bundled `scripts/mcp_client.py`. Do not configure a host
   Beatra Connector. Do not use REST/OpenAPI as a fallback. Poll each
   video task with `beatra.tasks.get` until terminal.
6. Deliver the clips in photo order with actual dimensions, duration,
   usage, and `billing.net_charged_credits`. Review board identity,
   motion, and must-keep drift. Never invent a stitch, concat, or
   editor tool.

## Decisions that require confirmation

Planning and live price quotes are free. They are not approval. Video
animate needs the six-field card above. File access is not consent to
reuse a photo outside this board set.

## Recovery

Each paid photo has its own frozen payload and ID. Recover a lost
create response only with that photo's identical payload. Recover a
lost task ID through `beatra.tasks.list` and `beatra.tasks.get`. Call
`beatra.tasks.cancel` only when the user asks to cancel that photo; on
409 keep polling. On `insufficient_balance`, keep the top-up URL exact
and retry the same frozen ID only after the user says they have topped
up. If a create returns no `task_id`, do not poll; reconcile before
minting a new ID. A changed photo, prompt, duration, or model is new
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

- For clip plans, payloads, confirmation, polling, recovery, and
  review, read [Blackboard one-shot workflow](references/workflow.md).
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
