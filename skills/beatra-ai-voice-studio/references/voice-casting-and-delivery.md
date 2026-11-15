# Voice Casting, Audio Suites, and Delivery

Reference every exact MCP capability key, field name (`audio` vs `source`,
`subtitle_enable` vs `subtitles`), and payload layout across the flagship suite.

## 11-dimension voice search, free preview, and metadata updates

Always call `beatra.voices.list` fresh—never trust remembered IDs or invent
voice names before live return—saving `status`, `language`,
`languages_supported`, and `compatible_models`. Filter freely with `category`,
`language`, `gender`, `age_group`, `use_case`, `emotion`, `supports_context`,
`supports_direction`, `supports_performance_tags`, `supports_dialogue`, and
`supports_speech_to_speech`. Audition free via `preview_url` or
`beatra.voices.preview` (`{"voice_id": "..."}`). Update saved voice metadata or
default pin with non-billable `beatra.voices.update`.

## Language normalization and weighted pricing

Normalize supplied BCP-47 tags by lowercasing the primary subtag and mapping
`nb` -> `no`, `tl` -> `fil` (for example `yue-HK` -> `yue`) against
`voice.language` and `voice.languages_supported`. Preserve the user's exact
simplified/traditional characters and dialect vocabulary verbatim unless asked.

For `model: "auto"` on TTS, intersect `models.list.auto.candidate_order` with
`selected_voice.compatible_models`, excluding explicit-only cards, and verify
every candidate's `constraints.supported_languages` covers any supplied
language tag. Estimate speech credits dynamically from `estimate_formula`,
`unit_price_credits`, `scale`, and `billing_basis: "beatra_weighted_characters"`
(Han = 2, others = 1). Never cite remembered rates.

## Smart Voice Director & free validation

Check `{"capability": "speech_script"}` via `beatra.models.list`. Never hand-strip
`/` tags or custom bracketed vocal-effect cues. After card approval, submit
`beatra.speech.prepare_script`, inspect `directed` and `scripts[]`, resolve
`synthesis: null` from `warnings`, and pass `scripts[i].synthesis` unchanged
plus a fresh `client_request_id` to synthesis (48h free recompile holds only for
identical `input`/`instructions`/`language`/`context` changing just
`voice`/`model`, still requiring initial balance cover and <= 2 concurrent
tasks).

Always run free `beatra.speech.validate` (`estimated_duration_seconds`) before
`beatra.speech.synthesize`, and `beatra.speech.validate_dialogue` before
`beatra.speech.synthesize_dialogue`. Use `subtitle_enable: true` ONLY on TTS and
dialogue (never `subtitles`).

## Multi-speaker dialogue (`text_to_dialogue`)

Check `{"capability": "text_to_dialogue"}` and verify speakers support dialogue.
After free `validate_dialogue` and card approval:

```json
{
  "turns": [
    {"voice": "voice_host_1", "text": "Welcome to episode five."},
    {"voice": "voice_guest_2", "text": "Glad to be here—let's unpack the rollout."}
  ],
  "model": "auto",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "opaque-dialogue-01"
}
```

## Speech-to-speech (`speech_to_speech`), transcribe (`speech_to_text`), and SFX (`sound_effects`)

- `beatra.speech.convert` (uses **`audio`**, requires `supports_speech_to_speech: true`, confirm source speaker rights):

```json
{
  "audio": {"type": "artifact", "artifact_id": "artifact_src_01"},
  "voice": "voice_target_sts",
  "remove_background_noise": true,
  "format": "mp3",
  "client_request_id": "opaque-sts-01"
}
```

- `beatra.audio.transcribe` (uses **`audio`** and **`subtitles`**):

```json
{
  "audio": {"type": "artifact", "artifact_id": "artifact_rec_01"},
  "diarize": true,
  "subtitles": true,
  "tag_audio_events": true,
  "client_request_id": "opaque-stt-01"
}
```

- `beatra.audio.generate_sfx`:

```json
{
  "prompt": "Warm wooden door latch closing gently in a quiet library",
  "duration_seconds": 3.0,
  "format": "mp3",
  "client_request_id": "opaque-sfx-01"
}
```

## Audio processing & stem separation (`beatra.audio.process`)

Always use **`source`** (NEVER `audio`) on `beatra.audio.process`:

- **`isolate_voice`** (`{"capability": "audio_voice_isolation"}`, 4.6 s–5 min, <= 100 MB).
- **`normalize_loudness`** (`{"capability": "audio_process"}`, <= 60 min / <= 300 MB / >= 1 s output, 50/day cap; serialize one call at a time; present strictly as loudness normalization, never free or a mastering service), plus `trim`, `loop`, `fade`, `convert_format`.
- **`separate_stems`** (`{"capability": "audio_stem_separation"}` with NO `dimensions` input arg on `models.list`—read `pricing[].dimensions.stem_mode`, <= 10 min, <= 100 MB, 20/day cap):

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "artifact_tts_01"},
  "loudness_lufs": -14,
  "format": "mp3",
  "client_request_id": "opaque-norm-01"
}
```
