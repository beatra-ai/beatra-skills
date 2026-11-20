# Voice Cloning, Activation, Deletion, and Review

Run every voice creation and lifecycle step through the three mandatory
confirmations.

## Mandatory Confirmation 1: Consent, isolation, and clone model choice

1. Obtain plain spoken or written confirmation that the sample is the user's own
   voice or explicitly authorized by the speaker BEFORE running
   `python3 scripts/mcp_client.py upload`. Access, filenames, or public links are
   never consent.
2. If the recording has room noise, café chatter, or background music, offer
   paid pre-clean using `beatra.audio.process` (`operation: "isolate_voice"`,
   `source` field, 4.6 s–5 min, <= 100 MB) priced via
   `{"capability": "audio_voice_isolation"}` on its own six-field card first.
3. Select the clone model as described in
   [Speech and audio guide](speech-and-audio.md) §5. Never mention upstream
   vendor names or internal model IDs. When the cloned voice will speak in
   multi-speaker dialogue, be the target of speech-to-speech conversion, or
   carry expressive reads, select the clone card that states it and lists
   the job's language; other work keeps the default.
4. Show the six-field clone card with the live clone price (no hardcoded
   credits, and without asking users to confirm they already have enough
   credits) before generating a `client_request_id` or submitting
   `beatra.voices.clone`. After the user approves it, submit once and handle any
   refusal per [Billing, errors, and recovery](billing-errors-and-recovery.md).

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_clean_01"},
  "display_name": "Studio Lead Voice",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-studio-clone-01"
}
```

## Mandatory Confirmation 2: Activating a pending clone (`beatra.voices.activate`)

When a clone result or a listed voice has status `pending_activation`, follow §5
Step E of [Speech and audio guide](speech-and-audio.md) before using the voice.
After the user approves the live activation price, call once with `voice_id`
and a new `client_request_id`:

```json
{
  "voice_id": "voice_pending_01",
  "client_request_id": "opaque-activate-01"
}
```

## Metadata maintenance (`voices.update`), deletion (`voices.delete`), and spoken proof

- Use non-billable `beatra.voices.update` to refine `display_name`, `language`,
  `gender`, `age_group`, `persona`, `use_case`, or `make_default: true`.
- **Mandatory Confirmation 3 (`beatra.voices.delete`)**: confirm delete intent,
  call tokenless `{"voice_id": "..."}` to retrieve Beatra's warning and
  `confirmation_token`, relay the warning verbatim, and pass
  `confirmation_token` ONLY after explicit final user confirmation.
- Keep any custom spoken proof read separate (`beatra.speech.validate` -> card
  -> approval -> `beatra.speech.synthesize`), never bundled into clone approval.
