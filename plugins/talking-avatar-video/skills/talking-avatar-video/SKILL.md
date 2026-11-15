---
name: "talking-avatar-video"
description: "Create a talking avatar from one portrait and a short script or speech track. This AI presenter and digital human video workflow can prepare narration with a selected voice or use a supplied recording, then direct a stable talking-head clip with restrained expression, natural movement, clear delivery, and focused lip-sync review. Use it for AI spokesperson videos, product explainers, training, course lessons, announcements, onboarding, social talking-head content, and photo-to-talking-video messages, with narration-driven facial motion and a focused review of identity, clarity, lip sync, and motion stability."
---

# Talking Avatar Video

Use this Skill to produce one focused talking-avatar video clip from a portrait and either a script (converted to speech first) or a user-supplied voice recording.

## What you get

- A delivered talking-avatar MP4 clip anchored to the approved portrait and spoken track.
- When narration is synthesized through Beatra, **free aligned subtitle files** (`JSON`, `SRT`, and `VTT` from `output.subtitles`) plus exact `speech_start_seconds` and `speech_end_seconds` timing metadata.
- A brief pre-production plan (script pacing and clip-fit check) and a post-render quality check covering identity consistency, lip sync, clarity, and motion stability.

## Ways to run it

- **Portrait + script**: Prepare pacing with **Smart Voice Director** (`beatra.speech.prepare_script`, optional paid director step) if needed, audition voices free with `beatra.voices.preview`, preflight duration free with `beatra.speech.validate`, synthesize speech with free `SRT`/`VTT` subtitles (`beatra.speech.synthesize`), and animate the portrait (`beatra.videos.animate`).
- **Portrait + supplied recording**: Upload the user's approved audio (`beatra.assets.upload`), verify duration/format/size against live `image_to_video` limits before generating, then animate the portrait (`beatra.videos.animate`).

## Before the connection is ready

Use the bundled `scripts/mcp_client.py` for every Beatra call (using only tools listed by `scripts/mcp_client.py tools`). Do not configure or use a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Keep connection troubleshooting in [Bundled MCP Client diagnostics](references/mcp-connection.md), shared speech guides in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md), billing recovery in [Billing errors and recovery](references/billing-errors-and-recovery.md), and lifecycle controls in [uninstall and disconnect](references/uninstall-and-disconnect.md).

If authorization is still pending on first run, do not repeatedly invoke authentication in the same turn (at most twice per turn). Deliver what needs no Beatra connection first (script draft, pacing notes, shot framing advice) and wait for the customer to reply after approving access.

## Hard inputs and authorization gate

Collect and verify these before running any paid tool:

1. **Portrait asset**: One clean front-facing or slightly angled portrait/still frame, uploaded via `beatra.assets.upload` once authorized.
2. **Spoken source**: Either a short script (`script_text` plus delivery notes/language/tone) or a supplied clean single-speaker audio track (`speech_audio_ref`).
3. **Explicit rights confirmation**: Confirm the customer owns or holds verifiable authorization for both the portrait likeness and the voice/recording, and that the video is not for impersonation, fraud, deception, or unlawful use. Stop before paid synthesis or video generation if consent or required media is missing.

## Avatar Duration Critical Workflow

Follow this exact sequence so you never spend credits generating audio or video that exceeds avatar clip limits:

1. **Read live model limits and prices (`beatra.models.list`)**:
   - Inspect `{"capability": "image_to_video"}` first for supported models, per-clip `max_duration` / whole-second ceiling, `driving_audio` MIME/duration/size rules, and live credit rate.
   - Inspect `{"capability": "speech_script"}` if using Smart Voice Director, and `{"capability": "text_to_speech"}` for narration pricing.
2. **Discover and audition voices free (`beatra.voices.list` + `beatra.voices.preview`)**:
   - Browse presets (`beatra.voices.list` supports bilingual `search` and capability filters).
   - Call `beatra.voices.preview` free (no charge) to share `preview_url` so the customer can approve the voice before paid synthesis.
