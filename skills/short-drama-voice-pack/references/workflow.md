# Short-Drama Voice-Pack Workflow

Use this reference for episode cast ledgers, free voice audition, Smart Voice
Director preparation, native dialogue scenes vs labeled per-line clips, cloning
confirmations, episode SFX, and `-14 LUFS` loudness finishing.

## 1. Episode cast sheet and line ledger

Keep one stable `voice_id` per character across every scene of the episode:

| Role ID | Character | Voice ID | Deliverable / Filename |
| --- | --- | --- | --- |
| `lin` | Lin Wei (Lead) | `<voice_id_lin>` | `ep12_lin_014.mp3` (or dialogue turns) |
| `chen` | Chen Mo (Rival) | `<voice_id_chen>` | `ep12_chen_015.mp3` (or dialogue turns) |
| `narr` | Narrator | `<voice_id_narr>` | `ep12_narr_001.mp3` |

Always inspect the 11 `capabilities.*` flags returned by `beatra.voices.list`
(`limit <= 500`, `cursor` pagination, bilingual `search`) and audition with
free `preview_url` or `beatra.voices.preview` before committing a role's voice.

## 2. Smart Voice Director (`beatra.speech.prepare_script`)

When an intense confrontation or whispered cliffhanger needs pacing control
without hand-written `{...}` tags or altered wording, quote `{"capability":"speech_script"}`
and call `beatra.speech.prepare_script` (max `2` concurrent calls; within `48`
hours on unchanged `input`, `instructions`, `language`, and `context`, changing
only `voice`/`model` re-compiles at zero extra cost if balance covers
admission):

```json
{
  "input": "You signed the transfer ten minutes before the board walked in.",
  "instructions": "Low restrained anger, sharp pause before ten minutes, cold finish.",
  "voice": "<voice_id_lin>",
  "model": "<selected_tts_model>",
  "client_request_id": "opaque-ep12-prep-014"
}
```

Inspect `directed` and `scripts[]`, confirm `synthesis` is non-null (if `null`, resolve via returned `warnings` first), and run
free `beatra.speech.validate` before `beatra.speech.synthesize`.

## 3. Native multi-speaker scenes vs editor line clips

- **Native scene dialogue (`beatra.speech.validate_dialogue` -> `beatra.speech.synthesize_dialogue`, `{"capability":"text_to_dialogue"}`)**:
  best for fast back-and-forth scenes with `supports_dialogue=true` voices. If a
  dialogue request is refused as too long, split it at scene or turn boundaries as
  the refusal message says (`previous_text` / `next_text` continuity where
  supported):

```json
{
  "turns": [
    {"voice": "<voice_id_lin>", "speaker": "Lin", "input": "You signed the transfer ten minutes ago."},
    {"voice": "<voice_id_chen>", "speaker": "Chen", "input": "Prove it before the elevator reaches the lobby."}
  ],
  "subtitle_enable": true,
  "client_request_id": "opaque-ep12-sc03-seg01"
}
```

- **Per-line labeled clips (`beatra.speech.validate` -> `beatra.speech.synthesize`, `{"capability":"text_to_speech"}`)**:
  best when video editors place separate files (`ep12_lin_014.mp3`), when a
  role voice lacks `supports_dialogue`, or when a dialogue request is refused
  for the number of cloned voices it uses:

```json
{
  "voice": "<voice_id_lin>",
  "input": "You signed the transfer ten minutes ago.",
  "subtitle_enable": true,
  "client_request_id": "opaque-ep12-lin-014"
}
```

## 4. Episode SFX and paid `-14 LUFS` finishing

- **Stingers and room tone (`beatra.audio.generate_sfx`)**: price live via
  `{"capability":"sound_effects"}`; always pass `model: "auto"`,
  `duration_seconds` (`0.5`–`30`), `loop: false` for impacts/slaps/door slams,
  and `loop: true` for repeating office/night room tone.
- **Loudness normalization, trim, fade (`beatra.audio.process`)**: price live
  via `{"capability":"audio_process"}` per file on the confirmation card (e.g.
  `operation: "normalize_loudness"`, `loudness_lufs: -14`, or `trim` / `fade`),
  never calling finishing free.

## 5. Voice cloning confirmations

1. Confirm explicit speaker ownership (`consent_attested: true`) before upload.
2. If noisy, clean first via paid `beatra.audio.process`
   (`operation: "isolate_voice"`, `source`, `4.6` s–`5` min, `<= 100` MB,
   `{"capability":"audio_voice_isolation"}`).
3. Select the clone model as described in [Speech, voices, cloning, and audio
   finishing](speech-and-audio.md) §5: when a cloned voice will speak in a
   native multi-character dialogue scene, select the clone card that states
   multi-speaker dialogue; a role voiced only in per-line clips keeps the
   default; when a role needs expressive delivery, select the clone card that
   states it and lists the role's language. Then confirm the Clone card with the
   live clone price (never gate behind `wallet.get` or remembered credit figures),
   submit `beatra.voices.clone` once, and handle any refusal per [Billing,
   errors, and recovery](billing-errors-and-recovery.md).
4. When a clone result or a listed voice has status `pending_activation`,
   follow §5 Step E of [Speech, voices, cloning, and audio
   finishing](speech-and-audio.md) before using the voice.
5. Voice removal requires two-step `beatra.voices.delete` (`voice_id` only
   first for warning + 15-minute token, then step 2).
