# Crowdfunding gallery workflow

## Build the slot list

Record only writer-confirmed campaign facts. Separate campaign identity,
each reward-tier or gallery line in the writer's words, approved prices,
language, destination, and optional visual references. A missing perk
stays a named gap. Do not fill it from a product photo, a similar
campaign, or a remembered Indiegogo template.

Default plan: one 16:9 2K still per named gallery or reward-tier slot.
Change canvas only when the writer names a tile that needs another
ratio. If they want a standard set and have not numbered slots, use up
to four roles that already have facts: campaign hero, product still,
reward-tier tile, use scene.

Keep one shared look across the set: palette, lighting, product
appearance, and background.

## Upload optional references

If the writer supplies a product or brand still, upload it with its
exact MIME type. The helper completes the upload grant and HTTP PUT,
then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-campaign-hero.png --mime-type image/png
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
campaign facts. Do not ask the model to invent a perk or price.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per still. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved crowdfunding gallery still. Show only the confirmed campaign name and written reward or scene line. Keep the shared gallery look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"16:9"},
  "client_request_id":"opaque-gallery-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed perk line, language, canvas, model, or prompt is new work:
new card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-gallery-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed campaign line and the shared gallery look.","count":1,"client_request_id":"opaque-gallery-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the writer asks, then wait for a terminal state.

Review visible printed claims against the gallery plan. Report unread
small type as unread. Do not treat the still as a live campaign perk
that the platform has approved.
