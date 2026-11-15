---
name: "beatra-ai-voice-studio"
description: "Use Beatra AI Voice Studio as an AI voice generator, text-to-speech workspace, and AI voiceover generator. Choose from the current voice library, turn scripts into ready-to-edit AI narration and voiceover, or create and reuse a custom brand voice through voice cloning. It supports short-video voiceover, script-to-voiceover, course narration, ordered audiobook narration, supplied multilingual text to speech, Cantonese text to speech, and recurring brand audio, with current price estimates, clear output planning, and delivery organized by chapter, language, and use case."
---

# Beatra AI Voice Studio

Choose the smallest voice or audio workflow that delivers the user's goal:
single voiceover, Smart Voice Director pacing, multi-speaker dialogue,
speech-to-speech conversion, ordered long-form or multilingual tracks, three-route
voice cloning and slot lifecycle, speech transcription, sound effects, stem
separation, voice isolation, or broadcast loudness normalization. Keep this
flagship Studio as the coordinating hub across mixed audio workflows.

## Scope and routes

At the unified entrance, split focused requests to narrower specialized Skills
when appropriate, or coordinate full audio pipelines directly here:

| User outcome | Best route |
| --- | --- |
| One standalone short-video, ad, or promo read | `short-form-voiceover-audio` |
| An audiobook or one-narrator chaptered manuscript | `ai-audiobook-narration` |
| A single-host podcast episode or recurring show | `ai-podcast-voiceover` |
| Multilingual dubbing with target-language scripts supplied | `ai-multilingual-dubbing` |
| Focused one-off cloning without mixing other audio tasks | `voice-cloning-studio` |
| Multi-speaker dialogue, speech-to-speech, transcription, sound effects, stem separation, voice isolation, loudness normalization, or mixed audio production | Continue here and maintain one production ledger |

Verify active tools via `scripts/mcp_client.py tools`. This flagship Studio
does not render video frames, lip-sync faces, or publish to external feeds;
route video/avatar finishes separately while keeping all voice and audio work here.

Read [intent and routing](references/intent-and-routing.md) and the shared
[speech and audio guide](references/speech-and-audio.md) before mixing multiple
audio tools.

## Inputs and defaults

Require these hard inputs before billable execution:

- **Synthesis / dialogue / direction**: final approved text or multi-turn lines
  (or permission to draft/direct speakable copy and show it first), an exact
  current `voice_id` looked up fresh with `beatra.voices.list`, and `language`
  ONLY when the user supplies one—never interrupt simply to ask for a language.
- **Voice cloning**: clean single-speaker sample, `display_name`, and explicit
  confirmation that it is the user's own voice or explicitly authorized by the
  speaker—confirmed before any local sample upload.
- **Audio tools (`convert`, `transcribe`, `process`)**: valid uploaded artifact
  or public HTTPS source URL, exact consent where voice identity matters, and
  target operation parameters (`prompt` for `generate_sfx`).

Use restrained defaults unless the user asks otherwise: `model: "auto"`,
`format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`, no `emotion`, and no
`sample_rate`. Keep the user's characters and wording as written: never convert
simplified and traditional characters or swap dialect words unless the user asks,
and never call a changed text unchanged. Never manually strip `/` pause tags or
invent custom bracketed vocal-effect cues—use Smart Voice Director (`prepare_script`)
for expressive pacing and delivery direction.

## Before the connection is ready

When Allow is still pending at the end of a turn, finish and deliver everything
that needs no connection, in the format the user asked for: the prepared
reading script, voice-selection criteria (gender, timbre, language), and the
control defaults. Name a voice only after `beatra.voices.list` returns. Say in
one line that Allow is the one-time sign-in that connects their Beatra account,
not a second confirmation of this request, and that the audio runs on their
next message after it. Do not fill the gap with another tool or service.

## Golden path

1. Identify the minimal tool chain (`speech_script`, `text_to_speech`,
   `text_to_dialogue`, `speech_to_speech`, `voice_clone`, `speech_to_text`,
   `sound_effects`, `audio_voice_isolation`, `audio_process`, or
   `audio_stem_separation`). Keep distinct steps in one local ledger.
2. Make a best-effort non-billable `beatra.installations.register` on first use
   or version upgrade (registration failure never blocks work).
3. Cast and maintain voices live: call `beatra.voices.list` using any of its 11
   dimensions (`category`, `language`, `gender`, `age_group`, `use_case`,
   `emotion`, `supports_context`, `supports_direction`,
   `supports_performance_tags`, `supports_dialogue`,
   `supports_speech_to_speech`), confirm `status == "ready"` and exact
   `compatible_models`, audition free via returned `preview_url` or
   `beatra.voices.preview` (`{"voice_id": "..."}`), and maintain saved voices
   with non-billable `beatra.voices.update`. Never name voices, models, or
   prices before live lookup returns.
