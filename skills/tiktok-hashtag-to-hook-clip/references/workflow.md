# TikTok hashtag hook workflow

## Slot list

Write one slot per operator-picked hashtag before any paid call.
Default three slots unless the operator names another count in 2 to
8. Each slot names the original hashtag wording, the speakable hook
from confirmed brand or product facts, the still, and intended
length as a 2–15s clip. Do not invent a hashtag, rank, heat score,
or offer. The labeled list is the free artifact. It is not approval.

If the operator wants this connection to read public TikTok hashtag
rankings or head posts, follow [hashtag lookup](hashtag-lookup.md)
on its own card first.

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
production card, then submit once per slot with `input`, not `text`.

```text
printf '%s' '{"input":"Open on the approved hashtag hook. Keep the operator-supplied line.","voice":"voice-ready-01","format":"mp3","speed":1.0,"model":"auto","client_request_id":"opaque-hook-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

## Video admission

Call `beatra.models.list` with `{"capability":"image_to_video"}`:

```json
{"capability": "image_to_video"}
```

Confirm the live card accepts `[image, driving_audio]`. One still,
one 2–15s clip. Duration is audio-led. Do not stitch. Show the
video card, then submit `beatra.videos.animate` once per slot with
`driving_audio` attached.

Poll `beatra.tasks.get` until terminal. Read actual MIME, duration,
size, and `billing.net_charged_credits`. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"art-hook-01"},"driving_audio":{"type":"artifact","artifact_id":"art-speech-01"},"prompt":"A restrained talking hook with steady eye line and a stable camera.","duration":8,"client_request_id":"opaque-hook-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

## Review and recovery

Review that each clip names the picked hashtag and that the still is
the first frame. After a returned `task_id`, poll that task. If the
create response is lost, search with `beatra.tasks.list` and verify
with `beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed line, still, voice, or duration
is a new card and a new ID.
