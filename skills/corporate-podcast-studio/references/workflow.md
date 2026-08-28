# Corporate podcast workflow

## Episode ledger

Record the show title, episode number or air date, section labels,
character counts, pronunciations, frozen host `voice_id`, and each
block's request ID and task ID. Preserve show order.

Turn each episode into speakable text before pricing:

- keep one section to one talking point;
- use spoken sentences;
- lock titles, product names, and guest names in the pronunciation
  table;
- extract only spoken words into synthesis `input`;
- remove slide titles, stage labels, and picture notes.

If the episode has names, titles, or product terms and the pronunciation
table is empty, stop and collect those readings. Do not invent them.

## Optional host clone

If the user brought a host sample, upload it only through the bundled
client after inspection. Show the clone admission card before creating a
clone request ID: route `voice_clone`, tool `beatra.voices.clone`, live
price for one successful activated voice, the provisional estimate, the
600-credit gift usually cannot start this clone,
`https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits. Do not
recommend ¥198. Do not create `client_request_id` until the user confirms
they have topped up or already have enough credits.

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Show Host",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-host-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze the returned
`voice_id`.

## This episode then continue

Synthesize only this episode first. Listen to the returned audio. Revise
unclear or misread blocks, then regenerate only those blocks with new
request IDs. Do not generate a later episode until the user accepts this
episode's host voice, pacing, and term readings.

Speech price comes from the live `text_to_speech` card. Confirm the
next-episode estimate before that wave of submits. Keep the same host
`voice_id` across later episodes.

## One block

```json
{
  "voice": "voice_...",
  "input": "Approved episode block",
  "format": "mp3",
  "client_request_id": "opaque-ep08-a"
}
```

Never put a display name in `voice`. Revise one block at a time.

## Polling

Keep a private ledger row per block. Call `beatra.tasks.get` until
`succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait,
not retry.

## Recovery

Recover a lost create response only with the identical frozen payload and
ID. A changed text is a new ID. If a task ID is lost, call
`beatra.tasks.list` and `beatra.tasks.get` before any resend. Cancel only
at the user's request. On `409`, keep polling the same task.

## Review checklist

- The episode keeps one host voice.
- Titles and product names match the table.
- Show order matches the episode ledger.
- Actual duration, MIME type, and `billing.net_charged_credits` are
  reported from the returned task.
- Later episodes reuse the frozen host `voice_id`.
