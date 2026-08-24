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
  "model": "suno-5.5",
  "prompt": "Low-distraction livestream waiting bed, warm ambient pop, loop-friendly, space for host talk, about 90 seconds, no vocals, no sudden hits",
  "instrumental": true,
  "title": "Waiting Bed 01",
  "client_request_id": "opaque-live-waiting-01"
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
