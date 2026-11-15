# Speech, Voices, Cloning, and Audio Finishing

Use this guide when working with narration, dialogue, voice cloning, speech conversion, transcription, sound effects, voice isolation, loudness normalization, format conversion, or stem separation.

> Only call MCP tools exposed on this account and listed by the bundled `scripts/mcp_client.py tools` command. Scenario packages include only the subset matched to their workflow; check tool availability before planning a call.

## Discover Capabilities and Live Pricing First

Never hardcode credit numbers, guess durations, or assume every tool uses the same voice features. Query `beatra.models.list` first for live credit rates, supported limits, and capability support.

| User Need | MCP Tool | `beatra.models.list` Filter | Notes |
| --- | --- | --- | --- |
| AI script pacing, pause planning, expressive markup | `beatra.speech.prepare_script` | `{"capability": "speech_script"}` | **Smart Voice Director** — compiles intent into performance-ready script without altering spoken words |
| Single-speaker narration / voiceover | `beatra.speech.synthesize` | `{"capability": "text_to_speech"}` | Optional `direction`, `emotion`, context continuity, free aligned subtitles |
| Native multi-speaker conversation (2–50 turns) | `beatra.speech.synthesize_dialogue` | `{"capability": "text_to_dialogue"}` | Single coherent take with up to 10 `supports_dialogue=true` voices |
| Create a custom cloned voice | `beatra.voices.clone` | `{"capability": "voice_clone", "include_activation_required": true}` | Exposes all 3 cloning routes including free-trial + activation |
| Activate a pending trial clone | `beatra.voices.activate` | Quote embedded in clone response (`activation.quote`) or re-fetched via `beatra.voices.activate` (omit `confirmation_token`, include `client_request_id`) | Required only when `voices.clone` returns `status="pending_activation"` |
| Speech-to-speech performance conversion | `beatra.speech.convert` | `{"capability": "speech_to_speech"}` | Preserves timing, pacing, and emotion across voices (1 s – 5 min) |
| Audio/video transcription + diarization | `beatra.audio.transcribe` | `{"capability": "speech_to_text"}` | Up to 60 min (`<= 100 MiB`), multi-speaker labels, audio events, subtitles |
| Sound effects and seamless ambient beds | `beatra.audio.generate_sfx` | `{"capability": "sound_effects"}` | 0.5–30 s clips, optional seamless `loop=true` |
| Strip background noise/music from voice | `beatra.audio.process` (`operation="isolate_voice"`) | `{"capability": "audio_voice_isolation"}` | Paid pre-clean for noisy clone samples or voice recordings (4.6 s – 5 min) |
| Split music/mix into vocals and stems | `beatra.audio.process` (`operation="separate_stems"`) | `{"capability": "audio_stem_separation"}` | Match returned `pricing` option by `dimensions.stem_mode` (`"two_stem"` / `"multi_stem"`), or the option without `dimensions` |
| Trim, loop, fade, normalize loudness, convert format | `beatra.audio.process` (`trim`, `loop`, `fade`, `normalize_loudness`, `convert_format`) | `{"capability": "audio_process"}` | Paid audio finishing (includes `ulaw_8k_wav` telephony export) |

### Free / Non-Billable Tools

These tools cost **zero credits** and never charge the wallet:

| MCP Tool | Purpose |
| --- | --- |
| `beatra.speech.validate` | Free preflight for `beatra.speech.synthesize`: returns `valid`, `weighted_characters`, `estimated_duration_seconds`, live `price_credits`, `execution`, and warnings |
| `beatra.speech.validate_dialogue` | Free preflight for `beatra.speech.synthesize_dialogue`: checks turn bounds, character budget, unique/cloned voice limits, `estimated_credits`, `estimated_duration_seconds`, and warnings |
| `beatra.voices.list` | Browse preset voices (866 curated presets) and owned clones with bilingual `search`, facet filters, and `capabilities.*` metadata |
| `beatra.voices.preview` | Return a free audition sample URL (`preview_url`, `kind`) for a ready voice |
| `beatra.voices.update` | Rename or update metadata (`display_name`, `make_default`, `gender`, `age_group`, `use_case`, `persona`, `language`) |
| `beatra.voices.delete` | Two-step permanent voice deletion (`confirmation_token` issued in step 1, valid 15 min) |
| `beatra.voices.activate` (`voice_id` + `client_request_id`, omitting `confirmation_token`) | Re-fetch a free activation price quote and 24-hour `confirmation_token` for a `pending_activation` voice without charging |

