---
name: "lecture-video-maker"
description: "Turn a teacher's slide deck and lecture notes into a whole course of lecture videos. Each slide gets the teacher's own voice or a chosen narrator and subtitles, a digital-human teacher can open and close lessons, and every knowledge point becomes one course video. From PowerPoint to video or slides to video, it suits online courses, MOOCs, training video series, and recorded classes."
---

# Lecture Video Maker

Turn a teacher's slide deck or lecture notes into a whole course of lecture
videos: the slides on screen, the teacher's own voice or a chosen voice,
subtitles, and a digital-human teacher only where the teacher wants one.

## What you get

- One MP4 per lesson, 1920×1080, in teaching order; by default one lesson
  per knowledge point, 5–15 minutes each.
- Subtitles on screen in every video, and one SRT subtitle file per lesson
  beside its MP4 (or the SRT alone, for a platform that takes subtitles as a
  separate file).
- The spoken script for every slide, approved by the teacher before any
  voice is made.
- A course list: each lesson's title, length, and status.
- On request, audio only: each lesson's narration as one file per slide
  (`out/L01-audio/p001.mp3`, …) in slide order, labelled as AI-generated in
  its metadata.

## Ways to run it

- **Slides and voice (default).** Each slide stays on screen while the voice
  explains it, with the subtitles shown on screen. The teacher's photo can sit
  in a corner.
- **With an on-camera opening.** A digital-human teacher made from one
  authorized photo opens and closes each lesson, or only each chapter.
- **Audio only.** Each lesson's narration as one file per slide
  (`out/L01-audio/p001.mp3`, …) in slide order, with no video render.
- **The teacher's own voice.** Cloned once from a clean sample, then used for
  the whole course.

## Scope and adjacent routes

Use it for a course, a training program, or a knowledge-product series: many
lessons in one consistent voice. For one single micro-lesson, Micro-Lesson
Maker is the lighter route. When the teacher has no slides yet and wants them
made, AI Courseware Maker builds the deck first. For one presenter clip with
no slides, Talking Avatar & AI Presenter Video is the route. Point to another
Skill with the install message in
[Course video workflow](references/workflow.md#pointing-to-another-skill)
and install it only after the user asks.

## Inputs and defaults

Hard inputs:

- the deck: a `.pptx`, a PDF, or a folder of slide images exported from
  PowerPoint or WPS; or final lecture text when there are no slides, which
  gives audio only here (for video, AI Courseware Maker builds a deck first);
- the lesson order (one lesson per chapter or per knowledge point);
- the spoken language.

Ask for these only when they change the result: the teacher's photo and the
right to use that likeness (corner photo or on-camera opening), a voice sample
and the speaker's consent (the teacher's own voice), and readings for
recurring names, terms, formulas, and acronyms.

Defaults: slides and voice; a catalog voice that suits the subject until the
teacher chooses their own; the slide's speaker notes as its script when they
exist, otherwise a script written from what the slide shows, in the teacher's
register; 1920×1080 output; the Chinese AI badge for Chinese courses and the
English one otherwise. Never add facts the slides and notes do not support;
mark the gap for the teacher instead.

## Golden path

Run every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.
Slides are read and videos are assembled on this computer with the bundled
scripts in [Deck files](references/deck-files.md) and
[Lesson video assembly](references/lesson-video.md).

1. **Read the deck.** Extract each slide's text and notes and one image per
   slide, then create the course project, split into lessons in the order the
   teacher gave: one lesson per knowledge point (uneven slide ranges), one
   lesson per deck when the teacher has a deck for each lesson, or fixed
   chunks. Show the lesson outline and settle it before anything is
   narrated; the grouping is fixed once narration starts. From lecture text
   alone, each paragraph becomes one page.
2. **Write the scripts.** Fill every page's script in the teacher's register
   and the chosen style: rigorous lecture, warm explanation, or concise. Show
   the first lesson's scripts and the reading list. Nothing is submitted.
3. **Pilot about three minutes.** Pick the voice, read the live speech card,
   estimate only the pilot pages (`--pages`), and show the production card
   for those pages. After the user agrees, narrate those pages one at a time,
   record each, render only those pages locally (`plan --pages`), and
   deliver the pilot. From lecture text alone, the pilot is those pages'
   audio files.
4. **Settle the voice and the presence.** Offer, each as its own card: cloning
   the teacher's voice (consent first) and on-camera openings and closings
   from one authorized photo. The corner photo needs no card. Pages already
   narrated in another voice are narrated again in the new one.
5. **Batch the course.** Show the whole-course estimate once. Then, chapter
   by chapter, show that chapter's scripts (free) with its card (each lesson a
   line, with its pages and estimate) and wait for the teacher's changes
   before narrating it. Narrate page by page in lesson order, record each
   page, render each finished lesson, and report progress per lesson. On
   `insufficient_balance`, stop the whole batch, relay that error's message
   and URL, and resume at the next page without narration only after the user
   says they topped up.
6. **Deliver.** One MP4 per lesson in teaching order, its subtitles on screen
   and its SRT beside it, plus the course list,
   the actual durations, and the summed `billing.net_charged_credits`. Every
   video carries the AI badge and metadata. For audio only, deliver the tagged
   copies from `plan --audio-only` and say they are AI-generated narration.

## Decisions that require confirmation

- Every paid call follows the current production card in
  [Course video workflow](references/workflow.md#production-cards): pilot
  narration, voice cloning, on-camera clips, and each chapter of the batch.
  Scripts, estimates, and the pilot plan are free and are not approval.
- Likeness and voice: the teacher's own, or with the speaker's permission.
  Access to a file is not consent.
- A changed script is new narration for that page only, on its own card; a
  changed reading applies to the whole course and is new narration for every
  narrated page that contains the term, so run `estimate` first and quote how
  many pages it re-opens; a new voice is new narration for every page already
  narrated. Re-render the lesson without narrating unchanged pages again.

## Recovery

Each page's narration has one `client_request_id` from the course project; it
stays the same while the script, reading, voice, and take are unchanged.
Recover a lost response with `beatra.tasks.list` and `beatra.tasks.get`; never
submit a page again while its task may exist. A failed render is local: fix the reported
step and run it again with no paid call. A narration task that ends `failed`
or `canceled` gets `retake` for that page and a new card; its ID is never sent
again.

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

- Read [Course video workflow](references/workflow.md) for production cards,
  payloads, the pilot, batching, cloning, on-camera clips, and delivery.
- Read [Deck files](references/deck-files.md) when reading slides, exporting
  slide images, or installing the reader's optional helpers.
- Read [Lesson video assembly](references/lesson-video.md) for the course
  project, readings, subtitles, layouts, the AI badge, and rendering.
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
  only when the user asks to stop using it and remove its credentials.

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
