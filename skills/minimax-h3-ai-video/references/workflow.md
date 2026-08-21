# MiniMax H3 workflow

## Bundled client boundary

Use only this Skill's bundled `scripts/mcp_client.py`. The MCP tool name is a
CLI argument and the JSON tool arguments are sent on standard input:

```text
printf '%s' '{"capability":"text_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector and do not use REST/OpenAPI as
a fallback.

## Read the live H3 card

Before each paid request, call `beatra.models.list` for exactly one route:

- `video_prompt_enhancement` for `beatra.videos.enhance_prompt`;
- `text_to_video` for `beatra.videos.generate`;
- `image_to_video` for `beatra.videos.animate`;
- `frames_to_video` for `beatra.videos.interpolate`;
- `reference_to_video` for `beatra.videos.generate_from_references`.

Select the `minimax-h3` card and verify its availability, controls, media
requirements, duration SKUs, canvas behavior, `output_audio`, and pricing.

## Enhance a video prompt

Use this separate text-only task when a rough brief or multimodal context needs
a production-ready prompt before generation:

```json
{
  "prompt": "A product reveal builds from darkness into warm studio light.",
  "duration": 5,
  "aspect_ratio": "16:9",
  "client_request_id": "opaque-h3-enhance-prompt-id"
}
```

When the brief is rough, run this gift-sized stage first. Show its own
confirmation card, then submit `beatra.videos.enhance_prompt` once. Omit
`model`; any supplied value or type is ignored. Poll the task to a terminal
result, then review or edit the returned text. It never starts video
generation and does not authorize `beatra.videos.generate`,
`beatra.videos.animate`, `beatra.videos.interpolate`, or
`beatra.videos.generate_from_references`. A successful task is charged after
completion from actual input and output tokens; a failed or canceled task is
not charged.

## Generate from a written idea

Use text-to-video when no source media must anchor the image:

```json
{
  "prompt": "Slow dolly push-in toward a centered perfume bottle on black stone. Warm amber backlight reveals the label while a soft glass chime and quiet room tone build toward the final product beat.",
  "model": "minimax-h3",
  "duration": 8,
  "aspect_ratio": "16:9",
  "resolution": "720p",
  "watermark": false,
  "client_request_id": "opaque-h3-text-video-id"
}
```

Submit `beatra.videos.generate` exactly once after the prepaid admission card
and top-up or balance confirmation. Default `duration` is 5 and `resolution`
is `720p`. Send `2k` only when the creator names 2K.

## Animate one strict opening image

Upload the image and use it as frame zero. Omit `aspect_ratio` because the
canvas is source-derived:

```json
{
  "prompt": "A slow orbit reveals the hero product while soft studio reflections travel across its surface. Keep the label centered and sharp. Add a quiet mechanical hum and one crisp click at the reveal.",
  "model": "minimax-h3",
  "image": {"type": "artifact", "artifact_id": "art_opening"},
  "duration": 6,
  "resolution": "720p",
  "watermark": false,
  "client_request_id": "opaque-h3-image-video-id"
}
```

Submit `beatra.videos.animate` exactly once after the prepaid admission card
and top-up or balance confirmation. Default `duration` is 5 and `resolution`
is `720p`. Send `2k` only when the creator names 2K.

## Generate toward a strict closing frame

Upload the required last frame and optionally an opening frame. When both are
present, their dimensions and composition should be compatible. Omit
`aspect_ratio`:

```json
{
  "prompt": "The package rotates smoothly from the opening view into the final front-facing reveal as the light shifts from cool silver to warm gold. A soft rising tone lands on the final frame.",
  "model": "minimax-h3",
  "last_frame": {"type": "artifact", "artifact_id": "art_last"},
  "duration": 7,
  "resolution": "720p",
  "watermark": false,
  "client_request_id": "opaque-h3-frames-video-id"
}
```

Submit `beatra.videos.interpolate` exactly once after the prepaid admission
card and top-up or balance confirmation. Default `duration` is 5 and
`resolution` is `720p`. Send `2k` only when the creator names 2K. The last
image defines the exact closing frame; an optional `first_frame` also fixes the
opening boundary while the model creates the movement between them.

## Generate from ordered creative references

Preserve reference order. Explain each purpose in the prompt and omit `role`
and `reference_voice`:

```json
{
  "prompt": "Create a cinematic product launch. Image 1 is the hero product and keeps its shape, color, and label. Video 1 guides the camera pace and rising energy. Audio 1 guides the rhythm. End on a clean front-facing product moment in warm sunset light.",
  "model": "minimax-h3",
  "references": [
    {"kind": "image", "media": {"type": "artifact", "artifact_id": "art_product"}},
    {"kind": "video", "media": {"type": "artifact", "artifact_id": "art_motion"}},
    {"kind": "audio", "media": {"type": "artifact", "artifact_id": "art_rhythm"}}
  ],
  "duration": 10,
  "aspect_ratio": "adaptive",
  "resolution": "720p",
  "watermark": false,
  "client_request_id": "opaque-h3-reference-video-id"
}
```

Submit `beatra.videos.generate_from_references` exactly once after the prepaid
admission card and top-up or balance confirmation. Default `duration` is 5 and
`resolution` is `720p`. Send `2k` only when the creator names 2K.

## Confirm live quantities and cost

Before any `beatra.videos.generate`, `beatra.videos.animate`,
`beatra.videos.interpolate`, or `beatra.videos.generate_from_references` call,
show the admission card: route, tool, live-card duration, resolution, and
aspect, provisional estimate, the fact that the 600-credit signup gift usually
cannot start this video, the exact URL `https://console.beatra.ai/topup`, and
starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not create
`client_request_id` or submit until the user confirms they have topped up or
already have enough credits for this estimate. On `insufficient_balance`,
relay the returned message, keep that URL exact, and retry the same frozen ID
only after the user says they have topped up.

For text, image, and first/last-frame requests, estimate the one
`output_video_second` meter from the requested duration.

For reference-to-video, total the accepted video-reference seconds and freeze
both quantities:

```text
input video: <accepted seconds> × current input_video_second price / scale
output video: <requested seconds> × current output_video_second price / scale
estimated total: input estimate + output estimate
```

Reference images and audio do not add an input meter. Use only the live card's
current values and report the final task's `billing.net_charged_credits`.

## Upload local media

```text
python3 scripts/mcp_client.py upload ./approved-reference.mov --mime-type video/quicktime
```

Keep the returned artifact ID. A local path never goes directly into a remote
video call, and upload is not visual or audio inspection.

## Monitor one task

Record the returned `task_id` and poll with `beatra.tasks.get`. Keep the same
`client_request_id` only for a byte-equivalent replay after a genuinely unknown
create response. Any creative change receives a new confirmation and identity.
