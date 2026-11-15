# Voice Cloning, Activation, Deletion, and Review

Run every voice creation and lifecycle step through the three capability routes
and three mandatory confirmations.

## Mandatory Confirmation 1: Consent, isolation, and 3 cloning routes

1. Obtain plain spoken or written confirmation that the sample is the user's own
   voice or explicitly authorized by the speaker BEFORE running
   `python3 scripts/mcp_client.py upload`. Access, filenames, or public links are
   never consent.
2. Query `beatra.models.list` with
   `{"capability": "voice_clone", "include_activation_required": true}`.
   Compare options solely by returned capability (never mention upstream vendor
   names or internal model IDs):
   - **Fast everyday cloning (`auto`)**: quick turnaround, broad languages,
     immediately `ready`.
   - **Expressive multilingual cloning**: richer emotional nuance across major
     languages and dialogue/conversion support, immediately `ready`.
   - **Two-step trial-then-activate cloning**: starts as `pending_activation` so
     you can decide whether to commit to permanent activation.
3. If the recording has room noise, café chatter, or background music, offer
   paid pre-clean using `beatra.audio.process` (`operation: "isolate_voice"`,
   `source` field, 4.6 s–5 min, <= 100 MB) priced via
   `{"capability": "audio_voice_isolation"}` on its own six-field card first.
4. Show the six-field clone card (with zero hardcoded credits and without asking
   users to confirm they already have enough credits) before generating a
   `client_request_id` or submitting `beatra.voices.clone`.

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_clean_01"},
  "display_name": "Studio Lead Voice",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-studio-clone-01"
}
```

## Mandatory Confirmation 2: Trial-clone activation (`beatra.voices.activate`)

If cloning returns `status == "pending_activation"`:

1. Read `activation.quote` from the completed clone task, or request a fresh
   free quote by calling `beatra.voices.activate` passing BOTH `voice_id` and a
   `client_request_id` (omitting `confirmation_token`).
2. Show the six-field activation card (`credits`, currency/basis, confirmation
   scope, `If stop` showing the free uncharged trial preview state).
3. Wait for explicit confirmation, then submit with the quote's
   `confirmation_token`, exact `confirm_credits`, and `client_request_id`:

```json
{
  "voice_id": "voice_pending_01",
  "confirmation_token": "tok_from_quote",
  "confirm_credits": 1200,
  "client_request_id": "opaque-activate-01"
}
```

If 24 hours pass and the token expires (`price_confirmation_required`), request
a new free quote with `voice_id` + `client_request_id` and re-confirm.

## Metadata maintenance (`voices.update`), deletion (`voices.delete`), and spoken proof

- Use non-billable `beatra.voices.update` to refine `display_name`, `language`,
  `gender`, `age_group`, `persona`, `use_case`, or `make_default: true`.
- **Mandatory Confirmation 3 (`beatra.voices.delete`)**: confirm delete intent,
  call tokenless `{"voice_id": "..."}` to retrieve Beatra's warning and
  `confirmation_token`, relay the warning verbatim, and pass
  `confirmation_token` ONLY after explicit final user confirmation.
- Keep any custom spoken proof read separate (`beatra.speech.validate` -> card
  -> approval -> `beatra.speech.synthesize`), never bundled into clone approval.
