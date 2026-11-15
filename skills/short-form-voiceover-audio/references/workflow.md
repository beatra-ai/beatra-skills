# Short-Form Voiceover Workflow

## Prepare, direct, and preflight the spoken script

Keep the hook near line one and one clear idea per sentence. Expand numbers,
dates, units, brands, and acronyms into natural speech without inventing claims
or modifying simplified/traditional characters or dialect phrasing unless asked.
Never strip `/` pause markers manually or insert custom bracketed vocal-effect cues.

- If dramatic hooks, breaths, or comedic pauses need orchestration, check live
  `{"capability": "speech_script"}` pricing, present a six-field production
  card, and after approval run `beatra.speech.prepare_script`. Inspect
  `directed` and `scripts[]`: handle `synthesis: null` from `warnings`, and
  pass `scripts[i].synthesis` unchanged plus a fresh `client_request_id` into
  `beatra.speech.synthesize`. Re-calling within 48 hours with exact same
  `input`/`instructions`/`language`/`context` changing only `voice`/`model`
  recompiles at zero extra charge (initial balance coverage and <= 2 concurrent
  tasks apply; never describe `prepare_script` as free in general).
- Before any paid synthesis, call free `beatra.speech.validate` (`voice`,
  `input`, `model`, controls—no `client_request_id`) to read
  `estimated_duration_seconds` and check compatibility.

## Cast across 11 dimensions and audition free

Call `beatra.voices.list` (`category`, `language`, `gender`, `age_group`,
`use_case`, `emotion`, `supports_context`, `supports_direction`,
`supports_performance_tags`, `supports_dialogue`, `supports_speech_to_speech`),
confirm `status == "ready"`, and audition candidates at zero cost with returned
`preview_url` or `beatra.voices.preview` (`{"voice_id": "..."}`).

Query `beatra.models.list` with exact capability keys (`speech_script`,
`text_to_speech`, `audio_process`) and never expose upstream vendor names,
internal model IDs, or hardcoded credit figures. Calculate TTS estimates using
`beatra_weighted_characters` (Han = 2, others = 1).

## Exact scope, captions, and broadcast loudness normalization

Keep each variant (hook A/B, locale read) as its own listed line item and
`client_request_id`. Pass `subtitle_enable: true` on `beatra.speech.synthesize`
when free aligned `SRT` / `VTT` captions are useful for short-form video edits
(never pass `subtitles`).

When normalizing audio volume for TikTok/Reels/Shorts (`-14 LUFS`), check
`{"capability": "audio_process"}`, present a dedicated six-field card, wait for
approval, and run one finishing task at a time within limits (`<= 60 min`,
`<= 300 MB`, output `>= 1 s`, `50` calls/day):

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "artifact_short_01"},
  "loudness_lufs": -14,
  "format": "mp3",
  "client_request_id": "opaque-short-norm-01"
}
```

Always pass **`source`** (never `audio`) and never refer to this as "loudness
mastering" or free work. Route custom voice cloning or noisy sample `isolate_voice`
cleanup to `voice-cloning-studio` / `voiceover-narration-studio`.

## Recovery, optional wallet inspection, and factual delivery

Never require `beatra.wallet.get` before quoting/submitting or ask users to
pre-confirm sufficient credits; call read-only `beatra.wallet.get` /
`beatra.wallet.ledger` only if the user asks, and relay `top_up` tiers verbatim
in returned order. On `insufficient_balance`, preserve Beatra's message and
exact `topup_url` verbatim and wait for top-up confirmation before replaying the
exact frozen JSON with the same `client_request_id`. Reconcile lost IDs with
paginated `beatra.tasks.list` (`next_cursor`) + `beatra.tasks.get`. Report only
returned URLs, `duration_seconds`, optional `subtitles`, resolved model, and
billing facts.
