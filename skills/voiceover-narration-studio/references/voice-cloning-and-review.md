# Voice Cloning and Review

Create authorized reusable voices cleanly while staying strictly within the
tools declared on `scripts/mcp_client.py tools`.

## Consent and sample readiness

Before touching or uploading any local recording:

1. Obtain explicit spoken or written confirmation that the recording is the user's
   own voice or that the recorded speaker authorized AI voice cloning for this
   purpose. Possession of a file, public clip, or URL is never consent.
2. Check the live clone card's constraints via `beatra.models.list` with
   `{"capability": "voice_clone"}`; its duration and file-size limits are
   authoritative.
3. If the sample contains café noise, room echo, or background music, offer paid
   pre-cleaning before cloning using `beatra.audio.process`
   (`operation: "isolate_voice"`):
   - Check live pricing under `{"capability": "audio_voice_isolation"}`.
   - Enforce limits: `4.6 s - 5 min`, `<= 100 MB`.
   - Upload the local clip via
     `python3 scripts/mcp_client.py upload ./sample.wav --mime-type audio/wav`
     only after consent is confirmed, show the six-field production card for
     `isolate_voice`, submit once upon approval using `source`, and inspect the
     cleaned artifact before proceeding to cloning.

## Select the clone model

Select the clone model as described in
[speech and audio guide](speech-and-audio.md) §5. Describe the choice by what it
does for the job, never by upstream vendor names or internal model IDs.

## Six-field clone card and submission

Present the six-field production card (Route & Model, Exact Scope, Live Price &
Basis, Duration / Quantity, Pay Mode & Call Count, and `If stop` noting free
prepared assets kept at zero extra charge) with the live clone price before
creating a `client_request_id` or calling `beatra.voices.clone`. After the user
approves it, submit once and handle any refusal per
[billing, errors, and recovery](billing-errors-and-recovery.md):

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_clean_01"},
  "display_name": "Brand Host Claire",
  "consent_attested": true,
  "language": "en",
  "model": "auto",
  "client_request_id": "opaque-clone-01"
}
```

Never invent hardcoded credit amounts, never ask the user to pre-confirm that
their balance covers the quote, and on `insufficient_balance` relay Beatra's
message + exact `topup_url` verbatim and wait for top-up confirmation before
replaying the identical payload and `client_request_id`. If the refusal names
another way forward, present it too and follow
[billing, errors, and recovery](billing-errors-and-recovery.md).

When a clone result or a listed voice has status `pending_activation`, follow §5
Step E of [speech and audio guide](speech-and-audio.md) before using the voice.

## Metadata updates and separate spoken proof

On success, record `type`, `voice_id`, `status`, and `display_name`. Use
non-billable `beatra.voices.update` to refine `display_name`, `persona`,
`use_case`, or `make_default: true` once verified, and use free
`beatra.voices.preview` to audition saved voices. Any custom spoken test reading is
always a separate `text_to_speech` workflow (`beatra.speech.validate` ->
production card -> approval -> `beatra.speech.synthesize`) with its own text
and `client_request_id`.
