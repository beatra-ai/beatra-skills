# WeChat Channels product-display video workflow

Use this reference after the free plan identifies one real product photo and a
WeChat Channels product-display direction. It defines paid route selection,
live admission, confirmations, execution, recovery, and delivery.

Every remote operation uses the package-owned bundled client only:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
```

Do not configure a host Beatra Connector and do not call REST or OpenAPI as a
fallback. Upload a local file with the bundled helper, retain the returned
artifact ID, and pass that artifact reference—not a local path—to remote tools.

## Free planning and admission

1. Inspect the accessible product photo and retain real MIME type, byte size,
   dimensions, orientation, alpha channel, visible product identity, and known
   limitations. Keep user-confirmed facts separate from visible observations.
2. Use [video-channel planning](video-channel-planning.md) to prepare the
   product opening, one visual detail or use moment, clean ending, title, and
   publishing-copy direction.
3. Upload the admitted product photo through the bundled client and retain the
   artifact ID.
4. Select exactly one route and query its live card before freezing parameters:

| Route | Tool | Capability to query | Input contract |
| --- | --- | --- | --- |
| Clean vertical photo, strict opening | `beatra.videos.animate` | `image_to_video` | `image` is the strict first frame. |
| New vertical first frame then strict opening | `beatra.images.transform`, then `beatra.videos.animate` | `image_to_image`, then `image_to_video` | Product artifact is `images[0]`; accepted result becomes strict `image`. |
| Product plus motion/scene reference | `beatra.videos.generate_from_references` | `reference_to_video` | Ordered references are inspiration, not a strict first frame. |
| Strict first and last visual boundary | `beatra.videos.interpolate` | `frames_to_video` | `first_frame` and `last_frame` are strict boundaries. |

Query `image_edit` only if an approved first frame needs a focused paid edit to
become the strict last frame. The route does not use text-to-video, existing
video editing, or extension.

The current card, not a generic default, decides its admitted model, input
combination, MIME types, file sizes, count, aspect, resolution, duration,
controls, and billing. Keep `model: "auto"` only when the card admits the full
frozen payload. Do not assume automatic video is `9:16`: request exact vertical
parameters only where the selected live card accepts them.

If a card cannot admit `9:16`, `720p`, and five seconds together, show the
supported combinations, billing basis, maximum charge, and resulting calls. Ask
the user to select a revised paid plan. Do not crop, stretch, remove
controls, switch model, reduce media, or split a coordinated request silently.

## Route-specific media rules

### Direct first-frame animation

The uploaded photo must already be a clean, admitted vertical first frame. The
motion prompt preserves exact user must-keeps. Freeze all values in a paid
confirmation, then submit once:

```json
{
  "image": {"type": "artifact", "artifact_id": "art_product"},
  "prompt": "A restrained vertical product-display motion. Preserve the product's shape, colour, label, logo, packaging, and supplied must-keeps; begin with the product clearly visible, make one subtle product-detail or use movement, and end cleanly.",
  "model": "auto only after live-card admission",
  "aspect_ratio": "9:16",
  "resolution": "720p",
  "duration": 5,
  "client_request_id": "opaque-video-id"
}
```

The `image` is strict first-frame input. If the selected card does not accept an
explicit aspect ratio or resolution, do not delete it silently; show the
admitted specification and obtain a new choice.

### Rebuilt vertical first frame

When the original photo needs a distinct vertical composition, first query the
live `image_to_image` card and submit a separately confirmed transform:

```json
{
  "images": [{"type": "artifact", "artifact_id": "art_product"}],
  "prompt": "Create a clean vertical product opening frame. Preserve the product's exact shape, colour, label, logo, package form, and supplied must-keeps. Keep the product fully recognisable and leave calm composition for a user-added title.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "9:16"},
  "count": 1,
  "model": "auto only after live-card admission",
  "client_request_id": "opaque-first-frame-id"
}
```

Present the succeeded frame whenever it is accessible. A user acceptance of the
returned frame is required before the separately confirmed animation stage.
Changing the photo or canvas replaces the dependent first-frame asset and is
new paid work.

### Reference video route

Use a supplied motion, style, or atmosphere video only as a reference. Place
the product artifact first and all later reference images, videos, or audio in
their actual role order. State roles directly in the motion prompt. Before the
confirmation, validate the live card's reference count, media MIME and byte
limits, permitted combination, per-video and total source seconds, output
duration, and `input_video_second` plus `output_video_second` prices.

```json
{
  "references": [
    {"kind": "image", "media": {"type": "artifact", "artifact_id": "art_product"}},
    {"kind": "video", "media": {"type": "artifact", "artifact_id": "art_motion_reference"}}
  ],
  "prompt": "Reference 1 is the product identity: preserve its shape, colour, label, logo, packaging, and must-keeps. Reference 2 supplies only the measured camera-motion and atmosphere direction. Build one vertical product opening, one detail or use moment, and a clean product-display ending.",
  "model": "auto only after live-card admission",
  "aspect_ratio": "9:16",
  "resolution": "720p",
  "duration": 5,
  "client_request_id": "opaque-reference-video-id"
}
```

This does not make the product photo a strict first frame. When a user requires
a strict product opening and a motion reference, present the direct
first-frame and reference routes with their real capabilities and prices and
wait for their choice; never imply that a reference route has strict-frame
guarantees.

### Two strict boundaries

Use interpolation only when the user explicitly needs a strict opening and
ending. An optional last-frame edit starts from the accepted first-frame
artifact and is a separate paid work. Freeze both resulting artifacts and a
`frames_to_video` card before this one paid video request. If that selected live
card accepts explicit output controls, freeze and send `aspect_ratio: "9:16"`
and `resolution: "720p"` as shown below. If the selected card derives output
shape from source frames instead, confirm that **both** approved frames are
already `9:16`, state that source-derived output rule in the confirmation, and
use only its accepted controls. If neither path produces the user's chosen
vertical output, show the admitted choices and obtain a new paid plan rather
than dropping a specification silently:

```json
{
  "first_frame": {"type": "artifact", "artifact_id": "art_first_frame"},
  "last_frame": {"type": "artifact", "artifact_id": "art_last_frame"},
  "prompt": "Move carefully from the clear product opening to the approved product detail or use ending. Preserve all supplied product must-keeps and keep the composition vertical.",
  "model": "auto only after live-card admission",
  "aspect_ratio": "9:16",
  "resolution": "720p",
  "duration": 5,
  "client_request_id": "opaque-interpolation-id"
}
```

## Confirmation and execution

Before each paid image stage, show that stage's own card. Before each
`beatra.videos.animate`, `beatra.videos.generate_from_references`, or
`beatra.videos.interpolate` call, show a video admission card that includes:

- user-confirmed factual copy and all product must-keeps;
- every photo/reference artifact in exact order and its role;
- full visual prompt, route, MCP tool name, strict-boundary handling, model,
  controls, shortest admitted duration, lowest admitted resolution unless a
  higher tier was named, and admitted canvas or output specification;
- provisional live estimate, the fact that the 600-credit signup gift usually
  cannot start this video, the exact URL `https://console.beatra.ai/topup`, and
  starter ¥29 / 11,000 credits. Do not recommend ¥198.

