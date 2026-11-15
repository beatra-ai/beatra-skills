---
name: "slide-narration-studio"
description: "Narrate a slide deck page by page. It writes a spoken script for every slide, records it in the teacher's own voice through a voice clone or with a chosen narrator, and delivers one audio file per slide or narrated slides as a video with subtitles. It covers course narration, PowerPoint narration, slide voiceover, and lecture voiceover for courses, training decks, and talks."
---

# Slide Narration Studio

Give every slide of a deck its spoken explanation: a script per slide in the
teacher's register, read in the teacher's own voice or a chosen voice,
validated free before synthesis, and optionally normalized across slides.

## What you get

- One audio file per slide (`out/L01-audio/p001.mp3`, `p002.mp3`, …), named
  in slide order and labelled as AI-generated in its metadata.
- The spoken script for every slide, approved before any voice is made.
- On request, one narrated video of the deck (1920×1080) with its subtitles
  on screen, and its SRT subtitle file beside it.

## Ways to run it

- **Audio per slide (default).** For the teacher to place on each slide in
  PowerPoint or WPS.
- **Narrated video.** The slides play with their narration, the subtitles on
  screen, and the AI badge, with the SRT file beside the video.
- **The teacher's own voice.** Cloned once from a clean sample.
- **Lecture text without slides.** Each paragraph of the final lecture text
  becomes one audio file, in order.

## Scope and adjacent routes

Use it when the slides, or the final lecture text, exist and only the spoken
explanation is missing. For a whole course of lecture videos with an optional
on-camera teacher, Lecture Video Maker is the route; for one micro-lesson
built from a topic, Micro-Lesson Maker. When there is only lecture text and
the teacher wants a video, AI Courseware Maker builds the deck first. Point to
another Skill with the install message in
[Narration workflow](references/workflow.md#pointing-to-another-skill)
and install it only after the user asks.

For noisy clone sample isolation (`isolate_voice`), two-step trial clone
activation (`voices.activate`), slot deletion (`voices.delete`), or
multi-speaker dialogue or SFX production beyond `scripts/mcp_client.py tools`,
route to `voice-cloning-studio` or `beatra-ai-voice-studio`.

## Inputs and defaults

Hard inputs: the deck (`.pptx`, PDF, or exported slide images), or the final
lecture text when there are no slides, and the spoken language. Ask for a
voice sample and plain speaker consent ONLY before uploading a sample for custom
voice cloning, and for readings of recurring names, terms, and acronyms.
Defaults: speaker notes as each slide's script when present (otherwise a
script written from the slide), a ready catalog voice suited to the subject,
and audio per slide. Preserve original simplified/traditional characters and
dialect wording unless asked, never hand-strip `/` pause markers or invent
custom bracketed vocal-effect cues, and never add facts the slides and notes do not support.

## Golden path

Run every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure or call a host Beatra Connector. Do not use REST/OpenAPI as a fallback.
Check [speech and audio guide](references/speech-and-audio.md) for cross-tool
limits and payload details; slides are read and videos assembled locally with
[Deck files](references/deck-files.md) and
[Lesson video assembly](references/lesson-video.md).

1. **Read the deck** and create the course project (one lesson for the deck).
   From lecture text alone, each paragraph becomes one page.
2. **Write and preflight the scripts** for every slide and show them with the
   pronunciation list (nothing submitted yet). If dramatic rhythm helps, check
   `{"capability": "speech_script"}`, approve its six-field card, and run Smart
   Voice Director (`beatra.speech.prepare_script`), handling `synthesis: null`
   via `warnings` and keeping the 48-hour same-inputs `voice`/`model`-only
   recompile rule strictly distinct from calling `prepare_script` generally free.
3. **Cast and clone safely**: filter `beatra.voices.list` across 11 capability
   and style dimensions (`category`, `language`, `gender`, `age_group`,
   `use_case`, `emotion`, `supports_context`, `supports_direction`,
   `supports_performance_tags`, `supports_dialogue`, `supports_speech_to_speech`)
   and audition free via `preview_url` or `beatra.voices.preview`
   (`{"voice_id": "..."}`). For the teacher's voice, obtain plain consent BEFORE
   upload, inspect `{"capability": "voice_clone", "include_activation_required": true}`
   without vendor names or internal IDs (choosing an immediate-ready route here,
   or routing noisy isolation / trial activation / deletion to `voice-cloning-studio`),
   and clone on its own six-field card before any slide synthesis.
4. **Narrate the first slides (3–6 pilot pages)** after reading live
   `{"capability": "text_to_speech"}` cards (never hardcoded credit numbers),
   estimating `--pages`, validating each slide free via `beatra.speech.validate`
   (`estimated_duration_seconds`), and showing the six-field production card
   (If stop lists kept scripts/previews/checks at zero extra cost). Pass
   `subtitle_enable: true` when free aligned `SRT`/`VTT` captions are needed
   (never `subtitles` on `speech.synthesize`). Render pilot video (`plan --pages`)
   only when asked.
5. **Narrate the rest and optionally normalize loudness**: approve one six-field
   card for remaining slides page by page (`insufficient_balance` stops the run,
   relays Beatra's message and exact `topup_url` verbatim, and resumes only
   after user top-up confirmation with identical IDs). If unifying audio volume
   across slides (`-14 LUFS`), inspect `{"capability": "audio_process"}`,
   approve its finishing card, and run serialized `beatra.audio.process`
   (`operation: "normalize_loudness"`, **`source`** field, `<= 60 min` /
   `<= 300 MB` / `>= 1 s` output, `50` calls/day) one track at a time (never call
   finishing free or a mastering service).
6. **Deliver** audio per slide in order, PowerPoint/WPS placement instructions,
   and optional narrated video + SRT, reporting returned durations and summed
   `billing.net_charged_credits`, clearly labelling audio as AI-generated narration.

## Decisions that require confirmation

Every paid call follows its current six-field card in
[Narration workflow](references/workflow.md#production-cards): pilot slides,
remaining deck, Smart Voice Director, voice cloning, and optional loudness
normalization. Scripts, previews, `validate`, and estimates are free and never
constitute approval. Access to a sample file is never consent. A changed slide
script or retake creates new paid work on its own card; a changed pronunciation
reading re-opens every matching slide; a new voice re-opens previously narrated
slides.

## Recovery

Each slide uses one `client_request_id` from the course project while inputs
remain identical. Reconcile lost responses across paginated `beatra.tasks.list`
(`next_cursor`) plus `beatra.tasks.get` before resubmitting anything. A `failed`
or `canceled` task uses `retake` with a new card and new ID. A failed local
video render retries locally at zero cost.

## Account balance

Never make `beatra.wallet.get` a mandatory gate before paid submission and never
ask users to confirm they have enough credits. Only call read-only
`beatra.wallet.get` when asked about balance/fit, and `beatra.wallet.ledger`
when asked what was charged. When a model card returns a `top_up` block, relay
its tiers verbatim in returned order without ranking or picking one.

## References by task

- Read [Speech and audio guide](references/speech-and-audio.md) for cross-tool
  limits, 3 cloning routes, Smart Voice Director, and production-card standards.
- Read [Narration workflow](references/workflow.md) for production cards,
  payloads (`prepare_script`, `validate`, `synthesize`, `normalize_loudness`),
  PowerPoint/WPS placement, cloning, and delivery.
- Read [Deck files](references/deck-files.md) when reading slides, exporting
  slide images, or installing optional deck helpers.
- Read [Lesson video assembly](references/lesson-video.md) for the course
  project, readings, subtitles, layouts, AI badge, and local rendering.
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
  only when the user asks to stop using it and remove credentials.

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
