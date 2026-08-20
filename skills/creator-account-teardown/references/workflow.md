# Account teardown workflow

One account becomes an evidence table, a diagnosis, a build template, and one produced first post. One approval gate for production, and everything before it is free — with one exception: an optional account lookup that reads the profile, its posts, and its comments from a handle. That lookup is paid, it runs only when the user asked for it, and it carries its own approval ahead of stage 1. See [reading the account from a handle](account-lookup.md).

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage

Build the evidence table and produce the diagnosis per [reading the account](account-read.md). Produce the template, the opening plan, and the first post per [building your own account](build-template.md).

Then read the live cards. `beatra.models.list` for `text_to_image` admits the canvas and the count for a fresh cover render. The edit route is a separate capability with its own models, controls, and price, so when the user uploaded their own cover or avatar to build from, read `beatra.models.list` for `image_edit` instead and quote that card's price at the gate. `beatra.models.list` for `text_to_speech` admits the selected voice, language, output format, and the current weighted-character price.

From `beatra.voices.list`, freeze one `status: ready` opaque voice ID together with its current supported languages and compatible models.

Everything in this stage is free and revisable. The one paid call that can precede it is the optional account lookup, which the user agreed to and approved on its own. The first post is approved at the end of this stage, before any estimate is shown.

## Uploading the user's own image

When the user wants the cover built from something they already have — their existing cover, their avatar, a product shot — upload it and use the edit route so their layout survives:

```text
python3 scripts/mcp_client.py upload ./current-cover.jpg --mime-type image/jpeg
```

The upload returns an asset the remote tool can read. Use `beatra.images.edit` with it. Without an uploaded source, use `beatra.images.generate`. Choose the route with the user at the confirmation rather than switching silently.

## Approval gate — production

Show the selected route in one block, then freeze:

- the exact cover wording, character for character, and the art direction it will be rendered from;
- whether the cover is a fresh render or an edit of the user's uploaded image;
- the 9:16 canvas, **with the statement that changing the ratio later means producing the cover again**;
- the ready voice ID, language, speech model behaviour, and the approved script;
- both paid calls, each with its current maximum price and stable request ID.

A clear instruction to proceed counts as approval. Planning, comparing options, or an unresolved voice choice does not.

## The paid calls

One `beatra.images.generate` call for the cover, and one `beatra.speech.synthesize` call for the script. Give each its own stable opaque `client_request_id` and submit it exactly once. They are independent; either order is fine.

```json
{
  "prompt": "The cover scene: subject, framing, setting, lighting, mood, and the exact words to render on it.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

```json
{
  "voice": "voice_selected",
  "input": "The approved script, spoken fields only, joined in order.",
  "language": "the admitted BCP-47 language",
  "format": "mp3",
  "client_request_id": "opaque-narration-id"
}
```

When the cover is built from an uploaded image, call `beatra.images.edit` with that asset as `images[0]` and the same frozen wording instead of `beatra.images.generate`. The edit canvas defaults to the base image's own ratio, so state the approved aspect explicitly or the frozen 9:16 will silently not hold:

```json
{
  "prompt": "The frozen cover wording and art direction, applied to the uploaded base image.",
  "images": [
    {"type": "artifact", "artifact_id": "<uploaded-cover-artifact-id>"}
  ],
  "canvas": { "type": "preset", "tier": "2K", "aspect": "9:16" },
  "count": 1,
  "client_request_id": "opaque-cover-id"
}
```

On narration success, read the **actual** returned values: `audio.artifact_id`, `audio.duration_seconds`, `audio.mime_type`, `audio.size_bytes`. A script preview or an expected duration is not a result.

## Delivering and reviewing

Record each task ID immediately and poll that task with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the evidence table with its sources, the diagnosis, the gap read, the build template, the opening plan, the first post's caption, hashtags and script, the rendered cover, and the narration. For each generation task deliver its task ID, the returned artifact links, the resolved model, the returned dimensions and duration, and `billing.net_charged_credits`. An account lookup reports differently — the returned payload, its task ID, its terminal state, and the credits it actually charged — because it has no model, no dimensions and no duration to return. Report only facts the task actually returned.

When the host can view or play the returned media, review and say which parts could not be inspected:

- **Cover wording.** The rendered text read back against the approved wording, character for character.
- **Cover fit.** Whether the subject survives the crop the platform applies.
- **Narration.** Audible presence, clarity, and completion to the last word.
- **Duration.** The real returned length against the budget the script was written to.

State visible drift honestly rather than describing an uninspected result as verified. If one focused change would help, name the smallest one and wait for a new approval — it is new paid work.

## When something is redone

Each paid artifact stands alone.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| The cover wording did not render legibly | That one image call | The narration |
| The narration is too long or mispronounced | Cut the spoken fields, then `speech.synthesize` | The cover |
| The canvas ratio must change | The cover | The narration |
| The first post should be a different post from the plan | The post copy, free, then both calls | The diagnosis and the template |
| The diagnosis read the account wrong | The whole free stage | Nothing paid, if caught before the gate |
| More of the account's posts are needed than one page returned | Another lookup, separately priced and separately approved | Everything already read |
| The account was looked up on the wrong platform or handle | Another lookup, separately priced and separately approved | Nothing — the first read stands as a read of that other account |

## Recovery

Keep a private ledger per paid stage: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, list tasks for that capability, inspect plausible candidates, and match them against the ledger before considering a retry. A slow task is not a failed task. Never replace a running task with a duplicate.

An account lookup goes in the same ledger and recovers the same way, with one difference in how a candidate is identified: list the tasks, then match against the recorded `operation_key`, arguments and `schema_hash` rather than against a prompt and a canvas. Reconcile and inspect before repeating anything; only then replay the byte-identical arguments under the same `client_request_id`. Running the same lookup with any argument changed, the next page included, is a second charge, not a retry. A failed lookup keeps its `error.code` and the platform's own wording in `error.message`; do not call `beatra.models.list` and do not offer a different model, because public social lookup has no `model` field.

`insufficient_balance` means the request was not started and nothing was charged. It is not a failed generation. The user tops up and the identical request is resubmitted under the same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- the evidence is too thin to build an evidence table at all — fewer than a handful of posts and no bio — and one request for more did not resolve it. Offer the lookup as one way to get more, with its price, when the platform has an operation; never present it as the required fix, and never run it to get past this stop without a separate approval;
- the user's own side is unknown, so the template would be a report about someone else;
- a claim the user wants stated about their own subject has not been supplied;
- the cover wording or the script has not been approved as written;
- a media fact cannot be established, or fails the live card.

Do not guess a value, substitute a default silently, or submit to find out. And never fill an unstated metric about the analysed account to make the diagnosis look complete — an honest gap is a finding, and an invented number is the one failure the user cannot recover from.
