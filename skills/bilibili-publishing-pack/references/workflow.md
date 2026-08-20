# Bilibili publishing workflow

A brief becomes titles, a description, chapters, tags, a pinned comment, and a
thumbnail brief. When the copy is settled, one thumbnail is rendered from the
title and brief it produced. Writing is free; the thumbnail is the only paid
call.

Invoke every remote Beatra tool through the bundled client only. The tool name
is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not use REST/OpenAPI as a
fallback. Never pass a local path to a remote tool.

## Brief

Record topic, working title, outline or script, audience, creator voice,
confirmed facts, chapters and timestamps, tags to preserve, sponsor disclosure,
thumbnail direction, exclusions, and desired viewer action.

## Fact discipline

Keep supplied facts separate from assumptions. Never invent views, rankings,
credentials, prices, sponsor claims, test results, or platform approval. If a
chapter timestamp or claim is missing, ask or omit it.

## Output

Deliver five title options, primary title, description, chapters when supplied,
five to ten tags, pinned comment, and thumbnail brief. Keep title and
description aligned; use tags for genuine topics rather than stuffing keywords.

Write in Simplified Chinese unless the user asks for another language, and keep
any must-keep term, series name, or sponsor wording verbatim.

Length: at most 80 characters per title option, under 2,000 characters of
description, and at most 20 characters per tag. These are drafting ceilings so
an option is not dead on arrival in the upload form; confirm the current limits
against the form when the user is close to one.

Format a supplied chapter list as one `mm:ss` timestamp followed by its title
per line, in ascending order, with the first marker at `00:00`, and name the
destination. At submission the list goes in the description or the pinned
comment, where Bilibili turns timestamps into jump links. The official segmented
progress bar is a separate setting, available only after the submission passes
review, only for videos over five minutes, only for non-interactive videos, and
only from the creator centre's content management, with at most ten segments —
keep the list to ten or fewer when the user intends to use it there. Only
timestamps the user supplied become markers; never derive a timestamp from a
video, a duration estimate, or an outline position.

When the video contains AI-generated or AI-synthesised material — or when this
package rendered the thumbnail — remind the user to make the AI declaration in
the submission form. Never make the declaration on their behalf and never state
that it has been made.

## Boundaries

This package writes the upload copy and then renders one thumbnail from that
settled copy. Send a thumbnail that starts from a key frame, portrait, or
product shot, composes ordered references, compares several concepts, or
refines an accepted draft to `bilibili-thumbnail-maker`.
`bilibili-video-storyboard` creates a chapter-led shot list and key frames.
`ai-storyboard-generator` handles platform-neutral storyboard planning. This
package does not upload or publish.

Keep the thumbnail brief to what this package uniquely knows: the intended
canvas and destination, the exact must-keep headline wording, and the words to
avoid. Source images are not collected here — `beatra.images.generate` accepts
none, so a user who has a key frame, portrait, or product shot to compose in is
routed to `bilibili-thumbnail-maker`.

## Revision

For changes, identify the field affected by the new fact or direction and
preserve accepted copy elsewhere. Recheck title-description consistency after
each revision.

## Deriving the visual direction

Nothing in the written brief describes a picture, so this step produces it. From
the primary title, the must-keep headline wording, and the topic, decide the concrete subject, the scene around it, and
the treatment — what is literally in frame, in what light, in what palette. A
thumbnail whose prompt would fit any other video on the platform is not derived; it is
boilerplate, and it spends the user's money on something the topic never asked
for.

Two things stay fixed regardless of subject: one dominant focal subject, and a
clear area reserved for the headline rather than typeset words. Everything else
comes from the copy just written.

## The single gate — offer, plan, and price together

The written work is delivered and complete before this comes up. Do not fold the
question into the opening brief: a thumbnail is not an input the copy needs.

Read the live `text_to_image` card with `beatra.models.list` first — it is free.
Keep `model` omitted so the route stays on `auto` unless the user chose a concrete
eligible model. `models.list` returns one card per image model, each with its own
`pricing.options`, and the only pricing dimension is `resolution` — aspect never
is. Match the frozen tier, 2K by default, against that `resolution` dimension; a
model with a flat price exposes a single option with an empty `dimensions` object,
which is that model's price. A card whose `canvas.preset_tiers` does not include the
frozen tier is not eligible and stays out of the range; if that leaves no eligible
card, stop and say the named canvas is not currently offered rather than pricing it. Because `auto` picks the model only when the task is
admitted, several cards can still be eligible at the moment of the offer: show the
live range and use its maximum as the approval ceiling. The figure is provisional
either way — reconcile it against the returned `resolved_model` and
`billing.net_charged_credits` on delivery, and never present it as the final
charge.

