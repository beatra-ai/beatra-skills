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
consent. A suitable sample is clean single-speaker speech within the
length and size limits on the `voice_clone` card. Only after consent,
upload a local sample through the bundled client. Show the clone
admission card before creating a clone request ID: route `voice_clone`,
tool `beatra.voices.clone`, live price for one successful clone, the
provisional estimate, and what happens if the balance is short. Create the
clone's `client_request_id` only after the user approves this card, then submit
`beatra.voices.clone` exactly once with `consent_attested: true` and handle any
refusal per [Billing, errors, and recovery](billing-errors-and-recovery.md).
Poll with `beatra.tasks.get` until terminal, then freeze that character's
`voice_id`. If the result has status `pending_activation`, present the preview
and the live activation price, and call `beatra.voices.activate` once after the
user agrees.
