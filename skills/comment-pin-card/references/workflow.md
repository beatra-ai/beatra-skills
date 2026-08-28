# Pin comment workflow

## Build the quote list

Record only original lines the seller supplied or that a confirmed
lookup returned. Separate the post link, each quote in the seller's
chosen words, language, and destination. A missing quote stays a named
gap. Do not fill it from a remembered viral comment.

Default plan: one 1:1 2K still per chosen quote, up to six. Change
canvas only when the seller names another pin surface.

## Look up, then plan

If the seller pasted the lines, skip lookup. If they gave a link and
asked this connection to read it, follow
[comment lookup](comment-lookup.md) on its own card first. Deliver the
returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or
duration.

Then write the free pin plan from those lines. The seller picks which
quotes become cards.

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
chosen original quote. Do not ask the model to invent a comment.

## Freeze and submit generate

Show the six-field generate card from the root before the first
billable image. After approval, mint one opaque `client_request_id`
per card. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved pin comment still. Show only the chosen original quote. Keep the words readable. Do not add likes or names the seller did not supply.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "client_request_id":"opaque-pin-card-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed quote, language, canvas, model, or prompt is new work: new
card, new ID. Keep at most two generate tasks in flight.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review visible printed words against the chosen quote list. Report
unread small type as unread.
