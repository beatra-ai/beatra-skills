# Policy-digest workflow

## Build the page list

Record only user-confirmed public points. Separate digest title, page
or step title, printed digest text, language, destination, and optional
visual references. A missing line stays a named gap. Do not fill it
from a remembered statute, a subsidy amount, or a public post.

Default plan: one portrait 2K still per page (`aspect` `3:4`). Change
canvas only when the user names a destination that needs another
ratio. Do not add an official stamp, red-head, or letterhead the
office did not supply.

## Upload optional references

If the user supplies a brand still or a digest scan, upload it with
its exact MIME type. The helper completes the upload grant and HTTP
PUT, then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-digest-cover.png --mime-type image/png
```

Keep the artifact ID. The generate route does not require this file.
When a later edit uses the accepted page as `images[0]`, read the live
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
public points. Do not ask the model to invent eligibility, amounts, or
an official document.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per page. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved public-policy digest page still. Print only the confirmed digest title and public points. Do not add a stamp or a forged notice.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"3:4"},
  "client_request_id":"opaque-policy-page-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed fact line, language, canvas, model, or prompt is new work: new
card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-page"}],"prompt":"Correct only the approved local change. Keep every other confirmed line.","count":1,"client_request_id":"opaque-policy-page-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the user asks, then wait for a terminal state.

Review visible printed text against the page list. Report unread small
type as unread. Do not treat the still as a certified official notice.
