# Remake workflow

One reference clip becomes a teardown, an approved shot list, a set of beat frames, a narration track, and one finished vertical video. Two approval stages for the generation work, one review point where the user sees the real materials before the expensive video call runs, and — only when the reference is read from a link — one lookup gate ahead of all of them.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Optional lookup gate — before anything else

Only when the user brings a link and asks for it to be read. Skipping it is the ordinary shape of this route, and a teardown from screenshots is a real teardown.

The lookup is prepaid and confirmed on its own, separately from the frames and the video, because it happens before the user has seen a teardown and therefore before they have committed to anything. Name the post, its comments, or its transcript in plain words together with the `operation_key` each maps to, quote the price `beatra.social.tools.get` just returned, say how many lookups the plan contains — the post, the comments, and the transcript are three separate charges — and say that the teardown can run at no cost on what they already have. Then run it per [reading the reference from a link](reference-lookup.md).

```text
printf '%s' '{"query":"video by url","platform":"tiktok","capability_family":"content"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

One `beatra.social.execute` is one lookup and one charge; a second page of comments is a second charge and a second decision for the user. Carry every returned figure into the teardown with its read time attached.

## Free stage

Read the reference and produce the teardown per [reading the reference](teardown.md). Rewrite it onto the user's subject and produce the shot list per [rewriting onto your subject](remake-plan.md). Select a voice with `beatra.voices.list`.

Read the live cards with `beatra.models.list` for `text_to_image`, `text_to_speech`, and `image_to_video`. The image card admits the canvas and count; the speech card admits the selected voice, language, and output format; the video card admits the returned image and narration pair.

From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together with its current supported languages and compatible models. Use the live text-to-speech card to confirm the requested BCP-47 language, model behaviour, output format, and current weighted-character price.

Everything in this stage is free and revisable. The shot list is approved here, before any estimate is shown, because revising it later means redoing paid artifacts. A lookup already run cannot be un-run, which is why it has its own gate above rather than sitting inside this one.

**Budget the narration to the ceiling here, while it is still free text.** The finished clip has to be at least as long as the spoken track, and the selected live model card sets the ceiling. Total the spoken fields at roughly four to five Chinese characters or two to three English words per second, compare that against the card's longest supported duration, and cut until it fits. Do this before the shot list goes up for approval — after synthesis the same cut costs a second paid call, and after the video call it costs the most expensive one.

## Selecting the video model

This route has one hard requirement that is easy to miss: **the model must accept supplied narration.**

Read the current `image_to_video` cards and keep only models whose `input_combinations` admits `[image, driving_audio]`. Most models on this capability do not. Several that do not would accept an explicit `aspect_ratio` — which is why it is tempting to choose one and why doing so silently discards the narration.

Do not leave selection to `model: "auto"` on this route. Select a model whose live card admits the combination, and pass it explicitly. Also read that model's `duration` behaviour; current cards advertise `supports_auto: false`, so an explicit integer duration is always required.

For images and speech, omit `model` unless the user asked for a specific one.

## Approval gate 1 — preparation

Show the selected route in one block, then freeze:

- the approved shot list, which beats become generated frames, and that only the opening frame is animated into the clip while every other frame is delivered as a still for the user's own edit;
- the 9:16 canvas, **with the statement that changing the ratio later means producing every paid artifact again**;
- the ready voice ID, language, speech model behaviour, and controls;
- every paid preparation call, each with its current maximum price and stable request ID;
- that the video itself is confirmed separately.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved voice choice does not.

## Preparation — the paid frame and narration calls

One `beatra.images.generate` call per marked beat, and one `beatra.speech.synthesize` call for the whole narration. Give each its own stable opaque `client_request_id` and submit it exactly once.

```json
{
  "prompt": "The on-screen field for this beat, written as a scene: subject, framing, setting, lighting, and motion, with no dialogue.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-frame-1-id"
}
```

```json
{
  "voice": "voice_selected",
  "input": "The approved narration, all beats joined in order.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "client_request_id": "opaque-narration-id"
}
```

Use `mp3` when the live speech card supports it and the live video card accepts the resulting `audio/mpeg`. If the user asked for a format the video route will not accept, explain that before synthesizing and settle on a compatible one. Do not substitute silently.

The frame calls and the narration call are independent; any order is fine.

On narration success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`. A script preview or an expected duration is not a result.

## Review point

