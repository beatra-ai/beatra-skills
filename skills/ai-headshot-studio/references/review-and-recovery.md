# Review and recovery

## Before the paid boundary

Present one final direction. Freeze the prompt, ordered references, canvas,
style direction, background, lighting, count, model, and controls in a single
confirmation. After approval, create one stable opaque `client_request_id` for
that exact logical request and submit once. Any change—prompt, reference or
order, canvas, style direction, background, model, count, or control—is new
paid work with a new confirmation and a new ID.

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

1. **Identity fidelity** — is the person recognizable against the source selfie?
   Compare face shape, eye color, skin tone, and hair. The transform must
   preserve the person's fundamental identity while upgrading the professional
   context.
2. **Professional appearance** — is the attire, grooming, and expression
   appropriate for the stated industry? Does the person look polished and
   credible? Is the expression confident and approachable?
3. **Background quality** — is the background clean, professional, and free of
   distracting objects, harsh shadows, busy patterns, or text? Does it support
   the professional tone?
4. **Lighting** — is the lighting flattering and even? Is the focus sharp on the
   eyes? Are skin tones natural and well-balanced? No harsh shadows or shiny
   highlights.
5. **Composition** — is the head-and-shoulders framing correct? Is the face
   within the center 60% of the frame for circular crop compatibility? Is the
   eye-level angle appropriate?
6. **Canvas fit** — is the output ratio correct for the target platform? Square
   1:1 for LinkedIn and social media, portrait for resume and print?
7. **Overall professional polish** — would this headshot look credible on a
   LinkedIn profile, company website, or resume? Does it meet professional
   photography standards?

If the host cannot view the artifact, state that visual verification was not
possible and deliver the result links for the user to review.

## Deliver

Present the returned image. Include the artifact links, observed dimensions,
task ID, and `billing.net_charged_credits`. Do not infer credits from elapsed
time.

Offer at most one focused, unexecuted revision. When the user accepts a result
but wants a specific fix—adjusting lighting, smoothing the background, or
refining attire—describe the revision as a new `beatra.images.edit` request with
the accepted headshot as `images[0]`.

## Headshot set for a team page

A company website team page typically uses headshots for multiple team members.
Each person's headshot is a distinct paid request with its own confirmation and
`client_request_id`. Review each result independently for identity fidelity and
professional appearance. Maintain visual consistency across the set by reusing
the same style direction, background, and lighting direction in each prompt.
