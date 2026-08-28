---
name: "course-video-studio"
description: "Turn lecture scripts and one authorized teacher portrait into talking-head lesson videos. This AI course video studio and digital teacher studio prepares lecture narration, then produces a stable presenter clip for each lesson so a training team can publish without a camera shoot. Use it for course videos, training videos, digital human lectures, lesson talking head series, elearning video, teacher avatar video, lecture video maker work, and training presenter video."
---

# Course Video Studio

Turn finished lecture scripts and one authorized teacher portrait into
lesson videos. Each lesson is narration first, then talking-head clips
that fully contain the speech.

## Scope and adjacent routes

Use this Skill when a course or training team wants talking-head lesson
videos from a stable portrait plus lecture text.

Route audio-only course work to `course-narration-studio`. Route a single
presenter clip to `talking-avatar-video`. Route a founder weekly update to
`founder-ip-avatar-studio`. Without authorization for the likeness and the
voice, stop at confirmation.

## Inputs and defaults

The hard inputs are:

- one accessible teacher portrait;
- final lecture text for at least the pilot lesson;
- lesson order;
- likeness and voice rights;
- a pronunciation table whenever the lecture contains recurring names,
  terms, or acronyms.

If those terms exist and the table is empty, stop and collect the readings.
Do not guess them. Final lecture text is the spoken source. A deck is
useful only after the user extracts the spoken script; this Skill does not
parse slides.

Reuse the frozen `voice_id`, language, and framing. Default to
`model: "auto"` for video and a source-derived aspect ratio. Split a
lesson into sequential containable clips when planned speech is longer
than the longest video duration that can hold it.

## Golden path

1. Inspect the portrait. Record MIME type, width, height, aspect ratio, byte
   size, and whether it has an alpha channel. Build the lesson ledger. For a
   local portrait or sample, upload only through the bundled client after
   inspection. Never pass a local path to a remote tool.
2. Select or clone a teacher voice. A clone requires consent first; access
   to a file is not consent. A suitable sample is currently about 10 to
   300 seconds, no larger than 20 MiB, and clean single-speaker speech.
   Use the live `voice_clone` admission card
   before any clone `client_request_id` or `beatra.voices.clone` call:
   route `voice_clone`, tool `beatra.voices.clone`, live price for one
   successful activated voice, the provisional estimate, the 600-credit
   signup gift usually cannot start this clone,
   `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do
   not recommend ¥198. Do not create `client_request_id` or submit until
   the user confirms they have topped up or already have enough credits.
   Do not offer a free clone. Submit `beatra.voices.clone` exactly once:

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Course Teacher",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-course-video-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal, then freeze the returned
   `voice_id`. Without a clone, call
   `beatra.voices.list` when a catalog voice still needs to be selected.
   Never put a display name in `voice`.
3. Call `beatra.models.list` for `text_to_speech` and `image_to_video`.
   Confirm the video route admits `[image, driving_audio]`. Compare the
   portrait's actual MIME, dimensions, byte size, and alpha-channel
   presence with every advertised image constraint. Read the longest
   video duration that can fully contain speech. Split the pilot lecture
   into sequential containable segments at sentence or section
   boundaries. Do not shorten the lecture to cheapen a clip. Do not ship
   a truncated lesson. Use `mp3` only
   when the live speech card supports it and the live video card accepts
   `audio/mpeg`. If the user requested `flac`, `opus`, or `pcm` and the
   video route does not accept the resulting format, explain the
   incompatibility before any paid call and obtain the user's choice. Do
   not silently change the format. If any required media fact is
   unavailable or incompatible, stop before TTS. Keep each speech
   `input` at or below 50,000 characters.
4. Confirm the pilot speech card: script segments, voice, format, live
   estimate, and one `client_request_id` per `beatra.speech.synthesize`
   call. Submit each segment once through the bundled client. Poll each
   narration task with `beatra.tasks.get` until terminal. Read the
   returned artifact plus actual `task.output.audio.mime_type`,
   `duration_seconds`, and `size_bytes`. Approve the real audio before
   that segment's video. Never treat a script preview as an audio review.
5. Refresh the `image_to_video` cards and admit the actual portrait plus
   that segment's approved speech. Recheck every image and driving-audio
   fact. If terminal audio size remains unavailable, stop before video.
   Use the smallest supported integer video duration at or above the
   actual speech length. Show the video admission card before
   `beatra.videos.animate`: route `image_to_video`, tool
   `beatra.videos.animate`, approved portrait and speech artifacts, prompt,
   audio-led duration, resolution if set, output count, provisional live
   estimate, the 600-credit gift usually cannot start this video,
   `https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits. Do not
   recommend ¥198. Do not submit until the user confirms they have topped
   up or already have enough credits. Approved narration does not
   authorize the video call. Each segment video has its own
   `client_request_id`.
6. After the pilot lesson's clips are accepted, repeat
   segment-narration-then-video for remaining lessons. Each paid stage
   has its own `client_request_id`. Submit only through the bundled
   `scripts/mcp_client.py`. Do not configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Poll every video task with
   `beatra.tasks.get` until terminal.
7. Deliver labeled lesson videos in teaching order, with segment order
   inside a lesson, plus actual dimensions, duration, usage, and
   `billing.net_charged_credits`. Review identity, term readings, and
   lip timing.

## Decisions that require confirmation

Confirm rights, the voice, the pilot, and every video admission card. A
changed lecture is new narration and, if the audio changes, a new video.

## Recovery

Recover each stage only with its identical frozen payload and ID. Recover
a lost task ID through `beatra.tasks.list` and `beatra.tasks.get`. On
`insufficient_balance`, keep `https://console.beatra.ai/topup` exact and
retry the same frozen `client_request_id` only after the user says they
have topped up.

## References by task

- Read [Course video workflow](references/workflow.md) for ledgers,
  admission cards, payloads, and review.
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
