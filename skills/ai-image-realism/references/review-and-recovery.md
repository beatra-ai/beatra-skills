# Review and recovery

## Before submission

- Show the selected route, priority defect, destination, canvas behavior, and must-keep
  constraints.
- Show that the request creates one output and one paid submission. Obtain confirmation
  after the final payload is understood.
- Generate the opaque `client_request_id` only after the payload is final.

## After delivery

Compare the delivered image with the base across the eight diagnosis dimensions. Report:

- what changed and whether the priority defect improved;
- any drift in identity, subject/product shape, composition, background, text, or logo;
- the actual delivered pixel dimensions rather than only the requested tier or aspect;
- `billing.net_charged_credits` from the terminal task result;
- at most one recommended focused revision, clearly marked as unexecuted and requiring a
  new identifier and confirmation.

Do not claim that artifacts are always detected or that fidelity is guaranteed.

## Recovery boundaries

Use [installation and authentication](installation-and-auth.md) and [installation
registration](installation-registration.md) for credentials and registration. Use [tasks
and results](tasks-and-results.md) for bounded polling, task lookup/listing, cancellation,
artifact retrieval, and the 30-minute durable recovery window. Use [billing, errors, and
recovery](billing-errors-and-recovery.md) for insufficient balance, concurrency, invalid
input, model conflicts, upload grants, terminal failures, refunds, and a lost response.

For a lost response, retry only the identical paid payload with the same
`client_request_id`. If prompt, images, regions, canvas, model, or count changes, treat it
as new work: use a new identifier and obtain confirmation again. Never submit a second
paid call merely because polling is slow.
