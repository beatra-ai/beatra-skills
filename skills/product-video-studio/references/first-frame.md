# The first frame

The first frame decides two things that cannot be changed later: what the product looks like, and what shape the finished video is. Get both right here.

## Inspect before spending

Establish the photo's real facts, then compare each against the live image constraints on the selected video model card. Read the card with `beatra.models.list` for `image_to_video`; do not rely on remembered numbers.

Record and check:

- actual MIME type, against the card's `mime_types`;
- alpha channel, against `alpha_channel`;
- width and height, against `width_height_pixels`;
- aspect ratio, against `aspect_ratio_range`;
- byte size, against `max_size_bytes`.

Never infer a fact you did not read. If any actual value cannot be established, ask for a usable file instead of submitting and hoping.

### Alpha: test whether it is used, not whether it is present

Current cards advertise `alpha_channel: "not_supported"`. That rejects genuine transparency — it is not a reason to bounce every file that merely carries a fourth channel.

Screenshots, exports, and many phone edits produce `RGBA` images whose alpha is fully opaque and purely cosmetic. Those are safe once flattened, and flattening changes nothing a merchant would notice. Check the alpha channel's actual range before deciding: a channel with no transparent pixel is cosmetic; anything else is real transparency.

Flatten cosmetic alpha onto an opaque background as part of preparing the frame. Reserve asking for a new file for images that genuinely rely on transparency, where flattening would invent a background the merchant did not choose.

## Produce the video first frame

A marketplace still and a video opening frame are different pictures. A listing image centres the product edge to edge on a square canvas. A first frame has to survive motion.

Use `beatra.images.transform` with the merchant's photo as the first ordered reference and label the product's role explicitly in the prompt so it is preserved rather than reinterpreted.

Aim for:

- a vertical 9:16 canvas, because that is where commerce video is watched;
- headroom around the product, so a push-in has somewhere to travel and the product does not crop as it grows;
- clean, consistent lighting that reads at small sizes on a phone;
- a background that supports the product's category without competing with it.

Treat the product's shape, colour, finish, label text, and logo as must-keeps. Verify them against the source photo after the frame returns, and report any drift rather than promising exact preservation.

### The canvas is bound here

Of the live `image_to_video` models, only the one that accepts supplied narration derives its aspect ratio from the image. Every model that would take an explicit ratio refuses supplied audio. So the shape of the finished video is decided entirely by this frame, and changing it later means producing a new frame and a new video — every paid call again.

Say this to the merchant before the first paid call, not after the video arrives.

## Skip the retouch when it earns nothing

A photo that is already vertical, already admissible, and already clean does not need a paid transform. Use it directly as the first frame and say why. The cheapest correct route is still the correct route.

## The last frame, when a camera move is wanted

The two-frame route asks for a second image. Produce it with `beatra.images.edit` **on the accepted first frame**, changing only framing, distance, or setting.

Do not generate a second image independently from the original photo. Two independent generations drift — a slightly different handle, a different label position, a different shade — and the interpolation between them turns that drift into a visible morph. Editing the accepted frame keeps the product's pixels sourced from one place.

Keep the two frames compatible in ratio, subject scale, viewpoint, lighting, and scene logic. Describe only the movement between them; do not promise an exact path through every intermediate frame.
