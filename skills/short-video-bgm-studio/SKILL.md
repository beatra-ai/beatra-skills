---
name: "short-video-bgm-studio"
description: "Describe the footage and get an original instrumental track written for it, yours to keep and use commercially. This AI background music generator turns a scene, mood, and tempo feel into royalty-free BGM for short videos, vlogs, product clips, tutorials, livestream and store loops, podcast intros, and slideshow recaps, with an energy arc you choose — a calm or immediate opening, a lift at the moment that matters, a clean ending — room left for narration, and a result you can listen to before you publish."
---

# Short Video BGM Studio

Turn a description of the footage into an original instrumental track built for
it: read the scene, shape an energy curve that fits how the piece moves, and
return a result the user can hear before publishing.

## Scope and routing

Use this Skill when a video, livestream, podcast, store, or brand moment needs
background music and no vocal is wanted. It fits short-video posts, vlogs,
product and unboxing clips, tutorial and course footage, livestream and store
loops, podcast intros and outros, and slideshow or event recaps.

Route a song with sung lyrics to `beatra-ai-music-creator`. Route finished
lyrics that need a melody to `suno-lyrics-to-song`, a gift or occasion song to
`personalized-song-maker`, and a cover or re-arrangement of an existing song to
`ai-song-cover-studio`. Route a music video built around a finished track to
`ai-music-video-clip-maker`, and spoken narration to
`short-form-voiceover-audio`.

## Inputs and defaults

The one hard input is what the music is for: the scene, product, or mood it has
to sit under. Reuse the platform, footage description, brand tone, target
length, and any reference track already present in the conversation.

Ask only when the answer changes the paid result: the intended use, when the
request is just "make music" with no scene attached.

Defaults that avoid extra questions:

- `instrumental: true` with no lyrics, because this route is background music.
- A calm-to-lift energy arc with a clean resolved ending, which suits a cut that
  has to end cleanly.
- `model: "suno-5.5"` for ordinary generation. Never omit the model and never
  silently use `auto`; pass a different model only when the user names one.
- Room left for a voice, since most short-video BGM sits under narration.

## Golden path

Briefing and planning are free. Only the generation call is paid.

1. Write a short music card from the footage: use and destination, mood, genre,
   tempo feel, instrumentation, the energy arc across the cut, the intended
   length, whether narration sits on top, and anything to avoid.
2. Turn the card into one positive prompt that carries genre, mood, tempo feel,
   instrumentation, structure, and intended use in a single coherent direction.
3. Call `beatra.models.list` for the text-to-music capability, or the
   reference-audio-to-music capability when the user supplied a reference
   recording, whenever compatibility, controls, or price matter. Read the live
   card rather than assuming a model, a control, or an input limit.
4. **Confirm before paid work.** Show the frozen prompt, `instrumental: true`,
   the title, the model, any accepted model options, the current maximum charge,
   and one opaque stable `client_request_id`.
5. Submit `beatra.music.generate` exactly once, record the task ID immediately,
   and poll that same task.
6. Deliver every returned clip in order with its real duration, MIME type, size,
   and URL or artifact ID, plus the returned title when present, the resolved
   model, the actual usage, and `billing.net_charged_credits`.
7. Review the result against the music card. Read the actual returned duration
   rather than the requested one, and say plainly what the host Agent could not
   hear.

Treat requested length, a loop-friendly arrangement, and space for narration as
arrangement direction in the prompt. Read
[the BGM workflow](references/workflow.md) for the music card, prompt shape,
payloads, model options, reference-guided tracks, recovery, and delivery review.

## How this Skill executes

Use the bundled `scripts/mcp_client.py` for every remote Beatra operation: the
MCP tool name is the CLI argument after `call`, and one JSON object goes on
standard input. Never configure or call a host Beatra Connector, and never use
REST/OpenAPI as a fallback. Register the package with
`beatra.installations.register` on first use. Every creation is an asynchronous
task: submit once, then follow that task to a terminal state.

## Decisions that require confirmation

Confirm before submitting: the frozen prompt, the instrumental setting, the
title, the model and any model options, and the current maximum charge. A
changed prompt, title, model, option, reference track, or instrumental setting
is new paid work with a new request ID.

When the user supplies a reference recording, upload it once through the bundled
client, state what should carry over and what should change, and keep that as
musical direction rather than a promise about melody or arrangement.

## Recovery

Save the task ID the moment it returns and poll with `beatra.tasks.get`;
`queued` and `running` mean wait. Replay a create only when its response is
genuinely unknown and every validated argument is byte-equivalent under the same
request ID. If the task ID is lost, use `beatra.tasks.list`, confirm candidates
with `beatra.tasks.get`, and recover the original before considering new work.
If the request ID itself is lost, do not invent a new one and do not replay.
Call `beatra.tasks.cancel` only at the user's request; on `409`, keep polling the
original task and report cancellation only when its terminal status is
`canceled`.

## References by task

- [BGM workflow](references/workflow.md): music card, prompt construction,
  payloads, model options, reference-guided tracks, recovery, and delivery
  review.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use and shared credentials.
- [Tasks and results](references/tasks-and-results.md) and
  [billing, errors, and recovery](references/billing-errors-and-recovery.md):
  task, artifact, and billing facts.
- [Bundled MCP Client diagnostics](references/mcp-connection.md): client
  operation and connection diagnostics; do not configure a host Connector.
- [automatic updates and safety](references/automatic-updates-and-safety.md):
  update behaviour and controls.
- [uninstall and disconnect](references/uninstall-and-disconnect.md): package
  removal and shared credential cleanup.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses only fixed official Beatra discovery and immutable CDN
paths for this package, channel, and locale, verifies discovery, archive,
manifest, and every packaged file before replacement, and replaces only
package-owned files. Update checks, downloads, verification, replacement, and
recovery fail open: the current installation remains usable and the original
command continues. An update failure never authorizes retrying a paid
generation. The choice persists across later commands.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check`
reports the official available version without replacing files. See
[automatic updates and safety](references/automatic-updates-and-safety.md).
