---
name: "tiktok-shop-product-video-maker"
description: "Create TikTok Shop product-video plans from product facts, photos, selling points, and English or Japanese audience context. This AI product video maker produces hooks, a ready-to-film script, shot beats, subtitle cues, localized titles, hashtags, and a product-page-safe CTA for product showcases, demonstrations, unboxings, reviews, and creator-led shopping videos."
---

# TikTok Shop Product Video Maker

Turn an authorized product brief, product photos, and a target market into a
TikTok Shop product-video plan a seller or creator can film. The result is a
product-led hook set, a spoken script, shot beats, subtitle cues, and localized
publishing copy that stays inside the facts the merchant supplied.

## Scope and routing

Use this package to plan a shoppable product video for a specific market:
product showcases, demonstrations, unboxings, reviews, comparison angles, and
creator-led shopping videos. It writes the plan and the filming language; it
does not render video, record narration, upload products, publish ads, or
promise sales or platform approval. This package delivers the script, shot
list, and subtitles. It does not default to a paid finished clip. Stop when
product facts are missing.

Route a finished product clip from a single product image to
`product-video-studio`, an AI creator delivering the pitch on camera to
`douyin-ugc-ad-creator`, narration audio for a finished script to
`short-form-voiceover-audio`, and marketplace listing imagery to
`ecommerce-listing-image-set`.

## Inputs and defaults

The hard input is confirmed product facts. Reuse the product name, category,
selling points, price, audience, creator voice, destination, target market,
and photos already known in the conversation. Ask only for what changes the
plan: the target market, the one action the viewer should take, the source
facts, or the shooting constraint.

Write in the destination market's language. Default to English for a US or
global TikTok Shop audience and Japanese for a Japan audience, and mirror any
must-keep brand or product wording exactly as supplied.

Default to three hook options, a 20–45 second script, one clear product
takeaway, a Hook → proof or demonstration → offer → call to action structure, a
shot beat for every spoken section, and a subtitle cue per beat. Deliver
localized titles, hashtags, and one call to action the product page can support.

Price, stock, shipping, discounts, ratings, reviews, certification, awards,
rankings, ingredients, efficacy, and compliance status come only from the
merchant. A photo guides what is visible; it is not evidence for a fact the
merchant has not stated. When a proof point is missing, ask for it rather than
filling it with plausible detail.

## Golden path

The path is confirmed facts to a shot-by-shot plan with voiceover, on-screen
text, and a CTA. Every spoken claim must land on a proof visual. Do not
promise a viral hit.

1. Build the product brief: market and language, product facts, audience, the
   one viewer action, creator voice, must-keep wording, available photos, and
   shooting constraints.
2. Draft three distinct hooks from the product's real advantage, then select one
   primary opening and keep the alternatives available.
3. Produce the spoken script line by line, shot and action beats, subtitle cues,
   localized titles, hashtags, and the call to action.
4. Screen the copy before delivery: every claim traces to a merchant-supplied
   fact, no guaranteed outcome, no unverifiable superlative, and no regulated
   health, medical, or efficacy claim. A hit means rewrite, not a disclaimer.
5. Review for natural market language, shootability, timing, subtitle
   readability, and product-page consistency. Deliver the primary script, the
   two unused hooks, and a fact checklist the merchant can confirm.

Read [the product-video workflow](references/workflow.md) for the brief card,
duration math, market language notes, the copy screen, and revision rules.

## Revisions and updates

A changed market, product, fact, audience, offer, or viewer action is a new
brief. Preserve accepted facts and revise only the affected field. This package
is non-billable planning: it creates no generation task and no paid
`client_request_id`.

Use only this package's bundled `scripts/mcp_client.py` to reach Beatra; the
bundled client registers the installation itself on its first invocation, so
there is no register subcommand to call. Never configure or call a host Beatra
Connector, and never use REST/OpenAPI as a fallback. Read
[Bundled MCP Client diagnostics](references/mcp-connection.md) when the
registration path needs diagnosis, and
[uninstall and disconnect](references/uninstall-and-disconnect.md) when removing
the package.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
