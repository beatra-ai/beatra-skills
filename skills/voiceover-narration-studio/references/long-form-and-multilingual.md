# Long-Form and Multilingual Production

Maintain a clear local ledger for every chapter, lesson, language track, script
direction pass, and loudness normalization job.

## Production ledger fields

Store locally before sending any billable call:

- logical item name (chapter, lesson, or BCP-47 language branch)
- tool name (`beatra.speech.prepare_script`, `beatra.audio.process`,
  `beatra.voices.clone`, `beatra.speech.synthesize`)
- normalized language tag (when supplied), exact `voice_id`, exact `model`
- whether the block is free planning (`validate`, `voices.preview`) or paid
- local `client_request_id`, returned `task_id`, and terminal `artifact_id`
- measured duration / `billing.net_charged_credits` once complete

`beatra.tasks.list` and `beatra.tasks.get` do not search by `client_request_id`;
your local ledger is the sole recovery map connecting business items to IDs.

## Pilots before bulk batches

- **Ordered chapters / courses**: validate with free `beatra.speech.validate`,
  align pacing on a representative passage (optionally using approved Smart Voice
  Director `prepare_script`), obtain approval on the six-field card for one
  pilot, deliver the pilot audio + duration + cost, and only then present the
  remaining batch production card for approval.
- **Multilingual scripts**: collect all target-language scripts supplied by the
  user, confirm `voices.list` readiness and `models.list` support per normalized
  language tag, run one pilot per distinct `(voice, language, model)` route, and
  keep separate output folders/lists per language.
- **Loudness normalization**: normalize approved delivered narration artifacts
  through `beatra.audio.process` (`operation: "normalize_loudness"`, using
  `source`, target `loudness_lufs` e.g. `-14`) one task at a time after explicit
  approval of the finishing card. Do not batch multiple overlapping finishing
  calls blindly.

## Interruption and partial-failure recovery

1. Poll every known pending `task_id` via `beatra.tasks.get` until terminal
   before concluding anything failed.
2. If a submission response dropped before recording `task_id`, paginate
   `beatra.tasks.list` across every `next_cursor` covering the submit window and
   inspect matching tasks with `beatra.tasks.get`.
3. Replay an identical payload with the same `client_request_id` ONLY when no
   matching task exists or after confirming `insufficient_balance` has been
   topped up by the user (always keep Beatra's exact `topup_url`).
4. Never edit already-accepted chapters silently. Any adjusted line, voice,
   speed, format, or target loudness uses a fresh six-field card, explicit user
   approval, and a new `client_request_id`.
