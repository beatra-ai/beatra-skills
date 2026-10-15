---
name: "hot-topic-content-maker"
description: "Turn a trending topic into a post you can publish today. Bring the hot topic, moment, or seasonal peg — or have it read the public trending boards on Douyin, TikTok, and X, or name a topic and have it search what people are actually posting about it on Xiaohongshu and Douyin, and pick the ones worth a look. This trending content workflow finds the angles that genuinely connect the topic to your brand or account, judges which one is worth your name on it, then builds the chosen angle into a finished post: cover wording and a rendered cover image, the caption, the hashtags, a beat-by-beat plan for a short cut, and the narrated vertical clip itself. Use it for trendjacking, newsjacking, trend-riding, trend discovery, seasonal and holiday campaigns, festival and shopping-event content, moment marketing, and getting a same-day social post or short video out of a topic while it is still moving. The finished post fits Douyin, Xiaohongshu, WeChat Channels, TikTok, Reels, and Shorts."
---

# Hot Topic Content Maker

A topic is only worth anything while it is still moving. This route goes from the topic to everything you need to publish it today: angles, a pick, and then the whole post for the platform you post on — a Xiaohongshu image set, a narrated vertical video, or both.

## What you get

Every run starts with three angles for your account and the one you pick. Then one of these sets, made from that angle:

- **Image set**, for Xiaohongshu and other image-first feeds:
  - the cover wording and the cover image rendered from it
  - 3 to 6 inner cards, one point each, in the cover's style
  - the caption
  - the hashtags
- **Scene video**, for Douyin, WeChat Channels, Kuaishou, TikTok, Reels, and Shorts:
  - a shot-by-shot plan, with on-screen lines kept apart from spoken lines
  - a still for each shot, usually 3 to 5
  - one narration track and one original instrumental music track
  - subtitles taken from the narration
  - one finished vertical video of up to 30 seconds, with the narration, the music, and the subtitles already in it, and each shot's clip as well
  - the cover, caption, and hashtags
- **Presenter video**, a presenter speaking your script to camera, for news, explainers, and opinion:
  - the presenter: your own photo, an avatar you saved, or a virtual presenter made for this post
  - the script and its narration, spoken by the presenter
  - one original instrumental music track
  - subtitles taken from the script
  - one finished vertical video with the presenter's voice, the music, and the subtitles already in it; a longer script is made in takes and joined into one
  - the cover, caption, and hashtags
- **Both**: the image set and one of the videos from the same angle, sharing the cover and the caption's core.

Cards are 3:4 and videos 9:16 unless you ask for another ratio. The cover is 3:4 whenever the image set is included, so the post opens at the same ratio as its cards, and 9:16 for a video on its own. The music, the narration, and the subtitles also arrive as their own files, for anyone who wants to re-cut the video in their own editor. Images, audio, and video arrive in whatever format the render returns, named for you on delivery.

## Ways to run it

The set follows where it will be posted, and your choice always wins over these defaults:

- **Xiaohongshu or another image-first feed**: the image set.
- **Douyin, WeChat Channels, Kuaishou, or another video feed**: a video. A news, explainer, or opinion angle defaults to the presenter video, with the avatar you set as your default or otherwise a virtual presenter; a product, place, or seasonal angle defaults to the scene video.
- **Both**: the image set plus that video.

Any set can open with a **trend lookup**, optional and priced on its own, when you would rather have the topic found for you, or have the one you named checked against what people are actually posting.

## Scope and adjacent routes

The route is: a topic, a set of angles, one chosen angle, and a finished post or video set. It fits when someone has a trending topic, a moment, or a calendar peg and needs something out fast.

When there is no topic in hand, another workflow fits better. An evergreen product recommendation belongs in a seeding-video workflow. A reference clip to rebuild belongs in a teardown-and-remake workflow. A cover for an existing post belongs in a cover workflow.

## Inputs and defaults

Two hard inputs: the topic, and the account it is being posted from. Where it will be posted is asked once, in the same reply as the angles, when the conversation has not said it.

The topic comes from the user — one they name, a list they paste, a screenshot of a trending board, or a calendar date that matters to them. Any of those is enough, and none of them costs anything.

When the user instead wants to see what is moving right now, or wants the topic they named checked against what people are actually posting, it can read the public trend boards on Douyin, TikTok, and X, and search what people are posting about a topic the user names on Douyin, TikTok, X, and Xiaohongshu. There is no Xiaohongshu board to browse — a Xiaohongshu lookup needs a topic first. Every lookup is paid, optional, and confirmed on its own before anything else happens, per [looking up what is trending](references/trend-lookup.md). There is no trend board at all for Instagram, YouTube, or WeChat Channels; a post headed there still takes its topic from the user or from one of the platforms above, said plainly. Without a lookup, work from what the user brought rather than describing a trend you have not seen.

