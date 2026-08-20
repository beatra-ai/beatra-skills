---
name: "wechat-cover-maker"
description: "Turn an article title, topic, summary, or reference image into a WeChat Official Account cover, WeChat article cover, article hero image, post cover, headline image, or supporting article visual. This AI cover generator and article cover maker distills one clear visual hook, then creates either a rendered headline or a text-free headline-safe area. Use logos, portraits, products, and brand references to shape a brand cover image, and refine composition, focal point, color, thumbnail clarity, and crop resilience for a publish-ready WeChat cover design."
---

# WeChat Official Account Cover Maker

Create one focused article cover from an idea, a set of visual references, or an
accepted draft. Reuse decisions already present in the conversation and move by
the shortest route that completes the requested cover.

## Choose the route

- **Create from an idea:** when no source image exists, get the article title or
  topic, extract one visual hook, and use `beatra.images.generate`.
- **Compose from references:** with one to four logos, portraits, products, or
  brand images, preserve their declared order and use
  `beatra.images.transform`. A title or topic is needed only when it changes the
  composition or message.
- **Refine an accepted draft:** use `beatra.images.edit` with the draft as
  `images[0]`. The accepted draft and requested change are sufficient to begin.

Follow [intent and routing](references/intent-and-routing.md) for the precise
branch and [canvas and cover craft](references/canvas-and-cover-craft.md) when
turning the brief into a visual specification.

## Shape one useful brief

Reuse the user's article context, visual references, dimensions, title choice,
and must-keep details. Ask only when a missing decision materially changes the
result. For a standard WeChat article cover, propose `900 × 383` as the working
canvas; otherwise prefer the user's stated dimensions or an accepted draft's
existing ratio. Confirm a different destination only when it changes the
composition.

Build the brief around:

- one message and one visual hook that remains clear at thumbnail size;
- one focal subject, with supporting details kept subordinate;
- one explicit canvas;
- either the user's exact short headline in the image or a text-free,
  high-contrast headline-safe area;
- ordered visual references and must-keep people, products, logos, colors, or
  composition details.

If the user has already chosen the headline treatment, reuse it. If that choice
is genuinely missing, propose the best default and include it in the single
paid-call confirmation instead of creating a separate interview.

## Prepare the call

Use only this Skill's bundled `scripts/mcp_client.py` for every remote MCP
operation. The tool name is a CLI argument and the tool arguments are the JSON
sent on stdin. Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback. For exact commands and troubleshooting, use
[bundled MCP Client diagnostics](references/mcp-connection.md).

- With no source image, call `beatra.images.generate` with an explicit
  `canvas`.
- With one to four ordered references, upload local files through the bundled
  client helpers, then call `beatra.images.transform` with an explicit canvas.
- For an accepted draft, call `beatra.images.edit`. Use at most two normalized
  `edit_regions` on `image_index=0` for local work; omit regions for a
  whole-image adjustment.

Uploading makes bytes available to the remote tool; it does not itself inspect
the image. Review only visual facts the host can actually see.

Keep `model=auto` and `count=1` unless the user explicitly chooses otherwise.
Call `beatra.models.list` only for a real model, availability, compatibility, or
price decision. The detailed request shapes and examples are in
[workflow](references/workflow.md).

## Confirm and execute once

Planning and brief preparation are free. Before the paid image call, show and
freeze the final prompt, ordered references, canvas, headline treatment, model,
controls, and output count. Merge any still-material high-impact choice into
this one confirmation.

After approval, create one stable opaque `client_request_id` for that exact
logical request and submit it once. A changed prompt, reference or order,
canvas, model, count, or control is new paid work and needs a new confirmation
and a new ID.

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

When the result is visible, review thumbnail recognition, hierarchy, focal
point, headline legibility or safe-area contrast, canvas fit, crop risk, and
must-keep details. Deliver the artifact links, observed dimensions, task ID,
and `billing.net_charged_credits`. Offer at most one focused, unexecuted
revision. Generated assets can also be viewed and managed at
[beatra.ai](https://beatra.ai).

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

```bash
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Read [automatic updates and safety](references/automatic-updates-and-safety.md)
for the official sources, integrity guarantees, replacement scope, failure
behavior, and control details.
