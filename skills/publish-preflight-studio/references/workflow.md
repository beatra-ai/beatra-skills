# Preflight workflow

Copy becomes three reads, a corrected version, and — when wanted — a cover rendered from the corrected wording. Only the render costs anything, and a run that stops before it is a complete result.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage — the three reads

Run the compliance read first per [screening the copy](compliance-screen.md) and return it before starting the others. It is the read with a deadline, and it is often the whole reason the user came.

Then the audience read and the reach score per [reading it as the audience](audience-read.md), and assemble the corrected copy with its change list.

Deliver all of it before mentioning a cover. The written result stands on its own.

## When a cover is wanted

Two routes, depending on what the user has.

**No existing cover.** Render one from the corrected cover wording with `beatra.images.generate`.

**An existing cover with the old wording.** Upload it with the bundled helper, keep the returned artifact ID, and re-render from it. Use `beatra.images.edit` when the approved layout must survive and only the headline changes — that is the normal case here. Use `beatra.images.transform` only when the user also wants the design reworked.

```text
python3 scripts/mcp_client.py upload ./current-cover.jpg --mime-type image/jpeg
```

Read the live `text_to_image`, `image_to_image`, or `image_edit` card with `beatra.models.list`, matching the route you chose, and check the canvas and count against it. Omit `model` unless the user asked for a specific one.

Establish the uploaded cover's dimensions by inspecting the local file when the host can open it; otherwise record them as user-reported and say so at the gate.

## Approval gate — the render

Show, then freeze:

- the exact corrected wording the cover will carry;
- the canvas, and that changing the ratio later means rendering again;
- the route: a fresh render, or an edit of the uploaded cover;
- the current maximum price and the stable request ID;
- that cover text is generated artwork, so the rendered wording is read back against the approved text.

A clear instruction to proceed counts as approval. Reviewing findings or an unresolved wording choice does not.

## The render — one paid call

```json
{
  "prompt": "A vertical social cover carrying the approved headline text exactly as written, one clear focal subject, high contrast, flat solid background, legible at thumbnail size.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

For the `beatra.images.edit` route, pass the uploaded artifact and keep the prompt focused on the wording change rather than restating the whole design:

```json
{
  "images": [{ "type": "artifact", "artifact_id": "art_current_cover" }],
  "prompt": "Replace the headline text with the approved corrected wording, keeping the existing layout, colours, subject, and composition unchanged.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "source" },
  "count": 1,
  "client_request_id": "opaque-cover-edit-id"
}
```

Submit exactly once.

## Delivering and reviewing

Record the task ID immediately and poll it with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the three reads, the corrected copy as one pasteable block, the change list, the cover with its wording, the task ID, the returned artifact link, the resolved model, the returned dimensions, and `billing.net_charged_credits`. Report only actual returned facts.

When the host can view the returned image, review and say which parts could not be inspected:

- **Wording**, read back against the approved text character by character.
- **Thumbnail legibility.** Whether the headline reads at the size it is actually seen.
- **Preservation**, on the edit route: whether the layout, colours, and subject survived the wording change.
- **Canvas.** The ratio the destination needs.

A cover whose text did not render correctly is reported plainly and offered as a re-render. Do not describe an uninspected cover as correct.

## Recovery

Keep a private ledger for the paid call: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, call `beatra.tasks.list` with the capability you submitted under, call `beatra.tasks.get` on plausible candidates, and match them against the ledger before considering a retry. If the request ID itself is lost, do not invent a new one and do not replay. A slow task is not a failed task. Never replace a running task with a duplicate.

`insufficient_balance` means the request was not started and nothing was charged. The user tops up and the identical request is resubmitted under the same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the cover wording has not been settled;
- the uploaded cover's media facts cannot be established, or fail the live card;
- the user wants wording rendered that the compliance read flagged and no replacement has been agreed.

Do not guess a value, substitute a default silently, or submit to find out.
