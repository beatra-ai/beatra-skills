# Incident brief voice workflow

## Slot list

Write one slot per written briefing item before any paid call.
Default ten slots unless the desk names another count in 8 to 20:
opening, time, place, what-happened, status, actions-taken,
audience, contact, next-steps, and reminder. Each slot names the
spoken line from the written briefing script. Do not invent a cause,
assign blame, or add an outcome missing from the brief. The labeled
list is the free artifact. It is not approval.

If names exist and the pronunciation table is empty, stop and collect
the readings.

Inspect an authorized clone sample when clone is requested. For a
local file, upload only through the bundled client
(`scripts/mcp_client.py` / `beatra.assets.upload`) and keep the
returned artifact id. Never pass a local path to
`beatra.voices.clone` or `beatra.speech.synthesize`.

## Clone admission

Skip clone unless the desk wants a cloned staff voice and can
authorize a sample they own. File access is not consent. Read the live
`voice_clone` card, show a six-field clone card, then submit
`beatra.voices.clone` once. Poll `beatra.tasks.get` and keep the
returned `voice_id` frozen for later speech slots.

## Speech admission

Call `beatra.models.list` with `{"capability":"text_to_speech"}`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

Call `beatra.voices.list` only when a catalog voice still needs to be
selected. Never put a display name in `voice`. Show the speech
production card, then submit once per slot:

```json
{
  "input": "<the written line for this slot>",
  "voice": "voice_...",
  "format": "mp3",
  "client_request_id": "opaque-incident-speech-01"
}
```

Poll `beatra.tasks.get` until terminal. Read actual
`task.output.audio.mime_type`, `duration_seconds`, `size_bytes`, and
`billing.net_charged_credits`. Do not treat a script preview as the
audio review. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

## Review and recovery

Review that every clip uses the same voice and that names match the
pronunciation table and the written briefing script. Do not invent a
cause, assign blame, or add an outcome missing from the brief. After
a returned `task_id`, poll that task. If the create response is lost,
search with `beatra.tasks.list` and verify with `beatra.tasks.get`
before replay. Reuse an ID only with byte-identical arguments. A
changed line, voice, or speed is a new card and a new ID.
