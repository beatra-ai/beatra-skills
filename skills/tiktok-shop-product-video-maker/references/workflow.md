# TikTok Shop product video workflow

## Product brief

Record the target market and its language, the product name and category, the
merchant's own product facts, the audience, the one action the viewer should
take, the creator voice, the available photos, the shooting constraints, the
must-keep wording, and the exclusions.

Mark every claim as either supplied by the merchant or still assumed. An assumed
claim becomes a question, never a plausible sentence.

## Market and language

Write in the destination market's language. Default to English for a US or
global TikTok Shop audience and Japanese for a Japan audience. When the user
names a different market, write in that market's language and say which one you
used.

Localisation is not translation. A hook that works in English rarely survives
word-for-word into Japanese; rewrite it for the market and keep only the product
facts fixed. Carry brand names, product names, and must-keep wording through
verbatim in every language.

## Duration and pacing

Default to a 20–45 second script. Roughly two to three spoken seconds per short
line is a drafting aid for pacing, not a platform rule — the real length depends
on the presenter. When the user names a duration, keep it and adjust how much
each line carries rather than cutting the structure.

Structure: hook, then proof or demonstration, then the offer, then the call to
action. Give every spoken section a shot beat and a subtitle cue.

## Screen the copy before delivering

Read the finished hooks, script, titles, hashtags, and call to action against
each of these. A hit means rewrite, not a disclaimer, because the penalty falls
on the seller's account.

**Unverifiable superlatives.** No "best", "number one", "cheapest anywhere", or
"guaranteed" unless the merchant supplied the substantiation and named where it
comes from. Replace with the specific fact they did supply.

**Regulated categories.** Supplements, cosmetics, medical devices, and anything
worn on or taken into the body get no therapeutic, curative, or functional
health claim. Describe what the product is, what it contains, and how it is
used.

**Platform and marketplace claims.** Never state or imply that a listing is
approved, promoted, or ranked by the platform, and never promise sales, views,
conversion, or ad performance.

**Comparative claims.** A comparison against a named competitor needs the
merchant's own substantiation; without it, describe the product on its own
terms.

## Deliver

Hand back three hooks, the primary script line by line, shot beats, subtitle
cues, localized titles, hashtags, one call to action the product page can
support, and a fact checklist the merchant can confirm before filming.

Say plainly which claims came from the merchant and which are still open
questions. Keep the two lists separate so the merchant can see what they are
signing off.

## Revision

A changed market, product, fact, audience, offer, or viewer action is a new
brief. Preserve the accepted facts and revise only the affected field. Re-run
the copy screen on the revised draft rather than inheriting the earlier pass.

## Routing

`product-video-studio` renders a finished clip from a single product image.
`douyin-ugc-ad-creator` puts an AI creator on camera with the product.
`short-form-voiceover-audio` turns a finished script into narration audio.
`ecommerce-listing-image-set` produces marketplace listing imagery. This package
owns the plan and the filming language; it renders nothing.

## Registration

The bundled client registers the installation itself on its first invocation, so
there is no register subcommand and no hand-built payload: the installation
reference is derived locally and cannot be supplied by the host Agent. Run
`python3 scripts/mcp_client.py verify` when a first-use registration needs to be
triggered or diagnosed. Registration is non-billable, idempotent, and its
failure does not block the writing path.
