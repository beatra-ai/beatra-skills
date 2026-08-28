---
name: "bilibili-video-storyboard"
description: "Create a Bilibili video storyboard from a topic, title, outline, or script. This AI Bilibili storyboard maker turns a long-form video idea into a chapter-led shot list, Bilibili video script, camera direction, narration and B-roll cues, and one to four storyboard key frames for explainers, reviews, tutorials, vlogs, gameplay, animation, and creative videos."
---

# Bilibili Video Storyboard

Turn a Bilibili topic, title, outline, or script into a chapter-led video
storyboard that an UP creator, director, camera operator, editor, or AI-video
artist can review before production. Deliver a complete written shot list first,
then create one to four selected key frames that make the most important visual
beats easy to align.

Use this Skill for Bilibili explainers, reviews, tutorials, Vlogs, gameplay,
animation, creative videos, and channel-series planning. A request for one new
cover belongs to `bilibili-thumbnail-maker`; a platform-neutral film, ad, or
animation board belongs to `ai-storyboard-generator`; and approved plans can
continue into `beatra-ai-video-studio` when the requested result is finished
footage. Prove the sequence works before paying for key frames. Route
publishing copy to `bilibili-publishing-pack`.

## Inputs and defaults

Start with at least one of: a Bilibili topic, title, outline, script, chapter
plan, or a brief that identifies the intended viewer and video outcome. Reuse
known channel voice, series conventions, target duration, intended publishing
view, product or factual must-keeps, people, locations, and visual references.
For a source clip or Bilibili page, use a supplied transcript, outline, or
exported screenshots as the planning source and label the role of every image
reference.

Default to a chapter-led creator plan with an opening hook, a clear section
progression, one visual purpose per shot, a purposeful transition or retention
reset between major sections, and a final viewer prompt. Keep the user's
existing canvas and visual direction when known. Otherwise, defer the exact
canvas choice until selected key frames are ready for paid work.

## Golden path

The path is a topic or script, a beat sheet, human approval, then a limited
set of key frames.

1. Turn the source into a free, reviewable Bilibili shot list. For every shot,
   show its chapter and story beat, time range, subject and action, frame size
   and composition, camera angle and intended movement, narration or sound
   cue, B-roll or graphic cue, and concise still-frame brief.
2. Review the complete order with the user. Select the one to four shots that
   need key frames, preserving the must-keeps, source-reference roles, canvas,
   and visual direction for each selected shot. Read [Bilibili storyboard
   planning and key frames](references/workflow.md) for the route-specific
   request shapes.
3. Before creating any key frame, read the live model card for the selected
   image capability. Show the route, complete prompt, reference order, canvas,
   count, model behavior, and current maximum price. Start paid work only after
   the user approves that frozen plan.
4. Treat each selected shot as its own `count: 1` paid image request. Give each
   one opaque, stable `client_request_id`; keep at most two image tasks in
   flight, track them to a terminal state, and then continue with any remaining
   approved shots.

## Execute once, review, and deliver

Use only this Skill's bundled `scripts/mcp_client.py` for every remote Beatra
operation. Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback. Upload local screenshots or reference images through
the bundled client. Uploading provides an artifact reference; make visual claims
only when the source or result is actually accessible to the host.

Save each returned `task_id` and poll only that task through `beatra.tasks.get`.
When a create response is genuinely unknown, replay only the byte-equivalent
frozen request with the same `client_request_id`. When a task ID is missing,
use `beatra.tasks.list`, confirm a candidate with `beatra.tasks.get` against
the recorded request, and continue that task rather than submitting another
paid request. Cancel only when the user asks; a `409` means the original task
still runs and should keep being tracked.

For accessible key frames, review the approved story beat, subject and action,
composition, camera intent, canvas, and named must-keeps. Deliver the ordered
shot list, the returned key-frame artifacts, actual dimensions and formats,
resolved model, task identities, and returned charge facts. A visual correction
or additional key frame is newly scoped paid work and needs its own approval.

## References by task

- Read [Bilibili storyboard planning and key frames](references/workflow.md)
  when preparing a chapter plan, choosing an image route, creating a key frame,
  or recovering an image task.
- Read [installation and authentication](references/installation-and-auth.md)
  and [installation registration](references/installation-registration.md) for
  authorization and the non-billable registration step.
- Read [tasks and results](references/tasks-and-results.md), [billing, errors,
  and recovery](references/billing-errors-and-recovery.md), and [Bundled MCP
  Client diagnostics](references/mcp-connection.md) for shared runtime detail.
- Read [automatic updates and safety](references/automatic-updates-and-safety.md)
  for update behavior and controls, and [uninstall and
  disconnect](references/uninstall-and-disconnect.md) when removing the Skill.

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24
hours per installation. When a higher version is available, it installs
automatically without separate confirmation. It downloads only from the fixed
official Beatra discovery and immutable CDN paths for this package, channel,
and locale; verifies discovery data, archive, manifest, and every packaged
file; and replaces only package-owned files.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the original command
continues. An update failure never authorizes another paid key-frame request.
The setting persists for this installation. See [automatic updates and
safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
