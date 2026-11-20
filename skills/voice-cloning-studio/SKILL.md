---
name: "voice-cloning-studio"
description: "Create a reusable personal or brand voice from a clean audio sample with this AI voice cloning studio and voice cloning software. Clone my voice, build a custom AI voice, or create an AI voice clone from a short single-speaker sample; give the custom voice a memorable name and reuse it for narration, courses, product stories, customer updates, series, and brand content. Compare sample quality, review the current estimate, and hear the reusable voice in a short test reading before expanding it into longer spoken projects."
---

# AI Voice Cloning Studio

Create, audition, refine, convert, and manage authorized reusable voices.
Starting from a clean or cleaned speech sample, select the clone model that fits
the destination, confirm required gates cleanly, and turn the returned
`voice_id` into ready narration, voice-to-voice performance transfer, or
loudness-normalized deliverables.

Use the bundled `scripts/mcp_client.py` for every Beatra operation. Do not
configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI as a
fallback. Pass the tool name as the command argument and its JSON request on
standard input, for example:

```bash
python3 scripts/mcp_client.py call beatra.voices.clone
```

On first use, allow the bundled client's best-effort non-billable
`beatra.installations.register`; a registration failure must not block the
requested voice work. Only call tools exposed on this account and listed by
`scripts/mcp_client.py tools`.

## Before the connection is ready

When Allow is still pending at the end of a turn, finish and deliver
everything that needs no connection, in the format the user asked for:
the consent checklist, the sample-readiness checks that can be judged
locally (duration, format, noise), and the display name. Cloning waits
until after Allow. Say in one line that the paid step continues on their
next message after Allow; Allow only completes the connection, and the
clone still waits for its six-field admission card on that next message.
Do not fill the gap with another tool or service.

## Mandatory Confirmation 1: Consent and noisy-sample cleanup

Reuse the sample, intended display name, language hint, intended reuse, and any
plain consent statement already supplied. Before local upload or calling
`beatra.voices.clone`, obtain **explicit confirmation from the user** that the
recording is their own voice or that the speaker gave verifiable authorization
to clone and use it. Never set `consent_attested: true` without that user
statement in the current conversation.

"Clone my voice" together with the user's current sample satisfies consent; do
not turn that clear statement into repeated legal questions. Possessing a file,
finding a public interview, having publication rights, or naming a public figure
is not consent. Read [Consent and sample readiness](references/consent-and-sample-readiness.md)
for exact sample rules and transport.

If the authorized recording has background music, room echo, or overlapping
noise, propose paid voice isolation pre-clean first using
`beatra.audio.process` with `operation: "isolate_voice"` and `source`
(`4.6 s – 5 min`, `<= 100 MB`). Inspect live rates with `beatra.models.list`
(`{"capability": "audio_voice_isolation"}`), confirm the six-field production
card with the user, and never describe `isolate_voice` as free.

If the user supplies a local file after consent, upload it only through:

```bash
python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>
```

When the selected clone card sets `prompt_accepted` and you provide a short `< 8 s` reference clip plus verbatim text (`prompt`),
you may transcribe a clean authorized recording first through paid
`beatra.audio.transcribe` (`{"capability": "speech_to_text"}`, `audio` input,
up to 60 min `<= 100 MiB`, optional `diarize`, `num_speakers`,
`tag_audio_events`, and free aligned `subtitles: true` in JSON/SRT/VTT).

## Select the clone model

Never guess prices, invent limits, name upstream suppliers, or expose internal
model IDs. Select the clone model as described in
[Speech, voices, cloning, and audio finishing](references/speech-and-audio.md) §5.

When the cloned voice will speak in multi-speaker dialogue, be the target of
speech-to-speech conversion, or carry expressive reads, select the clone card
that states it and lists the job's language; other work keeps the default.

## Six-field production card and cloning submission

Planning, catalog reads, sample advice, naming, or "clone it now" never
approve a charge. Before creating any `client_request_id` or submitting a paid
call (`beatra.voices.clone`, `beatra.voices.activate`, `beatra.speech.prepare_script`,
`beatra.speech.synthesize`, `beatra.speech.convert`, `beatra.audio.transcribe`,
or `beatra.audio.process`), read live rates via `beatra.models.list` (keeping
`beatra.wallet.get` and `beatra.wallet.ledger` as optional read-only tools for
user balance questions, never as a mandatory submit gate) and present a concise
**six-field production card**:

