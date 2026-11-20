---
name: "voice-clone-series-studio"
description: "Clone one voice you own and keep using it for a series of episodes, updates, and lessons. This voice cloning and AI voice clone studio for series narration creates a reusable AI voice, custom AI voice, and brand voice clone from a clean sample, then turns each new script into narration in that same voice so a podcast, course, or creator series stays consistent. Use it to clone my voice, build a podcast voice clone, and generate the next episode voiceover or recurring voiceover without recasting."
---

# Voice Clone Series Studio

Create one authorized reusable voice (or freeze an existing voice), manage its
metadata and lifecycle safely, and synthesize every recurring episode at steady
broadcast loudness in that same voice. The clone is the setup. The series
ledger is the product.

## Scope and adjacent routes

Use this Skill when the user wants their own voice—or an authorized brand
voice—reused across a podcast, course, creator series, or recurring update. Check
`scripts/mcp_client.py tools` so active tools match the request.

Route a one-off clone with no series plan to `voice-cloning-studio`. Route a
whole book or one-narrator manuscript to `ai-audiobook-narration`. Route a
lecture pack without a clone to `course-narration-studio`. Route multi-character
dialogue, voice conversion, transcription, SFX, or stem separation to
`beatra-ai-voice-studio`. Route a talking-head video to
`founder-ip-avatar-studio` or `talking-avatar-video`.

## Inputs and defaults

The hard inputs are:

- a clean single-speaker sample, or an already ready `voice_id`;
- explicit consent that this is the user's voice or that the speaker explicitly
  authorized cloning (access to a file or URL is never consent, and consent must
  precede any local file upload);
- the first or next episode script, or permission to prepare a speakable version
  and show it before paid work.

Check live `voice_clone` constraints from `beatra.models.list`. Use restrained defaults
(`model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`),
preserve original simplified/traditional characters and dialect wording, and
never hand-strip `/` markers or invent custom bracketed vocal-effect tags. Reuse the saved
`display_name`, `language`, series name, and pronunciation glossary across episodes.

A short spoken test reading after cloning is always separate paid work with its
own production card and `client_request_id`—never part of clone approval.

## Golden path

1. **Freeze or establish the series voice**:
   - If a `voice_id` is already pinned for the series, verify its current `status`
     and `compatible_models` via `beatra.voices.list` (`category`, `language`,
     `gender`, `age_group`, `use_case`, `emotion`, `supports_context`,
     `supports_direction`, `supports_performance_tags`, `supports_dialogue`,
     `supports_speech_to_speech`) and audition free with `preview_url` or
     `beatra.voices.preview` (`{"voice_id": "..."}`) before jumping to episodes.
   - Never pass a display name in `voice`. If retiring an older series voice, run
     **Mandatory Confirmation 3 (`beatra.voices.delete`)**: confirm explicit user
     intent, request a tokenless check with `voice_id`, relay the warning verbatim
     with `confirmation_token`, and only submit the permanent deletion after
     explicit confirmation.
2. **Pre-clean noisy samples & select the clone model** (when creating a new
   series clone):
   - Confirm explicit speaker consent BEFORE uploading via
     `python3 scripts/mcp_client.py upload ./voice-sample.wav --mime-type audio/wav`.
   - If background noise or music hurts clarity, offer paid pre-clean using
     `beatra.audio.process` (`operation: "isolate_voice"`, `source` field,
     4.6 s–5 min, <= 100 MB), priced live from
     `beatra.models.list` (`{"capability": "audio_voice_isolation"}`) on its own
     six-field production card before calling `isolate_voice`.
   - Select the clone model as described in
     [Speech and audio guide](references/speech-and-audio.md) §5. Never name
     vendors or internal IDs.
   - Show the six-field production card (Route & Model, Exact Scope,
     Price & Basis, Duration / Quantity, Pay Mode & Call Count, and If stop
     naming free assets kept at zero extra charge) with the live clone price
     before creating a clone `client_request_id` or calling
     `beatra.voices.clone` (**Mandatory Confirmation 1**). Never hardcode credit
     numbers and never ask the user to confirm they have enough credits. Offer the
     free clone preview only when the user asks to hear the voice before paying, or
     when a paid clone is refused and the refusal offers it.
