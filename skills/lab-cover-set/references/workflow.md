# Lab cover pack workflow

## Build the pack list

Record only user-confirmed lines. Separate set identity, each named
assignment and its points in the user's words, language, destination,
and optional visual references. A missing point stays a named gap.
Do not fill it from a lab photo, a similar assignment, or a remembered
score or conclusion.

Default plan: one 3:4 2K still per named assignment, four to eight
stills. If they name fewer than four assignments, keep that count.
Cap at eight. If they want a standard set and have not numbered
assignments, use four roles that already have names. Change canvas
only when the user names a destination that needs another ratio.

Keep one shared look across the pack: type, palette, layout, and
background.

## Upload optional references

If the user supplies a brand still, upload it with its exact MIME
type. The helper completes the upload grant and HTTP PUT, then prints
the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-brand-mark.png --mime-type image/png
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
assignment names and points. Do not ask the model to invent an
assignment, a score, or an experiment conclusion.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. The card lists every named slot in the pack. After
approval, mint one opaque `client_request_id` per still. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved assignment-cover still. Print only the confirmed assignment name and points. Keep the shared pack look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"3:4"},
  "client_request_id":"opaque-lab-cover-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed assignment line, language, canvas, model, or prompt is new
work: new card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-cover-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed assignment line and the shared pack look.","count":1,"client_request_id":"opaque-lab-cover-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the user asks, then wait for a terminal state.

Review visible printed text against the pack list. Report unread small
type as unread. Do not treat the still as a grade or an experiment
conclusion.
