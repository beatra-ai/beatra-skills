# Talking Avatar Video Workflow and Payloads

Detailed execution steps, JSON payloads, preflight checks, and recovery guidance for `talking-avatar-video`. Read [Speech, Voices, and Audio Finishing](speech-and-audio.md) for cross-tool speech rules, [Billing errors and recovery](billing-errors-and-recovery.md) for wallet errors, [Price a whole job](price-a-whole-job.md) for the one card of a multi-call job, and [Deliver one file](deliver-one-file.md) for joining clips.

## 1. Check Live Model Capabilities First (and Wallet If Asked)

Always inspect live capabilities before choosing models, formats, or clip lengths:

```json
{"capability": "speech_script"}
```

```json
{"capability": "text_to_speech"}
```

```json
{"capability": "image_to_video"}
```

Check the balance or charges when the user asks (`beatra.wallet.get` / `beatra.wallet.ledger`). For a whole job, also read the balance once before the card (below), and once after the customer says they have topped up, which lifts the bundled client's balance hold:

```json
{}
```

On the `image_to_video` card, keep only models that list `driving_audio`. With `model: "auto"` and a `driving_audio` input, Beatra routes to one of them; a named model without it is refused.

For a job with more than one clip, also read the join price:

```json
{"capability": "video_compose"}
```

For a whole job (narration plus video, or more than one clip), that one balance read before the card lets it say how much of the job the balance covers.

If the user brings an existing recording instead of a script, upload both portrait and speech file via `beatra.assets.upload` and check the audio's actual MIME type, duration, and file size against the `image_to_video` card's `driving_audio` requirements before planning `beatra.videos.animate`.

## 2. Saved Avatars (`beatra.avatars.list`, free)

Before asking for a portrait, list saved avatars:

```json
{}
```

Each avatar has `display_name`, `image.artifact_id`, and an optional paired `voice` (`voice.voice_id`); `default_avatar_id` (and `is_default`) marks the default. Offer the default by its `display_name`, not its ID, and use its paired voice unless the customer wants another. Check the image against the live `image_to_video` card before animating it.

## 3. Audition Voices Free (`beatra.voices.list` & `beatra.voices.preview`)

Search presets by language, gender, style, or bilingual keyword:

```json
{
  "category": "preset",
  "language": "en-US",
  "search": "warm presenter",
  "limit": 20
}
```

Share a zero-credit audition link before generating narration:

```json
{
  "voice_id": "<selected voice_id>"
}
```

Confirm which `voice_id` the customer approves, and verify its `capabilities.*` metadata matches the intended `direction`, `emotion`, or `prepare_script` usage.

## 4. Optional Smart Voice Director (`beatra.speech.prepare_script`, PAID)

Use `beatra.speech.prepare_script` when the script needs structured pacing, natural breathing pauses, or delivery annotations without changing a single spoken word (`{"capability": "speech_script"}`). It is a paid line on the whole-job card: split the plain script first (section 5), then, after the card is confirmed, run one call per part and validate each prepared part again before synthesis. If a prepared part no longer fits the clip or its quote is above the card's, tell the customer and ask before paying. Keep at most 2 concurrent calls:

```json
{
  "input": "<customer approved plain script>",
  "instructions": "Steady, confident explainer cadence with brief natural pauses between key points.",
  "voice": "<selected voice_id>",
  "model": "auto",
  "language": "auto",
  "client_request_id": "2c8d4f1a-6b3e-4e92-9a10-5c7e8d1b3f04"
}
```

- Inspect `directed` and `scripts[]`: if `synthesis` is `null`, read `warnings` before proceeding; otherwise pass `scripts[].synthesis` unchanged (adding a fresh `client_request_id`) to `beatra.speech.synthesize` after validating.
- Reuse rule: to try another voice within 48 hours for identical text, instructions, language, and context, call `beatra.speech.prepare_script` again changing only `voice` (and `model` if needed) at no extra charge (balance must still cover the initial estimate).
- Never invent or hand-author braced performance markup in user copy or prompts.

## 5. Split the Script and Preflight Free (`beatra.speech.validate`)

Run free `beatra.speech.validate` (free, NO `client_request_id`) BEFORE calling `beatra.speech.synthesize` or `beatra.videos.animate`:

```json
{
  "voice": "<selected voice_id>",
  "input": "<script part: plain for the card, prepared before synthesis>",
  "model": "auto",
  "language": "en-US",
  "format": "mp3",
  "subtitle_enable": true
}
```

Inspect the response:
- `valid`: must be `true` (`warnings[]` reviewed for length or pause advisories).
- `estimated_duration_seconds`: compare against the live `{"capability": "image_to_video"}` card's maximum clip duration. The estimate uses a fixed reading pace, not the chosen voice's, and can miss by about a quarter either way, so keep each part at or under about 80% of that maximum (for example 12 seconds when one clip allows 15).
- A longer script becomes parts. Split at sentence ends, keep every word, and validate each part. A one-minute lesson is typically five or six parts. Tell the customer the part count, that the parts are joined into one video, and the whole-job price before any paid step.
- `price_credits`, `weighted_characters`, `execution`: put the exact quoted cost of each part on the whole-job production card directly from these live figures.

