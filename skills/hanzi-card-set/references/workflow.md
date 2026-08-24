# Hanzi-card pack workflow

## Build the pack list

Record only user-confirmed lines. Separate set identity, each named
character or named card group in the user's words, any supplied
pinyin or gloss, language, destination, and optional visual
references. A missing character stays a named gap. Do not fill it
from a textbook photo, a remembered word list, or a dictionary.

Default plan: one 3:4 2K still per named character, four to eight
stills. If they name fewer than four characters, keep that count.
Cap at eight. If they group characters onto named cards, keep those
groups. If they want a standard set and have not numbered cards, use
four roles that already have characters. Extra characters beyond
eight stay on the plan as named gaps. Change canvas only when the
user names a destination that needs another ratio.

Keep one shared look across the pack: type, palette, layout, and
background.

## Upload optional references

If the user supplies a brand or sample still, upload it with its exact
MIME type. The helper completes the upload grant and HTTP PUT, then
prints the artifact reference:

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
characters and supplied lines. Do not ask the model to invent a
character, pinyin, gloss, stroke count, or score.

## Freeze and submit

Show the six-field production card from the root before the first
billable generate. The card lists every named slot in the pack. After
approval, mint one opaque `client_request_id` per still. Submit once:

```text
printf '%s' '{
  "prompt":"Create the approved hanzi recognition-card still. Print only the confirmed character and supplied lines. Keep the shared pack look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"3:4"},
  "client_request_id":"opaque-hanzi-card-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed character line, language, canvas, model, or prompt is new
work: new card, new ID. Keep at most two generate tasks in flight.

For a local correction after acceptance:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-hanzi-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed character line and the shared pack look.","count":1,"client_request_id":"opaque-hanzi-card-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the user asks, then wait for a terminal state.

Review visible printed text against the pack list. Report unread small
type as unread. Do not treat the still as a scored sample or a
certified reading level.
