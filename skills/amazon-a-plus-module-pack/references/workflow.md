# A+ module workflow

## Build the selling-point list

Record only seller-confirmed points. Separate SKU identity, each benefit
in the seller's words, approved numbers, language, destination, and
optional visual references. A missing point stays a named gap. Do not
fill it from a pack photo, a similar SKU, or a remembered Amazon
template.

Default plan: one 16:9 2K still per named selling point. Change canvas
only when the seller names an A+ slot that needs another ratio. If they
want a standard set and have not numbered slots, use up to four roles
that already have facts: promise, feature, use, comparison.

Keep one shared look across the set: palette, lighting, product
appearance, and background.

## Upload optional references

If the seller supplies a product or brand still, upload it with its
exact MIME type. The helper completes the upload grant and HTTP PUT,
then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-sku-front.png --mime-type image/png
```

Keep the artifact ID. The generate route does not require this file.
When a later edit uses the accepted still as `images[0]`, read the live
`image_edit` card first.

## Read the live model card

Call `beatra.models.list` with `text_to_image` before choosing model,
canvas, count, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Use `model: "auto"` and `count: 1`. The prompt may show only confirmed
selling points. Do not ask the model to invent a benefit.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per module. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved Amazon A+ module still. Show only the confirmed SKU and selling point. Keep the shared A+ page look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"16:9"},
  "client_request_id":"opaque-aplus-module-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed selling point, language, canvas, model, or prompt is new work:
new card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-module"}],"prompt":"Correct only the approved local change. Keep every other confirmed selling point and the shared A+ look.","count":1,"client_request_id":"opaque-aplus-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review visible printed claims against the selling-point list. Report
unread small type as unread. Do not treat the still as certified A+
copy that Amazon has approved.
