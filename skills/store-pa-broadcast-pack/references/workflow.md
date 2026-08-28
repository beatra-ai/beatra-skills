# Store PA broadcast workflow

## Campaign ledger

Default four dated slots unless the user supplies more spoken reads for
the same window:

| slot_id | use |
|---|---|
| open | doors-open / campaign start |
| promo | standing offer through the window |
| flash | short-window or hourly push |
| close | last hour / doors-close |

For each slot record: campaign dates, slot ID, spoken text,
pronunciation notes, frozen `voice_id`, request ID, and task ID. Keep
filenames stable, for example `pa_20260822_flash.mp3`.

If brand names, SKUs, or place names appear and the pronunciation table
is empty, stop and collect those readings. Do not invent an offer or a
date window. Do not add a music slot.

## One read

```json
{
  "voice": "voice_...",
  "input": "Today only, the weekend bundle is twenty-nine through Sunday.",
  "format": "mp3",
  "client_request_id": "opaque-pa-flash"
}
```

Call `beatra.models.list` with `{"capability":"text_to_speech"}` before
quoting price. Confirm the voice and campaign estimate, then submit each
read once. A revision is one read.

Never put a display name in `voice`. Keep one `voice_id` for the whole
window.

## Optional store-voice clone

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
  "display_name": "Store Voice",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-store-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that
`voice_id`.

## Polling

Keep a private ledger row per read. Call `beatra.tasks.get` until
`succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait,
not retry.

## Recovery

Recover a lost create response only with that read's identical frozen
payload and ID. A changed text is a new ID. If a task ID is lost, call
`beatra.tasks.list` and `beatra.tasks.get` before any resend. Cancel only
at the user's request. On `409`, keep polling the same task.

## Review checklist

- Dates, prices, and the store name match the campaign ledger.
- Every read carries the same store voice.
- Open, promo, flash, and close are labeled.
- No music was generated or mixed.
- Actual duration, MIME type, and `billing.net_charged_credits` are
  reported from the returned task.
- Only the changed read is redone.
