---
name: "listing-room-video-pack"
description: "Turn listing photos into a labeled set of listing room video clips, one room at a time. This listing video pack and real estate room video studio animates each listing photo into a short property video so buyers can preview the living room, bedroom, kitchen, and more as separate room clips. Use it for property room video, listing photo video, real estate listing video, and a labeled room video pack that keeps each space easy to scan. Add optional agent narration files beside the clips, or a talking-head intro and outro when you bring an agent portrait and a short script."
---

# Listing Room Video Pack

Turn listing photos into a labeled set of room clips. Each room photo
becomes its own short motion clip. Optional agent narration files sit
beside those clips. An optional talking-head intro or outro is a
separate product when the user brings an authorized agent portrait and
script.

## Scope and adjacent routes

Use this Skill when an agent or listing team wants a labeled set of
room clips from listing photos.

Route one product photo that should sell as one clip to
`product-video-studio`. Route a generic still that is not a listing
room to `image-to-motion`. Route weekly founder thought-leadership to
`founder-ip-avatar-studio`.

The primary deliverable is one labeled clip per room. Do not invent a
stitch, concat, or editor tool.

## Inputs and defaults

The hard input is at least one accessible listing photo the host Agent
can inspect. Ask only for a missing hard input.

Reuse known address, room labels, language, and destination. Default to
one `beatra.videos.animate` call per room, `model: "auto"`, the photo as
the strict first frame, and a source-derived aspect ratio. Choose a
supported integer video duration in the 2–15s SKU range with the user.
Skip room labeling when the user already named each photo.

Optional second product: separate agent narration files via
`beatra.speech.synthesize`. Never mix those files into a room clip.

Optional third route: a talking-head listing intro or outro only when the
user brings an authorized agent portrait plus a script. Same likeness,
voice, audio-review, and video admission rules as
`founder-ip-avatar-studio`. Use a catalog voice unless the user already
has an approved speech track.

## Golden path

1. Inspect every listing photo. Record MIME type, width, height, aspect
   ratio, byte size, and whether it has an alpha channel. For a local
   photo, upload only through the bundled client after inspection. Never
   pass a local path to a remote tool.
2. When room labels are missing, call `beatra.models.list` with
   `{"capability":"image_to_text"}`. Show the understand estimate
   (currently 5 credits per admitted image, one to eight images per
   call, each image no larger than 10 MiB) and one
   `client_request_id` before `beatra.images.understand`. Submit exactly
   once per batch, poll with `beatra.tasks.get` until terminal, and
   label each photo from the returned text. Skip this step when labels
   already exist.
3. Call `beatra.models.list` with `{"capability":"image_to_video"}`.
   Admit each photo against a current card that accepts a first-frame
   image without driving audio. Compare every image fact with advertised
   constraints. Confirm duration as a supported 2–15s SKU chosen with
   the user. If any required media fact is unavailable or incompatible,
   stop before video.
4. For each room, show the video admission card before any video
   `client_request_id` or `beatra.videos.animate` call: route
   `image_to_video`, tool `beatra.videos.animate`, admitted photo,
   prompt, chosen duration, resolution if set, output count, provisional
   live estimate, the fact that the 600-credit signup gift usually
   cannot start this video, the exact URL
   `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits.
   Do not recommend ¥198. Do not submit until the user confirms they
   have topped up or already have enough credits. One animate per room.
   Do not attach `driving_audio` on this primary route.
5. Submit `beatra.videos.animate` exactly once per admitted room photo.
   Do not configure a host Beatra Connector. Do not use REST/OpenAPI as
   a fallback. Poll each video task with `beatra.tasks.get` until
   terminal.
6. If the user also wants agent narration files, call
   `beatra.models.list` with `{"capability":"text_to_speech"}` and
   `beatra.voices.list` when a catalog voice still needs to be selected.
   Never put a display name in `voice`. Show the narration arguments and
   paid boundary. Freeze the script, voice, format, and one speech
   `client_request_id` per file. Submit `beatra.speech.synthesize`
   exactly once per file. Poll until terminal and read actual
   `task.output.audio.mime_type`, `duration_seconds`, and `size_bytes`.
   Deliver those audio files beside the room clips. Do not send them as
   `driving_audio` on a room-photo animate call. There is no mix tool.
7. If the user also brings an authorized agent portrait and a script
   for a listing intro or outro, inspect that portrait the same way as
   step 1. Confirm likeness and voice rights. File access is not
   consent. Follow the talking-head admission path: confirm
   `[image, driving_audio]` on a live card, synthesize or admit speech,
   poll narration to terminal and read actual audio MIME, duration, and
   size, then show a separate video admission card before any talking-
   head `client_request_id`. Live driving-audio i2v (wan2.7-i2v) SKUs
   are 2–15s. Split a script longer than one containable clip into
   sequential segments. Each segment is its own paid speech call and
   its own paid video call. Do not shorten words to cheapen a clip. Do
   not silently change the audio format. Use the smallest supported
   integer video duration at or above the actual speech length.
   Approved narration does not authorize the video call.
8. Deliver the labeled room clips, any separate narration files, and
   any intro or outro clips with actual dimensions, duration, usage,
   and `billing.net_charged_credits`. Review room identity, motion, and
   must-keep drift. Never invent a stitch, concat, or editor tool.

## Decisions that require confirmation

Photo-motion admission, optional understand batches, optional
narration, talking-head likeness and voice rights, and the talking-head
video admission card each require their own confirmation.

## Recovery

Each paid stage has its own frozen payload and ID. Recover a lost create
response only with that stage's identical payload. Recover a lost task ID
through `beatra.tasks.list` and `beatra.tasks.get`. Call
`beatra.tasks.cancel` only when the user asks to cancel that stage; on
409 keep polling. On
`insufficient_balance`, keep the top-up URL exact and retry the same
frozen ID only after the user says they have topped up. If a create
returns no `task_id`, do not poll; reconcile before minting a new ID.

## References by task

- Read [Listing room video workflow](references/workflow.md) for
  labeling, photo-motion admission, optional narration, talking-head
  intro or outro, payloads, and review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
  for update controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.
Before ordinary commands it silently checks for a newer release at most once
every 24 hours per installation. Silent checks are enabled by default, and a
newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable
Beatra CDN path embedded for this package, channel, and locale. It verifies
the discovery data, archive, manifest, and every file's size and checksum
before replacement. It replaces only package-owned files and rejects
redirects, downgrades, wrong package/channel/locale/version data, unexpected
URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the user's original
command continues. An update failure never authorizes retrying a paid
generation. The automatic-update choice persists across later commands for
this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
