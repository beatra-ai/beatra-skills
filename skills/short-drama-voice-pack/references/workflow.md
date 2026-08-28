# Short-drama voice-pack workflow

## Episode ledger

For every speaking role record: role ID, display name, temperament,
frozen `voice_id`, and every line ID in episode order. Split prose
without attribution only after the user confirms who speaks.

Keep filenames stable, for example `ep12_lin_014.mp3`, so an editor can
place the pack without renaming.

## One line

```json
{
  "voice": "voice_...",
  "input": "Approved line text",
  "format": "mp3",
  "client_request_id": "opaque-ep12-lin-014"
}
```

Call `beatra.models.list` with `{"capability":"text_to_speech"}` before
quoting price. Confirm the voice cast and episode estimate, then submit
each line once. A revision is one line.

Never put a display name in `voice`. Keep the same `voice_id` for that
role through the episode.

## Optional role clone

Optional role clones require consent first. Access to a file is not
consent. A suitable sample is currently about 10 to 300 seconds, no
larger than 20 MiB, and clean single-speaker speech. Only after consent,
upload a local sample through the bundled client. Show the clone
admission card before creating a clone request ID: route `voice_clone`,
tool `beatra.voices.clone`, live price for one successful activated
voice, the provisional estimate, the 600-credit gift usually cannot start
this clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000
credits. Do not recommend ¥198. Do not create `client_request_id` until
the user confirms they have topped up or already have enough credits.
Submit `beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Role Name",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-role-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that role's
`voice_id`.

## Polling

Keep a private ledger row per line: role, line ID, exact text, request
ID, task ID, and terminal result. Call `beatra.tasks.get` until
`succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait,
not retry.

## Recovery

Recover a lost create response only with that line's identical frozen
payload and ID. A changed text is a new ID. If a task ID is lost, call
`beatra.tasks.list` and `beatra.tasks.get` before any resend. Cancel only
at the user's request. On `409`, keep polling the same task.

## Review checklist

- Each clip carries the voice assigned to its role.
- Line order matches the episode script.
- Names and readings match the table.
- Actual duration, MIME type, and `billing.net_charged_credits` are
  reported from the returned task.
- Only the changed line is redone.
