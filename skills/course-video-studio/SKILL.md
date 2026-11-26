---
name: "course-video-studio"
description: "Turn finished lecture scripts into presenter-led course videos with lecture narration. This course video studio prepares the spoken narration for each lesson, then records a digital-teacher delivery, so enablement teams get ready-to-publish lecture videos and training presenter clips."
---

# Course Video Studio

Use this Skill to turn finished lecture scripts and an authorized instructor portrait into presenter-led talking-head lesson videos with consistent teacher voice, loudness normalization, and synced subtitles.

## What you get

- Narrated course lesson audio and talking-avatar instructor MP4 clips aligned per lesson segment.
- **Free aligned subtitle files** (`JSON`, `SRT`, and `VTT` from `output.subtitles`) plus `speech_start_seconds` and `speech_end_seconds` for each lesson take.
- Optional reusable cloned instructor voice (`beatra.voices.update` to label and pin as course default), pre-cleaned sample audio (`isolate_voice`), and loudness-normalized speech tracks (`normalize_loudness`).

## Ways to run it

- **Lesson scripts + cloned instructor voice + portrait**: Pre-clean noisy voice sample if needed (paid `beatra.audio.process` `operation="isolate_voice"`), clone with explicit authorization (`beatra.voices.clone`), audition free (`beatra.voices.preview`) and pin (`beatra.voices.update`), run free duration preflight (`beatra.speech.validate`) so every lesson segment fits live `image_to_video` clip limits before paying, confirm the lesson card and optionally shape pauses per lesson with **Smart Voice Director** (`beatra.speech.prepare_script`, paid), synthesize with free `SRT`/`VTT` subtitles (`beatra.speech.synthesize`), optionally normalize loudness (paid `normalize_loudness`), and animate (`beatra.videos.animate`).
- **Lesson scripts + catalog voice + portrait**: Browse and audition preset instructor voices free (`beatra.voices.list` + `beatra.voices.preview`), verify clip fit free (`speech.validate`), confirm the lesson card and optionally prepare script pacing (`prepare_script`), synthesize + optionally normalize loudness, and animate.

## Before the connection is ready

Use the bundled `scripts/mcp_client.py` for every Beatra call (using only tools listed by `scripts/mcp_client.py tools`). Do not configure or use a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Keep setup and reconnection in [installation and authentication](references/installation-and-auth.md), diagnostics in [Bundled MCP Client diagnostics](references/mcp-connection.md), speech and audio finishing specs in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md), billing help in [Billing errors and recovery](references/billing-errors-and-recovery.md), and lifecycle controls in [uninstall and disconnect](references/uninstall-and-disconnect.md).

When `scripts/mcp_client.py` reports missing credentials or `BEATRA_AUTH_REQUIRED` (HTTP 401), always run `python3 scripts/authorize.py` first (at most twice per turn)—even in headless, automated, or no-confirmation environments—so an open or pre-authorized session completes immediately and prints `Beatra is ready`. Only when `python3 scripts/authorize.py` itself exits with `BEATRA_AUTH_PENDING` (exit status `3`), deliver zero-connection script segmentation with exact character counts and non-spoken pacing notes first: never invent credit figures, clip-duration ceilings, or unverified segment durations (mark prices, clip ceilings, and durations as pending live `beatra.models.list` and `beatra.speech.validate`), never ask the user to confirm approval in chat, and continue once connected.

## Hard inputs and 3 mandatory voice safety confirmations

Verify these before launching any paid voice or video operation:

1. **Lecture script(s)**: One or more approved lesson scripts (not raw topic brainstorming; segment at sentence boundaries if longer than one avatar clip).
2. **Authorized instructor portrait**: Uploaded via `beatra.assets.upload`.
3. **Voice choice**: A `ready` preset/cloned voice ID or a clean recording for cloning within the length and size limits on the `voice_clone` card (propose paid `isolate_voice` if background noise/echo affects a 4.6 s - 5 min sample).
4. **Mandatory Confirmation #1 — Ownership, consent, and anti-impersonation (`consent_attested: true`)**: Before calling `beatra.voices.clone`, obtain explicit confirmation that the instructor portrait and voice sample belong to the user or carry verifiable rightsholder permission, with zero impersonation, fraud, or unlawful use. Then select the clone model as described in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md) §5, show the production card with the live clone price, submit once, and handle any refusal per [Billing errors and recovery](references/billing-errors-and-recovery.md).
5. **Mandatory Confirmation #2 — Pending-activation gate (`voices.activate` awareness)**: When a clone result or a listed voice has status `pending_activation`, follow §5 Step E of [Speech, Voices, and Audio Finishing](references/speech-and-audio.md) before using the voice.
6. **Mandatory Confirmation #3 — Irreversible voice deletion rule**: Permanent deletion (`voices.delete`) requires the two-step `paid_slot_warning` + `irreversible_notice` confirmation workflow documented in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md).

