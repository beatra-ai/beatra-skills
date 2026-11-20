---
name: "course-narration-studio"
description: "Turn lesson materials into polished course narration audio. This course narration studio organizes lessons into speakable scripts, records the teacher-voice narration for each section, and delivers slide-ready audio for courses, training, and knowledge-product audio."
---

# Course Narration Studio

Turn finished lecture text into a loudness-consistent, ordered course
narration pack. A course is a sequence of lessons with a delivery schedule, not
one long audiobook file. Validate and finish one speakable pilot lecture, then
expand the remaining modules in the same pinned voice.

## Scope and adjacent routes

Use this Skill when a course, training program, or internal enablement series
needs one consistent teacher voice across lectures. Keep one pilot workspace
separate from the remaining modules. Strip slide titles, stage labels, and
picture notes cleanly (without manually stripping `/` pause hacks or inventing
bracketed vocal-effect tags) before paid narration. After the user accepts the pilot, expand
the rest of the pack the same way.

Route a literary book or long manuscript to `ai-audiobook-narration`. Route a
cloned-voice podcast series with recurring episodes to
`voice-clone-series-studio`. Route a talking-head lecture video to
`course-video-studio`. Route a single short voiceover to
`short-form-voiceover-audio` or `voiceover-narration-studio`. Route permanent
voice deletion (`voices.delete`) to `voice-cloning-studio`, and
dialogue/transcription/SFX/stems to `beatra-ai-voice-studio`
(`scripts/mcp_client.py tools` is authoritative).

