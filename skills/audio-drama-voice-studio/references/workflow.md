# Audio drama workflow

## Build the cast sheet

Read the script and list every speaking part before any paid call. For each
character record the name as it appears in the script, age and temperament, how
they should sound relative to the others, and whether they narrate as well as
speak. Add a narrator row when the script carries narration.

Divide the script into numbered scenes and speaker turns in exact script order
(never reorder speakers). Decide between native multi-speaker dialogue and
per-block synthesis using the live constraints:

- **Native multi-speaker dialogue (`beatra.speech.synthesize_dialogue`)**:
  preferred for cohesive interactive scenes with `2–50` turns, `<= 2,000`
  characters total, up to `10` unique voices having
  `capabilities.supports_dialogue == true`, and `<= 4` ready cloned voices. For
  longer episodes exceeding `2,000` chars or `50` turns, chunk cleanly at
  scene boundaries passing `previous_text` and `next_text` across boundary chunks.
- **Segmented per-block synthesis (`beatra.speech.synthesize`)**: use when a
  scene requires voices with `supports_dialogue == false`, `> 10` dialogue
  voices, `> 4` ready clones, specialty regional dialects, or single-line
  isolated re-recording discipline. One block holds one character's continuous
  turn so a single line revision never replays the whole scene.

## Discover, audition, and freeze one voice per character

Call `beatra.voices.list` (bilingual `search`, `limit <= 500`, `cursor`, facet
filters, and `supports_dialogue=true` when using `synthesize_dialogue`) only when
voices are still needed or the user wants to browse/compare. Inspect all `11`
`capabilities.*` metadata fields (`supports_direction`, `supported_emotions`,
`supports_performance_tags`, `supported_dialects`, `supports_context`,
`supports_previous_text`, `supports_next_text`, `supports_pronunciation_pinyin`,
`supports_pronunciation_ipa`, `supports_speech_to_speech`, `supports_dialogue`)
before freezing one opaque `status: "ready"` `voice_id` per role. Contrast matters:
choose voices distinguishable in the pitch and energy ranges the script uses.

Call free `beatra.voices.preview` (`{"voice_id": "..."}`) to return
`preview_url` (`kind`) so the user can audition candidates at zero cost.

## Optional Smart Voice Director and free preflight

When dramatic beats, pauses, emotion shifts, or pronunciation cues benefit from
AI direction without changing dialogue wording (never hand-write braced tags),
inspect `beatra.models.list` `{"capability": "speech_script"}` and confirm paid
**Smart Voice Director** (`beatra.speech.prepare_script`): pass `input`
(`1–50,000` chars), optional `instructions` (`<= 2,000` chars), `voice`,
`model`, `language`, optional `context`, and `client_request_id`. Check
`directed` and `scripts[]`: if any `synthesis` is `null`, adjust per `warnings`;
pass ready `scripts[].synthesis` unchanged + a fresh `client_request_id` to
synthesis. Respect the max `2` concurrent cap; within 48 hours on identical
text, `instructions`, `language`, and `context`, calling `prepare_script` again
changing only `voice` (and `model`) reuses direction at zero charge (balance
must still cover admission).

Before every synthesis submit, read live `beatra.models.list` pricing (`text_to_dialogue`
or `text_to_speech`) and run **free preflight**:

- Dialogue: `beatra.speech.validate_dialogue` (`valid`, turn/`<= 2,000`-char/voice
  checks, `estimated_credits`, `estimated_duration_seconds`, `warnings`).
- Single block: `beatra.speech.validate` (`valid`, `weighted_characters`,
  `estimated_duration_seconds`, live `price_credits`, `execution`, `warnings`).

## Synthesize scenes or blocks

Native dialogue scene (`beatra.speech.synthesize_dialogue`):

```bash
python3 scripts/mcp_client.py call beatra.speech.synthesize_dialogue
```

```json
{
  "turns": [
    {"voice": "<lin_voice_id>", "speaker": "Lin", "input": "I told you this door was never meant to be opened."},
    {"voice": "<mei_voice_id>", "speaker": "Mei", "input": "Too late—the key just snapped inside!"}
  ],
  "model": "auto",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "opaque-scene-03-chunk-01"
}
```

Single block fallback (`beatra.speech.synthesize`):

```bash
python3 scripts/mcp_client.py call beatra.speech.synthesize
```

```json
{
  "voice": "<opaque voice_id>",
  "input": "I told you this door was never meant to be opened.",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "opaque-block-07-id"
}
```

Keep `subtitle_enable: true` (default; never pass `subtitles`) to return free
JSON/SRT/VTT subtitles and dialogue `segments[]` (`turn_index`, `voice_id`,
`speaker`, `start_seconds`, `end_seconds`). Submit each approved payload once
with its own `client_request_id` and poll `beatra.tasks.get` until terminal.

## Optional sound effects and audio finishing (paid steps)

When the script calls for dramatic foley, scene transitions, seamless room
ambience, or broadcast loudness calibration — each approved on its own itemized
paid card/line and **never** called free:

- **Foley & ambience (`beatra.audio.generate_sfx`)**: read `beatra.models.list`
  with `{"capability": "sound_effects"}`, pass descriptive `"prompt"` (`1–450`
  chars), `"duration_seconds"` (`0.5–30.0`), optional `"loop": true` for
  seamless ambient beds, `"prompt_influence"` (`0.0–1.0`), `"format"`, and
  `"model": "auto"`.
