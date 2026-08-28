---
name: "creator-drop-talking"
description: "Turn a confirmed new-drop script and authorized stills into one drop talking clip per still. This product drop video studio writes a speakable launch talking clip and new-drop announcement for each photo, then animates a 2 to 15s talking teaser. Use it for creator drop videos and talking teasers that stay one photo, one clip."
---

# Creator Drop Talking Clips

Turn a confirmed drop script and authorized stills into one talking
teaser per still. Deliver 2 to 8 clips. Do not stitch them.

## Scope and adjacent routes

Use this Skill when a creator or listing team wants short talking
clips that announce a new drop from stills they can authorize.

Route a generic presenter that is not a drop announcement to
`talking-avatar-video`. Route a homestay welcome to
`airbnb-welcome-avatar`. Route silent product motion to
`product-video-studio`. Route an oral seeding brief that is not a
still-driven talking teaser to `oral-seeding-video-maker`.

## Collect the drop

Hard inputs are:

- at least one accessible still the host Agent can inspect — a
  presenter portrait or a drop photo that will be the first frame;
- confirmed drop facts the seller already wrote (what is new, when
  it lands, what the still actually shows);
- likeness and voice rights when a face or a cloned voice will appear;
- how many clips the pack should contain, or permission to use the
  default of 3.

Reuse already-known language, SKU names, and a frozen `voice_id`.
Ask only for a missing hard input. A count outside 2 to 8 is still
doable: confirm that pack size and its live cost.

Do not invent a drop date, price, claim, or face. File access is not
consent.

Inspect every still. Record MIME type, width, height, aspect ratio,
byte size, and whether it has an alpha channel. For a local file,
upload only through the bundled client after inspection
(`scripts/mcp_client.py` / `beatra.assets.upload`). Keep the returned
artifact id. Never pass a local path to `beatra.voices.clone`,
`beatra.speech.synthesize`, or `beatra.videos.animate`.

## Plan the free slot list

Write a labeled drop talking list before any paid clone, speech, or
video. Default three slots unless the seller names another count in
2 to 8: teaser, feature, and close. Each slot records the still, the
spoken line from confirmed facts, intended length as a 2–15s clip,
and whether it uses a catalog voice, an approved track, or a clone.

That list is the free visible result. Planning is not approval.

Safe defaults:

- one `beatra.videos.animate` call per still;
- `model: "auto"` unless the seller chose a live SKU;
- the still as the strict first frame;
- source-derived aspect ratio;
- audio-led duration inside 2–15s. Do not stitch.

## Confirm clone, speech, then video

Clone, speech, and video are separate paid stages. Each stage gets
its own six-field card and its own opaque `client_request_id` per
slot.

If the seller wants a cloned voice, inspect an authorized sample,
read the live `voice_clone` card, and wait on the clone card before
`beatra.voices.clone`. A found file is not clone consent. Show the
clone card and wait:

1. Work — one authorized voice sample (`beatra.voices.clone`).
2. Credits — the live `voice_clone` price just read. Do not reuse a
   remembered number.
3. Count — one paid clone call for this sample.
4. Identity — one new opaque `client_request_id`.
5. If we stop here — the labeled slot list remains usable.
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

1. Work — one spoken drop line per named slot
   (`beatra.speech.synthesize`).
2. Credits — the live `text_to_speech` price just read, times the
   slot count. Do not reuse a remembered number.
3. Count — one paid speech call per slot.
4. Identity — one new opaque `client_request_id` per slot.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Submit each speech slot once through bundled `scripts/mcp_client.py`.
Poll `beatra.tasks.get`. Read actual audio MIME, duration, and size.
A script preview is not the audio review.

Before video, call `beatra.models.list` for `image_to_video`:

```json
{"capability": "image_to_video"}
```

Confirm a current card admits `[image, driving_audio]`. Compare every image
fact and the real audio MIME, duration, and size with advertised
limits. Live driving-audio clips are 2–15s. If speech is longer than
the longest containable clip, split into sequential containable
segments; each segment is new speech and new video, each with a new
ID. Do not stitch the segments into one file. Approved narration does
not authorize video. The 600-credit signup gift usually cannot start
this video. Show the video card and wait:

1. Work — one talking teaser per named still
   (`beatra.videos.animate`).
2. Credits — the live `image_to_video` price just read, times the
   segment count. Do not reuse a remembered number.
3. Count — one paid video call per approved audio segment.
4. Identity — one new opaque `client_request_id` per segment.
5. If we stop here — the slot list and approved narration remain
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
printf '%s' '{"image":{"type":"artifact","artifact_id":"art-drop-01"},"driving_audio":{"type":"artifact","artifact_id":"art-speech-01"},"prompt":"A restrained drop announcement with steady eye line and a stable camera.","duration":8,"client_request_id":"opaque-drop-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For slot lists, payloads, and recovery, read
  [Drop talking workflow](references/workflow.md).
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
