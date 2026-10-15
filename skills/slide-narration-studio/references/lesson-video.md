# Lesson video assembly

Lessons are assembled on this computer from the teacher's slide images, the
narration recorded for each slide, optional on-camera clips, the AI badge, and
subtitles. The bundled scripts do the bookkeeping; nothing here charges.

## Before the first render

- Python 3.10+ and Node.js 18+ (the bundled runner needs Node).
- ffmpeg and ffprobe on PATH. When missing, ask the user before installing:
  macOS `brew install ffmpeg`; Windows `winget install --id Gyan.FFmpeg -e`;
  Debian/Ubuntu `sudo apt install ffmpeg`. Node: macOS `brew install node`;
  Windows `winget install --id OpenJS.NodeJS.LTS -e`.
- Pillow, for subtitles burned into the picture (the default). When `plan`
  reports it missing, ask the user before installing it with
  `python3 -m pip install --user pillow`, or plan with `--subtitles file`.
  Neither `--subtitles file` nor `--audio-only` needs Pillow.
- A font that has the subtitles' characters. macOS and Windows ship one for
  Chinese; on Linux, install a CJK font (Noto Sans CJK or WenQuanYi) or pass
  `--font`.

## The course project

`course.json` in the course folder records everything: title, language,
layout, the chosen voice, the pronunciation list, and every lesson's pages
(slide image, approved script, recorded narration and its seconds). Create it
once from one deck:

```text
python3 scripts/lesson_kit.py init "<course>" --title "<course title>" --pages "<course>/pages" --deck "<course>/deck.json" [--language <code>] [--lesson-size <pages per lesson> | --lessons <ranges>]
```

Without `--lesson-size` or `--lessons` the whole deck is one lesson, titled
with the course title. `--lesson-size N` cuts it into lessons of N pages.
`--lessons` makes uneven lessons, for example one per knowledge point:

```text
--lessons "1-8,9-15,16-20"
```

The ranges are 1-based and inclusive, in slide order, with no gaps or
overlaps, and together cover every page; a lone number such as `6` is one
page. `init` names a range that breaks this and writes nothing. Several
lessons are titled `<course title> 1`, `<course title> 2`, and so on; edit
the titles in `course.json`. Give `--lessons` or `--lesson-size`, not both.
`--language` defaults to `zh-CN`; pass the course's spoken language (for
example `en-US`) for any other course.

When the teacher has one deck per lesson, read each deck into its own files,
then give `--pages` and `--deck` once per lesson, paired in lesson order:

```text
python3 scripts/deck_read.py pages "<lesson 1 export folder or PDF>" --out-dir "<course>/pages/L01"
python3 scripts/deck_read.py slides "<lesson 1 deck.pptx>" --out "<course>/deck-L01.json"
python3 scripts/deck_read.py pages "<lesson 2 export folder or PDF>" --out-dir "<course>/pages/L02"
python3 scripts/deck_read.py slides "<lesson 2 deck.pptx>" --out "<course>/deck-L02.json"
python3 scripts/lesson_kit.py init "<course>" --title "<course title>" --pages "<course>/pages/L01" --deck "<course>/deck-L01.json" --pages "<course>/pages/L02" --deck "<course>/deck-L02.json" [--language <code>]
```

Each pair becomes one lesson, `L01`, `L02`, and so on in the order given,
titled with its deck's first slide title; when that slide has no title, with
the name of the presentation the deck was read from (`source` in the deck
file); otherwise with its pages folder name. Give exactly as many `--deck` as
`--pages`, or none: when a course arrives as one PDF or image export per
lesson and there is no `.pptx`, give one `--pages` per lesson and no
`--deck`. Each folder then becomes one lesson titled with the folder's name,
with empty scripts to write. `--lessons` and `--lesson-size` do not apply.
Every grouping gives placeholder titles somewhere, so check each lesson's
title in the `outline` and write its real title into `course.json`.

