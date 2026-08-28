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

- `model: "suno-5.5"`. Never omit the model and never silently use
  `auto`.
- `instrumental: false` with confirmed lyrics present.
- `model_options.suno.custom_mode: true`.
- There is no `duration` field on `beatra.music.generate`. Write length
  only in the prompt. Do not add a duration argument. Read the actual
  returned duration.
- Put style only in `prompt`. Put the lyric body only in `lyrics`.

## Confirm the first song, then the set

Before any billable track, read the current `beatra.models.list` card
for `text_to_music`. Show one current generate production card for the
first knowledge-point song and wait:

1. Work — one exam mnemonic song for the named knowledge point, a
   generate call (`beatra.music.generate`).
2. Credits — the live `text_to_music` price just read. Do not reuse a
   remembered number.
3. Count — one paid call for this first song. Do not batch the rest of
   the syllabus into this submit.
4. Identity — one new opaque `client_request_id`. A changed lyric,
   prompt, title, or model mints a new ID.
5. If we stop here — the labeled lyric sheet remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the teacher says they have
   topped up. Do not recommend ¥198.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes, actual duration, and
`billing.net_charged_credits`.

After that first song is accepted, remaining knowledge points are a
new pack. Show a fresh six-field card for that frozen set and wait:

1. Work — one exam mnemonic song per remaining named knowledge point,
   each a generate call (`beatra.music.generate`).
2. Credits — the live `text_to_music` price just read, times the
   remaining slot count. Do not reuse a remembered number.
3. Count — one paid call per remaining slot. Do not batch slots into
   one submit.
4. Identity — one new opaque `client_request_id` per slot. A changed
   lyric, prompt, title, or model mints a new ID for the changed slots.
5. If we stop here — the first accepted song and the remaining lyric
   sheets remain usable.
6. If the balance is insufficient — relay the official message and
   `https://console.beatra.ai/wallet?intent=buy` exactly. Do not retry
   until the teacher says they have topped up. Do not recommend ¥198.

Do not treat acceptance of the first song as approval of the rest.

## Review, deliver, and recover

Review the sung lyric against the must-keep fact list. Report only
what the host can actually hear. Do not promise perfect diction or
exact seconds.

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
printf '%s' '{"model":"suno-5.5","prompt":"Clear-diction mnemonic song, moderate tempo, memorable hook, about two minutes.","lyrics":"[Verse 1]\nApproved mnemonic lines\n[Chorus]\nApproved hook","instrumental":false,"title":"Knowledge Point Hook","model_options":{"suno":{"custom_mode":true}},"client_request_id":"opaque-exam-song-01"}' | python3 scripts/mcp_client.py call beatra.music.generate
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For lyric sheets, payloads, and recovery, read
  [Exam mnemonic workflow](references/workflow.md).
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
