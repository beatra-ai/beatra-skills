---
name: "zhongcao-beauty-note-maker"
description: "Create Xiaohongshu beauty and skincare content from product facts, routine steps, skin concerns, and audience context. This AI beauty note maker produces a 3:4 post concept, review structure, usage-scene copy, title options, cover wording, relevant hashtags, and a natural comment starter for makeup, skincare, haircare, body care, routines, comparisons, and product recommendations. Optionally it reads Xiaohongshu itself — the notes already running for the topic, one page of a note's top comments, and an account's own recent notes — so Xiaohongshu research, competitor note analysis and comment analysis rest on the platform instead of on guesswork."
---

# Zhongcao Beauty Note Maker

Turn beauty or skincare product facts into a Xiaohongshu note pack: a vertical
`3:4` slide plan, a note body built on real usage, title options, cover wording,
hashtags, and one comment starter. Beauty is the category Chinese advertising
law watches most closely, so every claim in the pack is traced back to something
the user supplied.

## Scope and routing

Use this Skill for makeup, skincare, haircare, body care, routines, product
comparisons, and beauty recommendations.

Route a text-only note with no beauty specialisation to `zhongcao-note-copywriter`,
a general ordered image set to `zhongcao-carousel-maker`, food to
`zhongcao-food-note-maker`, an outfit-led note to `zhongcao-ootd-lookbook-maker`,
and a non-food local business such as a salon or clinic to
`zhongcao-local-business-note-maker`. When the slides need to be rendered rather
than planned, hand the approved slide plan to `zhongcao-carousel-maker`.

## Inputs and defaults

Reuse the product name, ingredients or features, routine step, skin or use
context, audience, experience facts, tone, and desired action already in the
conversation. Ask when a missing fact would change a safety or efficacy claim;
that is the one gap worth interrupting for.

Ingredients, concentrations, clinical results, certifications, endorsements,
prices, and personal use come only from the user. A product photo shows the
packaging; it is not evidence for what is inside or what it does.

Default to five title options of at most 20 Chinese characters, one primary
angle, a hook-to-detail note body of 250–500 Chinese characters, a four-slide
`3:4` plan (cover, texture or application, routine or comparison, practical
close), three cover-text options, five to ten hashtags, one comment starter, and
a list of assumptions still needing confirmation.

Write in Simplified Chinese unless the user asks otherwise, and carry any
must-keep brand or product wording through verbatim. A must-keep phrase still
passes through the copy screen; when it hits, keep the brand or product name
verbatim and rewrite only the claim around it.

## Golden path

1. Build the brief: product, supplied facts, routine step, skin or use context,
   audience, tone, must-keep wording, and the reader action.
2. Separate what the user stated from what is assumed. An unsupported claim
   becomes a question, never a plausible sentence.
3. Draft five titles, pick a primary angle, then write the body from the real
   usage sequence rather than from a template.
4. Plan the four `3:4` slides so each one carries one idea, and write the cover
   text, hashtags, and comment starter to match the note actually written.
5. Run the beauty copy screen in [the beauty note workflow](references/workflow.md)
   over the finished pack, then deliver the draft with its assumptions marked.

## The beauty copy screen

This is the step that makes the pack safe to post, and it runs on every draft.

Chinese advertising law prohibits absolute claims regardless of whether they are
true, and the penalty falls on the account that posts them. Screen the titles,
body, cover text, and hashtags for at least:

```text
最   第一   顶级   国家级   销量冠军   绝对   独家   唯一   永久   根治
```

A hit means rewrite into something specific the user supplied, not a disclaimer
appended to the claim. Report every rewrite: name the wording that was replaced
and why, so the user can decide whether to supply the fact that would support
it. Never silently drop a line the user asked for.

Promise no reach, ranking, saves, or conversion anywhere in the pack.

Cosmetics are a regulated category: no therapeutic, curative, medical, or
functional health claim, and no promise about a skin condition. Describe the
ingredients, the texture, how it is used, and the experience the user reported.

A user-supplied efficacy claim does not lift this. In China a cosmetic product's
advertised efficacy has to match the efficacy registered in its own filing, so a
product filed for moisturising cannot be advertised as repairing, de-blemishing,
or anti-inflammatory however true the user believes it to be. When the user
supplies an efficacy claim, ask which registered efficacy it corresponds to. If
they do not know, rewrite the claim as that user's own described experience —
what they noticed, and when — but only for an ordinary filed efficacy such as
moisturising, cleansing, softening, texture, or wear.

China registers five efficacies separately, and a product advertised on one of
them holds its own special-cosmetic registration:

```text
祛斑美白   防晒   防脱发   染发   烫发
```

When the user confirms the product carries that registration, write the efficacy
plainly — it is the note the product exists to support, and the product name
keeps the word whether or not the claim is being made. When they do not know,
the claim does not survive the personal-experience rewrite: a first-person
account still implies the efficacy for that product. Leave the claim out of the
pack and tell the user that the product's own registration is what would carry
it. Any medical or skin-condition claim, and any efficacy the product neither
registered nor filed, is left out on the same rule. A claim that names no
recognised efficacy category at all is registered separately too; treat it the
same way.

Keep the difference between an experience and a result visible in the copy
itself, so a reader can tell which is which without being told.

## Revisions and execution

A changed product, fact, routine step, audience, or claim is a new brief.
Preserve accepted wording and revise only the affected section.

The text and layout planning in this package is non-billable: the whole pack is
written in the current conversation and creates no generation task. The one
exception is the optional Xiaohongshu lookup below, which does create a task and
does carry a paid request ID. It runs only when the user asks for it and approves
its price on its own, and a run that declines it is the ordinary, complete
run. Use only this package's bundled `scripts/mcp_client.py` to reach
Beatra; the bundled client registers the installation itself on its first
invocation, so there is no register subcommand to call. Never configure or call
a host Beatra Connector, and never use REST/OpenAPI as a fallback.

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

**This Skill has never charged for anything before.** Everything it does today is free, and
that is what a user who installed it expects. The lookup is the only paid thing here, it is
never run without being asked for and approved on its own, and a run that declines it is
the complete, ordinary run — not a lesser one. Do not steer toward it.

See [reading Xiaohongshu](references/note-lookup.md) for the operations, the argument
routes, the confirmation wording, and how a result is reported and recovered.

## References by task

- [Beauty note workflow](references/workflow.md): brief card, slide plan, the
  copy screen, and revision rules.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use and credentials.
- [Bundled MCP Client diagnostics](references/mcp-connection.md) and
  [uninstall and disconnect](references/uninstall-and-disconnect.md): client
  operation and removal.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses fixed official Beatra discovery and immutable CDN paths,
verifies the archive, manifest, and every packaged file, and replaces only files
owned by this package. If an update fails, the current installation remains
usable and the original command continues. The setting persists for this
installation. Read
[automatic updates and safety](references/automatic-updates-and-safety.md) for
the official sources, integrity checks, replacement boundary, failure behaviour,
and controls.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
