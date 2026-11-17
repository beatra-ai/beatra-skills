---
name: "talking-avatar-video"
description: "Create a talking avatar from one portrait and a short script or speech track. This AI presenter and digital human video workflow can prepare narration with a selected voice or use a supplied recording, then direct a stable talking-head clip with restrained expression, natural movement, clear delivery, and focused lip-sync review. Use it for AI spokesperson videos, product explainers, training, course lessons, announcements, onboarding, social talking-head content, and photo-to-talking-video messages, with narration-driven facial motion and a focused review of identity, clarity, lip sync, and motion stability."
---

# Talking Avatar Video

Use this Skill to produce one finished talking-avatar video from a portrait and either a script (converted to speech first) or a user-supplied voice recording. A script longer than one clip becomes several clips joined into one video of up to about two minutes; a longer script comes back as a few joined videos in order.

## What you get

- One delivered talking-avatar MP4 anchored to the approved portrait and spoken track. When the script needs more than one clip, the clips are joined into that MP4 (up to about two minutes; a longer script becomes a few joined videos in order, and you say how many before the first charge).
- When narration is synthesized through Beatra, **free aligned subtitle files** (`JSON`, `SRT`, and `VTT`) that match the finished video.
- A brief pre-production plan (script parts, clip count, and whole-job price) and a post-render quality check covering identity consistency, lip sync, clarity, and motion stability.
- The option to save the portrait as a reusable avatar, so the next video starts without a new upload.

## Ways to run it

- **Portrait + script**: Prepare pacing with **Smart Voice Director** (`beatra.speech.prepare_script`, optional paid director step) if needed, audition voices free with `beatra.voices.preview`, preflight duration free with `beatra.speech.validate`, synthesize speech with free `SRT`/`VTT` subtitles (`beatra.speech.synthesize`), animate the portrait (`beatra.videos.animate`), and join several clips into one video (`beatra.videos.compose`).
- **Portrait + supplied recording**: Upload the user's approved audio (`beatra.assets.upload`), verify duration/format/size against live `image_to_video` limits before generating, then animate the portrait (`beatra.videos.animate`).
- **Saved avatar**: Call free `beatra.avatars.list` first. When the account has a saved avatar, offer it (and its paired voice) instead of asking for a new portrait.

## Before the connection is ready

Use the bundled `scripts/mcp_client.py` for every Beatra call (using only tools listed by `scripts/mcp_client.py tools`). Do not configure or use a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Keep connection troubleshooting in [Bundled MCP Client diagnostics](references/mcp-connection.md), shared speech guides in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md), billing recovery in [Billing errors and recovery](references/billing-errors-and-recovery.md), and lifecycle controls in [uninstall and disconnect](references/uninstall-and-disconnect.md).

If authorization is still pending on first run, do not repeatedly invoke authentication in the same turn (at most twice per turn). Deliver what needs no Beatra connection first (script draft, pacing notes, shot framing advice) and wait for the customer to reply after approving access.

## Hard inputs and authorization gate

Collect and verify these before running any paid tool:

1. **Portrait asset**: A saved avatar from `beatra.avatars.list`, or one clean front-facing or slightly angled portrait/still frame, uploaded via `beatra.assets.upload` once authorized.
2. **Spoken source**: Either a script (`script_text` plus delivery notes/language/tone) or a supplied clean single-speaker audio track (`speech_audio_ref`).
3. **Explicit rights confirmation**: Confirm the customer owns or holds verifiable authorization for both the portrait likeness and the voice/recording, and that the video is not for impersonation, fraud, deception, or unlawful use. Stop before paid synthesis or video generation if consent or required media is missing.

Ask these in one short message only when they are missing; do not bundle unrelated questions.

## Finish as one file

When this job needs more than one clip, the deliverable is one joined file, not the parts. Read [Deliver one file](references/deliver-one-file.md) before the first paid call. When the job takes more than 3 paid calls, or one kind of paid call leads to another (narration, then video), read [Price a whole job](references/price-a-whole-job.md) first.

## Avatar Duration Critical Workflow

Follow this exact sequence so you never spend credits generating audio or video that exceeds avatar clip limits:

1. **Read live model limits and prices (`beatra.models.list`)**:
   - Inspect `{"capability": "image_to_video"}` first for supported models, per-clip `max_duration` / whole-second ceiling, `driving_audio` MIME/duration/size rules, and live credit rate.
   - Only a model whose card lists `driving_audio` can lip-sync a speech track. Keep `model: "auto"` (it then routes to such a model) or name one of those models; never name the first card on the list just because it is first.
   - Inspect `{"capability": "speech_script"}` if using Smart Voice Director, `{"capability": "text_to_speech"}` for narration pricing, and `{"capability": "video_compose"}` when the job needs a join.
2. **Discover and audition voices free (`beatra.voices.list` + `beatra.voices.preview`)**:
   - Browse presets (`beatra.voices.list` supports bilingual `search` and capability filters).
   - Call `beatra.voices.preview` free (no charge) to share `preview_url` so the customer can approve the voice before paid synthesis.
