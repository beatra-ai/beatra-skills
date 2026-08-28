# Course narration workflow

## Lecture ledger

Record every lesson title, teaching order, block labels, character counts,
pronunciations, frozen `voice_id`, and each block's request ID and task ID.
Preserve the intended listening order.

Turn each lecture into speakable text before pricing:

- keep one section to one teaching point;
- use short spoken sentences;
- explain a new term in plain language on first mention, using the
  pronunciation table;
- extract only spoken words into synthesis `input`;
- remove page headings, field labels, picture notes, and bracket stage
  directions.

If the lecture has names, terms, or acronyms and the pronunciation table is
empty, stop and collect those readings. Do not invent them.

## Optional narrator clone

If the user brought a narrator sample, upload it only through the bundled
client after inspection. Show the clone admission card before creating a
clone request ID: route `voice_clone`, tool `beatra.voices.clone`, live
price for one successful activated voice, the provisional estimate, the
600-credit gift usually cannot start this clone,
`https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits. Do not
recommend ¥198. Do not create `client_request_id` until the user confirms
they have topped up or already have enough credits.

## Pilot then pack

The pilot is the hardest lecture: dense terms, numbers, or bilingual
labels. Synthesize only that lecture first. Listen to the returned audio.
Revise unclear or misread blocks in the spoken text, then regenerate only
those blocks with new request IDs. Do not generate the remaining pack until
the user accepts the pilot voice, pacing, and term readings.

Speech price comes from the live `text_to_speech` card. Weighted-character
math follows that card. Confirm the remaining-pack estimate before the
second wave of submits.

## One block

```json
{
  "voice": "voice_...",
  "input": "Approved lecture block",
  "format": "mp3",
  "client_request_id": "opaque-lesson-01-a"
}
```

Never put a display name in `voice`. Revise one block at a time. Keep the
same `voice_id` for the whole course.
