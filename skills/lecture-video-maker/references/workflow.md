# Course video workflow

## The course folder

Work in one folder per course: the deck, `pages/`, `deck.json`,
`course.json`, `tasks/` (saved task results), `audio/`, `clips/`, `work/`,
and `out/`. The course project `course.json` is the source of truth for
scripts, the voice, readings, and progress; read it at the start of every
session instead of asking the teacher to repeat anything. Create it with the
spoken language: `lesson_kit.py init` defaults to `zh-CN`, so pass
`--language en-US` (or the course's language) for any other course.

## Lessons

Read the text and notes of each `.pptx` and one image per slide (see
[Deck files](deck-files.md)), then create the course project; leave out
`--deck` when there is no `.pptx`. Settle how the course splits into lessons
before any narration is submitted: every narration request ID carries its
lesson and page number, so the grouping cannot change once the first page is
narrated.

One lesson per knowledge point, the default: agree each lesson's slide range
with the teacher and pass the ranges in slide order with `--lessons`,
covering every slide with no gaps or overlaps:

```text
python3 scripts/deck_read.py slides "<deck.pptx>" --out "<course>/deck.json"
python3 scripts/deck_read.py pages "<exported folder or deck.pdf>" --out-dir "<course>/pages"
python3 scripts/lesson_kit.py init "<course>" --title "<course title>" --pages "<course>/pages" --deck "<course>/deck.json" --lessons "1-8,9-15,16-20"
```

One lesson per deck, when the teacher has a separate deck for each lesson:
read each deck into its own pages folder and deck file, then pass one
`--pages` and one `--deck` per lesson, paired in lesson order:

```text
python3 scripts/deck_read.py slides "<lesson 1 deck.pptx>" --out "<course>/deck-L01.json"
python3 scripts/deck_read.py pages "<lesson 1 export folder or PDF>" --out-dir "<course>/pages/L01"
python3 scripts/deck_read.py slides "<lesson 2 deck.pptx>" --out "<course>/deck-L02.json"
python3 scripts/deck_read.py pages "<lesson 2 export folder or PDF>" --out-dir "<course>/pages/L02"
python3 scripts/lesson_kit.py init "<course>" --title "<course title>" --pages "<course>/pages/L01" --deck "<course>/deck-L01.json" --pages "<course>/pages/L02" --deck "<course>/deck-L02.json"
```

One export per lesson without a `.pptx`, when the course arrives as a PDF or
an image export for each lesson: read each into its own pages folder and pass
one `--pages` per lesson, in lesson order, and no `--deck`. Each lesson then
starts with empty scripts:

```text
python3 scripts/deck_read.py pages "<lesson 1 PDF or export folder>" --out-dir "<course>/pages/L01"
python3 scripts/deck_read.py pages "<lesson 2 PDF or export folder>" --out-dir "<course>/pages/L02"
python3 scripts/lesson_kit.py init "<course>" --title "<course title>" --pages "<course>/pages/L01" --pages "<course>/pages/L02"
```

Fixed chunks, when the teacher wants lessons of equal length: pass
`--lesson-size <slides per lesson>` instead of `--lessons`. With neither, the
whole deck is one lesson. From final lecture text alone, pass
`--scripts "<course>/lecture.txt"` instead of `--pages` and `--deck`; each
paragraph is one page, and `--lessons` counts paragraphs.

`init` prints the `outline`: each lesson's ID, title, and page count. Show it
to the teacher, and check every lesson's title whatever the grouping:
`--lessons` and `--lesson-size` title the lessons `<course title> 1`,
`<course title> 2`, …; one lesson per deck takes the deck's first slide
title, else the presentation's file name, else the pages folder name (such
as `L02`); one export per lesson takes the pages folder name. Write each
lesson's real title into `course.json`. To regroup before any narration is
submitted, run `init` again with the new grouping and `--replace`: it starts
the project over with new request IDs, so edited titles, scripts, the voice,
and readings are not kept. If a submit's outcome is uncertain, reconcile it
with `beatra.tasks.list` and `beatra.tasks.get` and record what finished
before replacing; `--replace` cannot see a narration still running or a lost
response, and that page would be paid twice. Once any narration or clip is
recorded, or a page was retaken, `init` refuses to replace the project.

