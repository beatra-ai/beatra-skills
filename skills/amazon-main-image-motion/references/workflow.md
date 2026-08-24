# Main image motion workflow

## Build the shot plan

Record only seller-supplied facts plus what the image itself shows.
Separate SKU identity when given, the marketplace and language, the one
motion the seller asked for, and every must-keep. A missing fact stays
a named gap. Do not fill it from a similar SKU, a remembered listing,
or what the pack "probably" claims.

Transcribe every legible string on the pack verbatim — brand, variant,
size, count, certification. Quote each one on the plan and mark it to
stay pixel-identical. A string you cannot read is reported unread, not
guessed.

Write the plan in three beats:

- **0.0s opening state.** Name what is present and, explicitly, what is
  not yet present. A lid that must lift has to start closed on the
  plan, or the reveal has nowhere to come from.
- **Motion.** One entry from the product vocabulary, with direction and
  speed. Turntable rotation, light sweep, and gentle push-in are always
  available. Lid lift, unfold, and exploded view need the seller to
  supply what is inside, because the source frame does not show it;
  without that, ask for it or offer a turntable instead. Keep the
  movement small. A large movement distorts the product and smears the
  label.
- **Closing hold.** The frame the clip rests on.

Default plan: one silent 2–15s clip from one image. Duration is a
supported integer SKU chosen with the seller; if they do not pick, use
5s. The plan locks white background, product colour, and every quoted
string. It does not lock the crop, because the card's output ratio can
re-frame the shot. The delivered clip is reviewed against that lock.
Generated frames can still drift; report drift rather than gloss it.

## Upload the image

Inspect the image first. Upload with its exact MIME type. The helper
completes the upload grant and HTTP PUT, then prints the artifact
reference:

```text
python3 scripts/mcp_client.py upload ./main-image.jpg --mime-type image/jpeg
```

Keep the artifact ID. Never pass a local path to `beatra.videos.animate`.

## Read the live model card

Call `beatra.models.list` with `image_to_video` before choosing model,
duration, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

Admit the image on a card that accepts a first-frame image without
`driving_audio`. Use `model: "auto"`. Omitting `aspect_ratio` does not
request the image's ratio; it leaves the ratio to the card, which may
apply a declared model default, a source-derived ratio, or fixed model
behaviour. Only the second is tied to the image. On either of the other
two, compare the card's output ratio with the image's, recorded when you
inspected it, and if they differ, say so before the production card —
the pack shot will be re-framed. Compare MIME, dimensions, bytes, and
the chosen duration with advertised constraints.

## Freeze and submit

Show the six-field production card from the root before the first
billable animate. State the count out loud: one submit is one charge,
two takes are two charges. After approval, mint one opaque
`client_request_id`. Submit once:

```text
printf '%s' '{
  "image": {"type": "artifact", "artifact_id": "art-main-image"},
  "prompt": "Locked camera on this white-background pack shot. The bottle turns slowly through one revolution and stops. Background stays pure white. All text stays perfectly intact and pixel-identical, including \"Cold Pressed\", \"500 ml\". No added props, no grain, no vignette, no watermark.",
  "duration": 5,
  "client_request_id": "opaque-main-image-001"
}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Choose a live-card route that supports silent output. Pass
`generate_audio: false` only when the selected card supports that
control; omitting it takes the model's own default.

A changed image, prompt, duration, or model is new work: new card, new
ID. Two SKUs are two cards and two IDs. Do not attach `driving_audio`.
Do not invent a stitch, concat, or editor tool.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the seller asks, then wait for a terminal state.

Review against the plan: the named motion fired, the background stayed
white, and every quoted string is still readable at full size. Report unread small type as unread and label drift as drift.
Deliver the clip with actual dimensions, duration, usage, and
`billing.net_charged_credits`.
