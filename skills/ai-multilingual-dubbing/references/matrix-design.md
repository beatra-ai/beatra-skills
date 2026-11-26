# Matrix Design

Build one `segment × locale` production matrix before proposing paid audio.

## Cell schema

Track these columns for every planned segment and locale:

- `cell_id`, segment label, normalized BCP-47 `language`, and target duration
- workflow path (`speech.synthesize`, `speech.convert`, `audio.transcribe` draft,
  `speech.prepare_script`, `isolate_voice`, `voices.clone`, `normalize_loudness`)
- exact `voice_id` from live `beatra.voices.list`, `model` (`auto` or explicit)
- approved spoken text or uploaded `artifact_id`, protected terms, and format
- `subtitle_enable: true` when SRT/VTT captions help downstream localization
- local `client_request_id`, `task_id`, `artifact_id`, returned duration, and
  `billing.net_charged_credits`

## 11-dimension casting, free audition, and voice cloning

1. Search live ready voices via `beatra.voices.list` (`category`, `language`,
   `gender`, `age_group`, `use_case`, `emotion`, `supports_context`,
   `supports_direction`, `supports_performance_tags`, `supports_dialogue`,
   `supports_speech_to_speech`) and audition free using `preview_url` or
   `beatra.voices.preview` (`{"voice_id": "..."}`).
2. Normalize BCP-47 tags (`nb` -> `no`, `tl` -> `fil`, lowercase primary tag)
   and check both `voice.language` and `voice.languages_supported`.
3. For `model: "auto"`, keep only when EVERY candidate in
   `models.list.auto.candidate_order ∩ selected_voice.compatible_models`
   supports the requested language; otherwise pick a live compatible explicit model.
4. When cloning an authorized brand narrator (`beatra.voices.clone`): confirm
   plain consent before `scripts/mcp_client.py upload`, offer paid
   `isolate_voice` (`4.6 s–5 min`, `<= 100 MB`, `source` field, checked via
   `beatra.models.list` with `{"capability": "audio_voice_isolation"}`) if the sample has noise/music, and select the clone
   model from `beatra.models.list` (`{"capability": "voice_clone"}`) as described in [speech and audio guide](speech-and-audio.md) §5. When
   the cloned voice will be the target of speech-to-speech conversion, select the
   clone card that states it. Then show the six-field card with the live clone
   price; after the user approves it, submit once and handle any refusal per
   [billing, errors, and recovery](billing-errors-and-recovery.md). When a clone
   result or a listed voice has status `pending_activation`, follow §5 Step E of
   [speech and audio guide](speech-and-audio.md) before using the voice; route a
   voice edit or deletion to `voice-cloning-studio` / `beatra-ai-voice-studio`
   (`scripts/mcp_client.py tools` is authoritative).

## Live price estimation

Inspect `beatra.models.list` for each active capability (`{"capability": "speech_script"}`,
`{"capability": "text_to_speech"}`, `{"capability": "speech_to_speech"}`,
`{"capability": "voice_clone"}`, `{"capability": "speech_to_text"}`,
`{"capability": "audio_voice_isolation"}`, `{"capability": "audio_process"}`) and apply the returned live formula.
Count text dynamically with `beatra_weighted_characters` (Han = 2, every other character = 1; reconstruct the full spoken sentence per locale without truncating at unquoted CSV commas before counting).
Never cite hardcoded credit figures or force `beatra.wallet.get` before quoting.
