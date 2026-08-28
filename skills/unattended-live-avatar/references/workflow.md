# Unattended live avatar workflow

## Clone admission

When a new authorized voice is required, confirm consent first. Access to
a file is not consent. A suitable sample is currently about 10 to 300
seconds, no larger than 20 MiB, and clean single-speaker speech. Only
after consent, upload a local sample through the bundled client after
inspection. Show the clone admission card before creating a clone request
ID: route `voice_clone`, tool `beatra.voices.clone`, live price for one
successful activated voice, the provisional estimate, the 600-credit gift
usually cannot start this clone, `https://console.beatra.ai/topup`,
starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not create
`client_request_id` until the user confirms they have topped up or already
have enough credits. Do not offer a free clone. Submit `beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Shop Night Voice",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-unattended-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze the returned
`voice_id`. Without a clone, call `beatra.voices.list` when a catalog
voice still needs to be selected. Never put a display name in `voice`.

## Narration before video

If approved speech already exists for a slot, skip
`beatra.speech.synthesize` for that slot. On the script route, poll each
`beatra.speech.synthesize` task with `beatra.tasks.get` until terminal.
Live driving-audio i2v (wan2.7-i2v) SKUs are 2–15s. If planned speech is
longer than the longest containable clip, keep a ledger of sequential
segments. Each segment has its own speech request ID, approved audio
artifact, and video request ID. Do not shorten words to cheapen a clip.
Read the returned artifact plus actual audio MIME type, duration, and
size. Approve the real audio before that segment's video admission.
Refresh `image_to_video` cards and re-admit the actual portrait plus that
audio. If terminal audio size remains unavailable, stop before video.

## Video admission

Show the video admission card before creating a video request ID: route
`image_to_video`, tool `beatra.videos.animate`, approved portrait and
speech artifacts, prompt, audio-led duration, resolution if set, output
count, provisional live estimate, the 600-credit gift usually cannot start
this video, `https://console.beatra.ai/topup`, starter ¥29 / 11,000
credits. Duration is the smallest admitted whole second at or above real
speech length. Do not shorten words to cheapen the clip.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_portrait"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_speech"},
  "prompt": "A clear shop-floor delivery with steady eye line, subtle expression, and a stable camera.",
  "duration": 8,
  "client_request_id": "opaque-unattended-welcome-seg-01"
}
```

Keep `model: "auto"` unless the user chose an eligible video model.
Preserve the portrait-derived aspect ratio by omitting `aspect_ratio`.
Treat identity, clothing, and background as must-keeps and review drift
after delivery.

Later nights reuse the frozen `voice_id` and the same portrait artifact
when it still admits. Label delivered clips as welcome, product, FAQ, or
close so the shop can loop them.
