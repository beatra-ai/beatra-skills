# Workflow

## Build and submit one cover request

Choose `beatra.images.generate` for a topic-only brief and
`beatra.images.transform` when an exported key-frame screenshot, product,
portrait, or visual reference must shape the cover. Upload local image files
with the bundled client; never treat a video file as an image reference.

Call the remote tool only through the bundled client. For example, provide one
JSON object on standard input to `python3 scripts/mcp_client.py call
beatra.images.generate` or `beatra.images.transform`. Do not use a host
connector or a REST fallback.

The following is a 9:16 example only. Replace the aspect with the confirmed
publishing-surface canvas before requesting paid work.

```json
{
  "prompt": "Vertical short-video cover for a coffee-brewing tutorial. One hand pours into a glass dripper; warm window light; clear hero subject in the lower two-thirds; clean upper-third text-safe area; approachable creator style.",
  "model": "auto",
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "9:16"},
  "client_request_id": "douyin-cover-opaque-request-id"
}
```

For `transform`, add ordered `images` artifact references and state each role
in the prompt. Keep the key frame or source subject first; later references may
guide style or palette only. An accepted cover is edited with
`beatra.images.edit`, fixed as `images[0]`; use zero to two normalized
`edit_regions` on `image_index: 0`.

## Confirmation and recovery

Before submitting, freeze the prompt, canvas, reference order, text treatment,
model, controls, and count in one paid-call confirmation. Create one opaque
stable request ID and submit once. If the creation response is truly unknown,
replay only the identical payload and same ID. If any generation field changes,
obtain a new confirmation and use a new ID.

Poll the returned task through `beatra.tasks.get`. If its ID is lost, inspect
`beatra.tasks.list`, verify a candidate with `tasks.get`, and resume that task.
Only a user-requested cancellation may call `beatra.tasks.cancel`; a `409`
means the original task continues. Deliver only result and billing fields that
the terminal task response actually returns.
