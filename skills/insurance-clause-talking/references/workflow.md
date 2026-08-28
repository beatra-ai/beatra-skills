# Clause talking-clip workflow

## Slot list

Write one slot per still before any paid call. Default three slots
unless the advisor names another count in 2 to 8: coverage scope,
waiting period, and exclusions. Each slot names the still, the spoken
line from the supplied clauses, and a planned 2–15s window. Do not
invent coverage, payout amounts, claim approval odds, waiting periods,
exclusions, or benefit limits not in the supplied text. Do not promise
payout or guarantee claim success. The labeled list is the free
artifact. It is not approval.

Inspect every still first. For a local file, upload only through the
bundled client (`scripts/mcp_client.py` / `beatra.assets.upload`) and
keep the returned artifact id. Never pass a local path to
`beatra.voices.clone`, `beatra.speech.synthesize`, or
`beatra.videos.animate`.

## Clone admission

Skip clone unless the advisor wants a cloned voice and can authorize a
sample they own. File access is not consent. Read the live
`voice_clone` card, show a six-field clone card, then submit
`beatra.voices.clone` once. Poll `beatra.tasks.get` and keep the
returned `voice_id` frozen for later speech slots.

## Speech admission

When the advisor already supplied an approved speech track for a slot,
skip synthesis and admit that audio. Otherwise call
`beatra.models.list` with `{"capability":"text_to_speech"}`:

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
  "input": "The waiting period is the one already printed in this clause.",
  "voice": "voice_...",
  "format": "mp3",
  "client_request_id": "opaque-clause-speech-01"
}
```

Use `mp3` only when the live speech card supports it and the live
video card accepts `audio/mpeg`. If the advisor requested `flac`,
`opus`, or `pcm` and the video route does not accept the resulting
format, explain the incompatibility before any paid call and obtain
their choice. Poll `beatra.tasks.get` until terminal. Read actual
`task.output.audio.mime_type`, `duration_seconds`, and `size_bytes`.
Do not treat a script preview as the audio review.

## Video admission

Call `beatra.models.list` with `{"capability":"image_to_video"}`:

```json
{"capability": "image_to_video"}
```

Admit the still plus the approved audio. Live driving-audio i2v SKUs
are 2–15s. Use the smallest supported integer duration at or above the
actual speech length. Split a longer spoken slot into sequential
containable segments. Each segment is a new speech call and a new
video call. Show the video production card before creating a video
request ID. Approved narration does not authorize the video call. The
600-credit signup gift usually cannot start this video. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

Submit `beatra.videos.animate` once per approved segment with
`driving_audio` attached. Poll `beatra.tasks.get` until terminal.
Deliver actual video bytes plus MIME, duration, size, and
`billing.net_charged_credits`.

## Recovery

If a create response is lost, search with `beatra.tasks.list` and
verify with `beatra.tasks.get` before replay. Reuse a
`client_request_id` only with byte-identical arguments. A changed
still, line, voice, or duration is a new card and a new ID. Cancel
only when the advisor asks.
