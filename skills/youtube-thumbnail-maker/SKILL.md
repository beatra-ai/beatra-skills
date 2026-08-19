---
name: "youtube-thumbnail-maker"
description: "Create YouTube thumbnails from a video topic, title, script, key frame, portrait, product photo, or channel reference. This AI thumbnail maker compares three directions in text first, then renders the one you pick as a 16:9 image with clear visual hooks, readable hierarchy, and a headline-safe composition for explainers, reviews, tutorials, vlogs, games, podcasts, and long-form creative videos. It pairs the image with title-matching advice and refines an accepted direction into a consistent channel look. Rendering requires a Beatra account at beatra.ai."
---

# YouTube Thumbnail Maker

Turn a video topic, title, key frame, portrait, product photo, or channel
reference into a YouTube thumbnail with one clear hero subject, readable
hierarchy, and space left for a headline. Pair the image with title-matching
advice and a rule that keeps the next thumbnail recognizably from the same
channel.

Rendering runs on Beatra, so this Skill needs a Beatra account at beatra.ai with
credits on it. Any step that reaches Beatra needs the installation connected
first: an unconnected one stops and names `scripts/authorize.py`, and running
that opens a Beatra approval page in the browser where the user signs in or
creates the account. An installation already connected to Beatra skips that.
Only rendering is charged, and the current price and the maximum charge from the
live model card are shown for approval before the call. A settled task is billed
on measured usage, so treat that figure as the approval basis rather than a
guaranteed final amount.

## Scope and routing

Use this Skill for long-form YouTube thumbnails: candidate directions,
title-and-thumbnail matching, and channel visual direction across a back
catalog.

Other Beatra Skills own the neighboring jobs. When one is installed, route a
Bilibili cover to `bilibili-thumbnail-maker`, a diagnosis of a cover the user
already has to `cover-performance-preflight`, general campaign artwork to
`poster-design-studio`, a Xiaohongshu cover to `rednote-cover-maker`, and a
vertical short-video cover to `douyin-cover-maker`. When none of them is
installed, say the job is outside this Skill rather than making the cover here.

Title claims, names, numbers, credentials, and channel facts come only from the
user. A supplied frame guides what is visible in it; it is not evidence for a
fact the user has not stated.

## Inputs and defaults

Reuse the topic, working title, script or outline, audience, channel style,
source images, must-keep subject, and destination canvas already in the
conversation. Ask only when the missing answer changes the image: the core
promise, the hero subject, the title wording, or the channel direction.

When the user has a video rather than an image, ask for an exported key frame or
screenshot. A frame has to be supplied as a file; it is not pulled from a video.

Default to three thumbnail directions described in text, one recommendation,
title-matching notes, a safe text hierarchy, and a channel consistency note.
Rendering is what costs money, so describe the directions first and render only
the one the user picks.

- `beatra.images.transform` for a supplied frame, portrait, or product photo,
  with that image at `images[0]`.
- `beatra.images.generate` for a concept with no supplied image.
- `beatra.images.edit` for a focused correction to an accepted thumbnail.
- `2K` / `16:9` canvas, `model: "auto"`, and `count: 1` unless the user asks
  otherwise.
- Faces, products, logos, and factual title claims supplied by the user are
  must-keeps.

## Golden path

1. Build the brief: title, promise, audience, hero subject, source images,
   channel style, destination canvas, must-keeps, and words to avoid.
2. Describe three distinct directions — focal subject, contrast, text area,
   title relationship, background treatment — and recommend one.
3. Read the live card for the selected capability, then show one confirmation
   with the source and reference order, the full prompt, the must-keeps, the
   resolved canvas, model behavior, controls, `count`, the current maximum
   charge, and the total call count.
4. After approval, create one stable opaque `client_request_id`, submit exactly
   once through the bundled client, and keep the returned task ID.
5. Poll the original task, review accessible results against the brief, and
   deliver the image with its returned facts, the title-matching note, and a
   repeatable channel rule.

Read [the thumbnail workflow](references/workflow.md) for the brief card, exact
payloads, canvas handling, confirmation, task recovery, and image review.

## Paid-work confirmation

Planning, comparing directions, and drafting the prompt are free. Before
rendering or revising, obtain one clear confirmation of the frozen brief, the
paid image request, the source and reference order, the canvas, the model, the
controls, `count`, the current price, the maximum charge, and the total call
count.

When the user asks for text inside the image, freeze the exact wording and its
placement in that confirmation, and say in the same confirmation that the model
may not render the wording exactly and that a misrendered result is a new paid
call, not a fixable one. Offer a clear text-safe area as the alternative, which
lets the user set the headline in an editor afterwards. Keep the title available
separately either way, so the user can still change it after seeing the result.

Every changed source, reference order, prompt, canvas, model, count, control, or
embedded text is new paid work with a new confirmation and a new
`client_request_id`.

## Execute and deliver

Use only this package's bundled `scripts/mcp_client.py` for remote operations.
Send one JSON object on standard input after `call <tool-name>`. Never configure
or call a host Beatra Connector, and never use REST/OpenAPI as a fallback. Read
[Bundled MCP Client diagnostics](references/mcp-connection.md) for commands and
connection troubleshooting.

The bundled client registers the installation itself on first use through
`beatra.installations.register`; there is no register subcommand to invoke. A
returned `task_id` belongs to the approved work: poll only with
`beatra.tasks.get`. Replay only a genuinely unknown create response, with the
byte-equivalent frozen payload and the same ID; a terminal `failed` is a known
response and needs new approval instead. If the task ID is missing, use
`beatra.tasks.list` scoped to the original capability and follow each
`next_cursor` across the creation window, then confirm the candidate with
`beatra.tasks.get`. Call `beatra.tasks.cancel` only at the user's request; on a
`409`, keep polling the original and report cancellation only at terminal
`status: "canceled"`.

Review only images the host can access, and say which checks the host could not
make. Deliver completed-task facts only: artifact links, returned dimensions,
format, resolved model, task IDs, and `billing.net_charged_credits`. Describe
what the thumbnail does rather than predicting how it will perform.

## References by task

- [Thumbnail workflow](references/workflow.md): brief card, payloads, canvas,
  confirmation, recovery, and review.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use and credentials.
- [Tasks and results](references/tasks-and-results.md) and
  [billing, errors, and recovery](references/billing-errors-and-recovery.md):
  returned task fields, balance, validation, and structured errors.
- [Bundled MCP Client diagnostics](references/mcp-connection.md) and
  [uninstall and disconnect](references/uninstall-and-disconnect.md): client
  operation and removal.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses fixed official Beatra discovery and immutable CDN paths,
verifies the discovery data, archive, manifest, and every packaged file before
replacement, and replaces only files owned by this package.

Checks, downloads, verification, replacement, and recovery fail open: the
current installation remains usable and the original command continues. Update
failure never authorizes paid work. The setting persists for this installation.
Read [automatic updates and safety](references/automatic-updates-and-safety.md)
for the official sources, integrity checks, replacement boundary, failure
behavior, and controls.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
