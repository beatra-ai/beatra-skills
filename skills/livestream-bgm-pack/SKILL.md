---
name: "livestream-bgm-pack"
description: "Build an original livestream BGM playlist of 10 to 20 instrumental tracks for a room, store, or live-commerce shift. This livestream background music pack and store-loop music generator writes waiting, chat, product, hype, and night beds as original livestream music you own and can use commercially, then delivers a labeled playlist you can audition before going live. Use it as a playlist BGM generator for livestream BGM, live commerce BGM, store loop music, waiting room music, in-store background music, and original stream music."
---

# Livestream BGM Pack

Turn a room or store brief into a labeled playlist of original instrumental
tracks. The normal delivery is a pack of 10 to 20 beds, not one song.

## Scope and adjacent routes

Use this Skill when a livestream, live-commerce shift, physical store, or
waiting screen needs a reusable set of original loop-friendly instrumentals
the operator can own and use commercially.

Route one instrumental written for a specific video cut to
`short-video-bgm-studio`. Route a brand jingle, sung ad song, or sonic logo
to `brand-jingle-studio`. Route a song with lyrics to
`beatra-ai-music-creator`. Route spoken narration to
`short-form-voiceover-audio`.

## Inputs and defaults

The hard inputs are:

- where the music will play (livestream room, live-commerce, store, waiting
  screen);
- how many tracks the pack should contain, or permission to use the default
  of 12;
- the brand or room mood.

Reuse already-known category, time-of-day, voice-over needs, and exclusions.
Ask only when a missing answer changes the playlist size or the paid slots.
A count outside 10 to 20 is still doable: confirm that pack size and its
live cost instead of treating it as impossible.

Safe defaults:

- 12 tracks unless the user names a count between 10 and 20.
- Slot mix: waiting, chat, product, hype, night, and reset beds.
- `instrumental: true` with lyrics absent.
- `model: "suno-6"`. Never omit the model and never silently use `auto`.
- Length: when this account has the music tools (the bundled client's `tools`
  command lists `beatra.music.edit` and `beatra.audio.process`; see
  [music editing and audio](references/music-editing-and-audio.md)), send each
  slot's intended length as `duration_seconds`, from 30 to 120 seconds (30 for a
  shorter slot, 120 for a longer one, which step 6 then loops). Without them, write length only
  in the prompt and do not add a duration argument.
- Room for a host voice is prompt direction rather than a dedicated control.
  Never promise a seamless loop or sample-perfect seconds: with the music tools,
  report how smoothly each loop joins; without them, ask for a loop-friendly
  arrangement. Read the actual returned duration.

Playlist planning is free. Each `beatra.music.generate` call and each finishing call is paid.

## Golden path

1. Write the room card and the labeled slot list. Each slot has a use, mood,
   tempo feel, instrumentation, energy, and intended length.
2. Call `beatra.models.list` with `{"capability":"text_to_music"}`, read the
   `suno-6` entry's `pricing`, and price the whole pack from that live card per slot and in total, adding, with the music tools, each slot's finishing call at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`). Never a remembered number.
3. Confirm the frozen playlist: slot count, each slot's prompt, title, and
   length, `instrumental: true`, model, the current maximum charge for the pack,
   and one opaque stable `client_request_id` per slot and per finishing call.
   Planning is not approval.
4. Submit each slot exactly once through the bundled
   `scripts/mcp_client.py`. Example:

   ```text
   printf '%s' '{"model":"suno-6","prompt":"Low-distraction livestream waiting bed, warm ambient pop, loop-friendly, space for host talk, about 90 seconds.","instrumental":true,"title":"Waiting Bed 01","duration_seconds":90,"client_request_id":"opaque-live-waiting-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Without the music tools, drop `duration_seconds` and keep "about 90
   seconds" in the prompt.

   Do not configure, call, or use a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback.
5. Poll each task with `beatra.tasks.get`. Deliver a labeled playlist in
   slot order with actual duration, MIME type, size, URL or artifact ID,
   resolved model, and `billing.net_charged_credits`.
6. When this account has the music tools, finish each delivered bed in one
   `beatra.audio.process` call per slot, so the whole pack plays at one level.
   Finish the first take of each slot; list the other take as that slot's
   alternative, which the user can ask to have finished the same way (one more paid finishing call, on its own card). The
   finished files are the pack; list the raw takes after them.
   `operation: "loop"` with `target_duration_ms` set to the slot's length when
   the slot is clearly longer than the bed (more than about 10%, as for a slot
   over 120 seconds); a bed within about 10% of its slot keeps its real length:
   run `normalize_loudness` and report the difference; `operation: "trim"` with
   `target_duration_ms` when the bed is longer than a slot that is under 30
   seconds or that needs its exact second. Send `loudness_lufs: -14` in each of
   these calls. Each of these calls is paid at the live `audio_process` price: they finish what the user already asked for (each slot's length and one level across the pack), so the pack card lists each one as its own line beside the slot it finishes, with that price and its own `client_request_id`. Run them one at a time once that slot is delivered. Report each slot's real length, the seam of a loop in plain
   words ("how smoothly it joins where it repeats: 0.91 out of 1, higher is
   smoother"), and the measured loudness in plain words ("all beds at about −14
   LUFS, the level most streaming platforms play at"). Without the tools, skip
   this step; only when the user asked for something it would deliver (exact
   lengths, one level across the pack), say in one sentence that this option is
   not available yet.
7. Review each bed for loop friendliness, voice room, and slot fit. Read
   actual durations. State what the host Agent could not hear.

## Decisions that require confirmation

Confirm the playlist size and live pack estimate before the first paid
call. Show one current production card and wait:

1. Work — the labeled playlist in the user's words, each slot a `beatra.music.generate` call, and with the music tools each slot's finishing `beatra.audio.process` call on its own line.
2. Credits — the live `suno-6` price just read from `beatra.models.list` and, with the music tools, the live `audio_process` price of each finishing call, per line and in total. Never a remembered number.
3. Count — one paid call per line listed on the card: each slot, and with the music tools each slot's finishing call.
4. Identity — one new opaque `client_request_id` per line listed on the card. Any changed
   prompt, title, length, model, or count mints a new ID for each changed line.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Translate the prose; keep the URL. Do not retry
   until the user says they have topped up.

A changed slot prompt, title, length, model, or count is new paid work with
new request IDs for the changed slots only.

When the user asks how many credits remain, call `beatra.wallet.get`. When they
ask what was charged, call `beatra.wallet.ledger`. Both are read-only. Do not
invent an account-balance or top-up tool. Do not make `wallet.get` a required
step before every paid submit.

## Recovery

If a create response is lost, retry only that slot's identical frozen
payload and ID. If a task ID is lost, list text-to-music tasks with
`beatra.tasks.list`, inspect candidates with `beatra.tasks.get`, and
recover the original slot before new work. Cancel only at the user's
request for that slot with `beatra.tasks.cancel`; on 409 keep polling.

## References by task

- Read [Livestream playlist workflow](references/workflow.md) for slot
  cards, payloads, polling, recovery, and review.
- Read [Music editing and audio](references/music-editing-and-audio.md) for
  the length, loop, and level steps.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
