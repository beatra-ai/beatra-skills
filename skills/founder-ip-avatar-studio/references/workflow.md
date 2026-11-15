# Founder IP Avatar Studio Workflow and Payloads

Step-by-step execution guide, exact MCP JSON payloads, voice cloning safety gates, audio finishing contracts, and recovery rules for `founder-ip-avatar-studio`. Also consult [Speech, Voices, and Audio Finishing](speech-and-audio.md) and [Billing errors and recovery](billing-errors-and-recovery.md).

## 1. Read Live Models Before Any Paid Call (Wallet If Asked)

Check relevant capabilities before planning any founder clone or weekly episode:

```json
{"capability": "voice_clone", "include_activation_required": true}
```

```json
{"capability": "audio_voice_isolation"}
```

```json
{"capability": "speech_script"}
```

```json
{"capability": "text_to_speech"}
```

```json
{"capability": "audio_process"}
```

```json
{"capability": "image_to_video"}
```

Check balance only when answering a customer balance or charge question (`beatra.wallet.get`):

```json
{}
```

## 2. Inspect, Audition & Pin Existing Founder Voices

List existing cloned voices (including pending trial clones):

```json
{
  "category": "cloned",
  "status": "any",
  "limit": 50
}
```

Audition free (`beatra.voices.preview`):

```json
{
  "voice_id": "<voice_id>"
}
```

Update founder voice display name, persona metadata, or pin as default (`beatra.voices.update`, free):

```json
{
  "voice_id": "<voice_id>",
  "display_name": "Founder Weekly Voice",
  "make_default": true,
  "persona": "Calm, authoritative founder update delivery"
}
```

## 3. Clean Noisy Voice Samples (PAID) -> Clone -> Activate

If the founder's sample recording (`4.6 s - 5 min`, `<= 100 MB`) contains music, room echo, or street noise, quote `{"capability": "audio_voice_isolation"}` and run **paid** `beatra.audio.process` (`operation="isolate_voice"`) after user approval:

```json
{
  "operation": "isolate_voice",
  "source": {"type": "artifact", "artifact_id": "<noisy_sample_artifact_id>"},
  "format": "wav",
  "client_request_id": "1a7c9e24-3f50-4b88-9d21-6c8f4a2e0b13"
}
```

Wait for **Mandatory Confirmation #1** (verifiable ownership/authorization + anti-impersonation commitment) before calling `beatra.voices.clone` (`consent_attested: true`):

```json
{
  "sample": {"type": "artifact", "artifact_id": "<clean_sample_artifact_id>"},
  "display_name": "Founder IP Voice",
  "model": "<selected model from voice_clone card or auto>",
  "language": "zh-CN",
  "gender": "male",
  "age_group": "adult",
  "use_case": ["narration", "business"],
  "persona": "Direct, steady founder voice",
  "consent_attested": true,
  "client_request_id": "8e3b1c40-7d92-45a6-8f11-3a9d6e2c5b80"
}
```