1. **Work:** exact capability/operation, voice or sample ref, language/format, and any finishing step.
2. **Credits:** live estimate from `beatra.models.list` / `beatra.speech.validate` / `activation.price_credits` — never hardcode numbers.
3. **Count:** exact number of billable calls/takes/clips.
4. **Identity:** fresh caller-generated `client_request_id` minted once the payload is final.
5. **If stop:** state what the customer keeps at zero extra charge (consent/readiness check, voice picks/audition, preflight quote — or nothing spent if this is the first paid step). Cancel an in-flight job via `beatra.tasks.cancel` only if asked.
6. **If balance short:** relay Beatra's official `insufficient_balance` message and verbatim top-up URL (`topup_url`, translated cleanly without altering the link), and wait until the user confirms they have topped up before retrying with the same frozen `client_request_id`.

After the user approves the card with the live clone price, create one new
opaque `client_request_id`, call `beatra.voices.clone` once, and handle any
refusal per [Billing, errors, and recovery](references/billing-errors-and-recovery.md):

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Approved display name",
  "consent_attested": true,
  "model": "auto",
  "language": "optional-BCP-47",
  "client_request_id": "new-local-opaque-id"
}
```

Omit `language` when unknown. Poll `beatra.tasks.get` until terminal, preserving
the opaque `voice_id`. Read [Clone execution and recovery](references/clone-and-proof-workflow.md).

## Mandatory Confirmation 2: Activate a pending clone (`beatra.voices.activate`)

When a clone result or a listed voice has status `pending_activation`, follow §5
Step E of [Speech, voices, cloning, and audio finishing](references/speech-and-audio.md)
before using the voice.

## Browse, audition, update, and delete voices

- **11-dimension discovery (`beatra.voices.list`):** Free catalog query
  (up to `limit` `<= 500` with `cursor`) across preset voices and `category: "cloned"`
  (`status`: `"ready"`, `"pending_activation"`, `"expired"`, `"any"`), supporting
  bilingual `search`, facet filters (`language`, `gender`, `age_group`,
  `use_case`, `emotion`, `model`), six query capability filters
  (`supports_dialogue`, `supports_speech_to_speech`, `supports_direction`,
  `supports_emotion`, `supports_performance_tags`, `supports_context`), and all
  11 `capabilities.*` metadata fields (`supports_direction`,
  `supported_emotions`, `supports_performance_tags`, `supported_dialects`,
  `supports_context`, `supports_previous_text`, `supports_next_text`,
  `supports_pronunciation_pinyin`, `supports_pronunciation_ipa`,
  `supports_speech_to_speech`, `supports_dialogue`).
- **Free audition (`beatra.voices.preview`):** Free audition URL (`preview_url`,
  `kind`) for any ready voice before paying for synthesis or conversion.
- **Metadata & pinning (`beatra.voices.update`):** Free rename or metadata
  update (`display_name`, `gender`, `age_group`, `use_case`, `persona`,
  `language`, `make_default`).

### Mandatory Confirmation 3: Two-step deletion (`beatra.voices.delete`)

Deleting a cloned voice is permanent (`deleted: true` cannot be undone; using
that voice again means cloning it again). Never auto-chain step 1 and step 2 in
one turn:

1. Call `beatra.voices.delete` with `voice_id` only (**omit `confirmation_token`**).
2. Present the returned `voice`, `paid_slot_warning`, `irreversible_notice`, and
   15-minute `confirmation_token` expiry clearly to the user.
3. Only after explicit user confirmation, call `beatra.voices.delete` with both
   `voice_id` and `confirmation_token` (repeat step 1 if 15 minutes pass or
   `invalid_request` reports an expired token).

## Smart Voice Director, test reading, conversion, and loudness normalization

Every spoken proof, script-preparation pass, conversion, transcription, or
finishing pass is a separate paid operation (except free `beatra.speech.validate`,
`beatra.voices.list`, `beatra.voices.preview`, `beatra.voices.update`,
and `beatra.voices.delete`).

1. **Smart Voice Director (`beatra.speech.prepare_script`):** Query
   `beatra.models.list` with `{"capability": "speech_script"}`. Compiles plain
   scripts and `instructions` into pacing, pauses, and expressive structure
   **without altering the user's spoken words**. Never teach manual `/` pause
   stripping or hand-write braced performance tags. Inspect `directed` and
   `scripts[]`: pass each ready script's `synthesis` object unchanged with a
   fresh `client_request_id` to synthesis, or inspect `warnings` if `synthesis`
   is `null`. To switch `voice` within 48 hours for identical wording,
   instructions, language, and `context`, call `beatra.speech.prepare_script`
   again changing only `voice`/`model` to re-compile at zero extra charge (balance
   must still cover the initial estimate); keep at most **2 concurrent** tasks,
   and never describe paid `prepare_script` calls as free.
2. **Free preflight (`beatra.speech.validate`):** Always validate `voice`,
   `input`, `model`, and controls for **zero credits** before `beatra.speech.synthesize`
   to read `valid`, `weighted_characters`, `estimated_duration_seconds`, live
   `price_credits`, `execution`, and `warnings`.
3. **Speech synthesis & free aligned subtitles (`beatra.speech.synthesize`):**
   Query `beatra.models.list` with `{"capability": "text_to_speech"}` and verify
   voice/model compatibility and `constraints.supported_languages`. Keep
   `subtitle_enable: true` (default; never pass `subtitles` on `beatra.speech.synthesize`)
   to receive **free** aligned `output.subtitles` (`JSON`, `SRT`, `VTT`) plus
   `speech_start_seconds`, `speech_end_seconds`, and `integrated_loudness_lufs`.
4. **Speech-to-speech voice conversion (`beatra.speech.convert`):** Query
   `beatra.models.list` with `{"capability": "speech_to_speech"}`. Transfers
   timing, pauses, laughter, and cadence from a guide vocal (`audio`, `1 s – 5 min`,
   `<= 50 MB`) into a ready voice with `capabilities.supports_speech_to_speech: true`,
   with optional `remove_background_noise: true`, `stability`, `similarity_boost`,
   `style`, `use_speaker_boost`, and `seed`.
5. **Paid loudness normalization (`beatra.audio.process`):** When the customer
   asks for broadcast loudness normalization after synthesis or conversion,
   inspect `beatra.models.list` (`{"capability": "audio_process"}`), confirm the
   six-field card, and run one finishing call at a time (`<= 60 min`, `<= 300 MB`,
   output `>= 1 s`, within daily cap) with `operation: "normalize_loudness"`,
   `source`, `loudness_lufs: -14`, and `true_peak_db: -1` (never `action`, never free).

Read [Test-reading review and voice reuse](references/review-recovery-and-voice-reuse.md)
and [Speech, voices, cloning, and audio finishing](references/speech-and-audio.md).

## Recover and deliver factual results

Lead the reply with the result and format the user asked for; the production
card, model choice, and cost notes follow it and never replace it. Explain
errors in plain words in the user's language without exposing internal tool or
reason identifiers.

For a known task, continue with `beatra.tasks.get`. If a task ID was lost,
paginate `beatra.tasks.list` with the matching capability and every returned
`next_cursor`, then verify candidates with `beatra.tasks.get`. `client_request_id`
is local-only and never exposed as a remote filter.

Replay the field-for-field identical JSON with the same `client_request_id`
only when task creation remains genuinely uncertain (if `request_in_progress`,
poll the active task instead). Any changed sample, text, name, model, or control
is new paid work requiring a new card and a new `client_request_id`. Never
automatically retry a failed or canceled task. On `insufficient_balance`, relay
the public message and exact `topup_url` / top-up URL verbatim, translate the
rest, and replay the frozen `client_request_id` only after the user says they
have topped up. If the refusal names another way forward, present it too and
follow [Billing, errors, and recovery](references/billing-errors-and-recovery.md).
Report actual task, model, voice, usage, billing (absent fields are unknown,
never zero), asset, and error fields without inventing unplayed audition
results.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- Before upload or consent attestation, read [Consent and sample readiness](references/consent-and-sample-readiness.md).
- For clone request JSON, live pricing, activation, deletion, polling, and recovery,
  read [Clone execution and recovery](references/clone-and-proof-workflow.md).
- For saved-voice reuse, Smart Voice Director, preflight, conversion, loudness normalization, and test-reading review,
  read [Test-reading review and voice reuse](references/review-recovery-and-voice-reuse.md).
- For shared parameter contracts across speech, cloning, dialogue, conversion, transcription, SFX, and audio processing,
  read [Speech, voices, cloning, and audio finishing](references/speech-and-audio.md).
- For account setup, read [Installation and authentication](references/installation-and-auth.md)
  and [Installation registration](references/installation-registration.md).
- For request transport problems, read [Bundled MCP Client diagnostics](references/mcp-connection.md).
- For task envelopes and billing facts, read [Tasks and results](references/tasks-and-results.md)
  and [Billing, errors, and recovery](references/billing-errors-and-recovery.md).
- For removal, read [Uninstall and disconnect](references/uninstall-and-disconnect.md).

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
