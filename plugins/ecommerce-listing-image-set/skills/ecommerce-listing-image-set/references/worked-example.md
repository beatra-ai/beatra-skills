# A complete listing set, start to finish

One full run for a single SKU, showing what the seller supplies, what each
artifact looks like at each stage, and the exact prompt text for six slots. The
product below is a template, not a real customer. Substitute the seller's own
facts; the shape is what carries over.

## What the seller brought

Two photos of the exact SKU — a front-on studio shot and a three-quarter view —
plus these confirmed facts:

    SKU              Stoneware pour-over dripper, matte charcoal, size 02
    Visible details  Unglazed rim; embossed maker's mark on the front face
    In the box       Dripper, one linen filter, care card
    Dimensions       11.5 cm across at the rim, 9 cm tall
    Approved claims  Ceramic holds heat through the brew; fits a 1-2 cup carafe
    Use context      Morning pour-over on a kitchen counter
    Destination      Shopify product page and an Etsy listing
    Direction        Warm neutral surfaces, soft window light, no props
                     competing with the product

Everything the gallery says traces back to those lines. The seller did not state
dishwasher safety, so no slot shows a dishwasher, and no prompt implies one.

## The fact card, resolved into slots

| Slot | Buyer question | Fact source | Visual role |
| --- | --- | --- | --- |
| 1 | What is the exact product? | front-on photo, colour, maker's mark | clean product hero |
| 2 | What is the rim like? | unglazed rim, front-on photo | close detail |
| 3 | Does it hold heat? | approved claim, three-quarter photo | material-led view, steam in use |
| 4 | Where is it used? | approved use context | kitchen counter scene |
| 5 | How big is it? | 11.5 cm rim, 9 cm tall, 1-2 cup carafe | scale composition beside a carafe |
| 6 | What arrives? | dripper, linen filter, care card | in-box arrangement |

Slot 3 is worth noticing. The claim is "holds heat through the brew", which is
about the material, so the slot shows the dripper mid-brew rather than putting
the sentence on the image as text. A claim rendered as a picture survives a
marketplace review; a claim rendered as type invites one.

## The prompt suite

Every prompt names the slot, states that image 1 is the verified SKU, lists the
must-keeps, and closes with the shared direction. That last clause is identical
across all six — it is what makes the set read as one gallery rather than six
unrelated images.

The shared direction clause, reused verbatim:

    Warm neutral surfaces, soft directional window light from the upper left,
    shallow depth, matte finish, the product alone in frame.

The seller stated that last part as an absence — "no props competing with the
product". It was restated positively before it entered the clause, because a
clause that lists absences is reused verbatim into all six prompts and tends to
render what it forbids.

    Slot 1  Create the approved clean product hero. Image 1 is the exact
            verified SKU. Preserve its matte charcoal colour, unglazed rim,
            embossed maker's mark, and silhouette. Centre the product on a
            plain warm-neutral surface with the mark facing the camera.
            <shared direction>

    Slot 2  Create the approved rim detail. Image 1 is the exact verified SKU.
            Preserve the unglazed rim texture against the matte body. Move in
            close on the upper third of the dripper so the two surfaces meet
            in frame. <shared direction>

    Slot 3  Create the approved in-use material view. Image 1 is the exact
            verified SKU. Preserve its colour, rim, and mark. Show the dripper
            seated on a carafe mid-brew with visible steam.
            <shared direction>

    Slot 4  Create the approved lifestyle scene. Image 1 is the exact verified
            SKU and remains the focal point. Place it on a kitchen counter in
            morning light with the carafe beside it. Preserve colour, rim, and
            mark. <shared direction>

    Slot 5  Create the approved scale view. Image 1 is the exact verified SKU.
            Show the dripper beside a two-cup carafe so the 11.5 cm rim reads
            at a glance. Preserve colour, rim, and mark. <shared direction>

    Slot 6  Create the approved in-box arrangement. Image 1 is the exact
            verified SKU. Lay out exactly the dripper, one linen filter, and
            one care card — nothing else. Preserve colour, rim, and mark.
            <shared direction>

Slot 6 says "nothing else" on purpose, and it is the one slot allowed to say
it: an enumerated-contents slot needs an explicit bound, because an in-box shot
is where a model will helpfully add a scoop or a bag of beans that the seller
never ships. No other slot in this suite names an absence.

## The confirmation card the seller sees

    Listing set — stoneware pour-over dripper, matte charcoal, 02
    6 slots, 6 images, 1 image per slot, canvas 2K 1:1, model auto

    1 Product hero      front-on photo + SKU facts
    2 Rim detail        unglazed rim (visible in photo)
    3 Material in use   "holds heat through the brew" (approved)
    4 Lifestyle         approved use context
    5 Scale             11.5 cm rim / 9 cm tall (confirmed)
    6 In-box            dripper, linen filter, care card (confirmed)

    Source order: verified SKU photo first, three-quarter photo second.
    Price: <current per-image price from beatra.models.list> x 6
    Maximum total: <that figure> for 6 calls
    Concurrency: 2 tasks in flight

    Stop after any slot and you keep every image already delivered, with its
    slot plan and fact sources; the rest of the plan stays frozen.
    If the balance runs out mid-run, the frozen plan and the completed slots
    survive — top up and the remaining slots resume under their original IDs.

    Nothing is submitted until you approve this set. Changing a slot, fact,
    canvas, or order after approval is new paid work.

Prices come from the live `beatra.models.list` card at the moment of
confirmation. Do not carry a figure over from an earlier run.

## What delivery reports

Per slot, in slot order: the artifact, the buyer question, the fact source, the
observed dimensions and format, the resolved model, the task ID, and
`billing.net_charged_credits`. Then across the set: whether the six read as one
gallery, whether any slot duplicates another, and any visible issue found on
review.

For a slot the host could not render, say so in that slot's line rather than in
a footnote — "artifact delivered, not visually inspected" — and give the seller
its must-keeps to check.

## Where this run went next

The seller accepted five slots and asked for the hero to sit lower in frame.
That is a bounded change to an accepted image, so it went to
`beatra.images.edit` with the accepted hero as `images[0]`, at one image's
price, with a fresh ID and its own approval. The other five were untouched, and
the shared direction clause meant the re-framed hero still matched them.