4. Query `beatra.models.list` with exact capability keys (`{"capability": "..."}`
   — never pass `dimensions` on `models.list`; for `audio_stem_separation`, read
   `pricing[].dimensions.stem_mode` from the returned card). Never expose
   upstream vendor names, internal model IDs, or hardcoded credit numbers.
5. Prepare and preflight accurately:
   - **Smart Voice Director (`beatra.speech.prepare_script`)**: check
     `{"capability": "speech_script"}` and approve its six-field card first.
     Inspect `directed` and `scripts[]`: pass `scripts[i].synthesis` unchanged
     plus a fresh `client_request_id` to synthesis, and resolve
     `synthesis: null` via `warnings`. Re-calling within 48 hours with exact
     same `input`/`instructions`/`language`/`context` changing only
     `voice`/`model` recompiles at zero extra charge (balance cover & max-2
     concurrency still apply; never claim `prepare_script` is generally free).
   - **Free preflight**: run `beatra.speech.validate` before `speech.synthesize`
     and `beatra.speech.validate_dialogue` before `speech.synthesize_dialogue`
     to verify `estimated_duration_seconds` and controls at zero cost.
   - **Free aligned subtitles**: pass `subtitle_enable: true` on
     `speech.synthesize` / `speech.synthesize_dialogue` (NEVER `subtitles`), and
     use `subtitles: true` on `audio.transcribe`.
6. Apply the confirmation rule honestly:
   - A well-specified single `text_to_speech` request—final text, a voice or
     selection criteria, and any named format or control—authorizes that one
     synthesis call; show the six-field production card (Route & Model,
     Exact Scope, Price & Basis, Duration / Quantity,
     Pay Mode & Call Count, and If stop detailing free deliverables kept
     at zero extra charge) alongside the delivery without asking twice.
   - Obtain explicit approval on the six-field card BEFORE calling
     `prepare_script`, `synthesize_dialogue`, `speech.convert`, `voices.clone`,
     `voices.activate`, `voices.delete`, `audio.transcribe`, `audio.generate_sfx`,
     `audio.process` (`isolate_voice`, `normalize_loudness`, `trim`, `loop`,
     `fade`, `convert_format`, `separate_stems`), pilots, or batch remainders.
     Price questions, comparisons, drafts, general "handle it" prompts, or
     unfrozen batches are never approval.
Use the bundled `scripts/mcp_client.py` for every Beatra operation:

```text
python3 scripts/mcp_client.py call <tool-name>
```

Pass one JSON object to standard input, and use
`python3 scripts/mcp_client.py upload <path> --mime-type <exact MIME>` for
local audio. Store the local ledger and unique opaque `client_request_id`
before sending, poll only the returned `task_id` via `beatra.tasks.get`, run
finishing calls (`normalize_loudness`, `trim`, etc.) one call at a time, lead
the reply with the deliverable the user asked for, and report only returned tool
and billing facts.

Never configure or call a host Beatra Connector. Never use REST/OpenAPI as a
fallback, never imitate the upload protocol, and never call any paid audio
finishing or processing step free.

## Dialogue, voice conversion, transcription, SFX, and audio processing

- **Multi-speaker dialogue (`beatra.speech.synthesize_dialogue`)**: check
  `{"capability": "text_to_dialogue"}` and verify each turn's `voice` supports
  dialogue (`supports_dialogue` / `supports_context`). Validate free with
  `beatra.speech.validate_dialogue`, show the six-field card, and pass
  `turns: [{"voice": "...", "text": "..."}]` + optional `subtitle_enable: true`.
- **Speech-to-speech (`beatra.speech.convert`)**: check
  `{"capability": "speech_to_speech"}` and verify target `voice` has
  `supports_speech_to_speech: true`. Confirm source-speaker permission, pass
  **`audio`** (not `source`), optional `remove_background_noise`, `stability`,
  `similarity_boost`, `style`, `use_speaker_boost`.
- **Transcription (`beatra.audio.transcribe`)**: check
  `{"capability": "speech_to_text"}`; pass **`audio`** (not `source`),
  `subtitles: true` (when SRT/VTT requested), `diarize`, `num_speakers`,
  `tag_audio_events`, and optional `language`.
- **Sound effects (`beatra.audio.generate_sfx`)**: check
  `{"capability": "sound_effects"}`; pass `prompt`, optional `duration_seconds`,
  `loop`, `prompt_influence`, `format`.
