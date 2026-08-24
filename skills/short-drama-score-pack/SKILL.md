---
name: "short-drama-score-pack"
description: "Build an original short-drama score pack of 8 to 15 instrumental beds for tension, romance, comedy, and tearjerker scenes. This short drama BGM studio and episode score generator writes loop-friendly short-drama music you own and can use commercially, then delivers a labeled short drama score you can audition before the cut. Use it as a short drama soundtrack for short-drama BGM, vertical drama music, episode score, romance beds, tension beds, and original short-drama music."
---

# Short Drama Score Pack

Turn an episode brief into a labeled original score. The normal delivery
is a pack of 8 to 15 instrumental beds, not one song.

## Scope and adjacent routes

Use this Skill when a vertical short-drama episode or season needs a
reusable set of original mood beds the editor can own and use commercially.

Route spoken short-drama dialogue to `short-drama-voice-pack`. Route shot
generation to `ai-short-drama-shot-maker`. Route a livestream or store
playlist to `livestream-bgm-pack`. Route one instrumental for a specific
finished cut to `short-video-bgm-studio`. Route a game soundtrack to
`indie-game-ost-pack`. Route a brand jingle to `brand-jingle-studio`.

## Inputs and defaults

The hard inputs are:

- the episode or season mood;
- how many beds the pack should contain, or permission to use the default
  of 10;
- the genres the score must cover.

Reuse already-known pairing, cliffhanger, and exclusion notes. Ask only
when a missing answer changes the pack size or the paid slots. A count
outside 8 to 15 is still doable: confirm that pack size and its live cost
instead of treating it as impossible.

Safe defaults:

- 10 beds unless the user names a count between 8 and 15.
- Slot mix: tension, romance, comedy, tearjerker, chase, reveal, and
  end-card beds.
- `instrumental: true` with lyrics absent.
- `model: "suno-5.5"`. Never omit the model and never silently use `auto`.
- There is no `duration` field on `beatra.music.generate`. Write length
  only in the prompt. Do not add a duration argument.
- Loop-friendly arrangement and room for dialogue, written as prompt
  direction rather than a dedicated control. Do not promise a seamless
  loop or sample-perfect seconds. Read the actual returned duration.

Score planning is free. Each `beatra.music.generate` call is paid.

## Golden path

1. Write the episode card and the labeled slot list. Each slot has a use,
   mood, tempo feel, instrumentation, energy, and intended length.
2. Call `beatra.models.list` with `{"capability":"text_to_music"}` and price
   the whole pack from the live card.
3. Confirm the frozen score: slot count, each slot's prompt and title,
   `instrumental: true`, model, the current maximum charge for the pack, and
   one opaque stable `client_request_id` per slot. Planning is not approval.
4. Submit each slot exactly once through the bundled
   `scripts/mcp_client.py`. Example:

   ```text
   printf '%s' '{"model":"suno-5.5","prompt":"Vertical short-drama tension bed, low strings, room for dialogue, about 45 seconds, no vocals.","instrumental":true,"title":"Tension 01","client_request_id":"opaque-drama-tension-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback.
5. Poll each task with `beatra.tasks.get`. Deliver a labeled score in
   slot order with actual duration, MIME type, size, URL or artifact ID,
   resolved model, and `billing.net_charged_credits`.
6. Review each bed for dialogue room and slot fit. Read actual durations.
   State what the host Agent could not hear.

## Decisions that require confirmation

Confirm the score size and live pack estimate before the first paid
call. A changed slot prompt, title, model, or count is new paid work with
new request IDs for the changed slots only.

## Recovery

If a create response is lost, retry only that slot's identical frozen
payload and ID. If a task ID is lost, list text-to-music tasks with
`beatra.tasks.list`, inspect candidates with `beatra.tasks.get`, and
recover the original slot before new work. Cancel only at the user's
request for that slot with `beatra.tasks.cancel`; on 409 keep polling.

## References by task

- Read [Short-drama score workflow](references/workflow.md) for slot
  cards, payloads, polling, recovery, and review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
  for update controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.
Before ordinary commands it silently checks for a newer release at most once
every 24 hours per installation. Silent checks are enabled by default, and a
newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable
Beatra CDN path embedded for this package, channel, and locale. It verifies
the discovery data, archive, manifest, and every file's size and checksum
before replacement. It replaces only package-owned files and rejects
redirects, downgrades, wrong package/channel/locale/version data, unexpected
URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the user's original
command continues. An update failure never authorizes retrying a paid
generation. The automatic-update choice persists across later commands for
this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check`
reports the official available version without replacing files.
