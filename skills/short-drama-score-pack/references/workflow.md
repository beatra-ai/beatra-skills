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
  "model": "suno-5.5",
  "prompt": "Vertical short-drama tension bed, low strings, room for dialogue, about 45 seconds, no vocals, no sudden hits",
  "instrumental": true,
  "title": "Tension 01",
  "client_request_id": "opaque-drama-tension-01"
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
