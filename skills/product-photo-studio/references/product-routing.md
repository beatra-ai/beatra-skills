# Product routing

## Start from the seller's actual starting point

A product photo request arrives in one of three shapes. Identify which one
before choosing a tool.

| Starting point | What is enough to start | Route |
| --- | --- | --- |
| One product photo + background or scene goal | The product image plus one target look | `beatra.images.transform` |
| One product photo + multiple style references | Ordered references (product first, style/background after) | `beatra.images.transform` |
| Accepted draft + specific fix | The draft plus the requested change | `beatra.images.edit` |

A single product photo with no explicit background preference is enough to
propose a clean white background and include it in the single paid-call
confirmation.

## Extract the product brief

Collect what is already known and fill gaps only when they materially change
the result.

- **Product identity.** What the product is, its category, and any key visual
  details (brand label, shape, texture, color, packaging). Treat the source
  photo and confirmed details as the visual reference, then review the result
  for fidelity.
- **Target marketplace.** Amazon, Taobao, Shopify, Rakuten, social media, or ad
  campaign—when it determines format or background rules.
- **Background or scene direction.** Clean white, light-gray gradient, studio
  sweep, lifestyle context (kitchen, bathroom, office, outdoor), seasonal
  (holiday, summer).
- **Visual references.** Style inspiration, desired background, angle
  reference, or a competitor listing to match—ordered with the product photo
  first.

## Marketplace image guidance

Marketplace requirements change. When a named platform determines the output,
ask for or consult its current image guidance before the paid call. Use these
common patterns only as starting points:

- **Amazon main image** — typically a pure-white background with the product
  prominent and without added text or watermarks.
- **Taobao main image** — often a clean light background and square composition.
- **Shopify product image** — consistent background across the catalog,
  square or 4:3 ratio preferred.
- **Social media** — lifestyle or contextual scene with the product as hero.
- **Ad campaign** — dramatic lighting, premium composition, may include text
  overlay (added downstream, not in the generated image).

When the user names a marketplace, apply the current supplied guidance to the
prompt. When absent, propose clean white as the default.

## Product category scene suggestions

When the user requests a lifestyle scene but does not specify the setting,
infer from the product category:

- **Food and beverage** — wooden table, marble countertop, restaurant setting,
  natural light.
- **Cosmetics and skincare** — bathroom shelf, vanity table, silk backdrop,
  soft diffused light.
- **Electronics and tech** — desk surface, modern interior, dark dramatic
  background, cool blue accent light.
- **Fashion and accessories** — model or mannequin context, fabric backdrop,
  neutral studio.
- **Home and living** — styled room interior, bookshelf, windowsill, cozy
  warm light.
- **Baby and kids** — nursery, soft pastel background, playful props.

These are starting points, not constraints. Override with the user's stated
preference whenever available.

## Defaults that avoid unnecessary questions

- Canvas: square `1:1` for marketplace main images; `4:3` or `16:9` when the
  user specifies a banner or hero format.
- Count: 1 (product photography requires precision, not exploration).
- Model: `auto`.
- Background: clean white when no preference is stated.

## Visual access

Local files enter the workflow through `beatra.assets.upload`. Upload makes the
bytes available to the remote tool; it does not itself inspect the image.
Review only visual facts the host can actually see. When the host cannot view an
image, state that visual verification was not possible and proceed on the
user's declared intent.
