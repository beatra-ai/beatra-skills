# Temu main image motion workflow

## Shot plan

Write one slot per main image before any paid call. Record only
seller-supplied facts plus what the image itself shows. Separate SKU
identity when given, the one motion the seller asked for, and every
must-keep. A missing fact stays a named gap. Do not fill it from a
similar SKU or a remembered listing.

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
supported integer chosen with the seller; if they do not pick, use 5s.
The plan locks background, crop, product colour, and every quoted
string — and the delivered clip is checked against that lock.
Generated frames can still drift; report drift rather than gloss it.

## Upload

Inspect each image first. For a local file, upload only through the
bundled client:

```text
python3 scripts/mcp_client.py upload ./main-image.jpg --mime-type image/jpeg
```

Keep the artifact ID. Never pass a local path to
`beatra.videos.animate`.

## Animate admission

Call `beatra.models.list` with `{"capability":"image_to_video"}`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

Admit each image on a card that accepts a first-frame image without
`driving_audio`. Use `model: "auto"`. Omit `aspect_ratio` to ask for the
source ratio, then read what the card actually promises. If the card
declares a fixed ratio, say so before the production card — the main
image will be re-framed. Compare MIME, dimensions, bytes, and the
chosen duration with advertised constraints.

Show the six-field production card from the root before the first
billable animate. A pack may list every image on one card; each image
still has its own `client_request_id`. After approval, submit once per
image:

```json
{
  "image": {"type": "artifact", "artifact_id": "<the uploaded main image>"},
  "prompt": "<the written motion for this image>",
  "duration": 5,
  "client_request_id": "opaque-temu-main-01"
}
```

Poll `beatra.tasks.get` until terminal. Read actual video MIME,
duration, size, and `billing.net_charged_credits`. Do not treat a
storyboard preview as the clip check. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198. Do not attach `driving_audio`. Do not invent a stitch, concat,
or editor tool.

## Delivery and recovery

Check that every clip keeps the product shown in that main image.
After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with byte-identical
arguments. A changed image, prompt, duration, or model is a new card
and a new ID. Cancel only when the seller asks.
