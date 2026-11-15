# Intent and Routing

Voiceover & Narration Studio turns approved text into finished audio while
checking every requested capability against `scripts/mcp_client.py tools`.

## Route selection table

Route focused single-outcome requests to the dedicated package when installed,
and keep mixed, recurring, or audio-finished voiceover jobs here:

| Request pattern | Recommended route |
| --- | --- |
| Single short social, ad, or promo clip | `short-form-voiceover-audio` |
| Full audiobook or chaptered long-form manuscript | `ai-audiobook-narration` |
| Single-host podcast episode | `ai-podcast-voiceover` |
| Supplied multi-language scripts for localization | `ai-multilingual-dubbing` |
| Standalone cloning, trial-first activation (`pending_activation`), or deleting a voice slot | `voice-cloning-studio` |
| Multi-speaker dialogue, speech conversion, transcription, SFX, or stem separation | `beatra-ai-voice-studio` |
| Combined cloning (`ready` route) + narration, noisy sample `isolate_voice`, `prepare_script`, `voices.update`, or `normalize_loudness` | Stay in `voiceover-narration-studio` |

Never pretend an unlisted tool exists inside this package. If the user asks to
activate a `pending_activation` voice or delete an old custom slot and
`beatra.voices.activate` / `beatra.voices.delete` are absent from
`scripts/mcp_client.py tools`, hand that step off to `voice-cloning-studio` or
`beatra-ai-voice-studio`.

## Free planning vs. paid execution

Non-billable steps that require zero confirmation:

- `beatra.installations.register`
- `beatra.voices.list` (11-dimension voice search) and `beatra.voices.preview`
  (free audition clip for a selected `voice_id`)
- `beatra.voices.update` (updating display name, metadata, or default flag)
- `beatra.models.list` (`speech_script`, `text_to_speech`, `voice_clone`,
  `audio_voice_isolation`, `audio_process`)
- `beatra.speech.validate` (`estimated_duration_seconds` and control check)
- Drafting or organizing chapter/language ledgers and showing the six-field
  production card
- Read-only `beatra.wallet.get` and `beatra.wallet.ledger` when explicitly asked
  by the user

Paid steps requiring live model inspection, a clear six-field production card,
and appropriate user approval:

- `beatra.speech.prepare_script` (Smart Voice Director — paid script compilation;
  re-calling within 48 hours with identical `input`, `instructions`, `language`,
  and `context` while switching only `voice`/`model` recompiles at zero extra
  charge, though initial balance check and max-2 concurrency limit still apply)
- `beatra.audio.process` with `operation: "isolate_voice"` (paid pre-clean for
  noisy clone samples, 4.6 s–5 min, <= 100 MB)
- `beatra.voices.clone` (authorized brand/personal voice creation)
- `beatra.speech.synthesize` (aligned SRT/VTT captions via `subtitle_enable: true`
  add zero surcharge to synthesis)
- `beatra.audio.process` with `operation: "normalize_loudness"` (paid finishing,
  run one call at a time, <= 60 min / <= 300 MB / >= 1 s output, 50/day cap)

## Minimum inputs and pilot boundary

Ask only for missing hard inputs:

1. Final approved text or permission to draft/direct speakable copy and show it
   before synthesis.
2. Target language only if supplied or needed for a specific dubbing branch.
3. Plain speaker consent before uploading a local voice-cloning sample.

Long-form manuscripts run one supplied representative pilot block before the
user approves the remaining chapter cards; multilingual batches run one supplied
pilot per distinct voice/language/model route before remaining language cards.
Never synthesize unapproved or invented text.
