---
name: "poster-design-studio"
description: "Turn a topic description, a product photo, or brand references into a scroll-stopping event poster, promotional banner, or social media graphic. This AI poster maker and design generator creates photo-rich posters with strong visual hierarchy, category-matched styling, and text-safe zones for event, music, movie, product launch, and sale campaigns. Use it as an AI flyer maker for sale flyers, an event poster design tool, a movie poster generator, a music festival poster creator, a banner design AI for product launch posters, or a graphic design poster studio. Start from a campaign topic, transform a product or scene photo with style references, or refine an accepted draft toward a print-ready or share-ready result."
---

# Poster Design Studio

Create one scroll-stopping poster, flyer, or promotional banner from a topic
description, a product or scene photo, or an accepted draft. Reuse decisions
already present in the conversation and move by the shortest route that
completes the requested poster.

## Choose the route

- **Generate a poster from a topic:** when the user describes an event, sale,
  movie, music night, product launch, or social campaign and no source photo is
  required, turn the brief into a complete poster visual using
  `beatra.images.generate`. This is the default when the request is topic-led.
- **Transform a photo into a poster:** with a product, scene, or brand photo,
  elevate it into a polished poster or banner with strong hierarchy, category
  styling, and a text-safe zone using `beatra.images.transform`. This is the
  default when a source photo exists.
- **Refine an accepted draft:** use `beatra.images.edit` with the accepted
  poster as `images[0]` to fix color, composition, text area, or background
  without changing the overall layout.

Follow [poster routing](references/poster-routing.md) for the precise branch and
[poster craft](references/poster-craft.md) when turning the request into a
visual specification that fits the poster type and category.

## Shape one poster brief

Reuse the user's campaign topic, poster type, target audience, style
preference, and any visual references. Ask only when a missing decision
materially changes the result. For a standard poster, propose the canvas that
matches the destination—A-series print, social media ratio, or standard poster
proportion—with a clean text-safe zone for the headline.

Build the brief around:

- the poster type and category—event poster, promotional banner, music or
  concert poster, movie poster, product launch, sale or flyer, or social media
  graphic;
- the headline message—the event name, film title, sale offer, or campaign line
  that anchors the composition;
- one focal subject—the performer, product, hero scene, or key visual that
  anchors the poster;
- one style direction—clean and futuristic (tech), warm and appetizing (food),
  editorial and bold (fashion), vibrant and energetic (music), professional and
  clean (corporate), or friendly and approachable (education);
- the canvas and destination—A3 or A4 print, 1:1 square, 9:16 story, 16:9
  banner, or 2:3 / 3:4 standard poster;
- a text-safe zone preference—top band, center, or lower third—so the user can
  place the headline and details later without clashing with the image;
- ordered visual references when available (brand color reference, style
  inspiration, composition reference).

If the user has already stated the topic or style, reuse it. If that choice is
genuinely missing, propose the best default and include it in the single
paid-call confirmation.

## Prepare the call

Use only this Skill's bundled `scripts/mcp_client.py` for every remote MCP
operation. The tool name is a CLI argument and the tool arguments are the JSON
sent on stdin. Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback. For exact commands and troubleshooting, use
[Bundled MCP Client diagnostics](references/mcp-connection.md).

- For a topic-led concept, call `beatra.images.generate` with the canvas that
  matches the destination and a prompt that captures the desired mood, color
  palette, hierarchy, and text-safe zone.
- Upload the source photo through the bundled client helpers first, then call
  `beatra.images.transform` with the uploaded artifact as the first ordered
  reference. Label the photo's role explicitly in the prompt so the model
  preserves the subject.
- For an accepted draft, call `beatra.images.edit`. Use at most two normalized
  `edit_regions` on `image_index=0` for localized fixes; omit regions for a
  whole-image adjustment.

Uploading makes bytes available to the remote tool; it does not itself inspect
the image. Review only visual facts the host can actually see.

