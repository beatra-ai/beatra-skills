# Courseware workflow

## The course folder

Work in one folder per lesson (`<course>` in the commands): `outline.json`,
`images/`, `tasks/` (saved task results), and the built `.pptx`. Keep a short
list there of each picture's slide, `client_request_id`, and `task_id`; read
the folder at the start of every session instead of asking the teacher to
repeat anything.

When the teacher sends an existing deck or a lesson plan saved as `.pptx`,
read its text and notes first and build the outline from it:

```text
python3 scripts/deck_read.py slides "<their deck.pptx>" --out "<course>/deck.json"
```

When the teacher sends their school's template `.pptx`, it gives content
only: the built deck uses a plain default 16:9 theme and does not keep
theirs. Say so, and that applying the school template afterwards in
PowerPoint or WPS (Design → apply the school's theme) changes the fonts and
colors only: the build places every title and text block in a free text box
on a blank layout, so the text stays where the build put it rather than
moving to the template's title and body positions. Ask whether to skip the
generated background then: it sits on every slide as a picture and would
cover the template's own background.

## Outline

Write `outline.json` (format in [Deck files](deck-files.md)): a title slide,
then the structure of the chosen way, one idea per slide, at most six short
bullets, and the spoken script in `notes`. About 12–15 slides for a 40-minute
lesson; scale with the lesson length within 10–20. Mark each slide that gets a
picture with a short `picture` description of what it shows (the build
ignores that field), usually 4–6 of 12–15 slides: the lead-in, the key
concept, and the summary first. Show it as a numbered list, with the picture
slides marked, and wait for changes. This is free.

Use `title` for the title slide (it shows the background, not an
illustration), `bullets` for text, with `image` to put a picture beside the
text, and the `image` layout for a slide that is mostly picture. Add `image`
and `background` only once the file is saved: `build` refuses a path that
does not exist, and an `image`-layout slide without its picture. Until its
picture is saved, keep every picture slide as `bullets` with its `picture`
marker and at least its title, so each build, the first one included, is a
complete deck; when the file is saved, add `image` and, for a slide planned
as mostly picture, switch its layout to `image`. For example:

```json
{
  "slides": [
    {"layout": "title", "title": "草船借箭", "subtitle": "五年级语文", "notes": "同学们好，今天我们学习《草船借箭》。"},
    {"layout": "bullets", "title": "导入：三天造十万支箭？", "bullets": ["周瑜给诸葛亮出了什么难题？"], "picture": "Straw boats approaching a foggy river bank at dawn", "notes": "先想一想：三天里能造出十万支箭吗？"}
  ]
}
```

### New lesson (default)

A title slide, a lead-in (a question, a picture, or a short story), two or
more new-content slides, one or two practice slides, and a summary; a
homework slide when the teacher wants one. The notes speak to the students.
For an open lesson, put the objectives and the key and difficult points right
after the title. The usual Chinese slide titles:

```text
导入  新授  练习  小结  作业
```

### Lesson-design presentation

For a demo-lesson talk to judges or peers, not a lesson for students: a title
slide, then one or two slides each for the textbook analysis, the learners,
the objectives, the key and difficult points, the teaching and learning
methods, the teaching process, and the board plan. Ask for the textbook
edition and chapter when the teacher has not named them. Write every slide's
`notes` as the teacher speaking to the panel about the design, in the first
person. The usual Chinese slide titles:

```text
说教材  说学情  教学目标  教学重难点  说教法学法  说教学过程  板书设计
```

### Class meeting or parent meeting

Ask for the theme and the class or grade; there is no subject or textbook to
ask for. No exercises. A class meeting: a title slide, the theme and why it
matters now, one talking point per slide (a situation, a question to discuss,
what we agree on), an action list the class commits to, and a closing. A
parent meeting: a title slide, the theme, one talking point per slide (how the
class is doing, learning, safety, working together at home), the action list
for parents, and the teacher's contact and thanks. The notes are what the
teacher says to the students or the parents. The usual Chinese slide titles:

```text
班会：主题  导入  讨论  我们的约定  行动清单  总结
家长会：班级情况  学习情况  安全提醒  家校配合  行动清单  感谢
```

## Style

Agree one style sentence with the teacher before the first card, for example
"flat illustration, soft blue and ochre palette, clean shapes" or a
hand-drawn or watercolor look, suited to the grade. That sentence goes into
every prompt unchanged, so the pictures read as one set. Changing it later is
new paid work for every picture redone in the new style.

## Production cards

Show a card before every image call and wait. Six fields:

1. **Work:** which slides get which pictures (`beatra.images.generate`).
2. **Credits:** the live `text_to_image` price just read, times the count.
   When the card shows a range, because the price depends on the model `auto`
   picks, quote the range and use its maximum as the approval ceiling.
3. **Count:** one charge per picture; each call makes one to four.
4. **Identity:** one new opaque `client_request_id` per call.
5. **If they stop:** the outline and the deck built so far stay usable.
6. **If the balance is short:** relay the official message and top-up URL and
   continue only after the user says they topped up.

Read the live `text_to_image` card before the first card; the bundled client
takes the arguments as JSON on stdin:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

The price per picture depends on the model `auto` picks, so never assume how
many pictures a budget buys. The first card includes as many pictures as fit
the 600-credit signup gift at the maximum of that live price, and at least the
background: the background first, then illustrations in order of importance
(the lead-in, the key concept, the summary). More pictures go on a later card:
the second card lists every remaining picture slide, each with its own ID, and
says that a full set usually needs a top-up. A picture redone or added later,
and a slide whose prompt changed after its card was shown, gets a card of its
own. When a card carries a `top_up` block, relay its tiers as listed.

## Image payloads

One call per picture, `count` 1. Keep the agreed style sentence identical in
every prompt and describe only what the picture shows. The canvas follows
where the picture sits: aspect `1:1` beside bullets, `16:9` for the
background and for an `image`-layout slide. A picture beside the text:

```json
{
  "prompt": "Flat illustration for a primary-school lesson: Zhuge Liang's straw boats approaching a fog-covered river bank at dawn, soft blue and ochre palette, clean shapes, no text, no letters.",
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "1:1"},
  "output_relationship": "independent",
  "client_request_id": "opaque-courseware-s03"
}
```

The background uses the same style with "plain, low-contrast, empty center
for text", and its own ID. When the teacher wants to choose among background
options, one call with `count` up to 4 makes them, and the card counts each
picture. Never ask the model to draw words; slide text stays in the deck.

Submit each payload as the stdin JSON of
`python3 scripts/mcp_client.py call beatra.images.generate`, keep at most two
pictures in flight, and poll with `beatra.tasks.get` until terminal. Save the
final result to `tasks/s03.json`, then:

```text
python3 scripts/deck_build.py fetch-images "<course>/tasks/s03.json" --dir "<course>/images" --name s03
```

It prints the saved paths, for example `<course>/images/s03-1.png` (or
`.jpg` when the model returned JPEG). Paths in the outline are relative to
the outline, so drop the course-folder prefix: set that slide's `image` to
`images/s03-1.png`. For the background, set the top-level `background` the
same way to the chosen file.

If the submit response is lost, find the task with `beatra.tasks.list` and
`beatra.tasks.get` before anything is submitted again; only when neither shows
it, submit again with byte-identical arguments and the same ID. If a task
ends `failed`, nothing is saved for that slide: never resend its ID; show a
new card for that slide and submit a new call with a new ID. When the teacher
asks to stop a picture that is still running, call `beatra.tasks.cancel` with
its `task_id`; a `409` means it keeps running, so keep polling it and submit
nothing in its place. On `insufficient_balance`, stop at once: nothing else
is submitted, the saved pictures and the deck stay, relay that error's
message and URL, and continue only after the user says they topped up.

## Build

After any change, rebuild; it is free:

```text
python3 scripts/deck_build.py build "<course>/outline.json" --out "<course>/<title>.pptx"
```

When python-pptx is missing, ask before installing it (see Deck files).
Check that every slide has its title, text, and notes and that the pictures
sit on the right slides. Look at each saved picture when you can view images:
stray letters, wrong details, or a style that drifted from the set go to the
teacher with the offer of a redo on its own card. When you cannot view them,
say so instead of describing them. Say that fonts follow the teacher's
PowerPoint or WPS theme.

## Delivery

The `.pptx`, the list of slides with their pictures, the `images/` folder,
and the summed `billing.net_charged_credits` of every saved task. Say that
the illustrations are AI-generated and that anything marked for checking
needs the teacher's eye. Offer at most one next step.

## Pointing to another Skill

After the teacher accepts the deck, offer at most one: Course Narration
Studio when they want the slides in their own voice, Micro-Lesson Maker for a
micro-lesson video of this lesson, or Lecture Video Maker for a whole course
of lecture videos. Use the website wording exactly, send the line in the
user's language, and install only after the user asks:

```text
请安装 课件配音；需要登录授权时告诉我：https://beatra.ai/skills/slide-narration-studio/install.md
请安装 微课制作；需要登录授权时告诉我：https://beatra.ai/skills/micro-lesson-maker/install.md
请安装 数字人讲课；需要登录授权时告诉我：https://beatra.ai/skills/lecture-video-maker/install.md
Install Slide Narration Studio and tell me when I need to sign in: https://beatra.ai/skills/slide-narration-studio/install.md
Install Micro-Lesson Maker and tell me when I need to sign in: https://beatra.ai/skills/micro-lesson-maker/install.md
Install Lecture Video Maker and tell me when I need to sign in: https://beatra.ai/skills/lecture-video-maker/install.md
```
