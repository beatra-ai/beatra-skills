# Review and recovery

## Before the paid boundary

Present one final direction. Freeze the prompt, ordered references, canvas,
poster type, style direction, text-safe zone, count, model, and controls in a
single confirmation. After approval, create one stable opaque
`client_request_id` for that exact logical request and submit once. Any
change—prompt, reference or order, canvas, poster type, style direction, model,
count, or control—is new paid work with a new confirmation and a new ID.

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

1. **Visual impact** — does the poster stop the scroll and read clearly at a
   glance? Imagine the poster at 300px wide in a feed.
2. **Text readability** — is there a clean, high-contrast text-safe zone (top
   band, center, or lower third) for the headline and details?
3. **Brand consistency** — do the colors and mood match the category and brand
   direction supplied in the brief?
4. **Canvas fit** — is the ratio correct for the destination (A-series print,
   1:1, 9:16, 16:9, 2:3, or 3:4)? Is the subject well positioned within the
   frame?
5. **Subject fidelity** — is the source subject preserved? Compare against the
   original photo when applicable.
6. **Color and lighting** — does the palette match the category aesthetic? No
   flat lighting, no oversaturation that hurts headline readability.
7. **Background quality** — is the background supportive? No distracting
   objects or busy patterns competing with the text-safe zone.

If the host cannot view the artifact, state that visual verification was not
possible and deliver the result links for the user to review.

## Deliver

Present the returned image. Include the artifact links, observed dimensions,
task ID, and `billing.net_charged_credits`. Do not infer credits from elapsed
time.

Offer at most one focused, unexecuted revision. When the user accepts a result
but wants a specific fix, describe the revision as a new `beatra.images.edit`
request with the accepted poster as `images[0]`.

## Poster set for a campaign

A campaign often needs a poster plus matching variants—a square social cut, a
16:9 banner, and a print flyer. Each variant is a distinct paid request with its
own confirmation and `client_request_id`. Review each result independently for
visual impact, text readability, and canvas fit. Maintain visual consistency
across the set by reusing the same style direction, color palette, and
text-safe zone placement in each prompt.
