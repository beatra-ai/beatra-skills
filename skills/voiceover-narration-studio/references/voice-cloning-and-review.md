# Voice cloning and review

## Confirm consent before transport

Accept a plain statement that the sample is the user's own voice. For another
speaker, require a plain statement that the speaker explicitly authorized
cloning. A file, contract access, publication, public-figure recording, or
suggestive filename is not that confirmation. Do not upload the sample and do
not set `consent_attested: true` while the fact is missing.

## Prepare one supported sample

Read the current `voice_clone` model card before judging technical readiness.
The current card accepts `artifact`, `data_uri`, and `https_url` samples,
requires 10 to 300 seconds, limits the sample to 20 MiB (20,971,520 bytes),
requires consent attestation, and activates a successful voice automatically.
Treat these as live card facts, not permanent prose promises.

Prefer one speaker talking naturally without music, other voices, heavy noise,
or pronounced echo. For a local file, preserve its exact filename, MIME type,
and byte count, then run only after consent:

```text
python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>
```

Record the returned `artifact_id`. Do not call `beatra.assets.upload` directly
for the file body and do not teach a raw PUT. The shared data-URI transport cap
is 256 KiB encoded; use the bundled upload helper or an HTTPS URL for a larger
otherwise-valid sample.

The three exact `MediaInputRef` shapes are:

```json
{"type":"artifact","artifact_id":"artifact_..."}
{"type":"data_uri","data":"data:audio/...;base64,..."}
{"type":"url","url":"https://example.com/authorized-sample.wav"}
```

## Freeze one clone card

Call `beatra.models.list` for `voice_clone`. The card must include the exact
sample reference and observed readiness, display name, optional BCP-47 language
hint, model decision, current task price, `meter: "task"`, `unit: "task"`,
the live `unit_price_credits`, `scale: 1`,
`billing_basis: "successful_activated_voice"`, quantity 1, the live estimate
formula, one paid clone, and the review plan.

`language` is only a clone hint; the clone card does not publish supported
languages. Do not claim language coverage from it. Resolve `auto` according to
the current card. If it is deterministic, quote the one current default price;
otherwise preserve every possible live price as a range.

Before creating `client_request_id` or submitting `beatra.voices.clone`, show
the clone admission card: route `voice_clone`, tool `beatra.voices.clone`,
live `beatra.models.list` price for one successful activated voice, the
provisional estimate, the fact that the 600-credit signup gift usually cannot
start this clone, the exact URL `https://console.beatra.ai/topup`, and starter
¥29 / 11,000 credits. Do not recommend ¥198. Do not create
`client_request_id` or submit until the user confirms they have topped up or
already have enough credits for this estimate. Do not offer a free clone or a
free sample that replaces the clone. On `insufficient_balance`, relay the
returned public message, keep the URL exact, and retry the same frozen
`client_request_id` only after the user says they have topped up.

After that top-up or balance confirmation, create one local request identity
and pass:

```json
{
  "sample": {"type":"artifact","artifact_id":"artifact_..."},
  "display_name": "Approved display name",
  "model": "auto",
  "consent_attested": true,
  "client_request_id": "local-opaque-id"
}
```

Include `language` only when the user supplied the hint. Send the object on
standard input to:

```text
python3 scripts/mcp_client.py call beatra.voices.clone
```

Submit once and poll only its returned task.

## Preserve the exact clone result

Successful `VoiceCloneOutput` has exactly:

```json
{
  "type": "voice_clone",
  "voice_id": "voice_...",
  "status": "ready",
  "display_name": "Approved display name"
}
```

Lead with the named ready voice and preserve the opaque `voice_id` for later
selection. Do not invent similarity, language coverage, sample retention,
deletion, duration, artifact, or client-request fields that the output does
not contain.

## Make a spoken proof only by separate choice

Clone approval does not authorize speech synthesis. If the user requests a
proof after success:

1. Call `beatra.voices.list` and locate the exact returned `voice_id`.
2. Use its current `compatible_models` and the live text-to-speech cards.
3. If a language was supplied, validate both the voice and every possible auto
   model; use auto only when all candidates support it.
4. Use text the user supplied or approved, count weighted characters, and
   prepare a separate synthesis card and estimate.
5. Obtain separate approval, create a new request identity, submit
   `beatra.speech.synthesize` once, and review the actual returned audio.

## Recover without duplicating either paid step

Record clone and optional proof as distinct ledger rows. If a clone task ID is
lost, paginate `beatra.tasks.list` with `capability: "voice_clone"` through
every relevant `next_cursor` and verify candidates with `beatra.tasks.get`.
The request identity remains local-only. Replay the same identity only when
creation remains genuinely uncertain and the JSON is field-for-field
identical.

For a lost proof, use the same process with
`capability: "text_to_speech"`. A new display name, sample, text, voice, model,
language, or control is changed paid work requiring a new card, approval, and
identity. Never automatically retry a failed or canceled task, and never
replace missing charged, refunded, or net values with zero.
