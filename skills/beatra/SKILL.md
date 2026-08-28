---
name: "beatra"
description: "Create AI images, videos, music, and voice, look up public social data, edit visual results, and keep generated assets easy to find and manage. Beatra Universal turns text into images, images and references into video, ideas into songs or instrumentals, and scripts into narration, while also supporting custom voice creation and public social media data lookup across YouTube, TikTok, Instagram, and X. Use it as an AI media generator and AI creative suite for text-to-image, image-to-video, AI video editing, AI music generation, text-to-speech, multilingual voice-over, voice cloning, multimodal content creation, and YouTube or TikTok data for posts, comments, accounts, and trends. Reuse source media, returned files, and public social findings across formats, follow production progress, and view actual credit use for completed creative work."
---

# Beatra Universal

Turn a requested outcome into the smallest verified Beatra workflow, complete
it through the shared connection, and return only what the task actually
produced. Use the host's native text and visual understanding to analyze a
brief, source media, or returned public social content. Use Beatra to look up
public social data and to create and manage images, video, music, speech,
reusable voices, uploads, model choices, and asynchronous task results.

Reuse the destination, prompt, source media, format, language, voice, model,
public social target, important controls, and accepted results already present
in the conversation. Infer ordinary details when they do not change the paid
payload. Ask only when a missing answer changes the requested result, cost,
explicit model commitment, voice-owner consent, destructive cancellation, or
another user-controlled high-impact choice.

## Use the bundled client only

Run every Beatra operation through this package's bundled
`scripts/mcp_client.py`. Do not configure or use a host Beatra Connector. Never
use REST/OpenAPI as a fallback. For an ordinary call, run:

```text
python3 scripts/mcp_client.py call <tool-name>
```

Provide exactly one JSON object on stdin. Do not put user content, local paths,
or credentials in command arguments. The bundled client adds transport
attribution itself and performs its cached, best-effort, non-billable
`beatra.installations.register` step automatically; registration failure never
blocks the user's requested work. Use
[Bundled MCP Client diagnostics](references/mcp-connection.md) only when this
path needs diagnosis.

## Connect once across media

When the connection is new, missing, expired, or explicitly being changed, run:

```text
python3 scripts/authorize.py
```

The browser supports sign-in or account creation and then one Allow decision.
The helper observes completion, stores the Device Token privately, verifies it
with one non-billable call, and prints Ready. Never expose the approval code or
ask the user to confirm approval in chat. Authorize once for the full Beatra
connection; changing between image, video, music, speech, and public social
lookup does not need another grant. After installing or replacing the package,
start a new agent session when the host discovers Skills only at session
startup. See [installation and authentication](references/installation-and-auth.md)
for connection recovery and
[installation registration](references/installation-registration.md) for the
automatic non-billable registration behavior.

## Choose the smallest path

- For public posts, notes, videos, accounts, comments, or trends, use
  `beatra.social.tools.search`, then `beatra.social.tools.get`, then one
  `beatra.social.execute` with `operation_key`, the `schema_hash` just copied
  from that `tools.get`, `arguments`, and one `client_request_id`. Follow
  [public social data](references/social.md). If those tools are not exposed,
  say they are not available on this connection. Do not invent an
  `operation_key`, call `beatra.models.list` for social lookup, or turn a
  lookup into generation. Continue only with media the user already asked for.
- For a new image, guided composition, or base-preserving edit, use
  `beatra.images.generate`, `beatra.images.transform`, or
  `beatra.images.edit`. Follow [images](references/images.md).
- For video-prompt enhancement, text-to-video, opening-image animation, ordered
  references, a required last frame with an optional first frame, source editing,
  or extension, use `beatra.videos.enhance_prompt`,
  `beatra.videos.generate`, `beatra.videos.animate`,
  `beatra.videos.generate_from_references`,
  `beatra.videos.interpolate`, `beatra.videos.edit`, or
  `beatra.videos.extend`. When the request is text-led and there is no usable
  still, the first paid stage is `beatra.videos.enhance_prompt` or one
  `beatra.images.generate` keyframe. That gift does not authorize a later video
  call. Before generate, animate, interpolate, reference, edit, or extend, call
  `beatra.models.list` with that route's exact capability (for example
  `{"capability":"text_to_video"}` or `{"capability":"image_to_video"}`), admit
  the payload, write the shortest admitted duration (audio-led and extend rules
  unchanged), and show the video admission card.
  Choose with [videos](references/videos.md), then load
  [video controls](references/video-controls.md) or
  [video recipes](references/video-recipes.md) only when needed.
