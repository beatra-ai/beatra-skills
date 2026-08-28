# Blackboard one-shot workflow

## Build the clip list

Record only teacher-supplied facts. Separate lesson identity when given,
each photo in capture order, the board lines that photo shows,
language, and destination. A missing fact stays a named gap. Do not fill
it from a similar lesson, a remembered formula, or what the photo
"probably" shows.

Default plan: one 2-15s silent clip per named photo. Duration is a
supported integer chosen with the user; if they do not pick, use
5s. Keep capture order on the plan.

## Upload the photos

Inspect each photo first. Upload with its exact MIME type. The helper
completes the upload grant and HTTP PUT, then prints the artifact
reference:

```text
python3 scripts/mcp_client.py upload ./blackboard-01.jpg --mime-type image/jpeg
```

Keep the artifact ID. Never pass a local path to `beatra.videos.animate`.

## Read the live model card

Call `beatra.models.list` with `image_to_video` before choosing model,
duration, or price:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "image_to_video"}
```

Admit each photo on a card that accepts a first-frame image without
`driving_audio`. Use `model: "auto"`. Preserve the photo-derived aspect
ratio by omitting `aspect_ratio`. Compare MIME, dimensions, bytes, and
the chosen duration with advertised constraints.

## Freeze and submit

Show the six-field production card from the root before the first
billable animate. After approval, mint one opaque `client_request_id`
per photo. Submit once:

```text
printf '%s' '{
  "image": {"type": "artifact", "artifact_id": "art-blackboard-01"},
  "prompt": "A restrained camera hold on this blackboard frame. Keep the shown board lines in place. Do not add unstated formulas or spoken lines.",
  "duration": 5,
  "client_request_id": "opaque-blackboard-01"
}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

A changed photo, prompt, duration, or model is new work: new card, new
ID. Keep at most two video tasks in flight. Do not attach
`driving_audio`. Do not invent a stitch, concat, or editor tool.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is
lost, search with `beatra.tasks.list` and match the private ledger
before any replay. Reuse an ID only with byte-identical arguments.
Cancel only when the teacher asks, then wait for a terminal state.

Review visible board identity against the labeled plan. Report unread
small type as unread. Deliver clips in photo order with actual
dimensions, duration, and `billing.net_charged_credits`.
