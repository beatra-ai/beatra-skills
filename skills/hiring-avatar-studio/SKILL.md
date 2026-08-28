---
name: "hiring-avatar-studio"
description: "Turn one HR or founder portrait and a job brief into one talking-avatar hiring video per open role. This hiring avatar studio and recruitment avatar workflow can clone or pick a voice, then produce a hiring talking head clip that walks through the role, requirements, and next step. Use it for recruiting video, job posting video, job opening presenter clips, and a hiring video studio that keeps each new role on camera."
---

# Hiring Avatar Studio

Turn one authorized likeness and voice into one talking-head hiring
video per open role. The first role may create the voice. Later
openings reuse it.

## Scope and adjacent routes

Use this Skill when HR or a founder wants one talking-avatar hiring
video from an authorized portrait plus a job description or script.
Recur as new roles open.

Route weekly founder thought-leadership to `founder-ip-avatar-studio`.
Route a one-off presenter clip that is not a job ad to
`talking-avatar-video`. Route a lecture series with many lessons to
`course-video-studio`. Without authorization for the likeness and the
voice, stop at confirmation and do not generate.

## Inputs and defaults

The hard inputs are:

- one accessible portrait the host Agent can inspect;
- either an approved speech track or a job description / script plus a
  voice path;
- whether the user owns or has been granted rights to the likeness and the
  voice.

Reuse language, destination, framing, and the frozen `voice_id` from
earlier roles. Default to one hiring clip per named role, `model: "auto"`
for video, the portrait as the strict first frame, and a source-derived
aspect ratio. Ask only for a missing hard input.

## Golden path

1. Inspect the portrait. Record MIME type, width, height, aspect ratio, byte
   size, and whether it has an alpha channel. Confirm likeness rights. For a
   local portrait or sample, upload only through the bundled client after
   inspection. Never pass a local path to a remote tool.
2. If the studio still needs a cloned voice, confirm consent first. Access
   to a file is not consent. A suitable sample is currently about 10 to
   300 seconds, no larger than 20 MiB, and clean single-speaker speech.
   Call `beatra.models.list` with
   `{"capability":"voice_clone"}` and show the clone admission card before
   any clone `client_request_id` or `beatra.voices.clone` call: route
   `voice_clone`, tool `beatra.voices.clone`, live price for one successful
   activated voice, the provisional estimate, the 600-credit signup gift
   usually cannot start this clone, `https://console.beatra.ai/topup`, and
   starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not create
   `client_request_id` or submit until the user confirms they have topped
   up or already have enough credits.    Do not offer a free clone. Submit
   `beatra.voices.clone` exactly once:

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Hiring Voice",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-hiring-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal, then freeze the returned
   `voice_id`. Otherwise call `beatra.voices.list` when a catalog voice
   still needs to be selected. Never put a display name in `voice`.
3. If the user already supplied an approved speech track, skip synthesis
   and admit that audio for video. For a script or job-description route,
   make the copy speakable without inventing compensation, headcount, or
   benefits the user did not supply. Call `beatra.models.list` with
   `{"capability":"text_to_speech"}` and `{"capability":"image_to_video"}`.
   Confirm that a current video card admits `[image, driving_audio]`. Compare
   the portrait's actual MIME, dimensions, byte size, and alpha-channel
   presence with every advertised image constraint. Confirm planned speech
   can fit a video duration the route can fully contain. Live driving-audio
   i2v (wan2.7-i2v) SKUs are 2–15s. If the script is longer than the longest
   containable clip, split it into sequential containable segments. Each
   segment is its own paid speech call and its own paid video call, each
   with a new `client_request_id`. Do not shorten words to cheapen a clip.
   Use `mp3` only when the live speech card supports it and the live video
   card accepts `audio/mpeg`. If the user requested `flac`, `opus`, or `pcm`
   and the video route does not accept the resulting format, explain the
   incompatibility before any paid call and obtain the user's choice. Do
   not silently change the format. If any required media fact is
   unavailable or incompatible, stop before TTS.
4. On the script route only, show the narration arguments and paid
   boundary. Freeze the script, voice, format, and one speech
   `client_request_id` per segment. Submit `beatra.speech.synthesize`
   exactly once per segment through the bundled client. Skip this step
   when approved speech already exists.
5. For each speech segment, or for the supplied approved track, poll
   until terminal audio facts exist. On the script route, poll each
   narration task with `beatra.tasks.get`. Read the returned artifact
   plus actual `task.output.audio.mime_type`, `duration_seconds`, and
   `size_bytes` when present. Approve the real audio before that
   segment's video. Never treat a script preview, expected duration, or
   task metadata as an audio review.
6. For each approved audio segment, refresh the `image_to_video` cards
   and admit the actual portrait plus that audio. Recheck every image
   fact and compare the audio's actual MIME, duration, and byte size
   with the current driving-audio constraints. If terminal audio size is
   absent, obtain it from trusted artifact metadata; if it remains
   unavailable, stop before video. Use the smallest supported integer
   video duration at or above the actual speech length. Show the video
   admission card before any video `client_request_id` or
   `beatra.videos.animate` call: route `image_to_video`, tool
   `beatra.videos.animate`, approved portrait and speech artifacts,
   prompt, audio-led duration, resolution if set, output count,
   provisional live estimate, the fact that the 600-credit signup gift
   usually cannot start this video, the exact URL
   `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits.
   Do not recommend ¥198. Do not submit until the user confirms they
   have topped up or already have enough credits. Approved narration
   does not authorize the video call.
7. Submit `beatra.videos.animate` exactly once per approved audio
   segment. Do not configure a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback. Poll each video task with
   `beatra.tasks.get` until terminal.
8. Deliver the returned clips in script order with actual dimensions,
   duration, usage, and `billing.net_charged_credits`. Review identity,
   clarity, lip timing, and must-keep drift. Label the clip with the
   role name.

## Decisions that require confirmation

Likeness and voice rights, clone admission, narration, and the video
admission card each require their own confirmation.

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

- Read [Hiring avatar workflow](references/workflow.md) for clone,
  narration, admission cards, payloads, and review.
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
