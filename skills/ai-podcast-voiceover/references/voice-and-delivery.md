# Voice, delivery, and recovery

## Discover, audition, and freeze voices

Call `beatra.voices.list` to browse presets (`category="preset"`, up to `500`
per page with `cursor`) and owned clones (`category="cloned"`, `status`:
`"ready"`, `"pending_activation"`, `"expired"`, `"any"`), using bilingual
`search` and facet/capability filters (`language`, `gender`, `age_group`,
`use_case`, `emotion`, `model`, `supports_dialogue`, `supports_direction`,
`supports_emotion`, `supports_performance_tags`, `supports_context`). Inspect
all `11` `capabilities.*` metadata fields (`supports_direction`,
`supported_emotions`, `supports_performance_tags`, `supported_dialects`,
`supports_context`, `supports_previous_text`, `supports_next_text`,
`supports_pronunciation_pinyin`, `supports_pronunciation_ipa`,
`supports_speech_to_speech`, `supports_dialogue`) before freezing opaque
`status: "ready"` `voice_id` handle(s). Call free `beatra.voices.preview`
(`preview_url`, `kind`) for zero-cost auditions before paid synthesis. A display
name or prose preference is never a valid submission value.

Before choosing a model, language, or price, call `beatra.models.list` with the
relevant capability filter (`"text_to_speech"`, `"text_to_dialogue"`,
`"speech_script"`, `"voice_clone"`, `"sound_effects"`, `"audio_process"`,
`"audio_voice_isolation"`, or `"text_to_music"`). For an explicit single-speaker
model, require a current available card in `compatible_models` supporting the
requested BCP-47 language. For `model: "auto"`, build the candidate set as
`models.list.auto.candidate_order ∩ frozen_voice.compatible_models ∩ live_available_cards`,
preserving `candidate_order`. The auto set must be nonempty; a live compatible
card outside `candidate_order` is explicit-only. If any auto candidate lacks
the target BCP-47 primary language (using documented aliases only), present
viable explicit choices and wait rather than using `auto`.

Unless the user or show profile requires another supported setting, use
`model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`,
`subtitle_enable: true` (never send `subtitles`), no `emotion`, and no explicit
`sample_rate`. The live card decides all supported controls.

## Optional cloning and 3 mandatory confirmations

Use `beatra.voices.clone` only when the user wants a custom host or guest voice:

1. **Sample noise clean (paid)**: if the recording has music, street noise, or
   room echo, propose **paid** `beatra.audio.process`
   (`operation="isolate_voice"`, `source`, `{"capability": "audio_voice_isolation"}`,
   `4.6 s – 5 min`, `<= 100 MB`, default `wav`) on its own card before cloning.
2. **Confirmation #1 — Consent (`consent_attested: true`)**: require explicit
   confirmation in this conversation that the user owns the voice or holds
   permission to clone it before uploading with
   `scripts/mcp_client.py upload`. Access to a file or public video is never
   consent.
3. **Query 3 routes live**: call `beatra.models.list` with
   `{"capability": "voice_clone", "include_activation_required": true}` — fast
   `auto` clone (`status="ready"` immediately), 10-language expressive/dialogue/
   S2S clone (`supports_dialogue=true`), or free-trial precision training
   (`status="pending_activation"`).
4. **Confirmation #2 — Activation (`beatra.voices.activate`)**: when a clone
   returns `status="pending_activation"`, show the live activation quote
   (`activation.quote`, or refresh free with `voice_id` and `client_request_id`
   omitting `confirmation_token`), obtain explicit approval of credits and terms,
   then call `beatra.voices.activate` with `voice_id`, `confirmation_token`
   (24-hour expiry), `confirm_credits`, and a fresh `client_request_id`.
5. **Confirmation #3 — Two-step deletion (`beatra.voices.delete`)**: deleting a
   clone permanently forfeits its slot. First call `beatra.voices.delete` with
   `voice_id` only, present `paid_slot_warning`, `irreversible_notice`, and
   `token_expires_at` (`15` min), wait for explicit confirmation, then submit
   step 2 with `voice_id` and `confirmation_token`.

## Free preflight, weighted characters, and Smart Voice Director

