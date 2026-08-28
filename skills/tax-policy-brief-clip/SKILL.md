---
name: "tax-policy-brief-clip"
description: "Turn a dated tax-policy source into a policy-points still and a speakable brief, then into one short tax policy brief clip. This tax policy brief clip studio lays out the supplied fiscal-policy points as a policy-points still and a talking tax-advisor brief. Use it for bookkeeping-firm policy briefs, tax-advisor client updates, and monthly tax-policy readout clips."
---

# Tax Policy Brief Clip

Turn a dated, sourced tax-policy text into one policy-points still and a
speakable brief, then into one short talking clip. The first delivery is
the still plus the spoken brief. The clip is a later conversion.

## Scope and adjacent routes

Use this Skill when a bookkeeping firm or tax advisor wants a short
policy brief from a public tax-policy source they already have.

Route public-policy page-by-page stills with no spoken brief to
`policy-digest-set`. Route a presenter portrait that is not a
policy-points still to `talking-avatar-video`. Route an insurance
clause read to `insurance-clause-talking`. Do not look up missing
policy text, rates, or effective dates.

## Collect the policy source

Hard inputs are:

- the tax-policy source the advisor already has (title, issuer, and
  the supplied text or excerpt);
- the policy effective date printed or cited in that source;
- the policy points that must appear on the still and in the brief;
- the language of the still and the spoken brief.

Reuse already-known destination, brand look, and a frozen `voice_id`.
Ask only for a missing hard input. Do not invent a statute number,
rate, effective date, issuer, or eligibility line to finish the
still or the brief.

If the effective date or the source is missing, stop and ask for
both. Do not mint a `client_request_id`.

Do not give a concrete tax-planning scheme. If the advisor asks for
one, refuse that scheme and keep the work on dated, sourced policy
points:

```text
筹划
```

A scan or photo is a visual reference, not a source for missing
policy text. Uploading makes media available to Beatra and does not
inspect it. When the host cannot view a file, keep the advisor's
declared role for it.

Inspect every supplied still. Record MIME type, width, height,
aspect ratio, byte size, and whether it has an alpha channel. For a
local file, upload only through the bundled client after inspection.
Never pass a local path to `beatra.images.generate`,
`beatra.speech.synthesize`, or `beatra.videos.animate`.

Default to one generated policy-points still, one speakable brief,
and later one 2–15s clip. Do not stitch clips.

## Plan the free still and brief

