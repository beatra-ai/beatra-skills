# Talking Avatar Video Workflow and Payloads

Detailed execution steps, JSON payloads, preflight checks, and recovery guidance for `talking-avatar-video`. Read [Speech, Voices, and Audio Finishing](speech-and-audio.md) for cross-tool speech rules and [Billing errors and recovery](billing-errors-and-recovery.md) for wallet errors.

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

Check real credit balance only when needed to answer a balance or charge question (`beatra.wallet.get` / `beatra.wallet.ledger`):

```json
{}
```

If the user brings an existing recording instead of a script, upload both portrait and speech file via `beatra.assets.upload` and check the audio's actual MIME type, duration, and file size against the `image_to_video` card's `driving_audio` requirements before planning `beatra.videos.animate`.

## 2. Audition Voices Free (`beatra.voices.list` & `beatra.voices.preview`)

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

## 3. Optional Smart Voice Director (`beatra.speech.prepare_script`, PAID)

Use `beatra.speech.prepare_script` when the script needs structured pacing, natural breathing pauses, or delivery annotations without changing a single spoken word (`{"capability": "speech_script"}`). Keep at most 2 concurrent calls:

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

## 4. Mandatory Free Duration Preflight (`beatra.speech.validate`)

Run free `beatra.speech.validate` (free, NO `client_request_id`) BEFORE calling `beatra.speech.synthesize` or `beatra.videos.animate`:

```json
{
  "voice": "<selected voice_id>",
  "input": "<prepared script input>",
  "model": "auto",
  "language": "en-US",
  "format": "mp3",
  "subtitle_enable": true
}
```

Inspect the response:
- `valid`: must be `true` (`warnings[]` reviewed for length or pause advisories).
- `estimated_duration_seconds`: compare directly against the live `{"capability": "image_to_video"}` card's maximum clip duration. If it exceeds one clip, trim or break the script cleanly and re-run free `beatra.speech.validate` **before** any paid step.
- `price_credits`, `weighted_characters`, `execution`: put the exact quoted cost on the 6-field production card directly from these live figures (keeping `beatra.wallet.get` strictly optional when the user asks about remaining balance).

## 5. Synthesize Speech with Free Aligned Subtitles (`beatra.speech.synthesize`)

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

Poll `beatra.tasks.get` until terminal, verify real `output.audio.duration_seconds`, MIME type, and size satisfy the `image_to_video` card's `driving_audio` bounds, and save `output.subtitles.files.srt` / `.vtt` plus `speech_start_seconds` / `speech_end_seconds` for delivery.

## 6. Animate Talking Avatar (`beatra.videos.animate`)

Submit once with a fresh `client_request_id` after confirming the video card:

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

## 7. Delivery Review and Recovery Rules

- **Deliver**: Talking-avatar MP4 + free `SRT`/`VTT` subtitles (`output.subtitles`) + `speech_start_seconds`/`speech_end_seconds` + quick visual review (likeness fidelity, audio clarity, lip sync, motion stability).
- **Duration overrun caught early**: caught free at step 4 (`beatra.speech.validate`); adjust text before paying for `speech.synthesize` or `videos.animate`.
- **Animation fails after speech succeeds**: keep the valid speech `artifact_id` and subtitles; inspect why animation failed, confirm any adjustment, and re-run ONLY `beatra.videos.animate` with a new `client_request_id`.
- **Dropped response / unknown state**: query `beatra.tasks.list` first rather than minting a new `client_request_id`; retry the exact same `client_request_id` only for the identical payload.
- **`insufficient_balance`**: Explain calmly without raw tool/error codes, relay Beatra's official message and exact top-up URL verbatim, and wait until the customer confirms top-up before retrying with the same `client_request_id`. If the user asks about current balance or prior charges, check `beatra.wallet.get` / `beatra.wallet.ledger`.
