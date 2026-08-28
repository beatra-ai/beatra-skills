# Game voice-pack workflow

## Cast and line ledger

For every speaking role record: character ID, display name, age or
temperament, frozen `voice_id`, and every line ID in script order. Split
prose without attribution only after the user confirms who speaks.

Keep filenames stable and boring, for example `npc_guard_012.mp3`, so a
game or tabletop tooler can import the pack without renaming.

## One line

```json
{
  "voice": "voice_...",
  "input": "Approved line text",
  "format": "mp3",
  "client_request_id": "opaque-guard-012"
}
```

Call `beatra.models.list` with `{"capability":"text_to_speech"}` before
quoting price. Confirm the pack estimate, then submit each line once. A
revision is one line.

Optional character clones require consent first. Access to a file is not
consent. A suitable sample is currently about 10 to 300 seconds, no
larger than 20 MiB, and clean single-speaker speech. Only after consent,
upload a local sample through the bundled client. Show the clone
admission card before creating a clone request ID: route `voice_clone`,
tool `beatra.voices.clone`, live price for one successful activated
voice, the provisional estimate, the 600-credit gift usually cannot start
this clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000
credits. Do not recommend ¥198. Do not create `client_request_id` until
the user confirms they have topped up or already have enough credits.
Submit `beatra.voices.clone` exactly once with `consent_attested: true`.
Poll with `beatra.tasks.get` until terminal, then freeze that
character's `voice_id`.