If `beatra.voices.clone` returns `status="pending_activation"` (**Mandatory Confirmation #2**):
1. Read its embedded `activation.quote` (`price_credits` / `confirm_credits`, activation terms, audition URL, and **24-hour expiry** on `confirmation_token`), or for an existing `pending_activation` voice fetch a quote by calling `beatra.voices.activate` with `voice_id` + `client_request_id` (omitting `confirmation_token` — never omit `client_request_id`).
2. Wait for explicit confirmation of both credits and terms, then call `beatra.voices.activate`:

```json
{
  "voice_id": "<pending_voice_id>",
  "confirmation_token": "<token_from_quote_or_clone>",
  "confirm_credits": 100,
  "client_request_id": "6d4a2f18-9c03-4e77-b120-5e8c3a9d4f71"
}
```

If the 24-hour token is missing or expired (`price_confirmation_required`), re-fetch a free quote and token by calling `beatra.voices.activate` with `{"voice_id": "<pending_voice_id>", "client_request_id": "<fresh_uuid>"}` (omitting `confirmation_token`), confirm again with the user, then activate with a fresh `client_request_id`. Replace `100` in the template above strictly with the live `price_credits` returned by Beatra.

Also remind the user when managing founder clones (**Mandatory Confirmation #3**): clones occupy persistent slots, and permanent deletion (`voices.delete` via voice management) always requires two-step confirmation with `paid_slot_warning` and `irreversible_notice`.

## 4. Smart Voice Director (`prepare_script`, PAID) & Free Duration Check (`validate`)

Prepare founder phrasing and pause beats without altering spoken words (`beatra.speech.prepare_script`, max 2 concurrent):

```json
{
  "input": "<approved weekly script>",
  "instructions": "Natural executive update tone with clear sentence-boundary pauses.",
  "voice": "<ready founder voice_id>",
  "model": "auto",
  "language": "auto",
  "client_request_id": "3f9a1b6e-5d22-4c80-a714-9b2e6d0f3c85"
}
```

Inspect `directed` and `scripts[]`: if `synthesis` is `null`, resolve `warnings` first; otherwise pass `scripts[].synthesis` unchanged (adding a fresh `client_request_id`) to `beatra.speech.synthesize` after validating. Within 48 hours, to try another voice on the identical wording, instructions, language, and context, call `beatra.speech.prepare_script` again changing only `voice` (and `model` if needed) at zero extra fee (balance must cover the initial estimate).

Run free **`beatra.speech.validate`** (free, NO `client_request_id`) BEFORE paid synthesis or animation:

```json
{
  "voice": "<ready founder voice_id>",
  "input": "<prepared script input>",
  "model": "auto",
  "language": "zh-CN",
  "format": "mp3",
  "subtitle_enable": true
}
```

Compare `estimated_duration_seconds` against the live `{"capability": "image_to_video"}` clip limit. Trim or segment before paying if it exceeds one clip.

## 5. Synthesize Speech (`output.subtitles`) + Loudness Normalization (PAID) -> Animate

Synthesize narration with free `output.subtitles` (`JSON`, `SRT`, `VTT`, `speech_start_seconds`, `speech_end_seconds`):

```json
{
  "voice": "<ready founder voice_id>",
  "input": "<validated script input>",
  "model": "auto",
  "language": "zh-CN",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "5c2e8a71-1b49-4f38-8d66-4a7f2e9c1b30"
}
```

For cross-episode loudness normalization (sources/outputs up to `60 min` and `300 MB`, min output `>= 1 s`, `50 calls/day`, one at a time, **PAID**, `{"capability": "audio_process"}`), run `beatra.audio.process`:

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "<speech_artifact_id>"},
  "loudness_lufs": -14,
  "true_peak_db": -1,
  "format": "mp3",
  "client_request_id": "7a8d3c92-4e15-4b60-9c33-2d5e8a1f6c48"
}
```

Check final driving audio duration, MIME type, and size against `image_to_video` limits, then dispatch `beatra.videos.animate`:

```json
{
  "image": {"type": "artifact", "artifact_id": "<founder_portrait_artifact_id>"},
  "driving_audio": {"type": "artifact", "artifact_id": "<final_speech_artifact_id>"},
  "model": "<selected model from image_to_video card>",
  "prompt": "Natural founder address to camera, steady eye line, restrained gestures, consistent facial identity and clothing.",
  "duration": 15,
  "client_request_id": "9b1f4d20-6a87-4e52-b390-7c4d2e8a1f55"
}
```

## 6. Error Recovery

Explain any error to the customer in plain words without exposing tool names, field names, or raw codes:

- **`voice_pending_activation`**: Read embedded `activation.quote` or fetch quote (`beatra.voices.activate` with `voice_id` + `client_request_id`, omitting `confirmation_token`), obtain Mandatory Confirmation #2, and activate with `confirmation_token` + exact `confirm_credits`.
- **`price_confirmation_required` (expired activation token)**: Re-fetch a free activation quote (`voice_id` + `client_request_id`, no `confirmation_token`), present new 24-hour expiry and credits, confirm again.
- **Noisy sample quality failure**: Offer paid `isolate_voice` (`beatra.audio.process`) or ask for a cleaner dry recording before re-cloning.
- **`insufficient_balance`**: Relay Beatra's official message and exact verbatim top-up URL; wait for the customer to confirm top-up before retrying with the same `client_request_id`.
- **`idempotency_conflict` / `request_in_progress` / timeout**: Check `beatra.tasks.list` first; reuse the same `client_request_id` only for an identical payload, or generate a new ID if any field changed.
- **Animation fails after speech succeeds**: Reuse verified speech/normalized audio artifact and subtitles without re-paying for TTS or cloning.
