---
name: "airbnb-welcome-avatar"
description: "Turn authorized host or room stills and confirmed stay facts into one homestay welcome talking clip per still. This homestay welcome talking-clip studio writes a speakable check-in and amenity script, then animates each still into a 2–15s welcome or facility clip in stay order. Use it for homestay welcome videos, Airbnb check-in greetings, amenity explainers, and guest arrival talking clips that stay one photo, one clip."
---

# Homestay Welcome Talking Clips

Turn authorized stills and confirmed stay facts into one welcome or
amenity talking clip per still. Deliver the clips in stay order. Do not
stitch them.

## Scope and adjacent routes

Use this Skill when a host or property manager wants check-in welcome
and facility talking clips from stills they can authorize.

Route silent labeled room clips to `listing-room-video-pack`. Route a
generic presenter clip that is not a stay welcome to
`talking-avatar-video`. Route hiring videos to `hiring-avatar-studio`.
Route an overnight livestream avatar to `unattended-live-avatar`. Route
a buyer walk-in talking tour to `rental-walkin-avatar` when that
package is public.

## Inputs and defaults

The hard inputs are:

- at least one accessible still the host Agent can inspect — a host
  portrait for a talking welcome, or a room/amenity photo for a
  facility clip;
- confirmed stay facts the host supplied (Wi-Fi, parking, check-in
  window, house rules already written down);
- likeness and voice rights when a face or a cloned voice will appear.

Do not invent house rules, fees, lockbox codes, or amenities that are
not in the stills or the host's facts. Reuse language, stay order, and
a frozen `voice_id` from earlier clips for the same listing. Default to
one `beatra.videos.animate` call per still, `model: "auto"`, the still
as the strict first frame, and a source-derived aspect ratio. Ask only
for a missing hard input.

## Golden path

1. Inspect every still. Record MIME type, width, height, aspect ratio,
   byte size, and whether it has an alpha channel. Confirm likeness
   rights when a face is in frame. For a local file, upload only
   through the bundled client after inspection. Never pass a local path
   to a remote tool.
2. Write a speakable welcome or amenity script from the host's facts
   and what the stills actually show. Keep stay order. Do not invent
   rules. Deliver the free storyboard: one 2–15s slot per still, the
   spoken line for that slot, and the still it uses. Planning is not
   approval.
3. If the user already supplied an approved speech track per slot, skip
   synthesis and admit that audio for video. Otherwise call
   `beatra.models.list` with `{"capability":"text_to_speech"}` and
   `beatra.voices.list` when a catalog voice still needs to be selected.
   Never put a display name in `voice`. Show the speech production card
   before any speech `client_request_id` or `beatra.speech.synthesize`
   call. Submit exactly once per slot. Poll with `beatra.tasks.get`
   until terminal and read actual `task.output.audio.mime_type`,
   `duration_seconds`, and `size_bytes`. Never treat a script preview
   as the audio review.
4. Call `beatra.models.list` with `{"capability":"image_to_video"}`.
   Confirm a current card admits `[image, driving_audio]`. Compare
   every image fact and the real audio MIME, duration, and byte size
   with advertised constraints. Live driving-audio i2v SKUs are 2–15s.
   If a spoken slot is longer than the longest containable clip, split
   it into sequential containable segments. Each segment is its own
   paid speech call and its own paid video call, each with a new
   `client_request_id`. Do not shorten words to cheapen a clip. Do not
   silently change the audio format. If any required media fact is
   unavailable or incompatible, stop before video.
5. For each approved audio segment, show the video production card
   before any video `client_request_id` or `beatra.videos.animate`
   call: route `image_to_video`, tool `beatra.videos.animate`, approved
   still and speech artifacts, prompt, audio-led duration, resolution
   if set, output count, provisional live estimate, the fact that the
   600-credit signup gift usually cannot start this video,
   `https://console.beatra.ai/wallet?intent=buy`, and starter ¥29 /
   11,000 credits. Do not recommend ¥198. Do not submit until the user
   confirms they have topped up or already have enough credits.
   Approved narration does not authorize the video call.
6. Submit `beatra.videos.animate` exactly once per approved audio
   segment through bundled `scripts/mcp_client.py`. Do not configure a
   host Beatra Connector. Do not use REST/OpenAPI as a fallback. Poll
   each video task with `beatra.tasks.get` until terminal.
7. Deliver the clips in stay order with actual dimensions, duration,
   usage, and `billing.net_charged_credits`. Review likeness, spoken
   facts, and must-keep drift. Never invent a stitch, concat, or
   editor tool.

## Decisions that require confirmation

Planning, the stay-order storyboard, and live price quotes are free.
They are not approval.

Speech synthesis and video animate each need their own current
production card. Likeness and voice rights are a hard stop, not a
card. File access is not consent.

Before every paid call, show a current production card and wait:

1. Work — what will be made, in the user's words, and that this is a
   generate call.
2. Credits — the live price just read from the model card. Do not
   reuse a remembered number.
3. Count — one paid call per slot this turn. Each still is one video
   call after its speech call.
4. Identity — one new opaque `client_request_id` per call. If prompt,
   file, model, or controls change, mint a new ID.
5. If we stop here — the storyboard remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Do not retry until the user says they have
   topped up.

## Recovery

Each paid stage has its own frozen payload and ID. Recover a lost
create response only with that stage's identical payload. Recover a
lost task ID through `beatra.tasks.list` and `beatra.tasks.get`. Call
`beatra.tasks.cancel` only when the user asks to cancel that stage; on
409 keep polling. On `insufficient_balance`, keep the top-up URL exact
and retry the same frozen ID only after the user says they have topped
up. If a create returns no `task_id`, do not poll; reconcile before
minting a new ID. A changed script, still, voice, duration, or model
is new work and a new card.

## References by task

- Read [Homestay welcome talking-clip workflow](references/workflow.md)
  for storyboard slots, speech admission, video admission, payloads,
  and review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md)
  when the bundled client cannot connect.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
  for update controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra
operation. Before ordinary commands it silently checks for a newer
release at most once every 24 hours per installation. Silent checks
are enabled by default, and a newer release installs without separate
confirmation.

The updater accepts only the fixed official discovery address and
immutable Beatra CDN path embedded for this package, channel, and
locale. It verifies the discovery data, archive, manifest, and every
file's size and checksum before replacement. It replaces only
package-owned files and rejects redirects, downgrades, wrong
package/channel/locale/version data, unexpected URLs, unsafe archives,
and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and
recovery fail open: the current installation remains usable and the
user's original command continues. An update failure never authorizes
retrying a paid generation. The automatic-update choice persists
across later commands for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
