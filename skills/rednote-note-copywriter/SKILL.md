---
name: "rednote-note-copywriter"
description: "Create Xiaohongshu or REDnote copy from a product, experience, topic, or audience brief. This AI Xiaohongshu copywriter produces title options, a structured note body, cover wording, relevant hashtags, and a natural comment starter for product discovery, local experiences, beauty, food, fashion, travel, and knowledge posts."
---

# REDnote Note Copywriter

Turn a Xiaohongshu or REDnote content brief into copy that is ready to edit and
publish: title options, a structured note body, cover wording, topic tags, and
one comment starter.

## Scope and routing

Use this package for text-first Xiaohongshu notes: product recommendations,
experience posts, local discovery, beauty, food, OOTD, travel, and knowledge
content. It writes customer-facing copy and does not create images or publish
to Xiaohongshu. Route a single visual cover to `rednote-cover-maker`, an
ordered image set to `rednote-carousel-maker`, food-specific visual notes to
`rednote-food-note-maker`, OOTD lookbooks to `rednote-ootd-lookbook-maker`, and
non-food local-business visual notes to `rednote-local-business-note-maker`.
Route a makeup, skincare, haircare, or body-care note to
`rednote-beauty-note-maker`, which holds the efficacy guardrail for those
categories.

## Inputs and defaults

Use the topic, product or experience facts, audience, tone, platform language,
must-keep claims, and desired action already supplied. Ask only when missing
facts would change the copy: the audience, the one recommendation or takeaway,
or a factual claim that must appear. Never invent prices, efficacy, credentials,
availability, promotions, or personal experience.

Default to five title options of at most 20 Chinese characters each, one
250–500 Chinese-character note body (or a natural equivalent in the requested
language), three cover-text options, five to ten relevant hashtags, and one
conversational comment starter. Keep one clear promise, concrete details,
readable paragraphs, and a save/share-worthy takeaway.

## Golden path

1. Build a brief with audience, topic, supplied facts, first-person stance,
   tone, location or product details, must-keep wording, exclusions, and the
   desired reader action.
2. Extract the post angle and separate facts from assumptions. Flag any claim
   that needs the user’s confirmation instead of filling it with plausible copy.
3. Draft five distinct titles, select a primary title, then write the note with
   a clear opening, experience or evidence, practical details, and a soft close.
4. Add cover wording, hashtags, and a comment starter that matches the actual
   note. Avoid keyword stuffing, guaranteed outcomes, fabricated reviews, and
   forced engagement bait. Then run the copy screen in
   [the workflow](references/workflow.md) over the finished titles, body, cover
   phrases, and hashtags: a hit means rewrite, not a disclaimer.
5. Review for natural Xiaohongshu rhythm, factual grounding, scannability,
   audience fit, and overlap with the selected visual package. Deliver the
   primary draft plus alternatives and clearly marked assumptions.

## Revisions

A changed product fact, audience, claim, tone, or call to action is a new copy
brief. Revise only the affected section when possible and preserve accepted
wording elsewhere.

Read [the workflow](references/workflow.md) for the brief card, claim handling,
the copy screen, title and body formats, revision rules, and routing
boundaries.

## Execution

This package is non-billable text planning: it creates no generation task and
no paid request ID, and the whole copy deliverable is written in the current
conversation. Use only this package's bundled `scripts/mcp_client.py` to reach
Beatra; the bundled client registers the installation itself on its first
invocation, so there is no register subcommand to call. Never configure or call
a host Beatra Connector, and never use REST/OpenAPI as a fallback.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses fixed official Beatra discovery and immutable CDN paths,
verifies the archive, manifest, and every packaged file, replaces only
package-owned files, and fails open so the current installation and original
command continues. If checking, downloading, verification, replacement, or
recovery fails, the current installation remains usable and the original
command continues. Update failure never authorizes a paid action. The setting
persists.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
For first use and credentials, read
[installation and authentication](references/installation-and-auth.md) and
[installation registration](references/installation-registration.md). When the
registration path needs diagnosis, read
[Bundled MCP Client diagnostics](references/mcp-connection.md). For update
controls, read
[automatic updates and safety](references/automatic-updates-and-safety.md), and
when removing the package, read
[uninstall and disconnect](references/uninstall-and-disconnect.md).