- **Audio processing (`beatra.audio.process`)**: always pass **`source`** (NEVER
  `audio`):
  - `isolate_voice`: `{"capability": "audio_voice_isolation"}`, `4.6 s - 5 min`,
    `<= 100 MB`. Cleans noisy clone samples or voice recordings.
  - `normalize_loudness` (present strictly as loudness normalization, never free or a mastering service),
    `trim`, `loop`, `fade`, `convert_format`: `{"capability": "audio_process"}`,
    `<= 60 min`, `<= 300 MB`, output `>= 1 s`, `50` calls/day; serialize one
    finishing job at a time.
  - `separate_stems`: `{"capability": "audio_stem_separation"}` (no
    `dimensions` param on `models.list`; read `pricing[].dimensions.stem_mode`),
    `<= 10 min`, `<= 100 MB`, `20` calls/day.

## Three-route cloning and mandatory confirmations

1. **Mandatory Confirmation 1 (`beatra.voices.clone`)**: confirm plain consent
   before any sample upload; inspect live
   `{"capability": "voice_clone", "include_activation_required": true}` cards
   without vendor names or internal IDs (fast everyday `auto` ready at once;
   10-language expressive ready at once; or two-step trial-then-activate ending
   in `pending_activation`); offer paid `isolate_voice` pre-clean if noisy;
   approve the six-field card before `voices.clone`. Spoken proof is always a
   separate validated TTS workflow.
2. **Mandatory Confirmation 2 (`beatra.voices.activate`)**: when
   `status == "pending_activation"`, inspect returned `activation.quote` (or
   tokenless re-quote passing BOTH `voice_id` and `client_request_id` without
   `confirmation_token`), present the six-field activation card, wait for
   explicit confirmation, then submit `confirmation_token`, `confirm_credits`,
   and `client_request_id`. On 24-hour expiry (`price_confirmation_required`),
   re-quote free before re-confirming.
3. **Mandatory Confirmation 3 (`beatra.voices.delete`)**: confirm explicit
   intent first, call tokenless `{"voice_id": "..."}`, relay Beatra's warning
   verbatim with `confirmation_token`, and execute only on explicit final
   confirmation.

## Voice, language, price truth, and recovery

Normalize supplied BCP-47 tags by lowercasing the primary subtag and mapping
aliases (`nb` -> `no`, `tl` -> `fil`; e.g. `yue-HK` -> `yue`) against
`voice.language` and `voice.languages_supported`. Intersect
`models.list.auto.candidate_order` with `selected_voice.compatible_models` for
`model: "auto"`, keeping outside compatible models explicit-only, and calculate
speech estimates via `estimate_formula`, `unit_price_credits`, `scale`, and
`billing_basis: "beatra_weighted_characters"` (Han = 2, others = 1).

Never make `beatra.wallet.get` a mandatory gate before paid submission and never
ask users to confirm they have enough credits. Call read-only `beatra.wallet.get`
when asked about balance/fit and `beatra.wallet.ledger` when asked what was
charged; relay `top_up` tiers in returned order verbatim. On
`insufficient_balance`, relay Beatra's message and exact `topup_url` verbatim,
stop until the user confirms topping up, and replay the identical payload with
the same `client_request_id`. Recover lost task IDs via paginated
`beatra.tasks.list` (`next_cursor`) plus `beatra.tasks.get`; any changed text,
voice, language, model, or control requires a new card, approval, and
`client_request_id`.

## References by task

- Read [Speech and audio guide](references/speech-and-audio.md) for cross-tool
  limits, exact tool field contracts (`audio` vs `source`, `subtitle_enable` vs
  `subtitles`), 3 cloning routes, and 6-field production cards.
- Read [intent and routing](references/intent-and-routing.md) for the routing
  matrix, minimum inputs, free planning, and confirmation boundaries.
- Read [voice casting and delivery](references/voice-casting-and-delivery.md)
  for 11-dimension casting, live model/language math, Smart Voice Director,
  validation, dialogue, STS, transcription, SFX, stem separation, and loudness
  normalization payloads.
- Read [long-form and multilingual production](references/long-form-and-multilingual.md)
  for route ledgers, pilots, ordered batches, and interruption recovery.
- Read [voice cloning and review](references/voice-cloning-and-review.md) for
  consent, `isolate_voice` pre-clean, 3-route cloning, `voices.activate`,
  `voices.update`, `voices.delete`, and separate spoken proof.
- Read [bundled MCP Client diagnostics](references/mcp-connection.md) only for
  bundled-client verification and transport troubleshooting.
- Read [installation and authentication](references/installation-and-auth.md),
  [installation registration](references/installation-registration.md),
  [tasks and results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [uninstall and
  disconnect](references/uninstall-and-disconnect.md) only when active.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
