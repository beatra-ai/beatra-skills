# Stitch prompt workflow

## Build the cover list

Record only the caption, comments, and reply lines the operator
supplied or that a confirmed lookup returned. Separate the share URL,
each quoted line, each written reply, language, and destination. A
missing reply stays a named gap. Do not fill it from a remembered
viral comment.

Default plan: four 9:16 2K stills unless the operator names another
count in 1 to 6. Change canvas only when the operator names another
surface.

## Look up, then plan

If the operator pasted the caption, comments, and reply lines, skip
lookup. If they gave a link and asked this connection to read it,
follow [comment lookup](comment-lookup.md) on its own card first.
Deliver the returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or
duration.

Then write the free cover plan from those lines. The operator picks
which hooks become cards.

## Read the live image card

Call `beatra.models.list` with `text_to_image` before choosing model,
canvas, count, or generate price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Use `model: "auto"` and `count: 1`. The prompt may show only the
chosen quoted line and the written reply. Do not ask the model to
invent a comment or a reply.

## Freeze and submit generate

Show the six-field generate card from the root before the first
billable image. After approval, mint one opaque `client_request_id`
per card. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved quote reply still. Show only the chosen quoted line and the written reply. Keep the words readable. Do not add likes or names the operator did not supply.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"9:16"},
  "client_request_id":"opaque-stitch-card-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed quote, reply, language, canvas, model, or prompt is new
work: new card, new ID. Keep at most two generate tasks in flight.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the operator asks, then wait for a terminal state.

Review visible printed words against the chosen quote and reply list.
Report unread small type as unread.
