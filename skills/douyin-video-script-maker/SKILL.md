---
name: "douyin-video-script-maker"
description: "Create a Douyin short-video script, Douyin spoken script, or Douyin product-video script from a topic, product or service facts, audience, and creator voice. This AI Douyin script writer produces three hook options, a ready-to-film short-video script, shot-by-shot beats, natural spoken lines, subtitle cues, title ideas, hashtags, and a comment prompt for knowledge sharing, local business, product demos, reviews, unboxings, shop content, and creator series. The chosen title then becomes a matching vertical 9:16 Douyin cover with a headline-safe composition."
---

# Douyin Video Script Maker

Turn a Douyin topic, product or service brief, or creator idea into a script a
person can actually film — three opening hooks, spoken lines, shot beats,
subtitle cues, a title, hashtags, and one comment prompt. When the script is
settled, render one vertical cover from the chosen title it just produced.

## Scope and routing

Use this package for talking-head explainers, product demonstrations, reviews,
unboxings, local-business introductions, shop content, and recurring creator
series. It writes the plan and the filming language, then finishes with one
cover built from that approved copy.

The cover route here starts from this conversation's own script: the headline
is already chosen, no reference image is involved, and it produces one image.
A cover that starts from a photo, key frame, product shot, or ordered visual
references, one that needs several concepts compared, or one that refines an
accepted draft belongs to `douyin-cover-maker`, which composes and edits from
real source images. Route voiceover audio for an approved script to
`short-form-voiceover-audio`, an AI creator presenting a product photo on
camera to `douyin-ugc-ad-creator`, and a single product image to a finished
product video to `product-video-studio`.

## Inputs and defaults

Reuse the conversation's topic, product or service facts, target viewer,
creator voice, references, and desired duration. Ask only for information that
changes the script: the viewer, the one action or takeaway, the source facts,
the creator's speaking style, or the target duration. A topic alone is enough
to draft an exploratory knowledge script; label assumptions and leave product
claims, prices, results, credentials, and offers for user-supplied facts.

Default to three hook options, a 30–60 second script, a conversational spoken
rhythm, one clear viewer takeaway, a simple Hook → proof or explanation →
payoff → comment prompt structure, and a shot beat for every spoken section.
When the user gives a duration, preserve it and adjust line density rather
than inventing a guarantee about retention or virality.

The cover uses a 2K vertical 9:16 canvas and `count: 1`, and omits `model`,
which resolves to `auto`. Take the canvas from the user's stated destination
only when they name a different one, and freeze whatever tier and ratio it
becomes in the confirmation. Default to a
text-safe area rather than promising rendered Chinese typography; when the
user wants words in the image, carry the exact short text into the
confirmation and read it back only when the result is actually visible.

## Golden path

Steps 1 to 6 cost nothing, including reading the card and pricing the cover.
The script is a complete deliverable on its own.

1. Build a brief with the audience, promise, supplied facts, must-keep wording,
   creator voice, duration, visual resources, and desired viewer action.
2. Draft three distinct hooks, then choose one as the primary opening while
   keeping the alternatives available. Shape the body around one proof,
   demonstration, story turn, or useful explanation and close with a natural
   comment prompt.
3. Produce the spoken script line by line, shot/action beats, subtitle breaks,
   title ideas, hashtags, and filming notes. Keep claims tied to supplied
   facts; mark a missing proof point as a question for the user instead of
   filling it with plausible detail.
4. Review the draft for conversational flow, opening clarity, one-idea focus,
   timing, shootability, subtitle readability, and a non-forced interaction
   prompt. Deliver the primary script and the two unused hook options.
5. With the script delivered, prepare the cover offer at no cost: derive the
   visual direction from the primary hook, the chosen title, and the topic —
   the concrete subject, scene, and treatment the video is actually about —
   then read the live `text_to_image` card with `beatra.models.list`. Skip this step
   and the two below when the user has already said they do not want an image.
6. Offer the cover and the frozen plan together, in one message, and stop. Name
   it as paid work and show the final prompt, the 2K 9:16 canvas, `count: 1`,
   how `auto` will resolve the model, the current estimate for the frozen
   tier — or the live range with its maximum as the ceiling when `auto` still
   leaves several models eligible, and the stable `client_request_id`. A user who does not take it
   up already has everything they asked for.
7. Only after the user approves that frozen plan, call `beatra.images.generate`
   exactly once. Poll with `beatra.tasks.get` until terminal and deliver the
   result.

Read [the scenario workflow](references/workflow.md) for the brief card,
duration math, script formats, revision rules, the cover payload, and route
boundaries.

## Decisions that require confirmation

There is exactly one paid gate. The cover is offered together with the frozen
plan, so the user sees the price in the same message that asks for the go-ahead;
nothing is submitted on a yes given before that plan existed. A clear instruction
to proceed against the shown plan is approval. Comparing options, an unresolved
title, or an unanswered price question is not.

Every additional `beatra.images.generate` is new paid work needing its own
identifier and its own confirmation showing the current price — including an
identical re-roll after an unsatisfying result, where nothing about the request
changed. Rewriting the script stays free.

Do not pay a second time for the cover already delivered: re-rendering that same
delivered picture in `douyin-cover-maker` would be a second charge for one picture. An actual
edit of the delivered cover is different work: it changes the picture rather than
repeating it, so hand it to `douyin-cover-maker`, which prices and confirms its own call. A
standalone cover request — one that does not follow a script written in this
conversation — also routes to `douyin-cover-maker`, even when the user has no photo to start
from.

## Execution

Invoke every remote Beatra tool through this package's bundled
`scripts/mcp_client.py`, with the tool name as the CLI argument and its
arguments as JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI
as a fallback. The bundled client registers the installation itself on its first
invocation, so there is no register subcommand. Give the cover one stable
opaque `client_request_id` containing no user content and submit it exactly
once.

## Delivery and review

Deliver the script, the two unused hooks, and — when a cover was rendered —
its artifact link, the returned dimensions, the task ID, the resolved model,
and `billing.net_charged_credits`. Report only what the task actually
returned.

When the cover is visible, check focal clarity at phone size, whether the
headline area stays clear, and whether any requested in-image text matches the
approved wording character for character. When it cannot be viewed, say which
parts were not inspected instead of describing them as verified.

## Recovery

Record the task ID immediately and poll only that task; `queued` and `running`
mean wait. If a create response is lost, resubmit the identical frozen payload
under the same `client_request_id`. If the task ID is lost, list tasks for that
capability and match candidates against your own record before any retry.
`insufficient_balance` means nothing started and nothing was charged, so the
identical request can be resubmitted after a top-up. A cover that fails or is
redone leaves the delivered script untouched.

## References by task

Use [the scenario workflow](references/workflow.md) for normal writing and the
cover step, [tasks and results](references/tasks-and-results.md) for polling
and result fields, and [billing, errors, and recovery](references/billing-errors-and-recovery.md)
for balance and structured errors. Read
[installation and authentication](references/installation-and-auth.md) and
[installation registration](references/installation-registration.md) on first
use, [Bundled MCP Client diagnostics](references/mcp-connection.md) when the
client cannot connect, and [uninstall and disconnect](references/uninstall-and-disconnect.md)
when removing the package.

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours. When a higher version is available, it installs automatically without separate confirmation. It downloads only from the fixed official Beatra discovery and immutable CDN paths, verifies the archive, manifest, and every packaged file, and replaces only files owned by this package. If an update fails, the current installation remains usable and the original command continues. An update failure never authorizes retrying a paid generation. The setting persists for this installation. See [automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