`init` prints `outline` (each lesson's ID, title, and page count; with one
deck per lesson also `slides`, that deck's slide count),
`pages_without_script`, and `slide_count_differs` (true when a deck's slide
count differs from its page images).

Settle the lessons before the first narration is submitted: every narration
request ID carries its lesson and page number. Show the teacher the
`outline`. To regroup before any narration is submitted, run `init` again
with the new grouping and `--replace`; this starts the project over with new
request IDs, so titles, scripts, the voice, and readings edited in the old
`course.json` are not kept. `--replace` cannot see a narration that is still
running or whose response was lost, and such a page narrated again under the
new IDs is paid twice: if any submit's outcome is uncertain, first reconcile
it with `beatra.tasks.list` and `beatra.tasks.get` and record what finished.
`init` refuses to replace a project with any narration or clip recorded, or
with a page that was retaken; from then on, edit `course.json` instead.

When there are no slides, create it from the final lecture text instead:

```text
python3 scripts/lesson_kit.py init "<course>" --title "<course title>" --scripts "<course>/lecture.txt" [--language <code>] [--lesson-size <pages per lesson> | --lessons <ranges>]
```

Give exactly one of `--pages` or `--scripts`. Each paragraph of the UTF-8
text file (paragraphs are separated by blank lines) becomes one page with
that paragraph as its script and no slide image. Such a course is narrated,
estimated, and recorded like any other, and is delivered as audio (see
Delivering audio): a video `plan` refuses a page without a slide image.

Edit titles, scripts, `voice.voice_id`, `pronunciations`
(`{"term": "...", "say": "..."}`: the spoken form replaces the term only in
what is read aloud; subtitles keep the written term), `layout` (`slides` or
`slides+photo` with `photo`), and `label` (`zh` or `en`) directly in the
file. `status` shows progress per lesson.

## Narration, one page at a time

```text
python3 scripts/lesson_kit.py next "<course>/course.json" [--lesson L01]
```

It returns the next page without current narration and the exact arguments
for `beatra.speech.synthesize`, `client_request_id` included. The ID stays the
same while the script, reading, voice, and take are unchanged, so a lost
response is recovered with the same ID instead of paying twice. Submit those
arguments through the bundled client, poll the task to a terminal state, save the final
`beatra.tasks.get` result as JSON, then:

```text
python3 scripts/lesson_kit.py record "<course>/course.json" --lesson L01 --page 3 --task-result "<course>/tasks/L01-p003.json"
```

It downloads the audio and records its seconds. When the result has no
duration, or the teacher supplies their own recording, measure it:

```text
node scripts/lesson_run.mjs probe "<audio file>"
python3 scripts/lesson_kit.py record "<course>/course.json" --lesson L01 --page 3 --audio "<audio file>" --seconds <seconds>
```

If a narration task ends `failed` or `canceled`, nothing is recorded for
that page. Run `retake` for it before the next `next`, which gives it a new
ID; never submit the failed or canceled task's ID again, since that ID only
returns the finished task:

```text
python3 scripts/lesson_kit.py retake "<course>/course.json" --lesson L01 --page 3
```

`record` remembers what each page's audio was made from: the text as read
aloud, the voice, and the take. Inserting, deleting, or moving slides does not
change that. Editing a page's script, or changing the
voice puts that page back in `next` with a new ID (marked
`changed_since_narrated`), counts it again in `estimate`, and makes `plan`
refuse it until it is narrated again. A new voice does this to every page
already narrated. A reading in `pronunciations` applies to the whole project:
adding or changing one re-opens every narrated page, in every lesson, whose
script contains the term. Before offering a reading change, add it and run
`estimate` without `--lesson`: `status` counts the re-opened pages per lesson
as `changed`, and `estimate` prices them together with the pages still to
narrate; remove the entry again if the teacher declines. Narrating a page
again is a new paid request. To narrate a page again with an unchanged script
(a different reading), run `retake` for that page; it gets a new ID on the
next `next`.

Before the first submit of a lesson, a batch, or the whole course, estimate
it with the live speech price per 1,000 characters from `beatra.models.list`:

```text
python3 scripts/lesson_kit.py estimate "<course>/course.json" --credits-per-1k <live price> [--lesson L01 [--pages 1-4]]
```

Without `--lesson` it covers every lesson of the course, one row per lesson
and the total. `--lesson L01` limits it to that lesson, and `--pages A-B`
(1-based, inclusive, within `--lesson`) to those pages, for a pilot.

## On-camera clips

This section applies only to Skills that make digital-human openings or
closings; other Skills skip it.

A digital-human opening or closing is made with `beatra.videos.animate` from
the teacher's photo and that clip's own narration. After it finishes, record
it with the script it speaks:

```text
python3 scripts/lesson_kit.py clip "<course>/course.json" --lesson L01 --slot intro --task-result "<course>/tasks/L01-intro.json" --script "<the clip's narration script>"
```

A closing is recorded the same way with `--slot outro`. With `--script`, the
clip's words are in the SRT and burned into the clip, timed across the clip's
length the way a page's are. Without `--script` the clip plays without
subtitles; the SRT still times every page after it correctly. Recording a
slot again replaces its clip and its script, so pass `--script` each time.

## Rendering a lesson

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --assets assets [--subtitles burn|file] [--font <path>]
node scripts/lesson_run.mjs run "<the job path plan printed>"
```

`--assets` names the Skill's `assets` folder with the AI badges. When that
folder or a badge is missing (some storefronts keep only the text files of a
Skill), `plan` writes the badge built into `lesson_kit.py` to
`<course>/work/badges/` and uses it, so the video carries the same badge.

`plan` prints JSON whose `job` is the render job's path; run exactly that
path. Its `warnings` list is empty unless a subtitle character could not be
drawn (see Subtitles). A whole lesson's job is `<course>/work/L01/render-job.json`; a
`--pages` plan writes its own, for example
`<course>/work/L01-p001-004/render-job.json`.

The result is `<course>/out/L01.mp4` (1920×1080, H.264/AAC) with the
subtitles in the picture, and `<course>/out/L01.srt` beside it. Deliver both.
To render only some pages, for a pilot, add
`--pages A-B` to `plan`: only those pages need narration, the opening and
closing clips are left out, and the result is `<course>/out/L01-p001-004.mp4`
and `.srt` for `--pages 1-4`. Every page stays on screen for its narration plus half
a second; slides of any shape are letterboxed on white, never stretched. The
Chinese or English AI badge (chosen by `label`) sits top-right on every frame,
above the subtitles, and the
file carries AIGC metadata, as the rules for AI-generated audio and video
require. The video's title names the course, then the lesson when the
lesson's title differs from the course's. `plan` refuses a page without a slide image, a script, current narration, or
a duration and names it. Rendering is local and free: a failed step is fixed and run again
without any paid call.

### Subtitles

By default (`--subtitles burn`), `plan` draws each subtitle as a transparent
picture with Pillow in the lesson's work folder (`cue-*.png`), and the render
lays each one over the video for exactly its time. The text is white with a
dark outline on a translucent dark box, about 48 px high on the 1080p frame,
centered near the bottom, at most two lines at a time. Chinese wraps between
characters and other text between words. A subtitle that needs more than two
lines becomes consecutive subtitles that share its time by characters, and the
SRT lists exactly the subtitles shown, with the same times. With
`slides+photo` the subtitles stay clear of the corner photo, moving left when
a line would reach it; a photo so wide that too little room is left beside it
is refused.

The font: `--font <path>` (a `.ttf`, `.otf`, or `.ttc` file) wins and draws
every subtitle, and a missing file is an error. Otherwise each subtitle takes
the first installed font that draws all of its characters, in this order: on
macOS PingFang, Hiragino Sans GB, STHeiti, then Arial Unicode; on Windows
Microsoft YaHei, SimHei, DengXian, then SimSun; on Linux Noto Sans CJK, then
WenQuanYi; then any font in the usual font folders whose file name contains
CJK, wqy, YaHei, PingFang, or Hiragino; and for subtitles without Chinese
characters also Helvetica, Arial, DejaVu Sans, or Liberation Sans. `plan`
stops, naming `--font <path>` and `--subtitles file`, only when no installed
font draws the course's Chinese characters at all.

A character that no font draws, such as a math sign, does not stop `plan`:
that subtitle is drawn in the font that draws the most of it, the character
is left out of the picture, and the SRT keeps it. The same happens with
`--font` for any character that font lacks. `plan` then lists `warnings` in
its JSON, one per page or clip (`lesson`, `page` as a number, `intro`, or
`outro`, and the `characters` left out). Tell the teacher which characters
are missing from the picture, and offer `--font` with a font that has them,
`--subtitles file`, or a reworded script; rendering again is free. The job
JSON records `subtitles` (the mode), `fonts` (each font file used, with the
face used in a font collection), `font` and `font_face` (the first of them),
and the same `warnings`.

`--subtitles file` burns nothing and needs neither Pillow nor a font: the
picture has no subtitles and the SRT beside the video is the only subtitle
file. Offer it when the teacher uploads the SRT to a platform separately or
wants clean slides.

## Delivering audio

Hand over tagged copies of the narration rather than the working files in
`audio/`:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --audio-only [--pages A-B]
node scripts/lesson_run.mjs run "<the job path plan printed>"
```

It needs no `--assets` and works for a course made from lecture text;
`--subtitles` and `--font` are ignored. Each
page's narration is copied without re-encoding to `<course>/out/L01-audio/`
as `p001.mp3`, `p002.mp3`, … (with `--pages 1-4`, to
`<course>/out/L01-p001-004-audio/`), carrying the same AIGC metadata as the
videos and a title naming the course, the lesson (when its title differs from
the course's), and the page; the job's
`outputs` names that folder, and copies left there by an earlier plan are
cleared. `plan --audio-only` refuses a page without a script, without
narration, or changed since it was narrated, exactly as for video. Copying is
local and free.
