# Review and iteration

Deliver real image artifacts first, then inspect the accessible media before proposing another paid request.

## Deliver terminal facts

For every successful image, return the actual:

- URL and `artifact_id`;
- width and height;
- format and MIME type; and
- byte size when present.

Also report the terminal status, resolved model, usage, successful-image count, and `billing.net_charged_credits`. Use an assets-management link only when the task or shared result actually returns one. There is no image asset-list, rename, move, tag, or delete tool in this workflow, so do not invent such actions. Retain accepted artifact IDs in the private project ledger so they can become later references or edit bases.

Requested canvas, expected format, create response, task status, and metadata are not a visual review. Review only media the host Agent can actually open, and state any inspection limit.

## Review every output

Compare each accessible result with the brief:

1. **Message** — does it communicate the one intended idea for the audience and destination?
2. **Subject and must-keeps** — check anatomy, identity, product geometry, material, color, label, logo, text, and all named priorities.
3. **Composition** — inspect focal point, crop, balance, negative space, foreground, and background.
4. **Style, light, and color** — compare the result with the chosen visual family and palette.
5. **Text and symbols** — read generated typography and inspect logos rather than assuming they are correct.
6. **Actual destination fit** — use returned dimensions, format, margins, and legibility, not requested geometry.

When several outputs succeed, inspect them all, compare them by the same criteria, and recommend one only with a stated reason. A partial multi-output success is still delivered and charged by successful-image count; clearly identify missing outputs without fabricating them.

## Choose the smallest useful follow-up

- A local flaw in an otherwise useful base normally suggests `beatra.images.edit`.
- A new composition guided by the accepted image and other sources suggests `beatra.images.transform`.
- A fundamentally wrong subject or concept with no useful base may justify a new `beatra.images.generate` request.
- A text, logo, face, product, or series-consistency problem requires explicit must-keeps and another full-result review; no route guarantees exact pixels or consistency.

Change only the lever that addresses the observed problem. A different prompt, source, order, base, count, relationship, canvas, model, seed, palette, region, or control is a new logical request with a new stable ID and paid approval.

For a series, reuse a reviewed direction, exact shared wording, and accepted references. Generate and inspect each image separately. Do not claim that a seed, `sequence`, reference, named model, or previous success guarantees identical style, identity, logo, typography, or layout across the set.

## Failures

Report the actual terminal error and the field or media fact that needs attention. Offer the smallest compatible change from live evidence. Never present a failed output as delivered, guess a refund, silently change a named model or source, remove a control, or duplicate the paid submission while recovering.
