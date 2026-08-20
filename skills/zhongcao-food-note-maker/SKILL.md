---
name: "zhongcao-food-note-maker"
description: "Create a Xiaohongshu food post or REDnote food post from a dish photo, restaurant visit theme, or dining-atmosphere reference. This REDnote food image maker plans restaurant review images and AI food photography as a vertical 3:4 food-note sequence: a cover, dish close-up, table or restaurant atmosphere image, and a final detail image for a food recommendation post. Shape title ideas, caption angles, and tags for a restaurant review post, cafe-hopping post, new-menu launch post, restaurant visit images, food diary images, and restaurant social media images. Optionally it reads Xiaohongshu itself — the notes already running for the topic, one page of a note's top comments, and an account's own recent notes — so Xiaohongshu research, competitor note analysis and comment analysis rest on the platform instead of on guesswork."
---

# Zhongcao Food Note Maker

Create an ordered REDnote (Xiaohongshu) food note that turns one dish or
restaurant visit into a visual story: a cover, dish close-up, texture or table
detail, and dining-atmosphere image. Pair it with title ideas, caption beats,
and tags in the user's voice and only from facts the user has supplied.

## Scope and routing

Use this Skill for a coordinated food-led image sequence, restaurant visit
note, café or dessert post, dish highlight, or food recommendation story where
multiple images need to feel like one visit. It starts from a dish, table,
restaurant, or packaging photo, or a concrete dish or visit concept.

For a generic topic carousel, use `zhongcao-carousel-maker`; for one isolated
cover, use `zhongcao-cover-maker`. Keep the user's stated dish, restaurant,
ingredients, plating, tableware, packaging, occasion, and visual references
central. Restaurant names, menus, prices, locations, offers, and taste claims
are written only when the user has provided them.

## Inputs and default story

Reuse the conversation's dish, visit setting, audience, style vocabulary, and
references. A source food photo or a concrete dish or restaurant-visit concept
is the minimum hard input. Ask only for a missing choice that materially
changes the result: the food anchor, dining or visit scene, or visual direction.

With a food photo, use it as the first ordered reference for food-led images.
With a concept, create an original food note from the user's described dish,
ingredients, plating, setting, and mood.

Default to a four-slide vertical `3:4` food note at `2K`, delivered as one
coordinated sequence only when the live model card accepts `count: 4` and
`output_relationship: "sequence"`:

1. Cover — an appetizing food introduction with clean title space.
2. Signature dish — a close view that makes the main dish and plating clear.
3. Detail — texture, a lifted or cut moment, or tabletop detail that advances
   the meal story.
4. Dining atmosphere — table, restaurant, or visit-ending scene with a final
   detail that supports the food recommendation post.

Keep `model: "auto"` and model-managed controls unless the user asks for a
model, compatibility, or price decision. Before fixing model, canvas, control,
count, output relationship, or price, read `beatra.models.list` for the chosen
`image_to_image`, `text_to_image`, or `image_edit` capability. If the card does
not accept the coordinated four-image sequence, present its supported routes,
maximum charge, and resulting calls before the user chooses different paid work.

## Golden path

1. Build a food-note card: food anchor, user-confirmed must-keeps, visit
   setting, audience, story angle, palette, light, tableware or packaging,
   title-safe placement, and each slide role.
2. Route a source food photo to `beatra.images.transform`, a dish or visit
   concept to `beatra.images.generate`, and an accepted-slide revision to
   `beatra.images.edit`.
3. Draft the four prompts as one visual family and prepare the free post angle,
   title ideas, caption beats, and tags.
4. Read the live card and show one confirmation with all four roles, full
   prompt, ordered references, must-keeps, canvas, model behaviour, controls,
   count, relationship, current maximum charge, and call count.
5. After approval, create one stable opaque `client_request_id`, submit exactly
   once through the bundled client, and save its returned task ID.
6. Poll the original task, review accessible results against the card, and
   deliver them in post order with the caption plan and actual returned facts.

Read [food-note planning](references/food-note-planning.md) for the story card
and [food-note workflow](references/workflow.md) for exact route, confirmation,
polling, and recovery details.

## Paid-work confirmation

Planning, post writing, and prompt drafting are free. The optional
Xiaohongshu lookup is the one thing that can charge before generation, and
it is priced and approved on its own. Before generation or a
revision, obtain one clear confirmation of the frozen food-note card, all paid
image requests, source and reference order, canvas, model, controls, count,
current price, maximum charge, and total call count.

