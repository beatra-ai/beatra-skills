# Music editing and audio processing

How to set a song's length, keep a singer across songs, revise a track, make
its extra files, and finish or split audio with Beatra. This Skill's own
instructions say which of these steps it uses and when; this file says how to
call them correctly.

## First, check that this account has them

Run the bundled client's `tools` command once per conversation, before the
first music card. These tools and fields exist only when `tools` lists
`beatra.music.edit` and `beatra.audio.process`:

- `beatra.music.generate` fields `duration_seconds`, `duration_fit`,
  `persona_id`, and `references`;
- every `beatra.music.edit` operation;
- every `beatra.audio.process` operation.

When they are not listed, do not send those fields (an older service ignores
them, so the song would not have the length you promised), skip the steps that
need them, and keep the length as direction in the prompt. Only when the user
asked for something these steps would deliver, say in one sentence that this
option is not available yet. Everything else in this Skill works as before.

## Prices and confirmation

Read each price from `beatra.models.list` right before the production card,
with the capability of the step:

| Step | Capability | Charge |
|---|---|---|
| Song or instrumental | `text_to_music` (or `reference_audio_to_music` with `reference_audio`) | per task |
| `music.edit` `extend` | `music_extend` | per task |
| `music.edit` `replace_section` | `music_replace_section` | per task |
| `music.edit` `add_vocals` | `music_add_vocals` | per task |
| `music.edit` `add_instrumental` | `music_add_instrumental` | per task |
| `music.edit` `deliverable` `kind=lyrics_timing` | `music_lyrics_timing` | per task |
| `music.edit` `deliverable` `kind=video_mp4` | `music_video` | per task |
| `music.edit` `deliverable` `kind=wav` | `music_wav` | per task |
| `audio.process` `separate_stems` | `audio_stem_separation` | per task, by `mode` (below) |
| `audio.process` `isolate_voice` | `audio_voice_isolation` | per started minute of input |
| `music.edit` `create_persona` | `music_persona` | per task |
| `music.edit` `deliverable` `kind=cover_image` | `music_cover_image` | per task |
| `audio.process` `trim`, `loop`, `fade`, `normalize_loudness`, `convert_format` | `audio_process` | per task |

A split's price depends on its `mode`: `multi_stem` can cost more than
`two_stem`. The model's `pricing` list holds one option per price: use the
option whose `dimensions` carry the `stem_mode` equal to the `mode` you will
send; when no option names that mode, the option without `dimensions`
applies.

Every step charges, and each is its own paid call. A new song or instrumental
from `beatra.music.generate` follows this Skill's own confirmation rule; for
every edit or audio step, show the production card with the live price and
wait for the user. One approval never covers a chain of paid steps; a pack
card that lists every item with its own `client_request_id` is one approval
only where this Skill says so. When the user asks for a finishing step (a cut,
a loop, a fade, loudness, a format) together with the song or the edit it
follows, list it on that card as its own line with its own live price and
`client_request_id`; the approval then covers exactly the lines on the card.
Count that line in the card's total and in its number of paid calls. It
finishes one take: the one this Skill names, or else the one the user picks
after listening; run it once that take is delivered.
Mention the daily limits (below) only before a batch that would use more than
about half of a daily limit (trim, loop, fade, loudness, and format share
one), or when `daily_limit` arrives.

Every call needs a `client_request_id`: a new one for each new request, and the
same one only to resend exactly the same arguments. Resending the same
arguments with the same ID returns the first task and charges nothing more.

Deliver every step's task the same way as a song: poll the task, report each
output by what it is in the user's words (backing version, vocals, lyric file,
subtitle file; its role says which), real duration or size, MIME type, and URL
or artifact ID, and `billing.net_charged_credits`.

## Length: `duration_seconds` and `duration_fit`

- `duration_seconds` (10–360) asks `beatra.music.generate` for a target length.
  At 30 seconds or longer the result lands within about 10% of it. A target
  under 30 seconds is generated at 30 seconds and trimmed to the target with a
  short fade-out, whatever `duration_fit` says. For under 10 seconds (a sting,
  a logo sound), ask for 10 and cut it with `beatra.audio.process` `trim`.
- For a song with lyrics, a target under 30 seconds or `exact` cuts the
  singing at the target. Send `duration_seconds` of 30 or more that the lyrics
  fit, without `duration_fit`, and cut afterwards with `trim` only when the
  user accepts losing the end.
- For an instrumental, add `duration_fit: "exact"` when the user needs the
  exact length (a 15-second ad, a 30-second slot): the track is trimmed to the target with a short
  fade-out. `"approx"` (the default) keeps the generated length.
