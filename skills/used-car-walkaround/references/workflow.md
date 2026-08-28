# Used-car walkaround workflow

## Build the listing plan

Record only dealer-supplied facts. Separate listing identity, the
condition sheet, language, destination, optional listing photo, and
voice direction. Mileage, accident history, and maintenance records
may only be copied verbatim from the condition sheet. A missing fact
stays a named gap. Do not fill it from a similar car, a remembered
lot, or a model guess. Do not polish those lines.

Default plan: one 16:9 2K listing hero still and one speakable
walkaround script for the first named car. Keep the script short
enough for one 2–15s clip. Remaining stock is a later pack, not the
first submit.

## Upload an optional listing photo

If the dealer supplies a listing photo, inspect it first. Upload with
its exact MIME type. The helper completes the upload grant and HTTP
PUT, then prints the artifact reference:

```text
python3 scripts/mcp_client.py upload ./listing-hero.jpg --mime-type image/jpeg
```

Keep the artifact ID. The generate route does not require this file.
A photo is not a source for missing mileage, accident, or maintenance
facts. Never pass a local path to a remote tool.

## Read the live model cards

Call `beatra.models.list` with `text_to_image`, `text_to_speech`, and
`image_to_video` before choosing model, canvas, format, duration, or
price:

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

Call `beatra.voices.list` only when a catalog voice still needs to be
selected:

```bash
python3 scripts/mcp_client.py call beatra.voices.list
```

```json
{}
```

Never put a display name in `voice`. Use `model: "auto"` for the still
and for speech unless the dealer chose a concrete compatible model.
Use `mp3` only when the live speech card supports it and the live
video card accepts the expected `audio/mpeg`. Require a current video
card whose `input_combinations` admits `[image, driving_audio]`. If
the planned speech cannot fit one containable clip, stop and ask which
verbatim lines belong in this clip. Do not invent a stitch.

## Freeze and submit the lead still and speech

Show the six-field lead card from the root before the first billable
generate or synthesize. After approval, mint one opaque
`client_request_id` per slot. Submit each slot once:

```text
printf '%s' '{
  "prompt":"Create the listing hero still for this named used car. Print only condition-sheet lines that belong on the still. Do not invent mileage, accident, or maintenance facts.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"16:9"},
  "client_request_id":"opaque-used-car-still-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{
  "voice":"voice_selected",
  "input":"The speakable walkaround with verbatim mileage, accident, and maintenance lines.",
  "client_request_id":"opaque-used-car-speech-01"
}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

A changed fact line, language, canvas, voice, format, model, or prompt
is new work: new card, new ID for the changed slot. Keep at most two
lead tasks in flight.

Poll each lead task with `beatra.tasks.get` until terminal. Read
actual still bytes. Read actual `task.output.audio.mime_type`,
`task.output.audio.duration_seconds`, and `task.output.audio.size_bytes`
when present. Present or play the real audio when accessible. A script
preview is not an audio review. Lead acceptance is not video approval.

## Fit accepted speech to the walkaround clip

Refresh or re-read the current `image_to_video` cards after the lead
succeeds. Recheck the still's actual MIME, dimensions, aspect ratio,
byte size, and alpha-channel presence, then compare the accepted
audio's actual MIME type, duration, and byte size with the current
card. If terminal audio size is absent, obtain it from trusted
artifact metadata; if it remains unavailable, stop before video
submission.

The accepted audio must be at least the card's live minimum duration,
currently 2 seconds, and no longer than either its live audio maximum
or the longest eligible video duration that can contain the complete
speech. Choose the smallest supported integer video duration at or
above the actual speech length. Do not truncate, speed up, or add
silence merely to force a match. A fractional narration may leave the
shortest unavoidable tail pause or held frame; disclose it and inspect
the ending.

Keep `model: "auto"` unless the dealer chose a concrete eligible
driving-audio card. Never silently swap the model. Preserve the
still-derived aspect ratio by omitting `aspect_ratio`. The still is
the strict first frame. `driving_audio` is required.

Show the six-field animate card from the root before creating a video
`client_request_id`. After approval, submit once:

```text
printf '%s' '{
  "image": {"type": "artifact", "artifact_id": "art_listing_still"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_walkaround_speech"},
  "prompt": "A restrained walkaround hold on this listing still. Keep the car identity stable. Do not add unstated mileage or accident claims.",
  "duration": 8,
  "client_request_id": "opaque-used-car-video-01"
}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

A changed still, audio, prompt, duration, or model is new work: new
card, new ID. Do not invent a stitch, concat, or editor tool.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the dealer asks, then wait for a terminal state. If a
create returns no `task_id`, do not poll; reconcile before minting a
new ID.

Review visible and spoken mileage, accident, and maintenance lines
against the condition sheet. Report unread small type as unread. Do
not treat the still or clip as a certified vehicle history. Deliver
actual dimensions, duration, and `billing.net_charged_credits`.