3. **Plan pacing with Smart Voice Director (`beatra.speech.prepare_script`, PAID, optional)**:
   - Plan it when the script needs pause planning, tonal beats, pronunciation cues, or expressive structure. It is a paid line on the whole-job card, one call per part at its live `{"capability": "speech_script"}` price, and it runs only after that card is confirmed (step 6), at most **2 concurrent** tasks.
   - Inspect `directed` and `scripts[]` (`synthesis`, `summary`, `voice_selection`, `alternatives`, `estimate`, `warnings`). If `synthesis` is `null`, resolve `warnings` before proceeding; otherwise pass `scripts[].synthesis` unchanged (with a fresh `client_request_id`) when calling `beatra.speech.synthesize`.
   - Word fidelity: **Smart Voice Director** prepares pacing, pauses, and annotations without altering the customer's exact spoken wording; never hand-write braced performance tags in prompts or copy.
   - 48-hour reuse rule: to try another voice within 48 hours for identical text, instructions, language, and context, call `beatra.speech.prepare_script` again with the same arguments changing only `voice` (and `model` if needed) at no extra charge (balance must still cover the initial text estimate and concurrency cap). Never call fresh director runs free.
4. **Split and preflight duration free BEFORE paying (`beatra.speech.validate`)**:
   - Always call **`beatra.speech.validate`** (free, NO `client_request_id`) with the planned `voice`, the part's `input` (the plain part for the card; the prepared part again before synthesis when Smart Voice Director ran), `model`, `format` (chosen to satisfy `image_to_video` `driving_audio` rules), and delivery controls.
   - `estimated_duration_seconds` does not know the voice's own pace and can miss by about a quarter either way. Plan each part to at most about 80% of the live single-clip ceiling.
   - When the whole script does not fit one part, split it at sentence ends into parts that each fit, keeping every word the customer wrote, and validate each part. With Smart Voice Director, split the plain script first and prepare each part, so every prepared part goes to synthesis unchanged. Do not shorten the customer's script to make it fit; offer cuts only if the customer asks for a shorter video.
5. **Confirm one production card for the whole job before the first paid step**:
   - Follow [Price a whole job](references/price-a-whole-job.md) whenever there is narration plus video or more than one clip, so the video price is known before narration is paid for. Present all six fields concisely using live `beatra.models.list` / `beatra.speech.validate` figures; `beatra.wallet.get` is read once for a whole job, once more after the customer says they have topped up (it lifts the bundled client's balance hold), and otherwise only when the user asks about balance, and `beatra.wallet.ledger` only when the user asks about charges:
     - **Work**: Capability chain (e.g., Smart Voice Director per part if planned, N narration parts, N talking-avatar clips, one join), selected voice/model, resolution, and expected total duration.
     - **Credits**: Live quoted credits per line and the estimated total (never guess or hardcode credit numbers).
     - **Count**: Exact count of paid calls planned.
     - **Identity**: Mint a fresh `client_request_id` per paid call once that call's payload is final and keep it in your notes; never show the raw ID to the customer (reused ONLY when retrying the exact same payload after an unknown timeout).
     - **If stop**: Stopping here leaves what the customer already holds (auditioned voice choice, preflight quote, or any completed prepared script, audio, and clips) usable at zero extra charge; if this is the first paid step, state plainly nothing has been charged yet.
     - **If balance short**: On `insufficient_balance`, relay Beatra's official message in the customer's language with the exact top-up URL unchanged, and wait until the customer confirms they have topped up; then read `beatra.wallet.get` once and retry with the same `client_request_id`.
6. **Synthesize speech with free `SRT`/`VTT` subtitles (`beatra.speech.synthesize`)**:
   - When the card includes Smart Voice Director, run `beatra.speech.prepare_script` for each part first, validate each prepared part free, and pass its `scripts[].synthesis` unchanged.
   - Keep `subtitle_enable: true` (default) to receive **free `output.subtitles`** (`files.json`, `files.srt`, `files.vtt`) alongside `speech_start_seconds`, `speech_end_seconds`, `integrated_loudness_lufs`, and actual `duration_seconds` with zero extra subtitle charge.
   - Verify actual MIME type, `duration_seconds`, and `size_bytes` against `driving_audio` constraints before dispatching `beatra.videos.animate`. If one part runs over the clip ceiling, split only that part at a sentence end and ask before re-synthesizing it; never pay for a video clip the audio cannot fit.
7. **Animate each part and review (`beatra.videos.animate`)**:
   - Dispatch `beatra.videos.animate` once per part with the portrait ref, that part's speech `artifact_id`, chosen model, restrained direction prompt, integer `duration` matching the live card, and its own `client_request_id`. Keep within the account's concurrent task limit.
   - Poll with `beatra.tasks.get` (reconcile via `beatra.tasks.list` if a transport response dropped).
   - With more than one clip, join them per [Deliver one file](references/deliver-one-file.md): clips in script order, `keep_audio: true`, each clip trimmed to its speech end but never past its own length.
   - Deliver the one video first, then one `.srt` and one `.vtt` for the whole video (cues shifted per [Deliver one file](references/deliver-one-file.md)), told in plain words (format, length, size, credits charged). If animation fails, reuse the already-delivered speech audio without paying to re-synthesize speech.
8. **Offer to save the avatar (`beatra.avatars.save`, free)**:
   - After a result the customer likes from a new portrait, offer once to save it with a name so the next video needs no upload. Save only after the customer agrees and confirms the portrait consent sentence (`consent_attested: true`, `consent_subject`: `"self"` or `"authorized_other"`); pair the approved `voice_id` when there is one, and make it the default only when the customer asks or has no saved avatar.

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
