# Photo restyle workflow

## Establish the restyle card

Inspect the source photo the host Agent can actually access and record its real
MIME type, width, height, aspect ratio, and byte size. Then record the subject
and how many people or animals appear, the framing, the background, the dominant
palette, the lighting, and any text or logo visible in the frame.

Write the card as one target style plus a must-keep list. One dominant style per
run keeps the result legible; stacking unrelated style directions in a single
prompt degrades likeness and line quality. Default must-keeps are face and
likeness, hair shape and colour, visible clothing, pet markings, product shape
and label, and anything the user named.

When the user supplies style references, note what each one contributes before
ordering them: palette, line weight, shading model, texture, or overall look.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already
inspected:

```text
python3 scripts/mcp_client.py upload ./portrait.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./style-reference.png --mime-type image/png
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input
instead. Preserve every returned artifact reference and reuse it across the
batch rather than uploading the same file again.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`.
The MCP tool name is the CLI argument after `call`, and its JSON arguments go on
standard input:

```text
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI
fallback.

## Preflight the live image card

Before any paid restyle, call `beatra.models.list` for the capability the route
needs and inspect the current typed cards: accepted input kind, MIME format,
number of inputs, byte and edge limits, canvas presets and source anchoring,
supported controls, output count, and the per-successful-image price with its
billing basis. Confirm the actual source photo and every style reference against
those live values. If an actual fact is unavailable or incompatible, stop before
the paid call and request the smallest compatible change.

Keep `model: "auto"` unless the user chose a concrete eligible model. A concrete
model is used exactly as named only when its card admits every input and
explicit control. Numeric estimates are provisional and never replace terminal
billing.

## Restyle the photo in place

`beatra.images.edit` keeps the first input as the base, so the redrawn image
holds the original framing and the omitted canvas resolves to 2K anchored to
`images[0]`. Omit `edit_regions`, because the whole frame is being redrawn:

```json
{
  "prompt": "Redraw this photo as soft cel-shaded anime illustration with clean line art and warm daylight shading; keep the woman's face, hairstyle, glasses, and striped jacket recognizable, and keep the same framing.",
  "images": [
    {"type": "artifact", "artifact_id": "art_source_photo"},
    {"type": "artifact", "artifact_id": "art_style_reference"}
  ],
  "count": 1,
  "seed": 20260810,
  "client_request_id": "opaque-restyle-id"
}
```

Edit accepts one to four ordered inputs and has neither `output_relationship`
nor `reasoning`. When a style reference is supplied, name its role in the prompt
so the model applies the look rather than importing the reference's subject.

## Build a new composition instead

Use `beatra.images.transform` when the user wants a new scene, pose, or layout
rather than the same photo redrawn:

```json
{
  "prompt": "Draw the person from image 1 as a chibi sticker character in the flat pastel style of image 2, standing and waving, plain background.",
  "images": [
    {"type": "artifact", "artifact_id": "art_source_photo"},
    {"type": "artifact", "artifact_id": "art_style_reference"}
  ],
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "1:1"},
  "output_relationship": "independent",
  "client_request_id": "opaque-transform-id"
}
```

On a transform, an explicit preset `aspect: "source"` follows the **last**
ordered input, and the omitted default is 2K at 16:9. State the intended ratio
explicitly so a trailing style reference does not decide the framing.

## Keep one look across a batch

After the user accepts the first result, freeze that look as a recipe: the exact
prompt wording, the ordered inputs and their roles, the model, the canvas, and
the `seed`. Reuse the recipe for each remaining photo, changing only the source
artifact and the subject-specific must-keeps.

`seed` is a strict integer from 0 through 2,147,483,647; omit it for
model-managed randomness. A repeated seed with the same recipe makes a look
reproducible, though a different source photo still varies the result. Each
image is a separate paid request with its own confirmation and its own opaque
`client_request_id`.

To show the user several takes on the one chosen look, raise `count` to at most
4 in one request and present the returned variants together. One request carries
one prompt, so these are variations of a single style direction; four genuinely
different styles are four separate paid requests. The request is admitted as a
whole and is charged per successfully persisted image.

## Revise an accepted result

Treat a revision as new paid work on the accepted image. Use
`beatra.images.edit` with that result as `images[0]`, and add `edit_regions`
only when the change is genuinely bounded — for example a hand, an accessory, or
a small background area. Each region is a normalized rectangle keyed by
`image_index`, where `x` and `y` are at least zero and below one, `width` and
`height` are greater than zero and at most one, and `x + width` and `y + height`
may not exceed one. Region geometry must be unique, and each input accepts at
most two regions. A region focuses intent but does not guarantee that pixels
outside it are untouched.

## Poll, recover, and cancel

Keep a private ledger entry for each stage: logical label, full frozen
arguments, stable request ID, approval, creation time, create response, task ID,
and terminal result. Record the returned task ID immediately and call
`beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and
`running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the
same ID. If the task ID is lost, call `beatra.tasks.list` for the capability,
call `beatra.tasks.get` on plausible candidates, and match returned facts
against the ledger; an ambiguous match stops submission. If the request ID
itself is lost, do not invent a new one and do not replay: attempt task recovery
and stop if the original cannot be identified. Never reuse an ID after any
argument changes and never replace a slow task with a duplicate.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known
task and confirm a terminal state with `beatra.tasks.get`. If cancellation
returns `409`, continue polling the same task; cancellation remains unconfirmed
and does not authorize another cancel or replacement work.

## Deliver and review real results

Deliver every returned image artifact or link and report only actual task
status, resolved model, dimensions, format, usage, and
`billing.net_charged_credits`. Images are charged in whole credits per
successfully persisted image, so a partial multi-output result is billed only
for the images that succeeded.

Review only media the host Agent can actually access. Check likeness and facial
structure, hair, clothing and accessories, pet markings, product shape and
label, hands and fingers, background continuity, style match to the requested
direction, and the actual output ratio. Generative restyling does not reproduce
a face pixel-for-pixel. State visible drift and inspection limits honestly, and
when one focused revision would help, name the smallest change and wait for a
new paid approval.
