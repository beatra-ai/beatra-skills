---
name: "short-form-voiceover-audio"
description: "Turn final short-video scripts into ready-to-edit voiceover audio for TikTok, Reels, YouTube Shorts, product reviews, hook lines, explainers, and ads. This AI voice over generator, AI voice reader, and text-to-speech voiceover workflow makes scripts speakable, helps choose a suitable voice and supported language, and tunes pacing, pauses, names, numbers, brands, and pronunciation. Review the current price estimate, create MP3 voiceover audio, compare the returned duration with the target edit, and place the narration into short-form video, captions, avatar, lip-sync, and publishing workflows."
---

# AI Voiceover for Short Videos

Turn a final short-form script into ready-to-edit narration audio—optionally
directed with Smart Voice Director, pre-checked for duration, paired with free
aligned captions, and loudness-normalized for social feeds. Work as a voiceover
director: preserve the intended claim and hook, make words speakable, freeze one
viable voice and model path, and generate only the exact audio the user approves.

## Establish the smallest complete brief

Reuse everything already supplied. Obtain only missing choices that materially
change the audio:

- the final script, or permission to make a clearly shown speakable edit (or run
  Smart Voice Director when dramatic phrasing helps);
- the platform or use, audience, and tone when they guide the voice direction;
- the target BCP-47 language or dialect only when relevant, plus important
  pronunciations (keep simplified/traditional characters and dialect wording
  verbatim unless asked to change them);
- a duration target when useful, treating it as a review goal rather than a
  guarantee; and
- the output format (`mp3` default; `wav`/`flac`/`opus`/`pcm` if requested) and
  whether free aligned `SRT`/`VTT` captions or `-14 LUFS` loudness normalization
  are wanted.

Platform context guides the voiceover; it is not permission to create or
publish a video. If the user wants only a material script rewrite, show the
spoken draft, obtain approval when its meaning or claims changed, and stop at
the approved script without creating paid audio. Follow [speech and audio
guide](references/speech-and-audio.md) and [voiceover
workflow](references/workflow.md) for script preparation, timing, casting,
pricing, recovery, and handoff.

Never hand-strip `/` pause markers or invent bracketed vocal-effect cues. By default,
prepare one logical short read; do not invent extra hooks, alternate takes, or A/B
variants unless the user approves each separate variant and count in the production
card. If `beatra.speech.validate` or synthesis refuses the text as too long, follow
the refusal message: split at natural sentence boundaries and submit the parts in order.

## Cast free, validate free, and freeze a viable model path

Filter `beatra.voices.list` across its 11 capability and style dimensions
(`category`, `language`, `gender`, `age_group`, `use_case`, `emotion`,
`supports_context`, `supports_direction`, `supports_performance_tags`,
`supports_dialogue`, `supports_speech_to_speech`), match exact `voice_id` and
`status == "ready"`, and audition free using returned `preview_url` or
`beatra.voices.preview` (`{"voice_id": "..."}`). Never synthesize paid audio
merely to audition voices.

Call `beatra.models.list` with exact capability keys (`text_to_speech`,
`speech_script` when using Smart Voice Director, or `audio_process` when
normalizing loudness) before deciding models or quoting estimates. Never name
upstream vendor brands, internal model IDs, or hardcoded credit numbers:

- An explicit model must be live, available, in the frozen voice's
  `compatible_models`, and support any requested normalized BCP-47 primary tag
  (`nb` -> `no`, `tl` -> `fil`).
- For `model: "auto"`, keep only when every live candidate in
  `models.list.auto.candidate_order ∩ selected_voice.compatible_models` supports
  any requested language; otherwise offer live compatible explicit options.
- Use restrained defaults unless needed otherwise: `model: "auto"`,
  `format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`, no forced
  `emotion`, and no `sample_rate`.

## Smart Voice Director, validation, pricing, and loudness normalization

- **Planning, voice previews, and `beatra.speech.validate` are free.**
  `beatra.speech.prepare_script`, `beatra.speech.synthesize`, and
  `beatra.audio.process` (`normalize_loudness`) are paid. Never claim paid
  steps are free.
- **Smart Voice Director (`beatra.speech.prepare_script`)**: when expressive
  hooks or rhythmic pauses would elevate delivery, query
  `{"capability": "speech_script"}`, approve its six-field card first, inspect
  `directed` and `scripts[]`, resolve `synthesis: null` from `warnings`, and
  pass `scripts[i].synthesis` unchanged plus a fresh `client_request_id` into
  synthesis. Re-calling `prepare_script` within 48 hours with exact same
  `input`/`instructions`/`language`/`context` changing only `voice`/`model`
  recompiles at zero extra charge (balance cover and max-2 concurrency limits
  still apply; never describe `prepare_script` as generally free).
