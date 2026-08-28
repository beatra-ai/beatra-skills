# Douyin hot-search hook workflow

## Slot list

Write one slot per seller-picked hot-search topic before any paid call.
Default three slots unless the seller names another count in 2 to 8.
Each slot names the original topic wording, the speakable hook from
confirmed brand or product facts, the still, and intended length as a
2–15s clip. Do not invent a topic, rank, heat score, or offer. The
labeled list is the free artifact. It is not approval.

If the seller wants this connection to read the current Douyin board,
follow [trend lookup](trend-lookup.md) on its own card first.

Inspect an authorized clone sample when clone is requested. For a
local file, upload only through the bundled client
(`scripts/mcp_client.py` / `beatra.assets.upload`) and keep the
returned artifact id. Never pass a local path to
`beatra.voices.clone`, `beatra.speech.synthesize`, or
`beatra.videos.animate`.

## Speech admission

Call `beatra.models.list` with `{"capability":"text_to_speech"}`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

Call `beatra.voices.list` only when a catalog voice still needs to be
selected. Never put a display name in `voice`. Show the speech
production card, then submit once per slot.

## Video admission

Call `beatra.models.list` with `{"capability":"image_to_video"}`:

```json
{"capability": "image_to_video"}
```

Confirm the live card accepts `[image, driving_audio]`. One still,
one 2–15s clip. Duration is audio-led. Do not stitch. Show the
video card, then submit `beatra.videos.animate` once per slot.

Poll `beatra.tasks.get` until terminal. Read actual MIME, duration,
size, and `billing.net_charged_credits`. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

## Review and recovery

Review that each clip names the picked topic and that the still is
the first frame. After a returned `task_id`, poll that task. If the
create response is lost, search with `beatra.tasks.list` and verify
with `beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed line, still, voice, or duration
is a new card and a new ID.
