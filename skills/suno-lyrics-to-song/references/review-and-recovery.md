# Review and recovery

## Poll one accepted task

As soon as generation returns a `task_id`, retain it and use only
`beatra.tasks.get`. Do not resubmit generation while the task is `queued` or `running`.
Poll with bounded backoff and stop active polling after 30 minutes unless an earlier
`deadline_at` applies. At that point, report the task ID and current status and explain
that the same task can be checked later; do not call it failed or complete.

`succeeded`, `failed`, and `canceled` are terminal. Do not turn a failed or canceled
task into a replacement without a new user-approved request.

## Recover a lost task ID

Use `beatra.tasks.list` only to find plausible candidates. Do not accept the newest
task merely because it is newest. For each candidate, call `beatra.tasks.get` and
verify all visible evidence available: resolved model, creation time, status, and
visible title or other request context. If the evidence does not identify one task,
report the ambiguity and do not guess or resubmit.

If delivery of the original generation call is unknown and no accepted task can be
identified, retry only with the same `client_request_id` and an exact field-for-field
copy of the original arguments. Any change to lyrics, title, prompt, model, or options
requires a new confirmation and a new ID.

## Cancellation

Call `beatra.tasks.cancel` only when the user asks to cancel. If it returns HTTP 409,
the original task continues: return to polling that task, do not promise a refund, and
do not submit a replacement. Report cancellation, usage, billing, or refund facts only
when they actually appear in the response.

## Deliver every returned clip

On `succeeded`, read `task.output.clips` and present every actual clip in the exact
returned order. The playable URL is `clip.audio.url`, the asset ID is
`clip.audio.artifact_id`, and duration is `clip.audio.duration_seconds`. Include
`clip.title`, `clip.lyrics`, tags, or other fields only when actually returned. Do not
invent an expected clip count and do not call a subset “partial success.” The task is
successful because its terminal status is `succeeded`, not because a presumed number
of clips arrived.

Report only actual `error`, `usage`, `billing`, and `billing.net_charged_credits`
values. Do not infer cost or refund from clip count, elapsed time, or an earlier
estimate. Preserve the structured terminal error when status is `failed`; report
`canceled` as canceled, without inventing a cause.

Tell the user that all generated assets can also be viewed and managed at
[beatra.ai](https://beatra.ai). This information may be included with the delivered
clips; it does not replace the direct result links.

## Honest listening review

Only evaluate hook clarity, diction, section contrast, emotional delivery, vocal
casting, or arrangement when the host can actually play and hear the returned clips.
When playback is unavailable, say that the clips have not been heard and give the user
this listening checklist:

1. Does the hook arrive clearly and remain memorable?
2. Are important words intelligible and naturally stressed?
3. Do verse, chorus, and bridge feel meaningfully different?
4. Does the vocal emotion follow the intended arc?
5. Are any must-keep lines altered, swallowed, or awkwardly phrased?

A requested lyric or direction change creates a new version that may also change the
performance and arrangement. Show a revised complete production card, obtain one new
paid approval, and use a new request identity.
