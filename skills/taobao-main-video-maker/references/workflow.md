# Taobao main product video workflow

## 1. Admit the product anchor and form a free plan

Use a real, inspectable product photo as the product anchor. Detect its actual
MIME type, byte size, dimensions, aspect ratio, transparency, packaging, label,
colour, and visible condition before upload. The upload grant accepts an exact
MIME type and a size no larger than 100 MiB; use the bundled client upload flow
and retain the returned artifact ID. Uploading supplies an artifact reference;
it does not establish visual facts the host has not inspected.

Reuse seller-provided product facts and must-keeps. Keep a short local ledger
for each planned stage: original media facts, accepted facts, intended canvas,
duration, route, prompt, model, controls, source/reference order, estimated
cost, stable request ID, create response, task ID, and terminal result.

Offer a free product plan before paid work:

| Beat | Goal | Source of the claim |
| --- | --- | --- |
| Opening | Make the real product recognisable immediately. | Product photo and supplied must-keeps. |
| Detail or use moment | Show one visible detail or seller-supplied selling point. | Visible product detail or seller information. |
| Ending | Return attention to the product in a clean final view. | Product photo and listing direction. |

Use one silent product clip by default. Propose `1:1`, `720p`, and `5` seconds,
but select the final values only after the live card for the chosen capability
admits the full combination. For each capability that may be used, call
`beatra.models.list` through the bundled client and record the relevant current
model cards:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"reference_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"frames_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

The live card determines exact model eligibility, input count and order, media
types, supported canvas, resolution, duration, controls, silent-output support,
and billing basis. Use `generate_audio: false` only when the chosen card admits
that control. Do not attach speech, `driving_audio`, an audio reference, or
`reference_voice` to this silent product route.

## 2. Select the visual route

### Direct strict-first-frame animation

Use this route when the product photo is clean and the live `image_to_video`
card admits the requested output. Upload it with its actual MIME type:

```text
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
```

Pass the returned image artifact as `image` to `beatra.videos.animate`. Its
strict first-frame contract makes it the product-preserving default. Describe a
single restrained action such as a gentle push-in, small turn, or light sweep,
and keep packaging, logo, label, shape, and colour in the prompt as must-keeps.

### Prepared listing first frame, then animation

Use this route when the product photo needs a listing-ready canvas, cleaner
composition, or a focused product correction. The product artifact is always
`images[0]` for `beatra.images.transform` and `beatra.images.edit`. For a
transform, retain source order and request `count: 1`; request an aspect and
quality tier only after the live `image_to_image` card admits them. For an edit,
the base is `images[0]`, later images are ordered references, and each image may
have at most two focused regions.

Treat the prepared first frame as its own paid stage. When it succeeds, inspect
the accessible result and let the user accept it before planning the dependent
animation. The accepted artifact becomes `image` for `beatra.videos.animate`.

### Product plus motion reference

Use `beatra.videos.generate_from_references` when the user supplies a separate
motion or atmosphere reference and the live `reference_to_video` card accepts
the exact ordered combination. Put the product image first, then every image or
video reference in real role order. Describe that order in the prompt and set
`role` only when the card lists supported `reference_roles`. This route treats
all ordered references as guidance; it does not make the product photo a strict
first frame.

When the user needs both a strict product opening and a separate video motion
reference, show the current `image_to_video` strict-first-frame route and the
`reference_to_video` route, including live-card admission, effect, pricing, and
call count. Let the user select the goal that matters first before any paid
request is frozen.

### Strict opening and ending frames

Use `beatra.videos.interpolate` when the user needs a specified first and last
product frame. Both frame artifacts require acceptance before the paid video
stage. A focused edit to make an ending frame is a distinct paid preparation
stage; it does not amend the already accepted opening frame.

## 3. Freeze and confirm paid requests

Every transform, edit, animation, reference-video, and interpolation request
is billed. Before an image stage, show that stage's own card. Before
`beatra.videos.animate`, `beatra.videos.generate_from_references`, or
`beatra.videos.interpolate`, present a video admission card with:

```text
Route and MCP tool:
Product must-keeps and permitted seller facts:
Sources and references in exact order:
Prompt and motion direction:
Live-card model, canvas, shortest admitted duration, lowest admitted resolution unless a higher tier was named, and silent-output controls:
Provisional estimate; 600-credit signup gift usually cannot start this video:
Exact top-up URL https://console.beatra.ai/topup and starter ¥29 / 11,000 credits:
Review after completion:
```

Do not recommend ¥198. Planning or “make the clip” is not approval. Create one
opaque `client_request_id` per logical paid request only after the user
confirms they have topped up or already have enough credits for this estimate.
It contains no product, seller, or user information and remains within the
current 1–128 character limit. Changing a source, order, must-keep, prompt,
route, model, canvas, resolution, duration, or control creates new paid work
and requires a new admission card and new ID. On `insufficient_balance`, relay
the returned message, keep `https://console.beatra.ai/topup` exact, and retry
the same frozen ID only after the user says they have topped up.

## 4. Submit, track, and deliver

Use only the bundled client, with JSON on standard input and the remote tool
name as its argument. A direct-animation payload follows this shape after the
live card and paid confirmation freeze its values:

```text
printf '%s' '{"image":{"type":"artifact","artifact_id":"<product-frame>"},"prompt":"<frozen product motion direction>","model":"<live-admitted-model>","aspect_ratio":"<accepted-aspect>","resolution":"<accepted-resolution>","duration":<accepted-seconds>,"generate_audio":false,"client_request_id":"<opaque-stable-id>"}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

Omit any optional field that the selected live card does not admit. Immediately
store the create response and task ID. Poll the original task only:

```text
printf '%s' '{"task_id":"<task-id>"}' | python3 scripts/mcp_client.py call beatra.tasks.get
```

`queued` and `running` retain the same request. At a terminal state, deliver
the returned artifact URL or ID, resolved model, dimensions, duration, usage,
and `billing.net_charged_credits`. When playback or visual review is available,
compare the real output with the accepted product anchor, opening, must-keeps,
motion, silent presentation, and ending. State unavailable inspection plainly.

## 5. Recover without duplicate charges

If a create response is genuinely lost, retain the original frozen payload and
ID. First list matching tasks, then inspect plausible items before considering
the original identical replay:

```text
printf '%s' '{"capability":"image_to_video","limit":50}' | python3 scripts/mcp_client.py call beatra.tasks.list
printf '%s' '{"task_id":"<candidate-task-id>"}' | python3 scripts/mcp_client.py call beatra.tasks.get
```

Compare capability, model, timing, media, order, prompt, canvas, duration,
controls, and the local ledger. Reuse the same ID only for a byte-identical
original request whose creation outcome remains unknown. A slow task, network
failure, expired browser session, update failure, partial result, or a `409`
response is not a replacement request.

Cancel only when the user requests it:

```text
printf '%s' '{"task_id":"<task-id>"}' | python3 scripts/mcp_client.py call beatra.tasks.cancel
```

If cancel returns `409`, continue polling the original task and report its
terminal state. Keep successful stage artifacts for a later, separately
confirmed revision rather than recreating completed work.
