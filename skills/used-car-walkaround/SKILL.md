---
name: "used-car-walkaround"
description: "Turn one used-car condition sheet into a listing hero still and a speakable walkaround script, then turn that still into one used car walkaround clip. This used car walkaround studio makes a used-car listing still and a listing walkaround video from the facts you already have. Use it for dealer lot walkaround video, used-car listing video, and inventory walkaround clips."
---

# Used Car Walkaround

Turn one used-car condition sheet into a listing hero still and a
speakable walkaround script, then turn that still into one walkaround
clip. The first delivery is one labeled listing still plus one
speakable script the dealer can reuse. The clip comes after that lead
is accepted.

## Scope and adjacent routes

Use this Skill when a used-car dealer wants a listing hero and one
walkaround clip from a condition sheet they already have: dealer lot
walkaround video, used-car listing video, or an inventory walkaround
clip.

Route silent room clips to `listing-room-video-pack`. Route a talking
presenter that is not a car walkaround to `talking-avatar-video`.
Route a silent tool demo to `tool-demo-clip`. Route a generic still
that is not a named listing to `image-to-motion`.

One car is one clip. Remaining stock is a later pack with a new card.
Do not stitch clips.

## Collect the condition sheet

Hard inputs are:

- one named listing (stock number, or year, make, and model);
- the user-supplied condition sheet;
- the language the walkaround should speak.

Reuse already-known destination, voice, and brand look. Ask only for a
missing hard input. If the condition sheet is missing, ask for it.
Do not invent a listing to finish the still.

Mileage, accident history, and maintenance records may only be copied
verbatim from that condition sheet. Never invent or polish those
facts. Do not round a mileage figure, rewrite an accident line, or
fill a blank from a similar car. A missing line stays a named gap.

An optional listing photo is a visual reference, not a source for
missing condition facts. Upload it only after the host Agent inspects
it. Never pass a local path to a remote tool.

## Plan the free listing still and script

Write a labeled listing still plan and a speakable walkaround script
before any paid call. Record the named listing, canvas, printed
condition-sheet lines, the spoken script with mileage, accident, and
maintenance lines copied verbatim, language, and any optional photo
role. Keep the script short enough for one 2–15s clip. Extra lines
stay on the plan as named gaps. That plan plus script is the free
visible result. Planning is not approval.

Safe defaults:

- one 16:9 2K listing hero still (`model: "auto"`, `count: 1`);
- one walkaround speech track, `model: "auto"` unless the dealer chose
  a concrete compatible speech model;
- one 2–15s walkaround clip with the still as the strict first frame
  and `driving_audio` required. Omit `aspect_ratio`. Keep
  `model: "auto"` unless the dealer chose a concrete eligible
  driving-audio card. Never silently swap the model.

Before setting a concrete still, speech, or video model, canvas,
format, duration, or price, read the current `beatra.models.list`
cards for `text_to_image`, `text_to_speech`, and `image_to_video`.
Call `beatra.voices.list` only when a catalog voice still needs to be
selected. Never put a display name in `voice`. Use `mp3` only when the
live speech card supports it and the live video card accepts the
expected `audio/mpeg`.

## Confirm the lead still and speech, then the walkaround clip

Before any billable still or speech, show one current six-field lead
card for two slots and wait:

1. Work — one listing hero still (`beatra.images.generate`) and one
   walkaround speech track (`beatra.speech.synthesize`) for this named
   car.
2. Credits — the live `text_to_image` price plus the live
   `text_to_speech` price just read. Do not reuse a remembered number.
3. Count — two paid calls, two slots. Do not batch remaining stock
   into this submit.
4. Identity — two new opaque `client_request_id` values, one per slot.
   A changed prompt, fact line, voice, format, file, model, or canvas
   mints a new ID for the changed slot.
5. If we stop here — the labeled listing still plan and the speakable
   walkaround script remain usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the dealer says they have
   topped up. Do not recommend ¥198.

Submit each lead slot once through bundled `scripts/mcp_client.py`.
Poll `beatra.tasks.get`. Deliver actual still bytes, actual speech
bytes, actual duration, and `billing.net_charged_credits`. Present or
play the real audio when the host can do so. A script preview is not
an audio review.

After that lead is accepted, refresh the current `beatra.models.list`
card for `image_to_video`. Admit the actual still and audio against a
card that accepts `[image, driving_audio]`. Compare every still and
audio fact with advertised constraints. Choose the smallest supported
integer duration in the 2–15s range that is at least the actual speech
length. Do not add silence to force a match. Lead acceptance is not
video approval.

Then show a fresh six-field animate card and wait:

1. Work — one walkaround clip for this named car, an animate call
   (`beatra.videos.animate`) with the accepted still as the first
   frame and the accepted speech as `driving_audio`.
2. Credits — the live `image_to_video` price just read. Do not reuse a
   remembered number.
3. Count — one paid call for this car. Do not stitch. Do not batch
   remaining stock into this submit.
4. Identity — one new opaque `client_request_id`. A changed still,
   audio, prompt, duration, or model mints a new ID.
5. If we stop here — the accepted still and speech remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the dealer says they have topped up. Do not recommend ¥198.

After the dealer approves that card, submit `beatra.videos.animate`
once.

Remaining named cars are a later pack. Show a fresh six-field pack
card. Do not treat acceptance of the first car as approval of the
rest.

## Review, deliver, and recover

Review printed and spoken mileage, accident, and maintenance lines
against the condition sheet. Report only what the host can actually
see or hear. Unread small type is unread. Do not treat the still or
clip as a certified vehicle history.

Deliver the still, the speech, and the clip with actual dimensions,
duration, usage, and `billing.net_charged_credits`. Never invent a
stitch, concat, or editor tool.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the dealer asks.

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
{}
```

```text
printf '%s' '{"prompt":"Create the listing hero still for this named used car. Print only condition-sheet lines that belong on the still. Do not invent mileage, accident, or maintenance facts.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"16:9"},"client_request_id":"opaque-used-car-still-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

```text
printf '%s' '{"voice":"voice_selected","input":"The speakable walkaround with verbatim mileage, accident, and maintenance lines.","client_request_id":"opaque-used-car-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"art_listing_still"},"driving_audio":{"type":"artifact","artifact_id":"art_walkaround_speech"},"prompt":"A restrained walkaround hold on this listing still. Keep the car identity stable. Do not add unstated mileage or accident claims.","duration":8,"client_request_id":"opaque-used-car-video-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For still plans, scripts, payloads, confirmation, polling, recovery,
  and review, read
  [Used-car walkaround workflow](references/workflow.md).
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
