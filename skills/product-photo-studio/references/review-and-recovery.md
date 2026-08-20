# Review and recovery

## Before the paid boundary

Present one final direction. Freeze the prompt, ordered references, canvas,
background or scene direction, count, model, and controls in a single
confirmation. After approval, create one stable opaque `client_request_id` for
that exact logical request and submit once. Any change—prompt, reference or
order, canvas, scene direction, model, count, or control—is new paid work with
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

1. **Product fidelity** — is the product itself recognizable, correctly shaped,
   and undistorted? Compare against the original product photo.
2. **Color accuracy** — do the product's colors match the original? Look for
   color casts introduced by the scene lighting.
3. **Edge quality** — are the product's edges clean where they meet the
   background? No halo, fringe, or ghosting.
4. **Shadow and grounding** — does the product cast a natural contact shadow?
   A floating product looks artificial.
5. **Lighting consistency** — does the light direction on the product match
   the scene's implied light source?
6. **Marketplace guidance** — if targeting a specific marketplace, compare the
   image with the platform's current background, size, and framing guidance.

If the host cannot view the artifact, state that visual verification was not
possible and deliver the result links for the user to review.

## Deliver

Present the returned image. Include the artifact links, observed dimensions,
task ID, and `billing.net_charged_credits`. Do not infer credits from elapsed
time.

Offer at most one focused, unexecuted revision. When the user accepts a result
but wants a specific fix, describe the revision as a new `beatra.images.edit`
request with the accepted image as `images[0]`.

## Product image variant set

A complete ecommerce listing typically uses several image variants:

- **main image** — clean white background, product centered (marketplace
  requirement);
- **lifestyle scene** — product in a real-world context;
- **detail or infographic** — close-up of a feature or annotated callouts
  (text added downstream);
- **scale or dimension** — product next to a common object for size reference;
- **seasonal or campaign** — holiday or promotion-themed background.

Each variant is a distinct paid request with its own confirmation and
`client_request_id`. Review each result independently for product fidelity.