Planning, script drafting, voice listing, voice previews, model discovery,
`beatra.speech.validate`, `beatra.speech.validate_dialogue`, `voices.delete`
step 1, and tokenless `voices.activate` quote refresh cost **zero credits**.
`beatra.speech.prepare_script`, `beatra.speech.synthesize`,
`beatra.speech.synthesize_dialogue`, `beatra.voices.clone`,
`beatra.voices.activate` (with `confirmation_token` + `confirm_credits`),
`beatra.music.generate`, `beatra.audio.generate_sfx`, and `beatra.audio.process`
are **paid** and must never be described as free.

- **Smart Voice Director (`beatra.speech.prepare_script`)**: pass plain `input`
  (1–50,000 chars), optional `instructions` (`<= 2,000` chars), target `voice`
  and `model`, `language`, optional `context`, and `client_request_id`. Words
  are never rewritten. Inspect `directed` and `scripts[]`: if any `synthesis` is
  `null`, adjust via `warnings`; pass ready `scripts[].synthesis` unchanged +
  fresh `client_request_id` to `beatra.speech.synthesize`. Max `2` concurrent
  requests; within 48 hours on identical wording/instructions/language/context,
  calling `prepare_script` again changing only `voice` (and `model`) reuses
  direction at zero charge (balance must still cover admission).
- **Always run free preflight before synthesis or dialogue**:
  - Single-speaker: call `beatra.speech.validate` (`valid`,
    `weighted_characters`, `estimated_duration_seconds`, live `price_credits`,
    `execution`, `warnings`).
  - Multi-host dialogue: call `beatra.speech.validate_dialogue` (`2–50` turns,
    `<= 2,000` chars per call, `<= 10` `supports_dialogue=true` voices, `<= 4`
    ready clones, `estimated_credits`, `estimated_duration_seconds`, `warnings`).
- **Offline counter rule**: when checking `beatra_weighted_characters` locally
  (two per Han ideograph, one per other character), use only the integer printed
  by the exact script below on plain frozen synthesis text (never hand-count):

```text
python3 -c "import sys;R=((0x3400,0x4DBF),(0x4E00,0x9FFF),(0xF900,0xFAFF),(0x20000,0x2EBEF),(0x30000,0x323AF));t=open(sys.argv[1],encoding='utf-8').read();print(sum(2 if any(a<=ord(c)<=b for a,b in R) else 1 for c in t))" script.txt
```

Without a runtime or live preflight, report only the following line, with `N`
replaced by the estimate, and do not add a second figure beside it:

```text
约 N 字（估算）
```

Apply the live card's `estimate_formula`, `unit_price_credits`, and `scale`
(or live `validate` / `validate_dialogue` output). Show a range or clearly
labelled upper bound when `auto` spans multiple cards.

## Production cards and approval splits

Every paid card states:

- the exact text/scene/clip scope and weighted-character total or clip duration;
- the frozen `voice_id`(s), model choice or `auto` range, BCP-47 language, and
  audio/finishing controls (`format`, `speed`, `volume`, `pitch`, `emotion`,
  `loudness_lufs`, `trim`, `fade`);
- the live pricing basis, formula or preflight quote, unit price or range, and
  estimated credits;
- the exact paid-request count approval creates;
- what the user keeps if they stop here: approved script, titles, notes,
  pronunciation glossary, auditioned picks, and any audio already delivered, or
  plainly nothing paid yet on the first paid step; and
- that a short balance is relayed with Beatra's official message and exact
  top-up URL verbatim, and nothing is submitted until the user says they have
  topped up (do not require `beatra.wallet.get` before submitting).

Wait for explicit approval of the current card. Sample approval never approves
an episode; speech never approves music, SFX, or finishing; and music/SFX/
finishing never approve speech. For a first solo episode or after a voice,
language, or control change, begin with a ~300-character sample combining opener
and hardest passage; an unchanged re-validated profile may go directly to the
episode card.

## Submit, finish, and deliver

Use only the bundled `scripts/mcp_client.py` (tool name as CLI arg, one JSON
object on stdin). Never configure a host Beatra Connector and never fall back to
REST/OpenAPI. Submit each approved request once with a fresh opaque
`client_request_id`:

Single-speaker example (`beatra.speech.synthesize`):

```json
{
  "voice": "<opaque voice_id>",
  "input": "<approved frozen text>",
  "client_request_id": "<opaque request id>",
  "model": "auto",
  "language": "<BCP-47 tag>",
  "format": "mp3",
  "speed": 1.0,
  "volume": 1.0,
  "pitch": 0,
  "subtitle_enable": true
}
```

