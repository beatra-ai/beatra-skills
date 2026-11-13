# Livestream playlist workflow

## Slot list

Default 12-slot pack when the user does not name a count:

1. Waiting / starting soon
2. Chat and low talk
3. Product talk
4. Hype / drop
5. Night / late shift
6. Reset / after a sale
7. Soft brand bed
8. Fast browse
9. Gift / interaction
10. Store-floor loop
11. Break / holding
12. Close / thank-you

Each slot needs a use, mood, tempo feel, two or three instruments, energy
arc, intended length, and an avoid list (vocals, sudden hits, lyric-like
hooks). Write one positive instrumental prompt per slot.

## Submit one slot

```json
{
  "model": "suno-6",
  "prompt": "Low-distraction livestream waiting bed, warm ambient pop, loop-friendly, space for host talk, about 90 seconds, no vocals, no sudden hits",
  "instrumental": true,
  "title": "Waiting Bed 01",
  "duration_seconds": 90,
  "client_request_id": "opaque-live-waiting-01"
}
```

Call `beatra.models.list` with `{"capability":"text_to_music"}` before
quoting price or limits. Confirm the pack estimate, then submit each slot
exactly once. A revision replaces one slot with a new request ID.

Length is a control when this account has the music tools. Run the client's
`tools` command once per conversation: the tools are there when it lists
`beatra.music.edit` and `beatra.audio.process` (see
[music editing and audio](music-editing-and-audio.md)). Then send each slot's
intended length as `duration_seconds`, from 30 to 120 seconds (30 for a shorter
slot, 120 for a longer one), and finish each delivered bed with one
`beatra.audio.process` call per slot, one at a time, so the pack plays at one
level. Finish the first take of each slot; list the other take as that slot's
alternative, which the user can ask to have finished the same way (one more paid finishing call, on its own card). The
finished files are the pack; list the raw takes after them. `operation: "loop"`
with `target_duration_ms` set to the slot's length when the slot is clearly
longer than the bed (more than about 10%, as for a slot over 120 seconds); a bed
within about 10% of its slot keeps its real length: run `normalize_loudness` and
report the difference; `operation: "trim"` with `target_duration_ms` when the
bed is longer than a slot that is under 30 seconds or that needs its exact
second. Send `loudness_lufs: -14` in each of these calls. Each of these calls is paid at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`): they finish what the user already asked for (each slot's length and one level across the pack), so the pack card lists each one as its own line beside the slot it finishes, with that price and its own `client_request_id`. Run them one at a time once that slot is delivered. Report each slot's real
length, the seam of a loop in plain words ("how smoothly it joins where it
repeats: 0.91 out of 1, higher is smoother"), and the measured loudness in plain
words ("all beds at about −14 LUFS, the level most streaming platforms play at")
rather than the target, acting on a low seam as the shared reference says.
Without the tools, drop `duration_seconds`, write the length in the prompt, ask
for a loop-friendly arrangement, and skip the loop and level calls.

Read the actual returned duration. Do not promise a sample-perfect loop point or
platform takedown safety, and without the tools do not promise exact seconds
either. Public ownership language stays in SEO; Agent review reports the real
audio only.
