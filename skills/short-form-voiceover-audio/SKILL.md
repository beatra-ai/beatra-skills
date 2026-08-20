---
name: "short-form-voiceover-audio"
description: "Turn final short-video scripts into ready-to-edit voiceover audio for TikTok, Reels, YouTube Shorts, product reviews, hook lines, explainers, and ads. This AI voice over generator, AI voice reader, and text-to-speech voiceover workflow makes scripts speakable, helps choose a suitable voice and supported language, and tunes pacing, pauses, names, numbers, brands, and pronunciation. Review the current price estimate, create MP3 voiceover audio, compare the returned duration with the target edit, and place the narration into short-form video, captions, avatar, lip-sync, and publishing workflows."
---

# AI Voiceover for Short Videos

Turn a final short-form script into ready-to-edit narration audio. Work as a
voiceover director: preserve the intended claim and hook, make the words
speakable, freeze one viable voice and model path, and generate only the exact
read the user approves.

## Establish the smallest complete brief

Reuse everything already supplied. Obtain only missing choices that materially
change the audio:

- the final script, or permission to make a clearly shown speakable edit;
- the platform or use, audience, and tone when they guide the voice direction;
- the target BCP-47 language or dialect and important pronunciations;
- a duration target when useful, treating it as a review goal rather than a
  guarantee; and
- the output format or other delivery requirement when the default MP3 is not
  suitable.

Platform context guides the voiceover; it is not permission to create or
publish a video. If the user wants only a material script rewrite, show the
spoken draft, obtain approval when its meaning or claims changed, and stop at
the approved script without creating paid audio. Follow [voiceover
workflow](references/workflow.md) for script preparation, timing, casting,
pricing, recovery, and handoff.

By default, prepare one logical short read and keep one synthesis `input` at or
below 50,000 characters. Split longer text only at natural sentence or section
boundaries. Do not invent extra hooks, alternate takes, or A/B variants. Each
variant the user requests is a separate paid request whose exact text and count
must appear in the production card.

## Freeze a real voice and viable model path

If no voice is frozen, call `beatra.voices.list` and offer a small set of
relevant voices with their returned previews. Treat each returned `voice_id` as
an opaque value and record its `preview_url` and `compatible_models`; never use
a display name or prose preference as synthesis `voice`.

Call `beatra.models.list` with `capability: "text_to_speech"` before deciding a
model, checking language support, or estimating cost. An explicit model must be
live, available, in the frozen voice's `compatible_models`, and support the
requested language. For `auto`, first form the complete set of live available
voice-compatible candidates. Language is validated after voice-first auto
resolution, so compare the valid BCP-47 request's primary language with every
candidate's `constraints.supported_languages`, using only documented aliases.
Keep `auto` only when every potential candidate supports the language;
otherwise present viable explicit models and ask the user to confirm one.

Unless the user or destination requires another supported setting, use
`model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`, no
emotion, and no explicit sample rate.

## Price and confirm the exact read

Planning, voice previews, script preparation, and estimates are free.
`beatra.speech.synthesize` is paid. Count the exact final text using the live
`beatra_weighted_characters` rule: each Han ideograph weighs 2 and every other
character weighs 1. Apply each applicable live card's `estimate_formula`,
`unit_price_credits`, and `scale`. If `auto` can resolve to more than one
candidate, show the full range or a clearly labeled upper bound.

Before any paid call, present one production card containing:

- exact approved script or segment and every approved variant;
- opaque `voice_id`, model or `auto` candidate range, BCP-47 language, format,
  sample rate if set, speed, volume, pitch, and emotion if set;
- weighted-character count, live formula, unit price or range, and estimated
  credits;
- exact paid-request count; and
- the requested duration target, clearly labeled as not guaranteed.

One explicit approval of that exact current card is sufficient; do not ask for
a duplicate confirmation. Any change to script, segment, variant count, voice,
model, language, format, or another control creates a new card and requires new
approval and a new request identity. Never automatically retry a paid call.

