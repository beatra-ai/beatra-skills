---
name: "micro-lesson-maker"
description: "Make a micro-lesson video from one lesson's slides or a single topic. When there are no slides it drafts them first, then writes the script page by page and adds narration, subtitles, and the teacher's photo or a digital-human opening, delivering a 5-to-10-minute lesson video. For micro-lesson contests, demo lesson recordings, flipped classroom video, review lessons, and short explainer video for students."
---

# Micro-Lesson Maker

Turn one lesson's slides, or one knowledge point and a grade, into a finished
micro-lesson video: the slides on screen, a clear spoken explanation,
subtitles, and the teacher's photo or a digital-human opening when wanted.

## What you get

- One MP4, 1920×1080, 5–10 minutes by default, with its subtitles on screen
  and its SRT subtitle file beside it.
- Free `output.subtitles` (`JSON`, `SRT`, `VTT`) plus `speech_start_seconds`
  and `speech_end_seconds` from `beatra.speech.synthesize` (`subtitle_enable: true`)
  at zero extra charge for on-camera clips and standalone slide audio checks.
- The spoken script for every slide, approved before any voice is made.
- When there were no slides: an editable 6–10-slide deck (`.pptx`) built from
  the lesson outline.
- On request, audio only: the lesson's narration as one file per slide
  (`out/L01-audio/p001.mp3`, …) in slide order, labelled as AI-generated in
  its metadata.

## Ways to run it

- **From the teacher's slides (default).** Each slide stays on screen while
  the voice explains it, with the subtitles shown on screen.
- **From a topic.** A short deck is drafted first (lead-in, explanation,
  worked example, summary), then the same route.
- **Lesson-design presentation.** For a demo-lesson review, a deck on the
  textbook, learners, objectives, key and difficult points, methods, teaching
  process, and board plan, narrated to the judges or peers.
- **With the teacher on screen.** A corner photo, or a digital-human opening
  (and, if wanted, a closing) made from one authorized photo.
- **The teacher's own voice.** Cloned once from a clean sample, then used for
  every slide.
- **Audio only.** The lesson's narration as one file per slide, in slide
  order, with no video render.

## Scope and adjacent routes

Use it for one lesson: a micro-lesson contest entry, a demo or open lesson, a
flipped-classroom preview, a review lesson. For a whole course of many
lessons, Lecture Video Maker keeps the course list and resumes across
sessions; suggest it when the teacher plans more than five lessons. For a full
illustrated deck without video, AI Courseware Maker. Point to another Skill
with the install message in
[Micro-lesson workflow](references/workflow.md#pointing-to-another-skill) and
install it only after the user asks.

## Inputs and defaults

Hard inputs: the lesson's slides (a `.pptx`, a PDF, or a folder of slide
images exported from PowerPoint or WPS), the topic with grade and subject, or
the final lecture text; the spoken language. Ask only when it changes the
result: the teacher's photo and the right to use it, a voice sample and
consent for the teacher's own voice, and readings of names and terms.

Defaults: 5–10 minutes; the lead-in, explanation, worked example, summary
structure; speaker notes as the script when present, otherwise a script
written from what the slide shows; a catalog voice that suits the grade;
slides and voice, with the corner photo when one was given; the Chinese AI
badge for a Chinese lesson and the English one otherwise. Never add facts the
slides and notes do not support; when drafting from a topic, keep to the
grade's standard content and mark anything uncertain for the teacher.

## Golden path

Use the bundled `scripts/mcp_client.py` for every Beatra call. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.
Slides are read, drafted, and assembled on this computer with
[Deck files](references/deck-files.md) and
[Lesson video assembly](references/lesson-video.md).

1. **Get the slides.** Read the teacher's deck: its text and notes, and one
   image per slide. From a topic, write the outline, show it, build the
   editable deck, and draw its slide images from the outline; only when the
   teacher edits the deck, ask them to export one image per slide instead.
   Then create the course project, one lesson for the whole deck. From
   lecture text alone, each paragraph becomes one page, delivered as audio,
   unless the teacher wants a video and a deck is drafted from the text.
2. **Write the scripts** for every slide in the chosen style (rigorous, warm,
   or concise) and show them with the reading list. Nothing is submitted.