Never describe paid finishing or preprocessing steps (`isolate_voice`, `normalize_loudness`, `trim`, `fade`, `loop`, `convert_format`, `separate_stems`, or `prepare_script`) as free.

---

## Production Card, Wallet Checks, and `client_request_id`

Before starting any paid speech, dialogue, cloning, conversion, transcription, SFX, or finishing task:

1. Run any applicable free preflight (`beatra.voices.list` / `beatra.voices.preview` / `beatra.speech.validate` / `beatra.speech.validate_dialogue`) and read live rates via `beatra.models.list`. Keep `beatra.wallet.get` and `beatra.wallet.ledger` as optional read-only tools for answering balance or charge questions — never make `beatra.wallet.get` a mandatory gate before submit, and never ask the user to confirm they have enough credits.
2. Present a concise confirmation summarizing the **six required fields** before the first paid step (after all inputs and parameters are settled):
   - **Work**: exact capability, voice choice, language/duration/format, and any planned finishing step.
   - **Credits**: quoted credits from `beatra.models.list` / preflight (never guess or hardcode prices).
   - **Count**: number of calls/takes/clips planned (a retry with changed parameters counts as a new call).
   - **Identity**: fresh caller-generated `client_request_id` per paid call (minted only once the payload is final).
   - **If stop**: name what the customer already holds and keeps at zero additional charge if they stop here (for example, prepared scripts, auditioned voice picks, preflight duration/credit quotes, or any already-delivered audio; if this is the first paid step, state plainly that nothing has been charged yet). Cancel an already-running job via `beatra.tasks.cancel` only if requested.
   - **If balance short**: relay Beatra's official message and verbatim top-up URL (translated cleanly without altering the URL) and wait until the customer confirms they have topped up before retrying with the same frozen `client_request_id`.
3. Keep one `client_request_id` per paid call. Reuse the **exact same `client_request_id`** only when retrying the **identical payload** after a timeout or unknown transport outcome; generate a **new `client_request_id`** whenever any parameter changes.

---

## 1. Smart Voice Director (`beatra.speech.prepare_script`) & Free Preflight

Replaces legacy manual `/` counting or stripping and guesswork about pauses or expressive markup.

### Workflow

