# Character-image workflow

## Select the image route

Use the live model card to select one route that matches the requested result:

- **Original anchor:** `beatra.images.generate` turns the approved character
  brief into one to four new anchor concepts.
- **New character scene:** `beatra.images.transform` turns one to four ordered
  character references into a new pose, expression, or scene.
- **Focused anchor adjustment:** `beatra.images.edit` keeps the accepted anchor
  in `images[0]` and makes a bounded adjustment; later images remain ordered
  references.

References guide visible identity traits but do not establish pixel-level or
cross-generation absolute consistency. Put the user-confirmed face,
silhouette, costume, palette, and signature props in the request as must-keeps
and review the returned image for any visible drift.

Before any paid call, read `beatra.models.list` for the selected capability.
Verify source count, source transport, canvas, output count, relationship,
controls, and current per-successful-image price. When a user asks for a set,
make the requested count explicit and keep it within the current live-card
limit. Do not silently split one approved card into extra paid tasks.

## Freeze and submit

Show the complete brief, each source image in order with its role, anchor or
base-image choice, must-keeps, scene direction, canvas, count, controls, model
behavior, and maximum price. After paid approval, freeze every argument and
submit the chosen route once through the bundled client.

An original-anchor request can use:

```text
printf '%s' '{"prompt":"Create the approved original character anchor with the stated face, silhouette, outfit, palette, and style.","count":1,"client_request_id":"opaque-anchor-id"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

A reference-guided scene can use:

```text
printf '%s' '{"images":[{"type":"artifact","artifact_id":"art_front"},{"type":"artifact","artifact_id":"art_full_body"}],"prompt":"Create the approved new character scene. Preserve the character's visible face, silhouette, costume palette, and signature prop while changing only the requested pose and setting.","count":1,"client_request_id":"opaque-scene-id"}' | python3 scripts/mcp_client.py call beatra.images.transform
```

An accepted anchor can receive a focused edit through `beatra.images.edit` with
that anchor first. Keep every paid stage's request ID distinct. A chosen anchor
followed by a scene is two user-visible paid stages: show and approve the anchor
result before freezing the scene request.

## Track, inspect, and continue

Record the returned task ID and poll only that task with `beatra.tasks.get`.
If the ID is unavailable, use `beatra.tasks.list` to identify candidates and
confirm each candidate with `tasks.get` against the frozen request. Retry a
lost create response only with the identical arguments and original stable ID.

For accessible returned images, inspect the visible face, silhouette, hair,
costume, palette, signature props, style, pose, scene, text rendering, and
actual dimensions against the named must-keeps. Deliver the returned artifact
references together with observed terminal facts and any visible drift. Keep
user-approved images as references for later scenes only when the user has
chosen a project location for them; otherwise return their artifact references
and ordered roles. A new scene or focused correction requires a new brief,
approval, and paid request.

When the user asks to cancel, call `beatra.tasks.cancel` once and confirm the
task state through `beatra.tasks.get`. A nonterminal or unconfirmed cancellation
continues as the original task; it does not authorize a duplicate request.
