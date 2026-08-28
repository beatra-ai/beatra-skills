---
name: "beatra-ai-voice-studio"
description: "Use Beatra AI Voice Studio as an AI voice generator, text-to-speech workspace, and AI voiceover generator. Choose from the current voice library, turn scripts into ready-to-edit AI narration and voiceover, or create and reuse a custom brand voice through voice cloning. It supports short-video voiceover, script-to-voiceover, course narration, ordered audiobook narration, supplied multilingual text to speech, Cantonese text to speech, and recurring brand audio, with current price estimates, clear output planning, and delivery organized by chapter, language, and use case."
---

# Beatra AI Voice Studio

Choose the smallest voice workflow that completes the user's approved text:
one voiceover, an ordered long-form production, supplied multilingual versions,
or an authorized reusable voice. Keep this Studio as the coordinating route
when a request mixes those outcomes or will continue across several sessions.

## Scope and routes

At the unified entrance, split first to audiobook, podcast, short voiceover,
clone, or multilingual. This package only handles voice selection and scenes
those focused packages do not cover.

Reuse every decision already present in the conversation. Route a focused,
standalone request to the narrower package when it is available:

| User outcome | Best route |
| --- | --- |
| One short-video, ad, social, or promo read | `short-form-voiceover-audio` |
| An audiobook or other ordered long-form narration | `ai-audiobook-narration` |
| A single-host podcast episode or recurring show | `ai-podcast-voiceover` |
| Multilingual dubbing with the target-language scripts already supplied and approved | `ai-multilingual-dubbing` |
| Creation of one authorized reusable voice | `voice-cloning-studio` |
| Voice selection, mixed work, or a scene those routes do not cover | Continue here and maintain one production ledger |

This Studio creates speech from supplied or approved text. It does not make a
finished video, lip-sync a speaker, publish media, transcribe a recording, or
edit an existing waveform. Preserve the useful voice subtask and route those
adjacent outcomes to their focused workflows.

Read [intent and routing](references/intent-and-routing.md) when deciding
between a focused package and a mixed Studio project.

## Inputs and defaults

For synthesis, the hard inputs are:

- final supplied text, or permission to prepare a speakable version and show
  it for approval;
- an exact current `voice_id`, looked up again with `beatra.voices.list`
  whether it came from the user, the conversation, or a new recommendation;
- the target language only when the user specifies one; otherwise omit
  `language` and do not interrupt merely to ask for it.

For voice cloning, also require a sample, a display name, and the user's plain
confirmation that it is their own voice or that the speaker explicitly
authorized cloning. Consent must be confirmed before a local sample is
uploaded.

Use restrained defaults when the destination does not require another choice:
`model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`,
`pitch: 0`, no `emotion`, and no `sample_rate`. Prepare numbers, names,
abbreviations, units, and pauses for speech, but show any material rewrite
before paid work.

## Golden path

1. Identify one route or an ordered set of routes. For mixed work, keep
   clone, language, chapter, and revision steps distinct in the ledger.
2. Make a best-effort non-billable installation registration on first use or
   after the package version changes. Registration failure never blocks the
   user's voice work.
3. Call `beatra.voices.list` even when a voice ID was supplied earlier. Match
   the opaque ID exactly and save its current `status`, `language`,
   `languages_supported`, and `compatible_models`. If it is absent or not
   `ready`, do not submit; select another current ready voice or stop. When a
   voice still needs to be chosen, recommend only current ready candidates.
   A `preview_url` is an optional free aid only when the returned voice actually
   has one; never synthesize a paid audition.
4. Freeze that exact current `voice_id` and its saved compatibility facts. Call
   `beatra.models.list` for `text_to_speech` before comparing models,
   validating a requested language, or estimating price.
5. Prepare an exact production card: approved text or pilot text, voice ID,
   language when supplied, controls, weighted-character count, current model
   choice, estimate, paid-call count, delivery order, and review target.
6. Obtain approval for that card, create one new opaque local
   `client_request_id` per logical paid request, submit each request once,
   and poll only its returned task.
7. Deliver actual artifacts and facts in ledger order. A changed text, voice,
   model, language, or control is new paid work with a new card, approval, and
   request identity.

Use the bundled `scripts/mcp_client.py` for every Beatra operation:

```text
python3 scripts/mcp_client.py call <tool-name>
```

Pass one JSON object to standard input. Use
`python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>` for a
local sample. Never configure or call a host Beatra Connector. Never use
REST/OpenAPI as a fallback, and never imitate the upload protocol.

## Voice, language, and price truth

Validate a supplied language as a BCP-47 tag before using it. Lowercase its
primary tag, map the documented aliases `nb` to `no` and `tl` to `fil`, and
apply the same normalization to catalog values; for example, `yue-HK` becomes
`yue`. The current voice supports the target only when either `voice.language`
or one entry in `voice.languages_supported` has the same normalized primary
tag.

For `model: "auto"`, derive the live possible model set as:

```text
models.list.auto.candidate_order ∩ selected_voice.compatible_models
```

preserving candidate order and keeping only live available cards. Separately
build the explicit pool from every live card in the exact current voice's
`compatible_models`; a compatible card outside `candidate_order` is
explicit-only and never enters the auto set. When the user supplied a language,
check its normalized primary tag against `constraints.supported_languages` on
every auto candidate. Keep `auto` only when every candidate supports it. If the
auto set is empty or any candidate fails, propose one language-compatible card
from the explicit pool and obtain approval. Without a supplied language, keep a
nonempty auto set; if it is empty, propose one card from the explicit pool. If
no applicable explicit card exists, offer another current voice, a user-chosen
supported language when relevant, or no submission. Language is not a hidden
auto-selection input.

