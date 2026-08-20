---
name: "zhongcao-carousel-maker"
description: "Create a Xiaohongshu or REDnote carousel from a post outline, product details, photo set, or style reference. Build an ordered 3:4 image sequence with a hook cover and supporting slides, clear focal imagery, matched visual direction, and headline-safe areas for product recommendations, tutorials, food notes, OOTD, travel guides, knowledge posts, and Xiaohongshu content images for one connected post story. Optionally it reads Xiaohongshu itself — the notes already running for the topic, one page of a note's top comments, and an account's own recent notes — so Xiaohongshu research, competitor note analysis and comment analysis rest on the platform instead of on guesswork."
---

# Zhongcao Carousel Maker

Create an ordered two-to-four-slide REDnote (Xiaohongshu) carousel from a post
outline, product details, photo set, or style reference. The result is a hook
cover plus supporting slides with a shared visual direction and a deliberate
reading order—not a set of unrelated image variants.

## Choose the route

- **Build a carousel from an outline:** use `beatra.images.generate` when the
  post topic, slide roles, and visual direction are sufficient.
- **Compose from a photo set or references:** upload up to four ordered image
  references and use `beatra.images.transform`, declaring which image preserves
  the subject and which images guide only style, palette, or composition.
- **Refine one selected slide:** use `beatra.images.edit` with the accepted
  slide at `images[0]` and at most two normalized local edit regions.

This Skill owns a connected multiple-image note. Use `zhongcao-cover-maker` for
one standalone Xiaohongshu cover. Do not route a carousel request to a one-cover
workflow.

## Plan the ordered story

Reuse the user's topic, audience, content outline, product facts, references,
and visual style. Suggest two to four slide roles: a hook cover first, followed
by explanation, proof, steps, comparison, or call-to-action slides. Default to
a 2K `3:4` canvas and an explicit text-safe area on every slide, then include
the exact slide count, order, canvas, and headline treatment in the paid-call
confirmation.

Keep one subject, palette, lighting direction, and composition language across
the set. Default to safe space for later overlay rather than guaranteeing
rendered Chinese titles. If short in-image text is requested, freeze the exact
copy in the confirmation and inspect it only when the result is visible.

## Verify sequence capability, then confirm one paid request

Use only this Skill's bundled `scripts/mcp_client.py` for all remote Beatra
operations. Do not configure or call a host Beatra Connector and do not use
REST/OpenAPI as a fallback. Upload local image files with the bundled client
and preserve their declared order; an upload makes bytes available but does not
inspect the images.

Before offering the multi-slide paid route, call `beatra.models.list` to verify
that a currently selectable model supports the confirmed capability, `count`,
canvas, and `output_relationship: "sequence"`. Keep `model: "auto"` unless a
real availability, compatibility, control, or price decision requires a
specific model. If no live route supports the requested sequence, report that
result and ask the user to choose either one image now or several separate paid
requests. Do not silently submit independent candidates as though they were an
ordered carousel.

Once the route is available, show one final confirmation freezing the prompt,
slide order and count, `sequence` relationship, canvas, ordered references,
text treatment, model, and controls. Planning and capability checks are
free, and so is everything before the optional Xiaohongshu lookup, which is
priced and approved on its own;
the image request is paid. After approval, create one opaque stable
`client_request_id` without user content and submit once. A changed prompt,
slides, count, canvas, references or order, relationship, model, or control is
new paid work needing a fresh confirmation and a fresh ID.

## Track, review, and deliver

Keep the returned `task_id` and poll only it through `beatra.tasks.get`. If it
is lost, use `beatra.tasks.list` for candidates and validate the selected one
with `tasks.get`. Replay the byte-equivalent payload with the same ID only when
the original creation response is genuinely unknown. Slow polling, connection,
update, and authorization errors never create substitute paid work.

Cancel only on the user's request. If `beatra.tasks.cancel` returns `409`, the
original task continues and must be tracked. When output is visible, review the
returned slide order, consistent palette and subject, each slide's focal
clarity, text-safe space, confirmed canvas, and requested details. Deliver
artifact links in returned order, observed dimensions, task ID, resolved model,
and returned `billing.net_charged_credits`; offer at most one unexecuted,
focused revision plan.

## Reading Xiaohongshu before you write

Optional, and paid. When the connection exposes Beatra's public social lookup, this Skill
can read Xiaohongshu directly instead of working from what the user remembers: one page of
notes matching a keyword, one specific note the user pastes, one page of that note's top comments, and an
account's profile or recent notes. Six operations, Xiaohongshu only.

**Every one of them costs 60 credits**, and there is no cheap operation on this platform to
fall back on. The same reads cost 6 on TikTok. They cost 6 on Douyin too — except Douyin's
own keyword search, which is also 60, so do not say "ten times Douyin" without naming the
read. A three-step read — the field, one note, that note's top comments — is 180 credits, and
every further page is another 60. Say the number before offering anything, confirm each lookup on
its own before it runs, and say plainly that this Skill's own deliverable arrives either
way at no cost. Offer one read, not a plan of four.

The rule is the whitelist, not a list of exceptions: a platform with no operation on it
cannot be looked up from here, and another platform's notes are never presented as
Xiaohongshu's. A returned image URL is not a viewed image — state a visual finding only
about an image the host can actually open. Every figure that reaches the work is labelled
as looked up with the time it was read, or as supplied by the user, or as missing. Nothing
is estimated, and nothing is carried in from what notes in this category usually do.

See [reading Xiaohongshu](references/note-lookup.md) for the operations, the argument
routes, the confirmation wording, and how a result is reported and recovered.

## References by task

- Sequence payloads, ordered references, and slide edits:
  [workflow](references/workflow.md)
- First install or expired authorization:
  [installation and authentication](references/installation-and-auth.md)
- Bundled-client commands: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Registration: [installation registration](references/installation-registration.md)
- Polling and returned task fields: [tasks and results](references/tasks-and-results.md)
- Billing and recovery: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Update controls and integrity: [automatic updates and safety](references/automatic-updates-and-safety.md)

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours during a public command.
When a newer version is available, the client installs it automatically without
separate confirmation only from fixed official Beatra discovery and immutable CDN paths.
It verifies the archive, manifest, and every package-owned file, and replaces
only files owned by this package. If an update step fails, the current
installation remains usable and the original command continues. The setting
persists for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
