# Diagnosis and routing

The host Agent diagnoses the image through its own visible-image reasoning before any
paid call. `beatra.assets.upload` only makes local bytes available to later image tools;
it is not an analysis tool and must not be described as one.

## Review dimensions

Inspect all eight dimensions, then name only the highest-impact problem cluster for the
first repair:

1. Subject or product fidelity: identity, silhouette, shape, color, packaging, and
   distinctive features.
2. Hand and face anatomy: finger count and joints, eye direction, teeth, ears, facial
   proportions, and asymmetry.
3. Skin, hair, and material texture: plastic skin, waxy highlights, repeated pores,
   fused hair, artificial fabric, glass, metal, or food texture.
4. Lighting: inconsistent direction, contact shadows, reflections, edge glow, and
   foreground/background mismatch.
5. Repetitive background: duplicated objects, tiled patterns, malformed crowds,
   over-smoothed bokeh, and implausible detail.
6. Composition: crop, subject scale, perspective, visual balance, and formulaic staging.
7. Text and logo integrity: spelling, glyph shape, logo geometry, label placement, and
   legibility.
8. Destination and canvas fit: platform use, aspect ratio, safe zones, resolution, and
   whether a crop or composition change is actually requested.

## Routing table

| Observed need | Route | Boundary |
| --- | --- | --- |
| One or two bounded defects while the rest must stay fixed | `beatra.images.edit` with at most two normalized rectangles | Rectangles refer to the first/base image and must not be represented as masks. |
| Texture, sharpening, color, or lighting issue across most of the image | `beatra.images.edit` without `edit_regions` | State every identity, product, layout, text, and background constraint in the prompt. |
| User wants a materially new scene or composition | `beatra.images.transform` | Honor the stated scene, canvas, and must-keeps; treat the source as guidance and review preservation after delivery. |
| Exact text, logo, identity, or product details matter | The smallest useful `beatra.images.edit` route | Carry every named detail into the prompt, keep the edit narrow, and compare the result with the source instead of claiming unverified exactness. |
| The image cannot be visually inspected | Request an accessible source before choosing a paid route | Do not invent a diagnosis or replace the missing source with a new image. |
| Paid parameters are not yet confirmed | Present the final route, count, model choice, and paid boundary | Keep the prepared repair intact while awaiting confirmation; do not substitute another route. |

Prefer the smallest route that addresses the confirmed priority defect. Do not bundle
unrelated improvements into the same paid request.
