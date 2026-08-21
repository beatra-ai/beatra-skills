---
name: "video-realism-retoucher"
description: "Polish an existing AI-generated short video with a focused realism retouch. This focused AI video retouch refines artificial lighting, synthetic materials, oversaturated color, and repeated or distracting detail in one selected pass, while carrying forward the shot's subject, camera framing, timing, and intended mood. Use it for AI video cleanup, video retouching, natural-looking video polish, product clips, ad creative, social video, and short-form footage that needs a cleaner, more believable finish."
---

# AI Video Realism Retoucher

Polish one selected realism issue in an existing AI-generated short video while
carrying forward the shot elements the user already accepts. Use this focused
route for artificial-looking light, synthetic material texture, over-saturated
color, or repeated visual detail in a product clip, ad shot, social video, or
other short-form footage.

Start from one source clip and one chosen problem cluster. The result is one
source-led visual retouch, rather than a new sequence or a broad video
production job. Keep the supplied subject, framing, camera movement, timing,
scene mood, and other named details as must-keeps, then report any visible
drift after delivery.

## Inputs and defaults

The hard input is one accessible existing source video. Reuse its destination,
the selected visible problem, the user's must-keeps, and audio intent when
they are already known. Ask a compact question only when the user has not
identified which single problem to prioritize or a missing choice changes the
paid payload.

Unless the user chooses otherwise:

- address one problem cluster: light, material texture, color saturation, or
  repeated detail;
- use `model: "auto"` only when the live auto-eligible set has compatible
  source-ratio and duration behavior; otherwise select one compatible live
  model before the paid confirmation;
- omit an explicit aspect ratio only when the frozen live model card says the
  output is source-derived; otherwise show its default or an admitted explicit
  aspect-ratio control and obtain confirmation; and
- omit `duration` only when the frozen live model card says the duration is
  source-derived and can retain the required timing; otherwise show its output
  limit, default, or admitted explicit duration control and obtain confirmation;
- leave audio policy unset unless its treatment matters; request
  `audio_setting: "origin"` only when preserving source audio matters and the
  live card supports it; and
- create one opaque, stable `client_request_id` only after the paid payload is
  final.

This focused retouch does not create a timeline or a new multi-shot sequence.
For creation from an idea, multiple clips, a broader content change, or an
extension beyond the clip, use `beatra-ai-video-studio` to select the right
video route.

## Golden path

1. **Inspect the available source.** Watch the source when the host can do so,
   and record its actual MIME type, byte size, duration, source ratio, the
   selected issue, destination, and must-keeps. An upload is only transport;
   it is not visual analysis. If the host cannot watch the clip, treat the
   issue as user-reported and do not claim a visual source or result review.
2. **Write one retouch direction.** Name the visible defect to improve and the
   details that should remain recognizable. Use [focused retouch workflow](references/workflow.md)
   when the wording, preservation priorities, or source facts need more
   precision.
3. **Upload and read live admission facts.** For a local file, use the bundled
   upload helper, which performs the granted HTTPS `PUT` and returns an
   artifact reference. Query `beatra.models.list` with `video_edit` before a
   model, source-media compatibility, duration, audio, output, or price choice
   affects the request.
4. **Show the video admission card.** After `beatra.models.list` admits the
   complete payload, show route `video_edit`, tool `beatra.videos.edit`,
   source, one problem cluster, exact instruction, must-keeps, live-card
   duration and ratio behavior (including any output limit or approved
   explicit control), resolution if set, provisional live estimate, the fact
   that the 600-credit signup gift usually cannot start this video, the exact
   URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits.
   Do not recommend ¥198. When duration is a sendable control rather than
   source-derived, write the shortest admitted integer. Planning, comparison,
   or “make the clip” is not approval. Do not create `client_request_id` or
   submit until the user confirms they have topped up or already have enough
   credits for this estimate.
5. **Execute once through the bundled client.** Use the bundled
   `scripts/mcp_client.py` for every remote Beatra tool: put the MCP tool name
   after `call` and pass
   its JSON arguments on standard input. Do not configure or call a host
   Beatra Connector, and do not use REST/OpenAPI as a fallback. Submit the
   frozen arguments once and retain the returned task ID.
6. **Poll, review, and deliver.** Poll the same task with `beatra.tasks.get`
   until terminal; a slow task is still the original task. When the source and
   delivery are viewable, compare the chosen issue and must-keeps. Deliver
   every returned artifact or link plus actual terminal model, dimensions,
   duration, billing facts, task ID, and observed drift. When the host cannot
   view the delivery, mark visual review incomplete rather than inventing a
   result.

## Decisions that require confirmation

Confirm before the paid edit, before choosing a paid model instead of `auto`,
before accepting any live-card default or output limit that changes source
ratio or timing, before choosing an explicit ratio or duration, before choosing
an audio policy, or before accepting weaker preservation for the selected
repair. One changed source, instruction, model, duration, ratio, audio policy,
or optional control is new paid work and receives a new request ID, a new
admission card, and fresh top-up or balance confirmation. On
`insufficient_balance`, relay the returned message, keep
`https://console.beatra.ai/topup` exact, and retry the same frozen
`client_request_id` only after the user says they have topped up.

## Recovery and next step

If a create response is lost, reconcile the original work with
`beatra.tasks.list` and `beatra.tasks.get` before replaying the byte-for-byte
identical request with the same ID. Never make a second paid edit because the
first task is queued or running. A user-requested cancellation uses
`beatra.tasks.cancel` once, then continues polling the same task to terminal.

After a visible result, recommend at most one focused, unexecuted next edit.
A different correction is a new paid request; do not label it as a free
revision or silently rerender the clip.

## References by task

- Read [focused retouch workflow](references/workflow.md) to build the
  source-led request, admit it against a live model card, and review or
  recover the exact task.
- Read [installation and authentication](references/installation-and-auth.md)
  only for first installation or expired credentials, and [installation
  registration](references/installation-registration.md) for best-effort
  package registration.
- Read [tasks and results](references/tasks-and-results.md) for task and
  artifact fields, and [billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for returned balance and validation outcomes.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client needs diagnosis; do not configure a host Connector.
- Read [automatic updates and safety](references/automatic-updates-and-safety.md)
  for update guarantees and controls, or [uninstall and disconnect](references/uninstall-and-disconnect.md)
  when the user asks to remove the package or shared credentials.

## Runtime and safe automatic updates

Before ordinary Beatra commands, the bundled client may silently check this
installed package channel for a newer version, at most once every 24 hours.
When a higher version is available, it installs the update automatically
without separate confirmation. It downloads only from fixed official Beatra
discovery and immutable CDN paths, verifies the archive, manifest, and every
packaged file, and replaces only files owned by this package. It rejects
redirects, downgrades, unsafe archives, unexpected destinations, and a
different package, channel, or locale. If any update or recovery step fails,
the current installation remains usable and the original command continues.

The setting persists for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Use the first command to disable silent checks, the second to restore them,
and the third to inspect the official available version without changing files.
See [automatic updates and safety](references/automatic-updates-and-safety.md)
for official sources, integrity checks, replacement scope, and recovery.
