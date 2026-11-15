---
name: "ai-podcast-voiceover"
description: "Turn an article, notes, or a finished script into a listener-ready solo podcast episode with a consistent host voice. This AI podcast voice generator and AI podcast narration service adapts supplied material into a speakable podcast script, sets names and specialist terms for clear pronunciation, and creates MP3 podcast audio with natural pacing. Use this podcast voiceover AI and text-to-speech podcast service for article-to-podcast audio, news briefings, expert commentary, and knowledge shows, then carry the host direction into the next episode."
---

# AI Podcast Voiceover

Work as an episode producer for one recurring host or a multi-host show:
begin with the show profile, turn supplied material or a named topic into a
listener-friendly script, prepare expressive pacing with Smart Voice Director,
freeze the host cast and model path, prove a new direction with a short audition
or sample, then synthesize and record the episode audio, optional music bed,
stingers, and loudness finishing.

## Scope and routes

Use this workflow for supplied articles, notes, outlines, newsletters, or final
scripts, and for a topic alone, when they become a solo podcast episode, a
two-host or guest dialogue episode, trailer, opener, closer, or ordered episode
parts. Keep recurring host directions, pronunciation glossaries, and delivery
facts together when the show will continue.

- **Single-host episodes and narration segments**: use
  `beatra.speech.synthesize` (with `beatra.speech.prepare_script` and free
  `beatra.speech.validate`).
- **Multi-host or guest conversations**: use native
  `beatra.speech.synthesize_dialogue` (with free
  `beatra.speech.validate_dialogue`) for cohesive scenes of `2–50` turns and
  `<= 2,000` characters across up to `10` voices with
  `capabilities.supports_dialogue == true` (`<= 4` ready clones). Chunk longer
  episodes scene-by-scene passing `previous_text` and `next_text` across scene
  boundaries, or fall back to segmented `beatra.speech.synthesize` per turn when
  speakers exceed limits or require unsupported dialects.

Route a manuscript or chapter-led course narration to
`ai-audiobook-narration`; a standalone short social, ad, or promo read to
`short-form-voiceover-audio`; and supplied approved scripts across several
languages to `ai-multilingual-dubbing`. When a user wants to clone their own
podcast host or guest voice for this show, clone and manage that voice directly
here (`beatra.voices.clone` / `beatra.voices.activate` / `beatra.voices.delete`);
route standalone clone-only work to `voice-cloning-studio` or
`beatra-ai-voice-studio`. Keep supplied material, episode order, language, and
show direction intact when switching routes.

Keep music beds (`beatra.music.generate`), transition stingers or looping
ambient beds (`beatra.audio.generate_sfx`), and single-file loudness, trim,
fade, or vocal pre-cleaning (`beatra.audio.process`) here as explicitly scoped
paid steps — never send those requests away just because audio finishing is
involved, and never call any paid finishing step free. Route multi-track mixdown
or ducking across tracks, RSS feed hosting, and distribution publishing out to
dedicated post-production or podcast-hosting workflows, keeping the user's
multi-track requirements intact (offer unmixed ordered dialogue/music/SFX
stems only when the user accepts assembling them in their editor).

## Open the show

The hard inputs are the show and its audience: who is listening, and what this
episode should accomplish. Look first for `./<show>/show-profile.json` and
reuse that archive when it exists. Reuse stored directions only after each
frozen `voice_id` is re-validated against the current `beatra.voices.list` and
`beatra.models.list` output. For a new show, establish the intended listener,
host cast, language, recurring opener and closer, pronunciation glossary, and
delivery conventions in a user-owned working directory. Confirm separately if the
user wants intro/outro music (`beatra.music.generate`), transition stingers or
looping ambience (`beatra.audio.generate_sfx`), or broadcast loudness finishing
(`beatra.audio.process`). Follow [the show profile](references/show-profile.md).

## Prepare the episode script

