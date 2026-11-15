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
- `model: "suno-6"` for music slots. Never omit the model on music slots and
  never silently use `auto` there.
- Sound effects and room tone: when the episode brief asks for dramatic
  tension hits, transition whooshes, impact cues, or quiet room tone, use
  `beatra.audio.generate_sfx` (`{"capability": "sound_effects"}`) with
  `model: "auto"` and `duration_seconds` from `0.5` to `30` (setting
  `loop: true` for repeating room tone or exterior ambience beds). Never write
  a concrete vendor or internal SFX model ID.
- Length: when this account has the music tools (the bundled client's `tools`
  command lists `beatra.music.edit` and `beatra.audio.process`; see
  [music editing and audio](references/music-editing-and-audio.md)), send each
  slot's intended length as `duration_seconds`, from 30 to 120 seconds (30 for a
  shorter slot, 120 for a longer one, which step 6 then loops). Without them, write length only
  in the prompt and do not add a duration argument.
- Room for dialogue is prompt direction rather than a dedicated control.
  Never promise a seamless loop or sample-perfect seconds: with the music tools,
  report how smoothly each loop joins; without them, ask for a loop-friendly
  arrangement. Read the actual returned duration.
- Follow-up native edits: when a delivered bed carries
  `editable: {"native": true}`, offer `beatra.music.edit` (priced live by
  operation, e.g. `{"capability": "music_extend"}` or
  `{"capability": "music_replace_section"}`) for extending a cue or revising a
  section on its own confirmed card.

Score planning is free. Each `beatra.music.generate`, `beatra.music.edit`,
`beatra.audio.generate_sfx`, and `beatra.audio.process` finishing call is paid.

## Golden path

1. Write the episode card and the labeled slot list (music beds plus any
   requested tension hits, transition cues, or room-tone SFX slots). Each slot
   has a use, mood, tempo feel, instrumentation or sound source, energy, and
   intended length.
2. Call `beatra.models.list` with `{"capability":"text_to_music"}`, read the
   `suno-6` entry's `pricing`, and price the music beds from that live card per
   slot and in total. With the music tools, add each slot's finishing call at
   the live `audio_process` price (`beatra.models.list` with
   `{"capability": "audio_process"}`). When the pack includes SFX hits or room
   tone, call `beatra.models.list` with `{"capability": "sound_effects"}` and
   price those lines from the live card (plus the operation capability such as
   `{"capability": "music_extend"}` or `{"capability": "music_replace_section"}`
   if quoting a native edit). Never a remembered number.
3. Confirm the frozen score: slot count, each music slot's prompt, title, and
   length, `instrumental: true`, music model (`suno-6`), any SFX cues (`prompt`,
   `duration_seconds`, `loop`, `model: "auto"`), any finishing calls, the
   current maximum charge for the pack, and one opaque stable
   `client_request_id` per slot and per finishing call. Planning is not approval.
4. Submit each slot exactly once through the bundled
   `scripts/mcp_client.py`. Example:

   ```text
   printf '%s' '{"model":"suno-6","prompt":"Vertical short-drama tension bed, low strings, room for dialogue, about 45 seconds, no vocals.","instrumental":true,"title":"Tension 01","duration_seconds":45,"client_request_id":"opaque-drama-tension-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Submit any confirmed tension hits, transitions, or room-tone beds with
   `beatra.audio.generate_sfx` (`model: "auto"`, `duration_seconds` `0.5`–`30`,
   and `loop: true` for repeating room tone). Without the music tools, drop
   `duration_seconds` on `beatra.music.generate` and keep "about 45 seconds" in
   the prompt.

   Do not configure, call, or use a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback.
5. Poll each task with `beatra.tasks.get`. Deliver a labeled score in
   slot order with actual duration, MIME type, size, URL or artifact ID,
   resolved model, and `billing.net_charged_credits`.
6. When this account has the music tools, finish each delivered bed for its
   cue in one `beatra.audio.process` call per slot, so the whole score plays at
   one level. Finish the first take of each slot; list the other take as that
   slot's alternative, which the user can ask to have finished the same way (one more paid finishing call, on its own card). The finished files are the pack; list the raw takes after them.
   `operation: "loop"` with `target_duration_ms` set to the slot's length when
   the slot is clearly longer than the bed (more than about 10%, as for a slot
   over 120 seconds); a bed within about 10% of its slot keeps its real length:
   run `normalize_loudness` and report the difference; `operation: "trim"` with
   `target_duration_ms` when the bed is longer than a slot that is under 30
   seconds or that needs its exact second. Send `fade_in_ms: 300`,
   `fade_out_ms: 1500`, and `loudness_lufs: -14` in each of these calls. The fade
   lengths are arrangement defaults, short enough for a cut; say which you used
   and change them when the user asks. Each of these calls is paid at the live `audio_process` price: they finish what the user already asked for (each slot's length and one level across the score), so the pack card lists each one as its own line beside the slot it finishes, with that price and its own `client_request_id`. Run them one at a time once that slot is delivered. Report each slot's real length,
   the seam of a loop in plain words ("how smoothly it joins where it repeats:
   0.91 out of 1, higher is smoother"), and the measured loudness in plain words
   ("all beds at about −14 LUFS, the level most streaming platforms play at").
   Without the tools, skip this step; only when the user asked for something it
   would deliver (exact lengths, one level across the score), say in one
   sentence that this option is not available yet.
7. Review each bed for dialogue room and slot fit. Read actual durations.
   State what the host Agent could not hear.
8. When a delivered bed carries `editable: {"native": true}` and needs a bridge
   extension or section tweak, or when a room-tone SFX bed needs `> 30` s
   looping or `-14 LUFS` matching via `beatra.audio.process`, run it as its own
   paid line on a confirmed card.

## Decisions that require confirmation

Confirm the score size and live pack estimate before the first paid
call. Show one current production card and wait:

1. Work — the labeled score in the user's words: each music slot a
   `beatra.music.generate` call, each requested SFX/room-tone slot a
   `beatra.audio.generate_sfx` call, any `beatra.music.edit` revision, and with
   the music tools each finishing `beatra.audio.process` call on its own line.
2. Credits — the live `suno-6` price just read from `beatra.models.list`
   (`text_to_music`), the live `sound_effects` or matching edit-operation price
   (`music_extend`, `music_replace_section`, and related operation capabilities)
   when used, and with the music tools the live `audio_process` price of each
   finishing call, per line and in total. Never a remembered number.
3. Count — one paid call per line listed on the card: each music or SFX slot,
   any native music edit, and each finishing call.
4. Identity — one new opaque `client_request_id` per line listed on the card. Any changed
   prompt, title, length, model, or count mints a new ID for each changed line.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Translate the prose; keep the URL. Do not retry
   until the user says they have topped up.

A changed slot prompt, title, length, model, or count is new paid work with
new request IDs for the changed slots only. An add-on SFX cue batch or native
`beatra.music.edit` is its own paid step and its own card.

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

- Read [Short-drama score workflow](references/workflow.md) for slot
  cards, payloads, polling, recovery, and review.
- Read [Music editing and audio](references/music-editing-and-audio.md) for
  the length, loop, fade, and level steps.
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
