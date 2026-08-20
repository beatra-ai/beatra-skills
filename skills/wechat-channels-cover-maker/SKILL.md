---
name: "wechat-channels-cover-maker"
description: "Create a WeChat Channels video cover, WeChat Video Account cover, or WeChat Channels thumbnail from a video topic, title, script, key frame, portrait, product photo, or reference image. This AI video cover maker builds a clear focal visual, a text-safe area, and a channel-consistent cover direction for WeChat Channels videos, creator updates, product explainers, local-business posts, and knowledge content."
---

# WeChat Channels Cover Maker

Create one WeChat Channels video cover from a topic, title, script, exported
key-frame screenshot, portrait, product photo, visual reference, or accepted
draft. Reuse the channel direction and the intended viewer context, then make
one clear cover that preserves the focal subject and space for the title.

## Scope and route choice

Use this Skill for a new cover image for a WeChat Channels video. It is for
knowledge sharing, a personal creator update, local-business promotion,
product explaining, and brand content. It does not extract a frame from an
uploaded video or publish a video.

For a WeChat Official Account article cover, use `wechat-cover-maker`. For a
video-account product clip, use `wechat-channels-product-video`. For a generic
existing-cover review, use `cover-performance-preflight`; for the video itself,
use `beatra-ai-video-studio`.

- **Create from the story:** use `beatra.images.generate` when the topic,
  title, or script is sufficient and no image source must be preserved.
- **Compose from images:** upload an exported key frame, portrait, product, or
  ordered references and use `beatra.images.transform`. If the user has only a
  video, ask for one exported key frame or screenshot; this image route has no
  video frame-reading tool.
- **Refine an accepted cover:** use `beatra.images.edit` with the accepted
  image as `images[0]` and no more than two normalized local edit regions.

## Shape the cover brief

Reuse the video topic, title, opening hook, channel style, target viewer,
portrait or product source, references, and must-keep details already in the
conversation. Choose the canvas from the user-stated destination, source
frame, or current publishing requirement. Prefer an explicit destination
preset. If the user confirms a source-derived aspect for an image transform,
its final ordered image anchors that aspect: put the intended canvas anchor
last, disclose that role in the confirmation, and never assume the first focal
source sets it. Propose a video-cover canvas only as a starting point; freeze
the actual canvas before paid work.

Plan one clear focal subject, a small-size visual hook, readable hierarchy,
and a title-safe area. Prefer title-safe space rather than promising exact
rendered Chinese words or logos. If the user requires in-image text, freeze
the exact short text and inspect it character by character only when it is
actually visible.

## Confirm and create one paid request

Planning, cover copy direction, and accessible-media inspection are free.
Image generation, transform, and focused edit are paid. Use only this package's
bundled `scripts/mcp_client.py` for remote Beatra operations. Do not configure
or call a host Beatra Connector, and do not use REST/OpenAPI as a fallback.

Upload local images through the bundled client and keep their roles in their
real input order. Uploading does not inspect media, so make visual claims only
from media the host can access. Keep `model: "auto"` and `count: 1` unless the
user selects another admitted route. Read `beatra.models.list` before a real
availability, compatibility, control, or price decision.

Before a paid request, show and freeze the route, prompt, exact canvas, image
roles and order, any source-derived last-image canvas anchor, headline
treatment, must-keeps, selected model and controls, `count: 1`, current billing
basis, maximum cost, paid call count, review plan, and one fresh opaque stable
`client_request_id`. Submit it once after explicit approval. A changed prompt,
source, source order, canvas, model, count, or control is new paid work
requiring a new confirmation and ID.

## Track, review, and deliver

Save the `task_id` and poll only that task with `beatra.tasks.get`. If the ID
is lost, use `beatra.tasks.list`, inspect candidates with `beatra.tasks.get`,
and compare the retained payload before considering a retry. Replay only a
byte-identical payload with the original ID when the initial creation response
is genuinely unknown. Slow polling, connection, update, or authorization
errors never justify another paid request.

Use `beatra.tasks.cancel` only when the user asks. If it returns `409`, keep
polling the original task and report its terminal state. When a result is
visible, review focal recognition, safe-area contrast, crop risk, confirmed
canvas, must-keep details, and any requested visible text. Deliver artifact
links, observed dimensions, task ID, resolved model, and returned
`billing.net_charged_credits`.

For payload shapes, live-card decisions, confirmation, recovery, and result
checks, use [the WeChat Channels cover workflow](references/workflow.md).

## References by task

- [WeChat Channels cover workflow](references/workflow.md): routes, payloads,
  confirmations, polling, and review.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use, authorization, and package registration.
- [Tasks and results](references/tasks-and-results.md) and [billing, errors,
  and recovery](references/billing-errors-and-recovery.md): task facts,
  artifacts, billing, and errors.
- [Bundled MCP Client diagnostics](references/mcp-connection.md): client
  operation and connection recovery.
- [Automatic updates and safety](references/automatic-updates-and-safety.md)
  and [uninstall and disconnect](references/uninstall-and-disconnect.md):
  package update controls and removal.

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24
hours per installation. When a higher version is available, it installs it
automatically without separate confirmation. It downloads only from fixed
official Beatra discovery and immutable CDN paths for this package, channel,
and locale; verifies discovery data, archive, manifest, and every file before
replacement; and replaces only package-owned files. Update checks, downloads,
verification, replacement, and rollback fail open: the current installation
remains usable and the original command continues. This setting persists for
later commands.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check`
reports the official available version without replacing files. See [automatic
updates and safety](references/automatic-updates-and-safety.md).
