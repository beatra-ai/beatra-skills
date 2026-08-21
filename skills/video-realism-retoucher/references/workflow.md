# Focused video realism retouch workflow

This workflow turns one existing short AI video and one selected visible issue
into one source-led `beatra.videos.edit` request. It is a precision finishing
pass: select a lighting, material, saturation, or repeated-detail issue rather
than combining a broad list of visual changes.

Use the bundled client for every remote operation. The MCP tool name is the
argument after `call`; its JSON object is sent on standard input. Do not
configure a host Beatra Connector or use REST/OpenAPI as a fallback.

```text
printf '%s' '{"capability":"video_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For a local source, use the bundled helper. It requests the upload grant,
performs the returned HTTPS `PUT`, and prints the artifact reference that the
video request needs:

```text
python3 scripts/mcp_client.py upload ./approved-source.mp4 --mime-type video/mp4
```

Do not pass a local file path to a remote tool. Uploading bytes does not
inspect frames, diagnose a source, or prove that the uploaded file is the
intended clip.

## 1. Establish one reviewable retouch brief

Use the supplied context before asking for anything else:

```text
source clip: accessible and viewable / accessible but not viewable
visible issue or user-reported issue: one of light, material texture, saturation, repeated detail
source facts: MIME type, byte size, duration, and source ratio when available
must keep: subject, product, framing, camera movement, timing, mood, and named brand details
destination: ad, product clip, social video, or other stated use
audio intent: leave alone / preserve source audio when supported
```

When the host can view the source, describe the selected issue as a concrete
observation: for example, a cool edge light conflicts with the warm scene, a
product surface appears overly glossy and plastic, reds overpower skin tone,
or a background motif visibly repeats. Keep the remaining observations in the
brief as must-keeps.

When the host cannot view the source, retain only the user's reported issue
and stated must-keeps. The task can still be prepared from an admitted source,
but neither source diagnosis nor result quality is visually verified by the
host. Do not infer a full-clip review from media metadata, an uploaded file,
a task state, or a poster frame.

If the request needs a fresh scene, an extension, several clips, shot
assembly, or a broader creative rewrite, route it to `beatra-ai-video-studio`.

## 2. Construct one source-led instruction

Write the instruction in two parts:

1. the single appearance correction; and
2. the named details to retain.

For example:

```text
Correct the over-magenta highlights and overly glossy plastic texture on the
product bottle. Keep the product shape, label, framing, camera movement, clip
timing, background structure, and warm evening mood recognizable.
```

Use a new source or a new paid stage for a different problem cluster. This
workflow has no frame-level mask, local-video selection, automatic
super-resolution, stabilization, captioning, or timeline assembly control.
Do not imply a correction will exactly reconstruct every frame or erase every
sign of generation; preserve the user's named details and report visible drift
after delivery instead.

## 3. Admit the complete request against a live card

Before a model choice, compatibility conclusion, duration decision, audio
choice, output setting, or provisional price is presented, call
`beatra.models.list` with `{"capability":"video_edit"}`. Treat the returned
card as the current source of truth. Check the complete prospective request
against an eligible card's:

- source-video MIME type, byte size, duration, and any source media limits;
- admitted input combination for `source_video` plus `instruction`;
- source-led duration behavior and whether an explicit duration is supported;
- source-derived ratio behavior and whether an explicit aspect ratio is
  admitted;
- supported resolution and optional controls;
- `audio_setting` support, including whether `origin` is currently accepted;
- price meter, unit, and billable source or output-video quantity; and
- selected explicit model, or the eligible live candidates for `model: "auto"`.

Keep `model: "auto"` when a named model is unnecessary. A named model must be
admitted exactly as requested; report an incompatibility rather than silently
substituting another one. Do not preserve a remembered price, limit, default,
or audio behavior in the prompt.

Omit `aspect_ratio` only when the frozen live card explicitly makes the output
source-derived. Omit `duration` only when that same frozen card explicitly
makes duration source-derived and its admitted input/output limits retain the
timing the user needs. When either behavior is not confirmed, show the live
default, output limit, or admitted explicit control in the confirmation card.
Lock a compatible explicit model when keeping source ratio or timing matters;
do not assume a dynamic `model: "auto"` selection will preserve either. Omit
`audio_setting` unless audio handling changes the user's result. When preserving
source audio matters, add `"audio_setting":"origin"` only after the selected
live card admits it.

If no current card accepts the actual source and frozen request, pause before
the paid call and request the smallest compatible source or setting change.

## 4. Confirm and submit one edit

Show one prepaid admission card before any `client_request_id` or
`beatra.videos.edit` call:

| Item | Frozen value |
| --- | --- |
| Route and tool | `video_edit` / `beatra.videos.edit` |
| Source | The exact source clip and known media facts |
| Selected correction | One light, material, saturation, or repeated-detail issue |
| Must-keeps | Named subject, framing, movement, timing, mood, and brand details |
| Output handling | Live-card ratio and duration behavior, including any approved default, output limit, or explicit control; audio policy if admitted. When duration is sendable rather than source-derived, write the shortest admitted integer. |
| Model and cost | Frozen compatible live model, or an auto-eligible set whose ratio and duration behavior the user accepted, plus the current provisional estimate |
| Gift fact | The 600-credit signup gift usually cannot start this video |
| Top-up | Exact URL `https://console.beatra.ai/topup`; starter ¥29 / 11,000 credits. Do not recommend ¥198. |
| Paid stage | One `beatra.videos.edit` request and one output task |