3. **Pick, audition, prepare, and preflight before the first part.** Browse
   voices (`beatra.voices.list`) and audition candidates free with
   `beatra.voices.preview` before committing (or clone the teacher's own voice
   first via `beatra.voices.clone` on its own card with explicit consent). Read `beatra.models.list`
   (`{"capability": "text_to_speech"}`, `{"capability": "speech_script"}`, and
   for on-camera clips `{"capability": "image_to_video"}`). Optionally shape
   pauses and phrasing without altering spoken wording via **Smart Voice
   Director** (`beatra.speech.prepare_script`, paid; max 2 concurrent; 48-hour
   reuse only by re-calling with identical arguments changing `voice`/`model`;
   never invent braced tags). Always run free `beatra.speech.validate`
   (free, no `client_request_id`) alongside `estimate --pages`
   before paid calls, show the card for the pilot slides, narrate one at a
   time keeping `subtitle_enable: true` (default -> free `output.subtitles`
   `JSON`/`SRT`/`VTT`), record each, render locally (`plan --pages`), and
   deliver that part. A lesson made from lecture text alone, or wanted as
   audio only, delivers tagged audio (`plan --pages --audio-only`).
4. **Finish the lesson** after one card for the remaining slides, narrated
   page by page. When adding an on-camera opening (and closing), always run
   free `beatra.speech.validate` first and verify `estimated_duration_seconds`
   fits the live `{"capability": "image_to_video"}` clip ceiling **before**
   paying to synthesize or animate (`beatra.videos.animate`; each clip gets two cards of its own: its
   narration, then the clip). On `insufficient_balance` at any paid step, stop
   the whole run, relay Beatra's official message and verbatim top-up URL
   without altering it, and resume only after the user says they topped up.
5. **Deliver** the MP4 with its subtitles on screen and its SRT beside it,
   the length, and the summed `billing.net_charged_credits`. The video
   carries the AI badge and metadata. For audio only, deliver the tagged
   copies from `plan --audio-only` and say they are AI-generated narration.

## Decisions that require confirmation

- Every paid call follows the current production card in
  [Micro-lesson workflow](references/workflow.md#production-cards): the first
  part, the rest of the lesson, optional `beatra.speech.prepare_script`, voice
  cloning, and the on-camera opening and closing (two cards each). The outline,
  the deck, scripts, voice audition (`beatra.voices.preview`), and
  `beatra.speech.validate` quotes are free and are not approval; stopping at
  a card leaves what is already built usable at zero extra charge.
- **3 mandatory voice safety rules** (when cloning the teacher's voice):
  (1) obtain explicit user confirmation in the conversation that likeness and
  voice belong to the user/authorized teacher with zero impersonation, fraud,
  or unlawful use before passing `consent_attested: true`; (2) query
  `{"capability": "voice_clone"}` to keep immediately `ready` clones (any
  `pending_activation` voice requires separate quote/token/exact-credit
  activation approval per [Speech, Voices, and Audio Finishing](references/speech-and-audio.md));
  (3) cloned voices occupy persistent slots and permanent removal
  (`voices.delete`) requires two-step `paid_slot_warning` +
  `irreversible_notice` confirmation.
- A changed script is new narration for that slide only, on its own card; a
  changed reading applies to the whole lesson and is new narration for every
  narrated slide that contains the term, so run `estimate` first and quote how
  many slides it re-opens; a new voice is new narration for every slide already
  narrated.

## Recovery

Each slide's narration has one `client_request_id` from the course project;
it stays the same while the script, reading, voice, and take are unchanged.
Recover a lost response with `beatra.tasks.list` and `beatra.tasks.get` before
anything is submitted again. A narration task that ends `failed` or
`canceled` gets `retake` for that slide and a new card; its ID is never sent
again. A failed render is local and is re-run with no paid call.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- Read [Micro-lesson workflow](references/workflow.md) for production cards,
  payloads, building a deck from a topic, cloning, the on-camera opening, and
  delivery.
- Read [Deck files](references/deck-files.md) when reading slides, building
  the deck from the outline, exporting slide images, or installing the
  optional helpers.
- Read [Lesson video assembly](references/lesson-video.md) for the course
  project, readings, subtitles, layouts, the AI badge, and rendering.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md),
  [Speech, Voices, and Audio Finishing](references/speech-and-audio.md), and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for speech, cloning, task, and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to stop using it and remove its credentials.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
