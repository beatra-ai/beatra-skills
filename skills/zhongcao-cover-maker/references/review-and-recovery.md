# Review and recovery

## Before the paid boundary

Present one final direction. Freeze the prompt, ordered references, canvas,
style direction, text-safe zone, count, model, and controls in a single
confirmation. After approval, create one stable opaque `client_request_id` for
that exact logical request and submit once. Any change—prompt, reference or
order, canvas, style direction, model, count, or control—is new paid work with
a new confirmation and a new ID.

## Monitor and recover

After receiving a `task_id`, poll only that task with `beatra.tasks.get`. Use
bounded backoff: first poll around 2 seconds, increasing toward 5 and 10
seconds, maximum 15 seconds. Honor `deadline_at`. Stop active polling after 30
minutes and report the task ID and status.

- **Lost create response:** if the response to the original submission is
  genuinely unknown, retry the exact same parameters with the same
  `client_request_id`.
- **Lost task ID:** call `beatra.tasks.list` to find candidates, then verify
  the selected one with `beatra.tasks.get`. Match by capability, input, and
  timing. If the match is ambiguous, do not submit a replacement.
- **Slow task:** a queued or running task never authorizes a replacement.
- **Authorization failure:** direct the user to rerun `scripts/authorize.py`.
  The original `client_request_id` remains valid for idempotent recovery.
- **Connection failure:** preserve the credential and the original
  `client_request_id`. Retry only the exact same parameters.

Use `beatra.tasks.cancel` only when the user asks. If cancellation returns
`409`, the task continues. See the shared
[billing, errors, and recovery](billing-errors-and-recovery.md) for the full
structured-failure reference.

## Review only what is visible

When the result is visible, review in this order:

1. **Thumbnail clarity** — is the focal subject recognizable at small size?
   Imagine the cover at 200px wide in the feed waterfall.
2. **Text-safe zone** — is there clean, uncluttered space in the declared zone
   (top third, center, or bottom) for headline overlay?
3. **Subject fidelity** — is the source subject preserved? Compare against the
   original photo when applicable.
4. **Color and lighting** — does the color palette match the Xiaohongshu
   aesthetic for the category? No unnatural skin tones, no oversaturation.
5. **Background quality** — is the background clean and supportive? No
   distracting objects, busy patterns, or competing elements.
6. **Canvas fit** — is the vertical 3:4 ratio correct? Is the subject well
   positioned within the frame?
7. **Click appeal** — does the cover stop the scroll? Is the composition bold
   enough to compete in a dual-column feed?

If the host cannot view the artifact, state that visual verification was not
possible and deliver the result links for the user to review.

## Deliver

Present the returned image. Include the artifact links, observed dimensions,
task ID, and `billing.net_charged_credits`. Do not infer credits from elapsed
time.

Offer at most one focused, unexecuted revision. When the user accepts a result
but wants a specific fix, describe the revision as a new `beatra.images.edit`
request with the accepted cover as `images[0]`.

## Cover set for a multi-image note

A Xiaohongshu image-text note typically uses a cover plus several supporting
content images (up to 9 total). Each image is a distinct paid request with its
own confirmation and `client_request_id`. Review each result independently for
thumbnail clarity and text-safe zone. Maintain visual consistency across the
set by reusing the same style direction, color palette, and text-safe zone
placement in each prompt.