Multi-host scene (`beatra.speech.synthesize_dialogue`, `2–50` turns, `<= 2,000`
chars, all voices `supports_dialogue=true`, `<= 10` voices, `<= 4` clones; pass
`previous_text` / `next_text` when chunking scenes across calls, or fall back to
segmented `beatra.speech.synthesize` if cast exceeds limits):

```json
{
  "turns": [
    {"voice": "<host_a_voice_id>", "speaker": "Host A", "input": "<turn 1 text>"},
    {"voice": "<host_b_voice_id>", "speaker": "Host B", "input": "<turn 2 text>"}
  ],
  "model": "auto",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "<opaque scene request id>"
}
```

Optional stingers, seamless ambience, and audio finishing (each on its own
approved paid line/card):

- `beatra.audio.generate_sfx` (`{"capability": "sound_effects"}`): `"prompt"`
  (`1–2,000` chars), `"duration_seconds"` (`0.5–30.0`), `"loop": true` for beds,
  `"prompt_influence"` (`0.0–1.0`, default `0.3`), `"format"`, `"model": "auto"`.
- `beatra.audio.process` (`{"capability": "audio_process"}`): `operation` in
  `"normalize_loudness"` (`loudness_lufs` `-30` to `-9`, default `-14`,
  `true_peak_db` `-9` to `0`, default `-1`), `"trim"` (`start_ms`/`end_ms` or
  `target_duration_ms`), `"fade"` (`fade_in_ms`/`fade_out_ms`, `fade_curve`), or
  `"convert_format"` (`<= 60 min` / `300 MB`, min result `>= 1 s`, `50/day`, one
  operation at a time).

Record every returned `task_id` immediately and poll `beatra.tasks.get` until
terminal. Deliver artifact ID, URL, `duration_seconds`, actual MIME type, actual
sample rate when present, `speech_start_seconds` / `speech_end_seconds` /
`integrated_loudness_lufs` when present, free `output.subtitles` (and dialogue
`segments[]`), resolved model, usage, and returned billing facts. When returned
audio is the sample, divide sample character count (not weighted total) by
`duration_seconds / 60` to store `words_per_minute` on the show profile (before
that, estimate at ~225 chars/min; leave unset if `duration_seconds` is
missing). Never claim unmixed dialogue, music, and SFX artifacts are one mixed
episode; if the host cannot play audio, state listening review is pending.

## Balance and error recovery

Keep a local episode ledger with each request's frozen JSON, approval,
`client_request_id`, response, `task_id`, and terminal state (`tasks.list`
neither filters nor returns `client_request_id`). For a lost `task_id`, list by
capability (`text_to_speech`, `text_to_dialogue`, `speech_script`,
`voice_clone`, `text_to_music`, `sound_effects`, `audio_process`,
`audio_voice_isolation`), follow every `next_cursor` in the window, and inspect
candidates with `beatra.tasks.get`; never claim a remote task proved a local ID.

- Only when task creation stays genuinely unknown may the identical JSON be
  replayed under the same `client_request_id`. Any parameter change requires a
  new card and new ID. Never auto-retry paid steps.
- `insufficient_balance`: relay official message + verbatim `topup_url`, wait
  until user confirms top-up, then replay identical payload + ID.
- `voice_pending_activation` / `price_confirmation_required`: fetch or refresh
  24-hour quote via `beatra.voices.activate` (`voice_id` + `client_request_id`,
  omitting `confirmation_token`), confirm credits/terms, then activate.
- `voice_model_incompatible` / `voice_not_found` / dialogue bounds exceeded: run
  `beatra.speech.validate_dialogue`, keep `supports_dialogue=true` voices
  (`<= 10`, `<= 4` clones), chunk `<= 2,000` chars per scene, or fall back to
  segmented `beatra.speech.synthesize`.
- `request_in_progress` / `daily_limit`: poll the existing task rather than
  resending; on `daily_limit`, wait until `00:00 UTC` (`08:00` Beijing time).
- Cancel only on user request (`beatra.tasks.cancel` once, then poll to terminal).
- Wallet questions: call read-only `beatra.wallet.get` or
  `beatra.wallet.ledger`; relay `top_up` tiers in listed order; never derive
  live prices from ledger rows. See
  [speech, voices, cloning, and audio finishing](speech-and-audio.md).
