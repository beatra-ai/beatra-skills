# Comic-drama shot workflow

## Establish the comic-drama shot

Use one approved visual source — a comic panel, manga frame, character sheet, or webtoon page — and one frozen story beat. Record every image's actual MIME type, width, height, aspect ratio, and byte size. Also record the character identity, costume, art style, scene, action, emotion, camera, composition, the frozen story beat, and any user-named must-keeps such as a specific expression, speed-line effect, or dialogue caption.

Build a shot card from these facts: character identity, costume, art style, scene, action, emotion, camera, composition, and the visible end state. Then write one positive prompt that encodes the motion, mood, and landing moment for this single shot. One clear shot event keeps the result legible and reviewable; stacking unrelated action directions in one prompt degrades identity and art-style consistency.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./comic-panel.png --mime-type image/png
python3 scripts/mcp_client.py upload ./character-sheet.jpg --mime-type image/jpeg
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the live video card

Before any paid shot, call `beatra.models.list` with the capability matching the chosen route and inspect the current typed model cards:

- one strict panel → `{"capability":"image_to_video"}`;
- strict first and last panels → `{"capability":"frames_to_video"}`;
- loose references → `{"capability":"reference_to_video"}`;
- no visual source, creating a first frame → `{"capability":"text_to_image"}` first, then `{"capability":"image_to_video"}`.

Require a current card that admits every source image's actual MIME type, dimensions, and byte size. When driving audio is used, confirm the exact image plus audio combination is supported, check the real audio duration, and select the smallest supported integer video duration that contains it in full. Confirm the live duration behavior, aspect-ratio handling, and price basis. Current cards may advertise particular accepted image codecs, reference counts, or duration maximums; these are live facts to read, not permanent constants or a reason to hard-code a model. If any actual fact is unavailable or incompatible, stop before the paid call and request the smallest compatible source change.

Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing. For an original first-frame image, match every `pricing.options` dimension to its admitted request and apply the returned estimate formula to output count only. If admission cannot identify one option in advance, show the live range and use its maximum as the approval ceiling. Do not multiply customer credits by input-image count or keep model names, dimension values, or prices as durable Skill data.

## Build and submit the shot

Omit `aspect_ratio` so the route uses its declared source-derived ratio unless an explicit user decision needs another value and the live model card supports it. The prompt should encode the motion, mood, and landing moment for this single shot, and reference the shot card implicitly through the frozen identity, costume, art style, and scene.

### One strict panel — animate

The normal animate payload is:

```json
{
  "image": {
    "type": "artifact",
    "artifact_id": "art_panel"
  },
  "prompt": "Animate the character turning toward the camera with wind blowing through their hair, keeping the cel-shaded art style and costume unchanged.",
  "client_request_id": "opaque-comic-animate-id"
}
```

### Strict first and last panels — interpolate

```json
{
  "first_frame": {
    "type": "artifact",
    "artifact_id": "art_first"
  },
  "last_frame": {
    "type": "artifact",
    "artifact_id": "art_last"
  },
  "prompt": "The character rises from a crouch into a determined stance, comic speed lines radiating outward.",
  "client_request_id": "opaque-comic-interpolate-id"
}
```

### Multiple loose references — generate from references

When loose character, style, or scene references are used, include them in the typed `references` array as the live card requires. Show the ordered references in the prompt so the model understands each one's role:

```json
{
  "references": [
    {
      "kind": "image",
      "media": {
        "type": "artifact",
        "artifact_id": "art_character"
      }
    },
    {
      "kind": "image",
      "media": {
        "type": "artifact",
        "artifact_id": "art_style"
      }
    }
  ],
  "prompt": "A dynamic entrance shot of the character bursting through a door, matching the reference art style.",
  "client_request_id": "opaque-comic-references-id"
}
```

### No visual source — image stage then animate

Create and approve an original comic first frame through `beatra.images.generate`, then animate the approved image. The image stage is a separate paid stage with its own request ID:

```json
{
  "prompt": "A cel-shaded comic panel: a young swordsman in a tattered cloak standing on a cliff at dawn, determined expression, speed lines in the background, vertical composition.",
  "client_request_id": "opaque-comic-frame-id"
}
```

After the user approves the returned first frame, upload or reference it and call `beatra.videos.animate` with a new request ID for the animation stage.

For every video route, show the admission card before any `client_request_id`: route and MCP tool name, source images, reference media when used, prompt, shortest admitted duration, resolution if set, output count, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A request to make the clip is not approval. An original first-frame image does not authorize the video call. Freeze all arguments and one opaque stable request ID. Submit the chosen video tool exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for each stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. A changed video payload needs a new ID, a new admission card, and fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful shot, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the shot for faces, costumes, drawing style, composition, action readability, mouth movement when applicable, endpoint behavior, and identity continuity across separately generated shots. Generative comic-drama animation does not guarantee frame-exact identity or deterministic art-style preservation. State visible drift and inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
