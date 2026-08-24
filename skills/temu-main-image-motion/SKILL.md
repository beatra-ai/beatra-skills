---
name: "temu-main-image-motion"
description: "Turn one Temu main image into one Temu main image video for the listing video slot. The template one-shot keeps that photo as the first frame and returns one main image clip. Use it when Temu listing video work is product main image motion that stays one photo one clip."
---

# Temu Main Image Motion

Turn one Temu main image into one short clip for the listing video
slot. Keep the photo the seller already uses as the main image. One
photo makes one clip.

## Scope and adjacent routes

Use this Skill when a seller has a Temu main image ready for the
listing and wants that exact frame to move.

Route an Amazon white-background main image to
`amazon-main-image-motion`. Route still listing sets to
`shopify-pdp-set`. Route a Reel that should become a product clip to
`instagram-reel-to-pdp-clip`. Route per-step assembly photos to
`assembly-one-step-clip`. Route a still that is not a Temu main image
to `image-to-motion`. Do not write the listing copy. Do not look up
public posts, reviews, or competitor listings.

## Inputs and defaults

The hard inputs are:

- at least one inspectable main image the host Agent can open;
- what the seller wants to move, in their own words;
- a duration in the 2–15s range, or permission to use 5s.

Reuse SKU name, language, marketplace, and must-keeps already in the
conversation. Ask only for a missing hard input. If the label text in
the image is too small or too blurred to transcribe, stop and ask for
a cleaner file rather than guessing the words.

Do not invent a claim, certification, size, or count that the seller
did not state. The image is not a source for unstated facts.

Product motion stays inside this vocabulary. Pick one. Subtle beats
dramatic — a large requested movement distorts the product and its
label.

- Always available, because they reveal nothing the image does not
  already show: turntable rotation, light sweep, gentle push-in.
- Only when the seller supplies what is inside — an interior photo or
  a stated contents list: lid lift, unfold, exploded view. Without
  that, the model would invent the interior. Ask for it or offer a
  turntable instead.

Default to one `beatra.videos.animate` call per image, `model: "auto"`,
the main image as the first frame, no `driving_audio`, and no
`aspect_ratio`, which asks for the source ratio without guaranteeing
it. Read the chosen model's live card, and if that card declares a
fixed output ratio, tell the seller the main image will be re-framed
before showing the production card. Choose a supported integer
duration in the 2–15s range with the seller; if they do not pick, use
5s rather than the 15s ceiling.

## Golden path

1. Inspect each image. Record MIME type, width, height, aspect ratio,
   byte size, and whether it has an alpha channel. Transcribe every
   legible string on the pack — brand, variant, size, count, claim —
   verbatim. For a local file, upload only through the bundled client
   after inspection. Never pass a local path to a remote tool.
2. Write a free shot plan the seller can check before anything is
   billable. One slot per image:

   - the opening state at 0.0s, naming what is *not* yet present so a
     reveal has somewhere to come from;
   - the one motion from the vocabulary above, with its direction and
     speed;
   - the closing hold;
   - every transcribed string, quoted, marked to stay pixel-identical;
   - what the plan locks: background, crop, product colour, and every
     quoted string. The plan is what the delivered clip is checked
     against; generated frames can still drift, and drift is reported
     rather than glossed.

   That plan is the free visible result. Planning is not approval.
3. Call `beatra.models.list` with `{"capability":"image_to_video"}`.
   Admit the image against a current card that accepts a first-frame
   image without driving audio. Compare MIME, dimensions, bytes, and
   the chosen duration with advertised constraints. If any required
   media fact is unavailable or incompatible, stop before video.
4. Show one current production card and wait before any video
   `client_request_id` or `beatra.videos.animate` call:

   1. Work — one main image clip from each named image
      (`beatra.videos.animate`).
   2. Credits — the live `image_to_video` price just read. Do not reuse
      a remembered number.
   3. Count — one paid call per image. Two SKUs are two IDs. A pack
      may list every image on one card; each image still has its own
      ID. A second take of the same image is a second charge; say the
      multiplication out loud before the seller approves.
   4. Identity — one new opaque `client_request_id` per image. A
      changed prompt, image, duration, model, or control mints a new
      ID.
   5. If we stop here — the shot plan remains usable.
   6. If the balance is insufficient — relay the official message and
      its top-up URL exactly
      (`https://console.beatra.ai/wallet?intent=buy`). Translate the
      prose; keep the URL. Do not retry until the seller says they have
      topped up. Do not recommend ¥198.

   Do not submit until the seller confirms they have topped up or
   already have enough credits.
5. Submit `beatra.videos.animate` exactly once per approved image
   through bundled `scripts/mcp_client.py`. Do not configure a host
   Beatra Connector. Do not use REST/OpenAPI as a fallback. Poll the
   video task with `beatra.tasks.get` until terminal.
6. Deliver each clip with actual dimensions, duration, usage, and
   `billing.net_charged_credits`. Check it against the plan: did the
   named motion fire, did the background and crop hold, did every
   quoted string stay readable at full size. Report drift as drift.
   Never invent a stitch, concat, or editor tool.

## Decisions that require confirmation

Shot planning and live price quotes are free. They are not approval.
Video animate needs the six-field card above. Re-running the same image
because the seller wants a different look is new paid work with a new
card and a new ID. File access is not consent to reuse the image
outside this clip.

## Recovery

The paid image has one frozen payload and one ID. Recover a lost create
response only with that identical payload. Recover a lost task ID
through `beatra.tasks.list` and `beatra.tasks.get`. Call
`beatra.tasks.cancel` only when the seller asks to cancel; on 409 keep
polling. On `insufficient_balance`, keep the top-up URL exact and retry
the same frozen ID only after the seller says they have topped up. If a
create returns no `task_id`, do not poll; reconcile before minting a
new ID. A changed image, prompt, duration, or model is new work and a
new card.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"<the uploaded main image>"},"prompt":"<the written motion for this image>","duration":5,"client_request_id":"opaque-temu-main-01"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For shot plans, payloads, confirmation, polling, recovery, and
  delivery checks, read [Temu main image motion workflow](references/workflow.md).
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
a paid video request. The setting persists for this installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
