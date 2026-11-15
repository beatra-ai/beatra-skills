---
name: "founder-ip-avatar-studio"
description: "Turn one authorized founder or expert portrait and a weekly script into a talking-head IP video in that person's likeness and voice. This founder avatar and digital avatar studio can clone that person's voice and produce a stable founder talking head clip for founder updates, expert explainers, and brand announcements. Use it for a digital human spokesperson, talking head founder series, expert avatar video, brand digital human, AI presenter, AI spokesperson video, and recurring presenter video."
---

# Founder IP Avatar Studio

Use this Skill to build a recurring talking-head IP video workflow anchored to one authorized founder or expert portrait, a verified cloned (or existing approved) founder voice, loudness normalization, and synced subtitles.

## What you get

- A reusable founder or expert voice profile (cloned from an authorized clean or denoised sample, auditioned free with `beatra.voices.preview`, and labeled/pinned via `beatra.voices.update`).
- A delivered talking-avatar MP4 clip in the founder's likeness and voice.
- **Free aligned subtitle files** (`JSON`, `SRT`, and `VTT` from `output.subtitles`) plus `speech_start_seconds`, `speech_end_seconds`, and `integrated_loudness_lufs`.
- A pre-spend duration fit check so scripts match live avatar clip length limits before spending credits on synthesis or video generation.

## Ways to run it

- **First episode + new voice clone**: Optionally pre-clean a noisy voice sample with paid `beatra.audio.process` (`operation="isolate_voice"`), clone with explicit rights confirmation (`beatra.voices.clone`), activate if `pending_activation` (`beatra.voices.activate` with confirmed quote, `confirmation_token`, and exact `confirm_credits`), label or pin the voice (`beatra.voices.update`), prepare pacing with **Smart Voice Director** (`beatra.speech.prepare_script`, paid), preflight duration free (`beatra.speech.validate`), synthesize with free `SRT`/`VTT` subtitles (optionally normalize loudness via paid `beatra.audio.process`), and animate (`beatra.videos.animate`).
- **Weekly update on an existing founder voice**: Reuse the saved `voice_id` from `beatra.voices.list`, audition with free `beatra.voices.preview`, prepare pacing (`beatra.speech.prepare_script`), verify clip fit free (`beatra.speech.validate`), synthesize + optionally normalize loudness, and animate.

## Before the connection is ready

Use the bundled `scripts/mcp_client.py` for every Beatra call (using only tools listed by `scripts/mcp_client.py tools`). Do not configure or use a host Beatra Connector. Do not use REST/OpenAPI as a fallback. Keep connection help in [Bundled MCP Client diagnostics](references/mcp-connection.md), detailed audio/voice guidance in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md), billing recovery in [Billing errors and recovery](references/billing-errors-and-recovery.md), and lifecycle controls in [uninstall and disconnect](references/uninstall-and-disconnect.md).

If approval is pending, run connection checks at most twice in one turn, deliver zero-connection script prep (weekly framing, hook tightening, draft copy) first, and resume paid calls after the user approves and replies.

## Hard inputs and 3 mandatory voice safety confirmations

Stop before paid cloning, activation, synthesis, or avatar video generation if required inputs or confirmations are missing:

1. **Authorized portrait**: Front-facing or lightly angled portrait (`beatra.assets.upload`).
2. **Voice source**: Either an existing `ready` or `pending_activation` `voice_id`, or a clean 10-300 s single-speaker sample for `beatra.voices.clone` (if background music, echo, or street noise is present in a 4.6 s - 5 min recording, propose paid pre-clean `beatra.audio.process` with `operation="isolate_voice"` first).
3. **Weekly script**: Final or draft founder copy for this episode.
4. **Mandatory Confirmation #1 — Ownership, consent, and anti-impersonation (`consent_attested: true`)**: Before calling `beatra.voices.clone`, obtain explicit confirmation in the current conversation that both the portrait likeness and the voice recording belong to the customer (or they hold verifiable rightsholder authorization), and will never be used for impersonation, fraud, deception, or unlawful purposes.
5. **Mandatory Confirmation #2 — Paid activation quote, token, and exact credits (`beatra.voices.activate`)**: If cloning (`{"capability": "voice_clone", "include_activation_required": true}`) produces `status="pending_activation"` — look directly at its embedded `activation.quote` (or fetch/refresh a quote for an existing `pending_activation` voice by calling `beatra.voices.activate` with `voice_id` and `client_request_id`, omitting `confirmation_token`). Present the live `price_credits` / `confirm_credits`, activation terms, `preview_url`, and **24-hour expiry** on `confirmation_token`, and wait for explicit approval before calling `beatra.voices.activate` with `voice_id`, `confirmation_token`, exact `confirm_credits`, and a fresh `client_request_id`.
6. **Mandatory Confirmation #3 — Irreversible voice slot permanence & deletion gate**: Explain that cloned voices occupy managed voice slots and permanent removal (`voices.delete`, documented in [Speech, Voices, and Audio Finishing](references/speech-and-audio.md)) requires an explicit two-step confirmation with `paid_slot_warning` and `irreversible_notice` before deletion can complete.

