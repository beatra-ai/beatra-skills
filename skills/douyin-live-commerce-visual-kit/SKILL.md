---
name: "douyin-live-commerce-visual-kit"
description: "Create Douyin live-commerce visuals from a livestream theme, product details, product photos, and brand references. This AI live-commerce design tool makes a Douyin live cover, livestream product card, live-room background, and overlay-ready visual direction for Douyin shop livestreams, creator livestreams, product launches, flash sales, and campaign events, with coordinated title-safe composition and clear selling points."
---

# Douyin Live Commerce Visual Kit

Turn a confirmed live-selling theme, product facts, and product or brand assets
into a coordinated set of three static visual assets: a pre-live promo cover, a
product selling-point card, and a live-room background or overlay visual.
Prepare matching live titles and short on-screen copy from merchant-provided
facts so each asset tells the same offer story.

## Scope and routing

Use this Skill for Douyin shop livestreams, creator livestreams, product
launches, seasonal campaigns, and promotion events that need a consistent
static visual direction before the stream opens. It is best when one product,
offer, host, or event needs to carry through the preview image, live-room
visual, and product callout.

Route a short-video post cover to `douyin-cover-maker`. Route a creator-led,
spoken product-ad video to `douyin-ugc-ad-creator`, a product-only video to
`product-video-studio`, and a platform-neutral campaign poster to
`poster-design-studio`.

## Inputs and default kit

The hard inputs are a live theme or product focus and merchant-confirmed facts
for every price, promotion, stock, qualification, timing, or product claim.
Reuse the live title, audience, host or creator direction, product photos,
brand colours, campaign timing, reference images, and must-keeps already known
in the conversation. Ask only for the missing live focus, destination surface,
or factual offer information that materially changes the kit.

Default to a three-asset kit:

1. **Pre-live promo cover** — one clear hook, host or product focus, and title-safe space.
2. **Product selling-point card** — one visible product moment with a concise merchant-approved claim.
3. **Live-room background or overlay visual** — a low-distraction visual base that keeps the product and host area clear.

The user confirms each destination surface and canvas before paid work. Keep
product shape, label, colour, visible material, supplied logo, approved offer
facts, host reference, and brand direction as must-keeps. Use the source photo
as the first ordered image reference; later supplied images guide style,
palette, host, composition, or room mood in the stated order.

## Golden path

1. Build a live-commerce card: live theme, target viewer, product focus,
   merchant-approved facts, host or room direction, campaign timing, brand
   assets, must-keeps, destination surface, title-safe area, and the role of
   each of the three assets.
2. Inspect accessible local media, upload it through the bundled client, and
   retain the returned artifact references. Use `beatra.images.transform` for
   a product or brand source, `beatra.images.generate` for a concept-only
   visual, and `beatra.images.edit` only for a focused revision to an accepted
   asset.
3. Read the live `image_to_image`, `text_to_image`, and `image_edit` model
   cards with `beatra.models.list`. Admit each chosen canvas, real ordered
   input set, model behaviour, optional controls, and current charge basis.
4. Draft the three visual briefs plus the free live title and on-screen-copy
   shortlist. A kit contains three explicitly named deliverables, not three
   interchangeable style candidates.
5. **Confirm the kit.** Show every asset role, prompt, source and reference
   order, user-confirmed must-keeps, destination/canvas, model and controls,
   `count: 1`, current maximum charge, total call count, and one opaque stable
   `client_request_id` per paid asset request.
6. Submit every approved image request exactly once through the bundled client,
   record its task ID, and poll its original task. A focused accepted-asset
   revision is separate paid work and requires its own confirmation and ID.
7. Review accessible results against the live-commerce card, then deliver the
   three assets in role order, matching title/copy options, and actual task,
   artifact, model, dimension, format, and billing facts.

Read [the live-commerce visual workflow](references/workflow.md) for payload
shapes, confirmation, task recovery, and delivery review.

## Paid work and recovery

Briefing, copy drafting, and visual planning are free. Before any image
generation or edit, obtain a clear confirmation of the frozen asset roles,
prompts, merchant facts, image order, canvas, model, controls, current maximum
charge, total calls, and each request ID. A changed source, claim, asset role,
prompt, reference order, canvas, model, control, or count is new paid work.

Use bundled `scripts/mcp_client.py` for every remote operation: put the MCP
tool name after `call` and one JSON object on standard input. Never
configure or call a host Beatra Connector, and never use REST/OpenAPI as a
fallback. Register the package through
`beatra.installations.register` on first use.

Save every task ID immediately and poll it using `beatra.tasks.get`. Replay a
create only when its response is genuinely unknown and the frozen payload is
byte-equivalent with the same request ID. If a task ID is missing, use
`beatra.tasks.list`, verify candidates with `beatra.tasks.get`, and recover the
original task before considering any replay. Call `beatra.tasks.cancel` only at
the user's request; if it returns `409`, keep polling the original task and
report cancellation only when its terminal status is `canceled`.

## References by task

- [Live-commerce visual workflow](references/workflow.md): visual-card
  planning, routes, live model admission, payloads, confirmation, recovery,
  and review.
- [Installation and authentication](references/installation-and-auth.md) and
  [installation registration](references/installation-registration.md): first
  use and shared credentials.
- [Tasks and results](references/tasks-and-results.md) and
  [billing, errors, and recovery](references/billing-errors-and-recovery.md):
  task, artifact, billing, and structured-error facts.
- [Bundled MCP Client diagnostics](references/mcp-connection.md): client
  operation and connection diagnostics; do not configure a host Connector.
- [automatic updates and safety](references/automatic-updates-and-safety.md):
  update behaviour and controls.
- [uninstall and disconnect](references/uninstall-and-disconnect.md): package
  removal and shared credential cleanup.

## Runtime and safe automatic updates

The bundled client silently checks at most once every 24 hours per installation.
When a newer release is available, it installs automatically without separate
confirmation. It uses only fixed official Beatra discovery and immutable CDN
paths for this package, channel, and locale, verifies discovery, archive,
manifest, and every packaged file before replacement, and replaces only
package-owned files. Update checks, downloads, verification, replacement, and
recovery fail open: the current installation remains usable and the original
command continues. The choice persists across later commands.

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check`
reports the official available version without replacing files. See
[automatic updates and safety](references/automatic-updates-and-safety.md).
