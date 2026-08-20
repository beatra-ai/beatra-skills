# Delivery and recovery

## Track one durable task per approved segment

Submit each approved chapter segment once, then record its label,
`client_request_id`, and returned `task_id`. When the task ID is known, poll only
that task with `beatra.tasks.get` until it reaches `succeeded`, `failed`, or
`canceled`. A queued or running task remains the same paid operation and must
not be replaced.

If the task ID was lost, call `beatra.tasks.list` with
`capability: "text_to_speech"`. The default page is not the entire history, so
follow `next_cursor` page by page until the relevant time window has been
searched or no cursor remains. `tasks.list` does not filter by
`client_request_id`, and neither the list item nor the remote task envelope from
`tasks.get` returns `client_request_id`; that value belongs in the local ledger
only. Treat list results only as candidates. Read each plausible candidate with
`beatra.tasks.get`, then compare capability, relevant time window, returned
input and settings, task state, and other returned task facts with the chapter
ledger. Do not claim the remote task proved the locally stored request identity.

Only when transport or task creation left the original outcome genuinely
unknown may the original `client_request_id` be replayed, and only with JSON
that is identical field for field. A text, voice, model, language, format,
sample-rate, speed, volume, pitch, or emotion change creates a new paid request
that requires a new ID and explicit confirmation. Slow polling, authorization
failure, client update failure, or a known terminal task never authorizes an
automatic retry.

## Report terminal facts without filling gaps

On success, attach the returned audio artifact to its ordered ledger entry. When
present, deliver `task_id`, the audio URL, `artifact_id`, `duration_seconds`,
actual `mime_type`, actual sample rate, `task.links.assets`, resolved model,
usage, and billing. `charged_credits`, `refunded_credits`, and
`net_charged_credits` may be missing or not yet settled. Distinguish not returned
or not settled from a returned numeric zero; never fill a missing value with
zero.

On failure or cancellation, quote the provider-neutral task error facts that
were actually returned. These can include `code`, `message`, `retryable`,
`param`, and `details`. Do not infer an upstream supplier, cause, charge, or
refund. A `retryable` value describes the error; it does not waive the paid-call
confirmation rule or authorize an automatic retry.

Use `beatra.tasks.cancel` only when the user requests cancellation. If the
cancel conflicts because the task is already terminal or cannot be canceled,
continue reconciling the original task. Never claim cancellation or refund
until returned state and billing prove it.

## Deliver in listening order

For every succeeded segment, provide the real artifact link and its chapter
label, plus task and billing facts useful to the user. Preserve chapter order
and identify any queued, running, failed, canceled, or not-yet-reviewed entries.
If the host cannot play the audio, say it was not auditioned instead of
inventing observations. Offer the smallest unexecuted correction when needed;
all corrective synthesis remains separately confirmed paid work.
