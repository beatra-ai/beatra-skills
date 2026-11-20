---
name: "audio-drama-voice-studio"
description: "Give every character in your script its own voice and get the whole scene recorded line by line, in script order, as numbered clips ready to drop into your editor. This AI multi-character voice generator covers audio drama and radio play, dramatised fiction and audiobooks with a cast, dialogue voice over, two-host and panel shows, scripted ads with two roles, and course roleplay scenes: decide who is who first — age, temperament, how far apart the voices should sit — give the narrator a voice of their own, and afterwards re-record just the one line you want to change. Also used for audio drama voice generator work, multi-character voice generator work, multi-speaker audio, dialogue text to speech, script to dialogue audio, AI audio drama, radio play voices, and full cast voiceover."
---

# Audio Drama Voice Studio

Give a script a cast. Assign one voice per character, plan expressive pacing
without rewriting dialogue, record scenes natively with multi-speaker dialogue
or block-by-block synthesis, add scene foley/ambience and `-14 LUFS` finishing
when requested, and hand back ordered clips and aligned subtitles ready to
assemble in your editor.

## What you get

A finished run returns:

- Numbered scene takes (`beatra.speech.synthesize_dialogue`) or per-block clips
  (`beatra.speech.synthesize`), labelled with speaking roles in script order
- A cast sheet: each speaker, age/temperament, how they contrast relative to
  the others, and the opaque `voice_id` kept for the whole piece
- Free aligned subtitles (`output.subtitles`: JSON, SRT, VTT, and dialogue
  `segments[]`) when `subtitle_enable: true` (default; never pass `subtitles`)
- Optional separately confirmed foley/ambience beds (`beatra.audio.generate_sfx`)
  and finished clips (`beatra.audio.process`)
- Actual returned duration, size, MIME type, resolved model, and
  `billing.net_charged_credits` for every delivered clip

It does not mix multiple audio tracks into one layered episode master. Multi-track
timeline mixing and SFX layering stay in the user's editor.

## Ways to run it

- **Cast, direct, and record** — default. Build the cast sheet, optionally run
  **Smart Voice Director** (`beatra.speech.prepare_script`), audition free
  `beatra.voices.preview` clips, validate free with
  `beatra.speech.validate_dialogue` or `beatra.speech.validate`, then synthesize
  scenes via `beatra.speech.synthesize_dialogue` (or segmented
  `beatra.speech.synthesize` when cast limits or isolated-line control require
  it).
- **Add foley, ambience, and loudness finishing** — optional, separately quoted.
  Generate scene foley, stingers, or `loop=true` ambient beds
  (`beatra.audio.generate_sfx`) and run `beatra.audio.process`
  (`isolate_voice`, `normalize_loudness`, `trim`, `fade`). Never call any paid
  finishing or script-direction step free.
- **Add an owned voice** — optional. Pre-clean noisy samples if needed
  (`isolate_voice`), then clone a voice with explicit owner consent and full
  lifecycle confirmations (`consent_attested`, `beatra.voices.activate` when
  `pending_activation`, two-step `beatra.voices.delete`).

Casting, script drafting, `beatra.voices.list`, `beatra.voices.preview`,
`beatra.models.list`, `beatra.speech.validate`, `beatra.speech.validate_dialogue`,
and `beatra.voices.delete` step 1 are free. Smart Voice Director
(`beatra.speech.prepare_script`),
synthesis, dialogue synthesis, cloning, activation, SFX, and
`beatra.audio.process` are paid steps.

## Scope and routing

Use this Skill when a script or dialogue passage needs more than one speaker:
audio drama and radio play, dramatised fiction, audio novels with named roles, a
two-host or panel show, a dialogue-driven course or training scene, a scripted
ad with two or more roles, or an interactive story with distinct characters.

Route a single-narrator book or course to `ai-audiobook-narration`. Route a
podcast episode to `ai-podcast-voiceover`, and a short-video voiceover to
`short-form-voiceover-audio`. Route standalone cloning-only work to
`voice-cloning-studio` when cloning is the whole job; if a character on this
cast needs a cloned voice, clone and manage it right here. Route general
single-voice work to `beatra-ai-voice-studio`, and narrated video with pictures
to `novel-promo-video-maker`.

## Inputs and defaults

The one hard input is the script text. Reuse the genre, era, tone, character
notes, language, and any voice already chosen in the conversation.

Ask only when the answer changes the paid result: who speaks each line, when the
passage is prose with no speaker attribution and the text does not settle it.

Defaults that avoid extra questions:

- One opaque `voice_id` per named character, plus one narrator voice when the
  script has narration.