The account is the industry, brand, or persona posting. Without it, angles have nothing to connect to and the output is generic trend commentary.

Reuse whatever the conversation already states about the platform, the audience, and the campaign goal. Default to three angles offered and the set chosen by platform and angle as above. When a video is included, plan a scene video at 15 to 30 seconds and a presenter video in takes of up to 15 seconds each. Default to a narration voice matched to short social content, or the voice paired with a saved avatar, and to instrumental music written for the video's mood. **Every video call must fit the selected live model card's supported duration**: a single take holds the whole narration, and a longer video splits into shots or takes at sentence boundaries. Name each default in the confirmation instead of asking about it.

Speed is the constraint that shapes everything here. Offer the angles in the first reply, with the platform question in the same message when it is still open, not after a round of questions.

## Golden path

Stages 1 to 3 cost nothing. The one paid call that can precede them is the optional trend lookup, and it happens only when the user asks for it and confirms its own price. Nothing else is charged before the user has picked an angle and approved the plan.

**Before stage 1, only when the user asks for it:** read a trend board or search recent posts about the topic, per [looking up what is trending](references/trend-lookup.md). Skip it whenever the user brought the topic — that is the ordinary shape of this route, and the angles are just as good.

1. **Read the topic and find the angles.** Produce three angles that connect the topic to the account, each with the connection stated plainly, per [finding the angle](references/angle-finding.md). Mark any angle that carries risk, and say what the risk is. In the same reply, ask where it will be posted, and which account when that is unknown.
2. **The user picks an angle and the set.** Or asks for different angles, which is free.
3. **Build the plan and get it approved.** The cover wording, caption, and hashtags per [building the post](references/post-plan.md), and per [content pack](references/content-pack.md) the exact text of every card, each shot's on-screen and spoken fields or the presenter's script, and the music brief.
4. Read the live `text_to_image` card with `beatra.models.list`, and when a video is included the `text_to_speech`, `text_to_music`, and `image_to_video` cards plus a voice from `beatra.voices.list`. For a presenter video, list saved avatars with `beatra.avatars.list` and use the one the user picks, with its paired voice; when none is saved or the list fails, use the virtual presenter. A photo the user brings is uploaded with the bundled client's `upload` command shown under Execution, and checked against the `image_to_video` card before it is used.
5. **Confirm the materials, and wait.** Build the first card from [hot topic workflow](references/workflow.md): every image, the narration, and the music, each with its live price and its own stable request ID, the canvas and what changing it later would cost, and the estimated total for the whole set including any video, which is still confirmed on its own later. The card is not complete until you have read that section. Say that the angles and the plan stay theirs if they stop here. Call no paid tool until the user has approved the card.
6. **Make the materials.** Render the cover, the cards, and the shot stills or the virtual presenter with `beatra.images.generate`; synthesize the narration with `beatra.speech.synthesize`; write the music with `beatra.music.generate`. Read back every card's text against the plan. A wrong card or cover may be fixed once with `beatra.images.edit`, under its own confirmation at the live `image_edit` price, per [hot topic workflow](references/workflow.md). Read the actual returned durations, sizes, and MIME types.
7. **Show the real materials** whenever the host can access them, and report the true durations.
8. **Confirm the video on its own**, only when a video is included. Build its card from [hot topic workflow](references/workflow.md); it carries each video call, one per take or shot, with its provisional live estimate, any offer the live card carries for that call, and what happens if the balance is short, and the card is not complete until you have read it there. Nothing earlier authorizes the video: not the plan, not "make the video", and not the already-approved images, narration, or music. Do not mint a video `client_request_id` or submit until the user approves that card; for every call the card does not show as covered by an offer, they also confirm they have topped up, or that they already have enough credits for its estimate. Then call `beatra.videos.animate` once per take or shot, each with its own request ID.
9. Poll each task with `beatra.tasks.get` until terminal. When a video is included, join its clips into the finished video with `beatra.videos.compose` once every clip has succeeded, per [hot topic workflow](references/workflow.md). Deliver the set together, and review what you can actually see.

An image set skips step 8 and the video work inside steps 4 to 7, and has one approval gate; a set with a video has two. Say which set is running when the estimate is shown.

