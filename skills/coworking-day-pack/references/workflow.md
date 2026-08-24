# Daytime playlist workflow

## Slot list

Default 10-slot pack when the seller does not name a count:

1. Arrival / doors open
2. Morning focus
3. Light talk
4. Deep focus
5. Lunch reset
6. Afternoon focus
7. Soft collaboration
8. Late-afternoon quiet
9. Close / tidy
10. Spare quiet reset

Each slot needs a use, mood, tempo feel, two or three instruments,
energy, intended length as prompt direction, and an avoid list (vocals,
sudden hits, night-club drops). Write one positive instrumental prompt
per slot.

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
per slot. Submit once:

```text
printf '%s' '{
  "model":"suno-5.5",
  "prompt":"Low-stimulation daytime coworking focus bed, soft piano and pads, no vocals, about 90 seconds.",
  "instrumental":true,
  "title":"Focus 01",
  "client_request_id":"opaque-day-focus-01"
}' | python3 scripts/mcp_client.py call beatra.music.generate
```

A changed prompt, title, model, or slot count is new work: new card
IDs for the changed slots. Keep at most two generate tasks in flight.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review audible energy against the daytime slot list. Report unread or
unheard detail as unheard. Read the actual returned duration.
