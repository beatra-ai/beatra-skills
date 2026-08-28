# Hot topic workflow

A topic becomes three angles, one pick, an approved post plan, a rendered cover, and — when included — a narrated vertical clip. A cover-only run has one approval gate; a run with a clip has two. An optional trend lookup adds one more, before either of them.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Optional lookup gate — before anything else

Only when the user asks to see what is trending, or asks for their topic to be checked against what people are actually posting. Skipping it is the ordinary shape of this route.

The lookup is prepaid and confirmed on its own, separately from the cover and the clip, because it happens before the user has seen an angle and therefore before they have committed to anything. Name the board or the search in plain words together with the `operation_key` it maps to, quote the price `beatra.social.tools.get` just returned, say how many lookups the plan contains, and say that the angles can be produced from what they already gave at no cost. Then run it per [looking up what is trending](trend-lookup.md).

```text
printf '%s' '{"query":"hot search","platform":"douyin","capability_family":"trends"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

One `beatra.social.execute` is one lookup and one charge; a second page is a second charge and a second decision for the user. Carry every returned figure into the angles with its read time attached.

## Free stage

Read the topic and offer three angles per [finding the angle](angle-finding.md), in the first reply. Once the user picks, build the post plan per [building the post](post-plan.md) and get it approved.

Read the live cards with `beatra.models.list` for `text_to_image`, plus `text_to_speech` and `image_to_video` when a clip is included. When a clip is included, also freeze one `status: ready` opaque voice ID from `beatra.voices.list` together with its current supported languages and compatible models; a cover-only run needs no voice.

Everything in this stage is free and revisable. Angles are cheap to regenerate; a rendered cover is not, and a lookup already run cannot be un-run.

For images and speech, omit `model` unless the user asked for a specific one.

## Selecting the video model

Only when a clip is included. **The model must accept supplied narration.**

Read the current `image_to_video` cards and keep only models whose `input_combinations` admits `[image, driving_audio]`. Most models on this capability do not, and several that do not would accept an explicit `aspect_ratio`, which is why choosing one silently discards the narration.

Do not leave selection to `model: "auto"` on this route. Pass an admitted model explicitly, and read its `duration` behaviour; current cards advertise `supports_auto: false`, so an explicit integer duration is always required.

## Approval gate 1 — the cover, and the clip materials

Show the plan in one block, then freeze:

- the shape being run, cover-only or cover plus clip, and the total estimate for it;
- the chosen cover wording and the cover to be rendered;
- whether a clip is included, and if so its beats and which become frames;
- the 9:16 canvas, **with the statement that changing the ratio later means producing every paid artifact again**;
- the ready voice ID, language, speech model behaviour, and controls, when a clip is included;
- each paid call with its current maximum price and stable request ID;
- that the video itself, if any, is confirmed separately;
- that cover text is generated artwork and will be read back against the approved wording.

A clear instruction to proceed counts as approval. Comparing angles or an unresolved cover wording does not.

## Production — the paid calls

```json
{
  "prompt": "A vertical social cover for a trending post: bold short headline text reading exactly \"<the approved cover wording>\", a single clear focal subject beneath it, high contrast, flat solid background, legible at thumbnail size.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

When a clip is included, one `beatra.images.generate` per beat frame and one `beatra.speech.synthesize` for the narration. Name explicitly which frame is the opening frame: it is the one the video is animated from, and the rest are delivered as stills.


```json
{
  "voice": "voice_selected",
  "input": "The approved narration, all beats joined in order.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "client_request_id": "opaque-narration-id"
}
```

Use `mp3` when the live speech card supports it and the live video card accepts the resulting `audio/mpeg`. Do not substitute a format silently.

Give each call its own stable opaque `client_request_id` and submit it exactly once. The calls are independent; any order is fine.

On narration success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`.

## Review point

Show the cover and any frames. Play the narration when the host can access it. Report the real duration and the actual MIME type, size, and artifact facts.

Read the rendered cover wording back against what was approved, character by character. Generated text is where a cover most often fails, and a cover with mangled wording is not publishable no matter how good the image is.

Before the video call, re-admit against the current card:

1. narration duration at or above the card minimum, currently 2 seconds;
2. the smallest integer second at or above the real duration is within the model's supported durations;
3. audio size within the card's `max_size_bytes`;
4. audio MIME accepted by the card;
5. the card still admits `[image, driving_audio]`.

Any failure stops here.

## Approval gate 2 — the shoot

Only when a clip was included. Show an admission card before any video `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, approved opening frame and narration, motion direction, selected model, audio-led duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved cover, frames, or narration do not authorize the video. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Then freeze them under a new stable `client_request_id`.

```json
{
  "image": { "type": "artifact", "artifact_id": "art_opening_frame" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration" },
  "model": "the model selected above",
  "prompt": "A steady hold with unhurried motion, matching the cover's look.",
  "duration": 13,
  "client_request_id": "opaque-video-id"
}
```

Omit `aspect_ratio`. The frame governs it, and the narration-capable models do not accept it. Set `duration` to the smallest integer second at or above the real narration length. Submit `beatra.videos.animate` exactly once.

## Delivering and reviewing

Record each task ID immediately and poll it with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the angles considered, the chosen one and why, the cover with its wording, the caption as one pasteable block, the hashtags in posting order, and — when a clip was included — the clip plan, every beat frame as a delivered still, and the finished clip. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A trend lookup is delivered differently and has no resolved model, dimensions, or duration; see [looking up what is trending](trend-lookup.md).

When the host can view or play the returned media, review and say which parts could not be inspected:

- **Cover wording**, read back against the approved text.
- **Thumbnail legibility.** Whether the headline reads at the size it is actually seen.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Canvas.** The ratio the destination needs.

## When something is redone

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| Cover wording did not render | That one `images.generate` | The clip artifacts |
| The cover image is wrong but the wording is fine | That one `images.generate` | Everything else |
| The narration is too long or mispronounced | Shorten the spoken field, then `speech.synthesize` | The cover and frames |
| The video is not right | `videos.animate` | The frames and the narration |
| The angle was wrong | The plan, free, then whatever paid artifacts it changes | Anything the new angle still uses |

## Recovery

Keep a private ledger per paid call — the trend lookup included: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result. For a lookup, record the `operation_key` and the time it was read alongside them, because the read time travels with every figure it produced.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A trend lookup has no capability to list by: match its saved `operation_key`, arguments, and `schema_hash` against the candidates instead. A slow task is not a failed task. Never replace a running task with a duplicate.

On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. It is not a failed generation.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the user wants a trend board for Instagram, YouTube, WeChat Channels, or Xiaohongshu, none of which has one — say so, offer the three boards that exist on Douyin, TikTok, and X, or work from what they bring;
- no angle connects the topic to the account without a stretch, and the user has not picked one anyway;
- a fact about the real topic that the post depends on has not been supplied;
- a media fact cannot be established, or fails the live card;
- the narration is shorter than the card minimum, or longer than the longest video that can contain it.

Do not guess a value, substitute a default silently, or submit to find out.
