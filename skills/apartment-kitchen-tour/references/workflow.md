# Kitchen tour workflow

## Build the shot plan

Record only agent-supplied facts plus what the photo itself shows.
Separate unit identity when given, the market and language, the one move
the agent asked for, and every must-keep. A missing fact stays a named
gap. Do not fill it from a similar unit, a remembered floor plan, or what
the kitchen "probably" has.

Transcribe every legible string in frame verbatim — appliance brand, unit
number, price card, building name. Quote each one on the plan and mark it
to stay unchanged. A string you cannot read is reported unread, not
guessed — and if it is a brand, unit number, or price card, stop and ask
for a cleaner file before planning, as the root instructs.

Write the plan in three beats:

- **0.0s opening state.** Name what is present and, explicitly, what is
  not yet present. A cabinet that must open has to start closed on the
  plan, or the reveal has nowhere to come from — and it needs the
  interior photo before it can be planned at all.
- **Move.** One entry from the camera vocabulary — slow push-in, parallax
  drift, light sweep across the counter — with direction and speed. Keep
  it small. A large movement warps counter edges and cabinet lines.
- **Closing hold.** The frame the clip rests on.

Carry the negatives into the prompt: no film grain, no vignette, no lens
flare, no watermark, no extra text, and no element the photo does not
already contain. A listing clip that adds an appliance or a fixture
misrepresents the unit.

Default plan: one silent 2–15s clip from one photo. Duration is a
supported integer SKU chosen with the agent; if they do not pick, use 5s.

## Upload the photo

Inspect the photo first. Upload with its exact MIME type. The helper
completes the upload grant and HTTP PUT, then prints the artifact
reference:

```text
python3 scripts/mcp_client.py upload ./kitchen.jpg --mime-type image/jpeg
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

Admit the photo on a card that accepts a first-frame image without
`driving_audio`. Use `model: "auto"`. Omitting `aspect_ratio` does not
request the photo's ratio; it leaves the ratio to the card, which may
apply a declared model default, a source-derived ratio, or fixed model
behaviour. Only the second is tied to the photo. On either of the other
two, compare the card's output ratio with the photo's, recorded when you
inspected it, and if they differ, say so before the production card — the
framing will change. Compare MIME, dimensions, bytes, and the chosen
duration with advertised constraints.

## Freeze and submit

Show the six-field production card from the root before the first
billable animate. State the count out loud: one submit is one charge, two
takes are two charges. Choose a live-card route that supports silent
output. Pass `generate_audio: false` only when the selected card supports
that control; omitting it takes the model's own default. After approval,
mint one opaque `client_request_id`. Submit once:

```text
printf '%s' '{
  "image": {"type": "artifact", "artifact_id": "art-kitchen-01"},
  "prompt": "Locked interior of this kitchen. The camera eases in slowly and stops. The room, its fixtures and its layout stay exactly as photographed. All text stays legible, including \"Bosch\", \"Unit 12B\". No film grain, no vignette, no lens flare, no watermark, no extra text, no added elements.",
  "duration": 5,
  "client_request_id": "opaque-kitchen-01"
}' | python3 scripts/mcp_client.py call beatra.videos.animate
```

A changed photo, prompt, duration, or model is new work: new card, new
ID. Three rooms are three cards and three IDs. Do not attach
`driving_audio`. Do not invent a stitch, concat, or editor tool.

## Recover and review

Poll `beatra.tasks.get` after a create response. If the response is lost,
search with `beatra.tasks.list` and match the private ledger before any
replay. Reuse an ID only with byte-identical arguments. Cancel only when
the agent asks, then wait for a terminal state.

Review against the plan: the named move fired, the room stayed as
photographed, nothing was added to the scene, and every quoted string is
still readable at full size. Report unread small type as unread and label
drift as drift. Deliver the clip with actual dimensions, duration, usage,
and `billing.net_charged_credits`.
