# Consent and sample readiness

## Reuse a clear current authorization

Before upload, voice isolation, or cloning, retain a plain statement that the
sample is the user's own voice or that the speaker authorized this cloning use.
A request to "clone my voice" with the user's current sample is enough. Record
the useful fact without collecting unnecessary sensitive detail, and do not add
legal formality after the required meaning is clear.

For another person's voice, ask whether that speaker gave explicit permission
for cloning. Possessing a file, finding it online, seeing a public post, having
a publication right, reading a contract-like filename, or recognizing a public
figure does not establish that permission. Without the statement, stop before
local upload and before `beatra.voices.clone`; do not set
`consent_attested: true`.

## Inspect sample quality and clean noisy recordings first

Use the live voice-clone cards from `beatra.models.list` as the source of truth:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "voice_clone", "include_activation_required": true}
```

Clean, natural, single-speaker speech without music, background noise, or heavy
echo works best; honor each route's duration and byte bounds from the live card
(for voice isolation pre-clean via `beatra.audio.process`, `4.6 s – 5 min` and
`<= 100 MB`). If the host cannot inspect or play the sample, state honestly
that listening verification was not performed and let the user decide whether
to run paid voice isolation or supply a known-clean recording.

When background noise, room tone, or music is present on an authorized recording,
offer paid voice isolation before cloning:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "audio_voice_isolation"}
```

Present a six-field production card, obtain explicit user confirmation, and
submit `beatra.audio.process` with `operation: "isolate_voice"` and `source`.
Never describe `isolate_voice` as free, and do not invoke operations outside this
Skill's active tool list (such as stem separation or SFX generation).

If preparing an optional short `< 8 s` reference `prompt` for a fast clone and
the user has not supplied verbatim transcript text, you may transcribe the clean
authorized prompt clip first via paid `beatra.audio.transcribe` (`audio` input,
`{"capability": "speech_to_text"}`).

## Preserve one discriminated source

Use exactly one accepted media reference:

```json
{"type": "artifact", "artifact_id": "artifact_..."}
```

```json
{"type": "data_uri", "data": "data:audio/...;base64,..."}
```

```json
{"type": "url", "url": "https://..."}
```

Keep encoded data URIs within transport size limits and use `upload` or an HTTPS
URL for larger valid samples within the live `voice_clone` card's maximum file size.

After consent, upload a local sample only through the bundled command:

```bash
python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>
```

Record the exact source filename, exact MIME type, byte length, and returned
`artifact_id`. Do not imitate the underlying upload protocol or teach a raw
PUT.

## Set only useful identity and profile hints

Require a recognizable `display_name`. It is a label, not the voice's opaque
`voice_id` and not proof of uniqueness. Optional profile metadata (`language`,
`gender`, `age_group`, `use_case`, `persona`) helps later catalog discovery via
`beatra.voices.list` and can be refined at zero cost later with
`beatra.voices.update`. Omit unknown hints rather than guessing.
