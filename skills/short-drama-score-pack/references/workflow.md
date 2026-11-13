# Short-drama score workflow

## Slot list

Default 10-slot pack when the user does not name a count:

1. Tension / suspicion
2. Romance / soft look
3. Comedy / light tease
4. Tearjerker / goodbye
5. Chase / hurry
6. Reveal / twist
7. Reunion
8. Night walk
9. Cliffhanger sting
10. End-card / next episode

Each slot needs a use, mood, tempo feel, two or three instruments, energy
arc, intended length, and an avoid list (vocals, sudden hits, lyric-like
hooks that fight dialogue). Write one positive instrumental prompt per
slot.

## Submit one slot

```json
{
  "model": "suno-6",
  "prompt": "Vertical short-drama tension bed, low strings, room for dialogue, about 90 seconds, no vocals, no sudden hits",
  "instrumental": true,
  "title": "Tension 01",
  "duration_seconds": 90,
  "client_request_id": "opaque-drama-tension-01"
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
slot, 120 for a longer one), and finish each delivered bed for its cue with one
`beatra.audio.process` call per slot, one at a time, so the score plays at one
level. Finish the first take of each slot; list the other take as that slot's
alternative, which the user can ask to have finished the same way (one more paid finishing call, on its own card). The
finished files are the pack; list the raw takes after them. `operation: "loop"`
with `target_duration_ms` set to the slot's length when the slot is clearly
longer than the bed (more than about 10%, as for a slot over 120 seconds); a bed
within about 10% of its slot keeps its real length: run `normalize_loudness` and
report the difference; `operation: "trim"` with `target_duration_ms` when the
bed is longer than a slot that is under 30 seconds or that needs its exact
second. Send `fade_in_ms: 300`, `fade_out_ms: 1500`, and `loudness_lufs: -14` in
each of these calls. The two fade lengths are short arrangement defaults for a
cut; name them to the user and change them when asked. Each of these calls is paid at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`): they finish what the user already asked for (each slot's length and one level across the score), so the pack card lists each one as its own line beside the slot it finishes, with that price and its own `client_request_id`. Run them one at a time once that slot is delivered. Report each slot's real
length, the seam of a loop in plain words ("how smoothly it joins where it
repeats: 0.91 out of 1, higher is smoother"), and the measured loudness in plain
words ("all beds at about −14 LUFS, the level most streaming platforms play at")
rather than the target, acting on a low seam as the shared reference says.
Without the tools, drop `duration_seconds`, write the length in the prompt (for
example "about 45 seconds"), ask for a loop-friendly arrangement, and skip the
finishing calls.

Read the actual returned duration. Do not promise a sample-perfect loop point or
platform takedown safety, and without the tools do not promise exact seconds
either. Public ownership language stays in SEO; Agent review reports the real
audio only.
