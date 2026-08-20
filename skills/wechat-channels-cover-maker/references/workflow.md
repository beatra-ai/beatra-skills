# WeChat Channels cover workflow

## Select one image route

Use `beatra.images.generate` when the topic, title, hook, or script can direct
the cover without preserving a source image. Use `beatra.images.transform` when
an exported key frame, portrait, product photo, or ordered visual references
must shape the result. A video file alone needs one exported frame or screenshot
before it can enter an image route. Use `beatra.images.edit` only to make a
focused change to an accepted cover: its base is always `images[0]`, and it may
have no more than two normalized regions on `image_index: 0`.

Use the package-bundled client for every operation. Send one JSON object on
standard input to `python3 scripts/mcp_client.py call <tool-name>`; never set up
a host connector or substitute a REST request.

## Prepare the request

Upload a local source through `beatra.assets.upload` before a transform or
edit. Record the returned artifact ID and its role. Keep ordered image inputs
in that same order; for a source-led transform, state the source role and each
reference role in the prompt. Upload success establishes an artifact ID, not a
visual inspection result.

Choose the actual canvas from the publishing destination, source frame, or
current user requirement. Prefer an explicit destination preset. For a
transform that the user explicitly wants to use `aspect: "source"`, the final
ordered image is the aspect anchor. Put the intended canvas anchor last and
state that source-derived role in the paid confirmation; the first focal image
does not automatically decide the output canvas. A video-cover format is only
a draft direction until the user confirms it. Plan one focal subject, a visible
hook at small size, clear hierarchy, and a text-safe area. Prefer a title-safe
area to long rendered text; if visible text is required, preserve the exact
short wording in the frozen request.

Read `beatra.models.list` when the live model capability, canvas compatibility,
controls, availability, or current price decides the route. Keep `model` as
`"auto"` and `count` as `1` unless a user-approved live-card choice changes
them.

### Generate example

```json
{
  "prompt": "WeChat Channels video cover for a local coffee shop guide. A single featured latte and barista hand are the focal subject, warm shop light, clear small-size hierarchy, clean upper-right title-safe space, and no unreadable decorative text.",
  "model": "auto",
  "count": 1,
  "canvas": {"type": "preset", "tier": "2K", "aspect": "3:4"},
  "client_request_id": "wechat-channels-cover-opaque-request-id"
}
```

The canvas in this example is valid only after the current destination confirms
it. A transform uses the same confirmed fields plus an ordered `images` array;
an edit also has its accepted base at `images[0]` and its approved local
regions.

## Confirmation and exactly-once creation

Planning is free. `beatra.images.generate`, `beatra.images.transform`, and
`beatra.images.edit` are paid calls. Before one of them, show the selected
route, prompt, exact canvas, every image role and order, any source-derived
last-image canvas anchor, title treatment, must-keeps, model and controls,
`count: 1`, live billing basis, maximum cost, paid call count, review plan, and
one fresh opaque `client_request_id`. Submit one request only after the user
explicitly approves that frozen plan.

Any change to the prompt, source or order, canvas, model, count, or control is
new paid work. Obtain a new confirmation and new opaque request ID rather than
changing the prior request.

## Track, recover, and review

Persist the returned `task_id`, frozen request, and request ID. Poll the saved
task through `beatra.tasks.get`. If a creation response is genuinely unknown,
first use `beatra.tasks.list`, inspect possible matches with
`beatra.tasks.get`, and compare retained request facts. Replay only the exact
same bytes with the original request ID when the original create response is
unknown; do not turn a slow, failed, unauthorized, or disconnected task into a
new paid request.

Cancellation is only for a user-requested cancellation. If
`beatra.tasks.cancel` returns `409`, continue polling the original task. On a
visible terminal result, review focal recognition, safe-area contrast, crop
risk, confirmed canvas, must-keeps, and requested visible text. Report only
returned artifact links, observed dimensions, task identity, resolved model,
terminal task state, and `billing.net_charged_credits`.