## 6. Synthesize Speech with Free Aligned Subtitles (`beatra.speech.synthesize`)

Keep `subtitle_enable: true` (default) to obtain free `JSON`, `SRT`, and `VTT` subtitles (`output.subtitles`) plus `speech_start_seconds` and `speech_end_seconds`:

```json
{
  "voice": "<selected voice_id>",
  "input": "<validated script input>",
  "model": "auto",
  "language": "en-US",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "9f1e3b7c-4a28-4d61-b502-8e4c1a9f7d22"
}
```

Poll `beatra.tasks.get` until terminal, verify real `output.audio.duration_seconds`, MIME type, and size satisfy the `image_to_video` card's `driving_audio` bounds, and save `output.subtitles.files.srt` / `.vtt` plus `speech_start_seconds` / `speech_end_seconds` for delivery and for trimming the clip in the join. A part whose real audio runs over the clip maximum is split again at a sentence end; ask before re-synthesizing it, and never submit a video clip its audio cannot fit.

## 7. Animate Talking Avatar (`beatra.videos.animate`)

Submit once per part, each with its own `client_request_id`, after the whole-job card is confirmed. Send the next part when one finishes if the account's concurrent task limit is reached:

```json
{
  "image": {"type": "artifact", "artifact_id": "<portrait_artifact_id>"},
  "driving_audio": {"type": "artifact", "artifact_id": "<speech_artifact_id>"},
  "model": "<selected model from image_to_video card>",
  "prompt": "Natural presenter delivery to camera, subtle blinking and restrained head movement, steady eye line, keep original likeness and wardrobe.",
  "duration": 12,
  "client_request_id": "4e7b9a12-8c53-4f19-a3e6-1d8b5c2f9041"
}
```

Choose `duration` per the live `image_to_video` card rules (smallest supported clip duration containing the verified real `duration_seconds` of `driving_audio`).

## 8. Join the Clips (`beatra.videos.compose`)

With more than one clip, join them once every clip has succeeded (it is a paid line on the same card):

```json
{
  "clips": [
    {"source": {"type": "artifact", "artifact_id": "<clip 1>"}, "end": 11.6, "keep_audio": true},
    {"source": {"type": "artifact", "artifact_id": "<clip 2>"}, "end": 10.9, "keep_audio": true}
  ],
  "canvas": "9:16",
  "client_request_id": "7a3c5e91-2d48-4b06-9f17-6e0b8c4d2a35"
}
```

`end` is that part's `speech_end_seconds` plus about 0.3 seconds, so there is no silent pause between clips, but never past the clip's returned duration, which can be a little under the requested `duration`: the join refuses an `end` beyond the clip. Pick the `canvas` that matches the portrait. Above the join's clip or length cap (see [Deliver one file](deliver-one-file.md)), make a few joined videos in order and say how many before the first paid call.

## 9. Save the Avatar (`beatra.avatars.save`, free)

After a result the customer likes from a newly uploaded portrait, offer once to save it. Save only after the customer agrees and confirms the consent sentence: they are the person pictured, or they have that person's separate consent.

```json
{
  "artifact_id": "<portrait_artifact_id>",
  "display_name": "Course host",
  "purpose": "course lecturer",
  "voice_id": "<approved voice_id>",
  "make_default": false,
  "consent_attested": true,
  "consent_subject": "self"
}
```

Set `make_default` to `true` only when the customer asks or has no saved avatar; otherwise it replaces their current default.

## 10. Delivery Review and Recovery Rules

- **Deliver**: The one talking-avatar MP4 first (joined when there were several clips), then one `SRT` and one `VTT` for the whole video (see [Deliver one file](deliver-one-file.md)) and a quick visual review (likeness fidelity, audio clarity, lip sync, motion stability). Say it in plain words: format, length, size, and credits charged. Keep task IDs, artifact IDs, MIME strings, and field names in your notes.
- **Duration overrun caught early**: caught free at step 5 (`beatra.speech.validate`); split the part before paying for `speech.synthesize` or `videos.animate`.
- **Join fails**: the clips are still there; follow [Deliver one file](deliver-one-file.md).
- **Animation fails after speech succeeds**: keep the valid speech `artifact_id` and subtitles; inspect why animation failed, confirm any adjustment, and re-run ONLY `beatra.videos.animate` with a new `client_request_id`.
- **Dropped response / unknown state**: query `beatra.tasks.list` first rather than minting a new `client_request_id`; retry the exact same `client_request_id` only for the identical payload.
- **`insufficient_balance`**: Explain calmly without raw tool/error codes, relay Beatra's official message in the customer's language with the exact top-up URL unchanged, say which parts finished, and wait until the customer confirms top-up; then read `beatra.wallet.get` once and retry with the same `client_request_id`. If the user asks about current balance or prior charges, check `beatra.wallet.get` / `beatra.wallet.ledger`.
