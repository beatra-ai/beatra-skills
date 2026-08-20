---
name: "douyin-cover-maker"
description: "Create a Douyin cover or vertical short-video cover from a video topic, hook, script, portrait, product photo, or reference image. This AI cover maker builds a clear focal visual and headline-safe composition for Douyin short-video covers, creator series, product demos, tutorials, food, lifestyle, and knowledge content, then refines an accepted draft into a consistent account-cover direction."
---

# Douyin Cover Maker

Create one Douyin or vertical short-video cover from a topic, hook, script,
key-frame screenshot, product or portrait photo, visual reference, or accepted
draft. It covers Douyin cover, Douyin short-video cover, viral-style cover, and
vertical-video cover requests. Reuse decisions already present in the conversation and
take the shortest route to one publish-ready cover.

## Choose the route

- **Generate from an idea:** turn a topic, hook, or script into a single cover
  concept with `beatra.images.generate`.
- **Compose from an image:** upload a key-frame screenshot, product, portrait,
  or ordered visual references and use `beatra.images.transform`. A video file
  is not an image reference: when the user starts with a video, ask for one
  exported key frame or screenshot, or use the topic-only route.
- **Refine an accepted draft:** use `beatra.images.edit` with the selected
  draft as `images[0]`; use at most two normalized local edit regions.

This Skill creates one new cover. Route an existing cover that only needs a
performance review to `cover-performance-preflight`; route a full video build
to `product-video-studio`.

## Shape the cover brief

Reuse the stated topic, hook, account style, target viewer, visual references,
and must-keep details. Ask only when a missing choice would materially change
the result. Choose the canvas from the user's current publishing surface or an
explicit source-frame requirement; for a vertical-video request without one,
ask the user to confirm the target canvas and freeze it in the paid-call
confirmation.

Build around one visual hook, one focal subject visible at phone size, one
style direction, a text-safe area, and any ordered image roles. Default to a
text-safe area rather than promising rendered Chinese typography. If the user
requests in-image words, include the exact short text in the confirmation and
verify it only when the result is visible.

## Prepare and confirm one paid request

Use only this Skill's bundled `scripts/mcp_client.py` for every remote Beatra
operation. Do not configure or call a host Beatra Connector and do not use
REST/OpenAPI as a fallback. Upload local image files through the bundled
client, then pass their artifact references in the declared order. The upload
does not inspect an image; review only facts the host can actually see.

Keep `model: "auto"` and `count: 1` by default. Call `beatra.models.list` only
for a real availability, compatibility, control, or price decision. Before the
generation, show and freeze the final prompt, canvas, ordered references and
roles, headline treatment, model, controls, and count. Planning is free;
generation is not.

After approval, create one opaque stable `client_request_id` that contains no
user content and submit exactly once. Any changed prompt, reference or order,
canvas, model, count, or control is new paid work and needs a new confirmation
and a new request ID. Use the request shapes in [workflow](references/workflow.md).

## Track, review, and deliver

Store the returned `task_id` and poll only that task through
`beatra.tasks.get`. When the task ID is lost, use `beatra.tasks.list` to find
candidates and verify the chosen task with `tasks.get`. Only when the original
creation response is genuinely unknown may the byte-equivalent payload be
replayed with the same `client_request_id`. Slow polling, connection, update,
or authorization failures never create replacement paid work.

Cancel only when the user asks. If cancellation returns `409`, continue
tracking the original task. When the artifact is visible, review phone-size
focal clarity, safe-area contrast, final canvas, crop resilience, and requested
must-keep details. Deliver artifact links, observed dimensions, task ID,
resolved model, and returned `billing.net_charged_credits`; offer one focused,
unexecuted refinement only.

## References by task

- Request payloads, image role ordering, and edit constraints:
  [workflow](references/workflow.md)
- First install or expired authorization:
  [installation and authentication](references/installation-and-auth.md)
- Bundled-client commands and diagnostics:
  [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Registration: [installation registration](references/installation-registration.md)
- Polling, lost tasks, and result fields: [tasks and results](references/tasks-and-results.md)
- Billing and structured recovery: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Update integrity and behavior: [automatic updates and safety](references/automatic-updates-and-safety.md)

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours during a public command.
When a newer version is available, the client installs it automatically without
separate confirmation. It downloads only from the fixed official Beatra discovery and
immutable CDN paths, verifies the archive, manifest, and every package-owned
file, and replaces only files owned by this package. If an update fails, the
current installation remains usable and the original command continues. The
setting persists for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
