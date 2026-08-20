---
name: "ip-character-consistency-studio"
description: "Build a reusable AI character visual pack from one to four ordered reference images or an original character brief. Create character sheets, portraits, full-body poses, expressions, story scenes, and branded mascots with focused character traits, style anchors, and reusable scene references for comics, games, short videos, and content series."
---

# AI Character Design Sheet & Consistency Studio

Build a reusable character visual pack, then use its accepted anchor and
references to create new poses, expressions, and story scenes. Use this Skill
for an original character, comic or game concept, brand mascot, illustrated
content series, or a character that needs a coherent visual foundation across
new images.

Use this package when the user wants to choose an anchor and carry a character
brief into later poses, expressions, or scenes. Route a one-off illustration,
portrait, or unrelated concept image with no reusable character-asset goal to
`beatra-ai-image-studio` instead.

## Inputs and routes

Start from either:

- one to four accessible ordered reference images of the same character; or
- an original character brief with appearance, style, role, and first-use scene.

Reuse any name, audience, medium, visual style, palette, costume, props,
destination, and user-named must-keeps already in the conversation. Inspect
only reference images the host can actually view and record their visible role:
front view, side or three-quarter view, full body, expression, outfit, prop, or
style. If an image is not visible to the host, do not claim to have inspected
it; record the user's stated role instead. Upload is transport only, not
inspection; retain every returned artifact reference.

For an original character, create a small set of anchor concepts first and ask
the user to choose one accepted anchor before making follow-on scenes. For an
existing character, use ordered references to guide a new pose, expression, or
scene. Use an accepted anchor as the base image only when the user wants a
focused local adjustment; otherwise create a new composition guided by the
ordered reference set.

## Golden path

1. Form a character brief that separates identity traits from the requested
   scene. Capture face and silhouette, hairstyle, costume, palette, signature
   props, style, mood, destination, and the must-keeps that matter most. Read
   [character profile and references](references/character-profile.md) for
   source roles and profile reuse.
2. Choose `beatra.images.generate` for an original anchor, `beatra.images.transform`
   for a new scene guided by one to four ordered references, or
   `beatra.images.edit` for a focused adjustment of an accepted anchor. Read
   the current model card for the selected capability before setting the canvas,
   count, relationship, model, or controls.
3. Show the selected route, reference order and roles, character brief,
   scene brief, must-keeps, canvas, output count, model behavior, and current
   maximum price. Planning a character sheet or reviewing references is free;
   a paid image request begins only after the user approves the frozen plan.
4. Create one opaque, stable `client_request_id` for the exact paid request.
   Submit it once with the package's bundled `scripts/mcp_client.py`, retain
   the returned task ID, and poll that same task to a terminal result.
5. Review accessible results against the brief's named must-keeps: visible
   identity, silhouette, costume, palette, signature elements, expression,
   scene direction, and destination fit. Report any observed visual drift;
   references guide the next image but never justify a promise of pixel-level
   or cross-generation absolute consistency. Only when the user asks to retain
   the profile and names a project location, save accepted anchors and
   references there. Otherwise deliver their artifact references and order for
   the next scene. A focused follow-up becomes a new paid request with its own
   approval and ID.

## Paid changes, recovery, and delivery

One concept set or one scene card is one explicit paid request. When the user
chooses a 1–4 image set, confirm its exact count and maximum price before
submitting it. A changed character brief, reference image or order, anchor,
scene, canvas, count, relationship, model, seed, palette, or edit region is
new paid work with a new stable ID and approval.

Record the frozen payload, approval, create response, task ID, and terminal
result. If a create response is lost, retry only the identical payload with the
same ID. If the task ID is unavailable, use `beatra.tasks.list` and
`beatra.tasks.get` to recover the matching task before considering another
call. Queued and running tasks remain the original work. Call
`beatra.tasks.cancel` only when the user asks, then verify the resulting task
state before planning a replacement.

Deliver the returned image artifacts and only observed result facts, including
dimensions, format, resolved model, successful-image count, and
`billing.net_charged_credits` when returned. State what the host could inspect
and any observed drift from the must-keeps. Do not imply that Beatra stores a
character project: retain a reusable profile only in the user-selected location
after explicit approval; otherwise provide the accepted artifact references and
their ordered roles for a later request.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and pass its JSON
arguments on standard input:

```text
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"prompt":"Create a character anchor from the approved brief.","count":1,"client_request_id":"opaque-character-id"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI
as a fallback.

## References by task

- For reference order, character traits, anchor selection, and reusable
  profiles, read [character profile and references](references/character-profile.md).
- For route-specific requests, approval, task polling, recovery, cancellation,
  and result review, read [character-image workflow](references/workflow.md).
- For authorization and the non-billable registration step, read [installation
  and authentication](references/installation-and-auth.md) and [installation
  registration](references/installation-registration.md).
- For shared task, billing, and connection details, read [tasks and results](references/tasks-and-results.md), [billing, errors, and recovery](references/billing-errors-and-recovery.md), and [Bundled MCP Client diagnostics](references/mcp-connection.md).
- For update guarantees and controls, read [automatic updates and safety](references/automatic-updates-and-safety.md). For removal, read [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24
hours per installation. When a higher version is available, it installs
automatically without separate confirmation. It downloads only from the fixed
official Beatra discovery and immutable CDN paths for this package, channel,
and locale, verifies discovery data, archive, manifest, and every packaged
file, and replaces only package-owned files.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the original command
continues. An update failure never authorizes retrying a paid image request.
The setting persists for this installation. See [automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
