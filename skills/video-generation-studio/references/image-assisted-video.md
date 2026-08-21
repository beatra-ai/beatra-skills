# Image-assisted video

When there is no usable still, the first paid stage is one keyframe with `beatra.images.generate`. That image card is a gift-sized first win. It does not authorize any later video generate, animate, interpolate, reference, edit, or extend call. Use a further still-image stage only when it creates a useful checkpoint for identity, product form, composition, or an exact opening or ending frame. Direct video remains the default only when the user already supplied a usable still, frames, references, or footage.

## Choose the smallest still operation

- Use `beatra.images.generate` when no usable still exists. This required keyframe is the gift-sized first win for a text-led request.
- Use `beatra.images.transform` when one to four ordered supplied images should inform a newly composed shot frame. With `canvas.aspect: "source"`, the last input image anchors the ratio, so order is a real visual and canvas choice.
- Use `beatra.images.edit` when `images[0]` is the base image and one bounded object, region, background detail, wardrobe element, or defect should change. Later images are references. Optional edit regions use normalized coordinates against their declared input image.

Do not generate a substitute for a usable supplied image. Do not transform a base when a bounded edit is sufficient, and do not edit when the user asked for a new composition. A batch of variants is not a default; use the smallest approved result count.

## Inspect and admit sources

Inspect local images before upload. Record actual MIME type, byte size, width, height, aspect ratio, and alpha-channel presence. Upload through:

```text
python3 scripts/mcp_client.py upload ./approved-anchor.png --mime-type image/png
```

Keep existing HTTPS URLs or Beatra artifact references as typed media inputs. Never send a local path to a remote generation tool, and do not treat upload as visual inspection.

Before a paid image call, use `beatra.models.list` for `text_to_image`, `image_to_image`, or `image_edit` as appropriate whenever current availability, input admission, canvas, model, control, output count, or price matters. Compare every actual input fact with the selected live card. Keep `model: "auto"` unless the user selected an eligible concrete model.

## Separate still design from motion direction

The still stage defines stable visual facts:

- identity, product form, wardrobe, props, label, and logo;
- composition, viewpoint, lens feel, and source-derived canvas;
- environment, palette, and light;
- the exact opening or ending state.

The video stage defines temporal behavior:

- subject action and what remains still;
- one primary camera move;
- pacing and transition path;
- evolving atmosphere and audio intent;
- the end state when it is not supplied as an exact frame.

Do not copy a long still prompt unchanged into video. Direct the approved frame rather than asking the video model to redesign it.

## Paid sequence and approval

Image and video generation are separate paid tasks. Before the keyframe, show its own card: route, tool, what the still controls, canvas if set, output count, and provisional live estimate. Do not put the 600-credit video fact on this image card. After the still is delivered, show the video admission card — route and MCP tool name, shortest admitted duration, resolution, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits — and wait for top-up or balance confirmation. One confirmation of the plan, or a request to make the clip, does not authorize the video call.

Use one stable request ID for the image stage and a different stable ID for the video stage. Submit each once. Poll the image task to terminal, deliver and inspect the actual still, then decide whether the downstream payload still matches the plan. If the still changes a material video input or direction, re-plan and show a new video admission card rather than silently continuing.

## Review at the cheapest checkpoint

Before video spend, compare the still with the brief. Inspect recognizable identity, product geometry, labels and logos, hands, framing, wardrobe, background, and light as applicable. State anything the host cannot inspect.

If the image is wrong, change only the failing stage: edit a bounded defect, transform for composition, or make a newly approved render. If the still is right but motion later fails, revise the video direction or use a focused video operation. Do not rerun both stages automatically.

For sequential shots, request `return_last_frame` only when the selected live video card supports it. A delivered last-frame image can become the next shot's strict opening frame after review. It supports continuity but does not assemble separate clips or guarantee seamless motion.