Accept an article, notes, an outline, a final script, or a topic alone and
adapt it into an episode listeners can follow. Start from the show's intended
listener; if supplied material could serve materially different listener goals,
ask for the intended takeaway before drafting. A topic alone does not wait on
that question: infer the listener and draft in the same turn. Otherwise state
the inferred episode focus in the draft for approval. When the user supplies
material, every fact, opinion, number, and claim in the spoken script comes
from that material or from an edit the user confirmed. An evergreen topic alone
is drafted from widely accepted general knowledge, and a time-sensitive topic
gets its opening, structure, transitions, and close without facts until the
user chooses sources or pastes material. The three-way rule is in
[episode script guidance](references/episode-script.md). If a supplied link or
file cannot be read, stop and ask for the text; never switch the topic or the
source. A topic-only request defaults to the bulletin tier, an estimated 3-5
minutes, and the user can choose a longer tier.

Show the episode focus and spoken draft section by section, including the
opening, closer, and pronunciation glossary, then wait for approval before paid
audio is proposed. If the user wants only a script, deliver the approved script
and stop. Use [episode script guidance](references/episode-script.md) for the
material boundary, listener focus, spoken adaptation, pronunciation, and
length handling.

Before synthesizing speech, use **Smart Voice Director**
(`beatra.speech.prepare_script`, `{"capability": "speech_script"}`) when
pacing, pause planning, emotional arc, or pronunciation compilation benefits
from AI speech direction rather than guessing pauses or manually authoring
braced performance tags (never write braced tags by hand).
`beatra.speech.prepare_script` preserves every spoken word untouched, inspects
voice/model capabilities, and returns `directed` plus `scripts[]` (inspect
`warnings` if any `synthesis` is `null`; pass ready `scripts[].synthesis`
unchanged plus a fresh `client_request_id` to `beatra.speech.synthesize`). Keep
at most `2` concurrent `beatra.speech.prepare_script` tasks; within 48 hours for
identical text, `instructions`, `language`, and `context`, calling
`beatra.speech.prepare_script` again changing only `voice` (and `model`) reuses
the earlier direction at zero charge (the balance must still cover admission).

## Freeze voices, optional clones, and model paths

Browse presets and existing clones with `beatra.voices.list` (bilingual
`search`, `limit` up to `500`, `cursor`, plus filters such as `language`,
`gender`, `age_group`, `use_case`, `emotion`, `model`, `supports_dialogue`,
`supports_direction`, `supports_performance_tags`, `supports_context`) and inspect
all `11` `capabilities.*` metadata fields returned for each voice. Call free
`beatra.voices.preview` (`preview_url`, `kind`) so the user can audition voices
before committing credits. Freeze opaque, ready `voice_id` handles — never
submit a display name or guess from memory. Without a live result, do not name
voices, models, prices, or previews.

If the user wants to clone a host or guest voice for this show, follow the three
mandatory confirmations in
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md):

1. **Sample noise check**: if the sample has background music or room/street
   noise, propose **paid** `beatra.audio.process` (`operation="isolate_voice"`,
   `{"capability": "audio_voice_isolation"}`, `4.6 s – 5 min`, `<= 100 MB`) on
   its own production card before cloning.
2. **Confirmation #1 — Consent (`consent_attested: true`)**: require explicit
   user confirmation in the current conversation that they own the voice or hold
   permission to clone it before uploading (`scripts/mcp_client.py upload`).
   Access to a file or public recording is never consent.
3. **Choose among the 3 cloning routes live**: call `beatra.models.list` with
   `{"capability": "voice_clone", "include_activation_required": true}` — fast
   `auto` clone (`status="ready"` immediately), 10-language expressive/dialogue/
   conversion clone, or free-trial precision training (`status="pending_activation"`).
4. **Confirmation #2 — Trial activation (`beatra.voices.activate`)**: if
   `beatra.voices.clone` returns `status="pending_activation"`, show the live
   quote (`activation.quote`, or refresh free with `voice_id` and
   `client_request_id` omitting `confirmation_token` if the 24-hour token
   expires), obtain explicit credit and terms approval, and call
   `beatra.voices.activate` with `voice_id`, `confirmation_token`,
   `confirm_credits`, and a fresh `client_request_id`.
