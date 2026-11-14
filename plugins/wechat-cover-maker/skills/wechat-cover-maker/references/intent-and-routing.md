# Intent and routing

## Start from the user's actual starting point

Reuse all useful context. Required input is route-specific:

| Starting point | What is enough to start | Route |
| --- | --- | --- |
| No source image | An article title or topic | `beatra.images.generate` |
| One to four visual references | Ordered references plus a clear cover goal or direction | `beatra.images.transform` |
| Accepted draft | The draft plus the requested change | `beatra.images.edit` |

Ask for a title or topic on the reference or edit routes only when it materially
changes the composition or message. Treat article summary, audience, visual
tone, exact canvas, headline treatment, brand colors, and must-keep details as
optional until one is genuinely needed. Do not turn intake into a questionnaire.

## One visual hook

Reduce the request to one focal object, person, contrast, transformation, or
metaphor that remains recognizable at thumbnail size. Supporting elements should
reinforce that hook rather than compete with it.

## Canvas and headline defaults

Prefer the user's target dimensions. For a standard WeChat article cover,
propose `900 × 383`; for an accepted draft, preserve its existing ratio unless
the user requests another destination. Ask once only when the destination
changes the composition.

If the headline strategy is already known, reuse it. Otherwise propose either:

- the user's exact short headline, with deliberate placement and contrast; or
- a text-free background with a calm, high-contrast area for later typesetting.

Include that proposal in the paid-call confirmation. When exact font, spacing,
wrapping, or logo geometry matters, the text-free route is the practical
default; keep the exact requirement as a post-result review item.

## Visual access

Local files use `beatra.assets.upload` through the bundled client helper. The
returned artifact reference becomes an ordered input to transform or edit.
Upload metadata proves transport, not visual content. If a visual fact must be
checked and the host cannot see the image, request an accessible source or ask
the user to inspect the returned result.