When the teacher wants slides narrated slide by slide directly from the deck
into PowerPoint or WPS, point to Slide Narration Studio
(`slide-narration-studio`); for lecture videos built from slides, point to
Lecture Video Maker (`lecture-video-maker`). Use the exact install phrasing in
[Course narration workflow](references/workflow.md#pointing-to-another-skill)
and install only after the user asks. Chapter narration from final lecture text
stays here.

## Inputs and defaults

The hard inputs are:

- final readable text for at least the pilot lecture (or permission to prepare/direct
  speakable copy first);
- lesson order;
- the target language (only when specified; preserve original simplified/traditional
  characters and dialect wording unless asked);
- a pronunciation table whenever recurring names, terms, or acronyms exist.

If recurring terms exist and the table is empty, stop and collect readings
without guessing. A narrator sample is optional; without one, select a ready
catalog voice via 11-dimension `beatra.voices.list` filtering and audition free
via `preview_url` or `beatra.voices.preview`.

Defaults: `model: "auto"` only when every voice-compatible live card supports
any supplied normalized BCP-47 language (`nb` -> `no`, `tl` -> `fil`),
`format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`. If `beatra.speech.validate`
or synthesis refuses the text as too long, follow the refusal message: split at
natural lesson, section, or sentence boundaries and submit the parts in order.
Never invent a words-per-minute control, and optionally run Smart
Voice Director (`beatra.speech.prepare_script`) when teaching cadence or pauses
need coaching.

Planning, casting, free previews, `beatra.speech.validate`, `beatra.voices.update`,
and the pronunciation table are free. Smart Voice Director (`prepare_script`),
noisy-sample `isolate_voice`, `voices.clone`, `speech.synthesize`, and
`normalize_loudness` are paid; never claim paid steps are free.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure or call a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the lecture ledger: lesson titles, order, one teaching point per
   section, and the pronunciation table. Run free `beatra.speech.validate`
   (`estimated_duration_seconds`) before any paid read, or check
   `{"capability": "speech_script"}` and approve a six-field card for Smart
   Voice Director (`beatra.speech.prepare_script`), handling `synthesis: null`
   from `warnings` and remembering 48-hour same-inputs `voice`/`model`-only
   recompiles still require initial balance cover and <= 2 concurrent tasks.
2. If the user brings a narrator sample, confirm plain consent BEFORE any local
   upload (speaker owns the voice or authorized cloning; file access is not
   consent). If the sample is noisy, offer paid pre-clean via
   `beatra.audio.process` (`operation: "isolate_voice"`, **`source`** field,
   4.6 s–5 min, <= 100 MB, checked via `{"capability": "audio_voice_isolation"}`).
   Upload via:

   ```text
   python3 scripts/mcp_client.py upload ./narrator-sample.wav --mime-type audio/wav
   ```

   Select the clone model as described in [Speech and audio
   guide](references/speech-and-audio.md) §5, show the six-field production card
   (Route & Model, Exact Scope, Price & Basis, Duration / Quantity, Pay Mode &
   Call Count, If stop noting free deliverables kept at zero cost—never hardcode
   credit figures or ask the user to pre-confirm sufficient credits) with the
   live clone price, describing the clone by what it does for the course and naming no model ID or provider, submit once, and handle any refusal per [Billing, errors,
   and recovery](references/billing-errors-and-recovery.md):

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Course Teacher",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-course-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal. When a clone result or a listed
   voice has status `pending_activation`, follow §5 Step E of [Speech and audio
   guide](references/speech-and-audio.md) before using the voice. Then pin the
   voice cleanly with non-billable `beatra.voices.update` (`make_default: true`,
   `use_case`).
3. Without a sample, filter `beatra.voices.list` across its 11 dimensions
   (`category`, `language`, `gender`, `age_group`, `use_case`, `emotion`,
   `supports_context`, `supports_direction`, `supports_performance_tags`,
   `supports_dialogue`, `supports_speech_to_speech`) and audition free via
   `beatra.voices.preview` (`{"voice_id": "..."}`). Never pass a display name
   in `voice`.
4. Query `beatra.models.list` with `{"capability": "text_to_speech"}`, preflight
   with free `beatra.speech.validate`, present the pilot six-field card (pick
   the hardest term/number-dense lecture), and after explicit approval
   synthesize ONLY the pilot via `beatra.speech.synthesize` (pass
   `subtitle_enable: true` when aligned `SRT`/`VTT` study captions help; never
   pass `subtitles`). Poll with `beatra.tasks.get`.
5. Deliver pilot audio and review readings. Revise only misread or unclear
   blocks under new cards and new `client_request_id` values—never regenerate
   the whole lecture.
6. After pilot sign-off, approve the remaining-pack card and synthesize each
   remaining block once (`client_request_id` per block). Optionally run
   serialized paid `beatra.audio.process` (`operation: "normalize_loudness"`,
   **`source`** field, e.g. `-14 LUFS`, `<= 60 min` / `<= 300 MB` / `>= 1 s`
   output, `50` calls/day, checked via `{"capability": "audio_process"}`) one
   lesson track at a time for consistent course volume—never calling finishing
   free or present it as a mastering service.
7. Deliver labeled lesson audio in teaching order with duration, optional
   captions, usage, and `billing.net_charged_credits`.

## Decisions that require confirmation

Confirm the pronunciation table, six-field clone card (plus consent before
upload), optional `isolate_voice` / `prepare_script` cards, pilot card,
remaining-pack card, and optional `normalize_loudness` finishing card. Any
changed lecture text, voice, control, or LUFS target creates new paid work for
affected blocks only under a new `client_request_id`.

## Recovery

Recover uncertain create responses only with field-for-field identical payload
and `client_request_id` after checking paginated `beatra.tasks.list`
(`next_cursor`) plus `beatra.tasks.get`. Cancel only when asked. On
`insufficient_balance`, relay Beatra's message and exact `topup_url` verbatim,
stop until the user confirms topping up, and replay the exact frozen request.
If the refusal names another way forward, present it too and follow [Billing,
errors, and recovery](references/billing-errors-and-recovery.md).

## Account balance

Never make `beatra.wallet.get` a mandatory gate before paid submits and never
ask users to confirm sufficient credits. Only call read-only
`beatra.wallet.get` when asked about balance/fit and `beatra.wallet.ledger`
when asked what was charged. If a model card carries `top_up`, relay tiers in
returned order verbatim without ranking or picking one.

## References by task

- Read [Speech and audio guide](references/speech-and-audio.md) for cross-tool
  limits, voice cloning, Smart Voice Director, and six-field cards.
- Read [Course narration workflow](references/workflow.md) for ledgers, pilots,
  `isolate_voice`, `prepare_script`, `validate`, `synthesize`, and
  `normalize_loudness` payloads plus cross-skill install links.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
