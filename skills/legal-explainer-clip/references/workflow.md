# Legal explainer workflow

## Build the still plan and script

Record only firm-supplied public-education facts. Separate topic,
must-keep lines, language, destination, presenter look, and the
required on-screen non-lawyer presenter label printed exactly as
in the generate payload. A
missing fact stays a named gap. Do not fill it from a remembered
statute, a nearby case, or a model guess.

Refuse case-specific legal conclusions, win predictions, and
identifiable party facts. Do not write those into the script or
the still.

Default plan: one 9:16 2K digital-human still and one speakable
script sized for a single 2–15s talking clip.

## Upload optional look references

If the firm supplies a wardrobe or studio still, inspect it first.
Upload with its exact MIME type. The helper completes the upload
grant and HTTP PUT, then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./presenter-look.png --mime-type image/png
```

Keep the artifact ID for the Agent's notes. `beatra.images.generate`
does not take that file as the first frame. Describe the look in
the prompt. Never pass a local path to generate, synthesize, or
animate.

## Read the live model cards

Call `beatra.models.list` with each capability this package uses
before choosing model, canvas, format, duration, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

Call `beatra.voices.list` only when a catalog voice still needs to
be selected:

```bash
python3 scripts/mcp_client.py call beatra.voices.list
```

```json
{"language": "zh-CN", "category": "preset"}
```

Never put a display name in `voice`. Keep speech `model: "auto"`.
Use `mp3` only when the live speech card supports it and the live
video card accepts `audio/mpeg`. Confirm a current video card
admits `[image, driving_audio]` before paid speech.

## Freeze and submit the lead

Show the six-field lead card from the root before the first
billable still or speech. After approval, mint one opaque
`client_request_id` per slot. Submit each slot once:

```text
printf '%s' '{
  "prompt":"A studio digital-human presenter facing camera. Print a readable on-screen label: 非真人律师 / Non-lawyer presenter. Restrained professional look, stable lighting.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"9:16"},
  "client_request_id":"opaque-legal-still-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{
  "input":"The approved public-education explainer script.",
  "voice":"voice_selected",
  "format":"mp3",
  "model":"auto",
  "client_request_id":"opaque-legal-speech-01"
}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

A changed prompt, canvas, script, voice, format, or model is new
work: new card, new ID. Keep at most two lead tasks in flight.

Poll each task to terminal. Read actual image MIME, width, height,
and byte size, and actual audio MIME, `duration_seconds`, and
`size_bytes`. Ask the firm to accept the real still and the real
audio. A plan or script preview is not that review.

## Fit accepted media to one talking clip

Refresh the current `image_to_video` cards after the still and
audio are accepted. Compare every image fact and the audio's
actual MIME, duration, and byte size with advertised constraints.
The card must still admit `[image, driving_audio]`.

Choose the smallest supported integer video duration at or above
the actual speech length, inside 2–15s. Do not truncate, speed
up, or add silence merely to force a match. If the complete
speech exceeds the longest containable clip, stop and offer a
shorter script as new paid speech. Do not stitch.

Keep `model: "auto"` unless the user chose a concrete eligible
card that accepts `driving_audio`. Omit `aspect_ratio`. The
accepted still is the strict first frame. `driving_audio` is
required.

Show the **new** six-field video card from the root. Accepted
lead work is not video approval. After approval, mint a new
opaque `client_request_id` and submit once:

```text
printf '%s' '{
  "image": {"type": "artifact", "artifact_id": "art-legal-still-01"},
  "driving_audio": {"type": "artifact", "artifact_id": "art-legal-speech-01"},
  "prompt": "A restrained public-education presenter speaks to camera. Keep the 非真人律师 / Non-lawyer presenter label readable. Steady eye line, subtle head movement, stable camera.",
  "duration": 8,
  "client_request_id": "opaque-legal-video-01"
}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response
is lost, search with `beatra.tasks.list` and match the private
ledger before any replay. Reuse an ID only with byte-identical
arguments. Cancel only when the firm asks, then wait for a
terminal state. One approval never covers retries.

Review the readable non-lawyer label on the still and in the
clip, the spoken public-education lines, first-frame identity,
and must-keep drift. Report unread label text as unread. Do not
treat the clip as a case conclusion.
