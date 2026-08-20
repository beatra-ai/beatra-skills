# Test-reading review and voice reuse

## Keep the proof separate from the clone

A successful clone may be the final result. Clone approval never authorizes a
paid test reading. If the user wants one, settle the final short text and
delivery direction, then locate the saved voice with `beatra.voices.list`,
`category: "cloned"`, and the exact returned `voice_id`. Preserve its
`compatible_models`; do not select by display name alone.

Read live text-to-speech cards with `beatra.models.list` and inspect every live
candidate named by the voice's `compatible_models`. When the user supplies a
target BCP-47 language, compare its primary language with each candidate's
`constraints.supported_languages`, using only documented aliases. This is the
text-to-speech model-card path; do not infer a top-level language field. Keep
`model: "auto"` only when every live voice-compatible candidate supports that
target language in `constraints.supported_languages`. If any candidate does
not, select and freeze one live, voice-compatible, language-supported explicit
model in the proof card. If no candidate satisfies both voice compatibility
and language support, stop before approval or submission and offer the
positive options of another saved compatible voice, a supported target
language if the user wants it, or finishing with the clone without a proof.

Count billable text using the live `beatra_weighted_characters` rule: each Han
ideograph counts as 2 and every other character as 1. Apply every applicable
candidate's exact estimate formula, unit price and scale. When auto remains
valid but its candidates have different prices, show the range or upper bound
rather than a fabricated single estimate.

Prepare a separate card with final text, exact `voice_id`, language, the
validated `auto` choice or frozen explicit model, delivery controls, current
estimate, one synthesis call and its success-basis billing rule. Only explicit
approval of that card authorizes the proof.

## Synthesize once and recover the same task

For an approved proof, make a new opaque local `client_request_id`, then invoke:

```bash
python3 scripts/mcp_client.py call beatra.speech.synthesize
```

Supply at least `voice`, `input`, and `client_request_id`, plus only the
approved optional language, model, format, sample-rate, speed, volume, pitch or
emotion controls. Submit once and poll the returned task with
`beatra.tasks.get`.

If the task ID is lost, paginate `beatra.tasks.list` for text-to-speech through
all `next_cursor` values and verify candidates with `beatra.tasks.get`. Reuse
the same local request ID only for a field-for-field identical replay while
transport or creation remains uncertain. Changed text, voice, language or
delivery is new paid work with a new card, approval and ID.

## Deliver and review only returned facts

Return the actual task status, audio URL, artifact, duration, MIME type, sample
rate, asset links, resolved model, usage and billing when present. If the host
cannot play the audio, label it not auditioned. If it can, review only the
returned clip for clarity, intended readings, pace, tone and fit for the stated
destination.

The clip demonstrates only that particular reading; it does not prove a
universal similarity score, every language, or future output. If the user
wants changed wording or delivery, propose only the smallest affected proof
segment and wait for a new paid approval. Never re-clone to alter a script,
pace or emotion.

On terminal failure, preserve the provider-neutral `TaskError` and actual
billing values. Missing fields stay unknown. Do not invent an upstream
provider, listening result, refund or reason to re-clone.
