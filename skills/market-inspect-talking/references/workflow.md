# Merchant notice talking-clip workflow

## Slot list

Write one slot per still before any paid call. Default three slots
unless the office names another count in 2 to 8: preparation,
cooperation, and contact or window hours. Each slot names the still,
the spoken line from the supplied merchant inspection notices, and a
planned 2–15s window. Do not invent violations, state enforcement
conclusions, or promise inspection outcomes. The labeled list is the
free artifact. It is not approval.

Inspect every still first. For a local file, upload only through the
bundled client (`scripts/mcp_client.py` / `beatra.assets.upload`) and
keep the returned artifact id. Never pass a local path to
`beatra.voices.clone`, `beatra.speech.synthesize`, or
`beatra.videos.animate`.

## Clone admission

Skip clone unless the office wants a cloned voice and can authorize a
sample they own. File access is not consent. Read the live
`voice_clone` card, show a six-field clone card, then submit
`beatra.voices.clone` once. Poll `beatra.tasks.get` and keep the
returned `voice_id` frozen for later speech slots.

## Speech admission

When the office already supplied an approved speech track for a slot,
skip synthesis and admit that audio. Otherwise call
`beatra.models.list` with `{"capability":"text_to_speech"}`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

Call `beatra.voices.list` only when a catalog voice still needs to be
selected. Never put a display name in `voice`. Show the speech
production card, then submit once per slot:

```json
{
  "input": "<the written merchant-notice line for this slot>",
  "voice": "voice_...",
  "format": "mp3",
  "client_request_id": "opaque-notice-speech-01"
}
```

Poll `beatra.tasks.get` until terminal. Read actual
`task.output.audio.mime_type`, `duration_seconds`, `size_bytes`, and
`billing.net_charged_credits`. Do not treat a script preview as the
audio review. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

## Video admission

Call `beatra.models.list` with `{"capability":"image_to_video"}`:

```json
{"capability": "image_to_video"}
```

Admit the still plus the approved audio. Live driving-audio i2v SKUs
are 2–15s. Use the smallest supported integer duration at or above the
actual speech length. Split a longer spoken slot into sequential
containable segments. Each segment is a new speech call and a new
video call. Show the video production card before creating a video
request ID. Approved narration does not authorize the video call. The
600-credit signup gift usually cannot start this video.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_notice_01"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_notice_speech_01"},
  "prompt": "A restrained merchant-notice read from this still. Keep face, notice graphic, and lighting stable.",
  "duration": 8,
  "client_request_id": "opaque-notice-video-01"
}
```

Keep `model: "auto"` unless the office chose an eligible video model.
Preserve the photo-derived aspect ratio by omitting `aspect_ratio`.
Submit exactly once per approved audio segment. Do not invent a
stitch, concat, or editor tool.

## Review and recovery

Review identity, speech clarity, and mouth timing. Confirm spoken
points match the supplied merchant notices. Report only what the host
can actually see and hear. After a returned `task_id`, poll that task.
If the create response is lost, search with `beatra.tasks.list` and
verify with `beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed still, line, voice, or duration is
a new card and a new ID.
