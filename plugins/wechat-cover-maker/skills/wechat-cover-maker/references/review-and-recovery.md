# Review and recovery

## Before the paid boundary

Present one final direction containing the visual hook, prompt, title strategy, ordered
references, explicit canvas, model, controls, and `count=1`. Explain that it is one paid
image request. Wait for confirmation, freeze every parameter, create one stable opaque
`client_request_id`, and submit exactly once.

Any changed prompt, reference or order, canvas, model, control, second ratio, or refinement
is a new logical request. It needs new confirmation and a new opaque ID. Never conceal a
second paid call inside “trying another version.”

## Monitor and recover

- Poll an accepted task with `beatra.tasks.get`. Queued and running are normal states; do
  not resubmit while either applies.
- If the task ID is lost, call `beatra.tasks.list` to find plausible candidates, then call
  `beatra.tasks.get` on a candidate to verify it before continuing.
- Retry the original paid tool with the same ID and byte-for-byte equivalent parameters
  only when delivery of the original request is genuinely unknown. Never retry merely
  because polling is slow.
- Stop active polling after 30 minutes. Report the task ID and explain that the same task
  can be checked later; do not create replacement work.
- Call `beatra.tasks.cancel` only when the user asks. Cancellation success must be
  confirmed. On a 409 response, continue tracking the original task instead of submitting
  or cancelling another one.
- Follow [billing, errors, and recovery](billing-errors-and-recovery.md) for insufficient
  balance, concurrency, invalid input, terminal failure, and refund behavior.

## Review only what is visible

When the host can see the returned artifact, review in order: thumbnail recognition,
visual hierarchy, focal point, title-safe contrast, target-canvas fit, and crop risk. For
title-in-image work, inspect every character. Also check must-preserve people, products,
logos, and brand details, and report actual dimensions when observable.

When the host cannot see the artifact, state that visual verification was not possible and
give the user that checklist. Do not claim that title text, font, logo, identity, dimensions,
composition, or crop has been verified.

Do not guarantee exact typography, letter spacing, wrapping, logo geometry, facial or
product fidelity, or identical cropping across WeChat clients. After review, recommend at
most one focused refinement. Do not execute it until the user gives fresh confirmation;
the edit is one new paid request with a new ID.
