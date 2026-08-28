# Homestay welcome talking-clip workflow

## Storyboard

Write one slot per still in stay order before any paid call. Each slot
names the still, the spoken line from confirmed facts, and a planned
2–15s window. Do not invent house rules, fees, lockbox codes, or
unseen amenities. The storyboard is the free artifact. It is not
approval.

## Speech admission

When the user already supplied an approved speech track for a slot,
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
  "input": "Welcome. Wi-Fi is on the kitchen card. Parking is in bay 3.",
  "voice": "voice_...",
  "format": "mp3",
  "client_request_id": "opaque-welcome-speech-01"
}
```

Use `mp3` only when the live speech card supports it and the live
video card accepts `audio/mpeg`. If the user requested `flac`, `opus`,
or `pcm` and the video route does not accept the resulting format,
explain the incompatibility before any paid call and obtain the user's
choice. Poll `beatra.tasks.get` until terminal. Read actual
`task.output.audio.mime_type`, `duration_seconds`, and `size_bytes`.
Do not treat a script preview as the audio review.

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
600-credit signup gift usually cannot start this video. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Starter ¥29 /
11,000 credits. Do not recommend ¥198.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_host"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_welcome_01"},
  "prompt": "The host greets arriving guests from this still. Keep face, clothing, and room details stable.",
  "duration": 8,
  "client_request_id": "opaque-welcome-video-01"
}
```

Keep `model: "auto"` unless the user chose an eligible video model.
Preserve the photo-derived aspect ratio by omitting `aspect_ratio`.
Submit exactly once per approved audio segment. Do not invent a
stitch, concat, or editor tool.

## Review

Deliver clips in stay order. Report actual dimensions, duration,
usage, and `billing.net_charged_credits`. Check that spoken facts
match the host's brief and that the first frame still matches the
source photo.