- A trimmed track (any target under 30 seconds, or `exact`) can no longer get a
  WAV version, lyric timing, cover art, a video, or a persona (`editable`,
  below). When the user may want one of those, ask for 30 seconds or more
  without `exact`, let them choose the take, make those files from the uncut
  take, and then cut the take and its WAV to the exact length with
  `beatra.audio.process` `trim` (a WAV stays WAV). `trim` takes
  audio only: lyric timing and a video keep the uncut take's timing. A `trim`
  makes a new file and leaves its source as it was, so the uncut take can still
  get those files afterwards.
- `duration_seconds` cannot be combined with `references` or
  `reference_audio`. To score from references or a reference recording and
  still hit a length, generate without `duration_seconds`, then fit the result
  with `beatra.audio.process` `trim` or `loop`.
- Always report the real length from the result
  (`clips[].audio.duration_seconds`). A clip carries
  `requested_duration_seconds` when a target was sent. A `duration_short`
  warning means the song ended more than 3 seconds before the target: say so.
  A result within about 10% of the target keeps its real length. For a larger
  shortfall, offer `extend` for a song, and `loop` only for a background bed:
  a loop restarts the piece from its beginning.
- For a length over 360 seconds, or a background bed that must run for
  minutes, generate a shorter piece and `loop` it (below).

## A singer across songs: personas

- After the user likes a song's voice, `beatra.music.edit`
  `operation: "create_persona"` saves that singer (50 a day per account).
  Saving the same song again returns the same persona and is charged again,
  so reuse the `persona_id` you already have. Send `source` (the song's
  artifact), `persona_name`,
  `persona_description` (what the singer sounds like), optionally
  `persona_style`, and optionally a
  10–30 second vocal window (`vocal_start_ms`, `vocal_end_ms`; default: the
  first 30 seconds, which can be an intro without singing). Take the window
  from the song's lyric timing when one exists; otherwise ask the user where
  the singing starts.
- The result's `persona_id` goes into the next `beatra.music.generate` calls as
  `persona_id`, so later songs aim for the same singer. The voice stays close,
  not identical: ask the user to listen across the set. Keep the ID in the
  conversation.
- A persona can be saved only from a track Beatra generated from text: not from
  a cover of uploaded audio, a track made from audio or video `references`, or
  a track built on an uploaded file. Such a source is refused with
  `persona_source_from_upload`.
- `persona_id` cannot be combined with `references`.

## Revising a track: `beatra.music.edit`

`source` is the track: an artifact from `beatra.music.generate` or from a
previous edit, an uploaded audio file, or a URL. Each call returns the whole new
song as new clips; the original stays as it was.

| Operation | What it does | Fields |
|---|---|---|
| `extend` | Continues the song from `continue_at_ms` (inside the track; default: 1 second before its end) | `prompt`, `lyrics` for the new part (words the user wrote or approved), `title`, `vocal_gender`; `instrumental` for an uploaded song |
| `replace_section` | Rewrites one time range and keeps the rest | `start_ms`, `end_ms` (at least 10 seconds, at most half of the track), `section_lyrics` (required except on an uncut Beatra instrumental: send the range's current lines when only the singing changes), `full_lyrics` (the whole lyric with that range's lines replaced: send it whenever the section's words change, because the default is the track's old lyrics; required when `editable` is not native), `prompt` |
| `add_vocals` | Sings over an instrumental | `lyrics` (required), `prompt`, `vocal_gender` |
| `add_instrumental` | Accompanies a vocal-only track | `prompt` (required: the accompaniment style) |
| `create_persona` | Saves the singer (see above) | `persona_name`, `persona_description`, `persona_style`, vocal window |
| `deliverable` | Makes one extra file (below) | `kind`, `video_options` |

- Send only the fields of the operation you call; another operation's field is
  refused.
- `vocal_gender` is `"m"` or `"f"`. It raises the chance of that voice; it does
  not guarantee it.
- An `extend` cannot be told how long the new part should be: report the
  returned duration as the real length.
