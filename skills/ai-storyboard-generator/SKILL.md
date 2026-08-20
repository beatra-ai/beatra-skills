---
name: "ai-storyboard-generator"
description: "Turn a script, scene, or ad brief into a structured AI storyboard plan with a practical shot list and one to four storyboard key-frame images. Plan shot types, camera angles and movement, action, timing, dialogue, and sound for short films, ads, animation, social video, motion comics, and creative pitches."
---

# AI Storyboard Generator

Turn a script, scene, or advertising brief into a reviewable shot plan and a
small set of approved storyboard key frames. Use this Skill for short films,
ads, animation, social-video concepts, motion comics, vertical dramas, or a
creative pitch that needs a shared visual direction before production.

Use the resulting shot plan as the source of truth for a later image or video
production request. A one-off illustration without shot planning belongs to
`beatra-ai-image-studio`; a reusable character asset pack belongs to
`ip-character-consistency-studio`; and a request to produce finished moving
footage can continue through `beatra-ai-video-studio` after the board is
accepted.

## Inputs and defaults

Start with a script excerpt, scene outline, story concept, or advertising
brief. Reuse already-known audience, platform, duration target, format,
language, brand cues, characters, locations, product facts, references, and
must-keeps. Ask only when a missing choice would change the board: for example,
the intended medium or orientation, the principal audience or message, or the
scene whose visual direction needs deciding.

Default to a concise editorial shot plan: one central visual idea per shot,
clear progression of beats, an explicit camera intention, and a short written
frame prompt. Keep existing aspect ratio and visual references when they are
provided; otherwise use the destination's normal aspect ratio. Do the written
planning first, then ask the user to select the one to four shots that deserve
visual key frames.

## Golden path

1. Turn the supplied material into a shot list. For each shot, provide the
   scene and story beat, subject and action, shot size and composition, camera
   angle and intended movement, timing estimate, dialogue or sound cue, and a
   concise still-frame prompt. This planning step does not create a paid media
   task.
2. Review the story order and visual direction with the user. Record each
   approved key-frame candidate, its source references if any, its must-keeps,
   canvas, and the desired visual style. Read [storyboard planning and key
   frames](references/workflow.md) when a shot needs a route-specific request.
3. Before creating any key frame, read the live model card for the selected
   image capability. Show the route, the complete prompt and references in
   order, canvas, output count, model behavior, and current maximum price.
   Start paid work only after the user approves that frozen plan.
4. Treat each different shot as its own `count: 1` paid request. The current
   package may create one to four approved key frames, therefore at most four
   paid image requests, with no more than two generation tasks in flight at one
   time; poll that pair to a terminal state before submitting a later pair. The
   API's multi-image count is not a substitute for a verified storyboard
   sequence. Use a multi-image sequence only after a live model card and a
   representative sample establish that exact route.
5. Give each approved request one opaque, stable `client_request_id`. Submit it
   once through this package's bundled client, retain the task ID, and poll the
   same task to a terminal result. Review accessible frames against their named
   composition, subject, action, camera, style, and canvas must-keeps.
6. Deliver the editable shot list and the returned key-frame artifacts in shot
   order, including actual dimensions, format, resolved model, task identity,
   and billed credits when returned. A changed shot is a new paid request with
   its own approval and ID.

## Key-frame routes and paid work

Use `beatra.images.generate` for a new visual direction from the approved shot
brief. Use `beatra.images.transform` when one to four ordered reference images
should guide a new shot. Use `beatra.images.edit` when a selected key frame is
the base image for a focused adjustment; put that base in `images[0]` and later
references in their intended order. For a local source, use the bundled upload
helper; it requests the upload grant, completes its returned HTTP PUT, and
prints the resulting artifact reference. Upload is transport only and does not
establish what the host can visually inspect:

```text
python3 scripts/mcp_client.py upload ./approved-reference.png --mime-type image/png
```

For every paid key frame, freeze the shot number, source and source order,
prompt, must-keeps, canvas, count, relationship, model selection, and controls.
Changing any of these is newly scoped paid work. If a reference or returned
frame is not visible to the host, identify its role from the user's description
instead of claiming visual inspection.

## Recovery and result review

Record the approved payload, create response, task ID, and terminal result. If
a create response is lost, retry only the identical frozen payload with the
same request ID. If the task ID is unavailable, use `beatra.tasks.list` and
`beatra.tasks.get` to find and confirm the matching task before considering
another submission. Queued and running tasks remain the original request.

When the user asks to cancel, call `beatra.tasks.cancel` once and confirm the
task state with `beatra.tasks.get`. Deliver observed facts rather than inferred
ones: inspect only accessible pixels, and report any observed drift from the
approved composition, subject, action, camera, style, or canvas.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Pass the tool name after `call` and one JSON object on
standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"prompt":"Create the approved key frame for shot 01.","count":1,"client_request_id":"opaque-storyboard-shot-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI
as a fallback.

## References by task

- Read [storyboard planning and key frames](references/workflow.md) for the
  shot-list format, image route, paid request, result review, and recovery.
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
