---
name: "wechat-article-visual-pack"
description: "Create a WeChat Official Account visual pack from a finished article, outline, brand assets, photos, or visual references. Produce a lead cover plus coordinated in-article illustrations with clear section focus and consistent visual direction for WeChat articles, WeChat post images, brand stories, product explainers, event recaps, and knowledge content."
---

# WeChat Article Visual Pack

Create a coordinated two-to-four-image WeChat Official Account visual pack
from a finished article, outline, brand assets, photos, or visual references.
The pack has a lead visual followed by section-focused article illustrations
with one consistent direction and reading order; it is not a replacement for
one standalone article cover.

## Choose the route

Lock the scope first: cover only, body illustrations only, or the full pack.
A cover-only request that needs a 2.35:1 headline cover can stay on this pack.

- **Create from article content:** use `beatra.images.generate` when the title,
  article outline, section roles, and visual direction are sufficient.
- **Compose from brand assets:** upload up to four ordered photos, products,
  portraits, logos, or reference images and use `beatra.images.transform`,
  clearly declaring what each reference preserves or guides.
- **Refine a selected image:** use `beatra.images.edit` with the accepted lead
  visual or article illustration as `images[0]`, with no more than two
  normalized local edit regions.

This Skill owns an ordered image set for a long-form article. Use
`wechat-cover-maker` when the user needs one focused article cover only; it
uses its own cover-specific canvas and should not be substituted for this pack.

## Plan the visual sequence

The hard input is the article or outline. Do not invent illustration themes
when the article is missing.

Reuse the article's message, section outline, audience, brand assets, visual
references, and must-keep details. Propose two to four roles: a lead visual
first, then the most important sections, process steps, examples, or evidence.
Default to a coherent 2K `16:9` image system for the pack—not the existing
single-cover `900 × 383` path—and include the exact count, order, canvas, and
text treatment in the paid-call confirmation.

Plan one visual language: shared palette, subject treatment, lighting, and
headline-safe areas. Default to one accent color and one visual system for the
whole article; each image carries one concept. Do not promise exact in-image
Chinese copy, logos, or line breaks. If the user requests short words in the
image, freeze the exact copy in the confirmation and inspect it only when the
output is visible.

## Golden path

Propose the illustration outline first and wait for the user to confirm the
style. Then generate paid images by position. Prefer existing business images
over new generation.

## Verify sequence capability, then confirm one paid request

Use only this Skill's bundled `scripts/mcp_client.py` for every remote Beatra
operation. Do not configure or call a host Beatra Connector and do not use
REST/OpenAPI as a fallback. Upload local images through the bundled client;
an upload makes bytes available but does not inspect their content.

Before proposing a multi-image paid route, call `beatra.models.list` with the
exact capability for the next tool and verify that a current route supports
that capability, final `count`, canvas, and `output_relationship: "sequence"`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

For transform use `{"capability":"image_to_image"}`; for edit use
`{"capability":"image_edit"}`. Call once for the chosen route.

Keep `model: "auto"` by default; only a real availability, compatibility,
control, or price decision should select a concrete model. If sequence is unavailable, report the compatibility outcome
and obtain the user's explicit choice to produce one image or split the work
into several paid requests. Never silently change a requested linked sequence
into independent candidate images.

When available, show a single paid-call confirmation that freezes the prompt,
lead and section order, count, `sequence` relationship, canvas, ordered
references, text treatment, model, and controls. Planning and compatibility
checks are free. After approval, create one opaque stable
`client_request_id` without user content and submit once. Any changed prompt,
roles, count, canvas, references or order, relationship, model, or control is
new paid work and needs a new confirmation and ID.

## Track, review, and deliver

Keep the returned `task_id` and poll only it with `beatra.tasks.get`. If the ID
is lost, inspect `beatra.tasks.list`, then verify the chosen candidate with
`tasks.get`. Replay the exact same payload with the same ID only when creation
response delivery is genuinely unknown. Slow polling, connection, update, and
authorization failures never cause a replacement paid request.

Use cancellation only when the user asks. A `409` response from
`beatra.tasks.cancel` means the original task continues. When results are
visible, review returned order, lead and section focus, visual consistency,
safe areas, confirmed canvas, and must-keep assets. Deliver returned artifact
links in sequence, observed dimensions, task ID, resolved model, and
`billing.net_charged_credits`; offer at most one focused unexecuted refinement.

## References by task

- Sequence payloads, asset ordering, and local slide edits:
  [workflow](references/workflow.md)
- Install or reauthorize: [installation and authentication](references/installation-and-auth.md)
- Bundled-client diagnostics: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Registration: [installation registration](references/installation-registration.md)
- Polling and result fields: [tasks and results](references/tasks-and-results.md)
- Billing and recovery: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Safe updates: [automatic updates and safety](references/automatic-updates-and-safety.md)

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once every 24 hours while
a public command runs. When a newer version is available, the client installs it
automatically without separate confirmation only from fixed official Beatra discovery and immutable
CDN paths. It verifies the archive, manifest, and every package-owned file,
then replaces only files owned by this package. If an update step fails, the
current installation remains usable and the original command continues. The
setting persists for this installation.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
