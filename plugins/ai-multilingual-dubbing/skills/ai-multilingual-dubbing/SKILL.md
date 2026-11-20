---
name: "ai-multilingual-dubbing"
description: "Create multilingual voice-over audio from prepared scripts for videos, product launches, e-learning, training libraries, creator content, and international campaigns. This AI multilingual dubbing workflow organizes every market and segment, helps choose a locale-ready voice, pilots pronunciation and timing, and delivers reviewable narration by language. Use it for AI video dubbing audio, AI video translation audio, video localization voice-over, training video localization, global marketing narration, text to speech in multiple languages, or Chinese, English, and Japanese dubbing. Receive narration tracks organized by language, market, and segment, ready for localization editing, lip-sync production, training libraries, and campaign assembly."
---

# AI Multilingual Dubbing

Create organized, loudness-consistent localized narration or speech-converted
tracks for every target market from approved scripts or authorized source
recordings. Reuse the message, destination, languages, voice direction,
segment boundaries, and timing targets already visible in the conversation. Move
by the shortest route to a representative pilot per locale, then produce the
remaining approved cells.

## Start from source transcripts or approved spoken scripts

Build a `segment × locale` production matrix. Each cell records the locale and
normalized BCP-47 tag, approved text (or source conversion cell), protected
terms, pronunciation notes, exact `voice_id`, delivery direction, format,
timing target, and status. Use natural segments such as a scene, lesson,
chapter, ad, or publishable message—never a mid-sentence split.

- If the source exists only as audio or extracted video audio and you need a
  base script with timestamps, check `beatra.models.list` with
  `{"capability": "speech_to_text"}`, present a six-field production card, and
  after approval call `beatra.audio.transcribe` (upload local media via
  `scripts/mcp_client.py upload` first; pass **`audio`**, not `source`, plus
  optional `subtitles: true`, `diarize`, `num_speakers`, `tag_audio_events`,
  `language`). Keep the returned transcript strictly as draft text until the
  user approves localized spoken copy.
- When localization or adaptation is requested, preserve product names, claims,
  numbers, units, URLs, and calls to action, and preserve simplified/traditional
  characters and dialect wording unless asked. Do not claim professional or
  native-language review unless the user supplies that fact.
- Never manually strip `/` pause tags or invent bracketed vocal-effect cues. When
  dramatic pacing or breathing cues help a localized performance, inspect
  `{"capability": "speech_script"}`, approve its six-field card, and run
  Smart Voice Director (`beatra.speech.prepare_script`), passing
  `scripts[i].synthesis` unchanged plus a fresh `client_request_id` (and fixing
  any `synthesis: null` from `warnings`). Re-calling `prepare_script` within
  48 hours with exact same `input`/`instructions`/`language`/`context` changing
  only `voice` or `model` recompiles at zero extra charge (balance cover & max-2
  concurrency limits still apply; never call `prepare_script` generally free).

Read [speech and audio guide](references/speech-and-audio.md), [matrix
design](references/matrix-design.md), and [locale readiness and
quality](references/locale-readiness-and-quality.md) before casting or sizing
batches.

## Cast voices, clone authorized talent, or convert existing speech

Reuse an accepted `voice_id` after verifying its live card via
`beatra.voices.list`. Search candidates using all 11 capability filters
(`category`, `language`, `gender`, `age_group`, `use_case`, `emotion`,
`supports_context`, `supports_direction`, `supports_performance_tags`,
`supports_dialogue`, `supports_speech_to_speech`), confirm `status == "ready"`,
and audition free with `preview_url` or `beatra.voices.preview`
(`{"voice_id": "..."}`). Never pay to audition voices.

- **Authorized voice cloning (`beatra.voices.clone`)**: confirm plain speaker
  consent BEFORE any `scripts/mcp_client.py upload`. If a sample carries
  background noise or music, offer paid pre-cleaning first via
  `beatra.audio.process` (`operation: "isolate_voice"`, **`source`** field,
  4.6 s–5 min, <= 100 MB, checked via `{"capability": "audio_voice_isolation"}`).
  Select the clone model as described in [speech and audio
  guide](references/speech-and-audio.md) §5. When the cloned voice will be the
  target of speech-to-speech conversion, select the `voice_clone` model card that states it.
  Then show the six-field clone card with the live clone price, describing the clone by what it does for the dub and naming no model ID or provider; after the user
  approves it, submit once and handle any refusal per [billing, errors, and
  recovery](references/billing-errors-and-recovery.md). When a clone result or a
  listed voice has status `pending_activation`, follow §5 Step E of [speech and
  audio guide](references/speech-and-audio.md) before using the voice. When the user
  wants to edit or delete a cloned voice (`voices.update`, `voices.delete`),
  verify `scripts/mcp_client.py tools` and hand that step to
  `voice-cloning-studio` or `beatra-ai-voice-studio`.
