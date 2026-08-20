# Voiceover workflow

## Prepare the final spoken script

Keep the listener's first reason to continue near the opening and one useful
idea per short sentence. Decide how names, numbers, dates, amounts, units,
acronyms, and brands should sound. Use punctuation and sentence breaks for
natural pauses. Remove links, headings, shot directions, and performance notes
that would otherwise be spoken aloud. Never invent product claims.

If the user gave permission only to make the text speakable, preserve the
meaning and claims. Show and confirm a material rewrite before any audio is
made. If script editing is the entire request, deliver the approved spoken
script and stop before paid synthesis.

Treat a requested runtime as a target, not a promise. First adjust writing,
pauses, and only then a supported speed control. Prepare the smallest useful
read, then compare returned `duration_seconds` with the target. Any further
adjustment is a new production card, approval, and paid request.

## Cast and price from live facts

Prefer an already approved opaque `voice_id`. Otherwise use
`beatra.voices.list` and the current voice cards' preview, language, accent,
use cases, and `compatible_models` to offer a few suitable choices without
stereotypes. A preview is a free casting aid; do not synthesize paid audio only
to audition a voice.

Use `beatra.models.list` with `capability: "text_to_speech"` before a model,
language, or cost decision. An explicit choice must be available, compatible
with the selected voice, and support the requested BCP-47 language. For
voice-first `auto`, validate the requested primary language against every live
available compatible candidate, using documented aliases only. If any
candidate lacks it, use a confirmed viable explicit model instead.

Count billable text with `beatra_weighted_characters`: Han ideographs count as
2 and all other characters as 1. Apply the current `estimate_formula`,
`unit_price_credits`, and `scale`. Preserve every possible `auto` candidate in
the range or upper bound rather than quoting a fabricated single price.

MP3 is the normal editing handoff. Use WAV or FLAC only for an explicit audio
post-production path, Opus for explicit web delivery, and PCM for an explicit
raw pipeline. Start with speed 1.0, volume 1.0, pitch 0, no forced emotion, and
no sample rate unless the destination requires one.

## Keep paid scope exact

One logical short read is one paid request by default. Multiple hook options,
A/B alternatives, language variants, or alternate deliveries are separate
requests. Include their exact texts, settings, weighted-character totals,
estimates, and paid-call count in the current production card. Never generate
an unapproved extra take.

After approval, freeze the exact JSON and one new local
`client_request_id` per request. Submit once and record the returned `task_id`.
If task creation or transport is genuinely uncertain, exact replay may reuse
that ID only when every JSON field is identical.

## Recover and hand off factual results

For a known task, poll with `beatra.tasks.get`. For a lost reference, list
`text_to_speech` tasks and follow every relevant `next_cursor`, then inspect
plausible candidates. The client request identity is local-only; compare
capability, time window, returned input, settings, and task facts.

On success, present the actual artifact, duration, media facts, resolved model,
usage, and billing when returned. If playback is available, check the hook,
readings, pauses, clarity, energy, and format. Otherwise state that the audio
was not auditioned. Preserve accepted audio and propose only the smallest
affected correction under a new paid confirmation.

On terminal failure, report returned provider-neutral error and billing facts.
Do not infer an upstream supplier or turn a `retryable` flag into permission to
retry. Missing billing values are unknown or unsettled, not zero. Cancel only
at the user's request; a conflict means the original task still needs
reconciliation.

This workflow creates voiceover audio, not a video, captions, avatar, lip-sync,
publication, or an exact synchronization guarantee. Preserve broader video
requirements when routing them elsewhere. Route an authorized custom-voice
request to a cloning workflow rather than implying this package clones voices.
