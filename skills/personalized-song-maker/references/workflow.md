# Story-to-song workflow

## Collect the story brief

Gather the intake that turns a real story into an original song. Record the occasion, recipient or audience, relationship to the recipient, protagonist, turning point, memorable details, names or phrases that must appear, song language, emotional direction, must-keep facts, and any private details to omit. Build a story map: protagonist, relationship, turning point, memorable details, core message, hook, emotional arc, and ending.

Ask only for a missing hard input. Reuse the known genre, mood, instrumentation, tempo feel, and vocal direction preferences when the user has already named them. Do not invent biographical facts; if a must-include detail is unclear, ask before drafting.

## Draft lyrics and direction for free

Lyrics writing, title drafting, section planning, and creative direction are free preparation that happens before any paid call. From the story map, draft a title, full lyrics with a clear section structure, and a production card: genre, mood, instrumentation, tempo feel, and vocal direction. Use section tags the chosen model family expects; keep the narrative arc and the hook legible, and make sure every must-include name or phrase appears in the approved text.

Show the user the must-keep facts and the lyric draft for approval. Revise the lyrics and direction until the user approves them. This revision is free; it does not consume credits and does not create a task. Only an instruction to generate the song from the approved inputs counts as approval for the paid stage.

For every Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"text_to_music"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the live music catalog

Before the paid generation, call `beatra.models.list` with `{"capability":"text_to_music"}` and inspect the current catalog. Confirm the live prompt, lyrics, and title character limits, supported languages, available controls, and price basis. Some model families require a nonempty title and lyrics for vocal generation; others reject caller-supplied lyrics unless a specific mode is enabled. These are live facts to read, not permanent constants or a reason to hard-code a model.

Keep `model: "auto"` unless the user chose a concrete eligible model. Send only controls published by the chosen family and never mix family-specific options. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Build and submit the song

Freeze the approved title, approved lyrics, and a production prompt that encodes genre, mood, instrumentation, tempo feel, and vocal direction. Keep the prompt within the live character limit; keep the lyrics within the live lyric limit; keep the title within the live title limit. The normal music payload is:

```json
{
  "prompt": "Warm acoustic pop, gentle guitar and piano, heartfelt mid-tempo vocal delivery.",
  "lyrics": "[Verse 1]\n...approved lyrics...\n[Chorus]\n...approved lyrics...",
  "title": "Approved Title",
  "client_request_id": "opaque-song-id"
}
```

Show the exact approved title, approved lyrics, production prompt, model behavior, explicit controls, output count, and paid boundary: one generation, its provisional live estimate, what the user keeps if they stop here, and the returned top-up message when the balance is short. Freeze all arguments and one opaque stable request ID. Submit `beatra.music.generate` exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for the song stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only its identical frozen payload with its same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful song, deliver every returned audio artifact or link and report only actual task status, resolved model, clip count, duration, format, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Listen for story accuracy against the approved must-keep facts, name pronunciation, the hook, lyric rendering, emotion, arrangement, vocal result, audio quality, and actual duration. If a must-include name or phrase was not rendered as expected, name the smallest change and wait for a new paid approval. State inspection limits honestly.

## Extra files and audio finishing for the chosen song

Offer these only after the user has listened and chosen a take. Every step below is paid, never free, requires its own live price check from `beatra.models.list`, and gets its own six-field production card with its own `client_request_id` (none rides on the song's card; see [music editing and audio](music-editing-and-audio.md)).

### Native deliverables (`beatra.music.edit`)

Only when the chosen clip's `editable` field is `{"native": true}`, offer `beatra.music.edit` with `operation: "deliverable"`:

- Extra cover art, `kind: "cover_image"`: priced with `{"capability": "music_cover_image"}`, on its own card with its own `client_request_id`.
- A song video (MP4), `kind: "video_mp4"`: priced with `{"capability": "music_video"}`, on its own card with its own `client_request_id`. `video_options.author` and `video_options.brand_text` (up to 50 characters each) appear in the video; use only words the user gave.
- A WAV version, `kind: "wav"`: priced with `{"capability": "music_wav"}`, on its own card with its own `client_request_id` (not mastered).

### Audio finishing (`beatra.audio.process`)

Check the live price with `{"capability": "audio_process"}` before presenting the card. Use `operation` (never `action`) and `source` (`{"type": "artifact", "artifact_id": "..."}` or URL). Fade, loudness, and format options supplied inside the same `trim`, `loop`, `fade`, or `normalize_loudness` call add no separate charge, while the finishing call itself is billed at `audio_process`:

- **`trim`** (`start_ms`/`end_ms` or `target_duration_ms`, plus optional `fade_in_ms`, `fade_out_ms`, `fade_curve`, `loudness_lufs`, `format`): extract a short chorus or wedding-entrance excerpt from the chosen take.
- **`fade`** (`fade_in_ms`, `fade_out_ms`, `fade_curve`: `tri`/`exp`/`log`/`qsin`) and **`normalize_loudness`** (`loudness_lufs` `-30` to `-9`, default `-14`; `true_peak_db` `-9` to `0`, default `-1`): finish endings or playback loudness.
- **`loop`** (`target_duration_ms` or `loop_count`, `crossfade_ms`, `end_with_fade`): repeat a background clip cleanly; report the returned seam smoothness score plainly without promising an inaudible seam.
- **`convert_format`** (`format`: `mp3`/`wav`/`ogg`/`flac`/`m4a`/`ulaw_8k_wav`): convert format, or export WAV when `editable` is not `{"native": true}` — tell the user plainly it is a WAV container of the same audio rather than a mastered or higher-quality source.

Example `beatra.audio.process` trim with fade-out:

```json
{
  "operation": "trim",
  "source": {"type": "artifact", "artifact_id": "artifact_song_take"},
  "start_ms": 42000,
  "target_duration_ms": 60000,
  "fade_out_ms": 1500,
  "fade_curve": "exp",
  "client_request_id": "opaque-song-trim-01"
}
```

Pass the JSON on standard input to `python3 scripts/mcp_client.py call beatra.audio.process`, poll `beatra.tasks.get` until terminal, and recover lost IDs under `capability: "audio_process"`.
