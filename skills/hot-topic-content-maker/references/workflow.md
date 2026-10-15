# Hot topic workflow

A topic becomes three angles, one pick, an approved plan, and then the set: an image set, a video (scene or presenter), or both. An image set has one approval gate; a set with a video has two. An optional trend lookup adds one more, before either of them.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

This file is the payload-level reference and it is long. Read the stage you are
in rather than the whole thing:

| Stage | What it settles |
| --- | --- |
| Optional lookup gate | Whether to read a board at all, and its own price |
| Free stage | Cards read, angles, the set, card text, shots or script, music brief — nothing charged |
| Selecting the video model | Which models accept supplied narration, and when `auto` is fine |
| Approval gate 1 | The materials card, with the whole set's estimated total |
| Production | The paid image, speech, and music calls |
| Review point | Card text read back, the one carded fix, and what must be true before any video is offered |
| Approval gate 2 | The video card: one call per take or shot |
| Joining the finished video | The free join that turns the clips into one video, and what to deliver when it cannot run |
| Saving the user's photo as an avatar | Only after its video, with the consent sentence |
| Delivering, redoing, recovery, stopping | After the calls, and how to back out |

## Optional lookup gate — before anything else

Only when the user asks to see what is trending, or asks for their topic to be checked against what people are actually posting. Skipping it is the ordinary shape of this route.

The lookup is prepaid and confirmed on its own, separately from everything after it, because it happens before the user has seen an angle and therefore before they have committed to anything. Name the board or the search in plain words together with the `operation_key` it maps to, quote the price `beatra.social.tools.get` just returned, say how many lookups the plan contains, and say that the angles can be produced from what they already gave at no cost. Then run it per [looking up what is trending](trend-lookup.md).

