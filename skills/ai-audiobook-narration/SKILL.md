---
name: "ai-audiobook-narration"
description: "Turn final manuscript or course text into an audiobook with one consistent narrator. This AI audiobook generator and AI audiobook narration workflow organizes chapters, settles names and specialist pronunciations, shapes long-form pacing, helps choose a suitable audiobook narrator, and creates a representative sample before the remaining book. Use it for manuscript-to-audiobook production, chapter-by-chapter audiobooks, course narration, long-text-to-speech, and sample chapters, with up-to-date price estimates, ordered audio delivery, consistent narrator voice, and focused passage refinements."
---

# AI Audiobook Narration

An audiobook is not a long TTS clip. It is a structured deliverable of many
chapterized files. Open on one of three scenes: fiction; nonfiction or course;
or sample-only. Route M4B packaging, translation, and multi-track DAW mixing
out. Keep listing covers (`beatra.images.generate`), narrator cloning from an
authorized sample, native multi-character chapter dialogue scenes
(`beatra.speech.synthesize_dialogue`), optional chapter SFX/ambience
(`beatra.audio.generate_sfx`), and chapter loudness/trim/fade finishing
(`beatra.audio.process`) in this package.

Turn final manuscript or course text into ordered chapter audio. Work as an
audiobook producer: preserve the manuscript's meaning, shape long-form pacing
with **Smart Voice Director** (`beatra.speech.prepare_script`), direct a
consistent narrator or chapter cast, prove the direction with a representative
pilot, and expand only after that pilot is accepted.

## Start with the smallest complete intake

Reuse everything already supplied. Before narration, obtain only the hard
inputs that are still missing:

- final readable text for at least the pilot;
- chapter or section order and the target BCP-47 language or dialect;
- a pronunciation table extracted from the full manuscript for recurring
  names and terms, confirmed by the user before it is frozen;
- a narrator or character sample when the user wants custom cloned voices; and
- title and tone when the user wants a listing cover.

Ask for a missing hard input rather than inventing it. Create a
chapter-and-segment ledger. Preserve intended listening order, label every
segment, and split at chapter, section, scene, paragraph, or sentence
boundaries. Never split mid-sentence. If `beatra.speech.validate` or synthesis
refuses the text as too long, follow the refusal message: split at natural
chapter, section, or sentence boundaries and submit the parts in order. If a
dialogue request is refused as too long, split it at scene or turn boundaries as
the refusal message says. Remove only page-only material the user does not want
spoken. Follow
[chapter production](references/chapter-production.md) for text preparation,
dialogue scenes inside chapters, casting, and the pilot boundary.

## Discover, audition, update, clone, and select model paths

Use `beatra.voices.list` (bilingual `search`, `limit` up to `500`, `cursor`,
facet filters, `supports_dialogue=true` for cast scenes, inspecting all `11`
`capabilities.*` metadata fields) and free **`beatra.voices.preview`**
(`preview_url`, `kind`) so the user can audition candidates at zero charge before
freezing opaque, ready `voice_id` handles. Never submit a display name or guess
from memory. Use free **`beatra.voices.update`** (`display_name`,
`make_default`, `gender`, `age_group`, `use_case`, `persona`, `language`) to
record character/series notes on a saved voice or pin the book's recurring
narrator (`make_default=true`).

When a narrator or character sample is supplied, do not default to cloning
without explicit user intent and full confirmation discipline from
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md):

1. **Confirmation #1 — Consent (`consent_attested: true`)**: require explicit
   user confirmation in the current conversation of voice ownership or
   permission before uploading (`scripts/mcp_client.py upload`). Access to a file
   is never consent.
2. **Sample noise clean (paid)**: if the sample has background music or noise,
   offer paid `beatra.audio.process` (`operation="isolate_voice"`, `source`,
   `{"capability": "audio_voice_isolation"}`, `4.6 s – 5 min`, `<= 100 MB`) on
   its own card first.
