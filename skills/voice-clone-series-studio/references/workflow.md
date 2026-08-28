# Series voice workflow

## Consent and sample

The user must state that this is their own voice or that the speaker
authorized this cloning use. Access to a file is not consent. A suitable
sample is currently about 10 to 300 seconds, no larger than 20 MiB, and
clean natural speech from one speaker. Treat live `beatra.models.list`
`voice_clone` constraints as truth.

## Clone admission

Show the admission card before creating a clone request ID. After approval
and balance confirmation:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Series Host",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-series-clone"
}
```

Freeze the returned `voice_id`. Never substitute a display name for
`voice`.

## Episode ledger

Keep a private ledger: series name, frozen `voice_id`, episode number,
blocks, pronunciations, and each block's request ID and task ID. Later
episodes start from this ledger. A short test reading is a separate paid
synthesis and never part of clone approval.

Speech is charged from the live `text_to_speech` card. Confirm the episode
estimate before submitting blocks. Revise one block at a time.
