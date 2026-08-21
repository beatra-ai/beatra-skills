# Video routing and H3 controls

## Route from the supplied creative anchor

| Starting point | Required media | Tool | Canvas behavior |
| --- | --- | --- | --- |
| Rough brief needs a production prompt | optional strict frames or references | `beatra.videos.enhance_prompt` | explicit ratio, or `adaptive` with media |
| Written scene or idea | none | `beatra.videos.generate` | explicit ratio |
| One strict opening image | one image | `beatra.videos.animate` | derived from image |
| Strict closing image | one last image, optional first image | `beatra.videos.interpolate` | derived from frames |
| Ordered creative references | image/video/audio set | `beatra.videos.generate_from_references` | `adaptive` or explicit ratio |

Choose exactly one route. Prompt enhancement returns text and never starts
video generation. A supplied image that must be the first frame belongs to
image-to-video, not loose reference generation. A strict closing frame, with
or without a strict opening frame, belongs to frames-to-video.
Reference-to-video is for creative guidance from one or more ordered images,
videos, or audio clips.

## Shared H3 facts

- Generation model: `minimax-h3`, never `auto`.
- Prompt enhancement omits `model`; any supplied value is ignored.
- Resolution: default `720p`. Send `2k` only when the creator names 2K.
- Count: one MP4.
- Duration: explicit integer 4–15 seconds; default 5.
- Watermark: `false` unless requested.
- Prompt: required, at most 7,000 characters.
- Output audio: model-generated native stereo sound directed through the
  prompt; omit `generate_audio`.

Before each paid request, read the current typed H3 model card through
`beatra.models.list`. The card is the source of truth for live availability,
accepted controls, input requirements, and pricing.

## Canvas rules

Text-to-video accepts `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, and `9:16`.
Use `16:9` when the creator gives no destination or canvas preference.

Image-to-video and strict-closing-frame generation derive the canvas from source
media. Omit `aspect_ratio`; sending an explicit ratio is invalid.

Reference-to-video accepts the same six explicit ratios plus `adaptive`. Use
`adaptive` when the creator has not selected a canvas.

## Reference rules

Reference-to-video accepts at most:

- five images;
- three videos totaling no more than 15 seconds;
- three audio clips totaling no more than 15 seconds;
- eleven references across those per-kind limits.

Audio-only reference sets are valid. Label reference purposes in the prompt
using array order. H3 advertises no semantic reference roles or
reference-voice control, so omit `references[].role` and
`references[].reference_voice`.

## Live estimate and approval

Text, image, and first/last-frame generation bill the requested output seconds.
Reference-to-video bills both accepted reference-video seconds and requested
output seconds. Freeze these quantities separately in the confirmation and
calculate each estimate from the live model card's current meter price and
scale. Accepted reference images and audio add no input meter.

Do not hardcode a Credits price. Report the terminal task's
`billing.net_charged_credits` after execution.

Before `beatra.videos.generate`, `beatra.videos.animate`,
`beatra.videos.interpolate`, or `beatra.videos.generate_from_references`, show
the prepaid admission card: provisional live estimate, the 600-credit signup
gift fact, `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits.
Do not recommend ¥198. A completed `beatra.videos.enhance_prompt` stage does
not authorize those video calls.

## Unsupported H3 branches

Do not route this package to video edit or extend. Do not send negative prompt,
seed, the generation request's `enhance_prompt` control, web search, returned
last frame, driving audio, reference voice, or any other control missing from
the live H3 card. Use the separate `beatra.videos.enhance_prompt` task when the
brief itself needs enhancement.