- **Speech-to-speech delivery transfer (`beatra.speech.convert`)**: when
  preserving source delivery timing and cadence across a target voice, confirm
  rights to transform the source recording, check
  `{"capability": "speech_to_speech"}` and verify target voice has
  `supports_speech_to_speech: true`, approve its six-field card, and pass
  **`audio`** (not `source`) with optional `remove_background_noise`.

For TTS synthesis, default to `model: "auto"` (only when every live
voice-compatible candidate supports the normalized BCP-47 primary tag, mapping
`nb` -> `no`, `tl` -> `fil`), speed `1.0`, `mp3` (or `wav`/`flac` for studio
editing), no emotion, and unchanged pitch/volume/sample rate. Call
`beatra.models.list` (`{"capability": "text_to_speech"}`) before deciding models
or estimating `beatra_weighted_characters` (Han = 2, others = 1). Never
hardcode credit figures. Always run free `beatra.speech.validate`
(`estimated_duration_seconds`) before each paid `beatra.speech.synthesize`. Use
`subtitle_enable: true` (NEVER `subtitles`) when free aligned `SRT` / `VTT`
captions are needed for editing or lip-sync alignment.

## Confirm pilots, full scope, and loudness finishing

Planning, copy drafting, voice search, `voices.preview`, `speech.validate`, and
estimates are free. Before any paid step (`audio.transcribe`, `prepare_script`,
`isolate_voice`, `voices.clone`, `speech.convert`, `speech.synthesize`, or
`normalize_loudness`), present its six-field production card: Route & Model,
Exact Scope, Price & Basis, Duration / Quantity, Pay Mode & Call Count, and
If stop (stating clearly what free assets stay usable at zero extra cost).

For multi-cell localization, pilot one high-risk segment per locale first
(names, numbers, offers), compare returned duration against target timing, and
approve the remaining matrix card explicitly afterward. When unifying output
volume across languages (e.g. `-14 LUFS`), inspect
`{"capability": "audio_process"}`, approve its finishing card, and run
serialized `beatra.audio.process` (`operation: "normalize_loudness"`, **`source`**
field, <= 60 min / <= 300 MB / >= 1 s output, 50/day cap) one track at a time.
Never claim finishing is free or present it as a mastering service.

Create one stable opaque `client_request_id` per logical paid cell, submit once,
and poll only that `task_id` via `beatra.tasks.get` (stopping active wait at 30
min if no `deadline_at` is set). The bundled client handles non-billable
installation registration automatically.

## Use the bundled MCP Client

Use only this Skill's bundled `scripts/mcp_client.py` for every remote MCP
operation (`call` passing one JSON object on stdin, or `upload` for local
media). Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback. For exact commands and troubleshooting, use
[Bundled MCP Client diagnostics](references/mcp-connection.md).

## Recover the task, handle balance, and deliver audio

Never make `beatra.wallet.get` a mandatory gate before paid submits and never ask
users to confirm they have enough credits. Call read-only `beatra.wallet.get`
when asked about balance/fit and `beatra.wallet.ledger` when asked what was
charged; relay `top_up` tiers in returned order verbatim. On
`insufficient_balance`, relay Beatra's message and exact `topup_url` verbatim,
wait until the user confirms topping up, and replay the exact frozen payload
with the same `client_request_id`. If the refusal names another way forward,
present it too and follow [billing, errors, and
recovery](references/billing-errors-and-recovery.md).

If a task ID is lost, paginate `beatra.tasks.list` across `next_cursor` and
inspect candidates via `beatra.tasks.get`. Any changed text, voice, language,
model, control, or LUFS target creates a new card, approval, and
`client_request_id`. Deliver returned URLs, `artifact_id`, MIME type, duration,
optional subtitles, resolved model, and `billing.net_charged_credits` grouped
by locale and segment without claiming listening review or exact lip-sync
unless verified. See [recovery and delivery](references/recovery-and-delivery.md).

## References by task

- Cross-tool limits, voice cloning, Smart Voice Director, and field truth: [speech and audio guide](references/speech-and-audio.md)
- Matrix, segmentation, casting, defaults, and pilots: [matrix design](references/matrix-design.md)
- Source transcription draft rules, STS, subtitle/loudness finishing, and quality: [locale readiness and quality](references/locale-readiness-and-quality.md)
- Exact retry, cancellation, terminal results, and delivery: [recovery and delivery](references/recovery-and-delivery.md)
- First installation or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Bundled MCP Client commands and diagnostics: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Installation registration behavior: [installation registration](references/installation-registration.md)
- Task lookup and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, uncertain submissions, billing, and errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting the installation: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Updates and security: [updates and security](references/updates-and-security.md)

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
