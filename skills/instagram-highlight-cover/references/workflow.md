# Highlight cover workflow

## Build the highlight list

Record only highlight names the operator supplied or that a
confirmed account read returned as already-used titles. Separate
the account, each highlight name, the facts already given, and
the destination. A missing title stays a named gap. Do not fill
it from a remembered shop, about, or new-in label.

Default plan: one 1:1 2K still per named highlight, up to six.
Change canvas only when the operator names another cover surface.

## Look up, then plan

If the operator pasted the highlight list and the cover facts,
skip lookup. If they gave an account and asked this connection to
read it, follow [account lookup](account-lookup.md) on its own
card first. Deliver the returned payload, `task_id`, terminal
status, and `billing.net_charged_credits`. A lookup has no model,
dimensions, or duration.

Then write the free cover plan from those titles and facts. The
operator picks which highlights become covers.

## Read the live image card

Call `beatra.models.list` with `text_to_image` before choosing
model, canvas, count, or generate price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Use `model: "auto"` and `count: 1`. The prompt may show only the
named highlight and facts already given. Do not ask the model to
invent a title.

## Freeze and submit generate

Show the six-field generate card from the root before the first
billable image. After approval, mint one opaque
`client_request_id` per cover. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved Instagram highlight cover. Show only the named highlight and confirmed facts. Keep the shared cover look. Do not add titles or counts the operator did not supply.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "client_request_id":"opaque-highlight-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed name, fact, canvas, model, or prompt is new work: new
card, new ID. Keep at most two generate tasks in flight.

Use `beatra.images.edit` only after the operator accepts a still
and names the change. That edit is another card and another ID.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response
is lost, search with `beatra.tasks.list` and match the private
ledger before any replay. Reuse an ID only with byte-identical
arguments. Cancel only when the operator asks, then wait for a
terminal state.

Review visible printed words against the named highlight list.
Report unread small type as unread.
