---
name: "product-launch-opening-film"
description: "Turn a named product launch into three visual-tone stills, then one opening film clip for the stage screen. This product launch opening film studio writes a launch event film and product reveal film from the product name, launch message, and visual direction you already have. Use it for a brand launch film, a product launch film, and other stage-screen opening films."
---

# Product Launch Opening Film

Turn a named product launch into three visual-tone stills, then one
opening film clip for the stage screen. The first visible delivery is
a labeled three-frame visual-tone board the brand team can review.

## Scope and adjacent routes

Use this Skill when an enterprise marketing or brand team wants a
stage-screen opening film from a product or event they already named:
a product launch film, a brand launch film, or another launch event
film.

Route a single product still, pack shot, or catalog hero to
`product-photo-studio`. Route a tool demo from an authorized photo to
`tool-demo-clip`. Do not stitch clips. This Skill delivers one 2–15s
film.

## Collect the launch brief

Hard inputs are:

- the product or event name;
- the launch message that may appear;
- the visual direction, or brand references the host can inspect.

Reuse already-known language, palette, duration, and must-keeps. Ask
only for a missing hard input. Do not invent a product claim, logo,
spec, slogan, or date to finish a frame or the film.

Brand references are visual direction. Inspect an accessible file
before describing it. Upload a local file only through the bundled
client. Never pass a local path to a remote tool. A photo is not a
source for an unstated logo or spec.

## Plan the free visual-tone board

Write a labeled three-frame visual-tone board before any paid image.
Record the role of each frame, palette, must-keeps, and language.
Default roles, unless the team names others:

- Frame 1 — hero presence of the named product or event;
- Frame 2 — stage atmosphere and light;
- Frame 3 — the launch-message beat, using only the supplied line.

Keep every must-keep exact. Omit a claim, logo, or spec that was not
supplied and leave that gap on the board. That board is the free
visible result. Planning is not approval.

Safe defaults for the three stills:

- `model: "auto"`.
- `count: 1` per still. Do not batch the three frames into one
  `count`.
- canvas preset `2K` at `16:9` unless the team names another stage
  canvas.

Safe defaults for the later film:

- `model: "auto"` unless the team names a live-eligible model. Never
  silently switch to `auto` after they chose.
- one `beatra.videos.generate` clip. Do not stitch.
- a supported integer duration in the 2–15s range; if they do not
  pick, use 8s.

## Confirm the three stills, then the film

Before any billable still, read the current `beatra.models.list` card
for `text_to_image`. Show one current generate production card that
lists all three stills and wait:

1. Work — three visual-tone stills for the named launch (hero,
   atmosphere, message beat), each a generate call
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times 3. Do
   not reuse a remembered number.
3. Count — three paid calls, one per still. Do not batch the three
   stills into one `count`.
4. Identity — one new opaque `client_request_id` per still. A changed
   prompt, frame role, file, model, or canvas mints a new ID for the
   changed stills.
5. If we stop here — the labeled three-frame visual-tone board
   remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the team says they have
   topped up. Do not recommend ¥198.

Submit each still once through bundled `scripts/mcp_client.py`. Keep
at most two image tasks in flight. Poll `beatra.tasks.get`. Deliver
actual bytes, observed dimensions, and
`billing.net_charged_credits`.

After those stills are accepted, the opening film is new work. Read
the current `beatra.models.list` card for `text_to_video`. Show a
fresh six-field card for one film and wait:

1. Work — one opening film clip for the named launch, a generate
   call (`beatra.videos.generate`).
2. Credits — the live `text_to_video` price just read. Do not reuse a
   remembered number.
3. Count — one paid call for this film. Do not stitch clips. Do not
   fold a later reference-to-video pass into this submit.
4. Identity — one new opaque `client_request_id`. A changed prompt,
   duration, model, or control mints a new ID.
5. If we stop here — the accepted stills and the visual-tone board
   remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the team says they have topped up. Do not recommend ¥198.

Do not treat acceptance of the stills as approval of the film.

An optional later pass that uses the three accepted stills as ordered
image references is a further new card, not folded into generate.
Read the current `beatra.models.list` card for `reference_to_video`
first. Show a fresh six-field card and wait:

1. Work — one opening film clip guided by the three accepted stills
   in board order, a generate call
   (`beatra.videos.generate_from_references`).
2. Credits — the live `reference_to_video` price just read. Do not
   reuse a remembered number.
3. Count — one paid call for this film. Do not stitch clips. Do not
   fold this pass into the earlier generate.
4. Identity — one new opaque `client_request_id`. A changed prompt,
   reference order, duration, model, or control mints a new ID.
5. If we stop here — the accepted stills, the visual-tone board, and
   any accepted generate clip remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the team says they have topped up. Do not recommend ¥198.

## Review, deliver, and recover

Review visible product identity, palette, and on-screen words against
the must-keep list. Report only what the host can actually see. Do
not promise a keynote-length film or a stitched timeline.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the team asks.

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
printf '%s' '{"prompt":"Create the approved visual-tone still for this launch frame. Show only the named product or event and the confirmed must-keeps. Do not add an unstated logo, claim, or spec.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"16:9"},"client_request_id":"opaque-launch-still-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```json
{"capability": "text_to_video"}
```

```text
printf '%s' '{"prompt":"One restrained 16:9 stage-screen opening film for the named launch. Keep the confirmed product identity, palette, and launch message. Do not add unstated logos or claims.","model":"auto","duration":8,"aspect_ratio":"16:9","client_request_id":"opaque-launch-film-01"}' | python3 scripts/mcp_client.py call beatra.videos.generate
```

```json
{"capability": "reference_to_video"}
```

```text
printf '%s' '{"references":[{"kind":"image","media":{"type":"artifact","artifact_id":"art-tone-01"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art-tone-02"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art-tone-03"}}],"prompt":"Use the three accepted visual-tone stills in order as image references for one stage-screen opening film. Keep confirmed identity, palette, and launch message.","model":"auto","duration":8,"aspect_ratio":"16:9","client_request_id":"opaque-launch-refs-01"}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For the visual-tone board, payloads, confirmation, polling,
  recovery, and review, read
  [Product launch opening-film workflow](references/workflow.md).
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
a paid image or video request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
