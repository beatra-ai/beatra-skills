# Voice Casting and Delivery

Follow this exact flow for every voice selection, script validation, Smart
Voice Director pass, speech synthesis, subtitle capture, and loudness finish.

## 11-dimension voice search and free preview

Call `beatra.voices.list` every time—even when a `voice_id` appeared earlier in
chat—and verify `status == "ready"` plus `language`, `languages_supported`, and
`compatible_models`. Supported filter keys include `category`, `language`,
`gender`, `age_group`, `use_case`, `emotion`, `supports_context`,
`supports_direction`, `supports_performance_tags`, `supports_dialogue`, and
`supports_speech_to_speech`.

When offering voice candidates, audition without spending credits: prefer a
returned `preview_url` when present, or call free `beatra.voices.preview`:

```json
{"voice_id": "voice_exact_id_from_list"}
```

When maintaining an approved reusable voice for ongoing narration, call
`beatra.voices.update` (`voice_id` plus any of `display_name`, `language`,
`gender`, `age_group`, `persona`, `use_case`, `make_default`).

## Language and model rules

Normalize supplied BCP-47 tags by lowercasing the primary subtag and mapping
documented aliases (`nb` -> `no`, `tl` -> `fil`; e.g. `yue-HK` -> `yue`),
checking both `voice.language` and `voice.languages_supported`. Preserve the
user's exact characters and dialect wording—never convert simplified/traditional
characters or swap words unless asked.

Query `beatra.models.list` with exact capability keys (`speech_script`,
`text_to_speech`, `audio_process`) and never pass unsupported parameters or
remembered prices:

- For `model: "auto"` on `text_to_speech`, intersect
  `models.list.auto.candidate_order` with `selected_voice.compatible_models`,
  keeping only live available cards whose `constraints.supported_languages`
  include any supplied normalized language.
- Compatible cards outside `candidate_order` stay explicit-only; propose one
  when the auto pool is empty or incompatible.
- Estimate speech credits dynamically from each live card's `estimate_formula`,
  `unit_price_credits`, `scale`, and `billing_basis: "beatra_weighted_characters"`
  (Han ideographs = 2, others = 1). Quote a single exact estimate if aligned,
  otherwise the honest live range.

## Smart Voice Director (`prepare_script`)

When natural pacing, performance coaching, or structured direction is requested,
check `{"capability": "speech_script"}` via `beatra.models.list`, present a
six-field production card, obtain confirmation, and run:

```json
{
  "input": "Quarterly updates keep shipping smoother across all teams.",
  "voice": "voice_exact_id_from_list",
  "instructions": "Warm, measured corporate narration with brief pause before shipping.",
  "model": "auto",
  "client_request_id": "opaque-prepare-01"
}
```

Do not invent `/` pause hacks or custom bracketed vocal-effect cues. Wait for `prepare_script`
completion and check `directed` and `scripts[]`:

- Pass `scripts[i].synthesis` verbatim (adding only a fresh `client_request_id`,
  and optional `subtitle_enable: true` when requested) into `beatra.speech.synthesize`.
- If `synthesis` is `null`, surface `warnings` and fix text/voice before paying
  for synthesis.
- Re-calling `prepare_script` within 48 hours with the exact same `input`,
  `instructions`, `language`, and `context` while changing only `voice` or
  `model` recompiles at zero extra charge (the account still needs enough
  balance for the initial estimate, and at most 2 concurrent `prepare_script`
  tasks may run). Never describe `prepare_script` as generally free.

## Free validation and speech synthesis

Before every `beatra.speech.synthesize` call, validate parameters and duration
estimate at zero cost with `beatra.speech.validate` (`model`, `voice`, `input`,
`language`, controls — without `client_request_id`). Relay
`estimated_duration_seconds` and fix any incompatibility before charging.

Show the six-field production card (`Route & Model`, `Exact Scope`,
`Price & Basis`, `Duration / Quantity`, `Pay Mode & Call Count`, `If stop`)
before paid execution, then submit once with a fresh `client_request_id`:

```json
{
  "input": "Welcome back to Module Two. Let us walk through the checklist.",
  "voice": "voice_exact_id_from_list",
  "model": "auto",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "opaque-synth-01"
}
```

Use `subtitle_enable: true` for free aligned `SRT`/`VTT` output (never pass
`subtitles`, which `beatra.speech.synthesize` rejects).

## Loudness normalization finishing

When broadcast consistency (`-14 LUFS` or target level) is requested on a
finished narration artifact or uploaded voice track, check
`{"capability": "audio_process"}` via `beatra.models.list`, present a paid
six-field production card, wait for confirmation, and run one serialized
finishing task at a time:

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "artifact_tts_01"},
  "loudness_lufs": -14,
  "format": "mp3",
  "client_request_id": "opaque-norm-01"
}
```

Keep within limits: `<= 60 min`, `<= 300 MB`, output `>= 1 s`, up to `50`
calls/day. Never present this step as a mastering service or claim it is free.
Deliver only returned fields (`type`, `voice_id`, `model`, `audio.*`, `subtitles`,
`task_id`, `billing`).
