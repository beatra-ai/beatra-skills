# Exam mnemonic workflow

## Build the lyric sheet

Record only teacher-supplied facts. Separate exam name, knowledge-point
title, must-keep lines, language, genre, mood, and vocal direction. A
missing fact stays a named gap. Do not fill it from a remembered
outline, a nearby topic, or a model guess.

Default plan: one sung mnemonic for the first named knowledge point.
A syllabus list is a later pack, not the first submit.

## Read the live model card

Call `beatra.models.list` with `text_to_music` before choosing model,
lyrics length, title length, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_music"}
```

Keep `model: "suno-5.5"`, `instrumental: false`, and
`model_options.suno.custom_mode: true`. Confirm live prompt, lyrics,
and title character limits. Put style only in `prompt`. Put the lyric
body only in `lyrics`. There is no `duration` field.

## Freeze and submit the first song

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id`. Submit once:

```text
printf '%s' '{
  "model":"suno-5.5",
  "prompt":"Clear-diction mnemonic song, moderate tempo, memorable hook, about two minutes.",
  "lyrics":"[Verse 1]\nApproved mnemonic lines\n[Chorus]\nApproved hook",
  "instrumental":false,
  "title":"Knowledge Point Hook",
  "model_options":{"suno":{"custom_mode":true}},
  "client_request_id":"opaque-exam-song-01"
}' | python3 scripts/mcp_client.py call beatra.music.generate
```

A changed lyric, must-keep fact, title, prompt, or model is new work:
new card, new ID. Keep at most two generate tasks in flight.

After the first song is accepted, remaining knowledge points use the
same payload shape. Show a fresh six-field pack card: live
`text_to_music` price times remaining slot count, one paid call per
slot, one new `client_request_id` per slot. Do not reuse the
first-song ID. Do not treat the first-song card as pack approval.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the teacher asks, then wait for a terminal state.

Review audible lyrics against the must-keep fact list. Report unread
or unclear lines as unread. Do not treat the song as an official exam
outline.
