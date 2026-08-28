---
name: "ai-video-image-music-studio"
description: "Generate AI video, images, music, and voice-over in one connected creative flow, edit visual results, and keep everything you make easy to find. This all-in-one AI media generator turns text into images, images and references into video, ideas into songs or instrumentals, and scripts into narration, and can build a custom voice when a series needs its own sound. Working as an AI video generator, AI image generator, AI music generator, and AI voice generator in one place, it covers text-to-image, text-to-video, image-to-video, AI video editing, text-to-speech, multilingual voice-over, and voice cloning for social posts, product visuals, ads, courses, podcasts, short films, and cross-media campaigns. Reuse source media and finished files across formats, follow production progress, and keep every finished piece in one place."
---

# AI Video, Image & Music Studio

Turn a media outcome into the smallest verified Beatra workflow, complete it
through the shared connection, and return only what the task actually produced.
Use the host's native text and visual understanding to analyze a brief or source
media. Use Beatra to create and manage images, video, music, speech, reusable
voices, uploads, model choices, and asynchronous task results.

Reuse the destination, prompt, source media, format, language, voice, model,
important controls, and accepted results already present in the conversation.
Infer ordinary creative details when they do not change the paid payload. Ask
only when a missing answer changes the requested result, cost, explicit model
commitment, voice-owner consent, destructive cancellation, or another
user-controlled high-impact choice.

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
connection; changing between image, video, music, and speech does not need
another media-specific grant. After installing or replacing the package, start
a new agent session when the host discovers Skills only at session startup.
See [installation and authentication](references/installation-and-auth.md) for
connection recovery and
[installation registration](references/installation-registration.md) for the
automatic non-billable registration behavior.

## Choose the smallest creation path

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
  `beatra.images.generate` keyframe, each with its own card. That gift-sized
  first win does not authorize any later video call. Before
  `beatra.videos.generate`, `beatra.videos.animate`,
  `beatra.videos.interpolate`, `beatra.videos.generate_from_references`,
  `beatra.videos.edit`, or `beatra.videos.extend`, call `beatra.models.list`,
  admit the complete payload, write the shortest admitted duration (audio-led
  and extend rules unchanged), and show the video admission card. Choose with
  [videos](references/videos.md), then load
  [video controls](references/video-controls.md) or
  [video recipes](references/video-recipes.md) only when needed.
- For a song, instrumental, or reference-guided track, use
  `beatra.music.generate`. Follow [music](references/music.md).
- For narration, browse only when a voice is still needed with
  `beatra.voices.list`, then use `beatra.speech.synthesize`. Create a reusable
  voice with `beatra.voices.clone` only after explicit voice-owner consent.
  Follow [speech and voices](references/speech-and-voices.md).
- When model selection, compatibility, supported controls, or an estimate
  matters, use `beatra.models.list` and treat its returned interface card as
  current truth. Follow [models](references/models.md). Do not maintain model,
  price, language, default, or reference-limit lists from memory.
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
discovery, recent-task listing, credit-balance and ledger reads, and estimates
are non-billable. Image, video,
music, speech, voice-clone, and video-prompt-enhancement creation consumes
credits and returns an asynchronous task. Video-prompt enhancement is the
postpaid exception: it returns text only, never starts video generation, and a
successful task settles from actual tokens after completion.

A direct, well-specified request to create authorizes that exact paid request
once for image, music, speech, or a gift-sized video-prompt or keyframe stage.
It does not authorize `beatra.videos.generate`, `beatra.videos.animate`,
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
topped up or already have enough credits for this estimate. Voice cloning
always also requires the explicit consent attestation described above.

Create one stable 1..128-character `client_request_id` only after the validated
generation payload is final and, for a video or clone stage, after that
admission confirmation. It names one logical paid operation. Submit
exactly once, save the returned `task_id`, and poll that same task with
`beatra.tasks.get`. An identical retry keeps the same request ID and the exact
validated generation payload; the ID itself and transport attribution are not
part of the payload identity. Any accepted generation-argument change is new
paid work with a new ID and, for a video or clone stage, a new admission card.

Honor a returned `deadline_at`. Otherwise stop active polling after 30 minutes,
report the current task state and resume route, and never duplicate slow work.
Cancel with `beatra.tasks.cancel` only when requested. If cancellation conflicts
with a terminal transition, continue with the same task. Follow
[tasks and results](references/tasks-and-results.md) and
[billing, errors, and recovery](references/billing-errors-and-recovery.md).

## Recover without duplicating work

If a task ID is lost, use `beatra.tasks.list` with a plausible capability, then
call `beatra.tasks.get` for every plausible candidate. List items omit the full
input, so compare each detailed `task.input`, resolved model, media, and options
with the saved payload before deciding that it is the same work. Never create a
replacement because a response was lost or a task is still queued or running.

On `insufficient_balance`, relay the returned public message, keep
`https://console.beatra.ai/wallet?intent=buy` exact, translate the rest, and retry the same
frozen `client_request_id` only after the user says they have topped up. State
that nothing was charged only when the error says so. Do not invent a top-up
operation or an account mutation. Use the `topup_url` from `beatra.wallet.get`
or the URL inside the 402 message. Connection revocation belongs in the
Beatra Console.

## Deliver returned truth

On completion, report the `task_id`, terminal status, resolved model, every
returned result, and actual usage. For artifacts, include every returned link or
ID plus dimensions, duration, MIME type or format, and size when present.
Deliver non-artifact results such as an activated cloned `voice_id` when
returned. Report `billing.net_charged_credits`; include gross charge and refund
only when present. Use the exact returned `task.links.assets` destination for
asset management.

Never infer completion, file URLs, quality, usage, refunds, or credit totals.
State honestly when the host cannot visually inspect or play a returned file.
Preserve structured errors and give the smallest recovery step.

## References by task

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
