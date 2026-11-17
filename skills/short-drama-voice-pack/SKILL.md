---
name: "short-drama-voice-pack"
description: "Turn a vertical short-drama episode script into a labeled short drama voiceover pack with one consistent voice per role. This short drama dialogue studio and vertical short drama voiceover shop casts the episode, records every spoken line as labeled clips, and keeps those character voices through the episode so editors can place AI short drama voice and multi-character voiceover without recasting. Use it for short drama voice acting, episode dialogue audio, vertical drama TTS, micro drama voiceover, and serialized short-drama line clips."
---

# Short Drama Voice Pack

Give a vertical short-drama episode a cast and labeled dialogue tracks or
line clips. One voice per role. Deliver the spoken lines for that episode.

## Scope and adjacent routes

Use this Skill when a vertical short-drama episode needs multi-character
dialogue audio with one consistent voice per role, labeled deliverables for the
editor, optional dramatic SFX, and loudness-matched audio.

Route a radio play or literary audio drama to `audio-drama-voice-studio`.
Route a murder-mystery or game dialogue pack to `game-script-voice-pack`. Route video
shots to `ai-short-drama-shot-maker`. Route a personal cloned-voice series
to `voice-clone-series-studio`.

## Inputs and defaults

The one hard input is the episode script with speaker attribution. Role
names alone are not a script: do not invent dialogue. Reuse already-known
genre, language, tone, and voices.

Defaults:

- one voice per named role, plus a narrator when the episode has one;
- line and scene order follows the episode script;
- `language` omitted unless the user asks for a language or the script
  mixes several;
- `model: "auto"` only when every live `voice.compatible_models` candidate
  supports the target language; `format: "mp3"`; `speed: 1.0`;
- `subtitle_enable: true` when captions or timed dialogue scripts are wanted
  (never send `subtitles`; returns free aligned `output.subtitles` plus
  per-turn `segments[]`);
- choose between native multi-speaker scenes (`beatra.speech.synthesize_dialogue`
  with dialogue-capable voices) and per-line block clips (`beatra.speech.synthesize`)
  when editors request separate per-line files or a role needs non-dialogue /
  isolated retakes.

If `beatra.speech.validate` or synthesis refuses a line as too long, follow the
refusal message: split at natural scene or sentence boundaries and submit the
parts in order. If a dialogue request is refused as too long, split it at scene or
turn boundaries as the refusal message says. Never split mid-sentence.

Planning, casting, voice previews (`beatra.voices.preview` / `preview_url`),
and pre-checks (`beatra.speech.validate`, `beatra.speech.validate_dialogue`)
are free. Smart Voice Director (`beatra.speech.prepare_script`), voice cloning
(and paid activation when `status="pending_activation"`), synthesis blocks,
dialogue segments, `beatra.audio.generate_sfx` cues, and `beatra.audio.process`
finishing steps are always paid.

## Custom role voice cloning and confirmations

Clone a role voice only when the user asks:

1. **Mandatory Confirmation #1 (`consent_attested: true`)**: before any upload,
   confirm the speaker owns the voice or authorized this clone. Access to a
   file or video is not consent.
2. **Optional paid noisy-sample cleanup**: if the recording carries set noise
   or background music, check `beatra.models.list`
   (`{"capability": "audio_voice_isolation"}`) and confirm a separate paid
   `beatra.audio.process` (`operation: "isolate_voice"`, `source`, `4.6` s–`5`
   min, `<= 100` MB) line before cloning.
3. Upload a clean `10` s–`5` min (`<= 20` MiB) single-speaker sample via
   `scripts/mcp_client.py upload "<file>" --mime-type <type>`, then call
   `beatra.models.list` with
   `{"capability": "voice_clone", "include_activation_required": true}` to match
   one of the three live clone routes (fast `model: "auto"`, 10-language
   dialogue/speech-to-speech route, or free-trial training + paid activation
   precision clone).
