---
name: "ai-short-drama-shot-maker"
description: "Generate one cinematic vertical micro-drama shot from a frozen dramatic beat, actor and scene references, and camera direction. This AI short drama shot maker and vertical micro-drama generator creates a live-action or cinematic shot from text alone, animates an approved opening image, interpolates motion between strict opening and ending images, or combines loose actor, location, and prop references into a new drama shot. Use it for romantic conflict, suspense reveal, reaction shot, dialogue close-up, establishing shot, period drama, emotional confrontation, and cinematic product-story moments, with frozen shot cards, shot-by-shot identity continuity, and honest review of each finished shot."
---

# AI Short Drama Shot Maker

Generate one cinematic vertical micro-drama shot from a frozen dramatic beat, actor and scene references, and camera direction. Use this Skill for AI short drama shots, vertical micro-drama scenes, romantic conflict, suspense reveal, reaction shots, dialogue close-ups, establishing shots, period drama, emotional confrontation, and cinematic product-story moments.

## Scope and adjacent routes

The normal route is one frozen dramatic beat that becomes one finished shot. Route an illustrated or comic motion-comic request to a comic-drama workflow; a storyboard or planning-image request to a storyboard workflow; and a broad non-narrative video request to a general video studio. Keep this route focused on cinematic, live-action, or photoreal human drama — vertical short-drama shots with explicit camera language and performance.

## Inputs and defaults

The hard inputs are:

- one dramatic beat: the character, action, location, emotion, camera, and visible outcome of this single shot;
- references are optional but strongly preferred for recurring actors or locations.

Ask only for a missing hard input. Reuse the known actor identity, costume, location, aspect ratio, and dialogue or narration preference. For a local image file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./opening-frame.jpg --mime-type image/jpeg
```

Upload is transport, not creative review. Retain the returned artifact reference and never pass a local path to a remote tool.

Default to one shot, `model: "auto"`, a vertical aspect ratio such as `9:16`, and the shortest integer duration the selected live video card admits. Freeze a shot card before any paid call: character identity, costume, location, action, emotion, camera language, blocking, composition, and the visible outcome. Route by source:

- text-only beat → `beatra.videos.generate`;
- one strict approved opening image → `beatra.videos.animate`;
- strict approved opening and ending images → `beatra.videos.interpolate`;
- loose actor, location, or prop references → `beatra.videos.generate_from_references`.

Generate dependent shots serially: review an identity-carrying shot before using its approved frame as a reference for the next shot.

## Golden path

1. Inspect every available image reference. Record its actual MIME type, width, height, aspect ratio, and byte size. Identify the actor identity, costume, location, action, emotion, camera language, blocking, composition, and the frozen dramatic beat this shot should deliver.
2. Build a shot card: character identity, costume, location, action, emotion, camera language, blocking, composition, and the visible outcome. Then write one positive prompt that encodes the performance, mood, and landing moment for this single shot.
3. Select the route by source. Call `beatra.models.list` with the matching capability to confirm a current card admits every actual media fact, camera control, and any driving audio. Keep the model at `auto` unless the user chose a concrete eligible model.
4. After `beatra.models.list` admits the complete payload, show an admission card before any `client_request_id` or `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, or `beatra.videos.generate_from_references` call: route and MCP tool name, source images, reference media when used, prompt, shortest admitted duration, resolution if set, output count, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Freeze them with one opaque stable `client_request_id`; then submit exactly one video call. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example, one strict opening image to animate:

   ```text
   printf '%s' '{"image":{"type":"artifact","artifact_id":"art_opening"},"prompt":"Slow dolly-in on the woman as her expression shifts from composure to tears, cinematic shallow depth of field, warm backlight.","aspect_ratio":"9:16","client_request_id":"opaque-drama-animate-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
   ```

   Strict opening and ending images to interpolate:

   ```text
   printf '%s' '{"first_frame":{"type":"artifact","artifact_id":"art_open"},"last_frame":{"type":"artifact","artifact_id":"art_end"},"prompt":"The man stands up slowly and turns to face the camera, tension building in his posture, cinematic vertical framing.","aspect_ratio":"9:16","client_request_id":"opaque-drama-interpolate-id"}' | python3 scripts/mcp_client.py call beatra.videos.interpolate
   ```

   Text-only beat:

   ```text
   printf '%s' '{"prompt":"A cinematic vertical shot: a woman in a red dress stands at a rainy bus stop at night, neon reflections on wet pavement, she turns as headlights approach, suspenseful mood, shallow depth of field.","aspect_ratio":"9:16","client_request_id":"opaque-drama-generate-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate
   ```

   Loose actor and location references:

   ```text
   printf '%s' '{"references":[{"kind":"image","media":{"type":"artifact","artifact_id":"art_actor"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art_location"}}],"prompt":"The actor walks through the reference location, discovers a letter on the table, reaction close-up, cinematic lighting.","aspect_ratio":"9:16","client_request_id":"opaque-drama-references-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit the chosen video tool exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for actor identity, costume, blocking, performance, camera language, vertical composition, emotional beat, dialogue timing, and continuity notes. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

Each shot is one paid video stage. A changed beat, actor reference, opening image, prompt, model, aspect ratio, duration, or video control is new logical paid work with a new ID, a new admission card, and fresh top-up or balance confirmation. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Short-drama shot workflow](references/workflow.md) when building a shot card, choosing a route, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing actor identity and continuity.
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
