# REDnote note copy workflow

A brief becomes titles, a note body, cover wording, hashtags, and a comment
starter. When the copy is settled, one cover is rendered from the title and
cover wording it produced. Writing is free. Two things are paid and each is approved on its own: the optional Xiaohongshu lookup and the cover.

Invoke every remote Beatra tool through the bundled client only. The tool name
is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not use REST/OpenAPI as a
fallback. Never pass a local path to a remote tool.

## Brief card

Record topic, audience, supplied facts, first-person stance, tone, language,
location or product details, must-keep wording, forbidden claims, desired
reader action, and whether the note is a recommendation, review, guide, diary,
or announcement.

## Fact discipline

Separate user-supplied facts, clearly labeled assumptions, and open questions.
Do not invent personal attendance, test results, prices, discounts, rankings,
medical effects, or availability. If a high-impact claim is central and not
supported, pause the draft and ask for the missing fact.

## Output format

Deliver: five title options; primary title; note body with hook, details,
experience or reasoning, practical information, and close; three short cover
phrases; five to ten hashtags; one comment starter; assumptions and missing
facts. Keep hashtags specific and avoid repeating every title keyword.

## Screen the copy before delivering

Read the finished note, titles, cover phrases, and hashtags against each of
these. A hit means rewrite, not a disclaimer, because the penalty falls on the
merchant or creator who posts it.

**Absolute superlatives.** Chinese advertising law prohibits absolute claims,
and their equivalents in any language, whether or not they are true. Screen for
at least:

```text
最   第一   顶级   国家级   销量冠军   绝对   独家   唯一
```

Replace each with something specific the user has actually supplied: not "the
best serum" but the concrete result they described the next morning, once they
confirm it.

**Efficacy claims on regulated categories.** Food, health supplements,
cosmetics, and medical devices get no therapeutic, curative, or functional
health claim. Describe what the product is, what it contains, and how it is
used, not what it will do to a body. A user-supplied efficacy claim does not
lift this, and the first-person rewrite does not clear it either — a
first-person account still implies that efficacy for that product. Ask which
registered or filed efficacy the claim corresponds to. When the user confirms
the product carries that registration, write it plainly. When they do not know,
leave the claim out and say the product's own registration is what would carry
it. Keep the first-person rewrite only for experience that names no efficacy
category at all.

**Outcome promises.** Do not promise reach, ranking, saves, conversion, or
platform approval anywhere in the copy or in the reply.

## Platform rhythm

Use short paragraphs, concrete sensory or practical details, restrained emoji
only when the requested voice supports them, and a natural save/share reason.
Do not promise virality, ranking, conversion, or platform approval.

## Boundaries

This package writes the copy and then renders one cover from that settled
copy. Send a cover that starts from a real photo, composes ordered references,
compares several concepts, or refines an accepted draft to
`zhongcao-cover-maker`. Send an ordered image set to
`zhongcao-carousel-maker`. Send food or menu-focused visual packages to
`zhongcao-food-note-maker`, OOTD lookbooks to
`zhongcao-ootd-lookbook-maker`, and non-food store visual notes to
`zhongcao-local-business-note-maker`. Send a beauty-specialised pack — routine
plan, ingredient comparison, efficacy-led review — to
`zhongcao-beauty-note-maker`; a plain text-only beauty note stays here. Keep this package as the text layer that
can accompany any of those outputs.

## Revision

For a revision, identify the changed fact, audience, tone, or section. Preserve
accepted copy and regenerate only affected titles, paragraphs, tags, or comment starter.

## Deriving the visual direction

Nothing in the written brief describes a picture, so this step produces it. From
the primary title, the cover phrases, and the category, decide the concrete subject, the scene around it, and
the treatment — what is literally in frame, in what light, in what palette. A
cover whose prompt would fit any other video on the platform is not derived; it is
boilerplate, and it spends the user's money on something the topic never asked
for.

Two things stay fixed regardless of subject: one dominant focal subject, and a
clear area reserved for the headline rather than typeset words. Everything else
comes from the copy just written.

Then read the derived prompt against the copy screen before it can be frozen. A
claim the screen would reject as text is equally rejected as a picture.
Dropping the words does not make the claim admissible. Screen the prompt for at
least these depictions:

```text
before-and-after result panels      前后对比
skin-condition or medical imagery   功效对比图
ranking or best-seller badges       销量榜   第一   金奖
```

Re-derive toward the product, its texture, how it is used, or the scene around
it — what the thing is, not what it did to a body.

## The single gate — offer, plan, and price together

The written work is delivered and complete before this comes up. Do not fold the
question into the opening brief: a cover is not an input the copy needs.

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
- the canvas — 2K vertical 3:4 unless the user named a different destination;
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
  "prompt": "A vertical Xiaohongshu note cover for a post about a weekend ceramics studio: two half-finished cups on a wheel, clay-dusted hands just out of frame, soft window light, muted terracotta and off-white palette. One clear focal subject on a clean uncluttered background, generous negative space in the upper third reserved for the headline. Readable as a small feed thumbnail.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "3:4" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

The first half of that prompt is derived from this conversation; only the composition rules at the end are reusable. A prompt that could have been written before reading the note is not ready to submit.

Default to a text-safe area rather than rendered Chinese typography. When the
user does want words in the image, put the exact short string in the prompt and
in the confirmation, and verify it only against a visible result.

The copy screen applies to in-image text exactly as it applies to the note:
an absolute superlative or a regulated-category efficacy claim does not become
acceptable by being rendered as artwork.

## Delivering and reviewing

Record the task ID immediately and poll it with `beatra.tasks.get` until
terminal. `queued` and `running` mean wait.

Deliver the titles, note body, cover wording, hashtags, comment starter, marked
assumptions, the cover's artifact link, its returned dimensions, the task ID,
the resolved model, and `billing.net_charged_credits`. Report only actual
returned facts.

When the cover can be viewed, review and say which parts could not be
inspected:

- **Focal clarity** in a feed-sized thumbnail.
- **Text area** — whether the reserved space is actually clear enough to take
  the title.
- **Ratio** — whether the vertical 3:4 canvas came back as expected.
- **Requested in-image text**, read back character by character.

When the cover cannot be viewed, state that nothing has been verified and leave
the check to the creator. Do not describe an uninspected cover as ready.

## When something is redone

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| The cover misses the direction or the text is wrong | That one `images.generate` — new ID, re-approved at the current estimate | The whole note and hashtags |
| The primary title changed | The cover if already rendered — new ID, re-approved | The note body and comment starter |
| The copy needs rewriting | The written pieces, free | A cover still matching the final title |

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

A failed, cancelled, or unsatisfying cover leaves the delivered copy exactly as
it was.

## Installation registration

The bundled client registers the installation itself on its first invocation,
so there is no register subcommand and no hand-built payload. Run
`python3 scripts/mcp_client.py verify` when a first-use registration needs to be
triggered or diagnosed. Registration is non-billable, idempotent, and its
failure does not block copywriting.

## Stopping before the paid call

Stop, say what is missing, and propose the smallest fix when:

- the primary title or the cover wording has not been settled;
- the visual direction has not been derived from the settled copy;
- a redo has not been re-approved against a freshly shown estimate;
- the user asked for in-image text but has not confirmed the exact string;
- proposed in-image text has not passed the copy screen;
- the derived prompt depicts a claim the copy screen would reject as text;
- the live card cannot be read, so no current price can be shown.

Do not guess a value, substitute a default silently, or submit to find out.
