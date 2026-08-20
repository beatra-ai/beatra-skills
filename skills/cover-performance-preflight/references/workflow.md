# Cover preflight workflow

This workflow starts from one existing cover and produces a qualitative
diagnosis, a practical revision brief, and an approved comparison set. It is a
finishing route, not a topic-to-cover generator.

Use the bundled client for every remote Beatra operation. The remote tool name
is a command argument and its JSON arguments are passed through standard input:

```text
printf '%s' '{"capability":"image_to_image"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Upload a local existing cover through the bundled helper. The helper requests
the upload grant, performs its returned HTTP `PUT`, and prints the resulting
artifact reference; never place a local path in a remote image request.

```text
python3 scripts/mcp_client.py upload ./current-cover.png --mime-type image/png
```

Do not configure a host Beatra Connector or use REST/OpenAPI as a fallback.

## 1. Establish a reviewable starting point

Reuse the information already given and keep the intake short:

```text
existing cover: visible to host / user-reported only
publication surface and placement:
title or core message:
audience and content type:
must keep: person, product, logo, color, wording, or composition details
source ratio and any requested target ratio:
same-topic baseline: not requested / requested (paid, see step 1b)
```

The existing cover is mandatory. Ask for the platform or title only when the
answer changes title-to-image fit, crop guidance, or the requested canvas. If
the host cannot view the cover, record its attributes as user-reported and
obtain an accessible version before producing visual findings, selecting a
diagnostic direction, or preparing paid work.

If the user begins from a topic rather than an existing cover, choose the
existing creator package that matches the request: `wechat-cover-maker` for an
article, `rednote-cover-maker` for a REDnote post, or `poster-design-studio`
for a campaign visual.

## 1b. Optional: read the same-topic baseline

Skip this step unless the user wants it. The card in step 2 is delivered either
way and costs nothing.

When the connection exposes Beatra's public social lookup, this package may read
one page of the topic's field on YouTube, TikTok, Douyin, or Xiaohongshu; one
YouTube video's thumbnail and statistics; and, after resolving a channel URL, one
page of the user's own recent videos. **Both of those last two are YouTube-only** —
the other three platforms have no image read and no own-account history here. Seven operations, no others. The full
route, argument sources, and the boundary on what a lookup can establish are in
[same-topic baseline](baseline-lookup.md).

**Confirm this lookup on its own, before it runs.** It is not covered by the
image confirmation in step 3, and it happens inside the window this package
promises is free, so it needs its own approval. Name the `operation_key`, quote
the credit price `beatra.social.tools.get` just returned, count each search page
and each thumbnail read as one charge, and say the card is delivered either way.
Prices on this whitelist run from 6 to 60 credits; never quote one number for
"a search."

If a platform has no operation in the whitelist it has no baseline — a WeChat
article cover, a WeChat Channels cover, a Bilibili cover, a podcast cover, and
others. Say so and continue to step 2 rather than searching a neighbouring
platform. A competitor's thumbnail image can be read on YouTube only; the other
three platforms return titles and counts.

## 2. Produce the qualitative preflight card

Use this format before image work:

| Check | Visible evidence or user context | Finding | Revision direction |
| --- | --- | --- | --- |
| First-glance visual hook | What can genuinely be seen, plus the title or message | State the strongest immediate subject or message | Strengthen one focal point or reduce competing elements |
| Focal hierarchy and contrast | Subject placement, background, color, and negative space | State which elements lead and which compete | Adjust focus, contrast, scale, or spacing |
| Title-to-image fit | Title, text treatment, and safe space when visible | State whether the visual and message reinforce each other | Reserve or improve a title-safe area |
| Small-screen and crop review | Current canvas and important edge details | State likely readability or crop considerations | Preserve the source ratio or name a user-chosen target canvas |
| Comparison set | The user's goal and protected details | Describe two or three meaningfully different directions | Freeze exact directions before paid generation |
| Same-topic baseline (only when step 1b ran) | The titles and public counts the lookup returned, with the time they were read, plus any competitor thumbnail the host could actually open | State how the field frames this cover: what its titles do, what its counts are, and — only for a thumbnail genuinely viewed — how its treatment differs | Name the one difference worth acting on, or say the baseline changed nothing |

Write findings as qualitative observations, not a synthetic numeric rating or a
performance prediction. This holds with a baseline in hand: looked-up counts
belong to other people's videos and describe the field, and a high count next to
a cover is not proof the cover earned it — title, topic, timing, and the
channel's existing audience all move it. Mark such a read as inference, give the
evidence, and say what would confirm it. Report a competitor's cover as found but
not viewed whenever the host could not open the returned thumbnail, and keep the
baseline to the titles and counts that genuinely came back. Suggested directions can include a larger focal
subject, a calmer background, stronger separation, a different crop, or a
cleaner headline-safe area. They should remain tied to the supplied content
rather than imitate an unrelated channel or creator.

## 3. Freeze a paid candidate or edit request

The card, visual directions, and prompt are free. For a candidate set, show one
confirmation block containing the exact source cover, title or message,
must-keep details, canvas, prompt, model behavior, output count, and each
candidate direction. A clear request to proceed authorizes that one request.

Use `beatra.images.transform` for two or three candidates. Keep the existing
cover as the first and only source; an explicit `source` aspect inherits that
source ratio when it is also the last ordered image.

```json
{
  "images": [{"type": "artifact", "artifact_id": "art_current_cover"}],
  "prompt": "Image 1 is the existing cover. Keep its approved person, product, logo, and brand colors recognizable. Create three distinct cover directions for the supplied title: (1) sharpen the single visual hook with a larger focal subject and calmer support; (2) retain the composition while creating clearer title-safe contrast; (3) use a tighter crop and stronger foreground-background separation. Preserve the source message and use a clean title-safe area rather than rendering uncontrolled text.",
  "canvas": {"type": "preset", "tier": "2K", "aspect": "source"},
  "count": 3,
  "model": "auto",
  "client_request_id": "opaque-cover-candidate-set-id"
}
```

Use `beatra.images.edit` when one accepted cover needs a focused repair. Its
base is always `images[0]`; add at most two normalized regions when the user
has identified a localized target, or omit regions for a whole-cover change.
For a localized repair, use `image_index: 0` and only rectangles whose `x` and
`y` are at least zero and below one, whose `width` and `height` are greater than
zero and at most one, and whose `x + width` and `y + height` do not exceed one.
The confirmation card names the source canvas and each chosen rectangle.

```json
{
  "images": [{"type": "artifact", "artifact_id": "art_accepted_cover"}],
  "prompt": "Keep the title-safe area, focal subject, approved logo, and existing message. Simplify the distracting background elements so the focal subject separates cleanly at a small viewing size.",
  "count": 1,
  "model": "auto",
  "client_request_id": "opaque-cover-focused-edit-id"
}
```

For example, a title-safe-area cleanup can use one bounded source-cover region:

```json
{
  "images": [{"type": "artifact", "artifact_id": "art_accepted_cover"}],
  "prompt": "Reduce only the distracting object behind the title-safe area. Keep the focal subject, approved logo, message, crop, and all other details unchanged.",
  "edit_regions": [{"image_index": 0, "x": 0.64, "y": 0.12, "width": 0.24, "height": 0.32}],
  "count": 1,
  "model": "auto",
  "client_request_id": "opaque-cover-local-edit-id"
}
```

Call `beatra.models.list` only for a current model, cost, canvas, or control
choice. Use `capability: "image_to_image"` for a candidate transform and
`capability: "image_edit"` for an edit. Do not state a cached price or a model
compatibility fact. Keep `model: "auto"` when a specific choice is unnecessary.

## 4. Track, compare, and deliver

Submit the approved generation exactly once and save its `task_id` immediately.
Poll with `beatra.tasks.get` using bounded backoff until `succeeded`, `failed`,
or `canceled`. The terminal task is authoritative for artifact links, actual
dimensions, resolved model, charged credits, and refunded credits.

When the host can view the results, compare every candidate to the frozen card:

- first-glance hook and focal hierarchy;
- title-safe contrast and message fit;
- target canvas, important edge details, and crop resilience; and
- the user's protected person, product, logo, color, and composition details.

Deliver the original card, the candidate links, observed dimensions, task ID,
resolved model, and `billing.net_charged_credits`. When step 1b ran, deliver its
charge too — the returned payload, its `task_id`, its terminal status, and its own
`billing.net_charged_credits`, with no model, dimensions, or duration to report —
and carry its provenance through: every looked-up count keeps the time it was read, anything
the user supplied stays marked as supplied, and anything neither produced is
stated as missing rather than estimated from what covers in this category
usually do. Recommend the direction that
best supports the supplied title and audience, and leave a later edit
unexecuted until the user confirms it. A platform's own post-publication test
can compare approved variants where that platform offers one.

When results are not visible to the host, deliver only returned task and
artifact links, dimensions, model, and billing facts. Mark visual review as
incomplete; do not diagnose result details, recommend a candidate, or begin an
edit from that result.

## 5. Recover without duplicate paid work

Keep a private record of the user approval, frozen payload, `client_request_id`,
create response, and task ID.

| Situation | Action |
| --- | --- |
| Create response lost | Reconcile recent tasks with `beatra.tasks.list`, confirm a candidate with `beatra.tasks.get`, then replay byte-for-byte equivalent parameters with the same `client_request_id` only when task creation remains genuinely unknown. |
| Task ID lost | List recent tasks, match candidates to the private record, and inspect the selected one with `beatra.tasks.get`. |
| Task queued or running | Continue polling the original task; do not create another candidate set. |
| Upload grant expired or MIME/length mismatch | Obtain a fresh upload grant through the bundled helper before resuming the otherwise frozen route. |
| Model validation error | Refresh the matching `beatra.models.list` card before proposing a changed request. |
| Insufficient balance | Ask for a balance action before the unchanged approved request proceeds. |
| Baseline lookup failed | Keep `error.code` and the platform wording in `error.message`. Do not call `beatra.models.list` and do not offer a different model — public social lookup has no `model` field. Deliver the card without the baseline. |
| Baseline lookup result lost | Reconcile with `beatra.tasks.list` and inspect with `beatra.tasks.get` before repeating it. Replaying byte-identical arguments under the same `client_request_id` is the one form that stays a single prepaid lookup; a changed argument, including the page, is a second charge and needs its own confirmation. |
| User asks to cancel | Call `beatra.tasks.cancel` once and poll the original task. A `409` means cancellation remains unconfirmed, so continue tracking it. |

Never make replacement paid work merely because polling is slow, an update
check fails, or a response is incomplete. Keep one generation task in flight
for this focused workflow, below the connection-wide limit of two.
