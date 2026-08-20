# Script studio workflow

A product becomes a fact sheet, a segment table, the narration in full, the product-link beats, and a six-dimension score. Storyboard frames and a voiced narration are produced on top of that when the user wants them, behind one approval stage, because nothing produced here depends on an earlier paid artifact.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage

Build the fact sheet, choose the structure, time the segments, write the segment table and the continuous narration, and score the draft per [structuring the script](script-structure.md). Place the three link beats per [placing the product-link beats](product-link-beats.md).

Show all of it together — the fact sheet with its named gaps, the segment table, the narration, the beats against their segments, and the score with its weakest dimension called out. It is free to revise, and every figure that could later reach a rendered frame comes from here.

A run that ends at this point is complete. Do not push toward paid production; offer it once, plainly, and let the user choose.

When the user does want media, read the live cards with `beatra.models.list` for `text_to_image` and `text_to_speech`. From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together with its current supported languages and compatible models, and confirm the requested BCP-47 language, model behaviour, output format, and current weighted-character price against the speech card.

For images and speech, omit `model` unless the user asked for a specific one.

## What gets produced

Two optional artifact families, both derived from the approved script.

**Storyboard frames.** One frame per segment the user marks — usually the opening and the segments where the product is shown or compared, not every row. A frame is a shooting reference: it fixes framing, subject placement, and what is in shot, so the person filming knows what to point the phone at. Frames come back as stills for the user's own shoot and edit.

**Voiced narration.** The continuous narration read at pace in a selected voice. A creator uses it to hear the intended rhythm before filming, or lays it under an edit as the track. Synthesize the approved continuous version, not the table.

Do not render a frame for every segment and do not voice each line separately. Both inflate cost without helping the shoot.

## Approval gate — production

Show the plan in one block, then freeze:

- every segment that becomes a frame, and what that frame will show;
- whether the narration is voiced, and which version is read;
- the ready voice ID, language, speech model behaviour, and controls;
- each paid call with its current maximum price and stable request ID.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved fact does not.

## Production — the paid calls

One `beatra.images.generate` call per frame and one `beatra.speech.synthesize` call for the narration. Give each its own stable opaque `client_request_id` and submit it exactly once.

```json
{
  "prompt": "A vertical storyboard frame for a phone-shot selling video: the opening segment, the presenter holding the product at chest height in a bright home kitchen, product label facing camera, plain background, natural daylight, waist-up framing with headroom for a caption.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-frame-opening-id"
}
```

```json
{
  "voice": "voice_selected",
  "input": "The approved continuous narration, punctuated for breath.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "client_request_id": "opaque-narration-id"
}
```

The calls are independent; any order is fine.

On the narration's success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`. Compare the real duration against the script's target and report the difference rather than restating the target.

## Delivering and reviewing

Record each task ID immediately and poll it with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the fact sheet, the segment table, the narration, the link beats, the score, every frame with its returned dimensions, the narration audio with its real duration, each task ID, the returned artifact links, the resolved model, and `billing.net_charged_credits`. Report only actual returned facts.

When the host can view or play the returned media, review the following and say which parts could not be inspected:

- **Frame against segment.** Whether each frame shows the subject, action, and framing the segment was written for.
- **Vertical fit.** Whether the composition holds in a 9:16 phone frame with room for a caption.
- **Narration.** Audible presence, clarity, completion to the last word, and whether the pace matches the timing the segments assumed.

Any text a frame happens to render is generated artwork rather than typeset copy. Read it back against the script and say plainly when it is wrong or illegible — a crisply rendered wrong word is the dangerous case.

## When something is redone

Each paid artifact stands alone.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| A frame does not match its segment | That one `images.generate` | Every other frame and the narration |
| The narration is mispronounced or too fast | That one `speech.synthesize` | Every frame |
| A supplied fact changed | The script, free, then any frame or narration carrying it | Frames on unchanged segments |
| The structure was wrong | The written pieces, free | Nothing paid, if the rewrite happens before production |

## Recovery

Keep a private ledger per paid call: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A slow task is not a failed task. Never replace a running task with a duplicate.

`insufficient_balance` means the request was not started and nothing was charged. It is not a failed generation. The user tops up and the identical request is resubmitted under the same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the script has not been approved, or a figure in it is still unresolved;
- a claim the user wants stated has not been supplied;
- a line cannot pass the claim screen and no acceptable wording has been agreed;
- the selected voice, language, or output format cannot be confirmed against the live speech card.

Do not guess a value, substitute a default silently, or submit to find out.
