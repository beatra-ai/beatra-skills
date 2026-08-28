# Tax policy brief workflow

## Build the still plan and speakable brief

Record only advisor-supplied facts. Separate the policy title, issuer,
effective date, source citation, must-keep points, language, destination,
and optional visual references. A missing date or source stays a named
gap. Do not fill it from a remembered circular, a nearby notice, or a
model guess.

Print and cite the effective date and the source on the still and in
the spoken brief. Do not invent a rate, statute, eligibility line, or
concrete tax-planning scheme.

```text
筹划
```

Default plan: one 2K `9:16` policy-points still and one speakable brief
that fits a single 2–15s clip. Change canvas only when the advisor names
a destination that needs another ratio.

## Upload optional media

If the advisor supplies a brand still or an already-printed
policy-points graphic, inspect it first. Upload with its exact MIME
type. The helper completes the upload grant and HTTP PUT, then prints
the artifact reference:

```text
python3 scripts/mcp_client.py upload ./policy-points-still.png --mime-type image/png
```

Keep the artifact ID. Never pass a local path to
`beatra.images.generate`, `beatra.speech.synthesize`, or
`beatra.videos.animate`. Skip generate when that still already prints
the effective date and the source.

## Read the live lead cards

Call `beatra.models.list` with `text_to_image` before choosing model,
canvas, count, or still price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Call `beatra.models.list` with `text_to_speech` before choosing speech
model, format, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

Call `beatra.voices.list` only when a catalog voice still needs to be
selected:

```bash
python3 scripts/mcp_client.py call beatra.voices.list
```

```json
{"category": "preset"}
```

Never put a display name in `voice`. Use `model: "auto"` and
`count: 1` on generate. Use `input`, not `text`, on synthesize. Use
`mp3` only when the live speech card supports it and the live video
card accepts `audio/mpeg`.

## Freeze and submit the lead

Show the six-field lead production card from the root before the first
billable generate or synthesize. After approval, mint one opaque
`client_request_id` per slot. Submit each slot once:

```text
printf '%s' '{
  "prompt":"Create the approved policy-points still. Print the policy title, effective date, source, and only the confirmed policy points. Do not add a tax-planning scheme.",
  "model":"auto",
  "count":1,
  "canvas":{"type":"preset","tier":"2K","aspect":"9:16"},
  "client_request_id":"opaque-tax-still-01"
}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{
  "input":"Approved speakable brief with effective date and source.",
  "voice":"voice-ready-01",
  "format":"mp3",
  "speed":1.0,
  "model":"auto",
  "client_request_id":"opaque-tax-speech-01"
}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

A changed fact line, language, canvas, voice, model, or prompt is new
work: new card, new ID. Keep at most two lead tasks in flight.

Poll `beatra.tasks.get`. Read actual image bytes and, for speech,
`task.output.audio.mime_type`, `duration_seconds`, and `size_bytes`.
Do not treat a script preview as the audio review. If returned speech
is under 2s or over 15s, rewrite the brief as new speech work. Do not
stitch.

Lead acceptance is not video approval.

## Read the live video card

Call `beatra.models.list` with `image_to_video` before choosing model,
duration, or video price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

Admit the accepted still plus the accepted audio on a card that
accepts `[image, driving_audio]`. Use `model: "auto"` unless the
advisor chose an eligible SKU. Preserve the still-derived aspect
ratio by omitting `aspect_ratio`. Use the smallest supported integer
duration in 2–15s at or above the actual speech length.

## Freeze and submit the clip

Show a new six-field video production card from the root. After
approval, mint one new opaque `client_request_id`. Submit once:

```text
printf '%s' '{
  "image": {"type": "artifact", "artifact_id": "art-tax-still-01"},
  "driving_audio": {"type": "artifact", "artifact_id": "art-tax-speech-01"},
  "prompt": "A restrained hold on this policy-points still. Keep printed date, source, and points in frame. Subtle motion only. Do not add a presenter face or extra text.",
  "duration": 8,
  "client_request_id": "opaque-tax-video-01"
}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not omit `driving_audio`. Do not invent a stitch, concat, or
editor tool. One clip only.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the advisor asks, then wait for a terminal state.

Review visible printed text and audible lines against the dated,
sourced point list. Report unread small type as unread. When
relevant after delivery, tell the advisor this is not a formal tax
opinion.
