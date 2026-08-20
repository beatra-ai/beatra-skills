---
name: "rednote-cover-maker"
description: "Turn a photo, a topic idea, or an accepted draft into a scroll-stopping REDnote (Xiaohongshu) cover and post image. This AI cover generator creates vertical 3:4 Xiaohongshu note covers with clean backgrounds, bold focal composition, and text-safe areas for beauty, food, fashion, travel, and knowledge content. Generate high-click Xiaohongshu note covers, OOTD post images, food photography covers, product recommendation visuals, and lifestyle note illustrations from one photo or a topic description. Start from a real photo, compose from multiple references, or refine an accepted cover toward a publish-ready result."
---

# REDnote Cover Maker

Create one scroll-stopping REDnote (Xiaohongshu) cover or post image from a photo,
a topic idea, or an accepted draft. Reuse decisions already present in the
conversation and move by the shortest route that completes the requested cover.

## Choose the route

- **Transform a photo into a cover:** with one photo—food, product, outfit,
  selfie, or scene—enhance it into a polished vertical 3:4 Xiaohongshu cover
  with clean background, professional lighting, and a text-safe area using
  `beatra.images.transform`. This is the default when a source photo exists.
- **Generate a cover concept from a topic:** when no source photo exists, turn
  the topic or note idea into a click-worthy cover visual using
  `beatra.images.generate`.
- **Refine an accepted cover:** use `beatra.images.edit` with the accepted cover
  as `images[0]` to fix color, lighting, background blemishes, or composition
  without changing the overall layout.

Follow [cover routing](references/cover-routing.md) for the precise branch and
[cover craft](references/cover-craft.md) when turning the request into a visual
specification that fits Xiaohongshu's platform aesthetic.

## Shape one cover brief

Reuse the user's content topic, target audience, style preference, and any
visual references. Ask only when a missing decision materially changes the
result. For a standard Xiaohongshu cover, propose a vertical 3:4 canvas with a
clean background and a text-safe top or center zone as the default.

Build the brief around:

- the note topic and category—beauty, food, fashion, travel, home, knowledge,
  product recommendation, or lifestyle;
- one focal subject—the dish, product, outfit, person, or scene that anchors
  the cover;
- one style direction—clean and bright, warm and appetizing, editorial and
  minimal, cozy and atmospheric, or bold and high-contrast;
- a text-safe zone preference—top third, center, or bottom—so the user can
  add their headline overlay later without clashing with the image;
- ordered visual references when available (style inspiration, color
  reference, composition reference).

If the user has already stated the topic or style, reuse it. If that choice is
genuinely missing, propose the best default and include it in the single
paid-call confirmation.

## Prepare the call

Use only this Skill's bundled `scripts/mcp_client.py` for every remote MCP
operation. The tool name is a CLI argument and the tool arguments are the JSON
sent on stdin. Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback. For exact commands and troubleshooting, use
[Bundled MCP Client diagnostics](references/mcp-connection.md).

- Upload the source photo through the bundled client helpers first, then call
  `beatra.images.transform` with the uploaded artifact as the first ordered
  reference. Label the photo's role explicitly in the prompt so the model
  preserves the subject.
- For a topic-only concept, call `beatra.images.generate` with a vertical 3:4
  canvas and a prompt that captures the desired mood, color palette, and
  composition.
- For an accepted cover, call `beatra.images.edit`. Use at most two normalized
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
freeze the final prompt, ordered references, canvas, style direction, text-safe
zone, model, controls, and output count. Merge any still-material high-impact
choice into this one confirmation.

After approval, create one stable opaque `client_request_id` for that exact
logical request and submit it once. A changed prompt, reference or order,
canvas, style direction, model, count, or control is new paid work and needs a
new confirmation and a new ID.

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

When the result is visible, review thumbnail clarity (is the focal subject
recognizable at small size?), text-safe zone (is there clean space for a
headline overlay?), color and lighting (does it match the Xiaohongshu aesthetic
for the category?), canvas fit (is the vertical 3:4 ratio correct?), and
overall click appeal. Deliver the artifact links, observed dimensions, task ID,
and `billing.net_charged_credits`. Offer at most one focused, unexecuted
revision. Generated assets can also be viewed and managed at
[beatra.ai](https://beatra.ai).

## References by task

- Choosing among photo transform, topic concept, and cover refine, or planning
  for a specific Xiaohongshu content category: [cover routing](references/cover-routing.md)
- Turning a request into a Xiaohongshu-style cover specification: [cover craft](references/cover-craft.md)
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