Write a labeled policy-points still plan and a speakable brief
before any paid image, speech, or video. Record the policy title,
effective date, source citation, the confirmed points, language,
layout (title, date and source, point list, optional footer),
canvas, and the spoken lines. Print and cite the effective date and
the source on the still and in the brief. That plan is the free
visible result. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` still, `model: "auto"`, `count: 1`,
  2K canvas at `9:16` unless the advisor names another destination
  ratio;
- one `beatra.speech.synthesize` brief with `input` (not `text`),
  `format: "mp3"`, `speed: 1.0`, and `model: "auto"` only when every
  live speech card supports the language;
- later one `beatra.videos.animate` clip, `model: "auto"` unless the
  advisor chose a live SKU that admits `[image, driving_audio]`;
- the accepted still as the strict first frame;
- source-derived aspect ratio (omit `aspect_ratio`);
- audio-led duration: the smallest supported integer in 2–15s at or
  above the actual speech length. Do not stitch.

Keep the spoken brief short enough to fit one 2–15s clip. If returned
speech is under 2s or over 15s, rewrite the brief as new speech work
with a new card and a new ID. Do not split or stitch.

If the advisor already has an inspectable still that prints the
effective date and the source, skip generate and keep the TTS slot.

## Confirm the lead still and brief

Planning is free. Before the first billable call, read the current
`beatra.models.list` cards for `text_to_image` and `text_to_speech`.
Call `beatra.voices.list` when a catalog voice still needs a choice.
Never put a display name in `voice`.

Show one current production card for the lead still and TTS slots
and wait:

1. Work — one policy-points still (`beatra.images.generate`) and one
   speakable brief (`beatra.speech.synthesize`).
2. Credits — the live `text_to_image` price plus the live
   `text_to_speech` price just read. Do not reuse a remembered
   number. If the still is already supplied, charge only the speech
   slot.
3. Count — one paid call per lead slot. Do not batch the later clip
   into this submit.
4. Identity — one new opaque `client_request_id` per slot. A changed
   prompt, fact line, file, voice, model, or canvas mints a new ID.
5. If we stop here — the labeled still plan and speakable brief
   remain usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the advisor says they have
   topped up. Do not recommend ¥198.

Submit each approved lead slot once through bundled
`scripts/mcp_client.py`. Poll `beatra.tasks.get`. Deliver actual
bytes, and for speech also MIME, duration, and size when present,
plus `billing.net_charged_credits`. A script preview is not the
audio review. Review printed lines against the confirmed points,
date, and source. Report unread small type as unread.

Lead acceptance is not video approval.

## Confirm the brief clip

After the still and the spoken brief are accepted, read the current
`beatra.models.list` card for `image_to_video`. Confirm a current
card admits `[image, driving_audio]`. Compare every image fact and
the real audio MIME, duration, and size with advertised limits.
Use the smallest supported integer duration in 2–15s at or above the
actual speech length. Omit `aspect_ratio`. Keep `model: "auto"`
unless the advisor chose an eligible card.

Show a new six-field production card and wait:

1. Work — one 2–15s tax-policy brief clip
   (`beatra.videos.animate`) with the accepted still as first frame
   and the accepted speech as `driving_audio`.
2. Credits — the live `image_to_video` price just read. Do not reuse
   a remembered number.
3. Count — one paid video call for this clip. Do not stitch.
4. Identity — one new opaque `client_request_id`. A changed still,
   audio, prompt, duration, or model mints a new ID.
5. If we stop here — the accepted still and spoken brief remain
   usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the advisor says they have
   topped up. Do not recommend ¥198.

After the advisor approves that card, submit `beatra.videos.animate`
once with `driving_audio` attached.

## Review, deliver, and recover

Review that the clip keeps the still as the first frame and that the
spoken brief stays on the dated, sourced points. Report only what
the host can actually see and hear. Do not promise perfect motion
sync. Never invent a stitch, concat, or editor tool.

After each terminal paid task, deliver actual bytes plus MIME,
duration, and size when present, and `billing.net_charged_credits`.
Do not promise the prepaid estimate is the final charge.

When relevant after delivery, tell the advisor this is not a formal
tax opinion.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed still, line, voice, or duration
is a new card and a new ID. Cancel only when the advisor asks.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

```bash
python3 scripts/mcp_client.py call beatra.voices.list
```

```json
{"category": "preset"}
```

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

```text
printf '%s' '{"prompt":"Create the approved policy-points still. Print the policy title, effective date, source, and only the confirmed policy points. Do not add a tax-planning scheme.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"9:16"},"client_request_id":"opaque-tax-still-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{"input":"Approved speakable brief with effective date and source.","voice":"voice-ready-01","format":"mp3","speed":1.0,"model":"auto","client_request_id":"opaque-tax-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"art-tax-still-01"},"driving_audio":{"type":"artifact","artifact_id":"art-tax-speech-01"},"prompt":"A restrained hold on this policy-points still. Keep printed date, source, and points in frame. Subtle motion only. Do not add a presenter face or extra text.","duration":8,"client_request_id":"opaque-tax-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For still plans, speakable briefs, payloads, and recovery, read
  [Tax policy brief workflow](references/workflow.md).
- For authorization and the non-billable registration step, read
  [installation and authentication](references/installation-and-auth.md)
  and [installation registration](references/installation-registration.md).
- For shared task, billing, and connection details, read [tasks and
  results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [Bundled MCP
  Client diagnostics](references/mcp-connection.md).
- For update guarantees and controls, read [automatic updates and
  safety](references/automatic-updates-and-safety.md). For removal, read
  [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once
every 24 hours per installation. When a newer version is available, it
installs automatically without separate confirmation. It downloads only
from the fixed official Beatra discovery and immutable CDN paths for
this package, channel, and locale, verifies discovery data, archive,
manifest, and every packaged file, and replaces only package-owned
files.

Update checks, downloads, verification, replacement, rollback, and
recovery fail open: the current installation remains usable and the
original command continues. An update failure never authorizes retrying
a paid image, speech, or video request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
