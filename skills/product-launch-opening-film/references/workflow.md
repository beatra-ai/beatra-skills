# Product launch opening-film workflow

## Build the visual-tone board

Record only team-supplied facts. Separate product or event name, launch
message, visual direction or brand-reference role, language, palette,
and must-keeps. A missing claim, logo, or spec stays a named gap. Do
not fill it from a remembered keynote, a similar product, or a model
guess.

Default plan: three labeled frames (hero presence, stage atmosphere,
message beat), then one 2–15s opening film. Duration is a supported
integer chosen with the team; if they do not pick, use 8s. The board
is the free visible result. Planning is not approval.

## Upload optional brand references

If the team supplies a brand still, inspect it first. Upload with its
exact MIME type. The helper completes the upload grant and HTTP PUT,
then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./brand-ref-01.png --mime-type image/png
```

Keep the artifact ID. Never pass a local path to a remote tool. The
stills generate route does not require this file; use it only as
inspected visual direction in the prompt. Do not invent a logo the
file does not show.

When a later `beatra.videos.generate_from_references` pass uses the
three accepted stills, keep those stills as ordered image references.
Do not fold extra brand files into that list unless the team names
them as additional ordered refs on a new card.

## Read the live stills card

Call `beatra.models.list` with `text_to_image` before choosing model,
canvas, count, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Use `model: "auto"` and `count: 1` per still. Default canvas is 2K at
16:9. The prompt may show only the named product or event and
confirmed must-keeps.

## Freeze and submit the three stills

Show the six-field production card from the root before the first
billable generate. List all three stills. Credits are the live
`text_to_image` price times 3. After approval, mint one opaque
`client_request_id` per still. Submit once per still:

```text
printf '%s' '{
  "prompt":"Create the approved visual-tone still for this launch frame. Show only the named product or event and the confirmed must-keeps. Do not add an unstated logo, claim, or spec.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"16:9"},
  "client_request_id":"opaque-launch-still-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A changed frame role, must-keep, language, canvas, model, or prompt is
new work: new card, new ID for the changed stills. Keep at most two
generate tasks in flight. Do not batch three frames into one `count`.

## Read the live film card, then submit one clip

Acceptance of the three stills is not film approval. Call
`beatra.models.list` with `text_to_video` before choosing model,
duration, or price:

```json
{"capability": "text_to_video"}
```

Keep `model: "auto"` unless the team names a live-eligible model.
Never silently switch to `auto` after they chose. If they name a
model that is not live-eligible, stop and show the live card. Choose a
supported integer duration in the 2–15s range; default 8. One clip.
Do not stitch. Do not clamp a 1s or 30s request in silence.

Show a fresh six-field card for one `beatra.videos.generate` call.
After approval, mint one new opaque `client_request_id`. Submit once:

```text
printf '%s' '{
  "prompt":"One restrained 16:9 stage-screen opening film for the named launch. Keep the confirmed product identity, palette, and launch message. Do not add unstated logos or claims.",
  "model":"auto",
  "duration":8,
  "aspect_ratio":"16:9",
  "client_request_id":"opaque-launch-film-01"
}' | python3 scripts/mcp_client.py call beatra.videos.generate
```

A changed prompt, duration, model, or control is new work: new card,
new ID. Do not fold `beatra.videos.generate_from_references` into this
submit.

## Optional ordered-reference film

If the team later wants the three accepted stills to guide one film,
read `beatra.models.list` with `reference_to_video` first:

```json
{"capability": "reference_to_video"}
```

Show a further new six-field card. Credits are the live
`reference_to_video` price. Count is one paid call. Identity is one
new opaque `client_request_id`. Duration 2–15s (default 8). One clip.
Do not stitch. After approval, submit once with the three stills in
board order:

```text
printf '%s' '{
  "references":[
    {"kind":"image","media":{"type":"artifact","artifact_id":"art-tone-01"}},
    {"kind":"image","media":{"type":"artifact","artifact_id":"art-tone-02"}},
    {"kind":"image","media":{"type":"artifact","artifact_id":"art-tone-03"}}
  ],
  "prompt":"Use the three accepted visual-tone stills in order as image references for one stage-screen opening film. Keep confirmed identity, palette, and launch message.",
  "model":"auto",
  "duration":8,
  "aspect_ratio":"16:9",
  "client_request_id":"opaque-launch-refs-01"
}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
```

Admit reference count, MIME, bytes, and duration against the live
card before submit. Ordered references are inspiration, not a strict
first frame.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the team asks, then wait for a terminal state.

Review visible identity, palette, and on-screen words against the
board. Report unread small type as unread. Deliver the board, the
three stills in frame order, and at most one film clip, with actual
dimensions, duration, and `billing.net_charged_credits`. Never invent
a stitch, concat, or editor tool.