5. **Confirmation #3 — Two-step deletion (`beatra.voices.delete`)**: to delete a
   cloned voice later, first call `beatra.voices.delete` with `voice_id` only
   (no `confirmation_token`), show the returned `paid_slot_warning`,
   `irreversible_notice`, and 15-minute expiry, wait for explicit user approval,
   then call `beatra.voices.delete` with `voice_id` and `confirmation_token`.

Before quoting models or prices, call `beatra.models.list` for the exact
capability (`text_to_speech`, `text_to_dialogue`, `speech_script`,
`voice_clone`, `text_to_music`, `sound_effects`, `audio_process`, or
`audio_voice_isolation`). An explicit model must be current, compatible with
every selected `voice_id`, and support the target BCP-47 language. For `auto` in
single-speaker synthesis, retain only live models in
`models.list.auto.candidate_order ∩ voice.compatible_models` and use `auto`
only when nonempty and every candidate supports the language. Default to
`model: "auto"`, MP3, speed `1.0`, volume `1.0`, pitch `0`, `subtitle_enable: true`
(never pass `subtitles`), and no explicit sample rate or emotion unless needed.
Follow [voice, delivery, and recovery](references/voice-and-delivery.md) and
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md).

## Golden path

Lock the show and audience first. Write the episode for the ear (and attribute
each speaker cleanly for multi-host episodes). Direct complex pacing with
`beatra.speech.prepare_script` when helpful, run free `beatra.voices.preview`
and free `beatra.speech.validate` or `beatra.speech.validate_dialogue`, then
confirm the production card. Prove a new direction with a short sample when
applicable, then run episode synthesis or scene-chunked dialogue. Present any
`beatra.music.generate`, `beatra.audio.generate_sfx`, or paid
`beatra.audio.process` finishing step (`normalize_loudness`, `trim`, `fade`) on
separate cards or itemized paid lines — never fold them into a speech approval
and never label them free.

## Before the connection is ready

When Allow is still pending at the end of a turn, finish and deliver everything
that needs no connection, in the format the user asked for: the show profile,
the full episode script, speaker turns if multi-host, the pronunciation
glossary, three title options, the episode description and show notes, and
estimated chapters. All Beatra MCP calls wait until after Allow. Say in one line
that Allow is the one-time sign-in that connects their Beatra account, not an
approval of any paid card, and that the workflow continues on their next message
after it. Do not fill the gap with another tool or service.

## Price and confirm

Free tools cost zero credits: `beatra.voices.list`, `beatra.voices.preview`,
`beatra.models.list`, `beatra.speech.validate`, `beatra.speech.validate_dialogue`,
`beatra.voices.delete` step 1, tokenless `beatra.voices.activate` quote refresh,
`beatra.tasks.get`, `beatra.tasks.list`, `beatra.wallet.get`, and
`beatra.wallet.ledger`. Keep `beatra.wallet.get` and `beatra.wallet.ledger` as
optional read-only lookups when the user asks about balance or charges — never
make `beatra.wallet.get` a mandatory gate before submit, and never ask the user
to confirm they have enough credits.

Every call to `beatra.speech.prepare_script`, `beatra.speech.synthesize`,
`beatra.speech.synthesize_dialogue`, `beatra.voices.clone`,
`beatra.voices.activate` (with `confirmation_token` and `confirm_credits`),
`beatra.music.generate`, `beatra.audio.generate_sfx`, and `beatra.audio.process`
is paid (never quote hardcoded prices or call finishing steps free). Before the
first paid step, show a clear production card stating all six fields:

1. **Work**: exact capability, text/scene/clip scope, weighted characters or
   clip duration, frozen `voice_id`(s) and settings, plus any music bed, SFX,
   or `beatra.audio.process` operation (`trim`, `fade`, `normalize_loudness`,
   `isolate_voice`).
2. **Credits**: live quote from `beatra.models.list` / `beatra.speech.validate` /
   `beatra.speech.validate_dialogue` (never guess; show range or upper bound
   when `auto` resolves across multiple cards).
3. **Count**: exact number of paid calls approval authorizes (including separate
   scene dialogue chunks or finishing calls).
4. **Identity**: one fresh caller-generated opaque `client_request_id` per paid
   call. Do not automatically retry any paid step; changed parameters require a
   new card and new ID.
