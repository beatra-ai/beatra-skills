# Remake workflow

One reference clip becomes a teardown, an approved shot list and rebuild plan, a set of beat frames, a narration track, and — depending on the chosen route — either one finished vertical video or a segmented set of sources with captions and a timecoded edit list for the user's own cut. Two approval stages for the generation work, one review point where the user sees the real materials before the expensive video work runs, and, ahead of all of them, up to two paid calls each confirmed on its own: a lookup, only when the reference is read from a link, and a `beatra.videos.understand` read, only when the reference is a video file whose frames still need reading.

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

## Reading the reference — a gate when the reference is a video file

Only when the reference is a video file whose actual frames still need reading. For screenshots, a transcript, or the user's own account of it, this cost never arises, and the teardown from those is just as real.

Reading those frames is one `beatra.videos.understand` call, billed per admitted input-video second, per [reading the reference](teardown.md). **It admits at most 50 MiB and 360 seconds of input video — a fixed tool limit, not a live-card figure — and rejects anything past either one before any charge is made.** State both limits before the price is quoted, so a long or heavy reference is ruled in or out before the user commits to anything. It is prepaid and confirmed on its own, separately from the frames and the video, the same way the lookup above is: read the live per-second price from `beatra.models.list` with capability `video_to_text`, quote that — never a number from memory — and say plainly that the teardown can still run at no cost from screenshots, a transcript, or the user's own account instead. Only once the user agrees, and the file is confirmed to sit inside both limits, does `beatra.videos.understand` run.

