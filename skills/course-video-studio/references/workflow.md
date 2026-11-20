# Course Video Studio Workflow and Payloads

Detailed step sequence, JSON request templates, and recovery guidance for `course-video-studio`. See also [Speech, Voices, and Audio Finishing](speech-and-audio.md) and [Billing errors and recovery](billing-errors-and-recovery.md).

## 1. Live Models & Wallet Discovery

Check capabilities before drafting production cards:

```json
{"capability": "image_to_video"}
```

```json
{"capability": "speech_script"}
```

```json
{"capability": "text_to_speech"}
```

```json
{"capability": "voice_clone"}
```

```json
{"capability": "audio_voice_isolation"}
```

```json
{"capability": "audio_process"}
```

Check balance only when answering a customer balance or charge question (`beatra.wallet.get`):

```json
{}
```

## 2. Voice Audition, Profile Pinning & Optional Paid Sample Pre-Clean

Search preset or cloned instructor voices (`beatra.voices.list`), audition free (`beatra.voices.preview`), and label/pin the chosen course voice (`beatra.voices.update`):

```json
{
  "voice_id": "<instructor_voice_id>"
}
```

```json
{
  "voice_id": "<instructor_voice_id>",
  "display_name": "Lead Instructor Voice",
  "make_default": true,
  "use_case": ["education", "course"]
}
```

If cloning a noisy classroom or office recording (`4.6 s - 5 min`, `<= 100 MB`), confirm paid `isolate_voice` (`{"capability": "audio_voice_isolation"}`) first:

```json
{
  "operation": "isolate_voice",
  "source": {"type": "artifact", "artifact_id": "<raw_sample_artifact_id>"},
  "format": "wav",
  "client_request_id": "2d8f4a19-7c30-4e6b-9f12-5b8d3c1a4e70"
}
```

After Mandatory Confirmation #1 (verifiable authorization + anti-impersonation declaration), select the clone model as described in [Speech, Voices, and Audio Finishing](speech-and-audio.md) §5 (`"model": "auto"` is the default), show the production card with the live clone price, submit once, and handle any refusal per [Billing errors and recovery](billing-errors-and-recovery.md); clone with `consent_attested: true`:

```json
{
  "sample": {"type": "artifact", "artifact_id": "<clean_sample_artifact_id>"},
  "display_name": "Instructor Voice",
  "model": "auto",
  "language": "zh-CN",
  "consent_attested": true,
  "client_request_id": "4a1e7b90-8c34-4f21-b9e5-2d6f1a8c3b47"
}
```

Note Mandatory Confirmations #2 and #3: when a clone result or a listed voice has status `pending_activation`, follow §5 Step E of [Speech, Voices, and Audio Finishing](speech-and-audio.md) before using the voice; deletion requires its own two-step flow documented there.

## 3. Smart Voice Director (`prepare_script`, PAID) & Free Clip-Fit Check (`validate`)

Prepare teaching rhythm and natural pauses without changing any lecture words (`beatra.speech.prepare_script`, max 2 concurrent). Inspect `directed` and `scripts[]` (`synthesis`, `summary`, `warnings`), resolving `synthesis: null` via `warnings` and passing `scripts[].synthesis` unchanged + fresh `client_request_id` when calling `beatra.speech.synthesize`:

```json
{
  "input": "<finished lesson segment script>",
  "instructions": "Clear instructional lecture tone with thoughtful pauses after definitions and examples.",
  "voice": "<instructor_voice_id>",
  "model": "auto",
  "language": "auto",
  "client_request_id": "7f3c2d81-5e14-4a99-9b60-1c4e8a2f7d33"
}
```

To try another voice within 48 hours for identical wording, instructions, language, and context, call `beatra.speech.prepare_script` again changing only `voice` (and `model` if needed) at no extra charge (balance must cover the initial estimate).

Run free **`beatra.speech.validate`** (free, NO `client_request_id`) BEFORE paid synthesis or video generation:

```json
{
  "voice": "<instructor_voice_id>",
  "input": "<prepared segment script>",
  "model": "auto",
  "language": "zh-CN",
  "format": "mp3",
  "subtitle_enable": true
}
```

Verify `estimated_duration_seconds` fits inside the live `image_to_video` max clip duration before paying. If longer, segment the lecture script into smaller teaching beats cleanly first and re-run free `speech.validate`.

## 4. Synthesize (`output.subtitles`), Normalize Loudness (PAID) & Animate

Generate narration keeping `subtitle_enable: true` (default -> free `JSON`/`SRT`/`VTT` subtitles + `speech_start_seconds` / `speech_end_seconds` / `integrated_loudness_lufs`):

```json
{
  "voice": "<instructor_voice_id>",
  "input": "<validated segment script>",
  "model": "auto",
  "language": "zh-CN",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "8b6e1f29-3a45-4c72-9d04-6f2e8a1b5c99"
}
```

For cross-lesson loudness uniformity (sources/outputs up to `60 min` and `300 MB`, min output `>= 1 s`, `50 calls/day`, one at a time, **PAID**, `{"capability": "audio_process"}`):

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "<lesson_speech_artifact_id>"},
  "loudness_lufs": -14,
  "true_peak_db": -1,
  "format": "mp3",
  "client_request_id": "9c1a5d47-2e83-4f16-a831-3b7f9e2d4a62"
}
```

Confirm driving audio matches live `image_to_video` limits and submit `beatra.videos.animate`:

```json
{
  "image": {"type": "artifact", "artifact_id": "<instructor_portrait_artifact_id>"},
  "driving_audio": {"type": "artifact", "artifact_id": "<final_lesson_audio_artifact_id>"},
  "model": "<selected model from image_to_video card>",
  "prompt": "Instructor delivering lecture to camera, composed posture, steady eye contact, consistent likeness and attire.",
  "duration": 20,
  "client_request_id": "0e5d7a31-9b62-4f88-a140-4c9e2b6f8d15"
}
```

## 5. Recovery Checklist

Explain any error to the customer in plain words without exposing tool names, field names, or raw codes:

- **Segment duration exceeds clip ceiling**: Caught free at `beatra.speech.validate`; split into clean segments before paying.
- **`insufficient_balance`**: Relay Beatra's official message and exact verbatim top-up URL; wait until customer confirms top-up before retrying with the same `client_request_id`. If the refusal names another way forward, present it too and follow [Billing errors and recovery](billing-errors-and-recovery.md).
- **Noisy sample rejected by clone**: Propose paid `isolate_voice` pre-clean before re-cloning.
- **Transport drop or partial lesson failure**: Check `beatra.tasks.list` first (`idempotency_conflict` / `request_in_progress`: reuse same ID only for identical payload); reuse completed speech/normalized artifacts without re-paying for narration when retrying a failed video animation.
