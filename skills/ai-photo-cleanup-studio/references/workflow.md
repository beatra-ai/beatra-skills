# Photo cleanup workflow

## Establish the base photo

The user's photo is always the first input, because `beatra.images.edit` keeps
the first image as the base. Upload a local file once and reuse the artifact:

```text
python3 scripts/mcp_client.py upload ./street.jpg --mime-type image/jpeg
```

An artifact already returned in this conversation, or a supported direct HTTPS
image, does not need another upload. Later images are optional references, not
extra bases.

## Write the removal

Before any paid call, settle three things in plain words:

- **What goes** — the specific object, named so it cannot be confused with
  anything else in the frame.
- **What stays** — the people, product, text, or structure that must survive
  untouched.
- **What fills the space** — normally a continuation of the surroundings already
  in the frame: the same wall, pavement, sky, water, or table surface.

Then turn that into one instruction that describes the finished picture rather
than the editing action.

## Focus the change with regions

`edit_regions` is a list of normalized rectangles — axis-aligned boxes, not a
freeform mask or brush. Each carries `image_index`, `x`, `y`, `width`, and
`height` between 0 and 1, must stay inside its image, and **each input accepts at
most two regions**. Omit regions entirely for a whole-image edit.

A region focuses intent but does not guarantee that pixels outside it are
untouched. Review the delivered image for drift outside the box rather than
assuming there is none, and never tell the user a nearby face, product, or line
of text is guaranteed safe.

```json
{
  "images": [{"type": "artifact", "artifact_id": "art_base_photo"}],
  "prompt": "Remove the two people walking behind the subject and continue the stone pavement and railing that sit behind them. Keep the subject, her clothing, the bag, and the harbour in the background exactly as they are.",
  "edit_regions": [
    {"image_index": 0, "x": 0.62, "y": 0.28, "width": 0.16, "height": 0.42},
    {"image_index": 0, "x": 0.80, "y": 0.31, "width": 0.12, "height": 0.38}
  ],
  "count": 1,
  "client_request_id": "opaque-cleanup-id"
}
```

Regions require that the host Agent can actually see the photo. If it cannot, do
not estimate coordinates: either ask the user to describe where the object sits
and use a whole-image edit, or stop and say the region route is unavailable.
Never spend a paid call on a guessed rectangle.

Read the geometry off the actual picture: `x` and `y` are the top-left corner as
a fraction of width and height, and a box should sit slightly wider than the
object so its edges and contact shadow fall inside. A region that clips the
object leaves a fragment behind.

Prefer regions when the target sits near a face, a product, text, or anything
else that must not drift: focusing the edit materially reduces drift even though
it does not eliminate it, and it is the strongest control available. Prefer a
whole-image edit when the clutter is scattered, small, or awkward to box, and say
so before submitting, because the whole frame is then in scope.

## More targets than one pass admits

Two regions per input is the ceiling, so three or more boxed targets are split
into separate passes. Group them by how close they sit and how much of the
surroundings they share, run the first pass, and use its returned image as the
base of the next, so each pass builds on the last result rather than the
original. Every pass is a separate paid call with its own confirmation and its
own stable `client_request_id`.

Show the grouping and the total cost of all passes before submitting the first
one. Never drop a target the user named without saying so, and never run an
extra pass the user has not approved.

Because the passes are chained, a failed pass blocks every pass after it. A
terminal `failed` is a known response rather than an unknown one, so re-running
that pass is new paid work: take a new confirmation and mint a new
`client_request_id` instead of replaying the old identity. The passes already
delivered sit upstream of the failure, stay valid, and are not regenerated. The
re-run returns a different image, so re-derive every later pass's regions against
that new base and confirm them again before submitting.

## What the filled space is

The area behind a removed object is reconstructed from its surroundings. It is
plausible new picture, not recovered detail, so it will not match what was
actually hidden there. Say this whenever the covered area carried something the
user needs to be accurate — a face, a sign, a price, a serial number, a document,
or a specific part of a product — and offer a tighter region or a different
source photo instead.

## Read the live card

```text
printf '%s' '{"capability":"image_edit"}' | python3 scripts/mcp_client.py call beatra.models.list
```

Take compatibility, controls, input limits, and price from the returned card
rather than from memory. If the actual photo is incompatible with the returned
card, stop before the paid call and offer the smallest compatible change.
Images are charged per successfully delivered image, so `count` multiplies the
charge; keep it at 1 until the user has seen a result.

The omitted canvas is a 2K tier that follows the base photo's aspect ratio.
Framing and aspect are unchanged, but a tier describes quality rather than exact
pixels, so a photo larger than 2K comes back smaller than the original. Say so
before submitting when the user's photo is larger than that, and treat an
unrequested change of aspect as a sign the payload is wrong.

## Confirm, submit, and recover

Finalize the base artifact, the instruction, the regions or the whole-image
route, `count`, and the pass grouping before creating the stable
`client_request_id`. Show the frozen payload and the current maximum charge, then
submit `beatra.images.edit` exactly once per pass and poll each task.

Keep a private ledger row per pass: logical label, full frozen arguments, stable
request ID, approval, creation time, create response, task ID, and terminal
result. An identical retry preserves every validated argument; any accepted
change is new paid work with a new identity and a fresh confirmation.

If a create response is lost, retry only the identical frozen payload with the
same ID. If a task ID is lost, call `beatra.tasks.list` with
`{"capability":"image_edit","limit":50}` and follow `next_cursor` until the
ledger's creation time is passed, call `beatra.tasks.get` on plausible
candidates, and match returned facts against the ledger; an ambiguous match stops
submission. An unscoped, unpaged search returns the most recent tasks across
every capability, misses the one being looked for, and ends in a duplicate paid
submission. If the request ID itself is lost, do not invent
a new one and do not replay.

Cancel only at the user's request. Call `beatra.tasks.cancel` once and confirm a
terminal state with `beatra.tasks.get`. On `409`, keep polling the same task.

## Deliver and review real results

Deliver every returned image with its real dimensions, MIME type, size, and URL
or artifact ID, plus the resolved model, the actual usage, and
`billing.net_charged_credits`.

Review only what the host Agent can actually see. Check that the named object is
gone, that the filled area continues its surroundings rather than showing a
smear or a repeated patch, that edges and shadows around the removal read
naturally, and that everything the user asked to keep is unchanged. Do not claim
to have verified a clean removal when the host cannot view the image — say so
instead.

When one focused revision would help, name the single largest gap — usually a
region that needs to sit slightly wider — turn it into one changed payload, and
wait for a new paid approval.
