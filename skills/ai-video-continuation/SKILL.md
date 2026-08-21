---
name: "ai-video-continuation"
description: "Continue one short source clip naturally before or after its existing action from a continuity state and the next visual beat. This AI video continuation and generative extend workflow adds matching footage to the opening or ending of a clip — holding a moment longer, completing a reveal, adding a lead-in, or creating a natural ending — and reviews the seam, motion direction, subject identity, camera and lighting continuity, audio behavior, and final duration. Use it for stronger endings, longer holds, action continuation, product reveals, landscape extensions, and creator iterations."
---

# AI Video Continuation

Continue one short source clip naturally before or after its existing action. Use this Skill when the user already has one source video and asks to continue the next action, hold a moment longer, extend an establishing shot, add a lead-in, complete a reveal, create a natural ending, or generate the next beat of footage that joins the source.

## Scope and adjacent routes

The normal route is one source video, one before/after direction, and one extended clip. Route a request to restyle an existing clip into a new visual style to a video-restyle workflow; a request to alter existing frames of the source rather than add new footage to a video-edit workflow; and a request to begin and end on two fixed images to a first-and-last-frame workflow. Keep this route focused on adding matching footage to one source video, not on assembling multiple clips.

## Inputs and defaults

The hard inputs are:

- one accessible source video the host Agent can inspect;
- the continuation direction — add footage before the start or after the end;
- the next visual beat the new footage should reach.

Ask only for a missing hard input. Reuse the known scene, mood, subject, camera, and source-audio preference. The trusted source duration is itself a hard planning input, because the extension is sized against it.

For a local source file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./source-clip.mp4 --mime-type video/mp4
```

Upload is transport, not creative review. Retain the returned artifact reference and never pass a local path to a remote tool.

Default to one extended clip and `model: "auto"`. Extract a continuity state from the final or opening portion of the source: subject, pose and action vector, camera movement, framing, lens feel, lighting, color, environment, and source-audio intent. Then state one continuation beat — the single next event the new footage should reach.

## Golden path

1. Inspect the source video. Record its actual MIME type, width, height, aspect ratio, duration, and byte size. Identify the subject, pose and action vector, camera movement, framing, lens feel, lighting, color, environment, source audio, the requested before/after direction, and the next visual beat.
2. Build a continuity state from the final portion (for after-extension) or opening portion (for before-extension): subject, pose and action vector, camera movement, framing, lens feel, lighting, color, environment, and source-audio intent. Then state one continuation beat.
3. Call `beatra.models.list` with `{"capability":"video_extend"}` before naming compatibility, duration, resolution, or a numeric estimate. Admit the complete payload against one current card: the source clip's actual MIME type, dimensions, duration, and byte size, that card's live final-duration maximum, direction control, optional reference limits, and price basis. Keep the model at `auto` unless the user chose a concrete eligible model. Any numeric estimate is provisional; the terminal task's `billing.net_charged_credits` is final.
4. Choose the extension duration. The request `duration` is the final returned-video duration, not seconds to add: it must be an integer that exceeds the trusted source duration and stays within the live maximum. Prefer the shortest admitted final duration that still exceeds the source. If the source already meets or exceeds the current maximum, this route cannot enter and the user must be told plainly. Show an admission card before any `client_request_id` or `beatra.videos.extend` call: route `video_extend`, tool `beatra.videos.extend`, source, direction, next beat, final duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Freeze the exact payload with one opaque stable `client_request_id`; then submit one `beatra.videos.extend` call exactly once. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"video":{"type":"artifact","artifact_id":"art_source"},"duration":10,"direction":"after","instruction":"Continue the shot forward: the subject turns and walks toward the window, keeping the same lens, lighting, and pacing.","client_request_id":"opaque-extend-id"}' | python3 scripts/mcp_client.py call beatra.videos.extend
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.videos.extend` exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for the seam, motion direction, subject identity, camera and lighting continuity, audio behavior, final duration, and whether the new event advances naturally. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

An extension is one paid stage. A changed source video, continuation direction, next beat, final duration, model, or control is new logical paid work with a new ID, a new admission card, and fresh top-up or balance confirmation. The `duration` is the final returned-video duration each time; it never means seconds to add. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Video continuation workflow](references/workflow.md) when building a continuity state, choosing the next beat, checking live model facts, sizing the final duration, constructing exact payloads, polling, recovering, cancelling, or reviewing seam and continuity.
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
