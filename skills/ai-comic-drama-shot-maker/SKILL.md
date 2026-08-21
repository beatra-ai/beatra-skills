---
name: "ai-comic-drama-shot-maker"
description: "Turn a comic panel, character sheet, webtoon frame, or frozen story beat into one dynamic comic-drama shot. This AI comic drama generator and motion comic maker animates an approved comic panel or manga frame into a short live shot, interpolates motion between a first and last comic panel, combines loose character, style, and scene references into a new comic-drama shot, or creates an original comic first frame and brings it to life. Use it for web-novel comic shots, motion comics, webtoon to video, manga panel animation, character entrances, emotional close-ups, action panels, dialogue reactions, and serialized creator workflows, with frozen character identity, approved art direction, and honest review of each independently generated shot."
---

# AI Comic Drama Shot Maker

Turn a comic panel, character sheet, webtoon frame, or frozen story beat into one dynamic comic-drama shot. Use this Skill for AI comic drama, motion comics, web-novel comic shots, manga panel animation, character entrances, emotional close-ups, action panels, dialogue reactions, and serialized creator workflows.

## Scope and adjacent routes

The normal route is one approved visual source and one frozen story beat that becomes one dynamic shot. Route a live-action or cinematic human-drama request to a short-drama workflow; a storyboard or planning-image request to a storyboard workflow; and a broad non-narrative video request to a general video studio. Keep this route focused on illustrated and comic visual language — manga, webtoon, Chinese comic, anime, and illustrated motion-comic shots.

## Inputs and defaults

The hard inputs are:

- one shot event: the character, action, scene, emotion, camera, and visible end state of this single shot;
- at least one approved visual source: a comic panel, manga frame, character sheet, or webtoon page — or a creative brief sufficient to create and approve an original comic first frame.

Ask only for a missing hard input. Reuse the known art style, character identity, costume, scene, aspect ratio, and dialogue or narration preference. For a local image file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./comic-panel.png --mime-type image/png
```

Upload is transport, not creative review. Retain the returned artifact reference and never pass a local path to a remote tool.

Default to one shot, `model: "auto"`, a source-derived aspect ratio, and the shortest integer duration the selected live video card admits. Freeze a shot card before any paid call: character identity, costume, art style, scene, action, emotion, camera, composition, and the visible end state. Route by input semantics:

- one strict approved panel or character image → `beatra.videos.animate`;
- strict approved first and last comic panels → `beatra.videos.interpolate`;
- multiple loose character, style, or scene references → `beatra.videos.generate_from_references`;
- no visual source → create and approve an original comic first frame through `beatra.images.generate`, then animate it.

Each shot is an independent deliverable. Generate dependent shots serially: review an identity-carrying shot before using its approved frame as a reference for the next shot.

## Golden path

1. Inspect every available visual source. Record its actual MIME type, width, height, aspect ratio, and byte size. Identify the character identity, costume, art style, scene, action, emotion, camera, composition, and the frozen story beat this shot should deliver.
2. Build a shot card: character identity, costume, art style, scene, action, emotion, camera, composition, and the visible end state. Then write one positive prompt that encodes the motion, mood, and landing moment for this single shot.
3. Select the route by input semantics. Call `beatra.models.list` with the matching capability to confirm a current card admits every actual media fact, art-direction control, and any driving audio. If an original first-frame image is needed, read its image card separately and match the request to live `pricing.options`; never multiply its customer estimate by source-image count. Keep the model at `auto` unless the user chose a concrete eligible model.
4. After `beatra.models.list` admits the complete video payload, show an admission card before any video `client_request_id` or `beatra.videos.animate`, `beatra.videos.interpolate`, or `beatra.videos.generate_from_references` call: route and MCP tool name, source images, reference media when used, prompt, shortest admitted duration, resolution if set, output count, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. An original first-frame image stage is its own paid card and does not authorize the video call. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. If an image price option is not uniquely determined before admission, show its live range and use the maximum as the approval ceiling. Freeze each stage with one opaque stable `client_request_id`; then submit exactly one call for that stage. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example, one strict panel to animate:

   ```text
   printf '%s' '{"image":{"type":"artifact","artifact_id":"art_panel"},"prompt":"Animate the character turning toward the camera with wind blowing through their hair, keeping the cel-shaded art style and costume unchanged.","client_request_id":"opaque-comic-animate-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
   ```

   Strict first and last panels to interpolate:

   ```text
   printf '%s' '{"first_frame":{"type":"artifact","artifact_id":"art_first"},"last_frame":{"type":"artifact","artifact_id":"art_last"},"prompt":"The character rises from a crouch into a determined stance, comic speed lines radiating outward.","client_request_id":"opaque-comic-interpolate-id"}' | python3 scripts/mcp_client.py call beatra.videos.interpolate
   ```

   Multiple loose references:

   ```text
   printf '%s' '{"references":[{"kind":"image","media":{"type":"artifact","artifact_id":"art_character"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art_style"}}],"prompt":"A dynamic entrance shot of the character bursting through a door, matching the reference art style.","client_request_id":"opaque-comic-references-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
   ```

   No visual source — create the first frame, then animate it after approval:

   ```text
   printf '%s' '{"prompt":"A cel-shaded comic panel: a young swordsman in a tattered cloak standing on a cliff at dawn, determined expression, speed lines in the background, vertical composition.","client_request_id":"opaque-comic-frame-id"}' | python3 scripts/mcp_client.py call beatra.images.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit the chosen video tool exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for faces, costumes, drawing style, composition, action readability, mouth movement when applicable, endpoint behavior, and identity continuity across separately generated shots. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

Each shot is one paid video stage. An image stage that creates an original first frame is a separate paid stage with its own request ID. A changed character identity, art style, panel, reference, prompt, model, aspect ratio, duration, or video control is new logical paid work with a new ID, a new admission card for a video stage, and fresh top-up or balance confirmation. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Comic-drama shot workflow](references/workflow.md) when building a shot card, choosing a route, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing identity and art-style consistency.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md) for update guarantees and controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation. Before ordinary commands it silently checks for a newer release at most once every 24 hours per installation. Silent checks are enabled by default, and a newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable Beatra CDN path embedded for this package, channel, and locale. It verifies the discovery data, archive, manifest, and every file's size and checksum before replacement. It replaces only package-owned files and rejects redirects, downgrades, wrong package/channel/locale/version data, unexpected URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery fail open: the current installation remains usable and the user's original command continues. An update failure never authorizes retrying a paid generation. The automatic-update choice persists across later commands for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files.