```text
printf '%s' '{"query":"hot search","platform":"douyin","capability_family":"trends"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

One `beatra.social.execute` is one lookup and one charge; a second page is a second charge and a second decision for the user. Carry every returned figure into the angles with its read time attached.

## Free stage

Read the topic and offer three angles per [finding the angle](angle-finding.md), in the first reply, with the platform question in the same message when it is still open. Once the user picks an angle and the set, plan it per [building the post](post-plan.md) and [content pack](content-pack.md), and get the plan approved.

Read the live cards with `beatra.models.list`:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_music"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

The image card is always needed; the other three only when a video is included. For a video, also freeze one `status: ready` opaque voice ID from `beatra.voices.list` together with its supported languages and compatible models. For a presenter video, list saved avatars first:

```text
printf '%s' '{}' | python3 scripts/mcp_client.py call beatra.avatars.list
```

When the user picks a saved avatar, use its image artifact as the presenter and its paired voice unless they choose another. When the list returns a `default_avatar_id`, propose that avatar on the first approval card, named, with the virtual presenter as the alternative. When no avatar is saved or the call fails, use the virtual presenter and say why. An image set needs no voice.

When the user brings their own photo for the presenter, and has confirmed they are the person pictured or have that person's consent, upload it through the bundled client with its real MIME type:

```text
python3 scripts/mcp_client.py upload ./presenter.jpg --mime-type image/jpeg
```

Keep the returned artifact reference; it is the presenter image and, later, the artifact an avatar is saved from. Before the photo goes on a card, check it against the `image_to_video` card you will select: its MIME type, byte size, and dimensions or aspect ratio must be within what that card admits for `image`. A photo that fails stops there with the reason and the smallest fix, such as a crop or a smaller export, or the virtual presenter.

The video takes the photo's shape: the models this route admits derive the output from the frame. A photo that is not 9:16 therefore makes a video at the photo's own ratio, even though the card admits it. Before gate 1, say so and let the user choose: they crop it to 9:16 and you upload the crop, or the card states the ratio the video will actually have.

Everything in this stage is free and revisable. Angles and text are cheap to regenerate; a rendered image is not, and a lookup already run cannot be un-run.

For images, speech, and music, omit `model` unless the user asked for a specific one.

## Selecting the video model

Only when a video is included.

- **A single take or a presenter take carries the narration, so the model must accept it.** Read the current `image_to_video` cards and keep only models whose `input_combinations` admits `[image, driving_audio]`. Most models on this capability do not, and several that do not would accept an explicit `aspect_ratio`, which is why choosing one silently discards the narration. Pass an admitted model explicitly and read its `duration` behaviour; current cards advertise `supports_auto: false`, so an explicit integer duration is always required.
- **A per-shot clip carries no narration** (the narration is its own track), so `model: "auto"` is fine. Set `duration` to the shot's share of the narration, rounded up to a whole second the card admits.

When the `image_to_video` card read in this conversation carries a `free_first_video` offer, the first video call that fits its `applies_to` limits may be free. Say so on that call's card in plain words, together with the live estimate for the same request: when the service cannot apply the offer at submission, it charges the normal price instead. Never call a video free without that offer on the card.

## Approval gate 1 — the materials card

Show the plan in one block, then freeze:

- the set being run and its estimated total, **including every video call that gate 2 will ask about**, so the user sees the whole cost before the first charge; a video call the live card's `free_first_video` offer may cover is counted at its normal estimate and marked as possibly covered, because the service charges that price when it cannot apply the offer;
- each gate-1 call with its current maximum price and its own stable request ID: the cover, each card, each shot still or the virtual presenter, the cutaway's still when one is planned, the narration (or one narration per presenter take), and the music;
- the cover wording and every card's exact text;
- the shots and their stills, or the presenter and the script per take;
- the canvas — 3:4 for cards, 9:16 for video, and for the cover 3:4 whenever the image set is included or 9:16 for a video on its own — **with the statement that changing the ratio later means producing every affected paid artifact again**;
- the ready voice ID, language, speech model behaviour, and controls, and the music brief, when a video is included;
- that each video call is confirmed separately at gate 2;
- that a video is delivered as one finished video, joined from its clips at no charge after gate 2, with every part also delivered;
- that card and cover text is generated artwork and will be read back against the approved wording;
- what happens if the balance is short partway: the call that meets it returns `insufficient_balance` without producing anything, the rest of the batch stops with it, everything already finished is delivered, and only the unfinished calls resume, each under its original request ID, after the user says they have topped up. Once every clip has succeeded, the clips are joined as usual (per Joining the finished video).

This is a batch: price it before the first call and keep that total on the card. A clear instruction to proceed counts as approval. Comparing angles or an unresolved card text does not.

## Production — the paid calls

Give each call its own stable opaque `client_request_id` and submit it exactly once. The calls are independent; any order is fine.

Cover, at 3:4 whenever the image set is included:

```json
{
  "prompt": "A vertical social cover for a trending post: bold short headline text reading exactly \"<the approved cover wording>\", a single clear focal subject beneath it, high contrast, flat solid background, legible at thumbnail size.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "3:4" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

For a video on its own, the same call with `"aspect": "9:16"`.

An inner card, one call per card:

```json
{
  "prompt": "A 3:4 vertical content card in the same style as the cover: headline text reading exactly \"<card headline>\", below it short lines reading exactly \"<line 1>\" / \"<line 2>\", clean layout, large legible type, the cover's palette and motif, generous margins.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "3:4" },
  "count": 1,
  "client_request_id": "opaque-card-2-id"
}
```

A shot still (scene video) uses the same call with the shot's on-screen field as the prompt and `"aspect": "9:16"`. Name which still is the opening still: in a single take it is the one animated with the narration.

A virtual presenter, when no photo or saved avatar is used:

```json
{
  "prompt": "A fictional presenter for a short vertical news-style video, resembling no real person: chest-up, facing the camera, neutral expression with a slight smile, simple studio background, soft even light, sharp focus on the face.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-presenter-id"
}
```

Narration, one call for a scene video's whole narration, or one per presenter take:

```json
{
  "voice": "voice_selected",
  "input": "The approved narration for this video or this take.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "client_request_id": "opaque-narration-id"
}
```

Use `mp3` when the live speech card supports it and the live video card accepts the resulting `audio/mpeg`. Do not substitute a format silently. On success, read the **actual** `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, and `audio.size_bytes`.

Music, one call, with `beatra.music.generate`:

```json
{
  "prompt": "Upbeat, light percussion and plucked guitar, warm and bright, steady medium tempo, no vocals",
  "instrumental": true,
  "client_request_id": "opaque-music-id"
}
```

The model decides the music's length and the join trims and fades it; it is also delivered as its own track.

## Review point

Show every image. Play the narration and the music when the host can access them. Report the real durations and the actual MIME types, sizes, and artifact facts.

Read the rendered cover and every card back against the approved text, character by character. When a card or the cover is wrong, offer one fix with `beatra.images.edit`. It is new paid work, so read its live price first:

```text
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Then show a one-call card and wait for the user's go-ahead. It carries six things:

1. **The work:** a `beatra.images.edit` of the named image, the characters actually visible on it, and the exact text it must read.
2. **The price:** the live `image_edit` price just read.
3. **The count:** one call, and the only fix attempt for that image.
4. **The identity:** the call's own new request ID.
5. **If they decline:** the rendered image stays theirs, as returned.
6. **If the balance is short:** the call returns `insufficient_balance`; relay its message and top-up URL exactly, and retry under the same request ID only after the user says they have topped up.

On approval, submit it with the rendered image as `images[0]` and the exact text quoted in the prompt:

```json
{
  "prompt": "Correct the text only. The headline must read exactly \"<card headline>\" and the lines exactly \"<line 1>\" / \"<line 2>\". Keep layout, palette, and imagery unchanged.",
  "images": [{ "type": "artifact", "artifact_id": "<the rendered card>" }],
  "count": 1,
  "client_request_id": "opaque-card-2-fix-id"
}
```

If the fix is still wrong, stop retrying the text. Both images on hand still carry wrong characters, so neither is a text-free base. Offer the user a choice and do what they pick:

- **Take it as returned.** Deliver the better of the two images, list the wrong characters plainly, and give the card's text alongside, so they can cover it in the platform's own editor or carry the line in the caption. No further charge.
- **One text-free base.** One more call, under its own one-call card with the same six things, its own live price, and a new request ID: either `beatra.images.edit` on the rendered card with the prompt "Remove all text. Keep layout, palette, and imagery unchanged.", or `beatra.images.generate` with the card's original prompt minus its text clause, at the same canvas. Deliver the base with the card's text alongside.

There is no attempt after that one.

Before any video call, re-admit against the current card. For a single take or a presenter take:

1. narration duration at or above the card minimum, currently 2 seconds;
2. the smallest integer second at or above the real duration is within the model's supported durations;
3. audio size within the card's `max_size_bytes`;
4. audio MIME accepted by the card;
5. the card still admits `[image, driving_audio]`;
6. for the user's own photo, the uploaded image still fits what that card admits for `image`.

For per-shot clips, each shot's duration is within the card's supported durations. Any failure stops here.

## Approval gate 2 — the video card

Only when a video is included. Show one card before any video `client_request_id` or `beatra.videos.animate` call, listing every video call: route `image_to_video`, tool `beatra.videos.animate`, the still or presenter it animates, the narration it carries (if any), motion direction, selected model, duration, the provisional live estimate per call and in total, for each call whether the live card's `free_first_video` offer applies to it (per the rule under Selecting the video model). The card ends with the joining step: once every clip has succeeded, one `beatra.videos.compose` call joins them with the narration (for per-shot clips), the music, and the subtitles into the finished video; it costs no credits and needs no card of its own. A cutaway between presenter takes, when planned, is one more video call on this card. When the clips' ratio matches none of the compose canvases, the card says the finished video will show bars. The card also says what happens if they stop here (the approved images, narration, and music stay theirs to use), and what happens if the balance is short: the batch stops at the call that meets it with the official message and top-up URL relayed exactly, finished clips are delivered, and the unfinished calls resume under their original request IDs only after the user says they have topped up. Planning, comparison, or "make the video" is not approval. Approved images, narration, or music do not authorize the video. Do not submit until the user approves this card; for every call the offer does not cover, they also confirm they have topped up or already have enough credits for its estimate. Then freeze each call under its own new stable `client_request_id`.

A single take (scene video that fits one take) or a presenter take:

```json
{
  "image": { "type": "artifact", "artifact_id": "art_opening_still_or_presenter" },
  "driving_audio": { "type": "artifact", "artifact_id": "art_narration_for_this_take" },
  "model": "the model selected above",
  "prompt": "A steady hold with unhurried natural motion; the presenter speaks to camera with small, natural head movement.",
  "duration": 13,
  "client_request_id": "opaque-video-take-1-id"
}
```

That prompt is for a presenter take. For a scene video's single take, describe the opening still's one motion instead, such as "A slow push-in on the scene; steam rises from the cup; the composition stays."

Omit `aspect_ratio`. The models this route admits derive the output shape from the frame and reject an explicit value — read that off the card you actually selected rather than carrying it as a rule. Set `duration` to the smallest integer second at or above the real narration length.

A per-shot clip (scene video longer than one take):

```json
{
  "image": { "type": "artifact", "artifact_id": "art_shot_2_still" },
  "model": "auto",
  "prompt": "<the shot's motion: one movement that keeps the composition>",
  "duration": 5,
  "client_request_id": "opaque-video-shot-2-id"
}
```

Submit each `beatra.videos.animate` exactly once. When the balance runs out partway through the video calls, stop the rest, deliver what finished, and resume only the unfinished calls, each under its original request ID, after the user says they have topped up. Once every clip has succeeded, the clips are joined as usual (per Joining the finished video).

## Joining the finished video

**When.** After every clip of the video has succeeded — the shots of a scene video, the takes of a presenter video, or a single take. Do not join while any clip is missing or failed; deliver what finished as parts. The join costs no credits, so it has no approval card; it was named on the gate-2 card. Each account may run it 50 times per UTC day.

**Read the clips first.** Read each clip's returned duration from its task, and keep the narration's real duration from the speech call.

**Scene video (per-shot clips).** All clips muted (omit `keep_audio`). The narration is passed as `narration` and its real duration is the video's length. Each shot's span is its share of that duration in proportion to its spoken line's length, rounded to a tenth of a second; the last shot takes whatever remains, so the spans add up exactly to the narration. Every span starts at 0 and must not pass its clip's returned duration. When a clip came back shorter than its share, shorten its span to the clip and give the difference to the next clip that has room, or else to the previous one; when no clip has room, do not join — offer to redo that shot on its own card (it is paid), or deliver the parts.

**Presenter takes and a single take.** Every take is passed with `"keep_audio": true`, because the speech is inside it, lip-synced. Its span runs from 0 to the real duration of the narration slice it was made from (the take was requested at the next whole second; the span trims the silent remainder). Do not pass `narration`: the takes already speak it, and passing it again plays every line twice. A single take of a scene video is the same: one clip with `"keep_audio": true`, span 0 to the narration's real duration, no `narration`. An optional cutaway between two takes is passed muted, spanning its planned length, and has no subtitle.

**Subtitles.** The cues are the same lines and times as the SRT built from the approved narration (see [content pack](content-pack.md)). For takes, time each take's lines within that take's narration slice, then add the take's start on the joined timeline (the sum of the spans before it, cutaways included). At most 200 cues of at most 80 characters each.

**Music.** Always `"volume": 0.25`. The join trims it to the video's length, fades it out over the last 1.5 seconds, and lowers it under speech; never generate the music again to fit.

**Canvas.** The preset that matches the clips as they came back: `"9:16"` by default. When a presenter photo kept its own shape and that shape is `3:4`, `1:1`, or `16:9`, use that preset; when it matches none, use the nearest preset, and the clips are fitted inside with bars, never stretched (already stated on the gate-2 card).

**Limits.** 1 to 12 clips and at most 120 seconds in total. This route plans 15 to 30 seconds, well inside them.

**Payloads.** A scene video of per-shot clips mutes every shot and passes the narration:

```json
{
  "clips": [
    { "source": { "type": "artifact", "artifact_id": "art_shot_1_clip" }, "start": 0, "end": 4.7 },
    { "source": { "type": "artifact", "artifact_id": "art_shot_2_clip" }, "start": 0, "end": 5.0 },
    { "source": { "type": "artifact", "artifact_id": "art_shot_3_clip" }, "start": 0, "end": 4.5 },
    { "source": { "type": "artifact", "artifact_id": "art_shot_4_clip" }, "start": 0, "end": 4.7 }
  ],
  "narration": { "type": "artifact", "artifact_id": "art_narration" },
  "music": { "source": { "type": "artifact", "artifact_id": "art_music" }, "volume": 0.25 },
  "subtitles": [
    { "start": 0.0, "end": 2.3, "text": "<subtitle line 1>" },
    { "start": 2.3, "end": 4.7, "text": "<subtitle line 2>" }
  ],
  "canvas": "9:16",
  "client_request_id": "opaque-compose-id"
}
```

Presenter takes keep their own sound and pass no narration:

```json
{
  "clips": [
    { "source": { "type": "artifact", "artifact_id": "art_take_1" }, "start": 0, "end": 12.6, "keep_audio": true },
    { "source": { "type": "artifact", "artifact_id": "art_take_2" }, "start": 0, "end": 9.8, "keep_audio": true }
  ],
  "music": { "source": { "type": "artifact", "artifact_id": "art_music" }, "volume": 0.25 },
  "subtitles": [
    { "start": 0.0, "end": 3.1, "text": "<take 1, line 1>" },
    { "start": 12.6, "end": 15.4, "text": "<take 2, line 1>" }
  ],
  "canvas": "9:16",
  "client_request_id": "opaque-compose-id"
}
```

Submit the payload that matches the video:

```text
printf '%s' '<the payload above>' | python3 scripts/mcp_client.py call beatra.videos.compose
```

**Submit and poll.** Give the join its own stable `client_request_id`, submit it once, record its task ID in the private ledger like every other call, and poll it with `beatra.tasks.get` until terminal. Reuse that same request ID only to retry the identical payload after a lost response. The terminal task returns one video artifact with its duration and dimensions, resolved model `beatra-compose-v1`, and `billing.net_charged_credits` of 0.

**When it does not work.**

- Refused as invalid: when the message names something in the payload you can correct (a span past a clip's end, a cue too long), correct it and submit once more under a new request ID; any other refusal ends the step.
- Refused because the day's allowance for joining is used up (`rate_limited`): deliver the parts now with the edit list, and say the finished video can be asked for again the next day from the same parts.
- The task fails: submit the identical payload once more under a new request ID; if that fails too, deliver the parts with the edit list.

The join never holds back delivery — every clip, still, narration and music track is already the user's.

## Delivering and reviewing

Record each task ID immediately and poll it with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the angles considered, the chosen one and why, the cover with its wording, every card with its text in order, the caption as one pasteable block, the hashtags in posting order, and for a video the finished video first (its task ID, artifact link, resolved model, returned duration and dimensions, and `billing.net_charged_credits`), then the plan, every still, each clip, the narration, the music, and the subtitles as an SRT block, as the user's own files for a re-cut. The edit list from [content pack](content-pack.md) is delivered only when the finished video could not be made or the user asks to cut it themselves. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A trend lookup is delivered differently and has no resolved model, dimensions, or duration; see [looking up what is trending](trend-lookup.md).

When a presenter or any generated person appears in a video, tell the user to switch on the platform's AI-generated content label when they post it.

When the user asks how many credits they have left, read `beatra.wallet.get`. When they ask what a particular run cost or what has been deducted, read `beatra.wallet.ledger`. Both are ordinary reads the user can ask for at any time, not a step before submitting, and neither replaces the live model card as the source of a price.

When the host can view or play the returned media, review and say which parts could not be inspected:

- **Cover and card text**, read back against the approved text.
- **Thumbnail legibility.** Whether the headline reads at the size it is actually seen.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Presenter.** The mouth follows the narration and the face stays stable.
- **Canvas.** The ratio the destination needs.
- **Finished video.** Subtitles legible and matching the approved lines, speech clear over the music, a presenter's lips in step with the speech, and no black or silent tail.

## Saving the user's photo as an avatar

Only for a photo the user brought, only after its video was delivered successfully, and only if they want it for later posts. Saving is free, but it keeps a person's face on the account, so ask with the consent sentence that matches who is pictured, and wait for the user to confirm that sentence:

- **The user is the person pictured:** "The person in this photo is me. I agree that Beatra keeps this photo so I can make AI presenter videos with it later."
- **Someone else is pictured:** "The person in this photo is not me. I have told them, and I have that person's separate consent to use this photo for AI presenter videos and for Beatra to keep it for later use."

Say with it that every video made from the avatar is AI-generated and is posted with the platform's AI label switched on. Ask what to call the avatar. Then call `beatra.avatars.save` once:

```json
{
  "artifact_id": "<the uploaded photo's artifact>",
  "display_name": "<the name the user gave it>",
  "consent_attested": true,
  "consent_subject": "self"
}
```

`consent_subject` is `self` for the first sentence and `authorized_other` for the second. Add `voice_id`, the voice used for this video, only when the user wants it paired with the avatar, and `make_default: true` only when they ask for it to be their default. A virtual presenter is never saved: no one can give that consent for a person who does not exist.

## When something is redone

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| Cover or card text did not render | One carded `images.edit` for that image; if still wrong, the user's choice of taking it as returned or one carded text-free base | Everything else |
| An image is wrong but its text is fine | That one `images.generate` | Everything else |
| The narration is too long or mispronounced | Shorten the spoken field, then `speech.synthesize` | The images and the music |
| The music does not fit the mood | `music.generate` with a revised brief | Everything else |
| One shot or take is not right | That one `videos.animate`, then join again | Every other clip, the narration, and the music |
| A subtitle line in the finished video is wrong | Correct that cue, then join again | Every clip, the narration, and the music |
| The angle was wrong | The plan, free, then whatever paid artifacts it changes | Anything the new angle still uses |

## Recovery

Keep a private ledger per paid call — the trend lookup included: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result. For a lookup, record the `operation_key` and the time it was read alongside them, because the read time travels with every figure it produced.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A trend lookup lists under the `social_data_fetch` capability; because it returns no resolved model or dimensions, match its candidates on the saved `operation_key`, arguments, and `schema_hash` instead. A slow task is not a failed task. Never replace a running task with a duplicate.

On `insufficient_balance`, relay the returned message, keep the top-up URL inside the balance error exact, stop the rest of the set, and retry the same frozen `client_request_id` only after the user says they have topped up. It is not a failed generation.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the user wants a trend board for Instagram, YouTube, WeChat Channels, or Xiaohongshu, none of which has one — say so, offer the three boards that exist on Douyin, TikTok, and X, or work from what they bring;
- no angle connects the topic to the account without a stretch, and the user has not picked one anyway;
- a fact about the real topic that the post depends on has not been supplied;
- a photo of a real person is offered as the presenter and the user has not confirmed they are that person or have that person's consent — offer the virtual presenter instead;
- the user's photo is not on this computer in a form the bundled client can upload, or the uploaded image does not fit the selected video card;
- a media fact cannot be established, or fails the live card;
- the narration is shorter than the card minimum, or a take is longer than the longest video that can contain it.

Do not guess a value, substitute a default silently, or submit to find out.
