# Commerce video workflow

One product photo and the merchant's own product details become one vertical video that speaks. The selected route has route-dependent paid calls, two approval stages, and one review point where the merchant sees the real materials before the expensive video call runs.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Upload a local file with the bundled helper, and keep the returned reference:

```text
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage

Inspect the photo and prepare the frame plan per [the first frame](first-frame.md). Once it is admitted, upload it with the detected MIME type through `scripts/mcp_client.py upload`, complete the returned upload flow, and retain the resulting artifact ID. The direct-frame route and every transform request use that one artifact; do not substitute a local path in a remote payload. Collect claims and write the script per [writing the narration](copy-craft.md). Select a voice with `beatra.voices.list`.

Read the live cards with `beatra.models.list` for `image_to_image`,
`text_to_speech`, and `image_to_video`. The image-to-image card admits the
opening-frame transform; the speech card admits the selected voice and
language; the video card admits the returned image and narration pair.
Everything in this stage is free and revisable.

From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together
with its current supported languages and compatible models. Use the live
text-to-speech card to confirm the requested BCP-47 language, chosen or auto
model behavior, output format, and current weighted-character price. Include
that voice ID, language, model choice, controls, and estimate in the
preparation confirmation.

## Selecting the video model

This route has one hard requirement that is easy to miss: **the model must accept supplied narration.**

Read the current `image_to_video` cards and keep only models whose `input_combinations` admits `[image, driving_audio]`. Most models on this capability do not. Among those that do not, several would accept an explicit `aspect_ratio` — which is why it is tempting to choose one and why doing so silently discards the merchant's narration.

Do not leave selection to `model: "auto"` on this route. Its advertised default is a model that refuses driving audio. Select a model whose live card admits the combination, and pass it explicitly.

Also read that model's `duration` behaviour. Current cards advertise `supports_auto: false`, so an explicit integer duration is always required.

## Approval gate 1 — preparation

Show the selected route in one block, then freeze:

- the full narration script;
- the 9:16 canvas, **with the statement that changing the ratio later means producing every paid artifact again**;
- the ready voice ID, language, selected speech model behavior, and controls;
- every paid preparation call on the selected route, each with its current
  model, maximum price, and stable request ID;
- that the video itself is confirmed separately.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved voice choice does not.

## Preparation — two paid calls

The direct-photo route prepares narration only. The standard vertical route
prepares one transformed opening frame and narration. A confirmed two-frame
route also prepares a related last frame after the opening frame is accepted.
Give each selected paid request its own stable opaque `client_request_id` and
submit it exactly once.

For an opening-frame transform, use the admitted image-to-image model and the
explicit vertical canvas selected from its live card:

```json
{
  "images": [{ "type": "artifact", "artifact_id": "art_product" }],
  "prompt": "A clean vertical product opening frame that preserves the product's shape, label, colour, logo, and material appearance.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "model": "the admitted image-to-image model",
  "client_request_id": "opaque-first-frame-id"
}
```

```json
{
  "voice": "voice_selected",
  "input": "The approved commerce script.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "model": "the admitted speech model or auto after live-card verification",
  "client_request_id": "opaque-narration-id"
}
```

Use `mp3` when the live speech card supports it and the live video card accepts the resulting `audio/mpeg`. If the merchant asked for a format the video route will not accept, explain that before synthesizing and settle on a compatible one. Do not substitute silently.

The transform call and the synthesis call are independent; either order is fine.
For a two-frame route, the paid last-frame `images.edit` call is prepared only
from the accepted opening-frame artifact, with its focused edit prompt and
current price already covered by the selected preparation route.

On narration success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`. A script preview or an expected duration is not a result.

## Review point

Show the first frame. Play the narration when the host can access it. Report
the real duration and actual MIME type, size, and artifact facts. When media
playback or viewing is unavailable, identify that review as unavailable rather
than inferring clarity, completeness, or visual quality from task metadata.

This is the point of the whole shape: the expensive call happens only after the merchant has seen and heard what it will be built from.

Re-admit against the current card before continuing:

1. narration duration at or above the card minimum, currently 2 seconds;
2. the smallest integer second at or above the real duration is within the model's supported durations;
3. audio size within the card's `max_size_bytes`;
4. audio MIME accepted by the card;
5. the card still admits `[image, driving_audio]`.

Any failure stops here. Shortening an over-long script and synthesizing again costs the cheapest call; discovering the same problem after the video call costs the most expensive one.

## Approval gate 2 — the shoot

Show an admission card before any video `client_request_id` or `beatra.videos.animate` / `beatra.videos.interpolate` call: route and MCP tool name, approved frame and narration artifacts, motion direction, selected model, audio-led duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved preparation does not authorize the video. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Then freeze the exact payload under a new stable `client_request_id`.

## The shoot — one paid call

```json
{
  "image": { "type": "artifact", "artifact_id": "art_first_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "the model selected above",
  "prompt": "A slow push-in on the product with steady lighting and a stable background.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

Omit `aspect_ratio`. The frame governs it, and the narration-capable models do not accept it.

Set `duration` to the smallest integer second at or above the real narration length. Smaller truncates the last words; larger leaves a silent hold at the end. A fractional narration always leaves the shortest unavoidable tail — mention it and check the ending after delivery.

Submit `beatra.videos.animate` exactly once.

## Two-frame route

When the merchant wants a camera move or a second face of the product, produce the last frame with `images.edit` on the accepted first frame — never as an independent generation — then:

```json
{
  "first_frame": { "type": "artifact", "artifact_id": "art_first_frame" },
  "last_frame": { "type": "artifact", "artifact_id": "art_last_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "a model whose card admits first_frame, last_frame, and driving_audio",
  "prompt": "A measured move from the close detail to the wider setting.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

Submit `beatra.videos.interpolate` exactly once. This route costs one paid call more than the default, so disclose it at gate 1 rather than after approval.

## Delivering and reviewing

Record the task ID immediately and poll that task with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the returned video artifact, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. Report only actual returned facts.

When the host can view or play the returned media, review the following and say
which parts could not be inspected:

- **Any face or mouth in frame.** The product is the subject; a human face, mouth, or figure appearing anywhere is a defect worth reporting and, if the merchant wants, regenerating.
- **Product fidelity.** Compare against the source photo. Shape, colour, finish, label text, logo placement.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Ending.** Any audible or visible silent hold or held frame.
- **Canvas.** The ratio the destination needs.

Audio-driven generation does not guarantee stable geometry or a clean subject in every frame. State visible drift honestly rather than describing the result as verified when it was not inspected. If one focused change would help, name the smallest one and wait for a new approval — it is new paid work.

## When something is redone

Each paid artifact stands alone. Redoing one never means regenerating the others.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| The first frame is not right | `images.transform` | The narration |
| The narration is too long or mispronounced | Shorten the script, then `speech.synthesize` | The first frame |
| The video is not right | `videos.animate` | The first frame and the narration |
| The canvas ratio must change | Everything | Nothing — the ratio lives in the frame |

## Recovery

Keep a private ledger per paid stage: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A slow task is not a failed task. Never replace a running task with a duplicate.

On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. It is not a failed generation.

Cancel only when the merchant asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- a media fact cannot be established, or fails the live card;
- a claim the merchant wants stated has not been supplied;
- the narration is shorter than the card minimum, or longer than the longest video that can contain it;
- no available model admits `[image, driving_audio]`.

Do not guess a value, substitute a default silently, or submit to find out.
