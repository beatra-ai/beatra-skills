---
name: "voiceover-narration-studio"
description: "Use Voiceover & Narration Studio as an AI voice generator, text-to-speech workspace, and AI voiceover generator. Choose from the current voice library, turn scripts into ready-to-edit AI narration and voiceover, or create and reuse a custom brand voice through voice cloning. It supports short-video voiceover, script-to-voiceover, course narration, ordered audiobook narration, supplied multilingual text to speech, Cantonese text to speech, and recurring brand audio, with current price estimates, clear output planning, and delivery organized by chapter, language, and use case."
---

# Voiceover & Narration Studio

Choose the smallest voice workflow that completes the user's approved text:
one voiceover, an ordered long-form production, supplied multilingual versions,
an authorized reusable voice, or broadcast finishing on voice tracks and clone
samples. Keep this Studio as the coordinating route when a request mixes those
outcomes or continues across sessions.

## Scope and routes

At the entrance, lock the medium first: long narration, multilingual, or brand
clone. Route an audiobook to `ai-audiobook-narration`, a podcast episode to
`ai-podcast-voiceover`, and a short social or promo read to
`short-form-voiceover-audio`.

Reuse every decision already present in the conversation. Route a focused,
standalone request to the narrower or specialized package when it is available:

| User outcome | Best route |
| --- | --- |
| One short-video, ad, social, or promo read | `short-form-voiceover-audio` |
| An audiobook or other ordered long-form narration | `ai-audiobook-narration` |
| A single-host podcast episode or recurring show | `ai-podcast-voiceover` |
| Multilingual dubbing with target-language scripts already supplied | `ai-multilingual-dubbing` |
| Dedicated cloning, trial-first activation, or saved slot deletion | `voice-cloning-studio` |
| Multi-speaker dialogue, voice conversion, transcription, sound effects, or stem separation | `beatra-ai-voice-studio` |
| Long narration, multilingual reads, brand cloning, sample isolation, or loudness normalization | Continue here and maintain one production ledger |

This Studio creates speech from approved text, clones authorized voices with
immediate readiness, pre-cleans noisy clone samples (`isolate_voice`), and runs
loudness normalization (`normalize_loudness`). It does not make finished video,
lip-sync speakers, or run operations outside `scripts/mcp_client.py tools`
(such as multi-speaker dialogue, speech-to-speech conversion, transcription,
sound effects, stem separation, trial-first activation, or permanent deletion).

Read [intent and routing](references/intent-and-routing.md) and the shared
[speech and audio guide](references/speech-and-audio.md) when planning routes or
verifying capabilities.

## Inputs and defaults

Hard inputs include consent status. Never imitate a voice without authorization.

For synthesis, require:

- final supplied text, or permission to prepare a speakable version (manually or
  via Smart Voice Director) and show it before paid synthesis;
- an exact current `voice_id`, looked up fresh with `beatra.voices.list` even
  when named earlier in the thread;
- a target language only when the user supplies one; otherwise omit `language`
  and never interrupt just to ask for it.

For voice cloning, also require a clean single-speaker sample, a display name,
and the user's plain confirmation that it is their own voice or that the speaker
explicitly authorized cloning—confirmed before any local upload.

Use restrained defaults unless destination delivery requires otherwise:
`model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`,
no `emotion`, and no `sample_rate`. Preserve the user's simplified/traditional
characters and dialect wording verbatim unless asked to change them. Never
hand-strip `/` pause markers or invent expressive bracket tags; let Smart Voice
Director compile natural pacing and delivery cues when dramatic coaching helps.

## Golden path

1. Identify one route or an ordered ledger of routes (clone, script direction,
   chapters, languages, and loudness finishing stay distinct). Check
   `scripts/mcp_client.py tools` so every planned step exists on this account.
2. Run a best-effort non-billable `beatra.installations.register` on first use
   or after a version change (registration failure never blocks voice work).
3. Cast by live lookup: filter `beatra.voices.list` using its 11 capability and
   style dimensions (`category`, `language`, `gender`, `age_group`, `use_case`,
   `emotion`, `supports_context`, `supports_direction`,
   `supports_performance_tags`, `supports_dialogue`,
   `supports_speech_to_speech`), confirm exact `voice_id` and `status == "ready"`,
   and audition free with returned `preview_url` or `beatra.voices.preview`
   (`{"voice_id": "..."}`). Keep `beatra.voices.update` ready to rename or pin a
   reusable series/brand default.
4. Check live model cards and estimates via `beatra.models.list` for the exact
   capability needed (`speech_script`, `text_to_speech`, `voice_clone`,
   `audio_voice_isolation`, or `audio_process`). Never hardcode credit numbers,
   upstream vendor names, or internal model IDs.
