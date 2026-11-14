# Visual direction and source preparation

Build one production brief before any billable image call. The brief should be specific enough to review after delivery, while leaving unsupported controls unset.

## Build the brief

Record:

1. **Message and destination** — what the image must communicate, to whom, and where it will appear.
2. **Subject and must-keeps** — the product, person, object, or scene plus recognizable shape, color, label, logo, text, identity, or layout priorities.
3. **Composition** — framing, camera angle, focal point, subject placement, foreground and background, crop tolerance, and required negative space.
4. **Style and finish** — one coherent visual family and concrete surface qualities.
5. **Light and color** — source, direction, contrast, temperature, mood, dominant colors, and brand colors.
6. **Exclusions and review criteria** — unwanted elements or artifacts and the facts that decide whether the delivered image fits.

Write the prompt as a nonblank natural-language direction, ordered roughly subject, action or change, composition, style, light, color, must-keeps, and exclusions. Avoid contradictory style piles. For transform, name what each ordered source contributes. For edit, describe the needed change and what should remain recognizable.

Must-keeps guide the request and review; they are not guarantees. Generative output may alter faces, anatomy, product geometry, labels, logos, typography, color, texture, layout, or unrelated areas. Keep strict requirements in the brief, use the smallest route, and report actual drift after delivery rather than asking the user to weaken them in advance.

## Inspect source media before upload

The host Agent must visually inspect every accessible source and record its actual:

- MIME type and byte size;
- width, height, and aspect ratio;
- alpha-channel presence; and
- static or animated state.

Do not infer these facts from the filename or upload response. For animation, inspect the live card's frame-selection behavior and disclose whether only one frame is used. An inaccessible source or missing trustworthy media fact blocks a source-dependent paid request until the smallest missing item is supplied.

After inspection and live-card admission, upload each local input once:

```text
python3 scripts/mcp_client.py upload ./source.webp --mime-type image/webp
```

Retain the returned artifact ID. Upload does not inspect, resize, flatten, convert, crop, or approve the image. Never silently change format, remove alpha, select a frame, reduce bytes, or replace a source to force compatibility.

## Preserve source roles and order

For transform, write a private order table before the paid boundary:

| Position | Role | Must-keeps |
| --- | --- | --- |
| Image 1 | Primary product or subject | Shape, color, label |
| Image 2 | Setting or composition | Background structure, camera angle |
| Image 3–4 | Optional style or palette | Named visual qualities |

The exact roles depend on the request. With an explicit preset canvas whose `aspect` is `source`, transform anchors the ratio to the last input, so reorder only with the user's informed choice. Without that explicit source aspect, transform defaults to 2K at 16:9.

For edit, `images[0]` is always the base and later images are references. Its default 2K `source` canvas follows the first image's ratio. Changing the first image changes the job.

## Choose canvas, count, and relationship

Generate and transform default to a 2K 16:9 preset. Edit defaults to a 2K source-derived preset anchored to the base. Set another preset or target canvas only when the destination requires it and the live card accepts it.

A target width and height express desired geometry. The provider may normalize or vary them; the returned image's actual width and height are authoritative. Never report requested dimensions as delivered dimensions.

Request a strict integer count from one through four. Use one when the direction is settled and more only when the user wants alternatives or a planned set. Generate and transform may use `independent` or, when the live card supports it, `sequence`; edit has no `output_relationship`. A relationship is not a promise of series consistency. Review each output separately.
