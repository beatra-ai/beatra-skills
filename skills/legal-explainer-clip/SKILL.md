---
name: "legal-explainer-clip"
description: "Turn one public-education legal topic into a labeled digital-human still, a speakable explainer script, and one talking clip. This Legal Explainer Clip studio writes lawyer explainer and public-education talking clips for firm marketing. Use it for a legal explainer video, legal explainer clips, lawyer explainer videos, and public-education talking-head shorts."
---

# Legal Explainer Clip

Turn one public-education legal topic into a labeled digital-human
still, a speakable explainer script, and one talking clip. The first
delivery the firm can review is the still plan plus the script; the
talking clip comes after they accept that still and audio.

## Scope and adjacent routes

Use this Skill when a lawyer or firm marketing desk wants a
public-education talking clip for weekly firm marketing:
lawyer explainer videos, public-education talking-head shorts, and
WeChat or Douyin explainer clips.

This package is public-education only. Refuse case-specific legal
conclusions, win predictions, and identifiable party facts (party
names, case numbers, dockets, or party photos). Do not invent a
statute, element, deadline, or outcome to finish a script.

Route a generic presenter that is not public-education legal
explainer work to `talking-avatar-video`. Route policy-page stills
with no talking clip to `policy-digest-set`. Route an insurance
clause read to `insurance-clause-talking`.

## Collect the topic

Hard inputs are:

- one public-education legal topic the firm already wants explained
  (consumer cooling-off, contract form, workplace notice, or another
  named public-education theme);
- the language the clip should speak.

Reuse already-known destination, presenter look, and must-keeps.
Ask only for a missing hard input. Do not invent a topic, case, or
party to avoid asking.

If the request is a live matter, a win prediction, or names an
identifiable party, stop. Explain that this Skill makes a labeled
public-education clip, and collect a general public-education topic instead.
Do not enter paid still, speech, or video work on that case.

A supplied photo is an optional look reference (wardrobe, age,
studio), not a real-lawyer first frame. Do not use an unlabeled
real-lawyer portrait as the presenter. The generated still must
show a readable on-screen non-lawyer presenter label. Print exactly
this bilingual line on the still:

```text
非真人律师 / Non-lawyer presenter
```

For a local look-reference file the host can inspect, upload only
through the bundled client after inspection. Never pass a local
path to a remote tool.

## Plan the free still and script

Write a labeled still plan and a speakable public-education script before any
paid image, speech, or video. The plan records presenter look, the
required non-lawyer label, canvas, language, and the spoken lines
mapped to confirmed public-education facts. Keep the script short
enough for one 2–15s talking clip. That still plan plus script is
the free visible result. Planning is not approval.

Safe defaults:

- one digital-human still, `beatra.images.generate`, `model: "auto"`,
  `count: 1`, canvas `2K` `9:16` unless the named destination needs
  another ratio;
- one `beatra.speech.synthesize` call, `model: "auto"`, catalog
  voice;
- one `beatra.videos.animate` call after the still and audio are
  accepted, `model: "auto"` unless the user chose a live card that
  admits `[image, driving_audio]`;
- the accepted still as the strict first frame;
- `driving_audio` required;
- source-derived aspect ratio (omit `aspect_ratio`);
- audio-led duration: the smallest supported integer in 2–15s at
  or above the actual speech length. Do not stitch.

## Confirm the lead still and speech, then the clip

Before any billable still or speech, read the current
`beatra.models.list` cards for `text_to_image`, `text_to_speech`,
and `image_to_video`. Call `beatra.voices.list` only when a voice
still needs to be selected. Never put a display name in `voice`.

Confirm a current video card admits `[image, driving_audio]`. Use
`mp3` only when the live speech card supports it and the live video
card accepts `audio/mpeg`. If the user requested `flac`, `opus`, or
`pcm` and the video route does not accept the resulting format,
explain the mismatch before any paid call and obtain a compatible
choice. Do not silently change format or model.

Show one current lead production card for the two cheap lead slots
and wait. Planning is not approval:

1. Work — (a) one labeled digital-human still, a generate call
   (`beatra.images.generate`); (b) one public-education narration, a synthesize
   call (`beatra.speech.synthesize`).
2. Credits — the live `text_to_image` and `text_to_speech` prices
   just read. Do not reuse a remembered number.
3. Count — two paid calls this lead, one per slot. Do not fold the
   talking clip into this card.
4. Identity — one new opaque `client_request_id` per slot. A
   changed prompt, script, voice, file, model, or canvas mints a
   new ID for the changed slot.
5. If we stop here — the labeled still plan and speakable script
   remain usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the firm says they have
   topped up. Do not recommend ¥198.

Submit each approved lead slot once through bundled
`scripts/mcp_client.py`. Poll `beatra.tasks.get`. Deliver actual
bytes, MIME, duration or dimensions when present, and
`billing.net_charged_credits`. Ask the firm to accept the real
still (label readable) and the real audio (pronunciation, pace,
completeness) before video. A script preview is not an audio
review. A still plan is not a still review.

Accepted still plus audio is not video approval. After both are
accepted, refresh the `image_to_video` card, admit the actual still
and audio facts, then show a **new** six-field card and wait:

1. Work — one talking Legal Explainer Clip, a generate call
   (`beatra.videos.animate`) with the accepted still as first
   frame and the accepted audio as `driving_audio`.
2. Credits — the live `image_to_video` price just read. Do not
   reuse a remembered number.
3. Count — one paid video call for this clip. Do not stitch.
4. Identity — one new opaque `client_request_id`. A changed still,
   audio, prompt, duration, or model mints a new ID.
5. If we stop here — the accepted still, audio, plan, and script
   remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not
   retry until the firm says they have topped up. Do not recommend
   ¥198.

If actual speech is longer than the longest containable clip, stop
before video. Offer a shorter script as new paid speech with a new
card and ID. Do not stitch, speed up, or silently crop.

## Review, deliver, and recover

Review that the required non-lawyer presenter label is
readable on the still and still readable in the clip, that the
spoken line stays on the confirmed public-education facts, and that
the still is the first frame. Report only what the host can
actually see and hear. Do not promise perfect lip sync.

After each terminal paid task, deliver actual bytes plus MIME,
duration or dimensions when present, and
`billing.net_charged_credits`. Do not promise the prepaid estimate
is the final charge.

After a returned `task_id`, poll that task. If the create response
is lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the firm asks. A
changed still, script, voice, or duration is a new card and a new
ID. One approval never covers retries.

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
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

```bash
python3 scripts/mcp_client.py call beatra.voices.list
```

```json
{"language": "zh-CN", "category": "preset"}
```

```text
printf '%s' '{"prompt":"A studio digital-human presenter facing camera. Print a readable on-screen label: 非真人律师 / Non-lawyer presenter. Restrained professional look, stable lighting.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"9:16"},"client_request_id":"opaque-legal-still-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{"input":"The approved public-education explainer script.","voice":"voice_selected","format":"mp3","model":"auto","client_request_id":"opaque-legal-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"art-legal-still-01"},"driving_audio":{"type":"artifact","artifact_id":"art-legal-speech-01"},"prompt":"A restrained public-education presenter speaks to camera. Keep the 非真人律师 / Non-lawyer presenter label readable. Steady eye line, subtle head movement, stable camera.","duration":8,"client_request_id":"opaque-legal-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For still plans, scripts, payloads, confirmation, polling,
  recovery, and review, read [Legal explainer workflow](references/workflow.md).
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
a paid still, speech, or video request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
