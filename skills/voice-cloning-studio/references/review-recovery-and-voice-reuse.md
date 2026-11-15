# Test-reading review, conversion, and audio finishing

## Keep downstream operations separate from cloning

Clone or activation approval never authorizes speech synthesis, script direction,
speech-to-speech conversion, transcription, or loudness normalization. Always
check live voice compatibility and capabilities with `beatra.voices.list`
(matching exact `voice_id`, bilingual `search`, facet filters, or query
capability filters) and listen freely with `beatra.voices.preview` before paid calls.

Inspect the returned 11 `capabilities.*` metadata fields before planning downstream work:
- `supports_direction`, `supported_emotions`, `supports_performance_tags`
- `supported_dialects`, `supports_context`, `supports_previous_text`, `supports_next_text`
- `supports_pronunciation_pinyin`, `supports_pronunciation_ipa`
- `supports_speech_to_speech`, `supports_dialogue`

Update profile labels or default pinning at zero cost anytime via `beatra.voices.update`.

## Smart Voice Director and free speech preflight

For a short test reading or narration script, use **Smart Voice Director**
(`beatra.speech.prepare_script`, `{"capability": "speech_script"}`) to add
pacing, pauses, and expressive cues from `instructions` **without altering spoken
words**. Never teach manual `/` pause stripping or manually author braced performance
tags. Inspect the returned `directed` flag and `scripts[]`: pass each ready
script's `synthesis` object unchanged with a fresh `client_request_id` to
`beatra.speech.synthesize`, or check `warnings` when `synthesis` is `null`. To
try a different `voice` within **48 hours** for identical wording, instructions,
language, and `context`, re-call `beatra.speech.prepare_script` changing only
`voice`/`model` to re-compile at zero extra charge (wallet balance must still
cover initial estimate); keep concurrency to at most **2 tasks** at a time.
Never describe paid `beatra.speech.prepare_script` calls as free.

Always run **free** `beatra.speech.validate` before submitting `beatra.speech.synthesize`:
verify `valid: true`, inspect `warnings`, `weighted_characters`,
`estimated_duration_seconds`, live `price_credits`, and `execution`.

Then query `beatra.models.list` (`{"capability": "text_to_speech"}`) for voice
compatibility and `constraints.supported_languages`. Present a six-field production
card, obtain explicit confirmation, create a new `client_request_id`, and call
`beatra.speech.synthesize` once with `subtitle_enable: true` (default; never
send `subtitles` on `beatra.speech.synthesize`) so aligned `output.subtitles`
(`JSON`, `SRT`, `VTT`) and `speech_start_seconds`, `speech_end_seconds`, and
`integrated_loudness_lufs` arrive **at zero extra cost**.

## Speech-to-speech performance conversion (`beatra.speech.convert`)

When the user brings a guide vocal performance and wants it spoken in a saved
or cloned voice (`1 s – 5 min`, `<= 50 MB`), ensure the target voice has
`capabilities.supports_speech_to_speech == true`, check live pricing via
`beatra.models.list` (`{"capability": "speech_to_speech"}`), confirm a six-field
card, and call `beatra.speech.convert` using `audio` (and optional
`remove_background_noise: true`, `format`, `stability`, `similarity_boost`,
`style`, `use_speaker_boost`, `seed`):

```json
{
  "audio": {"type": "artifact", "artifact_id": "artifact_..."},
  "voice": "voice_...",
  "model": "auto",
  "remove_background_noise": true,
  "format": "mp3",
  "client_request_id": "new-local-convert-id"
}
```

## Optional transcription and paid loudness normalization

- **Transcription (`beatra.audio.transcribe`):** Query `beatra.models.list`
  (`{"capability": "speech_to_text"}`). Accepts `audio` up to 60 min (`<= 100 MiB`),
  optional `language`, `diarize`, `num_speakers`, `tag_audio_events`, and free
  `subtitles: true` (JSON/SRT/VTT). Ideal for producing verbatim `prompt.text`
  transcripts from clean samples or delivering transcripts alongside cloned audio.
- **Loudness normalization (`beatra.audio.process`):** When the user requests
  platform loudness calibration (`-14 LUFS`, `-1 dB` true peak) after synthesis
  or conversion (`<= 60 min`, `<= 300 MB`, output `>= 1 s`, `50 calls/day`, one
  finishing call at a time), inspect `beatra.models.list` (`{"capability": "audio_process"}`),
  confirm a new six-field card (always paid, never free), and send `operation` + `source`:

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "artifact_..."},
  "loudness_lufs": -14,
  "true_peak_db": -1,
  "format": "mp3",
  "client_request_id": "new-local-process-id"
}
```

## Deliver factual results

Report returned `task_id`, status, media URL, `artifact_id`, duration,
`speech_start_seconds` / `speech_end_seconds`, `integrated_loudness_lufs`,
aligned subtitle links/files when returned, resolved model, usage, and actual
billing (preserving missing fields as unknown, never zero). If playback is
unavailable on the host, state that audio was not auditioned rather than
claiming a listening review. Never re-clone to alter script wording, pace, or
delivery — revise only the affected speech or finishing call after fresh approval.