## Avatar Duration Critical Chain & Audio Normalization

Follow this sequence strictly before spending credits on synthesis or video animation:

1. **Read live limits and prices first (`beatra.models.list`)**:
   - Always check `{"capability": "image_to_video"}` (max clip duration and `driving_audio` rules), `{"capability": "voice_clone", "include_activation_required": true}`, `{"capability": "speech_script"}`, `{"capability": "text_to_speech"}`, and when audio cleaning or loudness normalization is planned, `{"capability": "audio_voice_isolation"}` and `{"capability": "audio_process"}`.
   - Audition candidate voices free via `beatra.voices.list` and `beatra.voices.preview`; use free `beatra.voices.update` (`display_name`, `make_default: true`, persona/use-case tags) to name and pin the founder IP voice.
2. **Prepare pacing with Smart Voice Director (`beatra.speech.prepare_script`, PAID)**:
   - Call `beatra.speech.prepare_script` (`{"capability": "speech_script"}`, max **2 concurrent** calls) to shape pauses, emphasis, and conversational beats while keeping the founder's exact spoken wording intact. Inspect `directed` and `scripts[]` (`synthesis`, `summary`, `warnings`), resolving `synthesis: null` via `warnings` and passing `scripts[].synthesis` unchanged + fresh `client_request_id` to `beatra.speech.synthesize`.
   - Never manually invent braced performance tags in prompts or copy.
   - To try another voice within 48 hours for identical wording, instructions, language, and context, call `beatra.speech.prepare_script` again with identical arguments changing only `voice` (and `model` if needed) at zero extra fee (account balance must still cover initial estimate and concurrency cap). Never call fresh `prepare_script` or `audio.process` steps free.
3. **Mandatory free duration check BEFORE paying (`beatra.speech.validate`)**:
   - Call **`beatra.speech.validate`** (free, NO `client_request_id`) with the chosen `voice`, prepared `input`, `model`, `format`, and delivery settings.
   - Inspect `valid`, `warnings[]`, `price_credits`, and **`estimated_duration_seconds`** against the live `image_to_video` single-clip duration ceiling **before** calling paid `speech.synthesize` or `videos.animate`.
   - If `estimated_duration_seconds` exceeds one clip, trim or tighten the script and re-run free `speech.validate` until it fits inside the clip limit.
4. **Present the 6-field production card before the first paid step**:
   - Summarize all six fields using live quotes (**Work**, **Credits**, **Count**, **Identity**, **If stop**, **If balance short**), listing `isolate_voice`, `voices.clone`, `voices.activate`, `prepare_script`, `speech.synthesize`, `normalize_loudness`, and `videos.animate` honestly as their own paid steps when used. Keep `beatra.wallet.get` / `beatra.wallet.ledger` as optional read-only tools for user balance or charge questions — not a mandatory gate before submit. State plainly in **If stop** which free/completed artifacts the customer keeps at zero additional charge; on `insufficient_balance`, relay Beatra's official message and exact verbatim top-up URL and wait until the customer confirms top-up before retrying with the same `client_request_id`.
5. **Synthesize (`beatra.speech.synthesize`), optional loudness normalization (`normalize_loudness`), and animate (`beatra.videos.animate`)**:
   - Keep `subtitle_enable: true` (default) to receive **free `output.subtitles`** (`JSON`, `SRT`, `VTT`) + `speech_start_seconds`, `speech_end_seconds`, and `integrated_loudness_lufs`.
   - When cross-episode volume normalization is requested (up to **60 min / 300 MB**, min output >= 1 s, 50 calls/day, one at a time), run **PAID** `beatra.audio.process` (`operation="normalize_loudness"`, `{"capability": "audio_process"}`, default `-14` LUFS, `-1` true peak), verify the final driving audio fits `image_to_video` constraints, and call `beatra.videos.animate` once with its own `client_request_id`.

Detailed request payloads and recovery flows are in [Workflow and Payloads](references/workflow.md).

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