- The host cannot hear the audio. Take a section's start and end from the
  song's lyric timing when one exists; otherwise ask the user where it starts
  and ends in minutes and seconds as their player shows it ("chorus 1:05 to
  1:35"), convert that to milliseconds, and name the range you used.
- `add_vocals` and `add_instrumental` always, and `extend` and
  `replace_section` on a track whose `editable` is not native, take a source of
  up to 8 minutes and 200 MB.
- `replace_section` can change the song's length. When it does, the result
  carries a `section_length_changed` warning with the old and new seconds:
  tell the user, because anything cut to the old timing (a video, subtitles)
  needs re-timing.
- Never chain revisions on your own: one revision, listen, then the user
  decides the next. Do not extend a song repeatedly in one go.
- A clip's `editable` field says whether Beatra can work on it natively:
  `{"native": true}` for tracks Beatra generated; `null` for a trimmed track
  (see Length), any `beatra.audio.process` result, an uploaded song, or an
  older track. `extend`, `replace_section`, `add_vocals`,
  and `add_instrumental` also work on `null` tracks. `deliverable` and
  `create_persona` need `{"native": true}`; on any other track they are
  refused with `native_edit_unavailable` and its next step.

### Extra files for a chosen track: `operation: "deliverable"`

Offer these only after the user has chosen a take. One `kind` per call:

| `kind` | Output roles | Use |
|---|---|---|
| `lyrics_timing` | `lrc`, `srt` | Lyric timing for players (LRC) and subtitles for video editors (SRT). Needs a song with vocals; an instrumental is refused with `instrumental_has_no_lyrics`. |
| `cover_image` | `cover` | Extra cover art (50 a day per account). |
| `video_mp4` | `video` | A song video over its cover art (MP4). `video_options.author` and `video_options.brand_text` (up to 50 characters each) are shown in the video. |
| `wav` | `wav` | The WAV version from the music model's own export, for editing or distribution. It is not a mastered mix: never call it mastered. |

For a track with `editable: null` that needs WAV, use `beatra.audio.process`
`operation: "convert_format"`, `format: "wav"` instead. That is a WAV
file of the same audio, not a higher-quality version: say so. To keep both a WAV
version and a cut or loop, make the WAV from the uncut take, never from a cut or
loop, and then cut or loop the WAV: a `trim` keeps it WAV; send `format: "wav"`
with a `loop`, or the result comes back as FLAC.

## Finishing and splitting audio: `beatra.audio.process`

`source` is one audio file: a Beatra track, an upload, or a URL. One call, one
main `operation`. `trim`, `loop`, `fade`, `normalize_loudness`, and
`convert_format` take optional finishing steps in the same call, always applied
in this order: main operation → fade (`fade_in_ms`, `fade_out_ms`, `fade_curve`)
→ loudness (`loudness_lufs`, `true_peak_db`) → format (`format`, `sample_rate`,
`bitrate_kbps`, `channels`); their output has role `main`. `bitrate_kbps` needs
`format` set to `mp3`, `ogg`, or `m4a` in the same call. `isolate_voice` takes
only the format fields, and `separate_stems` only `mode`.

| Operation | What it does | Fields |
|---|---|---|
| `trim` | Keeps a range | `start_ms` (default 0), and `end_ms` or `target_duration_ms`, inside the file (a range or target past its end is refused; use `loop` to make audio longer) |
| `loop` | Repeats a window to a length | `target_duration_ms` (cuts the result at the target) or `loop_count` (2–100: the window plays that many times in all, and the result ends exactly at the window's end); window `loop_start_ms`, `loop_end_ms` (4 seconds to 60 minutes; default: the whole file); `crossfade_ms` (50–3000); `end_with_fade` (default true: a short fade at the end, unless you send `fade_out_ms`, which then sets it) |
| `fade` | Fades in and out | `fade_in_ms`, `fade_out_ms` (0–30000 each), `fade_curve` |
| `normalize_loudness` | Sets integrated loudness | `loudness_lufs` (−30 to −9, default −14), `true_peak_db` (−9 to 0, default −1) |
| `convert_format` | Changes the file format | `format`: `mp3`, `wav`, `ogg`, `flac`, `m4a`, or `ulaw_8k_wav` (8 kHz telephone audio); `sample_rate` (8000, 16000, 22050, 24000, 32000, 44100, or 48000); `bitrate_kbps` (64, 128, 192, 256, or 320; with `format` mp3, ogg, or m4a only; m4a up to 256; ogg varies around it); `channels` |
| `separate_stems` | Splits a song | `mode`: `two_stem` (roles `vocals`, `instrumental`) or `multi_stem` (roles `stem:vocals`, `stem:drums`, `stem:bass`, `stem:guitar`, `stem:piano`, `stem:other`) |
| `isolate_voice` | Removes music and noise behind a voice (output role `voice`) | format fields only |

Limits and what to report:

- `trim`, `loop`, `fade`, `normalize_loudness`, `convert_format`: charged per
  call, sources up to 60 minutes and 300 MB, results up to 60 minutes, 50 calls
  a day per account (failed calls count too), and one at a time (wait for the
  running one with `beatra.tasks.get`). Fade, loudness, and format fields
  sent in the same call add no separate charge.
- A `loop` reports `metrics.seam_score` (0–1; higher is a smoother seam). Say
  it in plain words with the real length ("how smoothly it joins where it
  repeats: 0.91 out of 1, higher is smoother"). As a rule of thumb, below about
  0.85 the seam may be audible: offer a different window or a longer
  `crossfade_ms`. It is `null` when the result is not longer than the window,
  so nothing repeats: for a result shorter than the window, use `trim`.
- When a game engine or player repeats the file itself, send `loop_count` (the
  whole number of repeats closest to the target) instead of
  `target_duration_ms`, with `end_with_fade: false`: the file then ends where
  its loop window ends, so the engine's restart joins the same two points as
  the repeats inside it, only without the crossfade. Report the real length.
- A take made with `duration_seconds` under 30, or with `exact`, already ends on
  a short fade-out, and a loop or a player would repeat that fade at every
  seam. For a bed that will loop or that an engine or player repeats, send
  `duration_seconds` of 30 or more without `duration_fit`, then make its length
  with `loop` or `trim`. When such a take is already cut, end the loop window
  (`loop_end_ms`) before its last 2 seconds.
- Loudness reports the measured `loudness_lufs` and `true_peak_db`; with very
  peaky audio the result can be quieter than the target and
  `metrics.peak_limited` is true. Report the measured values, not the target.
- `separate_stems`: songs up to 10 minutes and 100 MB, 20 a day per account.
  Every split is a new charged task, even of a file split before: when the
  user asks again for stems already delivered in this conversation, offer
  those files instead of splitting again. Stems are separated by a model: say that a
  little of one part can still be heard faintly in another (in a backing
  version, traces of the voice): that is normal for a split. An instrumental's
  `vocals` stem is near silent, and strings, synths, pads, and chiptune leads
  land in the "other" stem (`stem:other`). Stems come back in the split's own
  format: convert each with `convert_format` when another format is needed
  (one paid call per stem).
- `isolate_voice`: up to 2 minutes of audio, charged per started minute; trim a
  longer file first.

## Errors to handle

Tell the user what went wrong in plain words in their language, without tool
or field names. Follow `details.next_step` only when it names a tool this
Skill uses and `tools` lists. Read the reason from `details.reason`; the limits below arrive
with error code `rate_limited`.
After a refusal, change what the next step says before sending again, with a
new `client_request_id` for changed arguments; for the wait-and-retry reasons
below, resend after waiting.

| `details.reason` | What to do |
|---|---|
| `option_not_available` | This option is not available yet: continue without it. |
| `option_not_supported_for_model` | The chosen model does not take these fields: drop them and keep the chosen model, or ask the user before following the next step to a model that takes them. |
| `conflicting_options` | Follow the next step; never drop the user's reference, lyrics, or singer without asking. |
| `invalid_time_range`, `section_too_short`, `section_too_long` | Read the source's duration and send a valid range; the message says which value is wrong (a range past the end, a result under 1 second, a loop window under 4 seconds or over 60 minutes, a crossfade or fades too long). A task can also fail this way when the decoded audio is slightly shorter than its listed duration: end the range a little earlier. |
| `source_not_beatra_music`, `native_edit_unavailable` | The track is not an uncut take Beatra generated. For WAV use `convert_format`. Lyric timing, cover art, a video, and a persona need an uncut take Beatra generated: offer them from one, or say this track cannot get them. |
| `source_wrong_type` | The source is not an audio file: send the song's audio (lyric files and videos are not audio). |
| `persona_source_from_upload`, `persona_not_found` | Use a generated track, or create the persona first. |
| `persona_unavailable` | This take could not be saved as a singer: say so and offer another take. |
| `instrumental_has_no_lyrics`, `lyrics_required` | Use a song with vocals, or ask the user for the lyrics. |
| `audio_too_long`, `audio_too_large` | Use a shorter or smaller file, as the next step says. |
| `output_too_large` | Ask for a shorter result or a compressed format such as mp3. |
| `bitrate_needs_lossy_format`, `bitrate_too_high` | Send `bitrate_kbps` only with mp3, ogg, or m4a, and at most 256 for m4a. |
| `daily_limit` | A daily limit was reached: try again after 00:00 UTC (08:00 Beijing time). |
| `one_at_a_time`, `admission_busy` | Another of the user's audio jobs is running or starting: wait for it with `beatra.tasks.get`, then retry. |
| `audio_silent`, `audio_duration_unknown`, `source_not_ready` | Check or re-upload the file. |

A task that fails after it was accepted is refunded; report the failure and the
refund the task shows, and offer to try again only when the user wants to.
