# Locale Readiness and Quality

Prepare localized scripts accurately, preflight every TTS call free, and keep
finishing steps disciplined.

## Source transcription, Smart Voice Director, and STS payloads

- **Transcribe source media (`beatra.audio.transcribe`)**: check
  `{"capability": "speech_to_text"}`, approve its six-field card, and upload
  local files first via `scripts/mcp_client.py upload`. Use **`audio`** (not
  `source`), optional `subtitles: true`, `diarize`, `num_speakers`,
  `tag_audio_events`, and `language`. Never pass an unapproved raw transcript
  straight to synthesis—localize and confirm target text first.
- **Smart Voice Director (`beatra.speech.prepare_script`)**: check
  `{"capability": "speech_script"}`, approve its card, never strip `/` markers
  manually or invent bracketed vocal-effect cues, inspect `directed` / `scripts[]`, resolve
  `synthesis: null` from `warnings`, and pass `scripts[i].synthesis` verbatim
  with a fresh `client_request_id`. Re-calling within 48 hours with identical
  text/instructions/language/context changing only `voice`/`model` recompiles at
  zero extra charge (balance cover and <= 2 concurrent task limits apply).
- **Speech-to-speech (`beatra.speech.convert`)**: check
  `{"capability": "speech_to_speech"}` and `supports_speech_to_speech: true`,
  confirm source speaker permission, approve card, and pass **`audio`** (not
  `source`).

## Free validation, aligned captions, and serialized loudness normalization

- Run free `beatra.speech.validate` (`estimated_duration_seconds`, compatibility)
  before every `beatra.speech.synthesize`.
- Pass `subtitle_enable: true` (NEVER `subtitles`) on `speech.synthesize` when
  aligned `SRT`/`VTT` output helps downstream localization timing.
- Normalize cross-locale track volume via serialized `beatra.audio.process`
  (`operation: "normalize_loudness"`, **`source`** field, `<= 60 min`, `<= 300 MB`,
  `>= 1 s` output, `50` calls/day) checked via `{"capability": "audio_process"}`.
  Never present this step as a mastering service or free. Revise only affected
  locale cells under new cards and new `client_request_id` values.