```text
printf '%s' '{"capability":"video_to_text"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Once that call has run — or once the user has supplied screenshots, a transcript, or their own account instead — nothing further is charged until approval gate 1: the teardown, the rewrite, the shot list, and the route decision are all free.

## Free stage

Produce the teardown from whatever reference material is now in hand — the paid `beatra.videos.understand` read if it ran, or the screenshots, transcript, or account the user gave instead — per [reading the reference](teardown.md). Rewrite it onto the user's subject and produce the shot list per [rewriting onto your subject](remake-plan.md). Select a voice with `beatra.voices.list`.

Read the live cards with `beatra.models.list` for `text_to_image` and `text_to_speech`: the image card admits the canvas and count, the speech card admits the selected voice, language, and output format. Also read the live card for whichever video capability the shoot call will actually use — `image_to_video` for `beatra.videos.animate`, `frames_to_video` for `beatra.videos.interpolate`, `reference_to_video` for `beatra.videos.generate_from_references` on a segmented rebuild's unit built from ordered references, or `video_extend` when a shot must be continued past the unit ceiling — since that is the card whose admitted input combination and supported duration actually govern this route's video call, not any other capability's.

From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together with its current supported languages and compatible models. Use the live text-to-speech card to confirm the requested BCP-47 language, model behaviour, output format, and current weighted-character price.

Everything in this stage is free and revisable. The shot list is approved here, before any estimate is shown, because revising it later means redoing paid artifacts. A lookup already run cannot be un-run, and neither can a `beatra.videos.understand` read already run — that is why each has its own gate above rather than sitting inside this one.

**Budget the narration before the shot list goes up for approval, while it is still free text.** For a single continuous take, the finished clip has to be at least as long as the spoken track, and the selected live model card sets the ceiling: total the spoken fields at roughly four to five Chinese characters or two to three English words per second, compare that against the card's longest supported duration, and cut until it fits. A segmented rebuild does not carry that same ceiling on the narration as a whole — the unit split is what absorbs a clip longer than any one model card allows, and the single continuous track is one the user aligns in their own editor from the edit list's timecodes rather than one that drives any unit's duration, per [three rebuild routes](rebuild-routes.md). Do this before the shot list goes up for approval regardless of route — after synthesis the same cut costs a second paid call, and after a video call it costs one of the most expensive ones.

## Selecting the video model

For a single continuous take, this route has one hard requirement that is easy to miss: **the model must accept supplied narration.**

Which capability's cards you read follows from which call the take actually makes, and there are two of them: `image_to_video` when the call is `beatra.videos.animate`, whose request carries a first-frame `image` and an optional `driving_audio`; `frames_to_video` when it is `beatra.videos.interpolate`, whose request carries a required `last_frame`, an optional `first_frame`, and an optional `driving_audio`. Read that capability's current cards and keep only models whose `input_combinations` admits the narration **alongside whichever frames that call supplies** — `driving_audio` together with `image` on an `image_to_video` card, `driving_audio` together with the first-frame-and-last-frame pairing the card advertises on a `frames_to_video` card. Do not test against one fixed combination literal: a `frames_to_video` card never advertises `[image, driving_audio]`, and matching on that string alone would rule out every model on a capability this route legitimately runs on, leaving the `beatra.videos.interpolate` path with no model it can select.

Most models on either capability do not admit the narration at all. Several that do not would accept an explicit `aspect_ratio` — which is why it is tempting to choose one and why doing so silently discards the narration.

`beatra.videos.generate_from_references` is not a third option here. Its capability, `reference_to_video`, takes a prompt and an ordered `references` list and has no driving-audio field at all, and an unrecognised field is dropped rather than refused — so it never carries a single continuous take, whatever locks the mode engages. A subject or product lock on this route is satisfied in the reference frame the call animates instead, per [rewriting onto your subject](remake-plan.md).

Do not leave selection to `model: "auto"` on this route. Select a model whose live card admits that combination, and pass it explicitly. Also read that model's `duration` behaviour on the live card rather than assuming it — every card seen so far that admits supplied narration has also advertised `supports_auto: false`, so treat an explicit integer duration as the default expectation, but confirm that against the card in hand each time rather than skipping the check.

Under a segmented rebuild, no unit's generation call carries the narration as input at all — the single continuous track is delivered separately, and the user aligns it in their own editor from the edit list's timecodes, per [three rebuild routes](rebuild-routes.md) — so the narration requirement above does not narrow which model a unit can use, and `reference_to_video` is open to a unit that needs several ordered references to hold an identity steady. Still select each unit's model explicitly rather than `auto`, read the card for whichever capability that unit's own call uses, and read its `duration` behaviour before committing to it.

For images and speech, omit `model` unless the user asked for a specific one.

## Approval gate 1 — preparation

Show the selected route in one block, then freeze:

- the approved shot list, which beats become generated frames, and — per the chosen route — either that only the opening frame is animated into the clip while every other marked frame is delivered as a still for the user's own edit, or that each unit in the sequence gets its own reference frame and its own generation call, delivered as segment sources with captions and a timecoded edit list, per [three rebuild routes](rebuild-routes.md);
- the 9:16 canvas, **with the statement that changing the ratio later means producing every paid artifact again**;
- the ready voice ID, language, speech model behaviour, and controls — or, when the user chose to clone one instead, the live `voice_clone` price and that clone's own stable request ID;
- every paid preparation call, each with its current maximum price and stable request ID — a voice clone included, whenever one ran;
- that the video itself is confirmed separately.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved voice choice does not.

## Preparation — the paid frame and narration calls

**When the voice lock is satisfied by cloning instead of a ready pick.** The default costs nothing: pick one `status: ready` voice with `beatra.voices.list` and reuse that id for the whole clip — offer this first. Only when the user explicitly asks for a voice built from their own sample does `beatra.voices.clone` run, and it is gated exactly like every other paid call here: read the live `voice_clone` card with `beatra.models.list`, quote its current price, and get the user's explicit confirmation before submitting. Set `consent_attested: true` only once the user attests they hold the rights to clone that sample — never set it on their behalf. Give the clone its own stable `client_request_id`, submit it once, and poll it with `beatra.tasks.get` to terminal before using its returned voice id as `voice` in the narration call below.

```json
{
  "sample": { "type": "artifact", "artifact_id": "art_voice_sample" },
  "display_name": "Cloned voice for this remake",
  "consent_attested": true,
  "client_request_id": "opaque-voice-clone-id"
}
```

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

This is the point of the whole shape: the expensive video work — one call or one per unit, depending on the route — happens only after the user has seen and heard what it will be built from.

Re-admit against the current card before continuing. For a single continuous take:

1. narration duration at or above the card minimum, currently 2 seconds;
2. the smallest integer second at or above the real narration duration is within the selected live model card's supported durations;
3. audio size within the card's `max_size_bytes`;
4. audio MIME accepted by the card;
5. the card still admits the narration alongside whichever frames this take's call supplies — `driving_audio` with `image` when the call is `beatra.videos.animate`, or `driving_audio` with the card's own first-frame-and-last-frame pairing when it is `beatra.videos.interpolate`. Re-admit against the combination that call actually sends, not against one fixed literal.

Any failure stops here, and check 2 in particular stops here rather than resolving itself later. There is no clamp: a narration that overran the ceiling is fixed by cutting the spoken fields and synthesizing again, never by sending a shorter duration and letting the clip end mid-sentence. Re-synthesizing costs the cheapest call; discovering the same problem after the video call costs the most expensive one, and truncating quietly costs the user a clip they paid for and cannot use.

Under a segmented rebuild, checks 1, 2, and 5 do not apply — no unit's call takes the narration as input, so nothing about the track's length is re-admitted against any single card. Re-admit each unit's own `duration` against the selected card's supported durations instead, using that unit's slice of table 3's timing, not the whole narration; still re-admit the narration track itself on size and MIME before delivering it.

## Approval gate 2 — the shoot

Show an admission card before any video `client_request_id` or generation call runs: the video capability this call actually uses — `image_to_video` for `beatra.videos.animate`, `frames_to_video` for `beatra.videos.interpolate`, `reference_to_video` for `beatra.videos.generate_from_references` on a segmented rebuild's unit built from ordered references, or `video_extend` for `beatra.videos.extend` when a single shot continues past the unit ceiling — the call this route makes, once for a single continuous take, or once per unit for a segmented rebuild, per [three rebuild routes](rebuild-routes.md) — the approved reference frame or frames (or that unit's ordered reference list, when it is built from one) and the narration, motion direction, selected model, the duration — audio-led for a single continuous take, or each unit's own table-derived duration for a segmented rebuild — resolution if set, the provisional live estimate for the whole run, the fact that the standard signup credit usually cannot start this video, and what happens if the balance is short. Planning, comparison, or “make the clip” is not approval. Approved frames or narration do not authorize the video. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Then freeze them under a new stable `client_request_id` — one per unit when the route splits into more than one.

## The shoot — one paid call per unit

A single continuous take is one unit and one call. A segmented rebuild repeats this call once per unit in the sequence, each with its own reference frame; continuity across units inside one scene carries the previous unit's last frame into this unit as its own first frame, via `beatra.videos.animate` — the next unit only ever inherits one frame, never two, so `beatra.videos.interpolate` does not apply there, per [three rebuild routes](rebuild-routes.md).

Use `beatra.videos.animate` whenever the unit has only a first frame — its own opening reference frame, or the previous unit's last frame carried forward. A single continuous take sends the narration; a segmented unit does not:

```json
{
  "image": { "type": "artifact", "artifact_id": "art_reference_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "the model selected above",
  "prompt": "The motion direction carried from the reference's presentation layer.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

```json
{
  "image": { "type": "artifact", "artifact_id": "art_previous_last_frame" },
  "model": "the model selected above",
  "prompt": "The motion direction carried from the reference's presentation layer.",
  "duration": 8,
  "client_request_id": "opaque-video-id"
}
```

Use `beatra.videos.interpolate` only when the unit genuinely has both a first frame and a required last frame locked. Its payload takes `first_frame` (optional) and `last_frame` (required) — never `image`. Same split: narration rides only on a single continuous take:

```json
{
  "first_frame": { "type": "artifact", "artifact_id": "art_first_frame" },
  "last_frame": { "type": "artifact", "artifact_id": "art_last_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "the model selected above",
  "prompt": "The motion direction carried from the reference's presentation layer.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

```json
{
  "first_frame": { "type": "artifact", "artifact_id": "art_first_frame" },
  "last_frame": { "type": "artifact", "artifact_id": "art_last_frame" },
  "model": "the model selected above",
  "prompt": "The motion direction carried from the reference's presentation layer.",
  "duration": 8,
  "client_request_id": "opaque-video-id"
}
```

Use `beatra.videos.generate_from_references` instead of either — **on a segmented rebuild only** — for a unit that needs several ordered references to hold a subject or product identity steady. Its payload takes an ordered `references` list, never `image` or a `first_frame`/`last_frame` pair, and it has no `driving_audio` field at all. That is exactly why it fits a segmented rebuild, whose unit calls carry no narration, and why it never runs on a single continuous take, which is audio-led: there the lock is satisfied in the reference frame that `beatra.videos.animate` or `beatra.videos.interpolate` animates, per [rewriting onto your subject](remake-plan.md). The payload for such a unit:

```json
{
  "references": [
    { "kind": "image", "media": { "type": "artifact", "artifact_id": "art_subject_reference" } },
    { "kind": "image", "media": { "type": "artifact", "artifact_id": "art_reference_frame" } }
  ],
  "model": "the model selected above",
  "prompt": "The motion direction carried from the reference's presentation layer.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

For a single continuous take, omit `aspect_ratio` from whichever of the two calls runs: the frame governs it, and on today's live cards the models that admit supplied narration do not also admit `aspect_ratio` — check that against the selected live card rather than assuming it holds for every model. Under a segmented rebuild, no unit call carries the narration as `driving_audio`, so read the selected unit model's own live card for whether it accepts or requires `aspect_ratio`, and pass it only if the card admits it.

For a single continuous take, set `duration` to the smallest integer second at or above the real narration length. Anything smaller truncates the last words, so never round down and never lower the value to reach the ceiling — a narration that does not fit was already caught at the review point and sent back for a re-synthesis. Anything larger leaves a silent hold at the end. The value passed must be a duration supported by the selected live model card; the run stops rather than trimming the narration to reach the card's ceiling. A fractional narration always leaves the shortest unavoidable tail — mention it and check the ending after delivery. Under a segmented rebuild, each unit's `duration` instead follows its own slice of table 3's timing, per [three rebuild routes](rebuild-routes.md); the single narration track is delivered separately, not split into the per-unit call, and the user aligns it in their own editor from the edit list's timecodes.

Submit the call for this unit exactly once — `beatra.videos.animate` when only a first frame is locked, `beatra.videos.interpolate` when both a first frame and a required last frame are locked, or, on a segmented rebuild, `beatra.videos.generate_from_references` when the unit is built from ordered references. A single continuous take only ever makes one of the first two, because only those carry the narration. Repeat once per unit under a segmented rebuild, each with its own stable `client_request_id`.

## Delivering and reviewing

Record the task ID immediately and poll that task with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the teardown, the approved shot list, every frame as a delivered still, the narration, and — per the chosen route — either the one returned video artifact, or the segment sources, the single continuous narration track, captions, and the timecoded edit list. Write those captions from the spoken fields the shot list already approved, timed to the edit list's per-unit timecodes — the words and the timings are both in hand by then, so the caption track costs no further paid call. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A reference lookup is delivered differently — the returned payload, its task ID, the terminal status, and `billing.net_charged_credits`, with no resolved model, dimensions, or duration to report — per [reading the reference from a link](reference-lookup.md). Report only facts the task actually returned.

When the host can view or play the returned media, review the following and say which parts could not be inspected:

- **Beat match.** Each frame against the on-screen field it was written for.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Ending.** Any audible or visible silent hold or held frame.
- **Canvas.** The ratio the destination needs.
- **Captions.** When the route delivers them: each cue's wording against the spoken field it came from, and its timing against the edit list.
- **Structure.** Whether the finished clip, or the segmented sources taken together, still reads as the pattern the teardown named.

State visible drift honestly rather than describing an uninspected result as verified. If one focused change would help, name the smallest one and wait for a new approval — it is new paid work.

## When something is redone

Each paid artifact stands alone. Redoing one never means regenerating the others.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| One frame does not match its beat | That one `images.generate` | Every other frame and the narration |
| The narration is too long or mispronounced | Shorten that beat's spoken field, then `speech.synthesize` | The frames |
| The video is not right | That video call — `videos.animate`, `videos.interpolate`, or `videos.generate_from_references`, whichever that unit actually made; under a segmented rebuild, only the failed unit's call | The frames, the narration, and every other unit |
| The canvas ratio must change | Everything | Nothing — the ratio lives in the frames |
| The teardown read the reference wrong | The shot list, free | Nothing further, if caught before gate 1 — a lookup already run stays spent, and so does a `beatra.videos.understand` read already run |

## Recovery

Keep a private ledger per paid stage — a reference lookup included: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result. For a lookup, record the `operation_key` and the time it was read alongside them, because the read time travels with every figure it produced.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A reference lookup has no capability to list by: match its saved `operation_key`, arguments, and `schema_hash` against the candidates instead. A slow task is not a failed task. Never replace a running task with a duplicate.

On `insufficient_balance`, relay the returned message, keep the top-up URL inside the balance error exact, and retry the same frozen `client_request_id` only after the user says they have topped up. It is not a failed generation.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## The ledger for a multi-unit rebuild

Recovery for a single segment is simple: at most one reference read and one lookup ahead of the gate, then one image call, one speech call, and one video call — one entry each. Once R2 splits the rebuild into several generation units, it stops being simple, and the difference is that you now have to keep a record.

Give every generation unit its own row in that ledger: which unit it is, its own stable `client_request_id`, its task ID, its current status, and the link to its delivered artifact. Keep this ledger yourself — nothing on the platform maintains it for you.

**When one unit fails, redo only the failed unit.** Every other unit's artifact is reused exactly as it already stands; none of it is generated again and none of it is paid for twice.

**Redoing a unit does not call for re-synthesizing the narration.** The narration is one continuous track for the whole clip, frozen once in the preparation stage; how the picture is split into units has nothing to do with it.

**When the balance runs out partway through — say at unit *k* of the sequence — do not scrap the batch.** Deliver the units already finished, through unit *k − 1*, and state the progress plainly: how many units are done, how many remain. Once the user says they have topped up, resume the rest of the sequence under the same frozen `client_request_id`s the ledger already holds for those units.

A variant — a different hook, a different language — is not a fresh rebuild. Record in the ledger which of the original units it reuses, so the reused units are never billed again.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the reference is too thin to segment even after the one hook-and-ending question, and the user does not want a link looked up;
- the user wants a transcript for a platform other than YouTube, where no transcript operation exists — say so, and fall back to the remaining tiers of the four-tier dialogue ladder: a transcript the user supplies directly, hard-burned subtitles read from the frames (mark them approximate), or record the line as missing — never a guess about the clip's audio, which the vision model cannot hear;
- a claim the user wants stated about their own subject has not been supplied;
- a media fact cannot be established, or fails the live card;
- for a single continuous take, the narration came back shorter than the selected card's minimum or longer than its longest supported duration — say so, rewrite the spoken fields to the live budget, and synthesize again rather than shortening the video to the ceiling; for a segmented rebuild, a unit's own slice of table 3 runs longer than the card allows — repack the unit boundaries, or use `beatra.videos.extend` to continue within that one shot, per [three rebuild routes](rebuild-routes.md), rather than truncating it;
- for a single continuous take, no available model on the capability this take's call uses — `image_to_video` for `beatra.videos.animate`, `frames_to_video` for `beatra.videos.interpolate` — admits the narration alongside the frames that call supplies. Check both capabilities before stopping, since a take with both frames locked runs on the second one; never resolve it by switching to a call that cannot carry the narration.

Do not guess a value, substitute a default silently, or submit to find out.