- For a talking presenter, spoken delivery, or digital-human clip, synthesize the
  narration first with `beatra.speech.synthesize`, then animate a portrait with
  `beatra.videos.animate`, passing that narration as `driving_audio`. The video
  card's admitted formats and durations both constrain what you synthesize, so
  read `{"capability":"image_to_video"}` before the speech call.
  Follow [video recipes](references/video-recipes.md).
- For a song, instrumental, or reference-guided track, use
  `beatra.music.generate`. Follow [music](references/music.md).
- For narration, browse only when a voice is still needed with
  `beatra.voices.list`, then use `beatra.speech.synthesize`. Create a reusable
  voice with `beatra.voices.clone` only after explicit voice-owner consent and
  the clone admission card. Follow
  [speech and voices](references/speech-and-voices.md).
- When model selection, compatibility, supported controls, or an estimate
  matters for image, video, music, or speech, copy an exact
  `{"capability":"..."}` payload from [models](references/models.md) and treat
  the returned interface card as current truth. Do not maintain model, price,
  language, default, or reference-limit lists from memory.
- When the user asks how many credits remain or whether a live estimate fits,
  call `beatra.wallet.get`. When they ask what was charged, call
  `beatra.wallet.ledger`. Both are read-only.

Do not silently turn the request into another operation. Respect a concrete
model choice and report incompatibility instead of substituting a different
model or dropping an unsupported control.

## Upload local media safely

When an input exists only as a local image, video, or audio file, use only:

```text
python3 scripts/mcp_client.py upload <path> --mime-type <type>
```

The command validates the `beatra.assets.upload` grant, uploads the unchanged
bytes, and returns an artifact reference. Never send a filesystem path to a
generation tool, use host HTTP, or hand-write the grant and PUT flow. Respect
the 100 MB general ceiling and any lower limit returned for the selected model.
Ordinary media upload has no generic rights-attestation step. A sample for
`beatra.voices.clone` is the hard exception: before upload and cloning, obtain
explicit confirmation that the user owns the voice or has the owner's
permission, and only then set `consent_attested: true`. See
[uploads](references/uploads.md).

## Keep the paid boundary clear

Creative planning, authorization, upload preparation, voice browsing, model
discovery, public social tool search and inspection, recent-task listing,
credit-balance and ledger reads, and estimates are non-billable. Image, video, music, speech, voice-clone,
video-prompt-enhancement, and public social execute consume credits and return
an asynchronous task. Public social execute is prepaid. Video-prompt
enhancement is the postpaid exception: it
returns text only, never starts video generation, and a successful task
settles from actual tokens after completion.

A direct, well-specified request to create or look up authorizes that exact
paid request once for image, music, speech, social execute, or a gift-sized
video-prompt or keyframe stage. It does not authorize
`beatra.videos.generate`, `beatra.videos.animate`,
`beatra.videos.interpolate`, `beatra.videos.generate_from_references`,
`beatra.videos.edit`, `beatra.videos.extend`, or `beatra.voices.clone`. Before
those video or clone calls, show the admission card: route and MCP tool name,
live-card duration, resolution, and aspect (shortest admitted duration and
lowest admitted resolution unless the user named a higher tier; audio-led and
extend rules unchanged), provisional live estimate, the fact that the
600-credit signup gift usually cannot start this video or clone, the exact URL
`https://console.beatra.ai/wallet?intent=buy`, and starter ¥29 / 11,000 credits. Do not
recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do
not create `client_request_id` or submit until the user confirms they have
topped up or already have enough credits for this estimate. For public social
lookup, copy the `schema_hash` from `beatra.social.tools.get` into execute with
`operation_key`, `arguments`, and one `client_request_id`. Show the
`operation_key` and the credit price returned by `tools.get`. Do not show
`schema_hash` to the user and do not ask for a model. Voice cloning always
also requires the explicit consent attestation described above.

Create one stable 1..128-character `client_request_id` only after the validated
paid payload is final. It names one logical paid operation. Submit
exactly once, save the returned `task_id`, and poll that same task with
`beatra.tasks.get`. Never poll a row whose submission returned no `task_id`;
reconcile with `beatra.tasks.list` instead. An identical retry keeps the same request ID and the exact
validated paid payload; the ID itself and transport attribution are not
part of the payload identity. Any accepted paid-argument change is new
paid work with a new ID and confirmation.

