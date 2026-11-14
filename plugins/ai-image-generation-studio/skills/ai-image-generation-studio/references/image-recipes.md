# Image payloads and admission

Use this reference after the route, brief, and source order are known. Every paid call goes through the bundled client; the MCP tool name is the CLI argument and its arguments are JSON on standard input.

## Read a live interface card

Before freezing any paid image payload or quoting compatibility or cost, call `beatra.models.list` for exactly one capability:

```text
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For every eligible card, compare the complete request with:

- prompt language, counter type, and length limit;
- accepted input kind, MIME format, number of inputs, bytes, edge range, aspect range, alpha handling, animation or frame selection, transport, and source-order meaning;
- output count, supported relationship, and whether the count is admitted as one request;
- canvas presets, source anchor, target bounds, normalization, and unsupported combinations;
- supported controls and conditional rules; and
- every `pricing.options` row, its dimensions, the estimate formula, and billing basis.

Use `auto` only when at least one current candidate admits the full request. A concrete model is used exactly as named only when its card admits every source and explicit control. Never drop an image, reorder sources, remove a control, alter the canvas, or substitute a named model silently.

## Generate from text

`beatra.images.generate` accepts no source image:

```json
{
  "prompt": "A ceramic pour-over set on a walnut counter, warm morning side light, editorial product photography, muted terracotta and cream, empty space on the right, no text or people.",
  "count": 2,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "16:9"},
  "output_relationship": "independent",
  "client_request_id": "opaque-generate-id"
}
```

The prompt must contain non-whitespace text. Generate alone may set `reasoning` when the live card supports it. Omit `model` or use `auto` unless the user selected a concrete compatible model.

## Compose from ordered references

`beatra.images.transform` accepts one to four ordered inputs:

```json
{
  "prompt": "Place the sneaker from image 1 in the night setting and lighting of image 2; keep its shape, colorway, and label recognizable.",
  "images": [
    {"type": "artifact", "artifact_id": "art_product"},
    {"type": "artifact", "artifact_id": "art_setting"}
  ],
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "source"},
  "output_relationship": "independent",
  "client_request_id": "opaque-transform-id"
}
```

When preset `aspect: "source"` is explicit, the last transform input anchors the ratio. The omitted transform default is 2K at 16:9. `reasoning` is not a transform field.

## Edit a base image

`beatra.images.edit` keeps the first input as the base and accepts later ordered references:

```json
{
  "prompt": "Remove the passerby and continue the brick wall naturally; keep the model, clothing, product, and lighting recognizable.",
  "images": [
    {"type": "artifact", "artifact_id": "art_base"}
  ],
  "edit_regions": [
    {"image_index": 0, "x": 0.55, "y": 0.1, "width": 0.3, "height": 0.7}
  ],
  "count": 1,
  "client_request_id": "opaque-edit-id"
}
```

The omitted edit canvas is 2K at `source`, anchored to `images[0]`. Edit has neither `output_relationship` nor `reasoning`.

Each `edit_regions` entry uses JSON numbers with normalized geometry: `x` and `y` are at least zero and below one; `width` and `height` are greater than zero and at most one; `x + width` and `y + height` may not exceed one. `image_index` must identify an input. Region geometry must be unique, with at most eight regions total and at most two for any input. Omit regions for a whole-image edit. A valid region focuses intent but does not guarantee that pixels outside it remain unchanged.

## Shared controls

- `count` is a strict integer from 1 through 4. The request is admitted as a whole and is not split.
- `seed`, when set, is a strict integer from 0 through 2,147,483,647. Omit it for model-managed randomness.
- `negative_prompt` is optional and must fit the live card.
- Omitted or null `enhance_prompt` preserves the selected model's documented default.
- `palette` contains 3 through 10 entries. Each color is `#RRGGBB`; each weight is greater than zero and at most one, has no more than four fractional digits, and all weights total exactly `1.0000`. On generate or transform, palette also requires `output_relationship: "independent"`.
- `output_relationship` is valid only for generate and transform and must be `independent` or an admitted `sequence`.
- `reasoning` is valid only for generate, must be supported explicitly, and requires `output_relationship: "independent"`.

Any explicit control constrains eligibility. If no live card can honor the full payload, explain the conflicting field and obtain the user's choice; never weaken the request invisibly.

## Approval, submission, and billing

Show the route, source references in exact order, base when relevant, brief, must-keeps, count, relationship, canvas, explicit controls, model behavior, live per-successful-image estimate, and maximum possible image charge. Match one price option only when every returned dimension agrees with the admitted request; an empty dimensions object is the default. A preset canvas tier supplies a returned `resolution` dimension. If a target canvas or `auto` route does not resolve to one option before admission, show the live range and use its maximum as the approval ceiling. Apply the returned estimate formula to output count only; do not multiply customer credits by source-image count. Do not preserve model aliases, dimension values, thresholds, or prices in this Skill as a substitute for discovery. Estimates are provisional.

After approval, freeze the payload and create one opaque stable `client_request_id`. Submit the matching billable tool once. Record the returned task ID and poll it with `beatra.tasks.get`. Images are charged in whole credits per successfully persisted image, so a partial result is billed only for the successful images. Terminal `billing.net_charged_credits` is final.

## Recovery and cancellation

Keep the normalized frozen input with its route, stable ID, approval, creation time, create response, task ID, and terminal result.

- Lost create response, retained ID and frozen input: retry only the identical payload with the same ID.
- Lost task ID, retained ledger: call `beatra.tasks.list` for the capability, then `beatra.tasks.get` on plausible candidates and match capability, normalized input, and timing. An ambiguous match stops submission.
- Lost request ID: do not invent a new ID or replay. Attempt task recovery and stop if the original cannot be identified.

`queued` and `running` are not failures. Cancel only at the user's request, call `beatra.tasks.cancel` once, and verify with `beatra.tasks.get`. An unconfirmed cancellation means continue polling the same task, not start a replacement.
