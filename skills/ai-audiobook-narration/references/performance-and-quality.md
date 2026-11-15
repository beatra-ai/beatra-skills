# Performance, cost, and quality

## Freeze compatible delivery controls and free subtitles

Use a selected voice's returned opaque `voice_id` as synthesis `voice`. Keep the
accepted voice, valid BCP-47 language, format, and baseline speed stable across
the book. Default to `model: "auto"`, `format: "mp3"`, `speed: 1.0`,
`volume: 1.0`, `pitch: 0`, `subtitle_enable: true` (never pass `subtitles` —
returns JSON/SRT/VTT subtitles and dialogue `segments[]` free of charge), no
emotion, and no explicit sample rate unless required. Check `beatra.speech.validate`
or `beatra.speech.validate_dialogue` for free preflight duration/credit checks
and warnings before confirmation.

## Optional chapter SFX and loudness finishing (paid)

- If chapters call for transition chimes, subtle scene stingers, or looping
  room tone, quote paid `beatra.audio.generate_sfx` (`{"capability": "sound_effects"}`,
  `prompt` `1–2,000` chars, `duration_seconds` `0.5–30.0`, optional `loop=true`,
  `model: "auto"`) on its own itemized paid line/card.
- If chapters need uniform listening loudness across sessions, quote paid
  `beatra.audio.process` (`{"capability": "audio_process"}`,
  `operation="normalize_loudness"`, default `-14 LUFS`, or `trim`/`fade`,
  `<= 60 min` / `300 MB` / `50 calls/day`, one operation at a time) on its own
  paid line/card — never describe finishing steps as free.
- Keep noisy clone sample cleaning (`operation="isolate_voice"`, `4.6 s – 5 min`,
  `<= 100 MB`) and all 3 voice-cloning confirmations (`consent_attested`,
  `voices.activate` on `pending_activation`, 2-step `voices.delete`) strictly
  separate from synthesis. See
  [speech, voices, cloning, and audio finishing](speech-and-audio.md).

The frozen voice's `compatible_models` and the current cards from
`beatra.models.list` are the source of truth. For an explicit model, require a
live available card in that compatible list and verify its language support.
Language is not an `auto` routing input: the service resolves from the voice
before validating language. Begin with all live available voice-compatible
candidates. Compare the primary language of a valid BCP-47 tag with every
candidate's `constraints.supported_languages`, using only documented aliases.
If even one potential candidate lacks the requested language, do not use
`auto`; show the viable explicit models and ask the user to choose one. When all
candidates support it, retain `auto` and use the full candidate set for the
estimate. Do not predict the resolved model; report it after the task returns.

## Calculate the live estimate

For text-to-speech cards using `beatra_weighted_characters`, count every Han
ideograph as 2 billable characters and every other character as 1. For each
applicable card, use its live pricing values exactly:

```text
estimated_credits = (unit_price_credits * billable_quantity) / scale
```

Do not copy an old price or round away a meaningful upper bound. An explicit
model has one applicable estimate. With `auto`, calculate every applicable
voice-compatible card and present the minimum-to-maximum range, or the maximum
as a clearly labeled upper bound. If a required card or pricing field is
missing, state that a reliable estimate is unavailable and do not invent one.

The final production card names the scope and segment count; frozen
`voice_id`, model choice, language, format, sample rate if any, speed, volume,
pitch, and emotion if any; weighted-character quantity; live billing basis,
formula, unit price or range, and estimated credits; and the exact paid-call
count approval will authorize.

## Submit the exact approved request

Every new paid segment uses a new opaque `client_request_id`. Its JSON explicitly
contains `voice`, `input`, and `client_request_id`, plus the frozen optional
fields. Submit it once through the bundled client. Only an uncertain transport
or task-creation result permits replay with the same ID, and the replay JSON
must be identical field for field. Any changed text or control is a new paid
request with a new production card, approval, and ID. Never automatically retry
paid work.

## Review only observable qualities

When the host can play or inspect the returned audio, review:

- intended readings for names, dates, numbers, units, acronyms, and foreign
  terms;
- natural pauses, sustainable pace, and comfort during long listening sessions;
- voice, language, format, and delivery consistency across accepted chapters;
- returned duration and output facts without promising an exact target; and
- chapter labels and order.

When the host cannot hear the audio, explicitly mark it not auditioned and ask
the user to review those qualities. Do not fabricate hearing or quality claims.
Correct only the smallest failed segment and keep accepted audio untouched.

## Review timing targets through a pilot

An exact duration is a review target, not a guaranteed control. Preserve the
target, choose supported speed and delivery controls, and use the smallest
useful segment as the confirmed pilot. Compare returned `duration_seconds` with
the target and state the drift. If an adjustment is worthwhile, propose the
smallest change to speed, punctuation, or segment text that preserves meaning;
the changed request needs a new production card, confirmation, and request ID.

If the user asks for multiple voices inside chapter dialogue scenes, first check
whether `beatra.speech.synthesize_dialogue` fits (`2–50` turns per call,
`<= 2,000` chars chunked with `previous_text`/`next_text`, `<= 10`
`supports_dialogue=true` voices, `<= 4` ready clones) after running free
`beatra.speech.validate_dialogue`, or clarify whether one narrator performing
dialogue is preferred. If > 10 speakers, specialty dialects, or true
multi-track voice+music DAW mixing or M4B packaging are required, preserve that
requirement cleanly (using segmented `beatra.speech.synthesize` clips for editor
assembly or routing DAW/M4B mastering out). Do not present unmixed tracks or a
single-voice read as mixed multi-cast audio.
