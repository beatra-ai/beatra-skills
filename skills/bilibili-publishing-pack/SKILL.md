---
name: "bilibili-publishing-pack"
description: "Create Bilibili upload copy from a video topic, title, outline, or finished script. This AI Bilibili publishing pack produces title options, a readable video description, chapter timestamps when supplied, relevant tags, a pinned-comment prompt, and a thumbnail brief for Bilibili creators publishing explainers, reviews, tutorials, vlogs, games, animation, and creative videos. The chosen title and thumbnail brief then become a matching landscape 16:9 Bilibili thumbnail with a headline-safe composition."
---

# Bilibili Publishing Pack

Prepare the text and publishing direction around a Bilibili upload: a title
set, readable description, tags, pinned interaction prompt, and a thumbnail
brief. When the copy is settled, render one landscape thumbnail from the title
and brief it just produced.

## Scope and routing

Use this package for Bilibili submission copy: titles, descriptions, a chapter
list for the description or pinned comment, tags, pinned comments, audience
framing, and thumbnail briefs. It writes that copy, then finishes with one
thumbnail built from it.

The thumbnail route here starts from this conversation's own brief: the title
is already chosen, no reference image is involved, and it produces one image.
A thumbnail that starts from a key frame, portrait, or product shot, composes
ordered references, needs several concepts compared, or refines an accepted
draft belongs to `bilibili-thumbnail-maker`. Route a long-form chapter
storyboard to `bilibili-video-storyboard` and a platform-neutral storyboard to
`ai-storyboard-generator`. This package does not upload or publish to
Bilibili.

## Inputs and defaults

Two hard inputs: the topic, and the promise the video makes to a viewer.
Everything else is reused or defaulted.

Use the topic, working title, outline or script, intended audience, creator
voice, supplied facts, chapter timings, and desired action. Ask only when the
missing answer changes the published result: the core promise, audience,
chapter timestamps, or factual claims. Never invent credentials, rankings,
views, sponsors, prices, performance results, or platform approval.

Write the submission copy in Simplified Chinese, which is what Bilibili
audiences read, unless the user asks for another language. Carry any must-keep
term, series name, or sponsor wording through verbatim.

Default to five title options of at most 80 characters each, one primary title,
a concise description under 2,000 characters covering what viewers will learn,
chapter markers in the description or the pinned comment when timestamps are
supplied, five to ten tags of at most 20 characters each, one pinned-comment
prompt, and one thumbnail brief.

The thumbnail uses a 2K landscape 16:9 canvas and `count: 1`, and omits
`model`, which resolves to `auto`. Take a different canvas only when the user
names one, and freeze whatever tier and ratio it becomes in the confirmation. Default to a text-safe area rather than promising
rendered Chinese typography; when the user wants words in the image, carry the
exact short text into the confirmation and read it back only when the result is
actually visible.

When the video contains AI-generated or AI-synthesised material — or when this
package rendered the thumbnail — remind the user to make the AI declaration in
the submission form. Never make the declaration on their behalf and never state
that it has been made.

Describe what the video offers a viewer rather than how the platform will
respond to it: reach, ranking, recommendation-feed placement, and follower
growth are not this package's to promise, in the copy or in the reply.

## Golden path

Steps 1 to 7 cost nothing, including reading the card and pricing the thumbnail.
The publishing copy is a complete deliverable on its own.

1. Build a publishing brief from the topic, outline/script, audience, creator
   voice, supplied facts, chapters, must-keep terms, exclusions, and desired
   viewer action.
2. Identify the single viewer promise and the evidence or sections that support
   it. Mark unsupported claims as questions instead of filling them in.
3. Draft title alternatives, choose a primary title, write the description,
   format confirmed chapters, select relevant tags, and write a non-forced
   pinned comment.
4. Create the thumbnail brief: the intended canvas and destination, the exact
   must-keep headline wording, and the words to avoid. If the user has a key
   frame, portrait, or product shot they want composed in, that is the signal to
   route the thumbnail to `bilibili-thumbnail-maker` — this package renders from
   copy, not from source images. The publishing copy is still written and
   delivered here; only the image goes elsewhere.
5. Review for search readability, audience fit, factual grounding, title-
   description consistency, and a natural interaction prompt. Deliver the copy.
