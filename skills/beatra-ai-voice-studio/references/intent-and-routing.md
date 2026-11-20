# Intent and Routing

Beatra AI Voice Studio is the flagship full-suite voice and audio hub covering
script direction, TTS synthesis, multi-speaker dialogue, speech-to-speech,
voice cloning and its lifecycle, transcription, SFX, voice isolation, stem
separation, and loudness normalization.

## Route selection table

| Request pattern | Recommended route |
| --- | --- |
| Single standalone short-video, social, or promo read | `short-form-voiceover-audio` |
| Whole audiobook or chaptered one-narrator book | `ai-audiobook-narration` |
| Single-host podcast episode | `ai-podcast-voiceover` |
| Supplied multi-language scripts only | `ai-multilingual-dubbing` |
| One standalone voice clone without multi-tool audio pipeline | `voice-cloning-studio` |
| Dialogue, speech conversion, transcription, SFX, stem separation, noisy sample isolation, loudness normalization, or mixed multi-step voice work | Continue in `beatra-ai-voice-studio` |

## Free planning vs. paid tools

Non-billable steps:

- `beatra.installations.register`
- `beatra.voices.list` (11-dimension lookup) and `beatra.voices.preview`
- `beatra.voices.update` (display metadata & `make_default`)
- `beatra.models.list` (`speech_script`, `text_to_speech`, `text_to_dialogue`,
  `speech_to_speech`, `voice_clone`, `speech_to_text`, `sound_effects`,
  `audio_voice_isolation`, `audio_process`, `audio_stem_separation`)
- `beatra.speech.validate` and `beatra.speech.validate_dialogue`
- `beatra.voices.delete` step-1 warning check
- Optional read-only `beatra.wallet.get` and `beatra.wallet.ledger`

Paid tools requiring a live model lookup and a six-field production card:

- `beatra.speech.prepare_script` (Smart Voice Director; 48h free recompile only
  when `input`, `instructions`, `language`, and `context` match identically and
  only `voice` or `model` changes, subject to balance cover & max 2 concurrent
  tasks)
- `beatra.speech.synthesize` and `beatra.speech.synthesize_dialogue` (aligned
  SRT/VTT captions via `subtitle_enable: true` add zero fee)
- `beatra.speech.convert` (speech-to-speech conversion)
- `beatra.voices.clone` and `beatra.voices.activate`
- `beatra.audio.transcribe`, `beatra.audio.generate_sfx`
- `beatra.audio.process` (`isolate_voice`, `normalize_loudness`, `trim`,
  `loop`, `fade`, `convert_format`, `separate_stems`)

## Approval boundary

A well-specified single `text_to_speech` request—final text, voice or explicit
criteria, and named format/controls—authorizes that single call (show the
six-field card with delivery). Every other billable workflow (cloning consent &
submission, activation, deletion, Smart Voice Director, dialogue, conversion,
transcription, SFX, audio processing, pilots, and batch remainders) stops for
explicit confirmation on its six-field card first. Never synthesize invented
or unapproved copy.
