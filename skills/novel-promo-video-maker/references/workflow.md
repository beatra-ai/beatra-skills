# Novel promo video workflow

## Build the beat sheet

Read the supplied passage and write the beat sheet before any paid call. Record
for each beat: the action, the emotion, the visible setting, which characters
appear, and the single image that would carry it. Mark one beat as the hook and
one as the closing turn.

Keep the beat count at four to six unless the user asks otherwise. Each beat
becomes one shot image, one narration clip, and one video call, and each
recurring character adds one cast-reference image before those, so the beat
count plus the cast sheet sets the whole cost of the run and both belong in the
confirmation.

Write each narration line in the author's voice and keep it short enough to sit
comfortably under a single shot. A line that runs long forces a longer clip and
a larger charge.

## Read the live cards before quoting a price

A run touches four separately priced capabilities. Read each card before the
confirmation, because the maximum charge per stage spans two image cards:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

`text_to_image` prices the cast references and any character-free shot,
`image_to_image` prices every shot that carries a cast reference,
`text_to_speech` prices the narration, and `image_to_video` prices the animated
beats. For each image stage, inspect `pricing.options` and match every option
dimension against the admitted request. A preset canvas tier supplies a returned
`resolution` dimension; an empty dimensions object is the default. If a target
canvas or request-dependent model cannot resolve to one option before admission,
show the live range and use its maximum as the approval ceiling. Apply the
returned estimate formula to output count only, never to the number of cast or
other reference images. Take every formula, dimension, rate, and scale from the
returned cards rather than from memory.

## Keep the cast consistent

Create the cast sheet before the shots. For each recurring character, generate
one reference image and keep its artifact ID:

```text
printf '%s' '{"prompt":"Full-body character reference, young swordswoman in worn blue robes, long black braid, scar across the left cheek, neutral background, cinematic illustration.","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"9:16"},"output_relationship":"independent","client_request_id":"opaque-cast-lead-id"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Every later shot that features that character uses `beatra.images.transform`
with the cast artifact as an ordered input, so the same person appears in each
beat:

```json
{
  "prompt": "The swordswoman from image 1 kneels in the rain outside a burning gate, looking back over her shoulder, cinematic illustration, night, firelight.",
  "images": [
    {"type": "artifact", "artifact_id": "art_cast_lead"}
  ],
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "9:16"},
  "output_relationship": "independent",
  "client_request_id": "opaque-beat-03-image-id"
}
```

The cast reference is what holds the characters together across beats. Add
`seed` only when discovery lists it for the selected model and the user asks for
a reproducible render, because any explicit control narrows model eligibility.
On a transform, an explicit preset
`aspect: "source"` follows the last ordered input and the omitted default is 2K
at 16:9, so state `9:16` explicitly for a vertical short. A beat with no
recurring character can use `beatra.images.generate` directly.

When the user supplies local cover art, a character sheet, or any other
reference file the host Agent has already inspected, upload it once through the
bundled client and reuse the returned artifact:

```text
python3 scripts/mcp_client.py upload ./character-sheet.png --mime-type image/png
```

Never send a local path to a remote tool, and keep an existing HTTPS URL or
Beatra artifact reference as its typed media input instead of re-uploading it.

## Record the narration

Reuse one narrator voice for the whole piece. Call `beatra.voices.list` only
when a voice is still needed or the user asks to compare, then synthesize each
beat separately so every clip has its own audio artifact:

```text
printf '%s' '{"voice":"<opaque voice_id>","input":"她没有回头。身后的门在火里塌了一半，而她只是把刀又握紧了一点。","client_request_id":"opaque-beat-03-speech-id"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

Read the actual returned duration, size, and MIME type from the terminal task.
That real duration, not the drafted line length, decides the video duration for
the matching beat. Speech is billed per 1,000 weighted characters, where each
Han ideograph counts as two and every other character counts as one, so a
request below 1,000 is charged for its actual weighted characters.

## Set each beat to its narration

Animate the beat image with its own narration as the driving audio:

```json
{
  "image": {"type": "artifact", "artifact_id": "art_beat_03_image"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_beat_03_speech"},
  "prompt": "Slow push in on the kneeling figure as embers drift past, rain streaking the frame.",
  "model": "<a model whose card admits [image, driving_audio]>",
  "duration": 9,
  "client_request_id": "opaque-beat-03-video-id"
}
```

Omit `aspect_ratio`. The 9:16 shot image governs the frame, and the
narration-capable cards do not advertise it.

