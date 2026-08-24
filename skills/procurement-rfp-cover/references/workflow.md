# RFP-cover workflow

## Build the fact list

Record only seller-confirmed lines. Separate project identity, printed
tender text, agency, language, destination, and optional
visual references. A missing line stays a named gap. Do not fill it
from a letterhead photo, a similar project, or a remembered bid tale.

Default plan: one square 2K still per project. Change canvas only when
the seller names a destination that needs another ratio. Default four
projects unless the seller names another count in 4 to 8.

## Upload optional references

If the seller supplies a letterhead or brand still, upload it with its
exact MIME type. The helper completes the upload grant and HTTP PUT,
then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-letterhead-front.png --mime-type image/png
```

Keep the artifact ID. The generate route does not require this file.
When a later edit uses the accepted card as `images[0]`, read the live
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
lines. Do not ask the model to infer a tender number or bid date.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per project. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved RFP cover still. Print only the confirmed project name and tender lines. Do not add extra tender claims.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"1:1"},
  "client_request_id":"opaque-procurement-project-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed fact line, language, canvas, model, or prompt is new work: new
card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-card"}],"prompt":"Correct only the approved local change. Keep every other confirmed line.","count":1,"client_request_id":"opaque-procurement-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review visible printed text against the fact list. Report unread small
type as unread. Do not treat the still as a certified tender claim.
