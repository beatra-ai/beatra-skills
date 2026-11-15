# Seeding video workflow

A subject becomes a selected pattern, an approved shot list, beat frames, a narration track, an optional music bed, and one finished vertical video. Nothing is uploaded. Two approval stages, and one review point where the user sees the real materials before the expensive video call runs.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage

Select the pattern per [choosing the pattern](script-patterns.md) and write the shot list per [writing the spoken lines](spoken-lines.md). Discover voices with `beatra.voices.list` (bilingual `search` plus `supports_direction`, `supports_emotion`, `supports_performance_tags`, and `supports_context`, inspecting the 11 `capabilities.*` fields), and optionally play a free cached audition sample with `beatra.voices.preview` (`{"voice_id": "..."}`).

Read the live cards with `beatra.models.list` for `text_to_image`, `text_to_speech`, and `image_to_video`, plus `speech_script` when planning Smart Voice Director (`beatra.speech.prepare_script`), `text_to_music` when a bed was requested, and `audio_process` when the bed will be trimmed, faded, or loudness-normalized. The image card admits the canvas and count; the speech card admits the selected voice, language, and output format; the video card admits the returned image and narration pair.

From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together with its current supported languages, 11 `capabilities.*` flags, and compatible models. Use the live text-to-speech card to confirm the requested BCP-47 language, model behaviour, output format, and current weighted-character price, then run free `beatra.speech.validate` on the approved spoken script to confirm `valid`, `weighted_characters`, live `price_credits`, and `estimated_duration_seconds` fit inside the 12-second target (15-second max ceiling).

Everything in this stage (`voices.list`, `voices.preview`, `models.list`, `speech.validate`, and shot-list edits) is free and revisable. The shot list is approved here, before any spend estimate is committed, because revising copy later means redoing paid artifacts.

## Selecting the video model

This route has one hard requirement that is easy to miss: **the model must accept supplied narration.**

Read the current `image_to_video` cards and keep only models whose `input_combinations` admits `[image, driving_audio]`. Most models on this capability do not. Several that do not would accept an explicit `aspect_ratio` — which is why it is tempting to choose one and why doing so silently discards the narration.

Do not leave selection to `model: "auto"` on this route. Select a model whose live card admits the combination, and pass it explicitly. Also read that model's `duration` behaviour; current cards advertise `supports_auto: false`, so an explicit integer duration is always required.

For images and speech, omit `model` unless the user asked for a specific one.

## Approval gate 1 — preparation

Show the selected route in one block, then freeze:

- the approved shot list, which beats become generated frames, and that only the opening frame is animated into the clip while every other frame is delivered as a still for the user's own edit;
- the 9:16 canvas, **with the statement that changing the ratio later means producing every paid artifact again**;
- the ready voice ID, language, speech model behaviour, controls, and free `beatra.speech.validate` preflight check (`estimated_duration_seconds` and live credits);
- whether Smart Voice Director (`beatra.speech.prepare_script`, `{"capability": "speech_script"}`) will prepare pacing/pronunciation cues before synthesis as its own paid line with its own `client_request_id` (48h re-call on identical copy changing only voice/model is free; max 2 concurrent);
- whether a music bed is included and whether one combined paid `beatra.audio.process` call (`trim`, fade-in/out, and loudness normalization at live `audio_process` credits with its own `client_request_id`) will finish it to clip length — or whether the bed is delivered as a standalone track to cut in the user's editor;
- every paid preparation call, each with its current maximum price from `beatra.models.list` / `beatra.speech.validate` and its own stable `client_request_id`;
- that the video itself is confirmed separately.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved voice choice does not.

## Preparation — the paid calls

One `beatra.images.generate` call per marked beat, optional paid `beatra.speech.prepare_script` when speech direction was confirmed, one `beatra.speech.synthesize` call for the whole narration (defaulting `subtitle_enable: true` for free aligned `JSON`/`SRT`/`VTT` subtitles — never send `"subtitles"`), one `beatra.music.generate` call only when a bed was confirmed, and one paid `beatra.audio.process` call when BGM finishing was confirmed. Give each its own stable opaque `client_request_id` and submit it exactly once.

