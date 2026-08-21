# Review and recovery

## Track the original task

After one approved create call, store its `task_id` and poll only that task with
`beatra.tasks.get`. Increase the delay between polls rather than submitting a
replacement while the original task is queued or running.

If the task ID is lost, call `beatra.tasks.list`, compare recent candidates by
capability, resolved model, creation time, and input summary, then verify the
selected candidate with `tasks.get`. Stop when more than one candidate remains
plausible.

## Recover an uncertain create response

Replay only when the transport result leaves creation status genuinely unknown.
The replay uses byte-equivalent arguments and the same stable
`client_request_id`. Never change prompt, media, order, duration, canvas,
watermark, or model during recovery.

A changed creative request is a new paid call: show a new admission card
(including the 600-credit fact, exact top-up URL, and starter ¥29) and use a
new identity. On `insufficient_balance`, relay the returned message, keep
`https://console.beatra.ai/topup` exact, and retry the same frozen
`client_request_id` only after the user says they have topped up.

## Handle terminal states

- **Succeeded:** deliver the persisted Beatra artifact and terminal billing.
- **Failed:** report the structured error and refund state; propose one focused
  next step without executing it.
- **Canceled:** report the canceled task and terminal billing/refund facts.
- **Queued or running:** continue tracking the same task.

Use `beatra.tasks.cancel` only when the creator asks. A `409` means the task has
already moved beyond cancelable state; continue tracking instead of replacing
it.

## Review what is actually perceptible

When the host can see or hear the result, review:

- subject, product, character, text, and brand fidelity against visible inputs;
- motion continuity, camera readability, and physical plausibility;
- first and last frame accuracy where those frames were supplied;
- reference influence without unintended identity or style drift;
- sound-picture timing, stereo balance, dialogue clarity, and unwanted noise;
- canvas, framing, observed duration and dimensions, and destination readiness.

If the host cannot perceive the media, deliver the artifact and describe the
review as not performed. Upload and metadata never substitute for visual or
audio inspection.

## Deliver and revise

Return artifact links, observed dimensions and duration, the task ID, resolved
model, and `billing.net_charged_credits`. Summarize the visible/audible review
and offer one focused, unexecuted revision. Any revision that changes the paid
request needs fresh approval and a new `client_request_id`.
