---
name: "apartment-kitchen-tour"
description: "Turn one kitchen photo the listing already uses into one short clip for the listing page. The photo is the clip's first frame, so that frame keeps the room's layout, and from there the camera eases in, drifts between foreground and background, or light sweeps across the counter. Use it for kitchen tour video, apartment kitchen clip, listing photo animation, and real estate room video work that stays one photo one clip."
---

# Apartment Kitchen Tour

Turn one kitchen photo the listing already uses into one short clip for
the listing page or a short-video slot. One photo makes one clip. Do not
stitch a whole-home walkthrough.

## Scope and adjacent routes

Use this Skill when an agent or host has a kitchen photo and wants that
exact frame to move.

Route a set of rooms for a whole-home pack to `listing-room-video-pack`.
Route a spoken welcome from a host photo to `airbnb-welcome-avatar`.
Route a still that is not a listing room to `image-to-motion`. Do not
shoot, retouch, virtually stage, or re-light the photo here, and do not
write the listing copy or estimate a price. Do not look up public posts,
reviews, or competing listings.

## Inputs and defaults

The hard inputs are:

- one accessible kitchen photo the host Agent can inspect;
- what the agent or host wants to move, in their own words.

Everything else is optional. Reuse unit name, language, market, and
must-keeps already in the conversation. Ask only for a missing hard
input. If text in the photo — an appliance brand, a unit number, a price
card — is too small or too blurred to transcribe, stop and ask for a
cleaner file rather than guessing the words.

Do not invent an appliance, a fixture, a measurement, or an amenity the
photo does not show and the agent did not state. The photo is not a
source for unstated facts.

On-screen motion stays inside this vocabulary. Pick one. Subtle beats
dramatic — a large requested movement warps counters and cabinet lines.

- Always available, because they reveal nothing the photo does not
  already show: slow push-in, light sweep across the counter, and
  parallax drift between depth layers so long as it stays small enough
  not to open a gap behind a foreground object.
- Only when the agent supplies what is inside — an interior photo of that
  cabinet, drawer, or appliance: opening a cabinet, pulling a drawer,
  opening the fridge. Without it the model invents the contents, and a
  renter or buyer reads storage and appliances off that clip. Ask for the
  interior photo or offer a push-in instead.

Default to one `beatra.videos.animate` call, `model: "auto"`, the photo
as the strict first frame, no `driving_audio`, and no `aspect_ratio`,
which leaves the ratio to the card: a declared model default, a
source-derived ratio, or fixed model behaviour. Read the chosen model's
live card. Unless the card promises a source-derived ratio, compare its
output ratio with the photo's, and if they differ, tell the agent the
framing will change before showing the production card.
Choose a supported integer duration in the 2–15s range with the agent; if
they do not pick, use 5s rather than the 15s ceiling.

## Golden path

1. Inspect the photo. Record MIME type, width, height, aspect ratio, byte
   size, and whether it has an alpha channel. Transcribe every legible
   string in frame — appliance brand, unit number, price card — verbatim.
   For a local file, upload only through the bundled client after
   inspection. Never pass a local path to a remote tool.
2. Write a free shot plan the agent can check before anything is
   billable:

   - the opening state at 0.0s, naming what is *not* yet present so a
     reveal has somewhere to come from;
   - the one camera move from the vocabulary above, with direction and
     speed;
   - the closing hold;
   - every transcribed string, quoted, marked to stay unchanged;
   - the negatives the prompt will carry: no film grain, no vignette, no
     lens flare, no watermark, no extra text, and no element the photo
     does not already contain.

   That plan is the free visible result. Planning is not approval.
3. Call `beatra.models.list` with `{"capability":"image_to_video"}`. Admit
   the photo against a current card that accepts a first-frame image
   without driving audio. Compare MIME, dimensions, bytes, and the chosen
   duration with advertised constraints. If any required media fact is
   unavailable or incompatible, stop before video.
4. Show one current production card and wait before any video
   `client_request_id` or `beatra.videos.animate` call:

   1. Work — one kitchen clip from one named photo, a generate call
      (`beatra.videos.animate`).
   2. Credits — the live `image_to_video` price just read. Do not reuse a
      remembered number.
   3. Count — one paid call per photo. Three rooms are three cards. A
      second take of the same photo is a second charge; say the
      multiplication out loud before the agent approves.
   4. Identity — one new opaque `client_request_id` per photo. A changed
      prompt, photo, duration, model, or control mints a new ID.
   5. If we stop here — the shot plan remains usable.
   6. If the balance is insufficient — relay the official message and its
      top-up URL exactly (`https://console.beatra.ai/wallet?intent=buy`).
      Translate the prose; keep the URL. Do not retry until the agent
      says they have topped up. Do not recommend ¥198.

   Do not submit until the agent confirms they have topped up or already
   have enough credits.
5. Submit `beatra.videos.animate` exactly once per approved photo through
   bundled `scripts/mcp_client.py`. Do not configure a host Beatra
   Connector. Do not use REST/OpenAPI as a fallback. Poll the video task
   with `beatra.tasks.get` until terminal.
6. Deliver the clip with actual dimensions, duration, usage, and
   `billing.net_charged_credits`. Review it against the plan: did the
   named move fire, did the room stay as photographed, did every quoted
   string stay readable at full size. Report drift as drift. Never invent
   a stitch, concat, or editor tool.

## Decisions that require confirmation

Shot planning and live price quotes are free. They are not approval.
Video animate needs the six-field card above. Re-running the same photo
because the agent wants a different look is new paid work with a new card
and a new ID. File access is not consent to reuse the photo outside this
clip.

## Recovery

The paid photo has one frozen payload and one ID. Recover a lost create
response only with that identical payload. Recover a lost task ID through
`beatra.tasks.list` and `beatra.tasks.get`. Call `beatra.tasks.cancel`
only when the agent asks to cancel; on 409 keep polling. On
`insufficient_balance`, keep the top-up URL exact and retry the same
frozen ID only after the agent says they have topped up. If a create
returns no `task_id`, do not poll; reconcile before minting a new ID. A
changed photo, prompt, duration, or model is new work and a new card.

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

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For shot plans, payloads, confirmation, polling, recovery, and review,
  read [Kitchen tour workflow](references/workflow.md).
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

The bundled client silently checks for a newer release at most once every
24 hours per installation. When a newer version is available, it installs
automatically without separate confirmation. It downloads only from the
fixed official Beatra discovery and immutable CDN paths for this package,
channel, and locale, verifies discovery data, archive, manifest, and every
packaged file, and replaces only package-owned files.

Update checks, downloads, verification, replacement, rollback, and
recovery fail open: the current installation remains usable and the
original command continues. An update failure never authorizes retrying a
paid video request. The setting persists for this installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
