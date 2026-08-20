# Douyin short-video script workflow

A topic becomes a brief, three hooks, a filming-ready script, and the
publishing copy. When the script is settled, one cover is rendered from the
chosen title it produced. Writing is free; the cover is the only paid call.

Invoke every remote Beatra tool through the bundled client only. The tool name
is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not use REST/OpenAPI as a
fallback. Never pass a local path to a remote tool.

## Build the brief card

Record the topic, target viewer, one desired takeaway or action, user-supplied
product/service facts, creator voice, duration, visual resources, must-keep
phrasing, and language. Separate facts from assumptions. A useful default is
30–60 seconds, conversational Mandarin or the user's requested language, one
speaker, one primary message, and one natural comment prompt.

For duration planning, estimate spoken Chinese at roughly 3–4 characters per
second, then shorten or expand after reading the script aloud. Treat that as a
drafting aid, not a platform rule. The final delivery includes an approximate
runtime and the assumptions used.

## Draft the script

Create three different hooks with distinct mechanisms such as a specific
problem, a surprising contrast, or a concrete result supplied by the user.
Choose one primary hook only after comparing clarity, factual support, and fit
with the audience. Do not call a hook “viral” as a result claim; describe the
angle that the creator can test.

Use this default structure:

| Beat | Deliverable |
| --- | --- |
| Opening | 0–3 second spoken hook and the first visual/action |
| Setup | The viewer problem, context, or question |
| Proof or explanation | One demonstration, example, story turn, or supplied fact |
| Payoff | The practical takeaway or product/service fit |
| Close | A direct next step and one comment prompt |

For every beat provide spoken lines, shot/action direction, subtitle break,
approximate seconds, and a transition note. Add a title shortlist, hashtag
set, filming checklist, and any missing-fact questions. Keep the script
spoken: short sentences, natural pauses, concrete nouns, and no paragraph that
would sound like an article when read aloud.

## Review and revise

Read the primary script aloud in the requested voice. Check that the hook
arrives immediately, each shot can be filmed with the listed resources, the
subtitle lines are brief enough to read, the factual claims come from the
brief, and the comment prompt follows naturally from the topic. A revision can
change wording, order, duration, hook selection, or shot notes because this is
free text planning; preserve user-marked must-keep lines unless the user
authorizes a rewrite.

If the user asks for voiceover audio, route the approved script to
`short-form-voiceover-audio`. If the user asks for a presenter video, route
the product and creator brief to `douyin-ugc-ad-creator`; do not imply that
this script package has rendered the downstream asset.

## Deriving the visual direction

Nothing in the written brief describes a picture, so this step produces it. From
the primary hook, the chosen title, and the topic, decide the concrete subject,
the scene around it, and the treatment — what is literally in frame, in what light, in what palette. A cover
whose prompt would fit any other video on the platform is not derived; it is
boilerplate, and it spends the user's money on something the topic never asked
for.

Two things stay fixed regardless of subject: one dominant focal subject, and a
clear area reserved for the headline rather than typeset words. Everything else
comes from the script just written.

## The single gate — offer, plan, and price together

The written work is delivered and complete before this comes up. Do not fold the
question into the opening brief: a cover is not an input the script needs.

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

Then offer the cover and the frozen plan in the same message, and stop:

- that rendering the cover is paid work;
- the final prompt, including the derived subject and how the headline area is
  kept clear;
- the canvas — 2K vertical 9:16 unless the user named a different destination;
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
  "prompt": "A vertical Douyin cover for a video about hand-brew coffee classes: a pair of hands pouring from a gooseneck kettle into a glass dripper, steam catching warm window light, wooden counter, one deep-brown and cream colour pair. Single clear focal subject in the upper two thirds, high contrast against a simple background, and a clean uncluttered band across the lower third reserved for the headline. Readable at phone size.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

The first half of that prompt is derived from this conversation; only the composition rules at the end are reusable. A prompt that could have been written before reading the script is not ready to submit.

Default to a text-safe area rather than rendered Chinese typography. When the
user does want words in the image, put the exact short string in the prompt
and in the confirmation, and verify it only against a visible result.

## Delivering and reviewing

Record the task ID immediately and poll it with `beatra.tasks.get` until
terminal. `queued` and `running` mean wait.

Deliver the script, the two unused hooks, the cover's artifact link, its
returned dimensions, the task ID, the resolved model, and
`billing.net_charged_credits`. Report only actual returned facts.

When the cover can be viewed, review and say which parts could not be
inspected:

- **Focal clarity** at phone size — whether the subject still reads when the
  image is small.
- **Headline area** — whether the reserved band is actually clear enough to
  take the title.
- **Requested in-image text**, read back character by character. Generated
  text is artwork; a crisply rendered wrong character is the dangerous case.
- **Crop resilience** — whether the subject survives the platform's own
  cropping.

When the cover cannot be viewed, state that nothing has been verified and
leave the check to the creator. Do not describe an uninspected cover as ready.

## When something is redone

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| The cover misses the direction or the text is wrong | That one `images.generate` — new ID, re-approved at the current estimate | The whole script and publishing copy |
| The title changed | The cover if already rendered — new ID, re-approved | The script body and beats |
| The script needs rewriting | The written pieces, free | A cover still matching the final title |

## Recovery

Keep a private record for the paid call: what it was for, the complete frozen
arguments, its stable `client_request_id`, the approval, the create response,
the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under
the same ID. If the task ID is lost, list tasks for that capability, inspect
plausible candidates, and match them against the record before considering a
retry. A slow task is not a failed task; never replace a running task with a
duplicate.

`insufficient_balance` means the request never started and nothing was
charged. The user tops up and the identical request is resubmitted under the
same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the
terminal state with `beatra.tasks.get`. A 409 means cancellation is
unconfirmed: keep polling that same task and create no replacement work.

A failed, cancelled, or unsatisfying cover leaves the delivered script exactly
as it was.

## Installation registration

The bundled client registers the installation itself on its first invocation,
so there is no register subcommand and no hand-built payload: the installation
reference is derived locally and cannot be supplied by the host Agent. Run
`python3 scripts/mcp_client.py verify` when a first-use registration needs to
be triggered or diagnosed. Registration is non-billable, idempotent, and its
failure does not block script writing.

## Stopping before the paid call

Stop, say what is missing, and propose the smallest fix when:

- the title has not been settled;
- the visual direction has not been derived from the settled copy;
- a redo has not been re-approved against a freshly shown estimate;
- the user asked for in-image text but has not confirmed the exact string;
- the intended destination implies a canvas other than 9:16 and has not been
  confirmed;
- the live card cannot be read, so no current price can be shown.

Do not guess a value, substitute a default silently, or submit to find out.
