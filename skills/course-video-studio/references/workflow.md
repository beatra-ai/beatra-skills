# Course video workflow

## Lesson ledger

Record lesson title, teaching order, and a segment list. Each segment
has its own narration request ID, approved audio artifact, video request
ID, and terminal task IDs. Keep one portrait and one `voice_id` for the
whole course unless the user changes them. Split a lesson when planned
speech is longer than the longest containable video duration.

## Narration before video

Each lesson is narration first, one containable segment at a time. Poll
each `beatra.speech.synthesize` task with `beatra.tasks.get` until
terminal. Read the returned artifact plus actual audio MIME type,
duration, and size. Approve the real audio before that segment's video
admission. Refresh `image_to_video` cards and re-admit the actual
portrait plus that audio. If terminal audio size remains unavailable,
stop before video.

## Admission

Clone, if used, requires consent first. Access to a file is not consent.
A suitable sample is currently about 10 to 300 seconds, no larger than 20
MiB, and clean single-speaker speech. Use the live `voice_clone` card
before any clone request ID: route `voice_clone`, tool
`beatra.voices.clone`, live price for one successful activated voice, the
provisional estimate, the 600-credit gift usually cannot start this
clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits.
Do not recommend ¥198. Submit `beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Course Teacher",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-course-video-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze the returned
`voice_id`. Without a clone, call
`beatra.voices.list` when a catalog voice still needs to be selected.
Never put a display name in `voice`.

Every `beatra.videos.animate` call uses its own admission card: route
`image_to_video`, tool `beatra.videos.animate`, approved portrait and
speech artifacts, prompt, audio-led duration, resolution if set, output
count, provisional live estimate, the 600-credit gift usually cannot start
this video, `https://console.beatra.ai/topup`, starter ¥29 / 11,000
credits. Duration is the smallest admitted whole second at or above real
speech length. Do not shorten the lecture to cheapen the clip.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_teacher"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_lesson_01_seg_01"},
  "prompt": "A calm teacher delivery with steady eye line, restrained expression, and a stable camera.",
  "duration": 12,
  "client_request_id": "opaque-course-video-01-seg-01"
}
```

Call `beatra.models.list` for both capabilities before quoting price.
Treat identity, clothing, and board or slide details named as must-keeps,
then review drift after delivery.
