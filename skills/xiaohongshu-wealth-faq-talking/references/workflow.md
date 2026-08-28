# Wealth FAQ talking-clip workflow

## Slot list

Write one slot per chosen note question before any paid call.
Default three slots unless the advisor names another count in 2 to
8. Each slot names the original note question, the speakable line
from the supplied product draft, the still, and a planned 2–15s
window. Do not invent a note question, return, yield, holding
period, or personalized buy-or-sell line. The labeled list is the
free artifact. It is not approval.

If the advisor wants this connection to read public Xiaohongshu
wealth FAQ notes, follow [note lookup](note-lookup.md) on its own
card first.

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
printf '%s' '{"input":"Open on the approved product answer. Keep the advisor-supplied wording.","voice":"voice-ready-01","format":"mp3","speed":1.0,"model":"auto","client_request_id":"opaque-wealth-faq-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
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
printf '%s' '{"image":{"type":"artifact","artifact_id":"art-wealth-faq-01"},"driving_audio":{"type":"artifact","artifact_id":"art-speech-01"},"prompt":"A restrained wealth FAQ read with steady eye line and a stable camera.","duration":8,"client_request_id":"opaque-wealth-faq-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

## Review and recovery

Review that each clip stays on the supplied product line and that
the still is the first frame. After a returned `task_id`, poll that
task. If the create response is lost, search with `beatra.tasks.list`
and verify with `beatra.tasks.get` before replay. Reuse an ID only
with byte-identical arguments. A changed line, still, voice, or
duration is a new card and a new ID.