- Speaker order follows the script; nothing is reordered.
- `model` omitted or `"auto"` unless a capability requires an explicit choice.
- `language` omitted for automatic detection unless the user specifies one or
  the script mixes several.
- `subtitle_enable: true` (never pass `subtitles`) to obtain free timestamps and
  aligned JSON/SRT/VTT subtitles (`segments[]` on dialogue).
- Use native `beatra.speech.synthesize_dialogue` when the scene fits `2–50`
  turns, `<= 2,000` characters, `<= 10` voices with
  `capabilities.supports_dialogue == true`, and `<= 4` ready clones (chunk
  longer scenes cleanly with `previous_text` / `next_text`). Fall back to
  segmented `beatra.speech.synthesize` when cast limits, dialect constraints,
  or single-line isolation apply.

## Golden path

1. Read the script and build the cast sheet: every speaking character, age,
   temperament, relative contrast, and narrator if present. Split the script
   into speaker-attributed turns/scenes (noting `<= 2,000`-char dialogue scenes
   for native `beatra.speech.synthesize_dialogue` or individual blocks for
   `beatra.speech.synthesize`). Show the numbered cast sheet and script layout
   to the user as the free visible deliverable. Planning is not approval.
2. Call `beatra.voices.list` (bilingual `search`, `limit <= 500`, `cursor`, facet
   filters, `supports_dialogue=true` when targeting dialogue, inspecting all `11`
   `capabilities.*` metadata fields) only when voices are still needed or the
   user asks to browse/compare. Run free `beatra.voices.preview` (`preview_url`,
   `kind`) to audition picks and freeze one opaque `voice_id` per role.
3. Optional **Smart Voice Director**: if dramatic beats, pause holds, or
   expressive timing need compilation without changing dialogue words (never
   hand-author braced tags), quote and run paid `beatra.speech.prepare_script`
   (`{"capability": "speech_script"}`, max `2` concurrent; 48-hour same-script
   voice swap reuse when balance covers admission), inspect `directed` and
   `scripts[]` (resolving any `synthesis: null` from `warnings`), then pass
   ready `scripts[].synthesis` unchanged + fresh `client_request_id`.
4. Read live cards via `beatra.models.list` (`text_to_dialogue`,
   `text_to_speech`, `speech_script`, `sound_effects`, `audio_process`,
   `audio_voice_isolation`) and run **free preflight**
   (`beatra.speech.validate_dialogue` for dialogue scenes or
   `beatra.speech.validate` for single blocks) for live pricing, duration
   estimates, weighted characters (Han ideographs = 2, others = 1; linear per
   1,000 with exact fractional charge under 1,000), and warnings.
5. Show one current six-field production card covering the approved scene/blocks
   (plus separate cards or itemized paid lines for any optional SFX or finishing
   steps) and wait. Never treat free planning as approval.
6. Submit each approved call once via bundled `scripts/mcp_client.py` with its
   own opaque `client_request_id` (`beatra.speech.synthesize_dialogue` or
   `beatra.speech.synthesize`, plus optional `beatra.audio.generate_sfx` or
   `beatra.audio.process`) and poll `beatra.tasks.get` until terminal.
7. Deliver ordered clips, speaker labels, free aligned subtitles (`segments[]`),
   actual duration, size, MIME type, artifact ID/URL, resolved model, and
   `billing.net_charged_credits`. Review only audio the host can actually play.

A single-line revision re-runs only the affected line or scene chunk under a new
production card and `client_request_id`, leaving accepted clips untouched. See
[the audio drama workflow](references/workflow.md) and
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md).

## Decisions that require confirmation

Planning, cast sheets, voice previews, and preflight quotes are free and never
constitute approval. Before the first paid call, show a six-field production card:

1. **Work** — exact scene/block scope, voices, language/format/controls, and any
   requested `prepare_script`, `audio.generate_sfx` (`prompt`,
   `duration_seconds` `0.5–30.0`, `loop=true`), or `beatra.audio.process` step
   (`isolate_voice`, `normalize_loudness` `-14 LUFS`, `trim`, `fade`).
2. **Credits** — live rate/quote from `beatra.models.list`,
   `beatra.speech.validate_dialogue`, or `beatra.speech.validate`. Never guess or
   promise an estimate is final.
3. **Count** — exact number of paid calls approval creates. A changed line or
   parameter is a new call.
4. **Identity** — one fresh caller-generated opaque `client_request_id` per paid
   call. Never reuse an ID across clips or changed parameters.
5. **If we stop here** — the cast sheet, script layout, audition picks, and any
   already-delivered clips remain usable at zero extra charge (or nothing paid
   yet before the first submit).
6. **If the balance is insufficient** — relay Beatra's official message and exact
   top-up URL verbatim without modifying the URL, and wait until the user says
   they have topped up before retrying with the same frozen `client_request_id`.

