# Article workflow

A topic becomes title candidates, a digest, a body, and the whole image set. One approval covers the writing and the image plan together, and it is the only gate before the paid calls.

Invoke every remote Beatra tool through the bundled client only. The tool name is the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"capability":"text_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Upload a brand reference with the bundled helper, and keep the returned reference:

```text
python3 scripts/mcp_client.py upload ./brand-reference.jpg --mime-type image/jpeg
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or OpenAPI. Never pass a local path to a remote tool.

## Free stage

Write the article per [writing the article](article-craft.md), screening the copy in the same pass. Then plan the images per [planning the images](visual-set.md), placing each in-body image against a specific paragraph.

Read the live `text_to_image` card with `beatra.models.list` — or the `image_to_image` card when a brand reference was uploaded to anchor the look — and check the canvases and count against it. Omit `model` unless the user asked for a specific one.

Nothing in this stage costs anything, and all of it is free to revise.

## The single approval gate — the writing and the image set

There is one gate, and it covers the writing and the image plan together. No second gate follows it, because no image here depends on another. Show it all in one block, then freeze:

- the title candidates with the recommendation marked, the digest line, and the body;
- the cover at 2.35:1, and whether it carries text;
- each in-body image with the paragraph it serves and its ratio;
- the shared look sentence that appears in every prompt;
- each paid call with its current maximum price and its own stable request ID;
- that any rendered cover text is generated artwork and will be read back against the approved title.

Every prompt is built from the approved text, so a paragraph rewritten after rendering means rendering that paragraph's image again.

A clear instruction to proceed counts as approval. Reviewing the draft or an unresolved title choice does not. After approval the next step is the paid calls; changing an approved argument afterwards is new paid work under a new request identifier and needs fresh approval.

## Production — the paid calls

One `beatra.images.generate` call per image. Give each its own stable opaque `client_request_id` and submit it exactly once. One identifier belongs to exactly one set of frozen arguments: replaying an identifier with different arguments is rejected, so the cover rendered from a prompt and the cover rendered from a brand reference are two different payloads and carry two different identifiers. The identifiers below are placeholders — generate real opaque ones.

```json
{
  "prompt": "A wide editorial cover image: one clear focal subject placed off-centre with room around it. Shared look: warm neutral palette of sand, ink, and a single muted teal accent, soft directional daylight from the left, literal photographic scenes, mid distance.",
  "canvas": { "type": "target", "width": 1880, "height": 800 },
  "count": 1,
  "client_request_id": "opaque-cover-generate-id"
}
```

```json
{
  "prompt": "The scene described by the paragraph this image follows, framed at mid distance with the subject reading clearly at column width. Shared look: warm neutral palette of sand, ink, and a single muted teal accent, soft directional daylight from the left, literal photographic scenes, mid distance.",
  "canvas": { "type": "preset", "tier": "2K", "aspect": "16:9" },
  "count": 1,
  "client_request_id": "opaque-body-1-id"
}
```

A `canvas` is either `{"type":"preset"}` with a `tier` of `1K`, `2K`, or `4K` and an integer `aspect`, or `{"type":"target"}` with explicit `width` and `height`. There is no other canvas type. The cover ratio 2.35:1 is therefore written as the aspect `47:20`, or as `{"type":"target","width":1880,"height":800}`. `aspect` components must be integers, so never pass the string `2.35:1`. Read the card's supported ranges before choosing dimensions. When a brand reference was uploaded, pass it through `beatra.images.transform` instead so the anchor image governs the look. Its `images` field is an ordered list of one to four artifact refs, and the canvas must stay the article's own ratio — do not use `aspect: "source"`, which would inherit the reference's shape:

```json
{
  "images": [{ "type": "artifact", "artifact_id": "art_brand_reference" }],
  "prompt": "The scene for this image, rendered in the palette, light, and level of abstraction of the supplied reference. Shared look: <the shared look sentence>.",
  "canvas": { "type": "target", "width": 1880, "height": 800 },
  "count": 1,
  "client_request_id": "opaque-cover-transform-id"
}
```

Repeat the shared look sentence verbatim in every prompt. Paraphrasing it is how a set drifts.

The calls are deliberately independent, one per image, rather than one coordinated request: the cover is 2.35:1 while the in-body images are not, so no single call can span the set, and independence is what lets one image be redone alone.

## Delivering and reviewing

Record each task ID immediately and poll it with `beatra.tasks.get` until terminal. `queued` and `running` mean wait.

Deliver the title candidates with the recommendation marked, the digest, the body, the cover, each in-body image in reading order with the paragraph it serves, the returned dimensions, and `billing.net_charged_credits`. Report only actual returned facts.

When the host can view the returned images, review and say which parts could not be inspected:

- **Set consistency.** Whether the images read as one article rather than several sources.
- **Paragraph match.** Whether each in-body image answers the paragraph it was placed against.
- **Cover at feed size.** Whether the focal subject survives a small, cropped presentation.
- **Cover wording**, when the cover carries text, read back against the approved title.

State visible drift honestly rather than describing an uninspected image as verified. If one focused change would help, name the smallest one and wait for a new approval — it is new paid work.

## When something is redone

Each image stands alone.

| What went wrong | Redo | Reuse unchanged |
| --- | --- | --- |
| One in-body image misses its paragraph | That one `images.generate` | Every other image |
| The set drifts in style | The images that drift, with the look sentence restated | The ones that hold |
| Cover text did not render | That one `images.generate`, or the text-free version | The in-body images |
| A paragraph was rewritten | The image placed against it | Every other image |
| The shared look changed | Every image | Nothing — the look is in every prompt |

## Recovery

Keep a private ledger per paid call: what it was for, the complete frozen arguments, its stable `client_request_id`, the approval, the create response, the task ID, and the terminal result.

If a create response is lost, resubmit only the identical frozen payload under the same ID. If a task ID is lost, call `beatra.tasks.list` for that capability, call `beatra.tasks.get` on plausible candidates, and match them against the ledger before considering a retry. If the request ID itself is lost, do not invent a new one and do not replay. A slow task is not a failed task. Never replace a running task with a duplicate.

`insufficient_balance` means the request was not started and nothing was charged. The user tops up and the identical request is resubmitted under the same ID.

Cancel only when the user asks. Call `beatra.tasks.cancel` once and confirm the terminal state with `beatra.tasks.get`. A 409 means cancellation is unconfirmed: keep polling that same task and create no replacement work.

## Stopping before a paid call

Stop, say what is missing, and propose the smallest fix when:

- a fact the article's central argument depends on has not been supplied;
- an in-body image cannot name the paragraph it serves;
- a media fact cannot be established, or fails the live card;
- the requested canvas is outside what the live card supports.

Do not guess a value, substitute a default silently, or submit to find out.
