# Indie game OST workflow

## Slot list

Default 10-slot pack when the user does not name a count:

1. Title / menu
2. Explore / overworld
3. Battle / tension
4. Shop / hub
5. Victory / clear
6. Game-over / fail
7. Quiet rest
8. Puzzle / focus
9. Boss rise
10. Credits / theme reprise

Each slot needs a use, mood, tempo feel, two or three instruments, energy
arc, intended length, and an avoid list (vocals, sudden hits, lyric-like
hooks). Write one positive instrumental prompt per slot.

## Submit one slot

```json
{
  "model": "suno-6",
  "prompt": "Indie game explore bed, warm acoustic fantasy, loop-friendly, about 90 seconds, no vocals, no sudden hits",
  "instrumental": true,
  "title": "Explore 01",
  "duration_seconds": 90,
  "client_request_id": "opaque-game-explore-01"
}
```

Call `beatra.models.list` with `{"capability":"text_to_music"}` before
quoting price or limits. Confirm the pack estimate, then submit each slot
exactly once. A revision replaces one slot with a new request ID.

Length is a control when this account has the music tools. Run the client's
`tools` command once per conversation: the tools are there when it lists
`beatra.music.edit` and `beatra.audio.process` (see
[music editing and audio](music-editing-and-audio.md)). Then send
`duration_seconds` for each slot's intended length (10 at the least, and 30 or
more for a track that loops or that the engine repeats; a shorter sting is asked
at 10 and cut with `beatra.audio.process` `trim`). Without the tools, drop it and
write the length in the prompt.

A bed that must run longer than one generation, or loop in the engine, is
generated once and then finished with one `beatra.audio.process` call per bed,
one at a time, with `format: "ogg"`, which game engines read. Finish the first
take of each slot; list the other take as that slot's alternative, which the user
can ask to have finished the same way (one more paid finishing call, on its own card). The finished files are the pack;
list the raw takes after them. When the engine repeats the file, send
`operation: "loop"` with `loop_count` (the whole number of repeats closest to the
target) instead of `target_duration_ms`, with `end_with_fade: false`: the file
then ends where its loop window ends, so the engine's restart joins the same two
points as the repeats inside it, only without the crossfade. Report the real
length. A bed that is already long enough and only repeats in the engine
needs just `convert_format` to `ogg`. A bed that must run longer as one file is
`operation: "loop"` with `target_duration_ms` set to the target length. Each of these calls is paid at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`): they finish what the user already asked for (each track's length, its loop, and an OGG file for the engine), so the pack card lists each one as its own line beside the slot it finishes, with that price and its own `client_request_id`. Run them one at a time once that slot is delivered.
Report the loop's seam in plain words ("how smoothly it joins where it repeats:
0.91 out of 1, higher is smoother"), acting on a low seam as the shared
reference says; how clean the engine's restart sounds is for the user to hear in
the engine.

For adaptive music, a finished bed can be split into six stems (vocals, drums,
bass, guitar, piano, other): `beatra.audio.process` with `operation:
"separate_stems"` and `mode: "multi_stem"`. It is paid: read the live price from
`beatra.models.list` with the `audio_stem_separation` capability (the pricing option whose `dimensions` carry `stem_mode` `multi_stem`, or the option without `dimensions` when no option names that mode), show one card
per bed, and use one `client_request_id` per bed. Say that a little of one part
can still be heard faintly in another, which is normal. An instrumental bed's
vocals stem is near silent, and strings, synths, pads and chiptune leads land in
the "other" stem. Stems come back in the split's own format, not OGG. When the engine needs OGG, convert each one with `convert_format`: one paid `audio_process` call per stem, each listed as its own line on the split's card.

Read the actual returned duration. Do not promise a sample-perfect loop point or
platform takedown safety, and without the tools do not promise exact seconds
either. Public ownership language stays in SEO; Agent review reports the real
audio only.
