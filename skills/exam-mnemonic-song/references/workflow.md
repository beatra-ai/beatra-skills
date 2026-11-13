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

Keep `model: "suno-6"`, `instrumental: false`, and
`model_options.suno.custom_mode: true`. Confirm live prompt, lyrics,
and title character limits. Put style only in `prompt`. Put the lyric
body only in `lyrics`. Send `duration_seconds` only when this account has the
music tools and the teacher names a length (the client's `tools` command lists
`beatra.music.edit` and `beatra.audio.process`; see
[music editing and audio](music-editing-and-audio.md)): 30 or more that the
lyrics fit, without `duration_fit`, because a shorter target or `exact` cuts the
singing at the target. For a request under about 30 seconds (such as 20 seconds
per point), say before the card that a sung song keeps its ending only at about
30 seconds or more, write lyrics that fit about 30 seconds, send
`duration_seconds: 30`, and write "about 30 seconds" on the card's Work line.
Without the music tools, or when the teacher names no length, there is no
duration argument and the length stays in the prompt; never promise exact
seconds there.

## Freeze and submit the first song

Show the six-field production card from the root before the first
billable generate. After approval, mint one opaque
`client_request_id`. Submit once:

```text
printf '%s' '{
  "model":"suno-6",
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

After the first song is accepted, when this account has the music tools,
suggest saving its singer: one `beatra.music.edit` call with
`operation: "create_persona"`, the song's artifact as `source`, a
`persona_name`, and a `persona_description` of what the singer sounds like
(a paid call at the live `music_persona` price from `beatra.models.list`, on its own card with its own `client_request_id`; save it once and reuse the returned `persona_id`). The vocal window (`vocal_start_ms` and
`vocal_end_ms`, 10 to 30 seconds) comes from the song's lyric timing when one
exists; otherwise ask where the first verse starts. The song's `editable` field
must be `{"native": true}`; a song cut to a requested length is not. The returned
`persona_id` goes into every later song of the set as `persona_id`, so later songs
aim for the same singer; the voice stays close, not identical, so ask the user to
listen across the set. Keep the ID in the conversation.

Remaining knowledge points use the same payload shape, plus `persona_id` when a
persona was saved. Show a fresh six-field pack card: live
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

When this account has the music tools, after each song is chosen, the extra
files are optional and each is its own paid call, and only for a song whose
`editable` field is `{"native": true}`. Lyric timing is the default offer:
`beatra.music.edit` with `operation: "deliverable"` and `kind: "lyrics_timing"`
returns an LRC file and an SRT file; read its live price from
`beatra.models.list` with the `music_lyrics_timing` capability. A song video
(MP4) is the optional one:
`kind: "video_mp4"` (capability `music_video`), where `video_options.author` and
`video_options.brand_text` may carry the teacher's or school's name, in the
words the user gave. Never put
either on the song's card, and give each song its own `client_request_id`. A set
of songs may share one six-field pack card with one line per song; keep a
separate card for any later paid step.
