# Listing room video workflow

## Room labels

When the user already named each photo, skip `beatra.images.understand`.
Otherwise call `beatra.models.list` with `{"capability":"image_to_text"}`,
show the live understand estimate (currently 5 credits per admitted
image), and submit one batch of one to eight images:

```json
{
  "prompt": "Label each listing photo as a room or exterior and name visible fixtures without inventing area, price, or unshown amenities.",
  "images": [
    {"type": "artifact", "artifact_id": "art_room_01"}
  ],
  "model": "auto",
  "client_request_id": "opaque-listing-label-01"
}
```

Poll with `beatra.tasks.get` until terminal. Keep the returned labels on
the photo ledger. A later unlabeled batch is a new request ID.

## Photo-motion admission

Primary route: one listing photo becomes one short clip. Call
`beatra.models.list` with `{"capability":"image_to_video"}` and admit
the photo without `driving_audio`. Duration is a supported 2–15s SKU
chosen with the user. Show the video admission card before creating a
video request ID: route `image_to_video`, tool `beatra.videos.animate`,
admitted photo, prompt, chosen duration, resolution if set, output
count, provisional live estimate, the 600-credit gift usually cannot
start this video, `https://console.beatra.ai/topup`, starter ¥29 /
11,000 credits. Do not recommend ¥198.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_living"},
  "prompt": "A restrained camera push across the living room while furniture and window light stay in place.",
  "duration": 5,
  "client_request_id": "opaque-listing-living-01"
}
```

Keep `model: "auto"` unless the user chose an eligible video model.
Preserve the photo-derived aspect ratio by omitting `aspect_ratio`.
Submit exactly once per room. Do not invent a stitch, concat, or editor
tool.

## Optional agent narration files

When the user wants spoken listing copy as files beside the clips, call
`beatra.voices.list` if a catalog voice still needs to be selected and
`beatra.models.list` with `{"capability":"text_to_speech"}`. Show the
narration arguments and paid boundary. Submit
`beatra.speech.synthesize` exactly once per file. Poll to terminal and
read actual audio MIME type, duration, and size. Deliver those files
separately. Do not attach them as `driving_audio` on a room-photo
animate call. There is no mix tool.

## Optional talking-head intro or outro

Only when the user brings an authorized agent portrait and a script.
Inspect the portrait first: MIME, width, height, aspect, bytes, alpha.
File access is not consent for likeness or voice. Confirm a live card
admits `[image, driving_audio]`. On the script route, synthesize with a
catalog voice, poll to terminal, and read actual audio MIME, duration,
and size before video admission. Live driving-audio i2v (wan2.7-i2v)
SKUs are 2–15s. Split a longer script into sequential segments. Each
segment is its own speech call and its own video call. Do not shorten
words to cheapen. Do not silently change the audio format. Show a
separate video admission card before any talking-head
`client_request_id`. Approved narration does not authorize the video
call. Duration is the smallest admitted whole second at or above real
speech length.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_agent"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_intro"},
  "prompt": "A restrained agent delivery with steady eye line, subtle expression, and a stable camera.",
  "duration": 8,
  "client_request_id": "opaque-listing-intro-seg-01"
}
```
