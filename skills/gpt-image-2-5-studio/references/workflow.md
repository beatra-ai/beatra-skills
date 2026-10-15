# GPT Image 2.5 workflow

## Choose the route

No source image → `beatra.images.generate` with capability `text_to_image`.
One to four ordered references → `beatra.images.transform` with capability
`image_to_image`. Do not call `beatra.images.edit`.

Name each reference in the prompt by array order: "Image 1 is the hero
product; Image 2 is the lighting." Inputs influence a new still; none is
promised to remain the pixel-identical base.

## Pin GPT Image 2.5

Send `model` as `gpt-image-2.5-flare` or `gpt-image-2.5-sunburst`. Do not
send `auto`. Do not substitute Qwen, Wan, or GPT Image 2. Read the live
card before freeze:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

For transform:

```json
{"capability": "image_to_image"}
```

Confirm the named SKU admits the prompt length, source count, canvas
tier, and `count: 1`. Use the matching `pricing.options` row. Do not
hard-code a credit number.

## Canvas

Default `canvas` to `{"type":"preset","tier":"2K","aspect":"1:1"}`.
Change `aspect` when the destination needs another ratio the live card
lists (including `16:9`, `9:16`, and `7:3`). Send `tier: "4K"` only when
the creator names 4K. Always send `output_relationship: "independent"`.

## Submit once

Show the six-field production card from the root first. After approval,
mint one opaque `client_request_id`. Generate:

```text
printf '%s' '{
  "prompt":"A bilingual launch poster. Headline in Chinese: 春日上新. Keep the type sharp.",
  "model":"gpt-image-2.5-flare",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"3:4"},
  "output_relationship":"independent",
  "client_request_id":"opaque-gpt25-poster-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Transform:

```text
printf '%s' '{
  "prompt":"Place the product from image 1 on a clean marble counter. Keep its shape, color, and label readable.",
  "images":[{"type":"artifact","artifact_id":"art_product"}],
  "model":"gpt-image-2.5-sunburst",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "output_relationship":"independent",
  "client_request_id":"opaque-gpt25-ref-01"
}' | python3 scripts/mcp_client.py call beatra.images.transform
```

A changed prompt, file, order, model, or canvas is new work: new card,
new ID.

## Recover and review

Poll `beatra.tasks.get`. If the create response is lost, replay only
byte-identical arguments with the same ID. If the task ID is missing,
search with `beatra.tasks.list` and match the private ledger before any
replay. Cancel only when the creator asks, then wait for a terminal
state.

Review visible type and must-keeps. Unreadable small type is unread, not
assumed correct.

When the user asks remaining credits or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Live prices still come from `beatra.models.list`,
never from ledger rows.
