# Short-video BGM workflow

## Build the music card

Write the card before any paid call. Capture:

- **Use and destination** — short-video post, vlog, product clip, tutorial,
  livestream or store loop, podcast intro, slideshow recap.
- **Mood and genre** — the feeling first, then a genre that carries it.
- **Tempo feel** — a BPM feel rather than a strict grid, plus how busy the
  rhythm should be.
- **Instrumentation** — the two or three instruments that define the sound.
- **Energy arc** — where it starts, where it lifts, and how it ends.
- **Length and narration** — the intended length, and whether a voice sits on
  top.
- **Avoid list** — what must not appear, such as vocals, heavy drums, or an
  abrupt ending.

Then write one positive prompt that carries genre, mood, tempo feel,
instrumentation, structure, and intended use as a single coherent direction.
Keep lyrics absent.

## Submit one instrumental request

```json
{
  "model": "suno-5.5",
  "prompt": "Calm skincare product BGM, modern ambient pop, calm-to-luminous arc, 92 BPM feel, felt piano, airy pads and a muted electronic pulse, space for narration, gentle lift at the midpoint, clean resolved ending, polished wide mix",
  "instrumental": true,
  "title": "Quiet Radiance",
  "client_request_id": "opaque-bgm-id"
}
```

Set `model: "suno-5.5"` for ordinary generation. Never omit the model and never
silently use `auto`; pass a different model only when the user names one, and
never substitute one silently. Model-specific options are accepted only when the
returned interface card documents them; never move an option between model
families or silently drop one. The flagship example, valid only while discovery
advertises it:

```json
{
  "model": "suno-5.5",
  "prompt": "Upbeat unboxing clip BGM, bright indie electronic, steady forward pulse, plucked synth and clean percussion, quick lift at the reveal, tidy ending",
  "instrumental": true,
  "title": "Open It Up",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "negative_tags": "no vocals, no heavy drums, no cinematic impacts, no abrupt ending",
      "style_weight": 0.72,
      "weirdness_constraint": 0.18
    }
  },
  "client_request_id": "opaque-bgm-unboxing-id"
}
```

Call `beatra.models.list` with the text-to-music capability — or with the
reference-audio-to-music capability when a reference recording is supplied —
before quoting compatibility, controls, price, or an input limit. Music
generation is one billable asynchronous request.

## Length, loops, and narration space

Requested length, a loop-friendly arrangement, space for narration, and where
the energy lifts are all arrangement direction inside the prompt, not dedicated
controls. A lift is placed relative to the shape of the track — an opening, a
midpoint, a final section — and is not a hit landed on a named timecode; align
the cut to the returned audio rather than expecting the audio to hit a mark. Ask for a
loop-friendly arrangement rather than a sample-perfect loop point, and treat the
requested length as guidance whose final timing may still need trimming in the
user's editor. "Space for narration" shapes the arrangement; it is not automatic
sidechain or dialogue mixing.

Read the actual returned duration from the terminal task and compare it with the
intended length before delivering, so the user learns the real number rather
than the requested one.

## Guide from a reference recording

A reference-guided request is a different route with its own admission rules,
and the default instrumental setting is the thing most likely to be rejected on
it. Before promising anything or freezing a payload, read that route's card:

```text
printf '%s' '{"capability":"reference_audio_to_music"}' | python3 scripts/mcp_client.py call beatra.models.list
```

The current reference route rejects `instrumental: true`, so an instrumental bed
guided by a reference needs an explicit model family whose live card
affirmatively admits a reference plus an instrumental request. Confirm from that
card that it admits the reference's actual MIME type, duration, and byte size as
well. If no current card admits the whole combination, stop before the paid call
and offer the smallest compatible change — a text-only instrumental brief that
describes the reference, or a vocal-permitted route — rather than submitting a
request the route refuses.

For a local reference, upload it once through the bundled client:

```text
python3 scripts/mcp_client.py upload ./reference.mp3 --mime-type audio/mpeg
```

Use its returned artifact as `reference_audio`, and state in the prompt what
musical qualities should guide the new track and what should change. Respect the
general 100 MB upload ceiling plus any lower current model-specific limit. Keep
this as musical direction: do not promise that melody, arrangement, or identity
carries over exactly.

The bundled MCP music route does not accept REST-only `callback_url`,
`callback_signing_key_id`, or `metadata`. Do not add them or reach for another
transport to obtain them.

## Confirm, submit, and recover

Finalize the complete prompt, instrumental status, title, model, reference, and
accepted model options before creating the stable `client_request_id`. Show the
frozen payload and the current maximum charge, then submit
`beatra.music.generate` exactly once and poll the same task.

Keep a private ledger row: logical label, full frozen arguments, stable request
ID, approval, creation time, create response, task ID, and terminal result. An
identical retry preserves every validated argument; any accepted change is new
paid work with a new identity and a fresh confirmation.

If the create response is lost, retry only the identical frozen payload with the
same ID. If the task ID is lost, call `beatra.tasks.list`, call
`beatra.tasks.get` on plausible candidates, and match returned facts against the
ledger; an ambiguous match stops submission. If the request ID itself is lost,
do not invent a new one and do not replay: attempt task recovery and stop if the
original cannot be identified.

Cancel only at the user's request. Call `beatra.tasks.cancel` once and confirm a
terminal state with `beatra.tasks.get`. On `409`, keep polling the same task.

## Deliver and review real results

Deliver every returned clip in order. Include the returned title when present
plus each audio URL or artifact ID, duration, MIME type, and size, and report
the resolved model, actual usage, and `billing.net_charged_credits`.

Review against the music card only to the extent the host Agent can actually
play the audio. Check genre and mood match, tempo feel, whether the arc lifts
and resolves where the card asked, whether the mix leaves room for a voice, and
the real duration against the intended length. Do not claim to have judged
composition, arrangement, or mix when the host cannot hear the file — say so
instead.

When one focused revision would help, name the single largest gap, turn it into
one changed direction, and wait for a new paid approval.
