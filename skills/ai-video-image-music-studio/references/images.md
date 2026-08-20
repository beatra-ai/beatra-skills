# Images

Choose one intent before constructing arguments:

1. No source image: use `beatra.images.generate`.
2. Existing images guide a new composition: use `beatra.images.transform`.
3. Preserve a base and change it: use `beatra.images.edit`.

Authenticated Beatra MCP is the image execution contract. Run image tools
through the Skill's bundled `scripts/mcp_client.py` like every other Beatra
tool.

## Generate from text

Use `beatra.images.generate` with no source image. Translate the requested
subject, setting, composition, style, and constraints into one coherent prompt.
Omit `model`, or use `model: "auto"`, unless the user explicitly selects one.

## Transform ordered references

Use `beatra.images.transform` when one to four ordered input images guide a new
composition. Upload local inputs once and reuse each artifact ID. Describe both
the intended change and the properties that must remain recognizable. A preset
canvas with `aspect: "source"` follows the last image.

## Edit a base image

Use `beatra.images.edit` with one to four ordered input images when the first
image must remain the base. Later images are optional references. A preset
canvas with `aspect: "source"` follows the first image.

Use `edit_regions` only for bounded edits. Each region is a normalized rectangle
with `image_index`, `x`, `y`, `width`, and `height` from 0 to 1. It must remain
inside its image, and each input accepts at most two regions. Omit regions for a
whole-image edit.

## Defaults and public limits

- All three tools request one to four outputs; the default `count` is 1.
- Generate and transform default to a 2K 16:9 canvas. Edit defaults to a 2K
  canvas that follows the base image's aspect ratio.
- `output_relationship` defaults to `independent` where available.
- An omitted `seed` is random.
- Omitted or null `enhance_prompt` and `reasoning` keep the selected model's
  documented default.
- The public limit is still four when a concrete model can expose a lower input
maximum. An explicit incompatible model fails; `auto` may choose an eligible
model. Inputs are never silently dropped or merged.

Treat an explicit model as a compatibility commitment: reject unsupported
input counts or controls instead of changing the request.

Use `beatra.models.list` before making model, control, canvas, compatibility, or
cost claims. The returned interface card is current truth. Do not invent a
control or silently remove one that the chosen model cannot honor.

## Price, submission, and recovery

Image prices are whole credits per successful image. Query
`beatra.models.list` for the live `pricing.options`, estimate formula, and
billing basis. Match an option only when every entry in its `dimensions` agrees
with the admitted request; an empty dimensions object is the default option.
For a preset canvas, its tier supplies the `resolution` dimension. If a target
canvas or request-dependent `auto` route does not identify one option uniquely,
do not invent a tier: show the live range and use the highest eligible option as
the approval ceiling. Multiply the selected `unit_credits` only by the requested
output count. Source-image count is not a customer billing multiplier. The
final charge uses the successfully persisted image count, so a partial
multi-output result is not
billed as if every requested image succeeded.

Create one opaque `client_request_id` after the arguments are final and submit
exactly once. Poll the returned task with `beatra.tasks.get`; `queued` and
`running` are not failures. If the create response is lost, make an identical
retry with the same ID. Any changed prompt, image, model, or control needs a new
ID. A follow-up edit is new work even when it reuses an earlier artifact.