Planning, comparison, or “make the clip” is not approval. Create a stable
opaque `client_request_id` only after the user confirms they have topped up or
already have enough credits for this estimate. Submit exactly once through the
bundled client:

```text
printf '%s' '{"source_video":{"type":"artifact","artifact_id":"art_source_clip"},"instruction":"Correct the over-magenta highlights and overly glossy plastic texture on the product bottle. Keep the product shape, label, framing, camera movement, clip timing, background structure, and warm evening mood recognizable.","model":"auto","client_request_id":"opaque-video-retouch-id"}' | python3 scripts/mcp_client.py call beatra.videos.edit
```

The example omits `duration`, `aspect_ratio`, `audio_setting`, and `references`
only because its frozen live card admits source-derived ratio and timing. When
the selected card instead has a default, output limit, or explicit control,
show that behavior before confirmation and include an explicit ratio or
duration only when the user approves it. A source, instruction, model,
duration, ratio, audio choice, or control change is new work with a new ID, a
new admission card, and fresh top-up or balance confirmation.

## 5. Poll, review, and deliver

Save the returned task ID immediately and poll that same task until it is
terminal:

```text
printf '%s' '{"task_id":"task_video"}' | python3 scripts/mcp_client.py call beatra.tasks.get
```

Queued and running mean the original paid work remains active. On success,
deliver every returned artifact or link and only terminal facts returned by the
task: resolved model, dimensions, duration, usage, and
`billing.net_charged_credits`.

When the host can watch the source and returned clip, compare the selected
issue against the brief and check:

- light direction, contact shadows, highlights, and color balance;
- material surface coherence and repeated-detail treatment;
- subject or product recognizability, named labels or brand details, and
  framing;
- camera movement, timing, source-led ratio, and destination fit; and
- source audio only when it can be heard and its handling was part of the
  approved request.

Describe observed improvement and drift precisely. When a source or result is
not viewable, deliver the returned task and artifact facts but mark visual
review incomplete. A successful task does not establish that the video is
ready for a particular campaign or that every frame meets the user's goal.

## 6. Recover without duplicate paid work

Keep a private record of the approved payload, `client_request_id`, create
response, and task ID.

| Situation | Action |
| --- | --- |
| Create response lost | Use `beatra.tasks.list` for `video_edit`, inspect likely items with `beatra.tasks.get`, and match the frozen private record before an identical same-ID replay. |
| Task ID lost | List recent `video_edit` tasks, match the source and request record, then inspect the selected task. |
| Task queued or running | Continue polling the original task; do not submit another retouch. |
| Upload grant expired or MIME/length mismatch | Use the bundled upload helper for a fresh grant, then retain the otherwise frozen route. |
| Model validation error | Refresh the `video_edit` card before proposing a changed setting. |
| Insufficient balance | Relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. |
| User asks to cancel | Call `beatra.tasks.cancel` once and keep polling the original task; a `409` does not confirm cancellation. |

Leave any different visual correction unexecuted until it receives its own
live admission, confirmation, and request ID. Keep one video generation task
in flight for this focused workflow, below the connection-wide limit of two.
