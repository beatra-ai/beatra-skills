---
name: "hot-topic-content-maker"
description: "Turn a trending topic into a post you can publish today. Bring the hot topic, moment, or seasonal peg — or have it read the public trending boards on Douyin, TikTok, and X, or name a topic and have it search what people are actually posting about it on Xiaohongshu and Douyin, and pick the ones worth a look. This trending content workflow finds the angles that genuinely connect the topic to your brand or account, judges which one is worth your name on it, then builds the chosen angle into a finished post: cover wording and a rendered cover image, the caption, the hashtags, a beat-by-beat plan for a short cut, and the narrated vertical clip itself. Use it for trendjacking, newsjacking, trend-riding, trend discovery, seasonal and holiday campaigns, festival and shopping-event content, moment marketing, and getting a same-day social post or short video out of a topic while it is still moving. The finished post fits Douyin, Xiaohongshu, WeChat Channels, TikTok, Reels, and Shorts."
---

# Hot Topic Content Maker

A topic is only worth anything while it is still moving. This route goes from the topic to a publishable post in one pass: angles, a pick, a cover, a caption, and hashtags — plus a short clip when you want one.

## What you get

A **cover-only run** — the default — delivers four pieces:

- the cover wording
- the cover image rendered from it
- the caption
- the hashtags

That is already a complete publishable post. **Adding a clip** delivers three more:

- a beat-by-beat plan, with on-screen text kept apart from spoken lines
- a still image for each beat frame, usually three
- one narrated vertical clip, animated from the opening frame

Everything is 9:16 vertical unless you ask for a different ratio. The clip runs 12 seconds by default and 15 at most, and its finished length follows the narration. Images and the video arrive in whatever format the render returns, named for you on delivery.

## Ways to run it

Two shapes, and an optional step that can come before either of them.

- **Cover only.** The default. You bring the topic; you get the cover wording and image, the caption, and the hashtags.
- **Cover plus clip.** Everything above, plus the beat plan, the beat stills, and the narrated vertical clip. Offered once, when the angle is picked.

Either shape can open with a **trend lookup** — optional, and priced on its own — when you would rather have the topic found for you, or have the one you named checked against what people are actually posting.

## Scope and adjacent routes

The route is: a topic, a set of angles, one chosen angle, and a finished post. It fits when someone has a trending topic, a moment, or a calendar peg and needs something out fast.

When there is no topic in hand, another workflow fits better. An evergreen product recommendation belongs in a seeding-video workflow. A reference clip to rebuild belongs in a teardown-and-remake workflow. A cover for an existing post belongs in a cover workflow.

## Inputs and defaults

Two hard inputs: the topic, and the account it is being posted from.

The topic comes from the user — one they name, a list they paste, a screenshot of a trending board, or a calendar date that matters to them. Any of those is enough, and none of them costs anything.

When the user instead wants to see what is moving right now, or wants the topic they named checked against what people are actually posting, it can read the public trend boards on Douyin, TikTok, and X, and search what people are posting about a topic the user names on Douyin, TikTok, X, and Xiaohongshu. There is no Xiaohongshu board to browse — a Xiaohongshu lookup needs a topic first. Every lookup is paid, optional, and confirmed on its own before anything else happens, per [looking up what is trending](references/trend-lookup.md). There is no trend board at all for Instagram, YouTube, or WeChat Channels; a post headed there still takes its topic from the user or from one of the platforms above, said plainly. Without a lookup, work from what the user brought rather than describing a trend you have not seen.

The account is the industry, brand, or persona posting. Without it, angles have nothing to connect to and the output is generic trend commentary.

Reuse whatever the conversation already states about the platform, the audience, and the campaign goal. Default to a 9:16 vertical canvas, three angles offered, one post produced, and a cover-only run. Offer the clip once when the angle is picked; when it is wanted, default to 12 seconds with a narration voice matched to short social content. **The finished clip must fit the selected live model card's supported duration**, and only the opening frame is animated into it while the other beat frames are delivered as stills. Name each default in the confirmation instead of asking about it.

Speed is the constraint that shapes everything here. Offer the angles in the first reply, not after a round of questions.

## Golden path

Stages 1 to 3 cost nothing. The one paid call that can precede them is the optional trend lookup, and it happens only when the user asks for it and confirms its own price. Nothing else is charged before the user has picked an angle and approved the plan.

**Before stage 1, only when the user asks for it:** read a trend board or search recent posts about the topic, per [looking up what is trending](references/trend-lookup.md). Skip it whenever the user brought the topic — that is the ordinary shape of this route, and the angles are just as good.

1. **Read the topic and find the angles.** Produce three angles that connect the topic to the account, each with the connection stated plainly, per [finding the angle](references/angle-finding.md). Mark any angle that carries risk, and say what the risk is.
2. **The user picks one.** Or asks for different ones — that is free.
3. **Build the post plan and get it approved.** Cover wording, caption, and hashtags — plus, when a clip is included, its beats with on-screen and spoken fields kept apart, per [building the post](references/post-plan.md).
4. Read the live `text_to_image` card with `beatra.models.list` — and, only when a clip is included, the `text_to_speech` and `image_to_video` cards plus a voice from `beatra.voices.list`.
5. **Confirm production, and wait.** Build the production card from [hot topic workflow](references/workflow.md) — including the cover, the shape being run, the 9:16 canvas and what changing it later would cost, the ready voice when a clip is included, the current estimate, and one stable request ID per planned paid call — and the card is not complete until you have read that section. Say that the angles and the plan stay theirs if they stop here. Call no paid tool until the user has approved the card.
6. Render the cover with `beatra.images.generate`. When the clip is included, generate its beat frames the same way and synthesize the narration with `beatra.speech.synthesize`, then read the actual returned duration, size, and MIME type.
7. **Show the real materials** whenever the host can access them, and report the true duration.
8. **Confirm the video on its own** — only when a clip was included. Build the admission card from [hot topic workflow](references/workflow.md); it carries the provisional live estimate and the top-up wording, and the card is not complete until you have read it there. Nothing earlier authorizes the video: not the plan, not "make the clip", and not the already-approved cover, frames, or narration. Do not mint a video `client_request_id` or submit until the user confirms they have topped up, or that they already have enough credits for this estimate. Then call `beatra.videos.animate` once, with the approved opening frame, the narration, an explicitly selected model, and the audio-led duration.
9. Poll each task with `beatra.tasks.get` until terminal, deliver everything together, and review what you can actually see.

