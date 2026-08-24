# Hotel amenity clip workflow

## Shot list

Write one slot per amenity still before any paid call. Each slot names
the amenity from the property and the inspected still. Do not invent a
pool, gym, or camera move. The labeled list is the free artifact. It
is not approval.

If a still exists and its amenity name is empty, stop and collect the
name.

Default duration is a supported integer in 2–15s. If the seller does
not pick, use 5s.

## Upload

Inspect each still first. For a local file, upload only through the
bundled client:

```text
python3 scripts/mcp_client.py upload ./pool.jpg --mime-type image/jpeg
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

Admit each still on a card that accepts a first-frame image without
`driving_audio`. Use `model: "auto"`. Preserve the photo-derived aspect
ratio by omitting `aspect_ratio`. Show the six-field production card,
then submit once per still:

```json
{
  "image": {"type": "artifact", "artifact_id": "<the uploaded amenity still>"},
  "prompt": "<the written amenity name for this still>",
  "duration": 5,
  "client_request_id": "opaque-amenity-01"
}
```

Poll `beatra.tasks.get` until terminal. Read actual video MIME,
duration, size, and `billing.net_charged_credits`. Do not treat a
storyboard preview as the clip review. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

## Review and recovery

Review that every clip keeps the amenity shown in that still. After a
returned `task_id`, poll that task. If the create response is lost,
search with `beatra.tasks.list` and verify with `beatra.tasks.get`
before replay. Reuse an ID only with byte-identical arguments. A
changed still, prompt, duration, or model is a new card and a new ID.