Speech is estimated from each applicable live card's `estimate_formula`,
`unit_price_credits`, `scale`, and
`billing_basis: "beatra_weighted_characters"`. Each Han ideograph counts as
2 and every other character as 1. Quote one exact estimate when the frozen
explicit model—or every possible auto model—has the same result; otherwise
quote the live range. Never invent an auto-resolved model or use remembered
prices.

Read [voice casting and delivery](references/voice-casting-and-delivery.md)
for exact model, language, pricing, request, and output handling.

## Pilots and paid confirmation

Planning, script preparation, voice listing, preview links, model listing, and
estimates are non-billable. `beatra.speech.synthesize` and
`beatra.voices.clone` are billable.

- A single approved script uses one approved synthesis card.
- Long-form work uses one supplied and approved pilot passage before the
  separately approved remainder.
- Multilingual work uses one supplied and approved pilot for every distinct
  voice/language/model route before a separately approved remainder.
- A clone is one paid operation. Before any `client_request_id` or
  `beatra.voices.clone` call, show the clone admission card: route
  `voice_clone`, tool `beatra.voices.clone`, live `beatra.models.list` price
  for one successful activated voice, the provisional estimate, the fact that
  the 600-credit signup gift usually cannot start this clone, the exact URL
  `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not
  recommend ¥198. Do not create `client_request_id` or submit until the user
  confirms they have topped up or already have enough credits for this
  estimate. Do not offer a free clone or a free sample that replaces the
  clone. On `insufficient_balance`, relay the returned public message, keep
  the URL exact, translate the rest, and retry the same frozen
  `client_request_id` only after the user says they have topped up. Any spoken
  proof is a separate synthesis operation with its own approved text, card,
  approval, and request identity.

A current explicit “generate” or “make it” instruction is approval when it
fully covers the frozen card. Do not ask for redundant confirmation in that
case. Price-only, comparison, preparation, general permission to “handle it,”
and an unfrozen batch or variant set are not approval. Cancellation is
requested only when the user asks; a conflict or unconfirmed remote stop means
continue polling the same task.

Read [long-form and multilingual
production](references/long-form-and-multilingual.md) before any ordered batch,
and [voice cloning and review](references/voice-cloning-and-review.md) before
sample upload or clone submission.

## Execution, recovery, and delivery

Store locally, before submission, the route, exact JSON, production-card
approval, `client_request_id`, and later `task_id`. The request identity is a
local recovery key; `tasks.list` and `tasks.get` do not filter by or return it.

If a response or task ID is lost, call `beatra.tasks.list` with the relevant
capability and follow every `next_cursor` needed to cover the time window.
Verify plausible candidates with `beatra.tasks.get` using returned task facts.
Do not submit while a matching task may be queued or running. Reuse the same
request identity only for a field-for-field identical replay after task
creation remains genuinely uncertain; any changed field needs new approval
and a new identity. A slow, failed, canceled, authorization, or update result
does not authorize an automatic replacement.

For successful speech, report only returned facts: `type`, `model`,
`voice_id`, `audio.url`, `audio.artifact_id`,
`audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`, optional
`audio.sample_rate`, `characters`, optional `subtitles`, task status,
resolved model, and billing when present. For a successful clone, preserve the
exact four-field output: `type`, `voice_id`, `status`, and `display_name`.
Never claim listening, synchronization, publication, accuracy, durability,
deletion, or a refund that the returned result does not establish.

Deliver long-form and multilingual results in the approved route, language,
and segment order. Keep accepted audio unchanged. A correction re-synthesizes
only an explicitly approved affected segment.

## References by task

- Read [intent and routing](references/intent-and-routing.md) for the Studio
  matrix, minimum inputs, free planning, and paid pilot boundaries.
- Read [voice casting and delivery](references/voice-casting-and-delivery.md)
  for exact voice identity, live model/language checks, price math, synthesis
  JSON, and result review.
- Read [long-form and multilingual
  production](references/long-form-and-multilingual.md) for route ledgers,
  pilot coverage, ordered batches, and interruption recovery.
- Read [voice cloning and review](references/voice-cloning-and-review.md) for
  consent, sample transport, clone JSON, exact output, and optional proof.
- Read [bundled MCP Client diagnostics](references/mcp-connection.md) only for
  bundled-client verification and transport troubleshooting.
- Read [installation and authentication](references/installation-and-auth.md),
  [installation registration](references/installation-registration.md),
  [tasks and results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [uninstall and
  disconnect](references/uninstall-and-disconnect.md) only when that
  operational branch is active.

## Runtime and safe automatic updates

Before ordinary Beatra commands, the bundled client silently checks at most
once every 24 hours for a newer release in this installation's fixed official
channel and locale. When a newer release is available, the client installs it
automatically without separate confirmation. It accepts only the fixed official
discovery address and immutable Beatra CDN sources, verifies discovery,
manifest, archive, and every file by identity,
size, and SHA-256, and replaces only files owned by this package. Replacement
uses locking, staging, backup, recovery, and rollback, with the updater itself
replaced last.

It rejects redirects, downgrades, a different package, and content for a
different channel or locale.

If an update, verification, download, rollback, or recovery step fails, the
installation remains usable and the original command continues. It never
authorizes a paid retry. The setting persists per installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Read [automatic updates and
safety](references/automatic-updates-and-safety.md) for the complete updater
contract and the immediate verified-update command.