A cover-only run skips step 8 and the clip work inside steps 4 to 7, and has one approval gate; it still polls and delivers at step 9. Say which shape is running when the estimate is shown.

Select the video model explicitly rather than leaving it to `auto`: only some models on this capability accept supplied narration, and one that does not will discard it.

## Decisions that require confirmation

Confirm before spending: the trend lookup before anything else when one is run at all, then the cover together with any frames and narration, then the video when a clip was included.

Also confirm, rather than deciding alone: an angle the user has not picked, a canvas other than 9:16, a claim about the topic's facts they have not supplied, and any change after an artifact is approved. Each changed argument is new paid work with a new request identifier and fresh approval.

When an angle would attach the account to a topic where that association is the user's call — a live controversy, a loss, an unresolved public event, someone else's misfortune — surface it as a choice with the reason stated, offer the angles that do not carry it, and proceed with whichever the user picks. This is a judgment they own, not a gate.

What the topic actually is comes from the user, or from a lookup that was run here and attributed. Dates, figures, names, outcomes, and quotes are the user's to supply; a board position, a post count, or a recent post belongs to the lookup and carries the time it was read. The topic's own state — momentum, whether it is peaking or fading, how long it has left — stays inference either way: give the evidence behind it instead of asserting it. Write the post around a missing detail rather than producing a plausible one about a real event.

## Execution

Invoke every remote Beatra tool only through the bundled `scripts/mcp_client.py`, with the tool name as the CLI argument and its arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"query":"hot search","platform":"douyin","capability_family":"trends"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback. Give each logical paid request one stable opaque `client_request_id` and submit it exactly once.

## Delivery and review

Deliver the angles considered, the chosen one and why, the cover with its wording, the caption, the hashtags, and — when a clip was included — the clip plan, every beat frame as a delivered still, and the finished clip. For every generation task, deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. A trend lookup is reported differently — payload, task ID, terminal status, and `billing.net_charged_credits`, with no model, dimensions, or duration to report — per [looking up what is trending](references/trend-lookup.md). Report only facts the task actually returned.

Cover wording is generated artwork. Read the rendered text back against the approved wording and say plainly when it did not render legibly, rather than describing an uninspected cover as correct. State which media details could not be inspected.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running` mean wait. If a create response is lost, resubmit only the identical frozen payload under the same identifier; if a task ID is lost, list tasks for that capability and match candidates against your own ledger before any retry. A trend lookup lists under the `social_data_fetch` capability; match its candidates on the saved `operation_key`, arguments, and `schema_hash` rather than on a model or dimensions. Redoing the cover reuses the clip artifacts unchanged. On `insufficient_balance`, relay the returned message, keep the top-up URL inside the balance error exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

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

- On a first run, or when the paid confirmations and how they follow one another are unfamiliar, read [one run, end to end](references/worked-example.md) — a real run with the cover wording, caption and hashtags it actually produced, plus what adding a clip would have looked like, and where each charge falls
- First install or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Registration on first use, which is never billed: [installation registration](references/installation-registration.md)

### Building the post

- Turning a topic into angles, judging fit, and the risk read: [finding the angle](references/angle-finding.md)
- Reading a trend board, searching recent posts, what each lookup costs, and how its results are attributed: [looking up what is trending](references/trend-lookup.md)
- Cover wording, caption, hashtags, and the clip's beats: [building the post](references/post-plan.md)
- Exact payloads, what each confirmation freezes, polling, redoing one stage, recovery, cancellation, and reading the account balance: [hot topic workflow](references/workflow.md)

### Diagnosing and recovering

- When a cover renders wrong, the angles read generic, a lookup comes back thin, a clip runs a different length, or the user asks whether the post is safe to publish: [questions and anti-patterns](references/faq.md)
- Task polling, artifacts, and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- When the connection to Beatra fails: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Update guarantees and controls: [automatic updates and safety](references/automatic-updates-and-safety.md)
- Stopping use and removing shared credentials: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours per installation. When a higher version is available it installs automatically without separate confirmation. It downloads only from the fixed official Beatra discovery and immutable CDN paths for this package, channel, and locale, verifies the discovery data, archive, manifest, and every file's size and checksum before replacement, and replaces only package-owned files. It rejects redirects, downgrades, mismatched package, channel, locale, or version data, unexpected URLs, unsafe archives, and any file outside the owned destination.

Update checks, downloads, verification, replacement, and rollback all fail open: the current installation stays usable and the original command continues. An update failure never authorizes retrying a paid generation. The choice persists across later commands for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files. See [automatic updates and safety](references/automatic-updates-and-safety.md).
