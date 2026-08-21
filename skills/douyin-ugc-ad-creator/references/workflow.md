# Douyin UGC ad workflow

This workflow produces one short vertical product pitch with an AI creator. It is a product-led presenter route: the product photo shapes the first frame, an approved spoken pitch drives the delivery, and one video task creates the finished clip.

Use the bundled `scripts/mcp_client.py` for every remote Beatra operation. Put the MCP tool name after `call` and JSON arguments on standard input. Do not configure a host Beatra Connector and do not use REST/OpenAPI as a fallback.

## Shape the product and creator brief

Inspect the product photo before upload and keep its exact MIME type, pixel dimensions, aspect ratio, byte size, alpha-channel state, and visible product facts. Upload a local source only through the bundled helper:

```text
python3 scripts/mcp_client.py upload ./product.jpg --mime-type image/jpeg
```

Keep the returned artifact ID. Product facts visible in the image may shape the brief. Claims about specifications, price, results, certifications, discounts, warranty, availability, or promotions must come from the merchant. If a claim is missing, use a different product moment rather than adding a plausible fact.

Choose one concise creator-style angle:

- an unboxing reaction with the product in hand;
- a direct-to-camera first-use recommendation;
- a problem followed by one product demonstration;
- a close feature reveal with a casual creator explanation; or
- a new-product introduction for a store or paid-social campaign.

Use one creator, one setting, one product interaction, one clear hook, and one camera move. A supplied creator reference is optional. When one is present, keep the product source first and the creator reference second in the ordered image inputs. Otherwise describe the desired creator presence in the prompt.

## Live model admission

Before paid work, read the current cards:

```text
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"text_to_speech"}' | python3 scripts/mcp_client.py call beatra.models.list
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

For the first frame, select a live image-to-image route that admits the real ordered image inputs and the confirmed vertical canvas. For narration, verify the requested language, output format, voice, controls, and current price when they affect the selection. For the final video, keep only live image-to-video cards that admit `[image, driving_audio]`, the first-frame facts, the actual narration MIME type and size, and an integer duration that can contain all of the narration.

Do not rely on a model name, format, duration, control, input combination, canvas, or price that is absent from the current card. Do not leave video selection to `auto` when the default does not demonstrably accept the required driving audio.

## Prepare the first frame and narration

Show the complete product claims, creator direction, script, canvas, selected models, voice, and each paid preparation call with its maximum live estimate and stable opaque request ID. This is the preparation confirmation. A clear request to proceed authorizes only the frozen frame, optional focused edit, and narration calls shown in that confirmation.

The normal first-frame request uses the product first. This 9:16 payload is an example; replace the canvas with the confirmed destination before submission:

```json
{
  "images": [
    {"type": "artifact", "artifact_id": "art_product"}
  ],
  "prompt": "A vertical, creator-style opening frame for a Douyin product pitch. One approachable creator holds and demonstrates the supplied product in a simple everyday setting, looking toward the phone camera. Preserve the product's visible shape, colour, label, and material appearance. Natural phone-shot framing, one product interaction, calm background, clear subject, and space for an optional caption added later.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "9:16"},
  "count": 1,
  "model": "the live admitted image-to-image model",
  "client_request_id": "opaque-ugc-first-frame-id"
}
```

If an optional creator reference is admitted by the selected card, add it as the second ordered `images` item and identify its role in the prompt. Do not turn an unadmitted reference into an implied input.

Use `beatra.images.edit` only when an accepted first-frame artifact needs one focused change. Put that accepted artifact at `images[0]`, name no more than two normalized edit regions, and confirm its separate price and request ID before submission.

Write a short pitch with one natural hook, one product moment, one merchant-approved benefit, and one clear recommendation. Select a ready voice with `beatra.voices.list` only when the user has not chosen an available voice. The narration request is:

```json
{
  "voice": "voice_selected",
  "input": "The approved conversational product pitch.",
  "language": "the admitted BCP-47 language when required",
  "format": "mp3",
  "model": "the live admitted text-to-speech model or auto after live verification",
  "client_request_id": "opaque-ugc-narration-id"
}
```

Use `mp3` only when the selected live speech route supports it and the eligible video route accepts the resulting `audio/mpeg`. If the merchant requested another format that the video route does not admit, explain the mismatch before synthesis and obtain a compatible choice. Do not substitute a format silently.

Submit each frozen paid request once. Poll each task with `beatra.tasks.get` to terminal. On narration success, record the real audio artifact, MIME type, duration, and byte size. Present the returned frame and play the returned narration when the host can access them; otherwise say that a visual or audio inspection was unavailable. Ask for approval of accessible preparation before the final video stage.

## Admit and confirm the final video

Refresh the live `image_to_video` cards after preparation. Re-admit the exact approved first frame and narration. Verify all source facts, including first-frame MIME type, dimensions, aspect ratio, byte size, alpha channel, narration MIME type, duration, and size. The selected card must still admit `[image, driving_audio]` and a duration that contains the entire message.

Choose the smallest integer duration at or above the actual narration duration that the selected live model card supports. A fractional narration can leave the shortest unavoidable tail pause or held frame, so include that in the review after delivery.

Show an admission card before any video `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, approved frame and narration, product and creator must-keeps, motion direction, selected model, audio-led duration, resolution if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Approved preparation does not authorize the video. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. Then freeze a new opaque request ID.

```json
{
  "image": {"type": "artifact", "artifact_id": "art_ugc_first_frame"},
  "driving_audio": {"type": "artifact", "artifact_id": "art_ugc_narration"},
  "prompt": "The creator speaks directly to the phone camera while naturally holding or using the product. Keep product visibility, product shape, colour, label, simple everyday setting, conversational energy, subtle hand motion, restrained facial expression, stable framing, and a clean ending.",
  "model": "the live admitted image-to-video model with driving-audio support",
  "duration": 10,
  "client_request_id": "opaque-ugc-video-id"
}
```

Do not set `aspect_ratio` here: the approved first frame governs the source-derived canvas. Submit `beatra.videos.animate` once.

## Poll, deliver, and refine

Record each returned task ID immediately and poll that task alone with `beatra.tasks.get`. `queued` and `running` are progress states. Deliver every actual video artifact or link plus terminal status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

When the host can inspect the video, review product visibility and recognizability, creator delivery, narration presence and ending, motion stability, the confirmed vertical frame, and every user-named must-keep. Report only what is actually visible or audible. If one focused revision would help, identify the smallest changed stage and wait for a new paid confirmation.

## Changes, recovery, and cancellation

The first frame, focused edit, narration, and final video have separate IDs and paid boundaries. A changed product image, creator reference, source order, claim, prompt, script, voice, language, format, model, canvas, duration, or control is new paid work with new approval and a new ID. A video-stage change also needs a new admission card and fresh top-up or balance confirmation. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a creation response is genuinely unknown, retry only the byte-identical frozen payload with the same ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against the private request ledger before considering an identical retry. Recover the original stage before planning replacement work; never duplicate a paid submission or infer a charge, refund, or artifact.

Cancel only on the user's request. Call `beatra.tasks.cancel` once for the known task and confirm the terminal state through `beatra.tasks.get`. A `409` means cancellation was not confirmed, so continue polling that original task and do not create replacement work.