When `init` reports `slide_count_differs`, a deck's images and its slides do
not match: ask the teacher which export is current before writing scripts.
Hidden slides are a common cause: `deck_read.py slides` reads them, while a
PowerPoint PDF export leaves them out. Ask the teacher to unhide or delete
them, read the deck and its new export again (into an empty pages folder),
and run `init` again with `--replace`.

## Production cards

Show a card before every paid call and wait. Each card has six fields:

1. **Work:** in the user's words, which call: Smart Voice Director
   (`beatra.speech.prepare_script`), audio cleanup / loudness normalization
   (`beatra.audio.process`), narration (`beatra.speech.synthesize`), voice
   cloning (`beatra.voices.clone`), or an on-camera clip
   (`beatra.videos.animate`).
2. **Credits:** the live price just read from `beatra.models.list`, with the
   estimate from `lesson_kit.py estimate` (or free `beatra.speech.validate`
   preflight) for narration, never a remembered number.
3. **Count:** one charge per Smart Voice Director call (max 2 concurrent), per
   audio processing call (`audio.process`, one at a time, 50/day), per page of
   narration, per clip script's narration, per cloned voice, per clip.
4. **Identity:** page narration uses the `client_request_id` that
   `lesson_kit.py next` returns for that page; a Smart Voice Director call,
   audio processing job, clone, clip script's narration, and clip each get one
   new opaque ID.
5. **If they stop:** the scripts, prepared direction, preflight checks, the
   course project, and everything already rendered stay usable at zero extra
   charge.
6. **If the balance is short:** relay the official `insufficient_balance`
   message and verbatim `topup_url` without changing the link, and wait until
   the user says they topped up before retrying with the same frozen
   `client_request_id`.

Read the live cards using only tools listed by `scripts/mcp_client.py tools`;
the bundled client takes the arguments as JSON on stdin:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

and, as needed, `{"capability": "speech_script"}` before Smart Voice Director,
`{"capability": "voice_clone"}` before a clone,
`{"capability": "audio_voice_isolation"}` before `isolate_voice`,
`{"capability": "audio_process"}` before `normalize_loudness`, or
`{"capability": "image_to_video"}` before an on-camera clip. Call
`beatra.voices.preview`, `beatra.voices.update`, and `beatra.speech.validate`
for free without a production card, and call `beatra.wallet.get` /
`beatra.wallet.ledger` only when the user asks about remaining credits or
charges (never as a mandatory pre-submit gate).

The initial signup gift covers a pilot of about three minutes of slides
and voice. Cloning a voice and on-camera clips usually need a top-up; say so
on their cards. When a card carries a `top_up` block, relay its tiers as
listed.

## Narration payload

First audition voices for free with `beatra.voices.preview`, and preflight text
for free with `beatra.speech.validate` (`estimated_duration_seconds`, character
or segment checks) before any paid synthesis. When the teacher wants Smart Voice
Director prosody shaping without changing spoken words, show
its own card and run **paid** `beatra.speech.prepare_script`
(`{"capability": "speech_script"}`, max **2 concurrent**; never manually write
braced cues): it returns `directed` and `scripts[]` (`synthesis`, `summary`,
`voice_selection`, `alternatives`, `estimate`, `warnings`); pass
`scripts[].synthesis` unchanged with a fresh `client_request_id` to
`beatra.speech.synthesize` (or inspect `warnings` when `synthesis` is `null`).
Switching only `voice` (and `model` if needed) with identical arguments within
48 hours reuses direction at no extra charge (balance must still cover the initial
estimate), whereas fresh `prepare_script` runs are always paid.