1. Take the customer's plain spoken copy and delivery goals (`instructions`: tone, pacing, dramatic beats, pauses, emotion shifts, pronunciation notes).
2. Call **`beatra.speech.prepare_script`** (`{"capability": "speech_script"}`):
   - Pass `input` (1–50,000 chars), optional `instructions` (<= 2,000 chars), target `voice` and `model` (so formatting adapts to that voice's capabilities), `language` (`"auto"` or explicit locale), optional `context` (`{"before": ..., "after": ...}`), and `client_request_id`.
   - **Word fidelity guarantee**: Smart Voice Director prepares pacing, pauses, and expressive annotations **without altering the user's spoken wording**.
   - **No manual brace-tag authoring**: never manually invent or hand-write braced performance tags in prompts or documentation; rely on `beatra.speech.prepare_script` (and `direction` / `emotion` parameters where supported).
3. Inspect the returned `directed` flag and `scripts[]` (`synthesis`, `summary`, `voice_selection`, `alternatives`, `estimate`, `warnings`):
   - If `synthesis` is `null`, read `warnings` — that chunk cannot be synthesized as-is until adjusted or split.
   - Pass each ready script's **`synthesis` object unchanged** together with your own fresh **`client_request_id`** when calling `beatra.speech.synthesize`.
4. **Always run free `beatra.speech.validate`** with the planned `voice`, prepared `input`, `model`, and delivery parameters before calling `beatra.speech.synthesize`:
   - Verify `valid == true`, review `warnings` (such as pause placement or length advisories), `weighted_characters`, `estimated_duration_seconds`, live `price_credits`, and `execution` (`sync` vs `async`).
   - Adjust breaks or segment long scripts cleanly without manual slash-stripping workarounds.

### Reuse & Concurrency Rules

- **48-hour same-script reuse**: to try another voice within 48 hours for the same wording, instructions, language, and context, **call `beatra.speech.prepare_script` again with the identical arguments changing only `voice` (and `model` if needed)** so Beatra re-compiles markup for the new voice's capabilities using the earlier reading at zero charge. Note: the account balance must still cover the initial text estimate plus any other Smart Voice Director tasks currently in progress.
- **Concurrency cap**: run at most **2 concurrent** `beatra.speech.prepare_script` requests at a time.

---

## 2. Single-Speaker Synthesis (`beatra.speech.synthesize`) & Free Aligned Subtitles

- Pass `voice`, prepared `input`, `model` (`"auto"` unless a capability requires a specific choice), optional `language`, `speed` (`0.5–2.0`), `volume` (`>0–10`), `pitch` (`-1.0–1.0`), `emotion`, `direction`, `previous_text`, `next_text`, `format` (`mp3`/`wav`/`opus`/`pcm`), and `client_request_id`.
- **Keep `subtitle_enable` enabled** (`true` by default; do **not** send `subtitles` on `beatra.speech.synthesize`): `beatra.speech.synthesize` returns **`output.subtitles`** (JSON word/segment timestamps, SRT, and VTT) **free of charge**, plus:
  - `output.audio.speech_start_seconds`
  - `output.audio.speech_end_seconds`
  - `output.audio.integrated_loudness_lufs`
- Use `speech_start_seconds`, `speech_end_seconds`, and `output.subtitles` directly for lip-sync, slide alignment, or assembly (such as `beatra.videos.compose` when available) without paying for a separate transcription pass just to obtain timestamps.

---

## 3. Native Multi-Speaker Dialogue (`beatra.speech.synthesize_dialogue`)

Use **`beatra.speech.synthesize_dialogue`** (`{"capability": "text_to_dialogue"}`) when 2 or more speakers interact in one continuous scene with natural turn-taking, interruptions, laughter, and shared emotional arc.

### Hard Limits & Free Preflight

Always call free **`beatra.speech.validate_dialogue`** before calling **`beatra.speech.synthesize_dialogue`**:

| Constraint | Limit | Action When Exceeded |
| --- | --- | --- |
| Turns per call | **2–50 turns** (`turns[]` with `voice`, `input`, optional `speaker`, `emotion`) | Split into sequential scenes |
| Total characters per call | **<= 2,000 characters** (`compiled_characters` / `characters` in `validate_dialogue`) | Chunk scene-by-scene and pass `previous_text` / `next_text` across boundaries |
| Unique voices per call | **<= 10 voices**, all with `capabilities.supports_dialogue == true` | Fall back to segmented `beatra.speech.synthesize` if cast exceeds 10 |
| Ready cloned voices per call | **<= 4 ready cloned voices** (`category="cloned"`, `status="ready"`) within the 10-voice total | Mix preset dialogue voices or fall back to segmented `beatra.speech.synthesize` |
| Unsupported voice / regional dialect | Any voice with `supports_dialogue == false`, or specialty regional dialect not supported in dialogue | Use segmented `beatra.speech.synthesize` per turn (`previous_text` / `next_text`) and join cleanly in finishing |

- Like single-speaker synthesis, `beatra.speech.synthesize_dialogue` returns **free speaker-attributed `output.subtitles`** (JSON/SRT/VTT) and `segments[]` (`turn_index`, `voice_id`, `speaker`, `text`, `start_seconds`, `end_seconds`) when `subtitle_enable` is `true` (default).

---

## 4. Voice Discovery, Audition, Profile Update & Deletion

### Search & Filter 866 Presets + Owned Clones (`beatra.voices.list`)

- Browse up to 500 voices per page (`limit` <= 500, `cursor` for pagination) across `category="preset"` (866 presets) and `category="cloned"` (`status`: `"ready"`, `"pending_activation"`, `"expired"`, `"any"`).
- **Bilingual `search`**: accepts English or Chinese keywords and matches voice names, descriptions, styles, accents, and tags.
- **Query filter flags**: filter directly by `language`, `gender`, `age_group`, `use_case`, `emotion`, `model`, plus capability filters:
  - `supports_dialogue=true`
  - `supports_speech_to_speech=true`
  - `supports_direction=true`
  - `supports_emotion=true`
  - `supports_performance_tags=true`
  - `supports_context=true`
- **All 11 `capabilities.*` metadata fields returned per voice**: inspect before committing a voice to a workflow:
  1. `supports_direction` — honors natural-language `direction` cues in synthesis
  2. `supported_emotions` — supported discrete `emotion` presets
  3. `supports_performance_tags` — voice renders expressive cues compiled by `beatra.speech.prepare_script`
  4. `supported_dialects` — supported regional dialect codes
  5. `supports_context` — supports multi-segment prosody conditioning
  6. `supports_previous_text` — honors top-level `previous_text`
  7. `supports_next_text` — honors top-level `next_text`
  8. `supports_pronunciation_pinyin` — supports pinyin pronunciation compilation via script prep
  9. `supports_pronunciation_ipa` — supports IPA pronunciation compilation via script prep
  10. `supports_speech_to_speech` — eligible as target voice for `beatra.speech.convert`
  11. `supports_dialogue` — eligible for `beatra.speech.synthesize_dialogue`

### Free Audition & Profile Management

- **Audition (`beatra.voices.preview`)**: fetch `preview_url` (`kind`) at zero cost so the user can listen before paying for synthesis or dialogue.
- **Profile & Default Management (`beatra.voices.update`)**: rename (`display_name`), change metadata (`gender`, `age_group`, `use_case` up to 5 tags, `persona` <= 200 chars, `language`), or toggle `make_default=true`/`false` to pin a signature brand/narrator voice.

### Mandatory Confirmation #3 — Two-Step Voice Deletion (`beatra.voices.delete`)

Deleting a cloned voice is permanent (`deleted: true` cannot be undone, and an active slot is lost). Never auto-chain step 1 and step 2 in the same turn without explicit user approval:

1. Call `beatra.voices.delete` with `voice_id` only (**omit `confirmation_token`**).
2. Read the returned `voice`, `paid_slot_warning`, `irreversible_notice`, `confirmation_token`, and `token_expires_at` (**15-minute expiry**). Show these warnings clearly to the user.
3. Only after the user explicitly confirms deletion, call `beatra.voices.delete` with both `voice_id` and `confirmation_token`. If 15 minutes pass before confirmation, repeat step 1 for a fresh token.

---

## 5. Voice Cloning: Sample Cleanup, 3 Complementary Routes & Mandatory Confirmations

### Step A — Clean Noisy Samples First (When Needed)

If the source recording has background music, street noise, room echo, or overlapping sounds, offer to pre-clean it first with **`beatra.audio.process`** using:
- `operation="isolate_voice"`
- `source`: sample audio ref (`4.6 s – 5 min`, `<= 100 MB`)
- `client_request_id`

Inspect `{"capability": "audio_voice_isolation"}` in `beatra.models.list` for live credits and confirm this **paid** pre-clean step with the user before running it.

### Step B — Mandatory Confirmation #1 (`consent_attested=true`)

Before calling `beatra.voices.clone`, obtain **explicit confirmation from the user** that the recording is their own voice or that they hold verifiable authorization from the voice owner to clone and use it. Never pass `consent_attested=true` without user consent in the current conversation.

### Step C — Choose Among the 3 Cloning Routes by Capability

Query `beatra.models.list({"capability": "voice_clone", "include_activation_required": true})` and select the route that matches the customer's actual needs (do not expose internal model identifiers or upstream provider terminology):

| Cloning Route | How to Select | What It Unlocks | Follow-Up Step |
| --- | --- | --- | --- |
| **1. Fast everyday clone** | Omit `model` (`model="auto"` default) | Rapid one-step clone (`status="ready"` immediately); works well for clean single-speaker narration and optional `prompt: {sample, text}` transcript pairing | Ready right away (`beatra.voices.preview` / `beatra.speech.synthesize`) |
| **2. 10-language expressive, dialogue & conversion clone** | Inspect `beatra.models.list` `{"capability": "voice_clone"}` and pass the matching capability choice | Cloned voice supports expressive 10-language delivery, `supports_dialogue=true` (`synthesize_dialogue`), and `supports_speech_to_speech=true` (`speech.convert`) | Ready right away (`beatra.voices.preview` / dialogue / speech-to-speech) |
| **3. Free-trial training + paid activation precision clone** | Inspect `beatra.models.list` `{"capability": "voice_clone", "include_activation_required": true}` | High-precision voice training that initially creates a **`pending_activation`** slot so the user can audition/review before paying to unlock the permanent slot | **Mandatory Confirmation #2**: run `beatra.voices.activate` once user approves the quote |

### Step D — Mandatory Confirmation #2 (`beatra.voices.activate`)

When `beatra.voices.clone` returns `status="pending_activation"` (check its embedded `activation.quote` directly, or pick an existing `pending_activation` voice from `beatra.voices.list`):

1. Present the activation quote (`price_credits` / `confirm_credits`), slot/activation terms, preview URL, and token expiry (**24-hour expiry** on `confirmation_token`).
2. Wait for explicit user approval of both the credit amount and terms.
3. Call `beatra.voices.activate` with `voice_id`, `confirmation_token`, `confirm_credits`, and a fresh `client_request_id`.
4. If the 24-hour token is missing or expired, call `beatra.voices.activate` with **`voice_id` and a `client_request_id` (omit `confirmation_token`)** for a **free** refreshed quote and token, re-confirm with the user, then activate with `confirmation_token` and `confirm_credits`.

---

## 6. Speech-to-Speech, Transcription, SFX & Audio Finishing

### Speech-to-Speech Performance Conversion (`beatra.speech.convert`)

- `{"capability": "speech_to_speech"}`
- Transfers the speaker's exact timing, pauses, laughter, cadence, and emotional contour from a source recording (`audio` / `source`, **1 s – 5 min**, `<= 50 MB`) into a target voice (`voice` where **`capabilities.supports_speech_to_speech == true`**).
- Key options: `remove_background_noise=true` when the guide vocal is noisy, `format` (`mp3`/`wav`/`opus`/`pcm`), `stability` (`0–1`), `similarity_boost` (`0–1`), `style` (`0–1`), `use_speaker_boost`, `seed`.

### Speech-to-Text Transcription (`beatra.audio.transcribe`)

- `{"capability": "speech_to_text"}`
- Transcribes audio or video up to **60 minutes** (`0.5 s – 3600 s`, `<= 100 MiB`).
- Supports `language` (`"auto"` or explicit locale), **`diarize=true`** with optional `num_speakers` (`1–32`), **`tag_audio_events=true`** (tags laughter, applause, music, sighs, etc.), and **`subtitles=true`** (default) delivering aligned **JSON / SRT / VTT** files with zero extra subtitle charge.

### Sound Effects & Seamless Ambience (`beatra.audio.generate_sfx`)

- `{"capability": "sound_effects"}`
- Generates foley, stingers, UI/transition sounds, or environmental ambience from descriptive `prompt` (`1–2,000` chars) for **`duration_seconds` 0.5 – 30.0 s**.
- Set **`loop=true`** for seamless looping beds (café ambience, rain, room tone, office hum) suitable for background mixing or repeating cleanly via `beatra.audio.process`. Adjust `prompt_influence` (`0.0–1.0`, default `0.3`) and `format` (`mp3`/`wav`/`opus`/`pcm`).

### Audio Finishing & Processing (`beatra.audio.process`)

Always use **`operation`** (not `action`) and **`source`**:

| Operation | Model Lookup (`beatra.models.list`) | Exact Parameters | Notes |
| --- | --- | --- | --- |
| `isolate_voice` | `{"capability": "audio_voice_isolation"}` | `source`, optional `format`, `sample_rate`, `bitrate_kbps`, `channels` | Clean speech from 4.6 s – 5 min (`<= 100 MB`); default output `wav` |
| `separate_stems` | `{"capability": "audio_stem_separation"}` | `source`, `mode` (`"two_stem"` or `"multi_stem"`) only | Read `pricing` option whose `dimensions.stem_mode` matches `mode` (or option without `dimensions`); no `format`/fade args accepted |
| `normalize_loudness` | `{"capability": "audio_process"}` | `source`, `loudness_lufs` (`-30` to `-9`, default `-14`), `true_peak_db` (`-9` to `0`, default `-1`), optional finishing/format fields | Broadcast / platform loudness calibration; default **-14 LUFS** |
| `trim` | `{"capability": "audio_process"}` | `source`, `start_ms`, `end_ms` OR `target_duration_ms` (mutually exclusive) + optional finishing/format fields | Supports fade/loudness/format in same call |
| `loop` | `{"capability": "audio_process"}` | `source`, `target_duration_ms` OR `loop_count` (`2–100`), `loop_start_ms`, `loop_end_ms`, `crossfade_ms` (`50–3000`), `end_with_fade` + optional finishing/format fields | Great for turning a 15–30 s `generate_sfx(loop=true)` bed into a multi-minute bed |
| `fade` | `{"capability": "audio_process"}` | `source`, `fade_in_ms` and/or `fade_out_ms` (`0–30000`), `fade_curve` (`tri`/`exp`/`log`/`qsin`) + optional finishing/format fields | At least one of `fade_in_ms` / `fade_out_ms` required |
| `convert_format` | `{"capability": "audio_process"}` | `source`, **`format`** required (`mp3`, `wav`, `ogg`, `flac`, `m4a`, or **`ulaw_8k_wav`**), optional `sample_rate`, `bitrate_kbps`, `channels` | For telephony **`ulaw_8k_wav`**, omit `sample_rate`/`channels` or pass exactly `sample_rate=8000`, `channels=1` |

Note on limits for `beatra.audio.process` (run one finishing call at a time):
- `isolate_voice`: `4.6 s – 5 min` (`<= 100 MB`).
- `separate_stems`: up to `10 min`, `<= 100 MB`, `20 calls/day`.
- `trim`, `loop`, `fade`, `normalize_loudness`, `convert_format`: sources and outputs up to `60 min` (`<= 300 MB`, minimum result `>= 1 s`), `50 calls/day` (failed attempts count toward the daily cap).

---

## 7. Recoverable Errors (`code` / `details.reason`)

Explain errors to the customer in plain words in their language without exposing tool names, parameter field names, or raw `code` / `details.reason` strings. Keep the full structured error for recovery decisions:

| `code` / `details.reason` | Required Next Action |
| --- | --- |
| `insufficient_balance` | Relay Beatra's official message and exact `topup_url` / top-up URL verbatim (without modifying the link), wait until the user confirms they have topped up, then retry with the same frozen `client_request_id` |
| `voice_model_incompatible` / `voice_not_found` / dialogue limits exceeded | Run `beatra.speech.validate_dialogue`; choose `supports_dialogue=true` voices (`<= 10`, `<= 4` clones), chunk `<= 2,000` chars scene-by-scene, or fall back to segmented `beatra.speech.synthesize` |
| `voice_unsupported_for_speech_to_speech` | Pick a voice with `capabilities.supports_speech_to_speech == true` from `beatra.voices.list` |
| `voice_pending_activation` | Present activation quote (`activation.quote` or `beatra.voices.activate` without `confirmation_token` + `client_request_id`) and confirm with user before calling `beatra.voices.activate` |
| `price_confirmation_required` (expired activation token) / `invalid_request` (`param="confirmation_token"` on delete) | Re-fetch free token cleanly (`voices.activate` with `voice_id` + `client_request_id` omitting `confirmation_token` for 24 h quotes, or `voices.delete` step 1 for 15 min delete tokens) and re-confirm with user |
| Noisy clone sample / clone quality rejection | Propose paid `beatra.audio.process` `operation="isolate_voice"` pre-clean (or request a cleaner dry recording) before re-cloning |
| `idempotency_conflict` / `request_in_progress` / network timeout | Reuse the same `client_request_id` ONLY for the identical request payload (`request_in_progress`: poll existing task instead); generate a new ID if any parameter changed |
| Async job taking long (`in_progress`) / `daily_limit` | Check `beatra.tasks.get` (or `beatra.tasks.list`) and never double-submit; on `daily_limit`, wait until after `00:00 UTC` (`08:00` Beijing time) |