For a single take or a presenter take, select the video model explicitly rather than leaving it to `auto`: only some models on this capability accept supplied narration, and one that does not will discard it.

## Decisions that require confirmation

Confirm before spending: the trend lookup before anything else when one is run at all, then the materials (cover, cards, stills or presenter, narration, music), then each video call when a video is included.

Also confirm, rather than deciding alone: an angle the user has not picked, a set or video style other than the default, a canvas other than the defaults, a claim about the topic's facts they have not supplied, a photo of a real person as the presenter (the user confirms they are that person or have that person's consent, and the virtual presenter is offered otherwise), saving that photo as an avatar with `beatra.avatars.save` (offered only after its video is delivered, with the consent sentence in [hot topic workflow](references/workflow.md)), the one text fix for a wrong card or cover, and any change after an artifact is approved. Each changed argument is new paid work with a new request identifier and fresh approval.

When an angle would attach the account to a topic where that association is the user's call — a live controversy, a loss, an unresolved public event, someone else's misfortune — surface it as a choice with the reason stated, offer the angles that do not carry it, and proceed with whichever the user picks. This is a judgment they own, not a gate.

What the topic actually is comes from the user, or from a lookup that was run here and attributed. Dates, figures, names, outcomes, and quotes are the user's to supply; a board position, a post count, or a recent post belongs to the lookup and carries the time it was read. The topic's own state — momentum, whether it is peaking or fading, how long it has left — stays inference either way: give the evidence behind it instead of asserting it. Write the post around a missing detail rather than producing a plausible one about a real event.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_music"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"query":"hot search","platform":"douyin","capability_family":"trends"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

A presenter photo the user brings is uploaded only through the bundled client, with its real MIME type:

```text
python3 scripts/mcp_client.py upload ./presenter.jpg --mime-type image/jpeg
```

Upload is transport, not visual review. Keep the returned artifact reference and never pass a local path to a remote tool.

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the angles considered, the chosen one and why, then the set: the cover with its wording, every card with its text, the caption, the hashtags, and for a video the finished video first, then the plan, every still, each clip, the narration, the music, and the subtitles. The edit list from [content pack](references/content-pack.md) comes only when the finished video could not be made or the user asks to cut it themselves. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A trend lookup is reported differently — payload, task ID, terminal status, and `billing.net_charged_credits`, with no model, dimensions, or duration to report — per [looking up what is trending](references/trend-lookup.md). Report only facts the task actually returned.

Cover and card text is generated artwork. Read the rendered text back against the approved wording and say plainly when it did not render legibly, rather than describing an uninspected image as correct. State which media details could not be inspected. When a presenter or any generated person appears in a video, remind the user to switch on the platform's AI-generated content label when posting.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry. A trend lookup lists under the `social_data_fetch` capability; match its candidates on the saved `operation_key`, arguments, and `schema_hash` rather than on a model or dimensions. Redoing one image, card, or shot reuses everything else unchanged. On `insufficient_balance`, relay the returned message, stop the rest of the set, deliver what finished, keep the top-up URL inside the balance error exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

Three tiers. Read the first on a first run, the second while building the post
and before every paid confirmation, and the third when something goes wrong or needs
recovery.

### Getting started

- On a first run, or when the paid confirmations and how they follow one another are unfamiliar, read [one run, end to end](references/worked-example.md) — one run from a topic to its cover, caption, and hashtags, then what the image set, a scene video, and a presenter video would add, and where each charge falls
- First install or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Registration on first use, which is never billed: [installation registration](references/installation-registration.md)

### Building the post

- Turning a topic into angles, judging fit, and the risk read: [finding the angle](references/angle-finding.md)
- Reading a trend board, searching recent posts, what each lookup costs, and how its results are attributed: [looking up what is trending](references/trend-lookup.md)
- Cover wording, caption, and hashtags: [building the post](references/post-plan.md)
- Choosing the set, card text, shots, the presenter, music, subtitles, the finished video, and the edit list: [content pack](references/content-pack.md)
- Exact payloads, what each confirmation freezes, polling, redoing one stage, recovery, cancellation, and reading the account balance: [hot topic workflow](references/workflow.md)

### Diagnosing and recovering

- When a cover or card renders wrong, the angles read generic, a lookup comes back thin, a clip runs a different length, the finished video could not be joined, or the user asks whether the post is safe to publish: [questions and anti-patterns](references/faq.md)
- Task polling, artifacts, and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- When the connection to Beatra fails: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Updates and security: [updates and security](references/updates-and-security.md)
- Stopping use and removing shared credentials: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
