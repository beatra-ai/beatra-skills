# Music video clip workflow

## Establish the music video clip

Use one accessible short music excerpt and one visual direction. Record the audio's actual MIME type, byte size, and real duration. Record every image's actual MIME type, width, height, aspect ratio, and byte size. Also record the hook or energy, dominant mood, pulse, visual motif, subject, movement, palette, camera, opening image, landing image, and any user-named must-keeps such as a specific scene, color, or visual effect.

Build a compact audio-visual map from these facts: hook or energy, dominant mood, pulse, visual motif, subject, movement, palette, camera, opening image, and landing image. Then write one positive prompt that encodes the visual response to the music for this single clip. One clear audio-visual concept keeps the result legible and reviewable; stacking unrelated visual directions in one prompt degrades mood and motion coherence.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./song-excerpt.mp3 --mime-type audio/mpeg
python3 scripts/mcp_client.py upload ./cover-art.png --mime-type image/png
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"text_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Gift one cover when no still exists

A cover or opening still is not a hard input. When the visual direction exists and no usable cover or opening still is present, generate exactly one cover or keyframe with `beatra.images.generate`. Call `beatra.models.list` with `{"capability":"text_to_image"}` first. Show that image stage's own confirmation card. Freeze one opaque image-stage `client_request_id` and submit once:

```text
printf '%s' '{"prompt":"Album-cover keyframe of a neon-soaked night drive through rain, cinematic teal-and-magenta palette.","count":1,"client_request_id":"opaque-mv-cover-id"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

Poll that image task to terminal, deliver the still, and inspect it. This gift-sized stage does not authorize any video tool. After the still is approved, prefer `beatra.videos.animate` with driving audio when it should be the opening frame.

## Preflight the live video card

Before any paid clip, call `beatra.models.list` with the capability matching the chosen route and inspect the current typed model cards:

- text plus compatible driving audio → `{"capability":"text_to_video"}`;
- strict cover art or portrait opening → `{"capability":"image_to_video"}`;
- strict opening and ending art → `{"capability":"frames_to_video"}`;
- audio as loose mood reference → `{"capability":"reference_to_video"}`.

Require a current card that admits the audio's actual MIME type, byte size, and real duration, and every source image's actual MIME type, dimensions, and byte size. Inspect the real audio duration and write the smallest admitted whole-second video `duration` at or above that length. Do not shorten the track to cheapen the clip. Do not omit `duration` on `model=auto` or hard-code 8 / 10 / 15 when a shorter admitted integer still contains the excerpt. Confirm the live duration behavior, aspect-ratio handling, driving-audio support, and price basis. Current cards may advertise particular accepted audio codecs, image codecs, reference counts, or duration maximums; these are live facts to read, not permanent constants or a reason to hard-code a model. If any actual fact is unavailable or no card admits a duration that contains the excerpt in full, stop before the paid call and request the smallest compatible source change.

Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Build and submit the clip

Omit `aspect_ratio` so the route uses its declared default unless an explicit user decision needs another value and the live model card supports it. The prompt should encode the visual response to the music for this single clip, and reference the audio-visual map implicitly through the frozen mood, motif, and palette.

Before creating a video `client_request_id` or submitting `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, or `beatra.videos.generate_from_references`, show the admission card with every field: route, tool, duration, resolution if set, aspect if set, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate.

### Text plus driving audio — generate

The normal generate payload is:

```json
{
  "prompt": "A neon-soaked night drive through a rain-streaked city, reflections shimmering on the windshield, the beat syncing with passing streetlights, cinematic teal-and-magenta palette.",
  "audio": {
    "type": "artifact",
    "artifact_id": "art_song"
  },
  "duration": 10,
  "client_request_id": "opaque-mv-generate-id"
}
```

### Strict cover art or portrait with driving audio — animate

```json
{
  "image": {
    "type": "artifact",
    "artifact_id": "art_cover"
  },
  "prompt": "The cover art comes alive: light blooms across the frame, particles drift upward, the subject's eyes slowly open in time with the music.",
  "driving_audio": {
    "type": "artifact",
    "artifact_id": "art_song"
  },
  "duration": 8,
  "client_request_id": "opaque-mv-animate-id"
}
```

### Strict opening and ending art — interpolate

```json
{
  "first_frame": {
    "type": "artifact",
    "artifact_id": "art_open"
  },
  "last_frame": {
    "type": "artifact",
    "artifact_id": "art_end"
  },
  "prompt": "A surreal transition from a desolate moonlit shore to a vibrant sunrise festival, the energy building with the music.",
  "driving_audio": {
    "type": "artifact",
    "artifact_id": "art_song"
  },
  "duration": 10,
  "client_request_id": "opaque-mv-interpolate-id"
}
```

### Audio as loose mood reference — generate from references

When audio is used as a loose mood reference alongside visual references, include them in the typed `references` array as the live card requires. Show the ordered references in the prompt so the model understands each one's role:

```json
{
  "references": [
    {
      "kind": "audio",
      "media": {
        "type": "artifact",
        "artifact_id": "art_song"
      }
    },
    {
      "kind": "image",
      "media": {
        "type": "artifact",
        "artifact_id": "art_mood"
      }
    }
  ],
  "prompt": "A dreamlike sequence of a dancer moving through shifting colored smoke, the visuals guided by the song's energy and the mood reference palette.",
  "duration": 10,
  "client_request_id": "opaque-mv-references-id"
}
```

For every route, show the exact audio, source images, reference media when used, prompt, selected duration, model behavior, explicit controls, output count, and the prepaid admission card. Freeze all arguments and one opaque stable request ID. Submit the chosen video tool exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for each stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate.

On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

Any change to music excerpt, visual direction, cover, prompt, model, duration, aspect ratio, or another control creates new logical paid work. Assign a new request ID, show a new admission card (including the 600-credit fact, exact top-up URL, and starter ¥29), and obtain fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful clip, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the clip for visual response to the music, motion, mood, subject stability, presence and handling of the track, ratio, and actual duration. Generative music-video creation does not guarantee deterministic beat synchronization or exact audio presence in the returned file. State visible drift and inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