5. **If we stop here**: name what the customer keeps at zero additional charge
   (approved script, titles, notes, pronunciation glossary, audition picks, any
   delivered clips, or plainly nothing paid yet before the first submit).
6. **If the balance is insufficient**: relay Beatra's official message and exact
   top-up URL verbatim without modifying the URL, wait until the user confirms
   they have topped up, then retry the same frozen `client_request_id`.

On a first solo episode or after a host/control/language change, begin with a
small paid sample card (opener plus hardest passage). Sample approval never
authorizes the episode; speech never authorizes music/SFX/finishing; and
music/SFX/finishing never authorize speech. A script above 50,000 characters
(single-speaker) or above `2,000` characters / `50` turns (multi-host dialogue)
is split at natural section/scene boundaries with every chunk listed upfront.

## Create, deliver, and record

Lead the reply with the result and format the user asked for; the production
card, route choice, and cost notes follow it and never replace it.

On first use or after the package version changes, make a best-effort
non-billable installation registration (`beatra.installations.register`). Its
failure never blocks the episode workflow.

Invoke every remote Beatra tool only through the bundled
`scripts/mcp_client.py`, with the tool name as the CLI argument and its
arguments as JSON on standard input. Do not configure or call a host Beatra
Connector, and do not use REST/OpenAPI as a fallback. Submit each approved
logical paid request once under its stable request ID, record its returned task
ID immediately, and poll that task with `beatra.tasks.get` until it is terminal.

For optional finishing (`beatra.music.generate`, `beatra.audio.generate_sfx`
with `prompt`, `duration_seconds` `0.5–30.0`, optional `loop=true`, and
`beatra.audio.process` `normalize_loudness` `-14 LUFS`, `trim`, `fade` — up to
`60` min / `300 MB`, min result `>= 1 s`, `50` calls/day, one operation per call),
submit each approved call once under its own frozen card and ID. See
[music editing and audio](references/music-editing-and-audio.md).

Deliver returned episode audio with its real artifact ID, duration, MIME type,
sample rate when present, `speech_start_seconds` / `speech_end_seconds` /
`integrated_loudness_lufs` when present, free `output.subtitles` (including
dialogue `segments[]` when using `beatra.speech.synthesize_dialogue`), resolved
model, usage, and returned billing facts. Re-time chapter timestamps from real
returned durations and subtitle segment timing (zero extra subtitle cost).
Also deliver three title options, the episode description, and show notes; the
closing only recaps what was said. Deliver any music bed, SFX stinger/ambient
loop, or finished audio clip honestly as its own artifact — never claim unmixed
stems are a mixed multi-track final episode. When the host can listen, review
pacing, pronunciations, speaker turns, and loudness fit; otherwise make the
outstanding listening review explicit. Update the user's show ledger if permitted,
or hand the factual record back. For a lost task ID or error recovery, follow
[voice, delivery, and recovery](references/voice-and-delivery.md) and
[speech, voices, cloning, and audio finishing](references/speech-and-audio.md).

## References by task

- Speech capabilities, Smart Voice Director, dialogue bounds, cloning & 3
  confirmations, SFX, finishing, and structured errors:
  [speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
- Drafting from material or a topic, Smart Voice Director prep, titles, notes,
  and chapters: [episode script guidance](references/episode-script.md)
- Starting a show, reusing hosts, or recording an accepted episode and recap:
  [the show profile](references/show-profile.md)
- Choosing voices/models, validating, cloning, pricing, dialogue, recovery:
  [voice, delivery, and recovery](references/voice-and-delivery.md)
- Music duration, trim, fade, and `-14 LUFS` finishing:
  [music editing and audio](references/music-editing-and-audio.md)
- First install or expired authorization:
  [installation and authentication](references/installation-and-auth.md)
- Non-billable package registration:
  [installation registration](references/installation-registration.md)
- Task polling, artifacts, and result fields:
  [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors:
  [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- When the bundled client cannot connect:
  [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Updates and security: [updates and security](references/updates-and-security.md)
- Removing the package or shared credentials:
  [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