Honor a returned `deadline_at`. Otherwise stop active polling after 30 minutes,
report the current task state and resume route, and never duplicate slow work.
Cancel with `beatra.tasks.cancel` only when requested. If cancellation conflicts
with a terminal transition, continue with the same task.

Public social validation or a failed lookup is not a `beatra.models.list`
event. Keep `error.code`, read `error.message` or `error.data.message`, and
do not change a model. Follow [tasks and results](references/tasks-and-results.md)
for task identity and polling. For media generation validation or model
incompatibility only, follow
[billing, errors, and recovery](references/billing-errors-and-recovery.md).

## Recover without duplicating work

If a task ID is lost, use `beatra.tasks.list` with a plausible capability, then
call `beatra.tasks.get` for every plausible candidate. List items omit the full
input, so compare each detailed `task.input` with the saved payload before
deciding that it is the same work. For media generation, also compare resolved
model, media, and options. For public social lookup, compare `operation_key`,
arguments, and `schema_hash`. Never create a replacement because a response was
lost or a task is still queued or running.

On `insufficient_balance`, relay the returned public message, keep
`https://console.beatra.ai/wallet?intent=buy` exact, translate the rest, and retry the same
frozen `client_request_id` only after the user says they have topped up. State
that nothing was charged only when the error says so. Do not invent a top-up
operation or an account mutation. Use the `topup_url` from `beatra.wallet.get`
or the URL inside the 402 message. Connection revocation belongs in the
Beatra Console.

On a failed public social lookup, keep `error.code` and read the platform
wording in `error.message` or `error.data.message`. Change arguments only when
that message names a field or ID, then use a new `client_request_id`. Otherwise
keep the same ID and the same payload. Do not suggest changing a model.

## Deliver returned truth

On completion, report the `task_id`, terminal status, every returned result,
and actual usage. For media generation, also report the resolved model. For
artifacts, include every returned link or ID plus dimensions, duration, MIME
type or format, and size when present. For public social lookup, deliver the
inline JSON or JSON artifact; do not look for a resolved model or a generated
media file. Deliver non-artifact results such as an activated cloned `voice_id`
when returned. Report `billing.net_charged_credits`; include gross charge and
refund only when present. Use the exact returned `task.links.assets`
destination for asset management.

Never infer completion, file URLs, quality, usage, refunds, or credit totals.
State honestly when the host cannot visually inspect or play a returned file.
Preserve structured errors and give the smallest recovery step.

## References by task

- Public social posts, accounts, comments, and trends: [public social data](references/social.md)
- Image generation, transformation, and editing: [images](references/images.md)
- Video route selection, controls, and request patterns: [videos](references/videos.md), [video controls](references/video-controls.md), and [video recipes](references/video-recipes.md)
- Songs, instrumentals, references, and music delivery: [music](references/music.md)
- Narration, voice discovery, and consent-gated voice cloning: [speech and voices](references/speech-and-voices.md)
- Local image, video, or audio preparation: [uploads](references/uploads.md)
- Current model compatibility, controls, and estimates: [models](references/models.md)
- First connection and automatic registration: [installation and authentication](references/installation-and-auth.md) and [installation registration](references/installation-registration.md)
- Bundled commands and connection diagnosis: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Task progress, recovery, results, balance, and errors: [tasks and results](references/tasks-and-results.md) and [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Verified automatic updates and persistent controls: [automatic updates and safety](references/automatic-updates-and-safety.md)
- Package removal and shared credential handling: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Keep updates safe and removable

Before ordinary commands, the bundled client performs a silent check at most
once every 24 hours. When a higher version is available from its fixed official
discovery address and immutable official CDN source, the client may install it
automatically without separate confirmation. It verifies the archive,
manifest, and every packaged
file, then replaces only package-owned files. If checking, downloading,
verification, replacement, rollback, or recovery fails, the current
installation remains usable and the original command continues. Update failure
never justifies a paid retry.

The per-installation choice persists:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

The first command disables silent checks, the second restores automatic
updates, and the third reports the official available version without replacing
files. Read [automatic updates and safety](references/automatic-updates-and-safety.md)
for the full verified-update contract. For removal or credential cleanup,
follow [uninstall and disconnect](references/uninstall-and-disconnect.md).
Never directly delete the shared `~/.beatra` connection state.
