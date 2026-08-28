# Duty board pack workflow

## Build the pack list

Record only user-confirmed lines. Separate pack identity, each named
duty slot and its duty lines in the teacher's words, language, destination,
and optional visual references. A missing point stays a named gap.
Do not fill it from a flyer photo, a similar slot, or a remembered
student name or punishment rule.

Default plan: one 3:4 2K still per named duty slot, four to eight
stills. If they name fewer than four slots, keep that count.
Cap at eight. If they want a standard set and have not numbered
slots, use four roles that already have names. Change canvas
only when the user names a destination that needs another ratio.

Keep one shared look across the pack: type, palette, layout, and
background. Do not add a school stamp, student name, punishment rule,
or official notice the teacher did not supply.

## Upload optional references

If the user supplies a brand still, upload it with its exact MIME
type. The helper completes the upload grant and HTTP PUT, then prints
the artifact reference:

```text
python3 scripts/mcp_client.py upload ./confirmed-class-mark.png --mime-type image/png
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
duty slot names and duty lines. Do not ask the model to invent a slot,
student name, grade, or an official notice.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. The card lists every named slot in the pack. After
approval, mint one opaque `client_request_id` per still. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved duty-board still. Print only the confirmed duty slot name and duty lines. Keep the shared pack look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"3:4"},
  "client_request_id":"opaque-duty-board-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed duty line, language, canvas, model, or prompt is new
work: new card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-duty-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed duty line and the shared pack look.","count":1,"client_request_id":"opaque-duty-board-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the user asks, then wait for a terminal state.

Review visible printed text against the pack list. Report unread small
type as unread. Do not treat the still as an official notice, a
punishment rule, or a published school policy.
