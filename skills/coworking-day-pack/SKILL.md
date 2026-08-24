---
name: "coworking-day-pack"
description: "Turn a coworking or daytime office brief into one office background music playlist of 8 to 15 low-stimulation instrumentals. This coworking playlist studio writes a workday music and office BGM set for arrival, focus, light talk, and close. Use it for daytime instrumental beds and a low-stimulation playlist the floor can play through the day."
---

# Coworking Day Pack

Turn a daytime office or coworking brief into a labeled playlist of
low-stimulation instrumentals. The normal delivery is 8 to 15 beds,
not one song.

## Scope and adjacent routes

Use this Skill when a coworking floor, daytime office, or daytime cafe
work area needs a reusable set of original quiet instrumentals.

Route a livestream, night shift, or live-commerce playlist to
`livestream-bgm-pack`. Route a game soundtrack to
`indie-game-ost-pack`. Route a brand jingle or sung ad to
`brand-jingle-studio`. Route a song with lyrics to
`beatra-ai-music-creator`. Route spoken store announcements to
`store-pa-broadcast-pack`.

## Collect the room

Hard inputs are:

- where the music will play (coworking floor, daytime office, daytime
  cafe work area);
- how many tracks the pack should contain, or permission to use the
  default of 10;
- the daytime mood the room should hold.

Reuse already-known hours, talk-over needs, and exclusions. Ask only
for a missing hard input. A count outside 8 to 15 is still doable:
confirm that pack size and its live cost instead of treating it as
impossible.

Do not invent a room, a night drop, or lyrics.

## Plan the free track list

Write a labeled daytime track list before any paid music. Default ten
slots unless the seller names another count in 8 to 15: arrival, focus,
light talk, lunch, afternoon, and close, then fill remaining slots as
quiet resets. Each slot records use, mood, tempo feel, instruments,
energy, and intended length written as prompt direction.

That list is the free visible result. Planning is not approval.

Safe defaults:

- `instrumental: true` with lyrics absent.
- `model: "suno-5.5"`. Never omit the model and never silently use
  `auto`.
- There is no `duration` field on `beatra.music.generate`. Write length
  only in the prompt. Do not add a duration argument. Read the actual
  returned duration.

## Confirm generate

Before any billable track, read the current `beatra.models.list` card
for `text_to_music`. Show one current generate production card for the
frozen pack and wait:

1. Work — one daytime instrumental per named slot, a generate call
   (`beatra.music.generate`).
2. Credits — the live `text_to_music` price just read, times the slot
   count. Do not reuse a remembered number.
3. Count — one paid call per slot. Do not batch tracks into one
   submit.
4. Identity — one new opaque `client_request_id` per slot. A changed
   prompt, title, model, or count mints a new ID for the changed slots.
5. If we stop here — the labeled track list remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the seller says they have
   topped up. Do not recommend ¥198.

Submit each slot once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes, actual duration, and
`billing.net_charged_credits`.

## Review, deliver, and recover

Review each bed for low stimulation and slot fit. Report only what the
host can actually hear. Do not promise a seamless loop or exact
seconds.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the seller asks.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_music"}
```

```text
printf '%s' '{"model":"suno-5.5","prompt":"Low-stimulation daytime coworking focus bed, soft piano and pads, no vocals, about 90 seconds.","instrumental":true,"title":"Focus 01","client_request_id":"opaque-day-focus-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For slot lists, payloads, and recovery, read
  [Daytime playlist workflow](references/workflow.md).
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
a paid music request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
