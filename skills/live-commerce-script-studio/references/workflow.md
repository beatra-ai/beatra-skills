# Live session workflow

A lineup becomes a schedule, a talk track per product, a line library, a compliance pass, and then the cards and spoken takes the room uses. One approval stage, because nothing produced here depends on an earlier paid artifact.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage

Set the frame and build the schedule per [planning the session](session-plan.md). Write the talk tracks and the line library, then run the compliance pass, per [writing the talk track](talk-track.md).

Show all four pieces together and get them approved. They are free to revise, and every figure that reaches a card comes from them — a price corrected here costs nothing, and a price corrected after a card is rendered costs a paid call.

Read the live cards with `beatra.models.list` for `text_to_image` and `text_to_speech`. From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together with its current supported languages and compatible models, and confirm the requested BCP-47 language, model behaviour, output format, and current weighted-character price against the speech card.

For images and speech, omit `model` unless the user asked for a specific one.

## What gets produced

Two artifact families, both derived from the approved writing.

**Cards.** One talking-point card per featured product, carrying the product name, the two or three approved selling points, the regular price, the live price, and the specification. Plus one countdown card per anchor product, carrying the closing time and a blank slot where the floor manager writes the live remaining count. A rendered image cannot be updated, and stock moves during the slot — bake a quantity in only when it is the fixed release quantity for a held slot. These are what the host glances at and what the floor manager holds up.

**Spoken takes.** The lines that have to land on delivery rather than on wording: the session opening, each anchor product's urgency line, and the countdown. A host hears the intended pace and stress and matches it. Keep takes short — a take is a reference, not a recording of the session.

Do not render a card for every line, and do not synthesize the whole library. Both inflate cost without helping the room.

## Approval gate — production

Show the plan in one block, then freeze:

- every card to be rendered, with the exact figures it will carry;
- every line that gets a spoken take;
- the ready voice ID, language, speech model behaviour, and controls;
- each paid call with its current maximum price and stable request ID;
- that card text is generated artwork, so every figure is read back against the approved schedule after rendering.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved price does not.

## Production — the paid calls

One `beatra.images.generate` call per card and one `beatra.speech.synthesize` call per take. Give each its own stable opaque `client_request_id` and submit it exactly once.

```json
{
  "prompt": "A clean vertical talking-point card for a live selling room: the product name as the heading, three short selling lines beneath it, the regular price struck through above the live price, and the specification in small type at the base. High contrast, large type, flat solid background, readable from across a room.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-card-anchor-id"
}
```

```json
{
  "voice": "voice_selected",
  "input": "The approved urgency line for the anchor product.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "client_request_id": "opaque-take-urgency-id"
}
```

The calls are independent; any order is fine.

On each take's success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`.

## Delivering and reviewing

Record each task ID immediately and poll it with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the schedule, the talk tracks, the line library, the compliance pass, every card with its returned dimensions, every take with its real duration, each task ID, the returned artifact links, the resolved model, and `billing.net_charged_credits`. Report only actual returned facts.

When the host can view or play the returned media, review the following and say which parts could not be inspected:

- **Every figure on every card**, read back character by character against the approved schedule. Generated card text is the one place a wrong number can reach the room without anyone noticing.
- **Legibility.** Whether the type would read at a glance on a phone-sized preview.
- **Takes.** Audible presence, clarity, and completion to the last word.
- **Pace.** Whether the take actually demonstrates the intended delivery rather than only the words.

A card carrying any figure that does not match the approved schedule is not usable in the room. Say so plainly, do not deliver it as ready, and offer the re-render. Do not describe an uninspected card as verified.

When the host cannot view the returned image, state that no figure has been verified and instruct the merchant to check every price, stock figure, and specification on each card against the approved schedule before it enters the room.

## When something is redone

Each paid artifact stands alone.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| A card figure is wrong or illegible | That one `images.generate` | Every other card and every take |
| A take is mispronounced or too fast | That one `speech.synthesize` | The cards and the other takes |
| A price changed before the session | The cards carrying it, and any take stating it | Everything else |
| The schedule was wrong | The written pieces, free, then any card built on the changed rows | Cards on unchanged rows |

## Recovery

Keep a private ledger per paid call: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A slow task is not a failed task. Never replace a running task with a duplicate.

`insufficient_balance` means the request was not started and nothing was charged. It is not a failed generation. The merchant tops up and the identical request is resubmitted under the same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- a featured product has no regular price or live price, or a stock-type urgency line, a held slot's fixed release quantity, or a spoken take stating a quantity is planned without that figure;
- a claim the merchant wants stated has not been supplied;
- a line cannot pass the compliance screen and no acceptable wording has been agreed;
- the selected voice, language, or output format cannot be confirmed against the live speech card.

Do not guess a value, substitute a default silently, or submit to find out.
