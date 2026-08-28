---
name: "wedding-opening-film"
description: "Turn couple-supplied ceremony facts into three wedding opening film storyboard keyframes, then one opening film. This wedding opening film studio lays out a couple storyboard and a ceremony opening clip from the facts you already have. Use it for photo-studio wedding openers, wedding-planner opening films, and couple storyboard keyframes."
---

# Wedding Opening Film

Turn couple-supplied ceremony facts into three labeled storyboard
keyframes, then one opening film. The first delivery is those three
stills. The conversion is one 2–15s clip. Do not stitch.

## Scope and adjacent routes

Use this Skill when a photo studio or wedding planner wants a wedding
opening film from facts they already have: a couple storyboard, a
ceremony opening clip, or a planner opener for the start of the event.

Route a product-launch opener to `product-launch-opening-film`. Route a
script storyboard that is not a wedding opener to
`ai-storyboard-generator`. Route generic video that is not this
opener to `beatra-ai-video-studio`. Route a score that is not this
film to `music-generation-studio`.

## Collect the ceremony facts

Hard inputs are:

- visual direction the studio already has (mood, palette, ceremony
  type, language);
- three named storyboard moments for the opener.

Reuse already-known direction. Ask only for a missing hard input. Do
not invent a name, date, or venue to finish a frame or a clip. A
supplied photo is a later reference, not a source for missing
identity, and it does not replace the three generated keyframes.

A longer ceremony brief is welcome. The first paid work is still
three keyframes. The opening film waits until those stills are
accepted.

## Plan the free storyboard

Write a labeled three-keyframe sheet before any paid image: beat
names, must-keep facts mapped to frames, mood, palette, language, and
16:9 2K canvas. Keep every supplied name, date, and venue exact. Leave
a missing identity fact as a named gap. That sheet is the free
visible result. Planning is not approval.

Safe defaults:

- `model: "auto"` unless the user chose a live-eligible image model.
- `count: 1` per keyframe. Do not batch frames into one `count`.
- `canvas: {"type":"preset","tier":"2K","aspect":"16:9"}`.

## Confirm the three stills, then the film

Before any billable still, read the current `beatra.models.list` card
for `text_to_image`. Show one current generate production card for the
three keyframes and wait:

1. Work — three wedding-opener storyboard keyframes, each a generate
   call (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read, times three.
   Do not reuse a remembered number.
3. Count — one paid call per named keyframe. Do not batch frames into
   one submit.
4. Identity — one new opaque `client_request_id` per keyframe. A
   changed prompt, fact, file, model, or canvas mints a new ID.
5. If we stop here — the labeled three-keyframe sheet remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the studio says they have
   topped up. Do not recommend ¥198.

Submit each still once through bundled `scripts/mcp_client.py`. Keep
at most two generate tasks in flight. Poll `beatra.tasks.get`.
Deliver actual bytes, actual dimensions, and
`billing.net_charged_credits`.

After those three stills are accepted, the opening film is a new
pack. Read the current `beatra.models.list` card for `text_to_video`.
Show a fresh six-field card for one `beatra.videos.generate` call and
wait:

1. Work — one wedding opening film, a generate call
   (`beatra.videos.generate`).
2. Credits — the live `text_to_video` price just read. Do not reuse a
   remembered number.
3. Count — one paid call for one clip. Do not batch stills into one
   submit. Do not stitch, concat, or interpolate the three stills.
4. Identity — one new opaque `client_request_id`. A changed prompt,
   duration, model, or control mints a new ID.
5. If we stop here — the three accepted stills remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the studio says they have topped up. Do not recommend ¥198.

Keep `model: "auto"` unless the user chose a live-eligible video
model. Choose a supported integer duration in the 2–15s range; if they
do not pick, use 8s. One clip. No stitch.

Do not treat acceptance of the stills as approval of the film.

An optional later clip that uses the three accepted stills as ordered
image references is another new pack. Read
`{"capability":"reference_to_video"}`, show a fresh six-field card for
one `beatra.videos.generate_from_references` call, and wait. Do not
reuse the stills card or the text-to-video card. Do not stitch.

## Review, deliver, and recover

Review visible identity against the must-keep list. Report an invented
name, date, or venue as drift. Report unread small type as unread. Do
not promise exact seconds.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the studio asks.

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

```json
{"capability": "text_to_video"}
```

```json
{"capability": "reference_to_video"}
```

```text
printf '%s' '{"prompt":"Create approved storyboard keyframe 01 of 03 for this wedding opening film. Use only the confirmed ceremony facts. Do not invent a name, date, or venue.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"16:9"},"client_request_id":"opaque-wedding-still-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{"prompt":"One wedding opening film from the approved three-keyframe storyboard. Keep confirmed ceremony facts. Do not invent a name, date, or venue.","model":"auto","duration":8,"client_request_id":"opaque-wedding-film-01"}' | python3 scripts/mcp_client.py call beatra.videos.generate
```

```text
printf '%s' '{"references":[{"kind":"image","media":{"type":"artifact","artifact_id":"art-wedding-still-01"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art-wedding-still-02"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art-wedding-still-03"}}],"prompt":"One wedding opening film guided by these three approved storyboard stills. Keep confirmed ceremony facts. Do not invent a name, date, or venue.","model":"auto","duration":8,"client_request_id":"opaque-wedding-refs-01"}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For storyboard sheets, payloads, and recovery, read
  [Wedding opening workflow](references/workflow.md).
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
