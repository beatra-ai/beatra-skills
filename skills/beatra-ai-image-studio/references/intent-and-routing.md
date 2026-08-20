# Intent and routing

Choose the starting material before writing a payload. One logical result uses exactly one image route.

## The three routes

- **Generate from text** — no source image exists or should influence the picture. Use `beatra.images.generate` with capability `text_to_image`.
- **Compose from ordered references** — one to four images should guide a new composition. Use `beatra.images.transform` with capability `image_to_image`. Preserve the user's order and label each input's role: product, subject, style, setting, palette, or composition. References guide a new image; no input is guaranteed to remain the base.
- **Edit a base image** — one existing image must remain the recognizable starting point. Use `beatra.images.edit` with capability `image_edit`. `images[0]` is always the base; later images are optional ordered references.

"Place this supplied bottle in a winter campaign scene" is normally a transform. "Remove the reflection behind this supplied bottle" is an edit. Never use generation to replace an available source, transform to conceal an edit, or edit when no base image exists.

## Minimum useful input

Every route needs a nonblank visual direction. Transform needs one to four accessible source images in a known order. Edit needs one accessible base image first and accepts up to three later references. Reuse any known destination, audience, message, subject, source roles, composition, style, light, palette, exclusions, must-keeps, output count, and model choice.

Ask one compact question only when a missing fact selects the route or materially changes the image. If the user supplies a destination but no canvas, derive a suitable orientation. If the user asks for options but does not give a count, suggest a count within one through four before the paid boundary. Do not interrogate the user for every field.

## Common production scenes

- **Product images**: transform a supplied product into a new scene and review shape, color, label, logo, and material drift, or generate an explicitly fictional product concept from text.
- **Ad and brand visuals**: define one message, audience, palette, composition, and destination, using supplied brand or product assets when fidelity matters.
- **Social graphics and posters**: choose the destination orientation and required negative space; generated typography and logos always need inspection.
- **Illustrations and concept art**: name a coherent style family, composition, light, and finish instead of stacking vague quality words.
- **Photo or background changes**: use edit with the original first. Add normalized regions only when the requested change is local.
- **Reference-led composition**: label and order each reference, state what it should contribute, and say which details are must-keeps rather than assuming reference fidelity.
- **Series work**: reuse the reviewed brief, exact wording, and references across separate image requests. Treat consistency as a review goal, not a guarantee.

## One stage or a bounded sequence

Most requests need one paid image stage. A reviewed result can become the base of a later edit or a reference in a later transform, but the follow-up is new paid work.

For a finite campaign or series, a single approval may cover a declared maximum number of stages and successful outputs. Freeze each stage separately with its own stable `client_request_id`, execute stages sequentially, and review every returned image before a dependent stage. If a source drifts, a required output fails, or the next payload must change, the earlier approval no longer covers the changed stage; stop and replan.

Planning, visual direction, prompt drafting, and critique make no billable image call. Do not create request IDs while the route, source order, base, canvas, count, model, or paid scope is unresolved.