```json
{
  "prompt": "The on-screen field for this beat, written as a scene: subject, framing, setting, lighting, and motion, with no dialogue.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-frame-1-id"
}
```

If Smart Voice Director (`beatra.speech.prepare_script`) was confirmed, call it once before synthesis (`"model": "auto"` default, preserving your exact approved words and user-supplied figures; inspect `warnings` if `scripts[].synthesis` is `null`), then pass `scripts[].synthesis` unchanged alongside a fresh `client_request_id` to `beatra.speech.synthesize`:

```json
{
  "voice": "voice_selected",
  "input": "The approved narration (or scripts[0].synthesis unchanged when prepared by Smart Voice Director).",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "opaque-narration-id"
}
```

Use `mp3` when the live speech card supports it and the live video card accepts the resulting `audio/mpeg`. Keep `subtitle_enable: true` (default; never pass `"subtitles"`) to get free aligned `output.subtitles` (`JSON`, `SRT`, `VTT`) plus `speech_start_seconds`, `speech_end_seconds`, and `integrated_loudness_lufs`. If the user asked for a format the video route will not accept, explain that before synthesizing and settle on a compatible one. Do not substitute silently.

The optional bed is always instrumental, and its prompt asks for space under speech rather than a foreground melody. Check the live `text_to_music` card (`beatra.models.list`): pass explicit model selection when advertised (never silently leaving `auto` when the card requires an explicit pin) and pass `duration_seconds` / `duration_fit` only when the live card advertises them.

```json
{
  "model": "<model id selected from live text_to_music card>",
  "prompt": "Soft seeding-video bed, warm modern pop, steady gentle pulse, felt piano and airy pads, wide space left for narration, small lift at the recommendation, clean resolved ending",
  "instrumental": true,
  "title": "Quiet Recommendation",
  "client_request_id": "opaque-bed-id"
}
```

When BGM finishing (`trim` to the narration/clip duration, fade-in/out, and loudness normalization such as `-14 LUFS` / `-1 dBTP`) is confirmed, combine those flags into one paid `beatra.audio.process` call (`<= 60 min`, `<= 300 MB`, result `>= 1 s`, 50 calls/day, sequential one at a time, never called free):

```json
{
  "source": { "type": "artifact", "artifact_id": "art_bgm_track" },
  "operation": "trim",
  "start_ms": 0,
  "end_ms": 13000,
  "fade_in_ms": 400,
  "fade_out_ms": 1200,
  "loudness_lufs": -14,
  "true_peak_db": -1,
  "client_request_id": "opaque-bgm-finish-id"
}
```

The frame and music/speech branches are independent (`audio.process` waits for `music.generate` and narration duration when trimming to speech length).

On narration success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`, `audio.speech_start_seconds`, `audio.speech_end_seconds`, `audio.integrated_loudness_lufs`, and `output.subtitles.files` (`json`, `srt`, `vtt`). A script preview or an expected duration is not a result.

## Review point

Show the frames. Play the narration (and finished bed if requested) when the host can access them. Report the real duration, aligned subtitle files, and the actual MIME type, size, and artifact facts. When playback or viewing is unavailable, identify that review as unavailable rather than inferring quality from task metadata.

This is the point of the whole shape: the expensive call happens only after the user has seen and heard what it will be built from.

Re-admit against the current card before continuing:

1. narration duration at or above the card minimum, currently 2 seconds;
2. the smallest integer second at or above the real duration is within the model's supported durations;
3. audio size within the card's `max_size_bytes`;
4. audio MIME accepted by the card;
5. the card still admits `[image, driving_audio]`.

Any failure stops here. Shortening an over-long narration and synthesizing again costs the cheapest call; discovering the same problem after the video call costs the most expensive one.

## Approval gate 2 — the shoot

Show an admission card before any video `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, approved opening frame and narration, motion direction, selected model, audio-led duration, resolution if set, provisional live estimate, whether any `free_first_video` offer on the live card applies (welcome signup credits alone usually cannot start a paid video call), and what happens if the balance is short. Planning, comparison, or “make the clip” is not approval. Approved frames or narration do not authorize the video. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Then freeze them under a new stable `client_request_id`.

