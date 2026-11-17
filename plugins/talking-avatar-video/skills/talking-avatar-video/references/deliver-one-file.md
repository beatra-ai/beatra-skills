# Deliver one file

Use this when one request produces several video clips: a lesson longer than
one talking-avatar clip, a multi-shot ad, a video with its own music and
narration. The user gets one finished video. The clips are working material.

## Plan

1. Before the first paid call, say how many clips and roughly how many
   seconds the plan has, and that they will be joined into one video.
2. Put the join on the same card as the clips (see
   [Price a whole job](price-a-whole-job.md)). The join is its own paid line:
   read its price from `beatra.models.list` with
   `{"capability": "video_compose"}`. It has its own `client_request_id`.
3. One join takes a limited number of clips and seconds. The clip count is
   `maxItems` of `clips` in the tool's input schema; the total length is capped
   too (120 seconds today, and a refusal names the live cap). A plan above them
   becomes several joined videos in order: say how many before the first paid
   call, and that they stay separate files.

## Join

When every planned clip has succeeded, call `beatra.videos.compose` once, with
the clips in story order:

```json
{
  "clips": [
    {"source": {"type": "artifact", "artifact_id": "<clip 1>"}, "end": 11.6, "keep_audio": true},
    {"source": {"type": "artifact", "artifact_id": "<clip 2>"}, "end": 13.2, "keep_audio": true}
  ],
  "canvas": "9:16",
  "client_request_id": "<new opaque id>"
}
```

- `clips[].source` is `{"type":"artifact","artifact_id":"..."}`. Each clip
  takes optional `start` and `end` in seconds. A talking-avatar clip is often
  longer than its speech: set `end` to the speech end (`speech_end_seconds`
  of that clip's narration, plus about 0.3 seconds, but never past the clip's
  returned duration, which can be a little under the requested one; the join
  refuses an `end` beyond it) so the joined video has no silent pause between
  clips.
- Set `keep_audio: true` on a lip-synced clip or a clip whose own sound
  matters. Other clips are muted.
- Add `narration` only for a voice that runs over muted clips. It may not run
  longer than the clips, so plan clip lengths that fit the narration before
  the card.
- Add `music` as `{"source": {"type": "artifact", "artifact_id": "..."}, "volume": 0.25}`
  only when planned. Music dips under speech by itself, stops at the end of
  the video, and fades out, so a longer track is fine. Lower `volume` (0.1 to
  0.2) under a presenter who talks throughout. A song generation usually
  returns two versions: use version 1 unless the user picked the other, and at
  delivery say which one is under the video and that the other is kept.
- Add `subtitles` (`{start, end, text}`, at most 80 characters each) only when
  the user wants burned-in captions.
- Narration made through Beatra comes with free `SRT` and `VTT` files.
  Narration laid under muted clips already matches the joined video. Narration
  that drives each clip has one set per clip: write one `SRT` and one `VTT`
  for the whole video by keeping each clip's cues between its `start` and
  `end`, then shifting them by the total trimmed length (`end` minus `start`)
  of the clips before it, minus that clip's own `start`.
- Pick the `canvas` that matches the clips: `9:16`, `16:9`, `1:1`, or `3:4`.

## Delivery

Lead with the joined video, then its format, length, size, and the credits
charged, then the clips as backup links. Say it in plain words; keep IDs and
field names in your notes.

If the join fails, the clips are still there. Tell the user in plain words
what the attempt cost, as the task's billing shows; do not promise a refund it
does not show. Fix what the
error names and ask before joining again; changed arguments get a new
`client_request_id`. If it still fails, hand over the clips in order and say
why they are separate.
