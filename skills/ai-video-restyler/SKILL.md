---
name: "ai-video-restyler"
description: "Restyle one short video into a new visual treatment while carrying forward the source subject, action, composition, and camera intent. This AI video restyler and video style transfer workflow turns live action into anime, illustration, Chinese comic, ink, clay, paper-cut, or cyberpunk looks from one source clip and a chosen art direction, and reviews style match, subject identity, motion continuity, and source-audio result. Use it for live action to anime, brand visual refresh, Chinese-comic looks, fashion films, music visuals, and creator experiments, with one dominant visual change per run and honest post-result review."
---

# AI Video Restyler

Restyle one short source video into a coherent new visual treatment while carrying forward the source subject, action, composition, and camera intent. Use this Skill for live-action-to-anime, illustration, Chinese-comic, ink, clay, paper-cut, cyberpunk, retro-film, commercial visual refresh, or a supplied reference-style conversion.

## Scope and adjacent routes

The normal route is one source video, one chosen target style, and one restyled clip. Route a request to remove an AI look and make footage more natural to a video-realism workflow; a request to add footage before or after the clip to a video-continuation workflow; and a request to begin and end on two fixed images to a first-and-last-frame workflow. Keep this route focused on whole-clip generative restyling of one existing video.

## Inputs and defaults

The hard inputs are:

- one accessible source video the host Agent can inspect;
- one target style or visual reference direction;
- the source elements to preserve.

Ask only for a missing hard input. Reuse the known scene, mood, destination, aspect ratio, and source-audio preference. For a local video file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./source-clip.mp4 --mime-type video/mp4
```

Upload is transport, not creative review. Retain the returned artifact reference and never pass a local path to a remote tool.

Default to one restyled clip, `model: "auto"`, and a source-derived aspect ratio. Build one positive edit instruction with a single visual thesis: the one dominant visual change this run should deliver. Optional ordered image or video references should clarify the target style rather than add unrelated content. Treat subject identity, key actions, camera movement, composition, scene, and the source-audio intent as must-keeps and review the result for drift rather than promising exact preservation.

## Golden path

1. Inspect the source video. Record its actual MIME type, width, height, aspect ratio, duration, and byte size. Identify the subject, silhouette, key actions, camera movement, composition, scene, dominant palette, source audio, and the requested target style.
2. Build a preservation brief: subject identity, silhouette, key actions, camera movement, composition, scene, dominant palette, and source-audio intent. Then write one positive edit instruction that states the single dominant visual change.
3. Call `beatra.models.list` with `{"capability":"video_edit"}` before naming compatibility, duration, resolution, or a numeric estimate. Admit the complete payload against one current card: the source clip's actual MIME type, dimensions, duration, byte size, and any reference media, plus live duration behavior and price basis. When duration is a sendable control rather than source-derived, write the shortest admitted integer. Keep the model at `auto` unless the user chose a concrete eligible model. Any numeric estimate is provisional; the terminal task's `billing.net_charged_credits` is final.
4. Show an admission card before any `client_request_id` or `beatra.videos.edit` call: route `video_edit`, tool `beatra.videos.edit`, source, instruction, duration if set, resolution if set, output count, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Freeze the exact payload with one opaque stable `client_request_id`; then submit one `beatra.videos.edit` call exactly once. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"source_video":{"type":"artifact","artifact_id":"art_source"},"instruction":"Restyle the clip into a soft hand-drawn anime look with warm cel shading, keeping the subject, action, and camera unchanged.","client_request_id":"opaque-restyle-id"}' | python3 scripts/mcp_client.py call beatra.videos.edit
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.videos.edit` exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for style match, subject and object structure, camera continuity, motion, temporal coherence, source-audio result, ratio, and actual duration. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

Restyling is one paid stage. A changed source video, reference media, edit instruction, model, aspect ratio, duration, or video control is new logical paid work with a new ID, a new admission card, and fresh top-up or balance confirmation. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Video restyle workflow](references/workflow.md) when building a preservation brief, choosing references, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing style consistency.
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