## The shoot — one paid call

```json
{
  "image": { "type": "artifact", "artifact_id": "art_opening_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "the model selected above",
  "prompt": "A steady hold on the subject with natural light and unhurried motion.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

Omit `aspect_ratio`. The frame governs it, and the narration-capable models do not accept it.

Set `duration` to the smallest integer second at or above the real narration length. Smaller truncates the last words; larger leaves a silent hold at the end. A fractional narration always leaves the shortest unavoidable tail — mention it and check the ending after delivery.

Submit `beatra.videos.animate` exactly once.

## Delivering and reviewing

Record the task ID immediately and poll that task with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the selected pattern, the approved shot list, every frame as a delivered still, the narration and free aligned `output.subtitles` (`JSON`, `SRT`, `VTT`), any music bed (raw or finished with `audio.process`) with its returned duration, the finished clip, each task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. Report only actual returned facts.

When the host can view or play the returned media, review the following and say which parts could not be inspected:

- **Beat match.** Each frame against the on-screen field it was written for.
- **The bed**, when one was made. Genre and mood against the brief, whether the mix leaves room for a voice, and its real returned duration. Say so if the host cannot hear it.
- **Look consistency.** Whether the frame set reads as one video rather than several.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Ending.** Any audible or visible silent hold or held frame.
- **Canvas.** The ratio the destination needs.

State visible drift honestly rather than describing an uninspected result as verified. If one focused change would help, name the smallest one and wait for a new approval — it is new paid work.

## When something is redone

Each paid artifact stands alone. Redoing one never means regenerating the others.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| One frame does not match its beat | That one `images.generate` | Every other frame, the narration, the bed |
| The frame set drifts in style | The frames that drift, with the look restated | The narration and the bed |
| The narration is too long or mispronounced | Tighten spoken copy, verify with free `speech.validate`, run optional `speech.prepare_script` (48h voice/model switch on identical script free), then `speech.synthesize` | The frames and the bed |
| The bed needs cutting/fading/loudness adjustment (track itself works) | `audio.process` (`trim`/`fade`/`normalize_loudness`, new paid card) | The generated bed, frames, narration, clip |
| The bed itself is wrong | `music.generate` (plus new `audio.process` if finishing) | Everything else |
| The video is not right | `videos.animate` | The frames, the narration, the bed |
| The canvas ratio must change | Everything visual | The narration and the bed |
| The pattern was the wrong choice | The shot list, free | Nothing paid yet, if caught before gate 1 |

## Recovery

Keep a private ledger per paid stage: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, call `beatra.tasks.list` for that capability, call `beatra.tasks.get` on plausible candidates, and match them against the ledger before considering a retry. If the request ID itself is lost, do not invent a new one and do not replay: attempt task recovery and stop if the original cannot be identified. A slow task is not a failed task. Never replace a running task with a duplicate.

On `insufficient_balance`, relay the returned message, keep the top-up URL inside the balance error exact, and retry the same frozen `client_request_id` only after the user says they have topped up. It is not a failed generation.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the subject is too vague to select a pattern, even after one clarifying question;
- a claim the user wants stated has not been supplied and the beat cannot be written around it;
- a media fact cannot be established, or fails the live card;
- the narration is shorter than the card minimum, or longer than the longest video that can contain it;
- no available model admits `[image, driving_audio]`.

Do not guess a value, substitute a default silently, or submit to find out.