3. **Activate a pending clone & pin series defaults**:
   - After the user approves the card, submit `beatra.voices.clone` once with
     `consent_attested: true`, handle any refusal per
     [Billing, errors, and recovery](references/billing-errors-and-recovery.md),
     and poll `beatra.tasks.get`. If `status == "ready"`, move on.
   - When a clone result or a listed voice has status `pending_activation`
     (**Mandatory Confirmation 2**), follow §5 Step E of
     [Speech and audio guide](references/speech-and-audio.md) before using the
     voice.
   - Once ready, use non-billable `beatra.voices.update` (`voice_id`,
     `display_name`, `persona`, `use_case`, `make_default: true`) so future
     episodes stay pinned to this host voice cleanly.
4. **Prepare and validate each episode**:
   - When pacing, dramatic breaks, or breath nuance matter across an episode,
     offer paid Smart Voice Director (`beatra.speech.prepare_script`) checked
     against `{"capability": "speech_script"}`. Inspect `directed` and
     `scripts[]`, handle `synthesis: null` from `warnings`, and pass
     `scripts[i].synthesis` unchanged + fresh `client_request_id` into
     synthesis. Re-calling `prepare_script` within 48 hours with identical
     text/instructions/language/context while changing only `voice`/`model`
     recompiles at zero extra charge (initial balance check and max-2
     concurrency limit still apply; never call `prepare_script` generally free).
   - Check live `text_to_speech` pricing from `beatra.models.list`
     (`beatra_weighted_characters`: Han = 2, others = 1) and run free
     `beatra.speech.validate` (`estimated_duration_seconds`, control fit) on
     every episode block before paying.
5. **Synthesize, normalize loudness, and deliver in episode order**:
   - Show the episode's six-field production card and obtain explicit approval.
   - Call `beatra.speech.synthesize` once per block (pass `subtitle_enable: true`
     for free aligned `SRT`/`VTT` captions; never pass `subtitles`), polling only
     its returned `task_id`.
   - When the series keeps a consistent podcast/course target level (e.g.
     `-14 LUFS`), inspect `{"capability": "audio_process"}`, approve its
     six-field finishing card, and run serialized `beatra.audio.process`
     (`operation: "normalize_loudness"`, `source` field, <= 60 min / <= 300 MB /
     >= 1 s output, 50/day limit) one episode track at a time. Never claim
     finishing is free or present it as a mastering service.
   - Deliver labeled episode audio, duration, subtitles when requested, and
     actual `billing.net_charged_credits`. Store every task ID in the local
     episode ledger; reuse the pinned `voice_id` for subsequent episodes.

Use the bundled `scripts/mcp_client.py` for every Beatra operation. Never
configure or call a host Beatra Connector. Never use REST/OpenAPI as a fallback.

## Decisions that require confirmation

Speaker consent + six-field card for `voices.clone`, the live activation price
for `voices.activate`, two-step `voices.delete` token, Smart Voice Director
`prepare_script` cards, noisy sample `isolate_voice` cards, episode synthesis
block lists, and `normalize_loudness` finishing cards all require explicit
approval. Any changed sample, voice, text, model, or target LUFS is new paid
work with a new card and `client_request_id`.

## Recovery and account balance

Never make `beatra.wallet.get` a mandatory gate before submit, and never ask the
user to confirm they have enough credits. Only call `beatra.wallet.get` when
asked about balance/fit, and `beatra.wallet.ledger` when asked what was charged
(both are read-only). When `models.list` carries a `top_up` block, relay tiers
verbatim in returned order without ranking or picking one.

On `insufficient_balance`, relay Beatra's official message and exact `topup_url`
verbatim, pause until the user says they have topped up, and replay the exact
frozen payload with the same `client_request_id`. If the refusal names another
way forward, present it too and follow
[Billing, errors, and recovery](references/billing-errors-and-recovery.md).
Recover lost tasks through paginated `beatra.tasks.list` (`next_cursor`) plus
`beatra.tasks.get`; never resubmit a changed payload under an old
`client_request_id`.

## References by task

- Read [Speech and audio guide](references/speech-and-audio.md) for cross-tool
  limits, clone model choice, Smart Voice Director, and mandatory confirmations.
- Read [Series voice workflow](references/workflow.md) for series ledger fields,
  JSON payloads for `isolate_voice`, `voices.clone`, `voices.activate`,
  `prepare_script`, `validate`, `synthesize`, and `normalize_loudness`.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
