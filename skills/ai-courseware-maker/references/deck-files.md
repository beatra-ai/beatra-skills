# Deck files

The bundled deck scripts read a deck the teacher already has and write a new
editable one. They run on this computer and send nothing anywhere. Run them
from the installed Skill directory.

## Getting one image per slide

The slide images come from the teacher's own PowerPoint or WPS, so the video
shows exactly their slides, fonts, and animations' final frames:

- PowerPoint: File → Export → Change File Type → PNG → All Slides.
- WPS: File → Output as Images (one image per slide), or File → Save as PDF.
- Keynote: File → Export To → Images.

Then:

```text
python3 scripts/deck_read.py pages "<exported folder or deck.pdf>" --out-dir "<course>/pages"
```

Pages come out as `page-001.png`, `page-002.png`, … in slide order, even when
the exported names are numbered without leading zeros, for example:

```text
幻灯片1.PNG  幻灯片2.PNG  …  幻灯片10.PNG
```

A PDF needs PyMuPDF; when it is missing, ask the user before installing it
with `python3 -m pip install --user pymupdf`, or ask for exported images
instead. Choose an empty `pages` folder for each deck; when a course has one
deck per lesson, give each deck its own folder, such as `<course>/pages/L01`
and `<course>/pages/L02`.

## Reading text and speaker notes

```text
python3 scripts/deck_read.py slides "<deck.pptx>" --out "<course>/deck.json"
```

`deck.json` lists each slide's title, visible text, and speaker notes in show
order. Notes are the teacher's own words: use them as the spoken script when
they exist. A slide with no text and no notes reads as empty; ask the teacher
what to say there, or write it from what the slide image shows and mark it for
review. A `.ppt` from old Office must be saved as `.pptx` first.

## Writing a new deck

```text
python3 scripts/deck_build.py build "<course>/outline.json" --out "<course>/<title>.pptx"
```

The outline lists slides in order. Each slide has `layout` (`title`,
`bullets`, or `image`), `title`, optional `subtitle` (title slides),
`bullets` (bullets slides), `image` (a path relative to the outline), and
`notes` (the script for that slide). An optional top-level `background`
image fills every slide. The result is a normal 16:9 deck the teacher edits
in PowerPoint or WPS; fonts follow their theme.

Writing needs python-pptx. When it is missing, ask the user before installing
it with `python3 -m pip install --user python-pptx`.

## Slide images straight from an outline

When the deck was built here from `outline.json` and the teacher kept it as
built, draw its slide images directly, with no export from PowerPoint or WPS:

```text
python3 scripts/deck_build.py render "<course>/outline.json" --out-dir "<course>/pages"
```

Each slide becomes a 1920x1080 `page-001.png`, `page-002.png`, … in the same
boxes as the built deck: titles, bullets, pictures, and the background. It
uses an installed font that has every character of the slides (`--font
<path>` picks one) and needs Pillow, which python-pptx installs. Render into
an empty `pages` folder. When the teacher edited the deck in PowerPoint or
WPS, export the slide images from there instead (Getting one image per
slide), so the video shows their edits.

## Saving generated images

Only Skills that make pictures for the deck use this section; a Skill that
makes no pictures skips it. When such a Skill's picture task finishes, save
its final `beatra.tasks.get` result as JSON, then:

```text
python3 scripts/deck_build.py fetch-images "<course>/tasks/s03.json" --dir "<course>/images" --name s03
```

The images are saved as `s03-1.png`, `s03-2.png`, … (`.jpg` when the model
returned JPEG; WebP is converted to PNG so PowerPoint can place it) for the
outline to use. Only https result URLs are downloaded.