`lesson_kit.py next` prints the exact base narration arguments.
`subtitle_enable` defaults to `true` (never pass `subtitles`), so
`beatra.speech.synthesize` also returns free `output.subtitles`
(`JSON`/`SRT`/`VTT`) and `speech_start_seconds` / `speech_end_seconds`. Base
arguments look like this:

```json
{
  "voice": "voice_teacher",
  "input": "组织是管理的第二项职能。先看一个例子。",
  "model": "auto",
  "format": "mp3",
  "language": "zh-CN",
  "subtitle_enable": true,
  "client_request_id": "lk-3f9a1c2e-L01-p001-5c1d2e3f4a5b"
}
```

Submit through the bundled client, poll with `beatra.tasks.get` until
terminal, save the final result to `tasks/L01-p001.json`, then `record` it.
Never put a voice's display name in `voice`; use a `voice_id` from
`beatra.voices.list` or the clone result.

If a narration task ends `failed` or `canceled`, nothing is recorded for
that page. Run `retake` for it, which gives it a new ID on the next `next`:

```text
python3 scripts/lesson_kit.py retake "<course>/course.json" --lesson L01 --page 3
```

Then show a new card for that page before submitting it again. Never resend
the failed or canceled request's ID: without `retake`, `next` returns that
same ID again, and it only brings back the finished task.

## Pilot

Take the first two to four pages of the first lesson, about three minutes of
speech, for example pages 1 to 3. Estimate those pages and show their card:

```text
python3 scripts/lesson_kit.py estimate "<course>/course.json" --credits-per-1k <live price> --lesson L01 --pages 1-3
```

After the user agrees, narrate page by page and stop after the last pilot
page. For each page, `next` prints the arguments; submit them as the JSON on
stdin, poll the task with `beatra.tasks.get` until terminal, save the final
result, and record it:

```text
python3 scripts/lesson_kit.py next "<course>/course.json" --lesson L01
python3 scripts/mcp_client.py call beatra.speech.synthesize
python3 scripts/lesson_kit.py record "<course>/course.json" --lesson L01 --page 1 --task-result "<course>/tasks/L01-p001.json"
```

