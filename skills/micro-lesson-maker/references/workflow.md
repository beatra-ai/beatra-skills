# Micro-lesson workflow

## The lesson folder

Work in one folder per lesson (`<course>` in the commands): the deck, or
`outline.json` and the deck built from it, `pages/`, `deck.json`,
`course.json`, `tasks/` (saved task results), `audio/`, `clips/`, `work/`,
and `out/`. The course project `course.json` holds one lesson, `L01`, for the
whole deck: create it without `--lesson-size` or `--lessons`. It is the
source of truth for scripts, the voice, readings, and progress; read it at
the start of every session instead of asking the teacher to repeat anything.
Create it with the spoken language: `lesson_kit.py init` defaults to
`zh-CN`, so pass `--language en-US` (or the lesson's language) for any other
lesson.

From the teacher's slides, read the text and notes of the `.pptx` and one
image per slide (see Deck files), then create the project; leave out
`--deck` when there is no `.pptx`:

```text
python3 scripts/deck_read.py slides "<deck.pptx>" --out "<course>/deck.json"
python3 scripts/deck_read.py pages "<exported folder or deck.pdf>" --out-dir "<course>/pages"
python3 scripts/lesson_kit.py init "<course>" --title "<lesson title>" --pages "<course>/pages" --deck "<course>/deck.json"
```

When `init` reports `slide_count_differs`, the images and the deck do not
match: ask the teacher which export is current before writing scripts.
Hidden slides are a common cause: `deck_read.py slides` reads them, while a
PowerPoint PDF export leaves them out. Ask the teacher to unhide or delete
them, read the deck and its new export again (into an empty pages folder),
and run `init` again with `--replace`, which is allowed only before any
narration is submitted: if a submit's outcome is uncertain, reconcile it with
`beatra.tasks.list` and `beatra.tasks.get` and record what finished first,
since `--replace` gives the pages new request IDs and cannot see a narration
still running or a lost response.

When the teacher has only the final lecture text, offer two routes: a video,
by drafting a deck from that text (From a topic), or audio only, by creating
the project from the text itself. Each paragraph (separated by blank lines)
becomes one page, narrated and delivered as audio, never rendered:

```text
python3 scripts/lesson_kit.py init "<course>" --title "<lesson title>" --scripts "<course>/lecture.txt"
```

## From a topic

Write `outline.json` for 6–10 slides: a title slide, a lead-in question, two
to four explanation slides, one worked example, one practice question, and a
summary. Put the spoken script for each slide in its `notes`. Use the `title`
and `bullets` layouts; use `image` only for a picture the teacher supplied.
For example:

```json
{
  "slides": [
    {"layout": "title", "title": "一次函数", "subtitle": "八年级数学", "notes": "同学们好，今天我们一起认识一次函数。"},
    {"layout": "bullets", "title": "想一想", "bullets": ["弹簧挂上重物后，长度怎样变化？"], "notes": "先看一个生活里的问题。"}
  ]
}
```

Show the outline and wait for the teacher's changes; this is free. Then build
the deck:

```text
python3 scripts/deck_build.py build "<course>/outline.json" --out "<course>/<title>.pptx"
```

Give the teacher the `.pptx`. When they keep it as built, draw the slide
images straight from the outline, with nothing to export:

```text
python3 scripts/deck_build.py render "<course>/outline.json" --out-dir "<course>/pages"
```

When they edit it in PowerPoint or WPS, ask them to export one image per
slide instead (PowerPoint: File → Export → Change File Type → PNG → All
Slides; WPS: File → Output as Images), so the video shows their edits. Use
the outline's notes as the scripts when creating the course project: read the
deck the teacher saved (or the one just built, when they changed nothing)
with `deck_read.py slides`, whose notes are those scripts, and continue as
above.

For a lesson-design presentation (a demo-lesson talk for judges or peers,
not a lesson for students), write the outline as that presentation instead:
a title slide, then one or two slides each for the textbook analysis, the
learners, the objectives, the key and difficult points, the teaching and
learning methods, the teaching process, and the board plan. Ask for the
textbook edition and chapter when the teacher has not named them. Write
every slide's `notes` as the teacher speaking to the panel about the design,
in the first person, not to students. The usual slide titles in Chinese:

```text
说教材  说学情  教学目标  教学重难点  说教法学法  说教学过程  板书设计
```

Build, export, and narrate it exactly as above.

## Production cards

Show a card before every paid call and wait. Each card has six fields:

1. **Work:** in the user's words, which call: narration
   (`beatra.speech.synthesize`), voice cloning (`beatra.voices.clone`), or an
   on-camera opening or closing (`beatra.videos.animate`).
2. **Credits:** the live price just read from `beatra.models.list`, with the
   estimate from `lesson_kit.py estimate` for narration, never a remembered
   number.
3. **Count:** one charge per slide of narration, per clip script's
   narration, per cloned voice, per clip.
4. **Identity:** slide narration uses the `client_request_id` that
   `lesson_kit.py next` returns for that slide; a clone, a clip script's
   narration, and a clip each get one new opaque ID.
5. **If they stop:** the outline, the deck, the scripts, the course project,
   and everything already rendered stay usable.
6. **If the balance is short:** relay the official message and top-up URL,
   and continue only after the user says they topped up.

When the user stops partway, deliver the slides narrated so far, limited to
them, where N is the last slide of the run narrated from slide 1: a lesson
from slides as video with `plan --lesson L01 --pages 1-N --assets assets`; a
lesson made from lecture text, or one wanted as audio only, as tagged audio
with `plan --lesson L01 --pages 1-N --audio-only`. Then run the job path
`plan` prints.

Read the live cards; the bundled client takes the arguments as JSON on
stdin:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

and, before a clone or a clip, `{"capability": "voice_clone"}` or
`{"capability": "image_to_video"}` the same way.

The 600-credit signup gift covers the first part of a micro-lesson in slides
and voice, about three minutes. A whole 10-minute lesson, cloning a voice, and
the on-camera opening usually need a top-up; say so on their cards. When a
card carries a `top_up` block, relay its tiers as listed.

## Narration payload

`lesson_kit.py next` prints the exact arguments. They look like this:

```json
{
  "voice": "voice_teacher",
  "input": "一次函数的图像是一条直线。先看这个例子。",
  "model": "auto",
  "format": "mp3",
  "language": "zh-CN",
  "client_request_id": "lk-3f9a1c2e-L01-p001-5c1d2e3f4a5b"
}
```

Submit through the bundled client, poll with `beatra.tasks.get` until
terminal, save the final result to `tasks/L01-p001.json`, then `record` it.
Never put a voice's display name in `voice`; use a `voice_id` from
`beatra.voices.list` or the clone result.

If a narration task ends `failed` or `canceled`, nothing is recorded for
that slide. Run `retake` for it, which gives it a new ID on the next `next`:

```text
python3 scripts/lesson_kit.py retake "<course>/course.json" --lesson L01 --page 3
```

Then show a new card for that slide before submitting it again. Never resend
the failed or canceled request's ID: without `retake`, `next` returns that
same ID again, and it only brings back the finished task.

## First part

Take the first two to four slides, about three minutes of speech, for
example slides 1 to 3. Estimate those slides and show their card:

```text
python3 scripts/lesson_kit.py estimate "<course>/course.json" --credits-per-1k <live price> --lesson L01 --pages 1-3
```

After the user agrees, narrate slide by slide and stop after the last of
them. For each slide, `next` prints the arguments; submit them as the JSON on
stdin, poll the task with `beatra.tasks.get` until terminal, save the final
result, and record it:

```text
python3 scripts/lesson_kit.py next "<course>/course.json" --lesson L01
python3 scripts/mcp_client.py call beatra.speech.synthesize
python3 scripts/lesson_kit.py record "<course>/course.json" --lesson L01 --page 1 --task-result "<course>/tasks/L01-p001.json"
```

Then plan only those slides:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --pages 1-3 --assets assets
```

Run the job path that `plan` prints (its JSON `job`, here
`work/L01-p001-003/render-job.json`) with `node scripts/lesson_run.mjs run`,
which draws the subtitles on screen (see Subtitles),
and deliver `out/L01-p001-003.mp4` and its SRT.

A lesson created from lecture text (`init --scripts`), or one the teacher
wants as audio only, is not rendered: plan the same pages with
`--audio-only` instead of `--assets`, run the job path it prints (here
`work/L01-p001-003-audio/render-job.json`), and deliver the tagged copies
`out/L01-p001-003-audio/p001.mp3` … (see Delivery):

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --pages 1-3 --audio-only
```

Ask the teacher to check readings, pace, and voice. Fix a sentence by
editing that slide's script: that slide goes back in `next` with a new ID.
Fix a misread term by adding it to `pronunciations`, which apply to the whole
lesson: every narrated slide whose script contains that term goes back in
`next` with a new ID. Before offering a reading change, add it, run `status`
and `estimate`, and tell the teacher how many narrated slides it re-opens
(`status` counts them as `changed`; `estimate` prices them with the slides
still to narrate); remove the entry again if the teacher declines. `plan`
refuses each changed slide until it is narrated again: show a card for
re-narrating the changed slides only, then render again.

## The rest of the lesson

One card for the remaining slides: how many, and their estimate from
`estimate --lesson L01`, which counts only slides that still need narration,
including any changed since they were narrated. After the card is accepted,
loop `next` → submit → poll → save → `record` until `next` returns
`{"done": true}`. Every slide `next` returns must be on the card; a slide
changed after the card was shown gets a card of its own, and so does a slide
whose task ends `failed` or `canceled` (see Narration payload). On
`insufficient_balance` stop the loop at once: nothing else is submitted, the
finished slides stay recorded, relay that error's message and URL, and after
the user says they topped up, `next` resumes exactly where it stopped.

Then render the whole lesson:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --assets assets
```

Run the job path that `plan` prints (here `work/L01/render-job.json`) with
`node scripts/lesson_run.mjs run`; the result is `out/L01.mp4`, with its
subtitles on screen, and `out/L01.srt` beside it.

## The teacher's own voice

When the teacher wants their own voice from the start, clone it before the
first part so nothing is narrated twice. Consent first: the teacher says the
sample is their own voice, or that the speaker authorized this use. A
suitable sample is currently about 10 to 300 seconds, no larger than 20 MiB,
clean single-speaker speech. Upload it:

```text
python3 scripts/mcp_client.py upload ./teacher-sample.wav --mime-type audio/wav
```

Show the clone card, then submit `beatra.voices.clone` once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Lesson Teacher",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-micro-lesson-clone"
}
```

Poll to terminal, save the final result to `tasks/clone.json`, and write the
returned `voice_id` into `voice.voice_id`. Every slide already narrated with
another voice then goes back in `next` with a new ID, and `plan` refuses it
until it is narrated again, so the whole lesson ends up in one voice. Tell the
teacher and put those slides on the next card.

## On-camera opening

Ask for one authorized landscape (16:9) photo of the teacher facing the
camera: the clip keeps the photo's shape, so a portrait photo leaves bars
beside the teacher in the 16:9 lesson. Read the live `image_to_video` card
before writing the opening or closing script: note the longest duration it
admits and its limits for the driving audio, and keep the script short
enough that its narration fits both (10–20 seconds of speech usually does).
Check that the card returns the clip with its sound (`output_audio`), since
the render plays the clip's own audio track; when no current card does, say
so and make no clip.

Then narrate the opening script as its own request with a new opaque ID
(card, submit, poll), upload or reuse the photo, confirm the photo and the
narration's actual length and size fit the card, show the clip card, then
submit `beatra.videos.animate` once:

```json
{
  "image": {"type": "artifact", "artifact_id": "art_teacher"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_L01_intro_audio"},
  "prompt": "A calm teacher speaking to camera with a steady eye line, restrained expression, and a stable frame.",
  "duration": 15,
  "client_request_id": "opaque-micro-lesson-L01-intro"
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
own, never the opening's (for example `opaque-micro-lesson-L01-outro` for the
clip). Save the clip's final result to `tasks/L01-outro.json`, then:

```text
python3 scripts/lesson_kit.py clip "<course>/course.json" --lesson L01 --slot outro --task-result "<course>/tasks/L01-outro.json" --script "<the closing's narration script>"
```

Render the whole lesson again (see The rest of the lesson): the opening
plays before the first slide and the closing after the last; a `--pages`
render leaves them out. Review the face, clothing, and lips after delivery
and say what drifted.

If the teacher asks for a presenter throughout the lesson, say this version
makes an opening and a closing, and quote that option.

## Corner photo

Set `layout` to `slides+photo` and `photo` to the image path. It costs
nothing. Keep the slide's bottom-right corner free of text when the teacher
can. A portrait or square photo suits the corner best: the subtitles stay
beside the photo, and `plan` refuses a photo so wide that too little room is
left for them; then ask for a portrait or square photo, or plan with
`--subtitles file`.

## Subtitles

The video shows its subtitles on screen, and the SRT ships beside the MP4.
Drawing them into the picture needs Pillow and a font with the subtitles'
characters on this computer (see [Lesson video assembly](lesson-video.md));
when `plan` reports either one missing, follow that reference, and ask the
user before installing anything. When the teacher uploads subtitles to a
platform that takes a separate SRT, or wants clean slides, plan with
`--subtitles file`: the picture then has no subtitles and the SRT is the only
subtitle file. When `plan` prints `warnings`, tell the teacher which
characters were left out of the picture and where (the SRT keeps them), and
offer `--font`, `--subtitles file`, or a reworded script.

## Delivery

The MP4 with its subtitles on screen, the SRT beside it, the length, and the
scripts; for a lesson made from a topic, the `.pptx` too. Report the summed
`billing.net_charged_credits` from
the recorded tasks, the clone, the opening, and the closing included. Say
that the video carries the AI badge and metadata, and that a contest or an
open-lesson review may require a real recording, so the teacher checks that
year's notice first.

For audio only, no video is rendered. Deliver tagged copies of the
narration, never the working files in `audio/`:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --audio-only
```

Run the job path that `plan` prints (here `work/L01-audio/render-job.json`)
with `node scripts/lesson_run.mjs run`. Each slide's audio is copied without
re-encoding to `out/L01-audio/p001.mp3`, `p002.mp3`, …, labelled as
AI-generated in its metadata. Hand over that folder in slide order with each
slide's script. A lesson created from lecture text alone (`init --scripts`)
is always delivered this way. Tell the teacher that these files are
AI-generated narration, each tagged as such in its metadata, and that any
video they publish from them must show the AI badge.

## Pointing to another Skill

Suggest Lecture Video Maker when the teacher plans more than five lessons,
and AI Courseware Maker for a full illustrated deck without video. Use the
website wording exactly and install only after the user asks. Send the line
in the user's language:

```text
请安装 数字人讲课；需要登录授权时告诉我：https://beatra.ai/skills/lecture-video-maker/install.md
请安装 AI课件；需要登录授权时告诉我：https://beatra.ai/skills/ai-courseware-maker/install.md
Install Lecture Video Maker and tell me when I need to sign in: https://beatra.ai/skills/lecture-video-maker/install.md
Install AI Courseware Maker and tell me when I need to sign in: https://beatra.ai/skills/ai-courseware-maker/install.md
```