Then offer the thumbnail and the frozen plan in the same message, and stop:

- that rendering the thumbnail is paid work;
- the final prompt, including the derived subject and how the headline area is
  kept clear;
- the canvas — 2K landscape 16:9 unless the user named a different destination;
- how `auto` will resolve the model, and `count: 1`;
- the current estimate, or the live range with its maximum named as the ceiling,
  and the stable `client_request_id`;
- whether any text is meant to appear in the image, quoted exactly.

The user sees the price in the same message that asks for the go-ahead, so a yes
cannot land on a plan that did not exist yet. A clear instruction to proceed
against the shown plan counts as approval. Comparing options, an unresolved
title, or an unanswered price question does not. A user who says nothing keeps
the written deliverable and is charged nothing.

## The paid call

One `beatra.images.generate` call, one stable opaque `client_request_id`,
submitted exactly once.

```json
{
  "prompt": "A landscape Bilibili thumbnail for a video explaining bearing grinding precision: a steel bearing race held in a machinist's glove, micrometer alongside, cool workshop light with a single warm highlight on the ground surface. One dominant focal subject offset to the left, strong contrast against a simple background, and a clear uncluttered area on the right reserved for the headline. Readable at list size.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "16:9" },
  "count": 1,
  "client_request_id": "opaque-thumbnail-id"
}
```

The first half of that prompt is derived from this conversation; only the composition rules at the end are reusable. A prompt that could have been written before reading the copy is not ready to submit.

Default to a text-safe area rather than rendered Chinese typography. When the
user does want words in the image, put the exact short string in the prompt and
in the confirmation, and verify it only against a visible result. The brief's
words-to-avoid list applies to in-image text as well.

## Delivering and reviewing

Record the task ID immediately and poll it with `beatra.tasks.get` until
terminal. `queued` and `running` mean wait.

Deliver the titles, description, chapters, tags, pinned comment, thumbnail
brief, the thumbnail's artifact link, its returned dimensions, the task ID, the
resolved model, and `billing.net_charged_credits`. Report only actual returned
facts.

When the thumbnail can be viewed, review and say which parts could not be
inspected:

- **Focal clarity** at list size.
- **Headline area** — whether the reserved space is actually clear enough to
  take the title.
- **Ratio** — whether the landscape 16:9 canvas came back as expected.
- **Requested in-image text**, read back character by character.

When the thumbnail cannot be viewed, state that nothing has been verified and
leave the check to the creator. Do not describe an uninspected thumbnail as
ready.

## When something is redone

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| The thumbnail misses the direction or the text is wrong | That one `images.generate` — new ID, re-approved at the current estimate | The whole copy set |
| The primary title changed | The thumbnail if already rendered — new ID, re-approved | The description, chapters, and tags |
| The copy needs rewriting | The written pieces, free | A thumbnail still matching the final title |

## Recovery

Keep a private record for the paid call: what it was for, the complete frozen
arguments, its stable `client_request_id`, the approval, the create response,
the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under
the same ID. If the task ID is lost, list tasks for that capability, inspect
plausible candidates, and match them against the record before considering a
retry. A slow task is not a failed task; never replace a running task with a
duplicate.

`insufficient_balance` means the request never started and nothing was charged.
The user tops up and the identical request is resubmitted under the same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the
terminal state with `beatra.tasks.get`. A 409 means cancellation is
unconfirmed: keep polling that same task and create no replacement work.

A failed, cancelled, or unsatisfying thumbnail leaves the delivered copy
exactly as it was.

## Installation registration

The bundled client registers the installation itself on its first invocation,
so there is no register subcommand and no hand-built payload. Run
`python3 scripts/mcp_client.py verify` when a first-use registration needs to be
triggered or diagnosed. Registration is non-billable, idempotent, and its
failure does not block writing the publishing copy.

## Stopping before the paid call

Stop, say what is missing, and propose the smallest fix when:

- the primary title or the thumbnail brief has not been settled;
- the visual direction has not been derived from the settled copy;
- a redo has not been re-approved against a freshly shown estimate;
- the user asked for in-image text but has not confirmed the exact string;
- the requested in-image text collides with the brief's words to avoid;
- the live card cannot be read, so no current price can be shown.

Do not guess a value, substitute a default silently, or submit to find out.
