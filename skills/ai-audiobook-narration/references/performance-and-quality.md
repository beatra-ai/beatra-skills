# Performance, cost, and quality

## Freeze compatible delivery controls

Use a selected voice's returned opaque `voice_id` as synthesis `voice`. Keep the
accepted voice, valid BCP-47 language, format, and baseline speed stable across
the book. Default to `model: "auto"`, `format: "mp3"`, `speed: 1.0`,
`volume: 1.0`, `pitch: 0`, no emotion, and no explicit sample rate. Change a
default only when the user or destination requires a supported alternative.

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

If the user asks for multiple voices, first test whether one narrator can meet
the creative goal through dialogue performance, supported controls, and pacing.
If true mixed multi-cast audio or voice-by-voice editing is essential, keep that
requirement intact and route the production to another suitable workflow that
can mix and edit multiple voices. Do not present single-voice audio as a
multi-cast result.