Submit once through bundled `scripts/mcp_client.py`. Poll `beatra.tasks.get`.

Voice cloning requires three separate mandatory confirmations alongside its own
card (`voice_clone`, `voices.activate`, `voices.delete`); a synthesis card never
authorizes cloning, SFX, or finishing steps not listed on that card.

## Using a cloned voice (3 mandatory confirmations)

Follow the full consent and activation flow in
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md):

1. **Confirmation #1 — Consent (`consent_attested: true`)**: obtain explicit
   confirmation in this conversation that the user owns the voice or holds the
   speaker's permission before uploading via `scripts/mcp_client.py upload`.
   Possession of an audio file is never consent.
2. **Noisy sample check (paid)**: if a recording has music, street noise, or
   room echo, propose paid `beatra.audio.process` (`operation="isolate_voice"`,
   `{"capability": "audio_voice_isolation"}`, `4.6 s – 5 min`, `<= 100 MB`) on
   its own card first.
3. **Clone model choice**: select the clone model as described in
   [speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
   §5. When a role speaks in a multi-character dialogue scene or needs
   expressive delivery, select the `voice_clone` model card that states it; otherwise keep the
   default. Then present the six-field clone card with the live clone price;
   after the user approves it, submit `beatra.voices.clone` once and handle any
   refusal per
   [billing, errors, and recovery](references/billing-errors-and-recovery.md).
4. **Confirmation #2 — Activation (`beatra.voices.activate`)**: when a clone
   result or a listed voice has status `pending_activation`, follow §5 Step E of
   [speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
   before using the voice.
5. **Confirmation #3 — Two-step permanent deletion (`beatra.voices.delete`)**:
   when deleting a clone, first call `beatra.voices.delete` with `voice_id`
   only, display `paid_slot_warning`, `irreversible_notice`, and 15-minute
   `token_expires_at`, wait for explicit confirmation, then call step 2 with
   `voice_id` and `confirmation_token`.

Offer the free clone preview only when the user asks to hear the voice before paying, or
when a paid clone is refused and the refusal offers it. Detailed payloads and
sample bounds live in [the audio drama workflow](references/workflow.md).

## Account balance

When the user asks how many credits remain or whether a live estimate fits, call
read-only `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Never make `beatra.wallet.get` a mandatory gate before
submitting, and never ask the user to confirm they have enough credits. If a
model card carries a `top_up` block, relay its tiers verbatim in listed order
without ranking or picking one.

## How this Skill executes

Use the bundled `scripts/mcp_client.py` for every remote Beatra operation: the
MCP tool name is the CLI argument after `call`, and one JSON object goes on
standard input. Never configure or call a host Beatra Connector, and never use
REST/OpenAPI as a fallback. Register the package with
`beatra.installations.register` on first use. Submit paid operations once, then
poll to terminal state.

## Recovery

Save every returned `task_id` immediately and poll with `beatra.tasks.get`;
`queued` and `running` mean wait. Replay a create only when its response is
genuinely unknown and the payload is identical field-for-field under the same
`client_request_id`. If a `task_id` is lost, call `beatra.tasks.list` scoped to
the exact capability (`text_to_dialogue`, `text_to_speech`, `speech_script`,
`voice_clone`, `sound_effects`, `audio_process`, `audio_voice_isolation`), follow
every `next_cursor` across the submission window, confirm candidates with
`beatra.tasks.get`, and stop if ambiguous or if `client_request_id` itself was
lost. Call `beatra.tasks.cancel` only on user request; on `409`, keep polling
the original task. Recover only failed or missing segments while keeping valid
delivered clips untouched. See
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
for exact structured error handling (`voice_model_incompatible`,
`daily_limit`, `insufficient_balance`).

## References by task

- [Speech, voices, cloning, and audio finishing](references/speech-and-audio.md):
  Smart Voice Director, dialogue bounds, 11 voice metadata fields, 3 clone
  confirmations, SFX, audio finishing, and recovery error codes.
- [Audio drama workflow](references/workflow.md): cast sheet, dialogue vs
  segmented payloads, cloning, SFX/finishing steps, recovery, and review.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use and shared credentials.
- [Tasks and results](references/tasks-and-results.md) and
  [billing, errors, and recovery](references/billing-errors-and-recovery.md):
  task, artifact, and billing facts.
- [Bundled MCP Client diagnostics](references/mcp-connection.md): client
  operation and connection diagnostics; do not configure a host Connector.
- Updates and security: [updates and security](references/updates-and-security.md)
- [uninstall and disconnect](references/uninstall-and-disconnect.md): stopping
  use and removing shared credentials.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
