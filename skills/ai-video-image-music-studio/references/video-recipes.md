# Video recipes

Use current models, constraints, and prices from `beatra.models.list`. Admit the
complete payload, write the shortest admitted duration (audio-led and extend
rules unchanged), and show the video admission card before creating
`client_request_id` or submitting `beatra.videos.generate`,
`beatra.videos.animate`, `beatra.videos.interpolate`,
`beatra.videos.generate_from_references`, `beatra.videos.edit`, or
`beatra.videos.extend`. The card must include route, tool, duration, resolution
if set, provisional estimate, the fact that the 600-credit signup gift usually
cannot start this video, the exact URL `https://console.beatra.ai/wallet?intent=buy`, and
starter ¥29 / 11,000 credits. Do not recommend ¥198. “Make the clip” is not
approval. Example `duration` and `resolution` values below are placeholders;
replace them with the shortest admitted duration and lowest admitted resolution
unless the user named a higher tier. After confirmation, create one opaque
`client_request_id`, call the selected billable tool exactly once, and poll
with `beatra.tasks.get`.

For local media, use only the dedicated bundled upload command. It validates
the `beatra.assets.upload` grant and completes the upload internally:

```bash
python3 scripts/mcp_client.py upload ./input.png --mime-type image/png
```

The command returns a media reference such as
`{"type":"artifact","artifact_id":"art_..."}`.
Do not replace it with an ordinary raw-tool call, host HTTP, or a hand-written
grant and PUT sequence.

## Generate from text

Call `beatra.videos.generate`:

```json
{
  "prompt": "A slow dolly toward a ceramic cup in warm window light",
  "model": "auto",
  "resolution": "720p",
  "aspect_ratio": "16:9",
  "duration": 6,
  "generate_audio": true,
  "client_request_id": "vid-text-opaque-1"
}
```

## Animate one opening image

Call `beatra.videos.animate`:

```json
{
  "prompt": "The subject looks toward camera while the camera eases forward",
  "image": { "type": "artifact", "artifact_id": "art_first" },
  "resolution": "720p",
  "duration": "auto",
  "return_last_frame": true,
  "client_request_id": "vid-animate-opaque-1"
}
```

Add `driving_audio` only when discovery says the selected model supports that input.

## Generate toward a required last frame

Call `beatra.videos.interpolate`:

```json
{
  "prompt": "The product rises and rotates smoothly between the two views",
  "first_frame": { "type": "artifact", "artifact_id": "art_start" },
  "last_frame": { "type": "artifact", "artifact_id": "art_end" },
  "resolution": "720p",
  "duration": 6,
  "client_request_id": "vid-frames-opaque-1"
}
```

`last_frame` is required. Omit `first_frame` when the selected live model card
admits last-frame-only generation.

## Generate from multimodal references

Call `beatra.videos.generate_from_references`:

```json
{
  "prompt": "Video 1 presents Image 1 in a bright studio while preserving the music rhythm",
  "references": [
    {
      "kind": "image",
      "media": { "type": "artifact", "artifact_id": "art_product" }
    },
    {
      "kind": "video",
      "media": { "type": "artifact", "artifact_id": "art_presenter_video" }
    },
    {
      "kind": "audio",
      "media": { "type": "artifact", "artifact_id": "art_music" }
    }
  ],
  "resolution": "720p",
  "aspect_ratio": "adaptive",
  "duration": 6,
  "client_request_id": "vid-refs-opaque-1"
}
```

Use `animate` instead if one image must be the exact opening frame.

## Edit an existing clip

Call `beatra.videos.edit`:

```json
{
  "source_video": { "type": "artifact", "artifact_id": "art_source_video" },
  "instruction": "Replace the cup with the blue bottle in Image 1 and keep the camera move",
  "references": [
    {
      "kind": "image",
      "media": { "type": "artifact", "artifact_id": "art_blue_bottle" }
    }
  ],
  "model": "auto",
  "resolution": "1080p",
  "duration": 8,
  "generate_audio": true,
  "client_request_id": "vid-edit-opaque-1"
}
```

## Extend after one clip

Call `beatra.videos.extend`:

```json
{
  "video": { "type": "artifact", "artifact_id": "art_source_clip" },
  "direction": "after",
  "instruction": "Continue the camera move until the train enters the tunnel",
  "resolution": "720p",
  "duration": 12,
  "client_request_id": "vid-extend-after-opaque-1"
}
```

For footage before one clip, use the same `video` field with `direction: "before"`. Do not use
`last_frame` on extension; strict frame-to-frame generation belongs to `interpolate`.
