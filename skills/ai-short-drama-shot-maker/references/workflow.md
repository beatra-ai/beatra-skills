# Short-drama shot workflow

## Establish the short-drama shot

Use one frozen dramatic beat and any available actor, location, or prop references. Record every image's actual MIME type, width, height, aspect ratio, and byte size. Also record the character identity, costume, location, action, emotion, camera language, blocking, composition, the frozen dramatic beat, and any user-named must-keeps such as a specific gesture, line delivery, or blocking relationship.

Build a shot card from these facts: character identity, costume, location, action, emotion, camera language, blocking, composition, and the visible outcome. Then write one positive prompt that encodes the performance, mood, and landing moment for this single shot. One clear dramatic beat keeps the result legible and reviewable; stacking unrelated performance directions in one prompt degrades actor identity and continuity.

## Upload only local media

The bundled upload helper is only for a local file the host Agent has already inspected:

```text
python3 scripts/mcp_client.py upload ./opening-frame.jpg --mime-type image/jpeg
python3 scripts/mcp_client.py upload ./actor-reference.png --mime-type image/png
```

Keep an existing HTTPS URL or Beatra artifact reference as its typed media input instead. Preserve every returned artifact reference. Never send a local path to a remote tool, and never describe upload as creative review.

For every other Beatra tool, invoke only the bundled `scripts/mcp_client.py`. Put the MCP tool name after `call` as the CLI argument and pass its JSON arguments on standard input:

```text
printf '%s' '{"capability":"image_to_video"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or use a host Beatra Connector and do not use a REST/OpenAPI fallback.

## Preflight the live video card

Before any paid shot, call `beatra.models.list` with the capability matching the chosen route and inspect the current typed model cards:

- text-only beat → `{"capability":"text_to_video"}`;
- one strict opening image → `{"capability":"image_to_video"}`;
- strict opening and ending images → `{"capability":"frames_to_video"}`;
- loose actor, location, or prop references → `{"capability":"reference_to_video"}`.

Require a current card that admits every source image's actual MIME type, dimensions, and byte size. When driving audio is used, confirm the exact image plus audio combination is supported, check the real audio duration, and select the smallest supported integer video duration that contains it in full. Confirm the live duration behavior, aspect-ratio handling, and price basis. Current cards may advertise particular accepted image codecs, reference counts, or duration maximums; these are live facts to read, not permanent constants or a reason to hard-code a model. If any actual fact is unavailable or incompatible, stop before the paid call and request the smallest compatible source change.

Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric cost estimates are provisional, require the current model card and stated assumptions, and never replace terminal billing.

## Build and submit the shot

Omit `aspect_ratio` so the route uses its declared default unless an explicit user decision needs another value and the live model card supports it. For vertical short drama, `9:16` is the typical choice. The prompt should encode the performance, mood, and landing moment for this single shot, and reference the shot card implicitly through the frozen identity, costume, and location.

### Text-only beat — generate

The normal generate payload is:

```json
{
  "prompt": "A cinematic vertical shot: a woman in a red dress stands at a rainy bus stop at night, neon reflections on wet pavement, she turns as headlights approach, suspenseful mood, shallow depth of field.",
  "aspect_ratio": "9:16",
  "client_request_id": "opaque-drama-generate-id"
}
```

### One strict opening image — animate

```json
{
  "image": {
    "type": "artifact",
    "artifact_id": "art_opening"
  },
  "prompt": "Slow dolly-in on the woman as her expression shifts from composure to tears, cinematic shallow depth of field, warm backlight.",
  "aspect_ratio": "9:16",
  "client_request_id": "opaque-drama-animate-id"
}
```

### Strict opening and ending images — interpolate

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
  "prompt": "The man stands up slowly and turns to face the camera, tension building in his posture, cinematic vertical framing.",
  "aspect_ratio": "9:16",
  "client_request_id": "opaque-drama-interpolate-id"
}
```

### Loose actor and location references — generate from references

When loose references are used, include them in the typed `references` array as the live card requires. Show the ordered references in the prompt so the model understands each one's role:

```json
{
  "references": [
    {
      "kind": "image",
      "media": {
        "type": "artifact",
        "artifact_id": "art_actor"
      }
    },
    {
      "kind": "image",
      "media": {
        "type": "artifact",
        "artifact_id": "art_location"
      }
    }
  ],
  "prompt": "The actor walks through the reference location, discovers a letter on the table, reaction close-up, cinematic lighting.",
  "aspect_ratio": "9:16",
  "client_request_id": "opaque-drama-references-id"
}
```

For every route, show the admission card before any `client_request_id`: route and MCP tool name, source images, reference media when used, prompt, shortest admitted duration, resolution if set, output count, provisional estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit until the user confirms they have topped up or already have enough credits for this estimate. A request to make the clip is not approval. Freeze all arguments and one opaque stable request ID. Submit the chosen video tool exactly once.

## Poll, recover, and cancel

Keep a private ledger entry for each stage: logical label, full frozen arguments, stable request ID, approval, creation time, create response, task ID, and terminal result. Record the returned task ID immediately and call `beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and `running` mean wait, not retry.

If the create response is lost, retry only the identical frozen payload with the same ID. If the task ID is lost, call `beatra.tasks.list` with the relevant capability, call `beatra.tasks.get` for plausible candidates, and match returned facts against that stage's private ledger. Recover the original before planning changed work. Never reuse an ID after any argument changes or replace a slow task with a duplicate. On `insufficient_balance`, relay the returned message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen `client_request_id` only after the user says they have topped up. A changed video payload needs a new ID, a new admission card, and fresh top-up or balance confirmation.

Cancel only at the user's request. Call `beatra.tasks.cancel` once for the known task and confirm a terminal state with `beatra.tasks.get`. If cancellation returns 409, continue polling the same task; cancellation remains unconfirmed and does not authorize another cancel or replacement work.

## Deliver and review real results

For a successful shot, deliver every returned video artifact or link and report only actual task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`.

Review only media the host Agent can actually access. Check the shot for actor identity, costume, blocking, performance, camera language, vertical composition, emotional beat, dialogue timing, and continuity notes. Generative drama-shot creation does not guarantee frame-exact identity or deterministic performance preservation. State visible drift and inspection limits honestly. If one focused revision would help, name the smallest change and wait for a new paid approval.
