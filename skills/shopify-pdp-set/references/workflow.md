# Shopify PDP still workflow

## Build the theme list

Record only seller-confirmed facts. Separate SKU identity, each theme
in the seller's words, language, destination, and optional visual
references. A missing theme stays a named gap. Do not fill it from a
pack photo, a similar SKU, or a remembered Shopify template.

Default plan: four 1:1 2K stills. If the seller wants a standard set
and has not numbered themes, use up to four roles that already have
facts: hero, detail, lifestyle, use. A seller who names 5 to 8 themes
gets that many stills. Leave a theme whose fact is missing on the plan.

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
product facts. Do not ask the model to invent a material, review, or
price.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per still. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved Shopify product-page still. Show only the confirmed SKU and theme facts. Keep the shared product-page look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "client_request_id":"opaque-shopify-pdp-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed theme, language, canvas, model, or prompt is new work: new
card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-pdp-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed product fact and the shared product-page look.","count":1,"client_request_id":"opaque-shopify-pdp-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review printed claims against the confirmed theme list. Report only
text the host can actually see.
