# Canvas and cover craft

## Freeze one destination

Each logical request has exactly one target canvas. Prefer the user's exact pixel target.
For a standard WeChat article cover, propose `900 × 383`; for an accepted draft, preserve
its existing ratio unless the user asks for another destination. Ask once only when the
destination materially changes composition or title safety. Encode the chosen canvas
explicitly as `{"type":"target","width":W,"height":H}` or as a confirmed supported
preset with a concrete aspect ratio. Do not rely on a tool default and do not inherit a
reference image's ratio on the transform route.

A second ratio, alternate crop, or platform variant is a separate paid request. The
quality tier describes generation quality, not guaranteed delivered pixels; review actual
dimensions after completion when they are observable.

## Compose for a small card

Build outward from one visual hook:

1. Give the focal subject a clear silhouette and enough scale to survive thumbnail view.
2. Establish hierarchy with one dominant mass, one supporting field, and controlled
   contrast rather than many equal details.
3. Keep essential faces, products, logos, and title areas away from vulnerable edges.
4. Describe the intended negative space, contrast, and direction of visual movement.
5. Treat downstream cropping as a risk to inspect, not a crop guarantee.

## Title in image

Include the exact short title once, in quotation marks, and specify a simple placement,
reading order, background contrast, and generous edge clearance. Ask the image model for
no other lettering. When the host can see the result, compare every character and check
line breaks and legibility. If the title is wrong, do not describe it as verified.

Image generation cannot guarantee a precise font, kerning, line wrap, logo shape, or
repeatable layout. When any of those is essential, switch the brief before confirmation to
a text-free background with a title-safe area; add typography later with a deterministic
design tool outside this workflow.

## Text-free title-safe background

Say `no text, no letters, no typography` and reserve a named region such as the upper-right
third. Specify that the region stays visually quiet and contrasts with the intended title
color. Keep the hook outside that region and avoid fine details crossing it.

## Color discipline

For one desired brand color, name its hex value or plain-language color directly in the
prompt. Structured `palette` is only for three to ten colors. Use `#RRGGBB`, positive
weights with no more than four decimal places, and an exact sum of `1.0000`, for example
`0.5000 + 0.3000 + 0.2000`. Color guidance does not guarantee exact display color and
must be visually reviewed when the host can see the artifact.

## Review order

Review the visible result in this exact order:

1. thumbnail recognition;
2. visual hierarchy;
3. focal point;
4. title-safe contrast or rendered-title legibility;
5. target-canvas fit and actual dimensions;
6. crop risk.

Then check must-preserve identity, product, logo, and brand details. Do not claim any of
these checks when the host cannot actually see the returned image.
