# Song cover workflow

## Establish the cover shot

Use one accessible reference song recording that the host Agent can inspect and one reinterpretation direction — a genre change, new arrangement, fresh vocal character, or reimagined mood. Record the reference recording's actual MIME type, format, duration, and byte size. Also record the song identity, language, mood, genre, energy, instrumentation, vocal character, source-audio intent, the requested reinterpretation direction, and any must-keep details.

Build a production card from the reference: song identity, language, mood, target genre, energy, instrumentation, vocal character, must-keep lyrical details, and desired degree of reinterpretation. Then write one positive reinterpretation instruction that states a single creative thesis — the one dominant change this run should deliver. One dominant reinterpretation keeps the result legible and reviewable; stacking unrelated genre, vocal, and arrangement changes in one prompt degrades the cover.

Beatra has no lyrics-transcription step. Treat the reference audio as creative guidance only. Any lyric text that must be preserved accurately must be supplied and approved by the user before generation; do not claim exact lyric preservation for a vocal reinterpretation made without supplied lyrics.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./reference-song.mp3 --mime-type audio/mpeg
python3 scripts/mcp_client.py upload ./reference-song.flac --mime-type audio/flac
python3 scripts/mcp_client.py upload ./reference-song.wav --mime-type audio/wav
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"reference_audio_to_music"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the live reference-audio music card

Before any paid cover, call `beatra.models.list` with `{"capability":"reference_audio_to_music"}` and inspect the current typed model cards. Require a current card that admits the reference recording's actual MIME type, format, duration, and byte size. Confirm the live reference-audio route, whether the route accepts supplied lyrics and a title, the accepted prompt length range, and the price basis. Baseline reference constraints for planning are FLAC/MP3/WAV with a typical duration window of roughly 6–360 seconds and a byte-size ceiling near 50 MB for one reference route, while another route can admit longer material; the live card remains authoritative and may narrow these values. If any actual fact is unavailable or incompatible, stop before the paid call and request the smallest compatible source change.

Keep `model: "auto"` unless the user chose a concrete eligible model or the requested route requires an explicit model family. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Build and submit the cover

Route the reinterpretation explicitly:

- Vocal reinterpretation without supplied lyrics: use a supported reference-audio card and a concise production prompt. Do not claim exact lyric preservation for this route.
- Vocal reinterpretation with user-supplied lyrics: the current `auto` reference route requires a prompt of 10–300 characters; supplied lyrics must contain 10–1000 characters and require a nonempty title. Freeze the title, lyrics, and prompt before submission.
- Instrumental reinterpretation: do not use `model: "auto"`. The current reference route rejects instrumental requests, so select an explicit live model family that affirmatively supports an instrumental reference combination.
- Model-family controls: send only controls published by the chosen live family and never mix family-specific options from different families.

The normal cover payload (vocal reinterpretation without supplied lyrics) is:

```json
{
  "reference_audio": {
    "type": "artifact",
    "artifact_id": "art_reference"
  },
  "prompt": "Reimagine this ballad as an upbeat acoustic folk cover with warm vocals and a lighter, brighter arrangement.",
  "client_request_id": "opaque-cover-id"
}
```

When the user supplies lyrics, include the approved `title` and `lyrics` with the prompt. Show the exact reference recording, production prompt, lyrics and title when supplied, model behavior, explicit controls, output count, and paid boundary. Freeze all arguments and one opaque stable request ID. Submit `beatra.music.generate` exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for the cover stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful cover, deliver every returned audio artifact or link and report only actual task status, resolved model, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Listen for recognizable reference influence, freshness of arrangement, vocal delivery, lyrics, pronunciation, structure, and actual duration. Treat the reference audio as creative guidance and review the returned melody, structure, arrangement, vocal delivery, and lyrics as the actual result. State inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
