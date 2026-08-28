# TikTok comment reply workflow

## Listen list

Write one slot per written reply before any paid call. Default ten
slots unless the operator names another count in 8 to 20: opening
thanks, first question, shipping, size, refund, restock, pin reply,
late comment, thank-you, and close. Each slot names the sourced
comment and the spoken text from the written reply. Do not invent a
comment, a username, a like count, or a reply. Leave a missing reply
off the paid list. The labeled list and term table are the free
artifact. They are not approval.

If names exist and the pronunciation table is empty, stop and collect
the readings.

A talking clip belongs on `tiktok-comment-to-talking-clip`. A VOC
memo belongs on `comment-voc-miner`. Keep this list on spoken files.

Inspect an authorized clone sample when clone is requested. For a
local file, upload only through the bundled client
(`scripts/mcp_client.py` / `beatra.assets.upload`) and keep the
returned artifact id. Never pass a local path to
`beatra.voices.clone` or `beatra.speech.synthesize`.

## Look up, then plan

If the operator pasted the comments and reply lines, skip lookup. If
they gave a link and asked this connection to read it, follow
[comment lookup](comment-lookup.md) on its own card first. Deliver
the returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or
duration.

Then write the free listen list from those lines. The operator picks
which replies become clips.

## Clone admission

Skip clone unless the operator wants a cloned voice and can authorize
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
  "input": "<the written reply for this slot>",
  "voice": "voice_...",
  "format": "mp3",
  "client_request_id": "opaque-tiktok-reply-speech-01"
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
pronunciation table and the written reply list. After a returned
`task_id`, poll that task. If the create response is lost, search
with `beatra.tasks.list` and verify with `beatra.tasks.get` before
replay. Reuse an ID only with byte-identical arguments. A changed
comment, reply, voice, or speed is a new card and a new ID.
