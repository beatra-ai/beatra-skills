---
name: "exam-mnemonic-song"
description: "Turn one exam knowledge point into a mnemonic song you can replay, then turn the rest of the syllabus into a set. This exam mnemonic song studio writes a knowledge-point song and exam memory song from the facts you already have. Use it for bar-exam mnemonics, teacher-certification songs, accounting-exam memory songs, and other exam mnemonic playlists."
---

# Exam Mnemonic Song

Turn one exam knowledge point into a sung mnemonic, then turn the rest of
that syllabus into a labeled set. The first delivery is one complete song
the learner can replay.

## Scope and adjacent routes

Use this Skill when a training school, exam coach, or candidate wants a
knowledge-point song from facts they already have: bar-exam mnemonics,
teacher-certification songs, accounting-exam memory songs, or another
exam mnemonic playlist.

Route a song that is not an exam mnemonic to
`music-generation-studio`. Route spoken course narration, not a sung
mnemonic, to `course-narration-studio`. Route a personal gift song to
`personalized-song-maker`.

## Collect the knowledge point

Hard inputs are:

- the exam or subject (bar, teacher certification, accounting, or
  another named exam);
- one knowledge point with the facts that must be remembered;
- the language the song should sing.

Reuse already-known genre, mood, and vocal direction. Ask only for a
missing hard input. Do not invent a statute, date, element, or exam
fact to finish a lyric.

A full syllabus is welcome. The first paid song is still one knowledge
point. Remaining points wait until that first song is accepted.

## Plan the free lyric sheet

Write a labeled mnemonic sheet before any paid music: title, section
labels, full lyrics, must-keep facts mapped to lines, genre, mood, and
vocal direction. Keep every must-keep fact exact. That sheet is the
free visible result. Planning is not approval.

Safe defaults:

- `model: "suno-6"`. Never omit the model and never silently use
  `auto`.
- `instrumental: false` with confirmed lyrics present.
- `model_options.suno.custom_mode: true`.
- Length: when this account has the music tools (the bundled client's `tools`
  command lists `beatra.music.edit` and `beatra.audio.process`; see
  [music editing and audio](references/music-editing-and-audio.md)) and the
  teacher names a length, send `duration_seconds` of 30 or more that the lyrics
  fit, without `duration_fit`: a shorter target, or `exact`, cuts the singing at
  the target and can take the last facts. For a request under about 30 seconds
  (such as 20 seconds per point), say before the card that a sung song keeps its
  ending only at about 30 seconds or more, write lyrics that fit about 30
  seconds, send `duration_seconds: 30`, and write "about 30 seconds" on the
  card's Work line. Cut afterwards with `beatra.audio.process` `trim` (a paid call at the live `audio_process` price, on its own card with its own `client_request_id`) only when
  the teacher accepts losing the end. Without the music tools, or when the
  teacher names no length, write length only in the prompt and do not add a
  duration argument. Read the actual returned duration either way.
- Put style only in `prompt`. Put the lyric body only in `lyrics`.

## Confirm the first song, then the set

Before any billable track, call `beatra.models.list` with
`{"capability":"text_to_music"}` and read the `suno-6` entry's `pricing`.
Show one current generate production card for the first knowledge-point
song and wait:

1. Work — one exam mnemonic song for the named knowledge point, a
   generate call (`beatra.music.generate`).
2. Credits — the live `suno-6` price just read from `beatra.models.list`,
   per slot and in total. Do not reuse a remembered number.
3. Count — one paid call for this first song. Do not batch the rest of
   the syllabus into this submit.
4. Identity — one new opaque `client_request_id`. A changed lyric,
   prompt, title, length, or model mints a new ID.
5. If we stop here — the labeled lyric sheet remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Translate the prose; keep the URL. Do not retry
   until the teacher says they have topped up.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes, actual duration, and
`billing.net_charged_credits`.

After that first song is accepted, when this account has the music tools,
suggest saving its singer so later songs aim for the same singer:
`beatra.music.edit` with `operation: "create_persona"` on that song (a paid call at the live `music_persona` price from `beatra.models.list`, on its own card with its own `client_request_id`; save it once and reuse the returned `persona_id`), from a song whose `editable` field is `{"native": true}` (a song
cut to a requested length is not). Take the vocal window (`vocal_start_ms` and
`vocal_end_ms`, 10 to 30 seconds) from the song's lyric timing when one exists;
otherwise ask where the first verse starts. Each later song of the set then
carries the returned `persona_id`; keep it in the conversation. The voice stays
close, not identical: ask the user to listen across the set. See
[music editing and audio](references/music-editing-and-audio.md).

Remaining knowledge points are a new pack. Show a fresh six-field card for that
frozen set and wait:

1. Work — one exam mnemonic song per remaining named knowledge point,
   each a generate call (`beatra.music.generate`).
2. Credits — the live `suno-6` price just read from `beatra.models.list`,
   per slot and in total. Do not reuse a remembered number.
3. Count — one paid call per remaining slot. Do not batch slots into
   one submit.
4. Identity — one new opaque `client_request_id` per slot. A changed
   lyric, prompt, title, length, model, or persona mints a new ID for the
   changed slots.
5. If we stop here — the first accepted song and the remaining lyric
   sheets remain usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Do not retry until the teacher says they have
   topped up.

Do not treat acceptance of the first song as approval of the rest.

## Review, deliver, and recover

Review the sung lyric against the must-keep fact list. Report only
what the host can actually hear. Do not promise perfect diction or exact
seconds: with the music tools a sung song lands within about 10% of the
length sent; without them the length is direction in the prompt.

After the user chooses a take, and when this account has the music tools,
offer lyric timing for each song of the set (an LRC file for lyric players and
an SRT file for subtitles), and a song video (MP4) as an option. Each is its own
paid call with its live price from `beatra.models.list` and its own
`client_request_id`. A set of songs may share one six-field pack card with one
line and one `client_request_id` per song; keep a separate card for any later
paid step, and never put either on a song's generate card. Both need a song that
was not cut to a length (its `editable` field is `{"native": true}`; see
[music editing and audio](references/music-editing-and-audio.md)).

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the teacher asks.

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
printf '%s' '{"model":"suno-6","prompt":"Clear-diction mnemonic song, moderate tempo, memorable hook, about two minutes.","lyrics":"[Verse 1]\nApproved mnemonic lines\n[Chorus]\nApproved hook","instrumental":false,"title":"Knowledge Point Hook","model_options":{"suno":{"custom_mode":true}},"client_request_id":"opaque-exam-song-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- For lyric sheets, payloads, and recovery, read
  [Exam mnemonic workflow](references/workflow.md).
- For the length field, a saved singer, and the extra files after a song is
  chosen, read [music editing and audio](references/music-editing-and-audio.md).
- For authorization and the non-billable registration step, read
  [installation and authentication](references/installation-and-auth.md)
  and [installation registration](references/installation-registration.md).
- For shared task, billing, and connection details, read [tasks and
  results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [Bundled MCP
  Client diagnostics](references/mcp-connection.md).
- Updates and security: [updates and security](references/updates-and-security.md)
- For removal, read [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