## Avatar Duration Critical Chain & Loudness Normalization

Follow this sequence for every lesson video:

1. **Discover live models, clip ceilings, and ready voice (`beatra.models.list`)**:
   - Inspect `{"capability": "image_to_video"}` first (max whole-second clip duration and `driving_audio` rules), plus `{"capability": "speech_script"}`, `{"capability": "text_to_speech"}`, and when cloning/cleaning/normalizing, `{"capability": "voice_clone"}`, `{"capability": "audio_voice_isolation"}`, and `{"capability": "audio_process"}`.
   - Use free `beatra.voices.preview` to audition voices and free `beatra.voices.update` (`display_name`, `make_default: true`, tags) to pin the course voice (completing any optional sample pre-clean, voice clone, or pending-voice activation behind its own 6-field card per Hard inputs above before continuing).
2. **Mandatory free duration preflight BEFORE spending (`beatra.speech.validate`)**:
   - Call **`beatra.speech.validate`** (free, NO `client_request_id`) on every planned lesson segment before showing the lesson production card or calling `beatra.speech.prepare_script`, `beatra.speech.synthesize`, or `beatra.videos.animate`.
   - Check `estimated_duration_seconds` against the live `{"capability": "image_to_video"}` clip ceiling! Hard checkpoint before Step 3: if any lesson exceeds one clip's limit, split at clean sentence/slide pauses and re-run free `beatra.speech.validate` on every resulting sub-segment until each sub-segment fits the ceiling—never show the Step 3 card or spend credits on an unvalidated sub-segment.
3. **Present the 6-field production card before the first paid lesson step**:
   - Present the 6-field production card (**Work**, **Credits**, **Count**, **Identity**—one fresh opaque `client_request_id` per final paid call kept in Agent notes and never shown raw to the user—**If stop**, **If balance short**) and wait for approval before launching paid lesson steps, listing `isolate_voice`, `voices.clone`, `voices.activate`, `prepare_script`, `speech.synthesize`, `normalize_loudness`, and `videos.animate` as explicit paid items when used (and when `beatra.audio.process` is included, state its applicable quota and input bounds on the card: `4.6 s - 5 min` / `<= 100 MB` for `isolate_voice`; `<= 60 min` / `<= 300 MB`, output `>= 1 s`, `50/day`, one at a time for `normalize_loudness`). Keep `beatra.wallet.get` and `beatra.wallet.ledger` as optional read-only tools for user balance or charge questions — never a mandatory gate before submit. State plainly in **If stop** which free/already-delivered artifacts the customer keeps at zero extra fee; on `insufficient_balance`, relay Beatra's official message and exact verbatim top-up URL and wait until top-up is confirmed before retrying with the same `client_request_id`.
4. **Prepare pacing with Smart Voice Director (`beatra.speech.prepare_script`, PAID)**:
   - After the lesson card is approved, run `beatra.speech.prepare_script` (`{"capability": "speech_script"}`, max **2 concurrent**) when requested to place natural teaching pauses and emphasis cues without changing the instructor's approved words. Inspect `directed` and `scripts[]` (`synthesis`, `summary`, `warnings`), resolving `synthesis: null` via `warnings`, re-checking `scripts[].synthesis` with free `beatra.speech.validate` so added pauses still fit the clip ceiling, and passing `scripts[].synthesis` unchanged + fresh `client_request_id` to `beatra.speech.synthesize`.
   - Never hand-write braced performance tags in lesson scripts or prompts. When `beatra.speech.prepare_script` is skipped or unavailable, keep the instructor's approved script verbatim (zero added, deleted, or rewritten words; place pause advice outside the spoken text) and never claim zero-word-change fidelity if the script was edited.
   - To try another voice within 48 hours for identical wording, instructions, language, and context, call `beatra.speech.prepare_script` again with the same arguments changing only `voice` (and `model` if needed) at no extra charge (balance must cover the initial estimate and concurrency cap). Never label fresh director runs or `audio.process` steps free.
5. **Synthesize (`output.subtitles`), normalize loudness (optional PAID), and animate**:
   - Keep `subtitle_enable: true` (default) on `beatra.speech.synthesize` for **free `JSON` / `SRT` / `VTT` subtitles** plus `speech_start_seconds`, `speech_end_seconds`, and `integrated_loudness_lufs`.
   - When producing multi-lesson series that need uniform level (sources/outputs up to **60 min / 300 MB**, min result >= 1 s, 50 calls/day, one at a time), run **PAID** `beatra.audio.process` (`operation="normalize_loudness"`, `{"capability": "audio_process"}`, `-14` LUFS default, `-1` dBTP) before animating.
   - Verify final `driving_audio` format/duration/size and run `beatra.videos.animate` once per clip with its own `client_request_id`.

See [Workflow and Payloads](references/workflow.md) for JSON templates and error recovery.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