Keep `model=auto` and `count=1` unless the user explicitly chooses otherwise.
Call `beatra.models.list` only for a real model, availability, compatibility,
or price decision. The detailed request shapes and examples are in
[workflow](references/workflow.md).

## Confirm and execute once

Planning and brief preparation are free. Before the paid image call, show and
freeze the final prompt, ordered references, canvas, poster type, style
direction, text-safe zone, model, controls, and output count. Merge any
still-material high-impact choice into this one confirmation.

After approval, create one stable opaque `client_request_id` for that exact
logical request and submit it once. A changed prompt, reference or order,
canvas, poster type, style direction, model, count, or control is new paid work
and needs a new confirmation and a new ID.

## Track, review, and deliver

After receiving a `task_id`, poll only that task with `beatra.tasks.get`. If the
ID is lost, use `beatra.tasks.list` to find candidates and verify the selected
one with `tasks.get`. Only when the original response status is genuinely
unknown may the exact same parameters and same `client_request_id` be used for
idempotent recovery. Slow polling, an update failure, an authorization failure,
or a connection failure never creates a replacement paid task.

Use `beatra.tasks.cancel` only when the user asks. If cancellation returns
`409`, continue tracking the original task. See [review and
recovery](references/review-and-recovery.md) for the full recovery contract.

When the result is visible, review visual impact (does the poster stop the
scroll and read clearly at a glance?), text readability (is there a clean
text-safe zone for the headline and details?), brand consistency (do colors and
mood match the category and brand direction?), canvas fit (is the ratio correct
for print or social?), and overall craft. Deliver the artifact links, observed
dimensions, task ID, and `billing.net_charged_credits`. Offer at most one
focused, unexecuted revision. Generated assets can also be viewed and managed at
[beatra.ai](https://beatra.ai).

## References by task

- Choosing among topic generate, photo transform, and draft refine, or planning
  for a specific poster type: [poster routing](references/poster-routing.md)
- Turning a request into a poster specification—composition, hierarchy,
  category styling, color, text-safe zones, and canvas sizes:
  [poster craft](references/poster-craft.md)
- Exact request shapes, ordered-reference labeling, and JSON examples for each
  route: [workflow](references/workflow.md)
- Lost task, slow task, cancellation, result review, or planning a revision:
  [review and recovery](references/review-and-recovery.md)
- First install or expired authorization:
  [installation and authentication](references/installation-and-auth.md)
- Bundled MCP Client commands and diagnostics:
  [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Installation registration: [installation registration](references/installation-registration.md)
- Task lookup, polling, and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, validation, and structured errors:
  [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting the installation: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Official sources, integrity checks, and update controls:
  [automatic updates and safety](references/automatic-updates-and-safety.md)

## Installation, updates, and account operations

For first use and shared operations, follow [installation and
authentication](references/installation-and-auth.md), [installation
registration](references/installation-registration.md), [tasks and
results](references/tasks-and-results.md), [billing, errors, and
recovery](references/billing-errors-and-recovery.md), and [uninstall and
disconnect](references/uninstall-and-disconnect.md).

This Skill performs a silent check at most once per 24 hours while a public
command runs. When a newer package exists, it installs automatically without
separate confirmation. Updates come only from the fixed official Beatra
discovery address and immutable Beatra CDN path for the embedded identity.
Before replacement, the client verifies the discovery document, manifest,
archive, and every packaged file using identity, size, and SHA-256 checks. It
replaces only package-owned files in this installed Skill directory. If any
check, download, replacement, or rollback fails, the current installation stays
usable and the original command continues. Canonical English installs stay on
`canonical/en`, and SkillHub Chinese installs stay on `skillhub/zh-CN`.

The user can persistently control automatic updates:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Read [automatic updates and safety](references/automatic-updates-and-safety.md)
for the official sources, integrity guarantees, replacement scope, failure
behavior, and control details.