4. Show the Clone production card (route `voice_clone`, tool
   `beatra.voices.clone`, live price, provisional estimate, distinct
   `client_request_id`, stop/insufficient-balance terms — never require
   `wallet.get` before quoting). Submit `beatra.voices.clone` once and poll
   `beatra.tasks.get`:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Role Name",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-role-clone"
}
```

5. **Mandatory Confirmation #2 (`beatra.voices.activate`)**: if
   `beatra.voices.clone` returns `status: "pending_activation"`, show the
   returned `activation.quote` (`confirm_credits` / `price_credits`, terms, and
   `24`-hour `confirmation_token`) on its own Activation card and wait before
   calling `beatra.voices.activate` with `voice_id`, `confirm_credits`,
   `confirmation_token`, and a fresh `client_request_id` (if expired, refresh
   free with `voice_id` + `client_request_id` omitting `confirmation_token`;
   never charge when `status` is already `"ready"`). Freeze the activated
   role's `voice_id`.
6. **Mandatory Confirmation #3 (`beatra.voices.delete`)**: removing a role
   clone runs in two steps — call once with `voice_id` only first (`confirmation_token`
   omitted), show `paid_slot_warning`, `irreversible_notice`, and 15-minute
   token expiry, and wait for explicit approval before step 2.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the episode cast sheet and the line/scene ledger: role ID, line ID,
   spoken text, and intended filename (`ep12_lin_014.mp3` for clips or
   scene segment IDs).
2. Call `beatra.voices.list` (`limit` up to `500`, `cursor` pagination,
   bilingual `search`) when a role still needs a voice, inspecting all 11
   `capabilities.*` metadata fields (`supports_dialogue`, `supports_direction`,
   `supported_emotions`, `supports_performance_tags`, `supported_dialects`,
   `supports_context`, `supports_previous_text`, `supports_next_text`,
   `supports_pronunciation_pinyin`, `supports_pronunciation_ipa`,
   `supports_speech_to_speech`). Share `preview_url` or call free
   `beatra.voices.preview` so the user can audition first. Keep each role's
   `voice_id` fixed for the whole episode. Never put a display name in `voice`.
3. When a dramatic beat needs expressive pacing without altering script words
   or hand-authoring `{...}` brace tags, offer Smart Voice Director
   (`beatra.speech.prepare_script`, priced live via
   `{"capability": "speech_script"}`, max `2` concurrent jobs; inspect
   `directed` and `scripts[]` and verify `synthesis` is non-null (if `null`, resolve via returned `warnings` before calling validate or synthesize); within `48`
   hours on identical `input`, `instructions`, `language`, and `context`,
   re-calling `prepare_script` changing only `voice`/`model` re-compiles at
   zero extra charge when balance covers admission).
4. Price every speech job before showing the production card:
   - For native multi-character scenes (`supports_dialogue=true` voices),
     validate each `turns[]` segment free with
     `beatra.speech.validate_dialogue` against live
     `{"capability": "text_to_dialogue"}` pricing (when the refusal message says
     a scene is too long, split it at scene beats with `previous_text` /
     `next_text` continuity where supported).
   - For per-line labeled clips (`ep12_lin_014.mp3`) or roles without dialogue
     support, validate each block free with `beatra.speech.validate` against
     live `{"capability": "text_to_speech"}` pricing.
   - If the episode card includes dramatic SFX stings or ambient room tone
     (`beatra.audio.generate_sfx` with `{"capability": "sound_effects"}`,
     `model: "auto"`, `duration_seconds` `0.5`–`30`, `loop: true` for ambience)
     or `-14 LUFS` loudness matching / trimming / fades (`beatra.audio.process`
     with `{"capability": "audio_process"}`, `operation: "normalize_loudness"`,
     `"trim"`, or `"fade"`), price and itemize every call on its own line.
   Confirm the cast, line/segment count, live estimates, and one new opaque
   `client_request_id` per paid call before spending credits.
5. Submit each confirmed call once (`beatra.speech.synthesize_dialogue`,
   `beatra.speech.synthesize`, `beatra.speech.prepare_script`,
   `beatra.audio.generate_sfx`, `beatra.audio.process`) and poll
   `beatra.tasks.get` until terminal.
6. Deliver labeled tracks/clips in episode script order with role ID, line or
   scene ID, actual duration, MIME type, URL or artifact ID, aligned
   `output.subtitles` / `segments[]` when generated, resolved model, loudness
   metrics, and `billing.net_charged_credits`.
7. Verify each role keeps its assigned `voice_id` and scene order matches the
   episode script. Redo only changed lines/segments on a fresh card with new
   `client_request_id`s.

## Decisions that require confirmation

Confirm the voice cast, delivery mode (native dialogue segments vs per-line
clips), optional Smart Voice Director, SFX cues, and `audio.process` lines with
live pricing before the first paid call. A changed line, SFX cue, or finishing
tweak is a new paid call on a new ID. Never treat `beatra.audio.process` or
`beatra.speech.prepare_script` as free.

## Failure recovery

On a lost create response, replay only the frozen payload and
`client_request_id` for that exact call. Changing any text or control mints a
new ID. If `task_id` is lost, check `beatra.tasks.list` and `beatra.tasks.get`
before any resend. Cancel only at the user's request. On `409`, keep polling
the same task. On `insufficient_balance`, keep the top-up URL inside the
balance error exact and retry the same frozen ID only after the user says they
have topped up.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `beatra.wallet.get` a required step before every paid
submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- Read [Speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
  for Smart Voice Director, native dialogue, 3 clone confirmations, SFX, and
  audio processing rules.
- Read [Short-drama voice-pack workflow](references/workflow.md) for episode
  ledgers, dialogue/clip payloads, SFX, normalization, and review.
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
