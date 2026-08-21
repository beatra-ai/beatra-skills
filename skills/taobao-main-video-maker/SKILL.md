---
name: "taobao-main-video-maker"
description: "Create a Taobao product main-image video or Tmall product main-image video from product photos, selling points, and brand references. This AI product video maker builds a product-led opening, detail or use moment, and clean finish for Taobao product listings, Tmall product pages, ecommerce product listing videos, new-product launches, and seasonal campaigns."
---

# Taobao Product Main Image Video Maker

Turn real product photos and seller-supplied product facts into one concise
product-first video for a Taobao or Tmall listing. Shape an immediate product
opening, one detail or use moment, and a clean ending. Keep the product,
packaging, label, colour, and other supplied must-keeps at the centre of every
route.

## Scope and adjacent routes

Use this Skill for a Taobao or Tmall product main-image video whose visual story
starts from a real product photo and stays focused on the merchandise. It fits
new listings, seasonal catalog refreshes, and detail-led products that benefit
from a short product demonstration.

For a spoken, vertical commerce clip, use `product-video-studio`. For static
listing images, use `ecommerce-listing-image-set` or `product-photo-studio`.
For a WeChat Channels product showcase, use `wechat-channels-product-video`.
For editorial work on an existing video, use `beatra-ai-video-studio`.

## Inputs and sensible defaults

The hard input is one real product photo that the host can inspect and that the
user is entitled to use. Ask for it only when it is absent. Reuse product name,
audience, confirmed selling points, packaging, logo, colour, visual references,
and target Taobao or Tmall placement already present in the conversation.

Visible shape, colour, finish, and apparent use may guide the visual direction.
Specifications, price, promotion, certifications, warranty, performance claims,
and availability come from the seller. When only visual facts are available,
continue with a product-led direction and request one seller-supplied fact only
when it changes the product story.

Propose one silent, single-product, single-action clip as the default: `1:1`,
the lowest admitted resolution unless the user named a higher tier, and the
shortest integer duration the selected live card admits, with a recognisable
first frame, restrained motion, and a clean final product view. The current
destination and live model card decide the final canvas, resolution, duration,
and silent-output controls; name the accepted choices in the video admission
card rather than treating the proposal as a platform guarantee.

## Plan the product story first

Make a free plan before paid work:

1. **Opening product view** — show the real product clearly and preserve the
   supplied must-keeps.
2. **Detail or use moment** — show one seller-supplied selling point, visible
   finish, packaging detail, or simple use context.
3. **Clean ending** — return focus to the product with space for the seller's
   listing presentation.

Inspect the local photo's MIME type, byte size, dimensions, aspect ratio,
transparency, and visible product condition. Read the live `image_to_video`
card with `beatra.models.list` before selecting direct animation. Read
`image_to_image`, `reference_to_video`, or `frames_to_video` only when that
route is needed. The selected card is the authority for media, canvas,
resolution, duration, controls, model, and current billing basis.

## Choose the smallest product-preserving route

- **Clean product photo → strict first-frame motion.** Upload the admitted
  photo and use `beatra.videos.animate` when its live `image_to_video` card
  admits the selected silent canvas, resolution, and duration. Its `image` is
  the strict first frame, so retain every product must-keep in the motion
  direction.
- **Photo needs a listing-ready first frame → transform, accept, then
  animate.** Use `beatra.images.transform` with the product artifact first in
  `images` to create the selected canvas. Review the returned first frame when
  accessible, then use the accepted artifact in `beatra.videos.animate`.
- **Product photo plus a motion reference → reference video.** Use
  `beatra.videos.generate_from_references` only after the live
  `reference_to_video` card admits the ordered combination. Put the product
  image first and identify every reference in its real order. This route uses
  the product photo and references as visual guidance; it does not make the
  product image a strict first frame.
- **Accepted first and last product frames → interpolation.** Use
  `beatra.videos.interpolate` when both boundaries are required. If the ending
  frame needs a focused product adjustment, create it with `beatra.images.edit`
  from the accepted first-frame artifact before interpolation.

Choose a live-card route that supports silent output. Pass `generate_audio:
false` only when the selected card supports that control, and never attach
speech, `driving_audio`, an audio reference, or `reference_voice` to this
silent product-display path. When a request combines a strict product opening
with a separate motion-video reference, show the current strict-first-frame
animation and reference-video choices, their live-card admission and prices,
then let the user choose the priority. A changed photo, product must-keep,
reference order, canvas, duration, model, or motion direction is new paid
work.