- **Audio finishing (`beatra.audio.process`)**: read `beatra.models.list` with
  `{"capability": "audio_process"}` and run one operation at a time (`<= 60 min`,
  `<= 300 MB`, min result `>= 1 s`, `50 calls/day`) — e.g.
  `operation="normalize_loudness"` (`loudness_lufs` `-30` to `-9`, default `-14`,
  `true_peak_db` `-9` to `0`, default `-1`), `"trim"`, or `"fade"`.

## Estimate the cost honestly

Speech is charged linearly per 1,000 weighted characters (each Han ideograph = 2,
every other character = 1), with sub-1,000 calls charged proportionally for exact
weighted characters. Compute estimates from `beatra.speech.validate`,
`beatra.speech.validate_dialogue`, and live `beatra.models.list` cards
(`estimate_formula`, `unit_price_credits`, `scale`) — never from memory.
Terminal usage and billing are the final truth.

## Use a cloned voice (3 mandatory confirmations)

Use `beatra.voices.clone` only when the user explicitly confirms ownership or
permission for the sample:

1. **Confirmation #1 — Consent**: confirm ownership or speaker permission in the
   current conversation before running
   `python3 scripts/mcp_client.py upload <path> --mime-type <type>`. Possession
   is never consent.
2. **Noisy sample check (paid)**: if music, noise, or echo is present, propose
   paid `beatra.audio.process` (`operation="isolate_voice"`, `source`,
   `{"capability": "audio_voice_isolation"}`, `4.6 s – 5 min`, `<= 100 MB`,
   default `wav`) on its own card before cloning.
3. **Select the clone model & present the six-field clone card**: select the
   clone model as described in
   [speech, voices, cloning, and audio finishing](speech-and-audio.md) §5. When a
   role speaks in a multi-character dialogue scene or needs expressive delivery,
   select the clone card that states it; otherwise keep the default. Show the
   six-field clone card with the live clone price (Work, live Credits, Count,
   Identity, If we stop here, If balance short — do not make `wallet.get` a
   mandatory gate or ask user to confirm sufficient credits). After the user
   approves it, set `consent_attested: true`, call `beatra.voices.clone` once,
   and handle any refusal per
   [billing, errors, and recovery](billing-errors-and-recovery.md):

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Approved display name",
     "consent_attested": true,
     "client_request_id": "new-local-opaque-id"
   }
   ```

4. **Poll and check status**: poll `beatra.tasks.get`. A voice with
   `status="ready"` is ready to cast. When a clone result or a listed voice has
   status `pending_activation`, follow §5 Step E of
   [speech, voices, cloning, and audio finishing](speech-and-audio.md) before
   using the voice (**Confirmation #2**, `beatra.voices.activate`).
5. **Confirmation #3 — Two-step deletion (`beatra.voices.delete`)**: first call
   `beatra.voices.delete` with `voice_id` only, show `paid_slot_warning`,
   `irreversible_notice`, and 15-minute `token_expires_at`, wait for approval,
   then submit step 2 with `voice_id` and `confirmation_token`.

## Poll, recover, and cancel

Keep a private ledger row per scene/block/clip: role, sequence index, voice ID,
exact text, stable `client_request_id`, approval, create response, `task_id`,
and terminal result. `queued` and `running` mean wait via `beatra.tasks.get`.

- Lost create response: replay ONLY identical JSON with the same
  `client_request_id`.
- Lost `task_id`: paginate `beatra.tasks.list` by exact capability (following
  every `next_cursor`) and verify candidates with `beatra.tasks.get`. Stop if
  ambiguous or if `client_request_id` itself is lost.
- `insufficient_balance`: relay official message + verbatim `topup_url`, wait
  for user top-up confirmation, then replay identical payload + ID. If the
  refusal names another way forward, present it too and follow
  [billing, errors, and recovery](billing-errors-and-recovery.md).
- `voice_model_incompatible` / `voice_not_found` / dialogue bounds exceeded: run
  `beatra.speech.validate_dialogue`, keep `<= 10` `supports_dialogue=true`
  voices (`<= 4` clones), chunk `<= 2,000` chars per scene, or fall back to
  segmented `beatra.speech.synthesize`.
- Cancel only at user request (`beatra.tasks.cancel` once; on `409`, keep polling
  the same task). Recover only failed segments while leaving delivered clips
  intact.

## Deliver and review real results

Deliver scenes/blocks in script order with speaker labels, free aligned
subtitles (`output.subtitles` / `segments[]`), actual duration, size, MIME type,
URL/artifact ID, resolved model, and `billing.net_charged_credits` — plus any
separately produced SFX/ambient beds or loudness-calibrated files as their own
artifacts for editor assembly. Review only audio the host can play; state
explicitly when listening review was not possible.

## Balance and deductions

Answer balance or charge questions with read-only `beatra.wallet.get` or
`beatra.wallet.ledger`. Never derive live prices from ledger rows, and never
make `wallet.get` a mandatory gate before submit. See
[speech, voices, cloning, and audio finishing](speech-and-audio.md).