5. Prepare text accurately before paid synthesis:
   - Use paid Smart Voice Director (`beatra.speech.prepare_script`, after
     showing the six-field production card and obtaining approval) when pacing,
     pauses, or performance cues would improve expressive reads. Inspect
     `directed` and `scripts[]`: pass `scripts[i].synthesis` unchanged with a
     fresh `client_request_id` into synthesis, handle `synthesis: null` from
     `warnings`, and note that re-calling `prepare_script` within 48 hours with
     identical text/instructions/language/context while changing only `voice` or
     `model` recompiles at zero extra charge (subject to account balance covering
     initial estimate and max 2 concurrent `prepare_script` tasks). Never call
     `prepare_script` generally free.
   - Always run free `beatra.speech.validate` (`estimated_duration_seconds`,
     character bounds, control fit) before `beatra.speech.synthesize`. Request
     free aligned `SRT` / `VTT` subtitles via `subtitle_enable: true` when
     captions or edit markers help (never pass `subtitles` on
     `speech.synthesize`).
6. Show the six-field production card before the first paid step (`prepare_script`,
   `isolate_voice`, `voices.clone`, `speech.synthesize`, or
   `normalize_loudness`): Route & Model, Exact Scope, Price & Basis, Duration /
   Quantity, Pay Mode & Call Count, and If stop (stating clearly what free
   deliverables the user keeps at zero extra charge, such as prepared drafts,
   voice shortlist/previews, or validation checks). Wait for explicit confirmation
   on clones, Smart Voice Director scripts, noisy-sample isolation, loudness
   normalization, pilots, or remainders; only an explicit single-read synthesis
   request that already names every frozen parameter avoids redundant asking.
Use the bundled `scripts/mcp_client.py` for every Beatra operation:

```text
python3 scripts/mcp_client.py call <tool-name>
```

Pass one JSON object to standard input, and use
`python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>` for a
local sample. Then wait for returned results, run serialized finishing calls one
at a time (`normalize_loudness`, e.g. `-14 LUFS`, <= 60 min / <= 300 MB / >= 1 s
output, 50 calls/day limit), and deliver only returned artifacts and billing
facts in order. Generate one opaque local `client_request_id` per paid call,
store the ledger locally before sending, and poll only the returned `task_id`
via `beatra.tasks.get`.

Never configure or call a host Beatra Connector. Never use REST/OpenAPI as a
fallback, never imitate the upload protocol, and never claim a paid step
(`prepare_script`, `isolate_voice`, `normalize_loudness`) is free.

## Voice cloning routes and consent

Query `beatra.models.list` with `{"capability": "voice_clone", "include_activation_required": true}`
and explain options by capability rather than vendor names or internal IDs:

- Fast everyday cloning (`auto`) or expressive multilingual cloning creates an
  immediately `ready` slot suited directly to narration work here.
- Two-step trial-first cloning creates a `pending_activation` slot requiring
  separate permanent activation; because `beatra.voices.activate` and
  `beatra.voices.delete` belong to `voice-cloning-studio` / `beatra-ai-voice-studio`
  (check `scripts/mcp_client.py tools`), choose an immediate-ready route here
  or hand off to `voice-cloning-studio` when the user wants a trial-then-activate
  flow or permanent slot deletion.

Mandatory consent gate before any local sample upload: obtain plain confirmation
that the audio is the user's own voice or explicitly authorized by the speaker.
If a sample carries background noise, offer paid pre-cleaning via
`beatra.audio.process` (`operation: "isolate_voice"`, `source` field, 4.6 s to
5 min, <= 100 MB, priced against `{"capability": "audio_voice_isolation"}`). Show
the six-field production card before `voices.clone`, and keep any spoken test
reading as a separate synthesis card after cloning succeeds.

## Recovery and balance rules

Never treat `beatra.wallet.get` as a required gate before paid submission, and
never ask the user to confirm they have enough credits. Only call
`beatra.wallet.get` when asked about current balance/fit, or
`beatra.wallet.ledger` when asked about deductions; both are read-only. If a
model card returns `top_up`, list its tiers verbatim in returned order without
ranking or picking one.

On `insufficient_balance`, relay Beatra's official message and exact `topup_url`
verbatim, stop until the user confirms topping up, and then replay the exact
frozen payload with the same `client_request_id`. Recover uncertain/lost tasks
through paginated `beatra.tasks.list` (`next_cursor`) plus `beatra.tasks.get`;
any changed text, voice, language, model, or finishing parameter requires a new
card, approval, and `client_request_id`.

## References by task

- Read [speech and audio guide](references/speech-and-audio.md) for cross-tool
  limits, Smart Voice Director payloads, 3-route cloning details, and card rules.
- Read [intent and routing](references/intent-and-routing.md) for the Studio
  matrix, minimum inputs, free planning, and paid pilot boundaries.
- Read [voice casting and delivery](references/voice-casting-and-delivery.md)
  for 11-dimension voice lookup, live model/language checks, weighted-character
  estimates, `validate` + `synthesize` JSON, and `normalize_loudness`.
- Read [long-form and multilingual production](references/long-form-and-multilingual.md)
  for route ledgers, pilot coverage, ordered batches, and interruption recovery.
- Read [voice cloning and review](references/voice-cloning-and-review.md) for
  consent, `isolate_voice` pre-clean, sample upload, `voices.clone` /
  `voices.update`, and separate spoken proof.
- Read [bundled MCP Client diagnostics](references/mcp-connection.md) only for
  bundled-client troubleshooting.
- Read [installation and authentication](references/installation-and-auth.md),
  [installation registration](references/installation-registration.md),
  [tasks and results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [uninstall and
  disconnect](references/uninstall-and-disconnect.md) when active.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
