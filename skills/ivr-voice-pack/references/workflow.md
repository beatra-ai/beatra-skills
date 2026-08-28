# IVR voice-pack workflow

## Prompt ledger

Default about twelve slots unless the user supplies a different tree:

| slot_id | use |
|---|---|
| welcome | opening greeting |
| menu | main key choices |
| hours | business hours |
| location | address or hours branch |
| hold | wait / still with you |
| transfer | connecting the caller |
| queue | place in queue |
| invalid | wrong key |
| repeat | replay the menu |
| after_hours | closed message |
| error | system or dead-end |
| goodbye | end of call |

For each slot record: slot ID, spoken text, pronunciation notes, frozen
`voice_id`, request ID, and task ID. Keep filenames stable, for example
`ivr_welcome.mp3`.

If names, product terms, or extensions appear and the pronunciation table
is empty, stop and collect those readings. Do not invent a company or a
menu.

## One prompt

```json
{
  "voice": "voice_...",
  "input": "Thank you for calling. Press 1 for sales. Press 2 for support.",
  "format": "mp3",
  "client_request_id": "opaque-ivr-menu"
}
```

Call `beatra.models.list` with `{"capability":"text_to_speech"}` before
quoting price. Confirm the voice and pack estimate, then submit each
prompt once. A revision is one prompt.

Never put a display name in `voice`. Keep one `voice_id` for the whole
pack.

## Optional brand-voice clone

Optional clones require consent first. Access to a file is not consent.
A suitable sample is currently about 10 to 300 seconds, no larger than
20 MiB, and clean single-speaker speech. Only after consent, upload a
local sample through the bundled client. Show the clone admission card
before creating a clone request ID: route `voice_clone`, tool
`beatra.voices.clone`, live price for one successful activated voice,
the provisional estimate, the 600-credit gift usually cannot start this
clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits.
Do not recommend ¥198. Do not create `client_request_id` until the user
confirms they have topped up or already have enough credits. Submit
`beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Hotline Voice",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-ivr-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that
`voice_id`.

## Polling

Keep a private ledger row per prompt. Call `beatra.tasks.get` until
`succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait,
not retry.

## Recovery

Recover a lost create response only with that prompt's identical frozen
payload and ID. A changed text is a new ID. If a task ID is lost, call
`beatra.tasks.list` and `beatra.tasks.get` before any resend. Cancel only
at the user's request. On `409`, keep polling the same task.

## Review checklist

- Every prompt carries the same brand voice.
- Names and extensions match the table.
- Slot labels cover welcome, menu, hold, transfer, after-hours, and
  error.
- Actual duration, MIME type, and `billing.net_charged_credits` are
  reported from the returned task.
- Only the changed prompt is redone.
