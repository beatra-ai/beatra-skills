# Series Voice Workflow

Run every recurring series setup, cloning confirmation, episode validation,
script direction, synthesis, and loudness normalization through this exact order.

## Consent, sample isolation, and clone admission

1. Obtain explicit spoken or written confirmation that the recording is the user's
   own voice or that the speaker explicitly authorized cloning before running
   `python3 scripts/mcp_client.py upload`. Possession of a file is never consent.
2. If the recording contains room noise or background music, offer paid
   pre-cleaning via `beatra.audio.process` (`operation: "isolate_voice"`, `source`
   field, 4.6 s–5 min, <= 100 MB) priced live from `{"capability": "audio_voice_isolation"}`
   on its own six-field card first.
3. Select the clone model as described in
   [Speech and audio guide](speech-and-audio.md) §5. Do not expose upstream
   vendor names or internal model IDs when describing the choice.
4. Show the six-field production card with the live clone price before
   `beatra.voices.clone` (never hardcoding credit numbers or asking the user to
   pre-confirm balance). After the user approves it, submit once and handle any
   refusal per [Billing, errors, and recovery](billing-errors-and-recovery.md):

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_clean_01"},
  "display_name": "Series Host",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-series-clone"
}
```

## Activation, metadata pinning, and retirement

- When a clone result or a listed voice has status `pending_activation`, follow
  §5 Step E of [Speech and audio guide](speech-and-audio.md) before using the
  voice. After the user approves the live activation price, call once with a
  new `client_request_id`:

```json
{
  "voice_id": "voice_pending_01",
  "client_request_id": "opaque-activate-01"
}
```

- Once `ready`, pin series identity with non-billable `beatra.voices.update`
  (`voice_id`, `display_name`, `persona`, `use_case`, `make_default: true`).
  Use free `beatra.voices.preview` (`{"voice_id": "..."}`) to audition candidates.
- To delete a retired series voice permanently (`beatra.voices.delete`), ask the
  user first, fetch a `confirmation_token` with `{"voice_id": "..."}`, relay
  the warning verbatim, and only pass `confirmation_token` after explicit confirmation.

## Episode ledger, preflight, and loudness normalization

Keep a local ledger mapping: series name, frozen `voice_id`, episode number,
pronunciation glossary, script direction `task_id` (if used), synthesis block
`client_request_id` + `task_id`, and finishing `task_id`.

- **Optional Smart Voice Director (`prepare_script`)**: check live pricing
  via `{"capability": "speech_script"}`, approve its six-field card, inspect
  `directed` / `scripts[]`, handle `synthesis: null` via `warnings`, and pass
  `scripts[i].synthesis` unchanged with a fresh `client_request_id`. Re-calling
  within 48 hours with identical text/instructions/language/context changing only
  `voice`/`model` recompiles at zero extra charge (balance cover & max-2
  concurrency limits still apply; never call `prepare_script` generally free).
- **Mandatory free check (`validate`)**: run `beatra.speech.validate`
  (`model`, `voice`, `input`, controls — no `client_request_id`) to confirm
  `estimated_duration_seconds` and compatibility before charging.
- **Episode synthesis**: submit `beatra.speech.synthesize` with the frozen
  `voice_id` (optionally `subtitle_enable: true` for free aligned `SRT`/`VTT`
  captions; never `subtitles`).
- **Broadcast loudness normalization**: check live `{"capability": "audio_process"}`
  pricing, approve its finishing card, and run one serialized finishing task at
  a time (`<= 60 min`, `<= 300 MB`, `>= 1 s` output, `50` calls/day):

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "artifact_ep01"},
  "loudness_lufs": -14,
  "format": "mp3",
  "client_request_id": "opaque-ep01-norm"
}
```
