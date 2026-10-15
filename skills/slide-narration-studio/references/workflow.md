# Narration workflow

## The course folder

Work in one folder per deck: the deck, `pages/`, `deck.json`, `course.json`,
`tasks/` (saved task results), `audio/`, `work/`, and `out/`. The course
project `course.json` holds one lesson, `L01`, for the whole deck: create it
without `--lesson-size` or `--lessons`. It is the source of truth for
scripts, the voice, readings, and progress; read it at the start of every
session instead of asking the teacher to repeat anything. Create it with the
spoken language: `lesson_kit.py init` defaults to `zh-CN`, so pass
`--language en-US` (or the deck's language) for any other deck. From final
lecture text without slides, create it with `init --scripts` instead of
`--pages`: each paragraph becomes one page, narrated and delivered as audio.

From the deck, read the text and notes of the `.pptx` and one image per slide
(see [Deck files](deck-files.md)), then create the project; leave out
`--deck` when there is no `.pptx`:

```text
python3 scripts/deck_read.py slides "<deck.pptx>" --out "<course>/deck.json"
python3 scripts/deck_read.py pages "<exported folder or deck.pdf>" --out-dir "<course>/pages"
python3 scripts/lesson_kit.py init "<course>" --title "<deck title>" --pages "<course>/pages" --deck "<course>/deck.json"
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

On-camera openings and closings, which Lesson video assembly describes, are
not part of this Skill: Lecture Video Maker or Micro-Lesson Maker makes them.

## Production cards

Show a card before every paid call and wait. Each card has six fields:

1. **Work:** in the user's words, which call: narration
   (`beatra.speech.synthesize`) or voice cloning (`beatra.voices.clone`).
2. **Credits:** the live price just read from `beatra.models.list`, with the
   estimate from `lesson_kit.py estimate` for narration, never a remembered
   number.
3. **Count:** one charge per slide of narration, one per cloned voice.
4. **Identity:** slide narration uses the `client_request_id` that
   `lesson_kit.py next` returns for that slide; a clone gets one new opaque ID.
5. **If they stop:** the scripts, the course project, and every slide's audio
   already made stay usable.
6. **If the balance is short:** relay the official message and top-up URL,
   and continue only after the user says they topped up.

When the user stops partway, deliver the slides narrated so far as in
Delivery, limited to them: `plan --lesson L01 --pages 1-N --audio-only`, where
N is the last slide of the run narrated from slide 1, then run the job path it
prints.

Read the live cards; the bundled client takes the arguments as JSON on
stdin:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

and, before a clone, `{"capability": "voice_clone"}` the same way.

The 600-credit signup gift covers the first slides, about three minutes of
narration. Cloning a voice usually needs a top-up; say so on its card. When a
card carries a `top_up` block, relay its tiers as listed.

## Narration payload

`lesson_kit.py next` prints the exact arguments. They look like this:

```json
{
  "voice": "voice_teacher",
  "input": "这一页讲杠杆的三个要素。先看图上的支点。",
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
that page. Run `retake` for it, which gives it a new ID on the next `next`:

```text
python3 scripts/lesson_kit.py retake "<course>/course.json" --lesson L01 --page 3
```

Then show a new card for that page before submitting it again. Never resend
the failed or canceled request's ID: without `retake`, `next` returns that
same ID again, and it only brings back the finished task.

## First slides

Take the first three to six slides, about three minutes of speech, for
example slides 1 to 4:

```text
python3 scripts/lesson_kit.py estimate "<course>/course.json" --credits-per-1k <live price> --lesson L01 --pages 1-4
```

Estimate those slides, show their card, then narrate slide by slide with
`next --lesson L01` and stop after the last of them. Record each, then make
their tagged copies (see Delivery) and deliver them with their scripts:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --pages 1-4 --audio-only
```

Run the job path that `plan` prints with `node scripts/lesson_run.mjs run`
and deliver `out/L01-p001-004-audio/p001.mp3` … `p004.mp3`. Only when the
teacher asks to see them as video, plan only those slides:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --pages 1-4 --assets assets
```

Run the job path that `plan` prints (its JSON `job`, here
`work/L01-p001-004/render-job.json`) with `node scripts/lesson_run.mjs run`,
and deliver `out/L01-p001-004.mp4`, with its subtitles on screen, and its SRT
beside it (see Subtitles below). A deck made from lecture text
(`init --scripts`) is not rendered.

Ask the teacher to check readings, pace, and voice. Fix a sentence by
editing that slide's script: that slide goes back in `next` with a new ID.
Fix a misread term with a reading in `pronunciations`, which applies to the
whole deck: every narrated slide whose script contains that term goes back
in `next` with a new ID. Before offering a reading change, add it, run
`status` and `estimate`, and tell the teacher how many narrated slides it
re-opens (`status` counts them as `changed`; `estimate` prices them with the
slides still to narrate); remove the entry again if the teacher declines.
`plan` refuses each changed slide until it is narrated again: show a card
for re-narrating the changed slides only.

## The rest of the deck

One card for the remaining slides: how many, and their estimate from
`estimate --lesson L01`, which counts only slides that still need narration,
including any changed since they were narrated. After the card is accepted,
loop `next` → submit → poll → save → `record` until `next` returns
`{"done": true}`. Every slide `next` returns must be on the card; a slide
changed after the card was shown gets a card of its own, and so does a slide
whose task ends `failed` or `canceled` (see Narration payload). Report
progress as the slides finish. On `insufficient_balance` stop the loop at
once: nothing else is submitted, the finished slides stay recorded, relay
that error's message and URL, and after the user says they topped up, `next`
resumes exactly where it stopped.

## The teacher's own voice

When the teacher wants their own voice from the start, clone it before the
first slides so nothing is narrated twice. Consent first: the teacher says the
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
  "display_name": "Course Teacher",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-course-narration-clone"
}
```

Poll to terminal, save the final result to `tasks/clone.json`, and write the
returned `voice_id` into `voice.voice_id`. Every slide already narrated with
another voice then goes back in `next` with a new ID, and `plan` refuses it
until it is narrated again, so the whole deck ends up in one voice. Tell the
teacher and put those slides on the next card.

## Placing audio in PowerPoint or WPS

Copy the delivered files (`out/L01-audio/p001.mp3` …) next to the deck. Each
file's number is its slide's number. In PowerPoint: select the slide,
Insert → Audio → Audio on My PC (Audio from File on a Mac), choose that
slide's file, then on Playback set Start to Automatically and tick Hide During
Show. In WPS: Insert → Audio → Embed Audio, then on the Audio Tools tab that
appears when the audio is selected, set Start to Automatic and tick Hide
During Show. Each slide's audio then plays when that slide appears.

For a show that advances by itself, set each slide's advance time to its audio
length plus half a second (each page's `audio_seconds` in `course.json`): in
PowerPoint, Transitions → After; in WPS, on the Transition tab, tick
automatic advance and enter that time. The WPS labels in Chinese:

```text
插入 → 音频 → 嵌入音频
音频工具 → 开始：自动，勾选 放映时隐藏
切换 → 勾选 自动换片，填入这页音频的秒数加 0.5
视图 → 幻灯片母版
```

The PowerPoint labels in Chinese:

```text
PowerPoint：插入 → 音频 → PC上的音频；播放 → 开始：自动，勾选 放映时隐藏；切换 → 设置自动换片时间
```

A video saved from PowerPoint or WPS carries no AI badge. When the teacher
wants a video, render it here (see Delivery): it carries the badge and the AI
metadata and already times every slide to its narration. If they export from
PowerPoint or WPS anyway, place the bundled `assets/ai-label-zh.png` (or
`assets/ai-label-en.png` for an English deck) in the top-right corner of the
slide master (View → Slide Master in both) so every slide shows it.

## Delivery

Deliver tagged copies of the narration, never the working files in `audio/`.
Once every slide is narrated, make them:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --audio-only
```

Run the job path that `plan` prints (here `work/L01-audio/render-job.json`)
with `node scripts/lesson_run.mjs run`. Each slide's audio is copied without
re-encoding to `out/L01-audio/p001.mp3`, `p002.mp3`, …, labelled as
AI-generated in its metadata. Hand over that folder in slide order with each
slide's script and length, the total minutes from `status`, how to place the
files (the section above), and the summed `billing.net_charged_credits` from
the saved task results, the clone included. Tell the teacher that these files
are AI-generated narration, each tagged as such in its metadata, and that any
video they publish from them must show the AI badge. Only when asked, render
the whole deck:

```text
python3 scripts/lesson_kit.py plan "<course>/course.json" --lesson L01 --assets assets
```

Run the job path that `plan` prints (here `work/L01/render-job.json`) with
`node scripts/lesson_run.mjs run`, deliver `out/L01.mp4`, with its subtitles
on screen, and `out/L01.srt` beside it, and say that the video carries the AI
badge and metadata. A deck made from lecture text alone is delivered as
audio; for a video, AI Courseware Maker builds the deck first.

### Subtitles

Every narrated video shows its subtitles on screen, and the SRT ships beside
the MP4. Drawing them into the picture needs Pillow and a font with the
subtitles' characters on this computer (see
[Lesson video assembly](lesson-video.md)); when `plan` reports either one
missing, follow that reference, and ask the user before installing anything.
When the teacher uploads subtitles to a platform that takes a separate SRT,
or wants clean slides, plan with `--subtitles file`: the picture then has no
subtitles and the SRT is the only subtitle file. When `plan` prints
`warnings`, tell the teacher which characters were left out of the picture
and where (the SRT keeps them), and offer `--font`, `--subtitles file`, or a
reworded script.

## Pointing to another Skill

Use the website wording exactly and install only after the user asks. Send
the line in the user's language:

```text
请安装 数字人讲课；需要登录授权时告诉我：https://beatra.ai/skills/lecture-video-maker/install.md
请安装 微课制作；需要登录授权时告诉我：https://beatra.ai/skills/micro-lesson-maker/install.md
请安装 AI课件；需要登录授权时告诉我：https://beatra.ai/skills/ai-courseware-maker/install.md
Install Lecture Video Maker and tell me when I need to sign in: https://beatra.ai/skills/lecture-video-maker/install.md
Install Micro-Lesson Maker and tell me when I need to sign in: https://beatra.ai/skills/micro-lesson-maker/install.md
Install AI Courseware Maker and tell me when I need to sign in: https://beatra.ai/skills/ai-courseware-maker/install.md
```