3. **Prepare pacing with Smart Voice Director (`beatra.speech.prepare_script`, PAID)**:
   - Optional when script needs pause planning, tonal beats, pronunciation cues, or expressive structure: call `beatra.speech.prepare_script` (`{"capability": "speech_script"}`, max **2 concurrent** tasks).
   - Inspect `directed` and `scripts[]` (`synthesis`, `summary`, `voice_selection`, `alternatives`, `estimate`, `warnings`). If `synthesis` is `null`, resolve `warnings` before proceeding; otherwise pass `scripts[].synthesis` unchanged (with a fresh `client_request_id`) when calling `beatra.speech.synthesize`.
   - Word fidelity: **Smart Voice Director** prepares pacing, pauses, and annotations without altering the customer's exact spoken wording; never hand-write braced performance tags in prompts or copy.
   - 48-hour reuse rule: to try another voice within 48 hours for identical text, instructions, language, and context, call `beatra.speech.prepare_script` again with the same arguments changing only `voice` (and `model` if needed) at no extra charge (balance must still cover the initial text estimate and concurrency cap). Never call fresh director runs free.
4. **Preflight duration free BEFORE paying (`beatra.speech.validate`)**:
   - Always call **`beatra.speech.validate`** (free, NO `client_request_id`) with the planned `voice`, prepared `input`, `model`, `format` (chosen to satisfy `image_to_video` `driving_audio` rules), and delivery controls.
   - Compare `estimated_duration_seconds` against the live `{"capability": "image_to_video"}` single-clip duration ceiling **before** calling paid `beatra.speech.synthesize` or `beatra.videos.animate`.
   - If `estimated_duration_seconds` exceeds the clip ceiling or `warnings` flag pacing issues, trim or tighten the script and re-run free `beatra.speech.validate` until it fits cleanly.
5. **Confirm the 6-field production card before the first paid step**:
   - Present all six fields concisely using live `beatra.models.list` / `beatra.speech.validate` figures (keep `beatra.wallet.get` and `beatra.wallet.ledger` as optional read-only tools when the user asks about balance or charges — never make `wallet.get` a mandatory gate before submit or ask the user to confirm they have enough credits):
     - **Work**: Capability chain (e.g., Smart Voice Director if run, TTS narration, talking-avatar video clip), selected voice/model, format, and expected duration.
     - **Credits**: Live quoted credits from `beatra.models.list` / `beatra.speech.validate` (never guess or hardcode credit numbers).
     - **Count**: Exact count of paid calls planned (e.g., 1 script-prep, 1 TTS synthesis, 1 avatar animate).
     - **Identity**: Caller-generated fresh `client_request_id` UUID per paid call once parameters are final (reused ONLY when retrying the exact same payload after an unknown timeout).
     - **If stop**: Stopping here leaves what the customer already holds (prepared script/pacing plan, auditioned voice choice, preflight quote, or any completed audio) usable at zero extra charge; if this is the first paid step, state plainly nothing has been charged yet.
     - **If balance short**: On `insufficient_balance`, relay Beatra's official message and exact top-up URL verbatim (without altering the link) and wait until the customer confirms they have topped up before retrying with the same `client_request_id`.
6. **Synthesize speech with free `SRT`/`VTT` subtitles (`beatra.speech.synthesize`)**:
   - Keep `subtitle_enable: true` (default) to receive **free `output.subtitles`** (`files.json`, `files.srt`, `files.vtt`) alongside `speech_start_seconds`, `speech_end_seconds`, `integrated_loudness_lufs`, and actual `duration_seconds` with zero extra subtitle charge.
   - Verify actual MIME type, `duration_seconds`, and `size_bytes` against `driving_audio` constraints before dispatching `beatra.videos.animate`.
7. **Animate portrait and review (`beatra.videos.animate`)**:
   - Dispatch `beatra.videos.animate` once with the uploaded portrait ref, speech `artifact_id`, chosen model, restrained direction prompt, integer `duration` matching the live card, and its own `client_request_id`.
   - Poll with `beatra.tasks.get` (reconcile via `beatra.tasks.list` if a transport response dropped).
   - Deliver the video alongside the free `.srt` / `.vtt` subtitle files and timing metadata. If animation fails, reuse the already-delivered speech audio without paying to re-synthesize speech.

See [Workflow and Payloads](references/workflow.md) for copyable JSON request templates, asset checks, and recovery paths.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
