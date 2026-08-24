---
name: "restock-drop-talking"
description: "Turn seller-supplied restock facts and an already-written restock script into one talking clip per still. This restock talking studio turns each authorized still into a 2 to 15s restock talking clip from the written line. Use it for restock talking videos, restock announcement talks, and restock drop talking clips."
---

# Restock Talking Clips

Turn already-written restock facts, a restock script, and authorized
stills into one talking clip per still. Deliver 2 to 8 clips. Keep
each clip as its own file.

## Scope and adjacent routes

Use this Skill when a seller wants short talking clips that announce
a restock from stills they can authorize.

Route a first-drop launch talk to `creator-drop-talking`. Route a
generic presenter that is not a restock to `talking-avatar-video`.
Route silent product motion to `product-video-studio`. Route a
listing walk-in talk to `rental-walkin-avatar`.

## Collect the restock pack

Hard inputs are:

- at least one accessible still the host Agent can inspect — a
  presenter portrait, or a product photo that will be the first frame;
- restock facts and the spoken lines the seller already wrote;
- likeness and voice rights when a face or a cloned voice will appear;
- how many clips the pack should contain, or permission to use the
  default of 3.

Reuse already-known language, SKU names, and a frozen `voice_id`.
Ask only for a missing hard input. A count outside 2 to 8 is still
doable: confirm that pack size and its live cost.

Do not invent a restock date, price, unit count, or face. File access
is not consent.

Inspect every still. Record MIME type, width, height, aspect ratio,
byte size, and whether it has an alpha channel. For a local file,
upload only through the bundled client after inspection
(`scripts/mcp_client.py` / `beatra.assets.upload`). Keep the returned
artifact id. Never pass a local path to `beatra.voices.clone`,
`beatra.speech.synthesize`, or `beatra.videos.animate`.

## Plan the free clip list

Write a labeled restock talking list before any paid clone, speech, or
video. Default three clips unless the seller names another count in
2 to 8: what is back, when it lands, and next step. Each item records
the still, the spoken line from confirmed restock facts, intended
length as a 2–15s clip, and whether it uses a catalog voice, an
approved track, or a clone.

That list is the free visible result. Planning is not approval.

Safe defaults:

- one `beatra.videos.animate` call per still;
- `model: "auto"` unless the seller chose a live SKU;
- the still as the strict first frame;
- source-derived aspect ratio;
- audio-led duration inside 2–15s. Keep each clip as its own file.

## Confirm clone, speech, then video

Clone, speech, and video are separate paid stages. Each stage gets
its own six-field card and its own opaque `client_request_id` per
clip.

If the seller wants a cloned voice, inspect an authorized sample,
read the live `voice_clone` card, and wait on the clone card before
`beatra.voices.clone`. A found file is not clone consent. Show the
clone card and wait:

1. Work — one authorized voice sample (`beatra.voices.clone`).
2. Credits — the live `voice_clone` price just read. Do not reuse a
   remembered number.
3. Count — one paid clone call for this sample.
4. Identity — one new opaque `client_request_id`.
5. If we stop here — the labeled clip list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Before speech, call `beatra.models.list` for `text_to_speech`:

```json
{"capability": "text_to_speech"}
```

Use `beatra.voices.list` when a catalog voice still needs a choice.
Show the speech card and wait:

1. Work — one spoken restock line per named clip
   (`beatra.speech.synthesize`).
2. Credits — the live `text_to_speech` price just read, times the
   clip count. Do not reuse a remembered number.
3. Count — one paid speech call per clip.
4. Identity — one new opaque `client_request_id` per clip.
5. If we stop here — the labeled clip list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Submit each speech clip once through bundled `scripts/mcp_client.py`.
Send the spoken line in `input`. Poll `beatra.tasks.get`. Read actual
audio MIME, duration, and size. A script preview is not the audio
review.

Before video, call `beatra.models.list` for `image_to_video`:

```json
{"capability": "image_to_video"}
```

Confirm a current card admits `[image, driving_audio]`. Compare every
image fact and the real audio MIME, duration, and size with advertised
limits. Live driving-audio clips are 2–15s. If speech is longer than
the longest containable clip, split into sequential containable
segments; each segment is new speech and new video, each with a new
ID. Deliver the segments as separate files. Approved narration does
not authorize video. The 600-credit signup gift usually cannot start
this video. Show the video card and wait:

1. Work — one restock talking clip per named still
   (`beatra.videos.animate`).
2. Credits — the live `image_to_video` price just read, times the
   segment count. Do not reuse a remembered number.
3. Count — one paid video call per approved audio segment.
4. Identity — one new opaque `client_request_id` per segment.
5. If we stop here — the clip list and approved narration remain
   usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Then submit `beatra.videos.animate` once per approved segment.

## Review, deliver, and recover

Review identity, speech clarity, and mouth timing. Report only what
the host can actually see and hear. Do not promise perfect lip sync.
Never invent a stitch, concat, or editor tool. After each terminal
paid task, deliver actual bytes plus MIME, duration, and size when
present, and `billing.net_charged_credits`. Do not promise the
prepaid estimate is the final charge.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed still, line, voice, or duration
is a new card and a new ID. Cancel only when the seller asks.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"art-restock-01"},"driving_audio":{"type":"artifact","artifact_id":"art-speech-01"},"prompt":"A restrained restock announcement with steady eye line and a stable camera.","duration":8,"client_request_id":"opaque-restock-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For clip lists, payloads, and recovery, read
  [Restock talking workflow](references/workflow.md).
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
a paid clone, speech, or video request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
