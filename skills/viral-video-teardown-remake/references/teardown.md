# Reading the reference

The teardown draws on three sources, and it keeps them separate because their reliability is not the same.

| Layer | Source | Reliability |
| --- | --- | --- |
| Picture semantics — shots, framing, on-screen text | `beatra.videos.understand`, one call, `response_format` set to `json` | High for what it sees; **timings need a rescale before they mean anything** |
| Dialogue | The four-tier ladder below | Depends on which tier supplied the line |
| Public metrics and comments | `beatra.social.execute` | A snapshot taken at read time |

**Call `beatra.videos.understand` once, not once per question.** It is billed per second of input video. Four separate questions against the same clip are not four small charges — each one recomputes the whole clip, so four questions cost four times the price of one. Put every field the teardown needs into a single JSON structure and ask for it in one call.

**The call is also capped at 50 MiB and 360 seconds of input video** — a fixed tool limit, checked before the price is even quoted, not something a live card can raise. A reference past either limit is rejected before any charge; check the file against both before proposing the price.

That one call is still a charge, so it is confirmed on its own before it runs, the way the optional lookup is: state both limits, quote the live per-second price read from `beatra.models.list` with capability `video_to_text` rather than a number from memory, and say plainly that the teardown can run at no cost from screenshots, a transcript, or the user's own account of the clip instead. See [remake workflow](workflow.md) for that gate. When the reference arrives in one of those shapes rather than as a video file, this charge never arises at all — fill the tables below from what the user brought, and say which parts you read yourself.

## Table 1 — duration lock and rescale

Read the clip's real duration, `T`, from the material's own metadata before looking at anything the model returned.

**Never take the duration from the model. Its self-reported duration is wrong.** A probe against a public 56-second Douyin post came back with `total_duration_s: 1.46` — the tool had compressed all nineteen shots' timings into that range while the clip itself ran fifty-six seconds.

The error is not random; it is a clean linear scale, and that makes it fixable:

1. Read the model's `total_duration_s` as `T_reported`.
2. Compute `k = T / T_reported`, using the real `T` from the material's own metadata — never the model's figure.
3. Multiply every timing the model returned, every shot's start and end, by `k`.
4. Check that the rescaled end of the last shot lands on `T`. On the probe clip it landed exactly on 56.00 seconds, with a mean deviation of 0.245 seconds from whole-second boundaries across the rest of the shots.

Table 1 records `T`, `T_reported`, `k`, and that end-of-last-shot check. Every other table's timings depend on this table having run first.

State the precision ceiling out loud: the model samples one frame per second internally, so no rescaled timing is more precise than a second. That is enough for an ordinary clip; a clip with cuts inside the same one-second window will not show them apart, and the teardown should say so rather than let table 3 imply a precision it does not have.

## Dialogue: a four-tier ladder

**The model cannot hear.** It receives sampled frames, not an audio track, so dialogue never comes from `beatra.videos.understand`. It comes from one of four sources, taken in this order:

1. A transcript the user supplies directly. Highest reliability, no extra cost.
2. The YouTube captions operation — YouTube only. No other platform this package can reach has an equivalent operation.
3. Hard-burned subtitles read from the frames. The text itself is real, but there is no precise per-line start and end time behind it — mark these lines **approximate**.
4. Nothing available. Record the line as missing in table 2. **Never invent a line of dialogue.**

### Never ask the vision model about sound

On the same probe clip — one that had background music — `beatra.videos.understand` returned `spoken_audio_detected: false`. It has no audio track; that boolean is a guess dressed up as an observation, and here it was a **false negative**, the dangerous kind: acting on it would put the entire rewrite layer on the premise that the clip has no dialogue to work from.

Keep every audio field out of the JSON structure you request, and out of the prompt. Whether the clip has speech, music, both, or neither is answered only by the four-tier ladder above, never by the vision model.

## Table 2 — per-line script evidence

| Start (s) | End (s) | Duration | Line | On-screen keyword | Source tier |
| --- | --- | --- | --- | --- | --- |

Two rules, no exceptions:

- **One row per spoken line.** Never merge two lines into one row, and never split one line across two rows.
- **Never polish the wording.** This table is evidence, not copy — transcribe the line as delivered, awkward phrasing included.

"On-screen keyword" is for a price, a discount, a number, or a promise printed on screen — the things a later compliance pass needs to check. "Source tier" names which of the four tiers above supplied that row, so a reader can tell an exact YouTube caption apart from an approximate burned-in subtitle at a glance.

## Table 3 — shot master table

| # | Start (s) | End (s) | Cut type | Shot size | Lighting | Subject and emotion | Caption position |
| --- | --- | --- | --- | --- | --- | --- | --- |

Cover the whole clip: no gap between one shot's end and the next shot's start, no overlap between rows, and every timing already run through the rescale in table 1.

**There is no camera-movement column, and that is deliberate.** On the probe clip, all nineteen shots came back `Static` for camera movement. One frame per second gives the model no inter-frame continuity to read, so a pan, tilt, or push is invisible to it in principle — the field was never observing anything real. A column that returns the same constant value on every row is worse than no column at all, because a downstream reader treats a constant as a real observation instead of noticing it was never measurable. If camera movement matters to the teardown, ask the user, or say plainly that this route cannot get it.

## Table 4 — observation and attribution

Six dimensions: hook strength, information density, pacing, subject presentation, emotional curve, conversion pull.

**No absolute scores.** For each dimension, write three things:

- **Observation** — what the clip actually does on this dimension, stated as fact.
- **Evidence** — a row number cited into table 2 or table 3, not a general impression.
- **Directional judgement** — stronger or weaker than the comparison in hand, never a number.

There is no baseline corpus behind a figure like 8.5 out of 10 for a hook — a number like that is invented precision dressed up as measurement. A same-account comparison gives the directional judgement something concrete to be relative to; on Douyin, two further paid lookups can reach one — see [reading the reference from a link](reference-lookup.md) for the route and its cost, rather than re-deriving that mechanism here. It is optional, and on every other platform it is not available at all. Without a comparison in hand — whether it was skipped by choice or the platform has none — say plainly that the judgement reflects one sample and nothing more.

## Two limits to state in the deliverable

**Why a clip performed remains an inference, even with comments in hand.** Comments are evidence of what viewers noticed, not proof of what caused the result. Say what would confirm the read — the same structure recurring elsewhere in the account, or a wider sample — rather than presenting the inference as settled.

**The metrics that would actually settle it are not available.** Completion rate and the three-second drop-off are the decisive numbers for judging a hook, and no platform this package reaches exposes either one. Every retention read built from likes, comments, or shares is a weak substitute for those two numbers, not an equivalent to them. State this plainly in the deliverable — otherwise table 4 reads as more certain than the evidence behind it actually is.
