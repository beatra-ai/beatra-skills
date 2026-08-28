# Project handover sign workflow

## Build the 3-sign pack list

Record only contractor-confirmed lines. Separate project or pack
identity, each named sign title, every statutory inscription that
sign must print, language, destination, and optional visual
references. A missing inscription stays a named gap. Do not fill it
from a site photo, a remembered unit name, today's date, or a model
guess.

Default plan: three 3:4 2K stills for the first three named signs.
A typical project set is five to ten signs in total. Remaining named
signs are a later pack, not the first submit. If they name fewer than
three signs, keep that count. Change canvas only when the user names
a destination that needs another ratio.

Keep one shared look across the pack: type, palette, layout, and
background. Print titles and statutory inscriptions verbatim. Do not
add an official stamp, acceptance conclusion, or filing number the
contractor did not supply.

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
sign titles and statutory inscriptions. Do not ask the model to infer
a handover date, unit name, or project name.

## Freeze and submit the first three signs

Show the six-field production card from the root before the first
billable generate. The first card lists the first three named signs.
After approval, mint one opaque `client_request_id` per still. Submit
once:

```text
printf '%s' '{
  "prompt":"Create the approved project-handover sign still. Print only the confirmed sign title and statutory inscriptions. Keep the shared pack look.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"3:4"},
  "client_request_id":"opaque-handover-sign-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed inscription, language, canvas, model, or prompt is new
work: new card, new ID. Keep at most two generate tasks in flight.

After the first three stills are accepted, remaining named signs use
the same payload shape. Show a fresh six-field pack card: live
`text_to_image` price times remaining slot count, one paid call per
slot, one new `client_request_id` per slot. Do not reuse a first-three
ID. Do not treat the first-three card as pack approval.

For a local correction after acceptance, read the live `image_edit`
card first:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_edit"}
```

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"accepted-handover-sign-still"}],"prompt":"Correct only the approved local change. Keep every other confirmed inscription and the shared pack look.","count":1,"client_request_id":"opaque-handover-sign-edit-01"}' | python3 scripts/mcp_client.py call beatra.images.edit
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the contractor asks, then wait for a terminal state.

Review visible printed text against the pack list. Report unread small
type as unread. Do not treat the still as an official completion
filing, a legal certificate, or a published acceptance notice.
