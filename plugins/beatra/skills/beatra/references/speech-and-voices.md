# Speech, dialogue, voices, cloning, and audio tools

Use this reference alongside [speech and audio](speech-and-audio.md) for spoken narration, Smart Voice Director preparation, native multi-speaker dialogue, voice discovery/audition/management, 3-route voice cloning, speech conversion, transcription, and sound effects.

## Voice discovery, audition, updates, and deletion

- **`beatra.voices.list`** (free): browse 866 curated presets (`category="preset"`) and account clones (`category="cloned"`, `status`: `"ready"`, `"pending_activation"`, `"expired"`, `"any"`). Filter with bilingual `search` (Chinese or English), facets (`language`, `gender`, `age_group`, `use_case`, `emotion`, `model`), or capability flags (`supports_dialogue`, `supports_speech_to_speech`, `supports_direction`, `supports_emotion`, `supports_performance_tags`, `supports_context`). Inspect all 11 returned `capabilities.*` metadata fields (`supports_direction`, `supported_emotions`, `supports_performance_tags`, `supported_dialects`, `supports_context`, `supports_previous_text`, `supports_next_text`, `supports_pronunciation_pinyin`, `supports_pronunciation_ipa`, `supports_speech_to_speech`, `supports_dialogue`) before matching a voice to synthesis, dialogue, direction, or conversion.
- **`beatra.voices.preview`** (free): fetch an audition sample (`preview_url`, `kind`) so the customer can listen before spending credits.
- **`beatra.voices.update`** (free): update a cloned voice's `display_name`, `gender`, `age_group`, `use_case`, `persona`, or `language`, or set/clear the account default voice (`make_default: true`/`false`).
- **`beatra.voices.delete`** (free, **Mandatory Confirmation #3**): two-step permanent deletion.
  1. Call once with `voice_id` only (**omit `confirmation_token`**). Present the returned `voice`, `paid_slot_warning`, `irreversible_notice`, and 15-minute `confirmation_token` expiry.
  2. Only after explicit user confirmation, call again with `voice_id` and `confirmation_token`. Never chain both steps automatically without waiting for confirmation.

## Prepare expressive scripts cleanly (`beatra.speech.prepare_script` & `beatra.speech.validate`)

For expressive pacing, dramatic pauses, emotion cues, or pronunciation hints, replace manual slash-counting/stripping or raw tag writing with Smart Voice Director:

1. Present the production card (live price from `beatra.models.list` `{"capability": "speech_script"}`, one paid call, `client_request_id`, stop/top-up terms) and get approval.
2. Call `beatra.speech.prepare_script` with `input`, optional `instructions`, optional target `voice`/`model`, `language` (`"auto"` default), optional `context: {"before": ..., "after": ...}`, and `client_request_id`. Smart Voice Director preserves the customer's exact spoken words while planning pauses and expressive delivery matched to that voice's capabilities.
   - Maximum **2 concurrent** `prepare_script` tasks per account.
   - Check returned `directed` and `scripts[]` (`synthesis`, `summary`, `voice_selection`, `alternatives`, `estimate`, `warnings`). Any entry with `synthesis: null` cannot be synthesized as-is — resolve `warnings` first.
   - **48-hour same-script reuse**: to test a different voice within 48 hours on identical wording, instructions, language, and context, call `beatra.speech.prepare_script` again with the same inputs changing only `voice` (and `model` if needed) so Beatra re-compiles at zero additional charge (account balance must still cover initial estimate plus active script tasks).
3. Pass each ready `scripts[].synthesis` object unchanged plus a new `client_request_id` to `beatra.speech.synthesize` — but run free **`beatra.speech.validate`** first.

```bash
python3 scripts/mcp_client.py call beatra.speech.validate
```

```json
{
  "voice": "vc-preset-warm-female",
  "input": "Sunlight reaches the kitchen table before anyone else does.",
  "model": "auto",
  "subtitle_enable": true
}
```

Inspect `valid`, `warnings`, `weighted_characters`, `estimated_duration_seconds`, live `price_credits`, and `execution` (`sync` vs `async`).

## Synthesize single-speaker speech (`beatra.speech.synthesize`)

1. Reuse a voice ID the user selected or pick from `beatra.voices.list` / `beatra.voices.preview`.
2. Run free `beatra.speech.validate`.
3. Call `beatra.speech.synthesize` with the final `voice`, `input`, and `client_request_id`. Keep `subtitle_enable` enabled (`true` by default; never send `subtitles` on `beatra.speech.synthesize`).

```bash
python3 scripts/mcp_client.py call beatra.speech.synthesize
```

```json
{
  "voice": "vc-preset-warm-female",
  "input": "Sunlight reaches the kitchen table before anyone else does.",
  "subtitle_enable": true,
  "client_request_id": "speech-opaque-1"
}
```

Deliver the returned audio link with its duration, format, and size in plain words, and the free subtitle files (JSON/SRT/VTT) when present. Keep the artifact ID, MIME type, `speech_start_seconds`, `speech_end_seconds`, and `integrated_loudness_lufs` in your notes for the next step. Speech billing uses weighted characters (each Han ideograph counts as 2, every other character counts as 1), linear per 1,000 weighted characters without rounding up below 1,000; failed tasks are refunded.

## Native multi-speaker dialogue (`beatra.speech.synthesize_dialogue`)

Use `beatra.speech.synthesize_dialogue` (`{"capability": "text_to_dialogue"}`) when 2 or more speakers interact in one continuous scene:

- Limits: **2–50 turns**, **<= 2,000 total characters per call**, **<= 10 unique voices** with `capabilities.supports_dialogue == true`, including **<= 4 ready cloned voices** (`status="ready"`).
- Always validate first with free **`beatra.speech.validate_dialogue`** before showing the production card and submitting `beatra.speech.synthesize_dialogue`.
- Split longer scripts scene-by-scene (`previous_text` / `next_text` for continuity). If a cast needs > 10 voices, > 4 cloned voices, regional dialects, or non-dialogue voices, fall back to segmented `beatra.speech.synthesize` and assemble in audio/video finishing.
- Returns free speaker-labeled `output.subtitles` and per-turn `segments[]` timing (`start_seconds`, `end_seconds`).

```bash
python3 scripts/mcp_client.py call beatra.speech.synthesize_dialogue
```

```json
{
  "turns": [
    {
      "voice": "vc-preset-host",
      "speaker": "Host",
      "input": "Welcome back to the studio."
    },
    {
      "voice": "vc-preset-guest",
      "speaker": "Guest",
      "input": "Glad to be here today."
    }
  ],
  "subtitle_enable": true,
  "client_request_id": "dialogue-opaque-1"
}
```

## Clone an authorized voice (`beatra.voices.clone` & `beatra.voices.activate`)

Possession of an audio file is not consent:

1. **Optional paid cleanup**: if the recording contains noise, echo, or music, confirm credits via `{"capability": "audio_voice_isolation"}` and run `beatra.audio.process` (`operation: "isolate_voice"`, 4.6 s – 5 min, <= 100 MB) on its own card before cloning.
2. **Mandatory Confirmation #1 (`consent_attested: true`)**: obtain explicit confirmation that the user owns the voice or holds the owner's authorization before uploading or calling `beatra.voices.clone`.
3. **Discover the 3 capability routes**: query `beatra.models.list` with `{"capability": "voice_clone", "include_activation_required": true}`. Match purely by live capability (never hardcode vendor names or concrete model IDs):
   - **Fast everyday clone** (`model: "auto"` default): rapid one-step `status="ready"` clone.
   - **10-language expressive, dialogue & speech-to-speech clone**: capability-matched route supporting 10 languages, `supports_dialogue=true`, and `supports_speech_to_speech=true`.
   - **Free-trial training + paid activation precision clone**: initially creates a `pending_activation` slot so the user can review before paying to activate.
4. Show the six-field production card for `beatra.voices.clone` before minting `client_request_id`, then poll with `beatra.tasks.get`.
5. **Mandatory Confirmation #2 (`beatra.voices.activate`)**: if `beatra.voices.clone` returns `status="pending_activation"`, read the embedded `activation.quote` (`price_credits` / `confirm_credits`, terms, 24-hour `confirmation_token` expiry). If the token is missing or older than 24 hours, call `beatra.voices.activate` with `voice_id` and a `client_request_id` (**omit `confirmation_token`**) for a **free** refreshed quote. Only after the customer explicitly approves both credits and terms, call `beatra.voices.activate` with `voice_id`, `confirmation_token`, `confirm_credits`, and a fresh `client_request_id`, then poll `beatra.tasks.get`.

## Speech conversion, transcription, SFX, and audio finishing

- **Speech-to-speech (`beatra.speech.convert`)**: `{"capability": "speech_to_speech"}`, `audio` (1 s – 5 min, <= 50 MB), target `voice` (`capabilities.supports_speech_to_speech == true`), optional `remove_background_noise: true`. Own production card required.
- **Transcription (`beatra.audio.transcribe`)**: `{"capability": "speech_to_text"}`, `audio` (0.5 s – 60 min, <= 100 MiB), `diarize`, optional `num_speakers` (`1–32`), `tag_audio_events`, `subtitles: true` (JSON/SRT/VTT included). Own production card required.
- **Sound effects & loopable beds (`beatra.audio.generate_sfx`)**: `{"capability": "sound_effects"}`, `prompt`, `duration_seconds` (0.5–30.0 s), optional `loop: true`, `prompt_influence`. Own production card required.
- **Audio finishing (`beatra.audio.process`)**: paid per step (`isolate_voice`, `separate_stems`, `trim`, `loop`, `fade`, `normalize_loudness`, `convert_format` incl. `ulaw_8k_wav` telephony). See [speech and audio](speech-and-audio.md) and [music editing and audio](music-editing-and-audio.md) for duration bounds, `dimensions.stem_mode` matching, daily limits, and one-at-a-time execution rules.

```bash
python3 scripts/mcp_client.py call beatra.audio.generate_sfx
```

```json
{
  "prompt": "Warm rain outside a quiet cafe window, seamless ambience",
  "duration_seconds": 15,
  "loop": true,
  "client_request_id": "sfx-opaque-1"
}
```