## Confirm each paid stage

Planning, listing copy direction, local-media inspection, upload, and live-card
comparison are free. Image transform, focused image edit, animation,
reference-video generation, and interpolation are paid.

Before each paid image stage, show that stage's own card. Before each
`beatra.videos.animate`, `beatra.videos.generate_from_references`, or
`beatra.videos.interpolate` call, show a video admission card that freezes:

- product must-keeps and seller-supplied facts used in the direction;
- every source and reference in exact order, with its role;
- selected route, MCP tool name, prompt, first and last-frame handling where relevant;
- live-card-admitted model, controls, canvas, shortest admitted duration,
  lowest admitted resolution unless a higher tier was named, silent-output
  setting, provisional live estimate, the fact that the 600-credit signup gift
  usually cannot start this video, the exact URL `https://console.beatra.ai/topup`,
  and starter ¥29 / 11,000 credits. Do not recommend ¥198.

Planning, listing copy, or “make the clip” is not approval. Do not create a
video `client_request_id` or submit until the user confirms they have topped up
or already have enough credits for this estimate. For a transformed first
frame, confirm paid preparation before the transform. Then review the
accessible returned frame and show a separate video admission card. Treat a
changed approved artifact or frozen argument as new paid work with a new
identifier and a new admission card.

## Execute once through the bundled client

Invoke every remote Beatra operation only through the bundled
`scripts/mcp_client.py`; pass tool arguments as JSON on standard input, and use
its upload command with the detected MIME type for local media.

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"reference_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"frames_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
```

Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI
as a fallback. Submit each frozen paid payload once with its stable ID, save the
create response and task ID, and poll only that task with `beatra.tasks.get`
until it reaches a terminal state.

## Deliver, review, and recover

Deliver the terminal video artifact, resolved model, returned dimensions and
duration, task identity, and `billing.net_charged_credits`. When the host can
view the media, review product opening, shape, colour, label, packaging,
must-keeps, motion stability, silent presentation, and final product view
against the accepted plan. Clearly separate returned task facts from details
the host could not inspect.

If a create response is genuinely unknown, first use `beatra.tasks.list` for
the matching capability and inspect plausible candidates with
`beatra.tasks.get`. Compare the retained payload, media order, model, canvas,
duration, and timing against the local ledger. Replay only a byte-identical
frozen payload with the same original ID when evidence supports an identical
retry. A slow task or lost connection remains the original task. On
`insufficient_balance`, relay the returned message, keep
`https://console.beatra.ai/topup` exact, and retry the same frozen
`client_request_id` only after the user says they have topped up.

Cancel only when the user asks to cancel. Call `beatra.tasks.cancel` once; if
it returns `409`, continue polling the original task and report its terminal
state. A failed stage leaves successfully returned source artifacts available
for a newly approved revision.

## References by task

- Use [the Taobao main video workflow](references/workflow.md) for payloads,
  route selection, confirmations, polling, delivery, and recovery.
- Use [installation and authentication](references/installation-and-auth.md)
  for first install or an expired authorization.
- Use [installation registration](references/installation-registration.md)
  for non-billable package registration.
- Use [tasks and results](references/tasks-and-results.md) to interpret task
  status, artifacts, and terminal results.
- Use [billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for current balances and structured errors.
- Use [Bundled MCP Client diagnostics](references/mcp-connection.md) when the
  packaged client cannot connect.
- Use [automatic updates and safety](references/automatic-updates-and-safety.md)
  for update guarantees and controls.
- Use [uninstall and disconnect](references/uninstall-and-disconnect.md) to
  remove this package or shared credentials.

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24
hours per installation. When a higher version is available, it installs
automatically without separate confirmation. It downloads only from the fixed
official Beatra discovery and immutable CDN paths for this package, channel,
and locale; verifies discovery data, archive, manifest, and every file's size
and checksum before replacement; and replaces only package-owned files. It
rejects redirects, downgrades, mismatched package, channel, locale, or version
data, unexpected URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, and rollback fail open:
the current installation stays usable and the original command continues. An
update failure never authorizes a replacement paid request. The setting persists
across later commands for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check`
reports the official available version without replacing files. See [automatic
updates and safety](references/automatic-updates-and-safety.md).
