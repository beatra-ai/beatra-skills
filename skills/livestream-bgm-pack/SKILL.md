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
- `model: "suno-5.5"`. Never omit the model and never silently use `auto`.
- There is no `duration` field on `beatra.music.generate`. Write length
  only in the prompt. Do not add a duration argument.
- Loop-friendly arrangement and room for a host voice, written as prompt
  direction rather than a dedicated control. Do not promise a seamless
  loop or sample-perfect seconds. Read the actual returned duration.

Playlist planning is free. Each `beatra.music.generate` call is paid.

## Golden path

1. Write the room card and the labeled slot list. Each slot has a use, mood,
   tempo feel, instrumentation, energy, and intended length.
2. Call `beatra.models.list` with `{"capability":"text_to_music"}` and price
   the whole pack from the live card.
3. Confirm the frozen playlist: slot count, each slot's prompt and title,
   `instrumental: true`, model, the current maximum charge for the pack, and
   one opaque stable `client_request_id` per slot. Planning is not approval.
4. Submit each slot exactly once through the bundled
   `scripts/mcp_client.py`. Example:

   ```text
   printf '%s' '{"model":"suno-5.5","prompt":"Low-distraction livestream waiting bed, warm ambient pop, loop-friendly, space for host talk, about 90 seconds.","instrumental":true,"title":"Waiting Bed 01","client_request_id":"opaque-live-waiting-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback.
5. Poll each task with `beatra.tasks.get`. Deliver a labeled playlist in
   slot order with actual duration, MIME type, size, URL or artifact ID,
   resolved model, and `billing.net_charged_credits`.
6. Review each bed for loop friendliness, voice room, and slot fit. Read
   actual durations. State what the host Agent could not hear.

## Decisions that require confirmation

Confirm the playlist size and live pack estimate before the first paid
call. A changed slot prompt, title, model, or count is new paid work with
new request IDs for the changed slots only.

## Recovery

If a create response is lost, retry only that slot's identical frozen
payload and ID. If a task ID is lost, list text-to-music tasks with
`beatra.tasks.list`, inspect candidates with `beatra.tasks.get`, and
recover the original slot before new work. Cancel only at the user's
request for that slot with `beatra.tasks.cancel`; on 409 keep polling.

## References by task

- Read [Livestream playlist workflow](references/workflow.md) for slot
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