Show the frames. Play the narration when the host can access it. Report the real duration and the actual MIME type, size, and artifact facts. When playback or viewing is unavailable, identify that review as unavailable rather than inferring quality from task metadata.

This is the point of the whole shape: the expensive call happens only after the user has seen and heard what it will be built from.

Re-admit against the current card before continuing:

1. narration duration at or above the card minimum, currently 2 seconds;
2. the smallest integer second at or above the real narration duration is within the selected live model card's supported durations;
3. audio size within the card's `max_size_bytes`;
4. audio MIME accepted by the card;
5. the card still admits `[image, driving_audio]`.

Any failure stops here, and check 2 in particular stops here rather than resolving itself later. There is no clamp: a narration that overran the ceiling is fixed by cutting the spoken fields and synthesizing again, never by sending a shorter duration and letting the clip end mid-sentence. Re-synthesizing costs the cheapest call; discovering the same problem after the video call costs the most expensive one, and truncating quietly costs the user a clip they paid for and cannot use.

## Approval gate 2 — the shoot

Show an admission card before any video `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, approved opening frame and narration, motion direction, selected model, audio-led duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved frames or narration do not authorize the video. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Then freeze them under a new stable `client_request_id`.

## The shoot — one paid call

```json
{
  "image": { "type": "artifact", "artifact_id": "art_opening_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "the model selected above",
  "prompt": "The motion direction carried from the reference's presentation layer.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

Omit `aspect_ratio`. The frame governs it, and the narration-capable models do not accept it.

Set `duration` to the smallest integer second at or above the real narration length. Anything smaller truncates the last words, so never round down and never lower the value to reach the ceiling — a narration that does not fit was already caught at the review point and sent back for a re-synthesis. Anything larger leaves a silent hold at the end. The value passed must be a duration supported by the selected live model card; the run stops rather than trimming the narration to reach the card's ceiling. A fractional narration always leaves the shortest unavoidable tail — mention it and check the ending after delivery.

Submit `beatra.videos.animate` exactly once.

## Delivering and reviewing

Record the task ID immediately and poll that task with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the teardown, the approved shot list, every frame as a delivered still, the narration, and the returned video artifact. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A reference lookup is delivered differently — the returned payload, its task ID, the terminal status, and `billing.net_charged_credits`, with no resolved model, dimensions, or duration to report — per [reading the reference from a link](reference-lookup.md). Report only facts the task actually returned.

When the host can view or play the returned media, review the following and say which parts could not be inspected:

- **Beat match.** Each frame against the on-screen field it was written for.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Ending.** Any audible or visible silent hold or held frame.
- **Canvas.** The ratio the destination needs.
- **Structure.** Whether the finished clip still reads as the pattern the teardown named.

State visible drift honestly rather than describing an uninspected result as verified. If one focused change would help, name the smallest one and wait for a new approval — it is new paid work.

## When something is redone

Each paid artifact stands alone. Redoing one never means regenerating the others.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| One frame does not match its beat | That one `images.generate` | Every other frame and the narration |
| The narration is too long or mispronounced | Shorten that beat's spoken field, then `speech.synthesize` | The frames |
| The video is not right | `videos.animate` | The frames and the narration |
| The canvas ratio must change | Everything | Nothing — the ratio lives in the frames |
| The teardown read the reference wrong | The shot list, free | Nothing paid yet, if caught before gate 1 — a lookup already run stays spent |

## Recovery

Keep a private ledger per paid stage — a reference lookup included: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result. For a lookup, record the `operation_key` and the time it was read alongside them, because the read time travels with every figure it produced.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A reference lookup has no capability to list by: match its saved `operation_key`, arguments, and `schema_hash` against the candidates instead. A slow task is not a failed task. Never replace a running task with a duplicate.

On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. It is not a failed generation.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the reference is too thin to segment even after the one hook-and-ending question, and the user does not want a link looked up;
- the user wants a transcript for a platform other than YouTube, where no transcript operation exists — say so and take the spoken track from the file, the caption, or the user;
- a claim the user wants stated about their own subject has not been supplied;
- a media fact cannot be established, or fails the live card;
- the narration came back shorter than the selected card's minimum or longer than its longest supported duration — say so, rewrite the spoken fields to the live budget, and synthesize again rather than shortening the video to the ceiling;
- no available model admits `[image, driving_audio]`.

Do not guess a value, substitute a default silently, or submit to find out.