3. **Clone model choice**: select the clone model as described in
   [speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
   §5. When a cloned voice will speak in a multi-character dialogue scene,
   select the clone card that states multi-speaker dialogue; a single-narrator
   book keeps the default. Then show the production card with the live clone
   price; after the user approves it, submit once and handle any refusal per
   [billing, errors, and recovery](references/billing-errors-and-recovery.md).
4. **Confirmation #2 — Activation (`beatra.voices.activate`)**: when a clone
   result or a listed voice has status `pending_activation`, follow §5 Step E of
   [speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
   before using the voice.
5. **Confirmation #3 — Two-step permanent deletion (`beatra.voices.delete`)**:
   when deleting a clone, call step 1 (`voice_id` only), display
   `paid_slot_warning`, `irreversible_notice`, and 15-minute expiry, wait for
   explicit approval, then call step 2 with `voice_id` and `confirmation_token`.

Before quoting models or checking language support, call `beatra.models.list`
with the exact capability (`text_to_speech`, `text_to_dialogue`, `speech_script`,
`voice_clone`, `sound_effects`, `audio_process`, `audio_voice_isolation`, or
image generation for covers). For an explicit single-speaker model, require an
available live card in `voice.compatible_models` supporting the requested
BCP-47 language. For `auto`, collect all live available voice-compatible
candidates, compare the primary BCP-47 language against each candidate's
`constraints.supported_languages` (documented aliases only), and retain `auto`
only when every candidate supports the language.

Default to `model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`,
`pitch: 0`, `subtitle_enable: true` (never pass `subtitles` — keeps aligned
JSON/SRT/VTT subtitles and dialogue `segments[]` free), no emotion, and no
explicit sample rate unless required. Choose the pilot where the book is
hardest: dialogue and names for fiction; dense terminology and numbers for
nonfiction or courses. See
[performance, cost, and quality](references/performance-and-quality.md).

## Direct pacing and chapter dialogue scenes

- **Smart Voice Director (`beatra.speech.prepare_script`, `{"capability": "speech_script"}`)**:
  compile long-form pauses, narrative beats, and pronunciation cues from plain
  manuscript text + `instructions` without changing spoken
  manuscript wording and without hand-writing braced tags. Inspect `directed`
  and `scripts[]` (fix via `warnings` if `synthesis` is `null`), then pass
  ready `scripts[].synthesis` unchanged + fresh `client_request_id`. Respect max
  `2` concurrent tasks; within 48 hours on identical wording/instructions/
  language/context, calling `prepare_script` again changing only `voice` (and
  `model`) reuses direction at zero cost (balance must cover admission).
- **Dialog scenes inside chapters (`beatra.speech.synthesize_dialogue`)**: when
  fiction or dialogue chapters use several voices with
  `capabilities.supports_dialogue == true`, run free
  `beatra.speech.validate_dialogue` and generate cohesive multi-cast scenes
  with `beatra.speech.synthesize_dialogue` (when the refusal message says a
  dialogue is too long, split it at scene or turn boundaries with
  `previous_text` / `next_text`). Keep single-narrator continuity if
  preferred, or fall back to segmented `beatra.speech.synthesize` when the cast
  is refused or specialty dialects apply.

## Golden path

Build the chapter ledger and confirm pronunciations. Browse or audition voices
(`beatra.voices.list`, `beatra.voices.preview`, optional `beatra.voices.update`,
or authorized `beatra.voices.clone` + `beatra.voices.activate` when pending).
Optionally run Smart Voice Director (`beatra.speech.prepare_script`) and always
run free preflight (`beatra.speech.validate` / `beatra.speech.validate_dialogue`).
Present the pilot production card and wait for listening review before quoting
remaining chapters in incremental batches. Quote any listing cover
(`beatra.images.generate`), chapter stingers/ambience (`beatra.audio.generate_sfx`),
or `normalize_loudness` chapter finishing (`beatra.audio.process`) separately
on current cards — never call finishing steps free and never auto-retry paid
calls.

## Price and confirm

Free tools: `beatra.voices.list`, `beatra.voices.preview`, `beatra.voices.update`,
`beatra.models.list`, `beatra.speech.validate`, `beatra.speech.validate_dialogue`,
`beatra.voices.delete` step 1, `beatra.tasks.get`, `beatra.tasks.list`,
`beatra.wallet.get`, and
`beatra.wallet.ledger`. Keep `wallet.get` and `wallet.ledger` strictly optional
read-only lookups when the user asks about balance or charges — never make
`wallet.get` a mandatory gate before submit, and never ask users to verify they
have enough credits first.

Paid tools (`beatra.speech.prepare_script`, `beatra.speech.synthesize`,
`beatra.speech.synthesize_dialogue`, `beatra.voices.clone`,
`beatra.voices.activate`, `beatra.images.generate`,
`beatra.audio.generate_sfx`, `beatra.audio.process`) require live pricing and
never reuse remembered credit figures or hardcoded numbers. Count weighted
characters per live card (`beatra_weighted_characters`: Han = 2, others = 1),
or use free `beatra.speech.validate` / `beatra.speech.validate_dialogue`.

A clone approval never authorizes the pilot, a pilot never authorizes remaining
chapters or a cover, and cover/SFX/finishing approvals never authorize speech.
Present a production card with scope/counts, frozen `voice_id`(s) and controls,
live estimate or `auto` range, fresh `client_request_id`(s), what is kept on
stop, and verbatim top-up URL handling on `insufficient_balance`. Wait for
explicit approval before executing.

## Execute, finish, and recover without duplicating paid work

Invoke every remote Beatra tool only through bundled `scripts/mcp_client.py`
(tool name as CLI arg, JSON on stdin). Never configure a host Beatra Connector
and never use REST/OpenAPI as a fallback. See
[Bundled MCP Client diagnostics](references/mcp-connection.md).

Submit each approved request once with its opaque `client_request_id` (`<= 60`
min / `300 MB` / `50 calls/day`, one operation per call for
`beatra.audio.process` `normalize_loudness` `-14 LUFS`, `trim`, `fade`; `prompt`
+ `duration_seconds` `0.5–30.0` + optional `loop=true`, `model: "auto"` for
`beatra.audio.generate_sfx`) and poll `beatra.tasks.get` until terminal.

If a `task_id` is lost, paginate `beatra.tasks.list` by exact capability
(`text_to_speech`, `text_to_dialogue`, `speech_script`, `voice_clone`,
`sound_effects`, `audio_process`, `audio_voice_isolation`), follow every
`next_cursor`, and verify candidates with `beatra.tasks.get`. Replay the same
`client_request_id` only for field-for-field identical JSON when creation was
genuinely unknown. Never auto-retry; changed arguments mint new IDs and new
cards. Follow [delivery and recovery](references/delivery-and-recovery.md) and
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md).

## Review and deliver what actually returned

Deliver every succeeded chapter/scene with `task_id`, audio URL, `artifact_id`,
`duration_seconds`, actual `mime_type`, actual sample rate, `task.links.assets`,
free aligned `output.subtitles` (and dialogue `segments[]`), resolved model,
usage, and returned billing facts in listening order. Do not claim to have
auditioned audio if the host cannot play it. Revise only the smallest failed or
corrected segment under its own card and ID. Preserve multi-track mixing, M4B
assembly, and distribution requirements honestly when routing finishing steps
out.

## Account balance

Answer balance or charge questions with read-only `beatra.wallet.get` or
`beatra.wallet.ledger`. Relay any `top_up` tiers verbatim in listed order
without ranking or selecting one.

## Installation and account operations

Follow [speech, voices, cloning, and audio finishing](references/speech-and-audio.md),
[installation and authentication](references/installation-and-auth.md),
[installation registration](references/installation-registration.md),
[tasks and results](references/tasks-and-results.md),
[billing, errors, and recovery](references/billing-errors-and-recovery.md),
and [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