- **Mandatory free check (`beatra.speech.validate`)**: preflight every read
  before `speech.synthesize` to check `estimated_duration_seconds` and controls
  at zero cost.
- **Weighted character pricing**: count exact approved text with
  `beatra_weighted_characters` (Han ideographs = 2, others = 1) against the live
  card's `estimate_formula`, `unit_price_credits`, and `scale`. Show the full
  range or upper bound when `auto` spans multiple candidates.

Before any paid call, show one **six-field production card**:

1. Route & Model
2. Exact Scope (script, variant count, captions/loudness step if separate)
3. Price & Basis (weighted-character count and live formula/rate)
4. Duration / Quantity (free `validate` duration target, explicitly not a timing guarantee)
5. Pay Mode & Call Count
6. If stop (exact free assets kept at zero extra charge—such as prepared
   scripts, shortlisted voices/previews, and duration check—with `0` charged if
   this is the first paid step)

One explicit approval of that current card covers its exact listed calls; any
changed text, variant, voice, model, language, control, or LUFS target creates a
new card, approval, and `client_request_id`.

## Execute each approved request once

Use only the bundled `scripts/mcp_client.py` for Beatra operations
(`call <tool-name>` with one JSON object on stdin). Do not configure or call a
host Beatra Connector and do not use REST/OpenAPI as a fallback. For diagnostics,
use [Bundled MCP Client diagnostics](references/mcp-connection.md).

Generate one new opaque `client_request_id` per approved paid call and submit
`beatra.speech.synthesize` once (pass `subtitle_enable: true` when free aligned
`SRT`/`VTT` captions help; NEVER pass `subtitles`):

```json
{
  "voice": "<opaque voice_id>",
  "input": "<exact approved script or segment>",
  "client_request_id": "<new opaque id>",
  "model": "auto",
  "language": "<BCP-47 tag>",
  "format": "mp3",
  "speed": 1.0,
  "volume": 1.0,
  "pitch": 0,
  "subtitle_enable": true
}
```

Poll only the returned `task_id` via `beatra.tasks.get`. When normalizing the
finished read to a social target level (e.g. `-14 LUFS`), inspect
`{"capability": "audio_process"}`, approve its separate finishing card, and run
serialized `beatra.audio.process` (`operation: "normalize_loudness"`, **`source`**
field—never `audio`, `<= 60 min`, `<= 300 MB`, `>= 1 s` output, `50` calls/day
limit) one track at a time. Never present this as free or as a mastering service.

## Recover, manage balance, and deliver only returned facts

If `task_id` was lost, paginate `beatra.tasks.list` across every `next_cursor`
and verify plausible candidates with `beatra.tasks.get`; replay the identical
frozen payload with the same `client_request_id` only when creation remained
genuinely uncertain or after the user confirms topping up an
`insufficient_balance` error (keep Beatra's message and exact `topup_url`
verbatim). Never make `beatra.wallet.get` a mandatory gate before paid submits
and never ask the user to confirm sufficient credits; only call read-only
`beatra.wallet.get` / `beatra.wallet.ledger` if the user explicitly asks, and
relay any returned `top_up` tiers verbatim in returned order. Cancel only at
the user's request.

Deliver actual `task_id`, `audio.url`, `artifact_id`, `duration_seconds`
compared against target, `mime_type`, sample rate when present, optional
`subtitles`, resolved model, usage, and billing (distinguishing missing fields
from numeric zero). Do not claim video editing, avatars, lip-sync, publication,
or exact sync guarantees. Route voice cloning or noisy sample cleanup to
`voice-cloning-studio` / `voiceover-narration-studio`, and multi-speaker
dialogue or SFX to `beatra-ai-voice-studio` (`scripts/mcp_client.py tools` is
authoritative).

## Installation and account operations

For first use and shared guidance, follow [speech and audio guide](references/speech-and-audio.md),
[installation and authentication](references/installation-and-auth.md),
[installation registration](references/installation-registration.md), [tasks and
results](references/tasks-and-results.md), [billing, errors, and
recovery](references/billing-errors-and-recovery.md), and [uninstall and
disconnect](references/uninstall-and-disconnect.md).

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
