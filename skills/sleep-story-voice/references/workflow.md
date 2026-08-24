# Sleep story workflow

## Listen list

Write one slot per written short story before any paid call. Default
ten slots unless the producer names another count in 8 to 20:
opening hush, first scene, turning, landing, close, next-night,
rain bed, night walk, cabin, and river. Each slot names the spoken
text from the written short story. Do not invent a plot, a
character name, a city, or a reading. Leave a missing story off the
paid list. The labeled list is the free artifact. It is not
approval.

If names exist and the pronunciation table is empty, stop and collect
the readings.

A long serial belongs on `ai-audiobook-narration`. Keep this list on
short stories.

Inspect an authorized clone sample when clone is requested. For a
local file, upload only through the bundled client
(`scripts/mcp_client.py` / `beatra.assets.upload`) and keep the
returned artifact id. Never pass a local path to
`beatra.voices.clone` or `beatra.speech.synthesize`.

## Clone admission

Skip clone unless the producer wants a cloned voice and can authorize
a sample they own. File access is not consent. Read the live
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
  "input": "<the written short story for this slot>",
  "voice": "voice_...",
  "format": "mp3",
  "client_request_id": "opaque-sleep-speech-01"
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
pronunciation table and the written sleep-story list. After a
returned `task_id`, poll that task. If the create response is lost,
search with `beatra.tasks.list` and verify with `beatra.tasks.get`
before replay. Reuse an ID only with byte-identical arguments. A
changed story, voice, or speed is a new card and a new ID.