Select the video model explicitly rather than leaving it to `auto`: read the
current `image_to_video` cards and keep only models whose `input_combinations`
admits `[image, driving_audio]`. Most models on this capability do not, and the
advertised `auto` default is a model that refuses driving audio. Confirm the
chosen card admits the image, the driving audio, and the duration you need.

Set `duration` to the smallest admitted whole second at or above the real
narration length returned by the terminal speech task — not the drafted line's
estimated length. Cards on this capability commonly advertise
`supports_auto: false`, so an explicit integer duration is required. If the
selected card admits no duration at or above the real narration length, stop
before the video call and offer to shorten or split that line as new paid work,
rather than truncating the narration. Send `duration`, never `duration_seconds`
— that name appears only in discovery SKU data, usage, and output metadata. Only
send optional controls such as `resolution`, `seed`, or `negative_prompt` when
discovery lists them for the selected model; unsupported controls are rejected
rather than ignored.

Before creating a video `client_request_id` or submitting `beatra.videos.animate`
or `beatra.videos.extend`, show the admission card: route and MCP tool name,
audio-led or extend duration, resolution if set, provisional estimate, the fact
that the 600-credit signup gift usually cannot start this video, the exact URL
`https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not
recommend ¥198. Do not submit until the user confirms they have topped up or
already have enough credits for this estimate. Approved stills or narration do
not authorize the video. A request to make the clip is not approval.

## Carry motion across a cut

For two beats that should feel continuous, ask the earlier call for
`return_last_frame: true` when discovery advertises it, then use that returned
image as the next beat's `animate` input. This is a continuity technique, not
video extension.

To make one beat run longer, continue that single clip after a separate
approval:

```json
{
  "video": {"type": "artifact", "artifact_id": "art_beat_01_video"},
  "direction": "after",
  "duration": 18,
  "instruction": "Hold on the same kneeling figure as the rain thickens and the embers die down, keeping the illustrated style and night lighting.",
  "client_request_id": "opaque-extend-id"
}
```

Extension generates new footage immediately before or after exactly one source
clip. It neither joins clips nor assembles a timeline, and extension references
may carry image and audio but never an additional video, so the other approved
beats are not inputs here and are not reused. `duration` is the integer final
returned duration, must exceed the source clip's own duration, and is neither an
increment nor `auto`.

The delivered result of a normal run is therefore the ordered set of beat clips,
each already carrying its own narration.

## Confirm before paying

One beat spans three paid calls. Before the first submission show: the frozen
beat sheet, the cast references, every narration line, the canvas, the
explicitly selected video model, the count of image, speech, and video calls,
the current maximum charge for each stage, and a separate opaque stable
`client_request_id` per call. Never reuse one ID across stages.

Any changed passage, beat, cast reference, narration line, canvas, model, or
control is new paid work with a new ID and a fresh approval. A video-stage
change also needs a new admission card and fresh top-up or balance
confirmation. On `insufficient_balance`, relay the returned message, keep
`https://console.beatra.ai/topup` exact, and retry the same frozen
`client_request_id` only after the user says they have topped up.

## Poll, recover, and cancel

Keep a private ledger row per call: beat number, stage, full frozen arguments,
stable request ID, approval, creation time, create response, task ID, and
terminal result. Record each returned task ID immediately and call
`beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and
`running` mean wait, not retry.

If a create response is lost, retry only the identical frozen payload with the
same ID. If a task ID is lost, call `beatra.tasks.list` for that capability,
call `beatra.tasks.get` on plausible candidates, and match returned facts
against the ledger; an ambiguous match stops submission. If the request ID
itself is lost, do not invent a new one and do not replay: attempt task recovery
and stop if the original cannot be identified.

When one beat fails and others succeed, recover that beat alone. Already
delivered beats stay valid and are not regenerated.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known
task and confirm a terminal state with `beatra.tasks.get`. On `409`, keep
polling the same task; cancellation remains unconfirmed and does not authorize
another cancel or replacement work.

## Deliver and review real results

Deliver the beats in order with every returned artifact or link. Report only the
actual returned task status, resolved model, dimensions, duration, usage, and
`billing.net_charged_credits` for each call. Video output pricing normally uses
admitted output duration, and extension uses the requested final output
duration; add separate input and output rows when discovery returns both.

Review only media the host Agent can actually play or view. Check that each
character matches the cast sheet across beats, that the narration is present and
finishes inside the clip, that the motion suits the beat, and that the ratio is
the one requested. Audio-driven generation does not guarantee stable geometry in
every frame, and an illustrated cast is carried by reference rather than
reproduced exactly. State visible drift and inspection limits honestly, and when
one focused revision would help, name the smallest change and wait for a new
paid approval.