6. Unless step 4 routed the image to `bilibili-thumbnail-maker`, prepare the
   thumbnail offer at no cost once the copy is delivered: derive the visual
   direction from the primary title, the must-keep headline wording, and the
   topic — the concrete subject, scene, and treatment the video is actually
   about — then read the live `text_to_image` card with `beatra.models.list`.
   Skip this step and the two below when the user has already said they do not
   want an image.
7. Offer the thumbnail and the frozen plan together, in one message, and stop.
   Name it as paid work and show the final prompt, the 2K 16:9 canvas,
   `count: 1`, how `auto` will resolve the model, the current estimate for the
   frozen tier — or the live range with its maximum as the ceiling when `auto`
   still leaves several models eligible — and the stable `client_request_id`. A
   user who does not take it up already has everything they asked for.
8. Only after the user approves that frozen plan, call `beatra.images.generate`
   exactly once. Poll with `beatra.tasks.get` until terminal and deliver the
   result.

## Revisions and updates

A changed topic, promise, audience, timing, claim, sponsor, or thumbnail
direction is a new publishing brief. Preserve accepted facts and revise only
the affected field when possible. Rewriting copy stays free; a thumbnail
already rendered against a title that changed is new paid work.

Read [publishing workflow](references/workflow.md) for the brief, chapter
formatting, the copy ceilings, the thumbnail payload, and route boundaries.

## Decisions that require confirmation

There is exactly one paid gate. The thumbnail is offered together with the frozen
plan, so the user sees the price in the same message that asks for the go-ahead;
nothing is submitted on a yes given before that plan existed. A clear instruction
to proceed against the shown plan is approval. Comparing options, an unresolved
title, or an unanswered price question is not.

Every additional `beatra.images.generate` is new paid work needing its own
identifier and its own confirmation showing the current price — including an
identical re-roll after an unsatisfying result, where nothing about the request
changed. Rewriting the copy stays free.

Do not pay a second time for the thumbnail already delivered: re-rendering that same
delivered picture in `bilibili-thumbnail-maker` would be a second charge for one picture. An actual
edit of the delivered thumbnail is different work: it changes the picture rather than
repeating it, so hand it to `bilibili-thumbnail-maker`, which prices and confirms its own call. A
standalone thumbnail request — one that does not follow copy written in this
conversation — also routes to `bilibili-thumbnail-maker`, even when the user has no photo to start
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
invocation, so there is no register subcommand. Give the thumbnail one stable
opaque `client_request_id` containing no user content and submit it exactly
once.

## Delivery and review

Deliver the titles, description, chapters, tags, pinned comment, thumbnail
brief, and — when a thumbnail was rendered — its artifact link, the returned
dimensions, the task ID, the resolved model, and
`billing.net_charged_credits`. Report only what the task actually returned.

When the thumbnail is visible, check focal clarity at list size, whether the
reserved headline area stays clear, whether the 16:9 ratio is correct, and
whether any requested in-image text matches the approved wording character for
character. When it cannot be viewed, say which parts were not inspected
instead of describing them as verified.

Whenever a thumbnail was rendered, repeat the AI-declaration reminder as part of
the handover: the submission now carries AI-generated material even if the
footage does not.

## Recovery

Record the task ID immediately and poll only that task; `queued` and `running`
mean wait. If a create response is lost, resubmit the identical frozen payload
under the same `client_request_id`. If the task ID is lost, list tasks for that
capability and match candidates against your own record before any retry.
`insufficient_balance` means nothing started and nothing was charged, so the
identical request can be resubmitted after a top-up. A thumbnail that fails or
is redone leaves the delivered copy untouched.

## References by task

Use [publishing workflow](references/workflow.md) for normal writing and the
thumbnail step, [tasks and results](references/tasks-and-results.md) for
polling and result fields, and
[billing, errors, and recovery](references/billing-errors-and-recovery.md) for
balance and structured errors. Read
[installation and authentication](references/installation-and-auth.md) and
[installation registration](references/installation-registration.md) on first
use, [Bundled MCP Client diagnostics](references/mcp-connection.md) when the
client cannot connect, and
[uninstall and disconnect](references/uninstall-and-disconnect.md) when
removing the package.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses fixed official discovery and immutable CDN paths,
verifies the archive, manifest, and every packaged file, replaces only
package-owned files, and fails open so the current installation remains usable
and the original command continues. Update checking or replacement failure
never authorizes retrying a paid generation. The setting persists. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
