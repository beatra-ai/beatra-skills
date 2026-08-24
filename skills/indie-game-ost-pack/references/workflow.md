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
  "model": "suno-5.5",
  "prompt": "Indie game explore bed, warm acoustic fantasy, loop-friendly, about 90 seconds, no vocals, no sudden hits",
  "instrumental": true,
  "title": "Explore 01",
  "client_request_id": "opaque-game-explore-01"
}
```

Call `beatra.models.list` with `{"capability":"text_to_music"}` before
quoting price or limits. Confirm the pack estimate, then submit each slot
exactly once. A revision replaces one slot with a new request ID.

There is no `duration` field on `beatra.music.generate`. Loop friendliness
and requested length are prompt direction. Read the actual returned
duration. Do not promise a sample-perfect loop point, exact seconds, or
platform takedown safety. Public ownership language stays in SEO; Agent
review reports the real audio only.
