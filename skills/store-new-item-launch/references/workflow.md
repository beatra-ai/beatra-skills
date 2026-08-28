# Store new-item workflow

## Build the 3-still board

Record only store-supplied facts. Separate store or brand, named new
item, each still's role, printed lines, language, destination, and
optional visual references. A missing ingredient, price, or claim
stays a named gap. Do not fill it from a product photo, a similar
SKU, or a remembered menu.

Default plan: three named stills on the first board, then the rest of
a typically four-or-more set. Default canvas is square 2K listing.
Change canvas only when the store names a destination that needs
another ratio: Xiaohongshu `3:4`, story `9:16`.

Keep one shared look across the pack: type, palette, layout, and
background.

## Upload optional references

If the store supplies a product or brand still, upload it with its
exact MIME type. The helper completes the upload grant and HTTP PUT,
then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-item-front.png --mime-type image/png
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

Use `model: "auto"` and `count: 1`. The prompt may print only confirmed
lines. Do not ask the model to invent an ingredient, price, or claim.

Before a local correction, read the live `image_edit` card:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_edit"}
```

## Freeze and submit the first three

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per first still. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved store new-item still. Print only the confirmed item name and approved lines. Keep the shared pack look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "client_request_id":"opaque-store-launch-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed fact line, language, canvas, model, or prompt is new work:
new card, new ID. Keep at most two generate tasks in flight.

After the first three stills are accepted, remaining named stills use
the same payload shape. Show a fresh six-field pack card: live
`text_to_image` price times remaining slot count, one paid call per
slot, one new `client_request_id` per slot. Do not reuse a first-board
ID. Do not treat the first-three card as pack approval.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed line and the shared pack look.","count":1,"client_request_id":"opaque-store-launch-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the store asks, then wait for a terminal state.

Review visible printed text against the fact list. Report unread small
type as unread. Do not treat the still as a certified menu, price, or
ingredient label.
