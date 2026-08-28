# Consent and sample readiness

## Reuse a clear current authorization

Before upload or cloning, retain a plain statement that the sample is the
user's own voice or that the speaker authorized this cloning use. A request to
“clone my voice” with the user's current sample is enough. Record the useful
fact without collecting or repeating sensitive detail, and do not add legal
formality after the required meaning is clear.

For another person's voice, ask whether that speaker gave explicit permission
for cloning. Possessing a file, finding it online, seeing a public post, having
a publication right, reading a contract-like filename or recognizing a public
figure does not establish that permission. Without the statement, stop before
local upload and before `beatra.voices.clone`; do not set
`consent_attested: true`.

## Read current sample conditions

Use the live voice-clone card from `beatra.models.list` as the source of truth:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "voice_clone"}
```

The current card accepts clean, natural, single-speaker speech from about 10 to
300 seconds and no more than 20 MiB. Music, multiple speakers, pronounced echo
or heavy noise make readiness uncertain. If the host cannot inspect or play
the source, say that the readiness check is unverified and let the user decide
whether to supply a known-clean recording.

Do not claim this workflow will denoise, separate, trim, transcribe, repair or
delete a recording. Do not promise storage or retention behavior that the
returned contract does not state. The positive next step for an unsuitable
sample is a clean recording from the authorized speaker.

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

The shared media interface limits the encoded data URI to 256 KB. Use an
artifact upload or HTTPS URL for a larger otherwise-valid sample; the live
voice-clone card's overall sample ceiling is 20 MiB.

After consent, upload a local sample only through the bundled command:

```bash
python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>
```

Record the exact source filename, exact MIME type, byte length and returned
`artifact_id`. Do not imitate the underlying upload protocol or teach a raw
PUT. Keep the source reference, chosen display name, readiness result and
consent fact together in the local clone card.

## Set only useful identity hints

Ask for the display name the user wants to see later. It is a label, not the
voice's opaque handle and not proof that the voice is unique. `language` is an
optional BCP-47 hint: preserve a supplied value, or omit it when unknown. The
clone model card does not expose `supported_languages`, so do not turn the hint
into a language-coverage claim.
