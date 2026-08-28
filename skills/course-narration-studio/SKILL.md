---
name: "course-narration-studio"
description: "Turn lecture manuscripts and course slides into a lecture-by-lecture narration pack with one consistent teacher voice. This AI course narration studio and course voiceover studio organizes lessons, keeps term pronunciations consistent, and records a first lecture plus the remaining course as ordered lesson audio. Use it for course narration, training voiceover, lesson TTS, lecture TTS, AI course audio, lesson narration, elearning voiceover, teacher voiceover, knowledge product audio, and course text to speech."
---

# Course Narration Studio

Turn finished lecture text into an ordered narration pack. A course is a
sequence of lessons with a delivery date, not one long audiobook file.
Finish one speakable pilot lecture, then expand the remaining pack.

## Scope and adjacent routes

Use this Skill when a course, training program, or internal enablement deck
needs one consistent teacher voice across many lectures.

Keep one lecture workspace separate from the remaining pack. Strip slide
titles, stage labels, and picture notes out of the spoken text before any
paid read. After the user accepts the pilot, expand the rest of the course
the same way.

Route a literary book or long manuscript to `ai-audiobook-narration`. Route
a cloned-voice series with recurring episodes to
`voice-clone-series-studio`. Route a talking-head lecture video to
`course-video-studio`. Route a single short voiceover to
`short-form-voiceover-audio` or `voiceover-narration-studio`.

## Inputs and defaults

The hard inputs are:

- final readable text for at least the pilot lecture;
- lesson order;
- the target language;
- a pronunciation table whenever the lecture contains recurring names,
  terms, or acronyms.

If those terms exist and the table is empty, stop and collect the readings.
Do not guess them. A narrator sample is optional. Without a sample, choose
a catalog voice with `beatra.voices.list`. Reuse already-known tone, speed,
and format.

Defaults: `model: "auto"` only when every voice-compatible live card
supports the language; `format: "mp3"`; `speed: 1.0`. Keep each submitted
`input` at or below 50,000 characters. Split on lesson, section, or
sentence boundaries, never mid-sentence. Write short spoken sentences.
Explain a new term in plain language the first time it appears, using the
table's reading. Do not send picture notes, page headings, or bracket
labels into `input`. Keep educational pace in the sentences themselves;
do not invent a words-per-minute control.

Planning, casting, and the pronunciation table are free. Clone, if used,
and each synthesis block are paid.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the lecture ledger: lesson titles, order, one teaching point per
   section, and the pronunciation table. Turn the pilot lecture into
   speakable text only. Confirm the table before it is frozen.
2. If the user brought a narrator sample, confirm consent first: the user
   must state this is their voice or that the speaker authorized this
   cloning use. Access to a file is not consent. A suitable sample is
   currently about 10 to 300 seconds, no larger than 20 MiB, and clean
   single-speaker speech. Only after consent, upload a local file through
   the bundled client:

   ```text
   python3 scripts/mcp_client.py upload ./narrator-sample.wav --mime-type audio/wav
   ```

   Then present the current `beatra.voices.clone` admission card before
   any clone `client_request_id` — route `voice_clone`, tool
   `beatra.voices.clone`, live price for one successful activated voice,
   the provisional estimate, the 600-credit gift usually cannot start
   this clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000
   credits. Do not recommend ¥198. Do not create `client_request_id` or
   submit until the user confirms they have topped up or already have
   enough credits. Do not offer a free clone.    Submit `beatra.voices.clone`
   exactly once:

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Course Teacher",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-course-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal, then freeze the returned
   `voice_id`.
3. Without a sample, select a catalog `voice_id` with
   `beatra.voices.list`. Never put a display name in `voice`.
4. Call `beatra.models.list` with `{"capability":"text_to_speech"}`. Choose
   the hardest lecture as the pilot. Confirm the pilot estimate, then
   synthesize only the pilot with `beatra.speech.synthesize`. Poll each
   speech task with `beatra.tasks.get` until terminal.
5. Deliver the pilot audio. After the user listens, revise only unclear or
   misread blocks: edit the spoken text, then resubmit those blocks with
   new request IDs. Do not regenerate the whole lecture. Poll each revised
   block to terminal.
6. After the user accepts the revised pilot, confirm the remaining-pack
   estimate and synthesize the rest with `beatra.speech.synthesize`, one
   block per call, each with its own `client_request_id`. Poll each block
   with `beatra.tasks.get` until terminal.
7. Deliver labeled lesson audio in teaching order with actual duration,
   usage, and `billing.net_charged_credits`. Review terms, numbers, and
   voice consistency.

## Decisions that require confirmation

Confirm the pronunciation table, the voice, the pilot, and the remaining
pack estimate. A changed lesson text is new paid work for the changed
blocks only.

## Recovery

Recover a lost create response only with the identical frozen payload and
ID. Recover a lost task ID through `beatra.tasks.list` and
`beatra.tasks.get`. Cancel only at the user's request. On
`insufficient_balance` for clone or TTS, keep
`https://console.beatra.ai/topup` exact and retry the same frozen ID only
after the user says they have topped up.

## References by task

- Read [Course narration workflow](references/workflow.md) for ledgers,
  pilots, payloads, and review.
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
