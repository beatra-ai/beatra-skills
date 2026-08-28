# Webnovel serial-audio workflow

## Chapter ledger

Record every chapter title, reading order, block labels, character
counts, pronunciations, frozen `voice_id`, and each block's request ID
and task ID. Preserve the intended listening order.

Turn each chapter into speakable text before pricing:

- keep one section to one beat;
- use short spoken sentences;
- explain a new name in plain language on first mention, using the
  pronunciation table;
- extract only spoken words into synthesis `input`;
- remove chapter headings, author notes, and bracket stage directions.

If the chapter has names, terms, or place names and the pronunciation
table is empty, stop and collect those readings. Do not invent them.

## Optional narrator clone

If the user brought a narrator sample, upload it only through the bundled
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
  "display_name": "Serial Narrator",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-webnovel-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze the returned
`voice_id`.

## Current chapter then continue

Synthesize only the current chapter first. Listen to the returned audio.
Revise unclear or misread blocks in the spoken text, then regenerate only
those blocks with new request IDs. Do not generate a later chapter until
the user accepts this chapter's voice, pacing, and name readings.

Speech price comes from the live `text_to_speech` card. Confirm the
next-chapter estimate before that wave of submits. Keep the same
`voice_id` across later chapters.

## One block

```json
{
  "voice": "voice_...",
  "input": "Approved chapter block",
  "format": "mp3",
  "client_request_id": "opaque-ch014-a"
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

- The chapter keeps one narrator voice.
- Names and readings match the table.
- Listening order matches the chapter ledger.
- Actual duration, MIME type, and `billing.net_charged_credits` are
  reported from the returned task.
- Later chapters reuse the frozen `voice_id`.
