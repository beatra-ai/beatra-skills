# Wedding opening workflow

## Build the three-keyframe sheet

Record only studio-supplied facts. Separate mood, palette, ceremony
type, language, the three named beats, and any name, date, or venue
the studio already wrote down. A missing identity fact stays a named
gap. Do not fill it from a remembered wedding, a nearby listing, or a
model guess.

Default plan: three 16:9 2K stills, then one 2–15s opening film.
Duration is a supported integer chosen with the user; if they do not
pick, use 8s. The film is one clip. Do not stitch.

## Upload optional later references

The three keyframes are generated stills. A studio photo is optional
and only for a later `reference_to_video` card. Inspect the file
first. Upload with its exact MIME type. The helper completes the
upload grant and HTTP PUT, then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./studio-still-01.jpg --mime-type image/jpeg
```

Keep the artifact ID. Never pass a local path to a remote tool. A
photo does not replace a generated keyframe and is not a source for a
missing name, date, or venue.

## Read the live model cards

Call `beatra.models.list` with `text_to_image` before choosing model,
canvas, count, or still price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Call it again with `text_to_video` before the film card:

```json
{"capability": "text_to_video"}
```

Call it again with `reference_to_video` only when the studio asks for
the optional references path:

```json
{"capability": "reference_to_video"}
```

Keep `model: "auto"` unless the user chose a live-eligible model on
that card. Confirm live duration, ratio, and price. Do not send a
duration outside 2–15s.

## Freeze and submit the stills

Show the six-field stills card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id` per keyframe. Submit once:

```text
printf '%s' '{
  "prompt":"Create approved storyboard keyframe 01 of 03 for this wedding opening film. Use only the confirmed ceremony facts. Do not invent a name, date, or venue.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"16:9"},
  "client_request_id":"opaque-wedding-still-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed beat, must-keep fact, prompt, model, or canvas is new work:
new card, new ID. Keep at most two generate tasks in flight.

After the three stills are accepted, the opening film uses a fresh
six-field card. Do not reuse a stills ID. Submit once:

```text
printf '%s' '{
  "prompt":"One wedding opening film from the approved three-keyframe storyboard. Keep confirmed ceremony facts. Do not invent a name, date, or venue.",
  "model":"auto",
  "duration":8,
  "client_request_id":"opaque-wedding-film-01"
}' | python3 scripts/mcp_client.py call beatra.videos.generate
```

One clip. Do not stitch, concat, or interpolate the three stills. Do
not invent an editor tool.

An optional later references clip is another new card. Use the three
accepted still artifacts as ordered image references:

```text
printf '%s' '{
  "references":[
    {"kind":"image","media":{"type":"artifact","artifact_id":"art-wedding-still-01"}},
    {"kind":"image","media":{"type":"artifact","artifact_id":"art-wedding-still-02"}},
    {"kind":"image","media":{"type":"artifact","artifact_id":"art-wedding-still-03"}}
  ],
  "prompt":"One wedding opening film guided by these three approved storyboard stills. Keep confirmed ceremony facts. Do not invent a name, date, or venue.",
  "model":"auto",
  "duration":8,
  "client_request_id":"opaque-wedding-refs-01"
}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
```

Do not treat the stills card or the text-to-video card as approval of
this references call.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the studio asks, then wait for a terminal state.

Review visible names, dates, and venues against the must-keep list.
Report unread or invented identity as unread. Deliver the three
stills, then the one clip, with actual dimensions, duration, and
`billing.net_charged_credits`.