## Execute each approved request once

Use only the bundled `scripts/mcp_client.py` for Beatra operations. Pass the
tool name as the CLI argument and its JSON arguments on stdin. Do not configure
or call a host Beatra Connector and do not use REST/OpenAPI as a fallback. For
exact commands and troubleshooting, use [Bundled MCP Client diagnostics](references/mcp-connection.md).

For each newly approved execution, create a new opaque `client_request_id` and
call `python3 scripts/mcp_client.py call beatra.speech.synthesize` once with
the frozen JSON on stdin:

```json
{
  "voice": "<opaque voice_id>",
  "input": "<exact approved script or segment>",
  "client_request_id": "<new opaque id>",
  "model": "auto",
  "language": "<BCP-47 tag>",
  "format": "mp3",
  "speed": 1.0,
  "volume": 1.0,
  "pitch": 0
}
```

Record the returned `task_id` immediately and poll only that task with
`beatra.tasks.get` until it is terminal. A queued or running task is not a
reason to submit again.

## Recover without duplicating paid audio

When `task_id` is known, use `beatra.tasks.get`. If it was lost, use
`beatra.tasks.list` with `capability: "text_to_speech"`, follow `next_cursor`
through every relevant page, and inspect plausible candidates with
`beatra.tasks.get`. The remote list/get envelope does not expose the locally
stored `client_request_id`; match by capability, time window, returned input,
settings, and other returned task facts without claiming remote ID proof.

Only when transport or task creation left the original outcome genuinely
unknown may the same `client_request_id` be replayed, and then only with JSON
that is field-for-field identical. Any changed field is a new paid execution
with a new card, approval, and ID. A known task, slow polling, authorization or
update trouble, and terminal failure never authorize an automatic replacement.

Use `beatra.tasks.cancel` only when the user requests cancellation. If the
request conflicts, continue reconciling the same task and do not promise a stop
or refund.

## Deliver only returned facts

On success, return every available actual fact: `task_id`, audio URL,
`artifact_id`, `duration_seconds`, actual `mime_type`, actual sample rate,
`task.links.assets`, resolved model, usage, and billing. Compare returned
`duration_seconds` with any target and report drift. If the host can play the
audio, review pronunciation, pauses, clarity, energy, and format; otherwise say
it was not auditioned and ask the user to review it.

On failure or cancellation, report only returned provider-neutral `TaskError`
facts such as `code`, `message`, `retryable`, `param`, and `details`. Billing
fields may be absent or unsettled: distinguish missing values from numeric zero
and never invent a charge, refund, or net result. Any adjustment is separately
confirmed paid work.

The deliverable is audio only: not video creation, captions, avatars, lip-sync,
or publishing. Do not promise exact duration. For a complete video, preserve
the platform, duration, and script requirements and offer this voiceover as the
audio subtask or route to an appropriate video workflow. For a custom cloned
voice, preserve the sample and consent requirements and route to the voice
cloning workflow.

## Installation, updates, and account operations

For first use and shared operations, follow [installation and
authentication](references/installation-and-auth.md), [installation
registration](references/installation-registration.md), [tasks and
results](references/tasks-and-results.md), [billing, errors, and
recovery](references/billing-errors-and-recovery.md), and [uninstall and
disconnect](references/uninstall-and-disconnect.md).

Automatic updates are enabled by default. The bundled client performs a silent
check at most once every 24 hours while a public command runs. When a newer
package exists, it installs automatically without separate confirmation. It
uses only the fixed official discovery source and immutable CDN embedded for
this installation. Before replacement it verifies the discovery document,
manifest, archive, and every packaged file by identity, size, and SHA-256. It
replaces only package-owned files in this Skill directory and rejects unsafe
redirects, downgrades, or content for a different channel or locale. If any
check, download, replacement, or rollback fails, the update fails open: the
current installation remains usable and the current command continues.

The user's update choice persists across later commands until changed:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
for the fixed sources, integrity checks, replacement boundary, fail-open
behavior, and persistent controls.
