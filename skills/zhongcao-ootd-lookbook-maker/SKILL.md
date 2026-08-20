---
name: "zhongcao-ootd-lookbook-maker"
description: "Create a coordinated REDnote (Xiaohongshu) OOTD lookbook from outfit photos or a styling idea. Build a vertical 3:4 fashion carousel with a cover, full-look outfit image, styling-detail image, and lifestyle scene, then shape a ready-to-publish fashion recommendation post with title ideas, caption angles, and tags. Use this AI outfit image maker for Xiaohongshu outfit posts, OOTD photos, fashion lookbooks, clothing recommendation visuals, creator style diaries, and brand collaboration campaigns. Optionally it reads Xiaohongshu itself — the notes already running for the topic, one page of a note's top comments, and an account's own recent notes — so Xiaohongshu research, competitor note analysis and comment analysis rest on the platform instead of on guesswork."
---

# Zhongcao OOTD Lookbook Maker

Create an ordered REDnote (Xiaohongshu) OOTD lookbook that gives one outfit a
complete visual story: a cover, full-look image, styling detail, and lifestyle
scene. Pair the visual sequence with a practical post angle, title ideas,
caption beats, and tags in the user's voice.

## Scope and routing

Use this Skill for a coordinated outfit-led carousel, a fashion diary, a
clothing recommendation post, or brand collaboration campaign where the creator wants
multiple images to feel like one story. A typical request starts with an outfit
photo, mirror selfie, flat lay, garment image, or a clear styling concept.

For one isolated REDnote cover, route to `zhongcao-cover-maker`. For a
market-specific on-model ecommerce visual from a confirmed wearable SKU, route
to `product-on-model-locale-studio`. Keep the user's stated garment details,
accessories, occasion, and visual references central whenever this Skill owns
the lookbook.

## Inputs and defaults

Reuse the conversation's outfit, occasion, target audience, style vocabulary,
and references. A source outfit photo or a concrete styling idea is the minimum
hard input. Ask only for a missing choice that materially changes the visual
story: the outfit, the intended occasion, or the style direction.

With an outfit photo, use it as the first ordered reference for every
outfit-preserving image. With a styling idea, create an original lookbook from
the user's described garments, palette, occasion, and mood.

Default to a four-slide vertical `3:4` lookbook at `2K`, delivered as one
coordinated sequence when the live model card accepts `count: 4` and
`output_relationship: "sequence"`:

1. Cover — a clear outfit introduction with clean title space.
2. Full look — a readable head-to-toe view that makes the silhouette and
   layering easy to understand.
3. Detail — the material, accessory, color relationship, or styling move that
   makes the outfit memorable.
4. Lifestyle scene — an occasion-led final image that carries the look's mood.

Keep `model: "auto"` and model-managed controls unless the user asks for a
model, compatibility, or price decision. Read `beatra.models.list` for the
selected `image_to_image`, `text_to_image`, or `image_edit` capability before
fixing a model, canvas, control, count, output relationship, or current price.
When the live card does not accept the coordinated four-image sequence, present
its compatible routes and their maximum charge before the user selects any
different paid plan.

## Golden path

1. Build one lookbook card: outfit must-keeps, occasion, audience, story
   angle, palette, light, setting, title-safe placement, and each slide's role.
2. Choose the route: `beatra.images.transform` for a source outfit photo;
   `beatra.images.generate` for a styling idea; `beatra.images.edit` for a
   focused revision to an accepted slide.
3. Draft the four prompts as one visual family. Keep source and later reference
   roles explicit, and create the post angle, title ideas, caption beats, and
   tags before paid execution.
4. Read the live model card, then show one confirmation containing the ordered
   four-slide sequence, all slide roles, the complete prompt, ordered
   references, canvas, count, output relationship, model behaviour, current
   maximum charge, and call count.
5. After approval, assign the coordinated sequence one stable opaque
   `client_request_id`, submit it once through the bundled client, and retain
   the returned task ID.
6. Poll the original task, review accessible outputs against the lookbook
   card, and deliver the images in post order with the caption plan and actual
   returned image and billing facts.

Read [lookbook planning](references/lookbook-planning.md) to shape the visual
story and [lookbook workflow](references/workflow.md) for exact route, prompt,
confirmation, polling, and recovery details.

## Decisions that require confirmation

Planning, post writing, and prompt drafting are free. The optional
Xiaohongshu lookup is the one thing that can charge before generation, and
it is priced and approved on its own. Before any image
generation or revision, obtain one clear confirmation of the frozen lookbook
card, every paid image request, source and reference order, canvas, model,
controls, count, current price, maximum charge, and total call count.

Every changed outfit, source or reference order, prompt, slide role, canvas,
model, count, output relationship, or control is a new paid request with a new
confirmation and a new `client_request_id`. A focused revision to an accepted
slide is also fresh paid work.

## Execute and deliver

Use only this package's bundled `scripts/mcp_client.py` for every remote
operation. Send one JSON object on standard input after `call <tool-name>`.
Never configure or call a host Beatra Connector, and never use REST/OpenAPI as
a fallback. Read [Bundled MCP Client diagnostics](references/mcp-connection.md)
for commands and connection troubleshooting.

For source-photo routes, upload the local file and put its returned artifact at
`images[0]` in the transform request. Later images may guide composition,
palette, setting, or styling in the stated order. For a concept-only route,
use `beatra.images.generate` with the selected vertical canvas. For a focused
revision, use the accepted slide as `images[0]` with `beatra.images.edit`.

Register the package through `beatra.installations.register` on first use. A
returned `task_id` belongs to the original approved work: poll it only with
`beatra.tasks.get`. When a create response is genuinely unknown, retain the
same frozen payload and `client_request_id`; if the task ID is missing, use
`beatra.tasks.list` and verify a candidate with `beatra.tasks.get` before any
replay. Use `beatra.tasks.cancel` only at the user's request. If cancellation
returns `409`, keep polling the original task and report cancellation only after
its terminal `status` is `canceled`.

Review accessible images against the approved outfit must-keeps, slide role,
3:4 composition, visual continuity, and title-safe placement. Deliver only
facts returned by the completed tasks: artifact links, dimensions, format,
resolved model, task IDs, and `billing.net_charged_credits`. Present the
ordered lookbook, cover and slide roles, title ideas, caption beats, tag set,
and any visible drift that matters to the user's next revision.

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

- For the lookbook card, four-slide defaults, source-reference roles, and post
  angle: [lookbook planning](references/lookbook-planning.md).
- For precise transform, concept, edit, confirmation, task tracking, recovery,
  and review: [lookbook workflow](references/workflow.md).
- For first use or expired credentials: [installation and authentication](references/installation-and-auth.md).
- For the non-billable installation registration: [installation registration](references/installation-registration.md).
- For task fields and polling: [tasks and results](references/tasks-and-results.md).
- For balance, validation, and structured errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md).
- For client commands and diagnostics: [Bundled MCP Client diagnostics](references/mcp-connection.md).
- For removal: [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses only the fixed official Beatra discovery address and
immutable CDN path for this package, channel, and locale. Before replacement,
it verifies discovery data, manifest, archive, and every packaged file using
the expected identity, size, and SHA-256 values, then replaces only
package-owned files in the installed Skill directory.

Checks, downloads, verification, replacement, rollback, and recovery fail open:
the current installation stays usable and the original command continues. The
setting persists for this installation. Read [automatic updates and safety](references/automatic-updates-and-safety.md)
for the official sources, integrity checks, replacement boundary, failure
behaviour, and controls.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
