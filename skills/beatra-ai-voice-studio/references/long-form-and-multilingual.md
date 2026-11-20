# Long-Form and Multilingual Production

Coordinate ordered chapters, multilingual localizations, multi-speaker scenes,
and post-processing tasks through one local production ledger.

## Production ledger fields

Record locally before sending any billable call:

- logical item key (chapter, scene, language code, processing stage)
- tool name (`prepare_script`, `synthesize`, `synthesize_dialogue`, `convert`,
  `transcribe`, `generate_sfx`, `audio.process`, `voices.clone`,
  `voices.activate`)
- normalized language tag (if supplied), exact `voice_id` / speaker turns,
  exact `model`
- local `client_request_id`, returned `task_id`, and resulting `artifact_id`
- duration, caption presence, and `billing.net_charged_credits`

Because `beatra.tasks.list` and `beatra.tasks.get` do not query by
`client_request_id`, this local ledger is the only authoritative map.

## Pilots and serialized finishing

- **Chapters & courses**: validate blocks free via `beatra.speech.validate`,
  run one approved pilot block first, report actual duration and cost, then
  present the remaining chapters' production card for approval.
- **Multilingual scripts**: verify target voices and `constraints.supported_languages`
  per normalized language tag, approve one pilot per distinct `(voice, language, model)`
  route, and organize outputs cleanly per language.
- **Audio finishing (`normalize_loudness`, `trim`, `fade`, `separate_stems`)**:
  approve explicit cards and run one `audio.process` job at a time within daily
  rate limits (`50/day` utility ops; `20/day` `separate_stems`).

## Recovery protocol

1. Poll all known non-terminal `task_id` values via `beatra.tasks.get` first.
2. When a create response dropped before saving `task_id`, paginate
   `beatra.tasks.list` across every `next_cursor` in the submit window and
   verify matching jobs with `beatra.tasks.get`.
3. Replay an identical payload with the same `client_request_id` ONLY when no
   matching job exists or after the user confirms topping up an
   `insufficient_balance` error (keep Beatra's `topup_url` verbatim). If the
   refusal names another way forward, present it too and follow
   [Billing, errors, and recovery](billing-errors-and-recovery.md).
4. Any changed parameter (higher speed, different voice, edited text, new LUFS
   target) requires a fresh card, approval, and new `client_request_id`.