Then plan only those pages and run the job path that `plan` prints (its JSON
`job`):

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --pages 1-3 --assets assets
node scripts/lesson_run.mjs run "<course>/work/L01-p001-003/render-job.json"
```

Deliver `out/L01-p001-003.mp4`, with its subtitles on screen, and its SRT
beside it. A course made from lecture
text (`init --scripts`) is not rendered as video: plan the pilot pages with
`--audio-only` instead of `--assets`, run the job path it prints, and deliver
`out/L01-p001-003-audio/p001.mp3` … (see Delivery).

Ask the teacher to check readings, pace, and voice. Fix a sentence by
editing that page's script: that page goes back in `next` with a new ID.
Fix a misread term with a reading in `pronunciations`, which applies to the
whole course: every narrated page, in every lesson, whose script contains
that term goes back in `next` with a new ID. Before offering a reading
change, add it, run `status` and `estimate` without `--lesson`, and tell the
teacher how many narrated pages it re-opens (`status` counts them per lesson
as `changed`; `estimate` prices them with the pages still to narrate);
remove the entry again if the teacher declines. `plan` refuses each changed
page until it is narrated again: show a card for re-narrating the changed
pages only, then render again.

## Batch

After the pilot is accepted, show the whole-course total once. Without
`--lesson`, `estimate` lists every lesson, with every page still to narrate,
and the total:

```text
python3 scripts/lesson_kit.py estimate "<course>/course.json" --credits-per-1k <live price>
```

The total is information, not approval. Then go chapter by chapter: show
that chapter's scripts (free) before or with its card and wait for the
teacher's changes; narrate nothing in the chapter until they are settled. A
script edited after the card was shown gets a card of its own. The card has
one line per lesson: title, pages, estimate (`estimate --lesson` for each
lesson). After the
card is accepted, loop `next` → submit → poll → save → `record` until the
chapter is done, with `next --lesson` for each of its lessons in order
(`next` also returns pages changed since they were narrated;
each one must be on the card), rendering each lesson as soon as all its pages are recorded.
A page whose task ends `failed` gets `retake` and a card of its own (see
Narration payload); so does a page whose task ends `canceled`.
Report after each lesson. On `insufficient_balance` stop the loop at once:
nothing else is submitted, the finished pages stay recorded, and `next` later
resumes exactly where it stopped.

## The teacher's own voice

Before any sample upload or `consent_attested: true`, confirm all three voice
safety gates with the user: (1) explicit ownership or rightsholder permission
and attestation against impersonation or fraud (access to a file or public video
is not consent), (2) any live clone activation fee/quote awareness if a route
surfaces `pending_activation`, and (3) permanent voice-slot usage and the
irreversible two-step warning if a voice is later deleted. A suitable sample is
10 to 300 seconds, no larger than 20 MB, clean single-speaker speech (checked
against the live `voice_clone` card). If the recording has background noise or
level swings, clean it first under its own paid card via `beatra.audio.process`:
`isolate_voice` (`{"capability": "audio_voice_isolation"}`, **paid**, `4.6 s –
5 min`, `<= 100 MB`), and match clip or lesson levels with `normalize_loudness`
(`{"capability": "audio_process"}`, **paid**, up to `60 min` / `300 MB`, min
output `>= 1 s`, max **50 calls/day**, run one at a time). Upload the clean sample:

```text
python3 scripts/mcp_client.py upload ./teacher-sample.wav --mime-type audio/wav
```

Show the clone card, then submit `beatra.voices.clone` once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Course Teacher",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-course-video-clone"
}
```

Poll to terminal, audition the ready voice for free with
`beatra.voices.preview` (and tune saved metadata/defaults for free with
`beatra.voices.update`), then write the returned `voice_id` into
`voice.voice_id`. Every
page already narrated with another voice then goes back in `next` with a new
ID, and `plan` refuses it until it is narrated again, so the whole course
ends up in one voice. Tell the teacher and put those pages on the next card.

## On-camera clips

Ask for one authorized landscape (16:9) photo of the teacher facing the
camera: the clip keeps the photo's shape, so a portrait photo leaves bars
beside the teacher in the 16:9 lesson. Read the live `image_to_video` card
before writing an opening or closing script: note the longest duration it
admits and its limits for the driving audio, and keep the script short
enough that its narration fits both (10–20 seconds of speech usually does).
Check that the card returns the clip with its sound (`output_audio`), since
the render plays the clip's own audio track; when no current card does, say
so and make no clip.

First run free `beatra.speech.validate` on the clip script (and check the
live `image_to_video` card's maximum clip duration) so `estimated_duration_seconds`
fits inside the avatar clip limit BEFORE paying to synthesize speech or animate
video. Then narrate the clip's script as its own request with a new opaque ID
(card, submit, poll), upload or reuse the photo, confirm the photo and the
narration's actual length and size fit the card, show the clip card, then
submit `beatra.videos.animate` once:

```json
{
  "image": {"type": "artifact", "artifact_id": "art_teacher"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_L01_intro_audio"},
  "prompt": "A calm teacher speaking to camera with a steady eye line, restrained expression, and a stable frame.",
  "duration": 15,
  "client_request_id": "opaque-course-L01-intro"
}
```

Duration is the smallest admitted whole second at or above the speech
length. Poll to terminal, save the final result to `tasks/L01-intro.json`,
then record the clip with the script it speaks, which gives it its
subtitles. Pass `--script` every time a slot is recorded: recording a slot
again replaces its script.

```text
python3 scripts/lesson_kit.py clip "<course>/course.json" --lesson L01 --slot intro --task-result "<course>/tasks/L01-intro.json" --script "<the opening's narration script>"
```

A closing is made the same way, on its own two cards (its script's narration
and the clip): its narration and its clip each get a new opaque ID of their
own, never the opening's (for example `opaque-course-L01-outro` for the
clip). Save the clip's final result to `tasks/L01-outro.json`, then:

```text
python3 scripts/lesson_kit.py clip "<course>/course.json" --lesson L01 --slot outro --task-result "<course>/tasks/L01-outro.json" --script "<the closing's narration script>"
```

Render the lesson again: the opening plays before the first slide and the
closing after the last; a `--pages` render leaves them out.

Review the face, clothing, and lips after delivery and say what drifted.

If the teacher asks for a presenter throughout the lesson, say this version
makes openings and closings, per lesson or per chapter, and quote that
option.

## Corner photo

Set `layout` to `slides+photo` and `photo` to the image path. It costs
nothing. Keep the slide's bottom-right corner free of text when the teacher
can. A portrait or square photo suits the corner best: the subtitles stay
beside the photo, and `plan` refuses a photo so wide that too little room is
left for them; then ask for a portrait or square photo, or plan with
`--subtitles file`.

## Subtitles

Every `beatra.speech.synthesize` response with `subtitle_enable: true` (default)
returns free `output.subtitles` (`JSON`/`SRT`/`VTT`) and
`speech_start_seconds` / `speech_end_seconds` at no extra charge. Locally,
every rendered video shows its subtitles on screen, and the SRT ships beside
each MP4. Drawing them into the picture needs Pillow and a font with the
subtitles' characters on this computer (see
[Lesson video assembly](lesson-video.md)); when `plan` reports either one
missing, follow that reference, and ask the user before installing anything.
When the teacher uploads subtitles to a platform that takes a separate SRT,
or wants clean slides, plan with `--subtitles file`: the picture then has no
subtitles and the SRT is the only subtitle file. When `plan` prints
`warnings`, tell the teacher which characters were left out of the picture
and where (the SRT keeps them), and offer `--font`, `--subtitles file`, or a
reworded script.

## Delivery

Per lesson: the MP4 with its subtitles on screen, the SRT beside it, its
length, and its status. For the course: the
course list, total minutes, and summed `billing.net_charged_credits` from the
recorded tasks. Say that each video carries the AI badge and metadata, and
that a contest or course review may require a real recording.

For audio only, no video is rendered. Deliver tagged copies of the
narration, never the working files in `audio/`: for each finished lesson run

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --audio-only
```

and the job path it prints with `node scripts/lesson_run.mjs run`. Each
page's audio is copied without re-encoding to `out/L01-audio/p001.mp3`,
`p002.mp3`, …, labelled as AI-generated in its metadata. Deliver those
folders in lesson and slide order, with the scripts and the course list.
Tell the teacher that these files are AI-generated narration, each tagged as
such in its metadata, and that any video they publish from them must show
the AI badge. A course created from lecture text alone (`init --scripts`) is
always delivered this way; for video, AI Courseware Maker builds a deck
first.

## Pointing to another Skill

Use the website wording exactly and install only after the user asks. Send
the line in the user's language:

```text
请安装 微课制作；需要登录授权时告诉我：https://beatra.ai/skills/micro-lesson-maker/install.md
请安装 AI课件；需要登录授权时告诉我：https://beatra.ai/skills/ai-courseware-maker/install.md
请安装 AI数字人口播与虚拟主播视频；需要登录授权时告诉我：https://beatra.ai/skills/talking-avatar-video/install.md
Install Micro-Lesson Maker and tell me when I need to sign in: https://beatra.ai/skills/micro-lesson-maker/install.md
Install AI Courseware Maker and tell me when I need to sign in: https://beatra.ai/skills/ai-courseware-maker/install.md
Install Talking Avatar & AI Presenter Video and tell me when I need to sign in: https://beatra.ai/skills/talking-avatar-video/install.md
```