Planning, comparison, or “make my video” is not approval. Do not create a
video `client_request_id` or submit until the user confirms they have topped up
or already have enough credits for this estimate. Use a new admission card and
ID for every changed source, order, role, prompt, product fact, canvas,
duration, model, control, or route. On `insufficient_balance`, relay the
returned message, keep the URL exact, and retry the same frozen ID only after
the user says they have topped up.

After approval, invoke the selected tool with the byte-frozen JSON payload once.
Record its original response and task ID immediately.

## Original-task recovery and cancellation

Keep a private stage ledger holding the frozen payload, approval, opaque ID,
create response, task ID, terminal result, and accepted upstream artifacts.

Only a genuinely unknown create response permits a replay, and it must use the
byte-identical payload and original opaque ID. If a task ID is missing, call
`beatra.tasks.list` for the matching capability, inspect candidates with
`beatra.tasks.get`, and compare the saved sources/order, prompt, model, canvas,
duration, controls, and timing before a replay. Never replace work because it
is slow, connection/authentication/update handling failed, a result is partial,
or a cancellation response is 409.

Poll the original task only through `beatra.tasks.get` until `succeeded`,
`failed`, or `canceled`. `queued` and `running` remain the original job. On an
explicit user cancellation, call `beatra.tasks.cancel` once. For 409, keep
polling the original task and report cancelled only after terminal `canceled`.

## Delivery and review

For a terminal result, report actual returned artifact URL or ID, resolved
model, dimensions, duration, usage, and `billing.net_charged_credits`. If the
host can inspect the video, compare it to the submitted photo and plan:

- product visibility in its opening and ending;
- shape, colour, label, logo, package form, and other user must-keeps;
- stable motion, one intended product/use moment, and the vertical canvas; and
- room for the user's title and publishing-copy presentation.

If visual inspection is unavailable, say so rather than inferring quality from
metadata. Deliver the title and publishing-copy direction alongside the video.
Suggest at most one unexecuted focused
revision; it always needs a new paid confirmation.
