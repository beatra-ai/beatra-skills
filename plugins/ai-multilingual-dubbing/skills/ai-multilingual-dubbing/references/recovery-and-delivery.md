# Recovery and Delivery

Recover uncertain dubbing cells without duplicating charges and deliver accurate
per-market outputs.

## Reconciliation and balance handling

1. Store `client_request_id`, capability, payload, and later `task_id` in the
   local matrix before each call.
2. Poll known tasks with `beatra.tasks.get` (cap active waiting at 30 minutes
   when `deadline_at` is absent).
3. If `task_id` was not captured, paginate `beatra.tasks.list` for the relevant
   capability across every `next_cursor` and verify candidates with
   `beatra.tasks.get`. Never duplicate an active queued/running task.
4. On `insufficient_balance`, relay Beatra's message and exact `topup_url`
   verbatim, stop until the user confirms topping up, and replay the field-for-field
   identical JSON with the same `client_request_id`. Never ask the user to
   pre-confirm wallet sufficiency or make `beatra.wallet.get` a mandatory gate;
   only call `beatra.wallet.get` / `beatra.wallet.ledger` when explicitly asked,
   and relay `top_up` tiers in returned order verbatim.
5. Any change to text, language, voice, model, speed, or target LUFS requires a
   new production card, approval, and `client_request_id`. Cancel only when asked.

## Locale delivery ledger

Deliver actual `audio.url`, `artifact_id`, `mime_type`, `size_bytes`,
`sample_rate` (when returned), `duration_seconds`, optional `subtitles`,
resolved `model`, `task_id`, and `billing.net_charged_credits` grouped by locale
and segment. State openly if playback review was not performed on the host.
