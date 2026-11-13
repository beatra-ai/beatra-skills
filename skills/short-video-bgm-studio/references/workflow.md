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
  "model": "suno-6",
  "prompt": "Calm skincare product BGM, modern ambient pop, calm-to-luminous arc, 92 BPM feel, felt piano, airy pads and a muted electronic pulse, space for narration, gentle lift at the midpoint, clean resolved ending, polished wide mix",
  "instrumental": true,
  "title": "Quiet Radiance",
  "duration_seconds": 30,
  "client_request_id": "opaque-bgm-id"
}
```

Send `duration_seconds` only when this account has the music tools and the
request has no reference recording (see "Length, loops, and narration space");
otherwise drop it and write the length in the prompt instead.

Set `model: "suno-6"` for ordinary generation. Never omit the model and never
silently use `auto`; pass a different model only when the user names one, and
never substitute one silently. Model-specific options are accepted only when the
returned interface card documents them; never move an option between model
families or silently drop one. The flagship example, valid only while discovery
advertises it:

```json
{
  "model": "suno-6",
  "prompt": "Upbeat unboxing clip BGM, bright indie electronic, steady forward pulse, plucked synth and clean percussion, quick lift at the reveal, tidy ending",
  "instrumental": true,
  "title": "Open It Up",
  "duration_seconds": 30,
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

Call `beatra.models.list` with `{"capability":"text_to_music"}` — or with
`{"capability":"reference_audio_to_music"}` when a reference recording is
supplied — before every production card. Read the `pricing` of the chosen
model's entry (`suno-6` unless the user named another eligible model) and
show those credits on the card per slot and in total. When the card lists a
cut or a loop, also read `{"capability":"audio_process"}` and count each one
in that total. Never a remembered number. Music generation is one billable
asynchronous request.

## Length, loops, and narration space

Space for narration and where the energy lifts are arrangement direction inside
the prompt, not dedicated controls. A lift is placed relative to the shape of the
track — an opening, a midpoint, a final section — and is not a hit landed on a
named timecode; align the cut to the returned audio rather than expecting the
audio to hit a mark. "Space for narration" shapes the arrangement; it is not
automatic sidechain or dialogue mixing.

Length is a control when this account has the music tools. Run the client's
`tools` command once per conversation: the tools are there when it lists
`beatra.music.edit` and `beatra.audio.process` (see
[music editing and audio](music-editing-and-audio.md)). Then send
`duration_seconds` for the length the user gave, or 30 when they gave less (a
15-second ad is generated at 30; not with a reference recording: fit a
reference-guided track afterwards with `trim` or `loop`), and leave out
`duration_fit`, so the uncut take keeps its written ending and can still get a
WAV version. After the user chooses a take, cut it to the user's length with one
`beatra.audio.process` call: `operation: "trim"`, `start_ms` 0 unless the user
names another start, `target_duration_ms`, and a short `fade_out_ms`: a paid call at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`), listed on the track's card as its own line with its own `client_request_id`. Deliver the cut beside the uncut take: the cut is exact
and ends on a short fade, and the uncut take keeps its written ending. A take
that already falls short of the length keeps its real length: say the
difference. Without the tools, the length is direction in the prompt, and its
final timing may still need trimming in the user's editor.

A bed that must run clearly longer than one generation (more than about 10% over
the take), or loop cleanly under a long scene, is generated once and then
lengthened: one `beatra.audio.process` call with `operation: "loop"` and
`target_duration_ms` set to the target length. It is a paid call at the live `audio_process` price with its own `client_request_id`, listed on the track's card as its own line when the user asked for that length together with the track, otherwise on its own card. When a player repeats
the file itself (a store or livestream loop), send `loop_count` with
`end_with_fade: false` instead, as the shared reference says. A bed within about
10% of its target keeps its real length: report the difference. Report the real
length and the loop's seam in plain words ("how smoothly it joins where it
repeats: 0.91 out of 1, higher is smoother"), act on a low seam as the shared
reference says, and never promise an inaudible seam. Without the tools, ask for
a loop-friendly arrangement rather than a sample-perfect loop point.

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

Finalize the complete prompt, instrumental status, title, length, model,
reference, and accepted model options before creating the stable
`client_request_id` for the generation and one for each cut or loop listed.
Show the frozen payload and the current maximum charge, with any cut or loop on
the same card as its own line at its live `audio_process` price and its own
`client_request_id`, then submit
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

When this account has the music tools, after the user chooses a take, the WAV
version is the optional extra file: one `beatra.music.edit` call with
`operation: "deliverable"` and `kind: "wav"`, priced from `beatra.models.list`
with the `music_wav` capability, on its own card and with its own
`client_request_id`. Offer it; never run it without that card. Make it from the
whole take, never from a cut or loop; the uncut take stays native after its cut,
so the WAV can still be made from it. Then cut or loop the WAV itself: a `trim`
keeps it WAV; for a `loop`, send `format: "wav"`, or the result comes back as
FLAC. Only a file that is already cut or looped (its `editable` field is not
`{"native": true}`) cannot get a WAV version; `operation: "convert_format"` with
`format: "wav"` gives a WAV file of the same audio at the live `audio_process` price, and the user
should know it is not a higher-quality version. See
[music editing and audio](music-editing-and-audio.md).
