# New-year retail playlist workflow

## Track list

Default 10-track pack when the seller does not name a count:

1. Doors open
2. Morning browse
3. Try-on or pick-up
4. Midday reset
5. Afternoon browse
6. Soft talk-over
7. Gift wrap or checkout
8. Late-afternoon quiet
9. Close / tidy
10. Spare seasonal reset

Each track needs a use, mood, tempo feel, two or three instruments,
energy, intended length as prompt direction, and an avoid list
(vocals, sudden drops, night-club hits). Write one positive
instrumental prompt per track. Do not invent a promo date, a sale
price, a brand slogan, or lyrics.

## Read the live music card

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_music"}
```

Use `model: "suno-5.5"` and `instrumental: true`. There is no
`duration` field. Keep length inside the prompt.

## Freeze and submit

Show the six-field generate card from the root before the first
billable track. After approval, mint one opaque `client_request_id`
per track. Submit once:

```text
printf '%s' '{
  "model":"suno-5.5",
  "prompt":"Warm new-year retail browse bed, light bells and soft strings, no vocals, about 90 seconds.",
  "instrumental":true,
  "title":"Browse 01",
  "client_request_id":"opaque-ny-browse-01"
}' | python3 scripts/mcp_client.py call beatra.music.generate
```

A changed prompt, title, model, or track count is new work: new card
IDs for the changed tracks. Keep at most two generate tasks in flight.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review audible energy against the new-year track list. Report unread
or unheard detail as unheard. Read the actual returned duration.