Every changed food anchor, source or reference order, prompt, slide role,
canvas, model, count, output relationship, or control is new paid work with a
new confirmation and a new `client_request_id`. A focused revision to an
accepted slide is new paid work too.

## Execute and deliver

Use only this package's bundled `scripts/mcp_client.py` for remote operations.
Send one JSON object on standard input after `call <tool-name>`. Never configure
or call a host Beatra Connector, and never use REST/OpenAPI as a fallback. Read
[Bundled MCP Client diagnostics](references/mcp-connection.md) for commands and
connection troubleshooting.

Upload a local source and put its returned artifact at `images[0]` for a
transform; later images (up to three) guide food styling, palette, composition,
or dining setting in stated order. For a concept-only route use generate. For a
focused revision use the accepted slide at `images[0]` with edit.

Register through `beatra.installations.register` on first use. A returned
`task_id` belongs to the original approved work: poll only with
`beatra.tasks.get`. Replay only a genuinely unknown create response with the
byte-equivalent frozen payload and same ID. If the task ID is missing, use
`beatra.tasks.list`, then verify the candidate with `beatra.tasks.get` before a
replay. Call `beatra.tasks.cancel` only at the user's request; on `409`, keep
polling the original and report cancellation only at terminal `status:
"canceled"`.

Review accessible images against user-confirmed dish, plating, tableware, and
packaging must-keeps, each slide role, 3:4 composition, visual continuity, and
cover title-safe placement. Deliver only completed-task facts: artifact links,
dimensions, format, resolved model, task IDs, and
`billing.net_charged_credits`. Present the ordered food note, slide roles,
title ideas, caption beats, tag set, and at most one focused unexecuted revision
suggestion.

## Reading Xiaohongshu before you write

Optional, and paid. When the connection exposes Beatra's public social lookup, this Skill
can read Xiaohongshu directly instead of working from what the user remembers: one page of
notes matching a keyword, one specific note the user pastes, one page of that note's top comments, and an
account's profile or recent notes. Six operations, Xiaohongshu only.

**Every one of them costs 60 credits**, and there is no cheap operation on this platform to
fall back on. The same reads cost 6 on TikTok. They cost 6 on Douyin too — except Douyin's
own keyword search, which is also 60, so do not say "ten times Douyin" without naming the
read. A three-step read — the field, one note, that note's top comments — is 180 credits, and
every further page is another 60. Say the number before offering anything, confirm each lookup on
its own before it runs, and say plainly that this Skill's own deliverable arrives either
way at no cost. Offer one read, not a plan of four.

The rule is the whitelist, not a list of exceptions: a platform with no operation on it
cannot be looked up from here, and another platform's notes are never presented as
Xiaohongshu's. A returned image URL is not a viewed image — state a visual finding only
about an image the host can actually open. Every figure that reaches the work is labelled
as looked up with the time it was read, or as supplied by the user, or as missing. Nothing
is estimated, and nothing is carried in from what notes in this category usually do.

See [reading Xiaohongshu](references/note-lookup.md) for the operations, the argument
routes, the confirmation wording, and how a result is reported and recovered.

## References by task

- [Food-note planning](references/food-note-planning.md): food card, default
  slide roles, source-reference roles, and post angle.
- [Food-note workflow](references/workflow.md): transform, concept, edit,
  confirmation, task tracking, recovery, and review.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use and credentials.
- [Tasks and results](references/tasks-and-results.md) and
  [billing, errors, and recovery](references/billing-errors-and-recovery.md):
  returned task fields, balance, validation, and structured errors.
- [Bundled MCP Client diagnostics](references/mcp-connection.md) and
  [uninstall and disconnect](references/uninstall-and-disconnect.md): client
  operation and removal.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses only fixed official Beatra discovery and immutable CDN
paths. Before replacement, it verifies discovery data, manifest, archive, and
every packaged file against expected identity, size, and SHA-256 values, then
replaces only package-owned files in the installed Skill directory.

Checks, downloads, verification, replacement, rollback, and recovery fail open:
the current installation stays usable and the original command continues. The
setting persists for this installation. Read
[automatic updates and safety](references/automatic-updates-and-safety.md) for
the official sources, integrity checks, replacement boundary, failure behaviour,
and controls.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
