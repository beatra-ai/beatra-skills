# Listing-set questions and anti-patterns

Symptoms a seller reports, and the practice each one calls for. The procedures
themselves live in [listing-set workflow](workflow.md) and the shared runtime
references; this file routes a symptom to the right one and names the habits
that produce a wrong gallery.

## The seller says an image looks wrong

Name what is wrong before offering to remake anything, because the three causes
take different routes.

**The SKU itself is wrong** — shape, colour, label, material, or included items
drifted from the product photo. Re-read the slot's fact card, state the specific
must-keep that moved, and offer one bounded `beatra.images.edit` correction on
the accepted image. A whole new transform is warranted only when the drift is
structural.

**The slot is right but soft, dark, or busy** — the SKU is faithful and the
composition is not. This is a prompt problem in that one slot. Change the scene,
lighting, or crop language, then take that slot back through confirmation and
submit it under a new `client_request_id`; keep the canvas and the fact card
unchanged so the gallery stays coherent.

**On-image text is misspelled** — generated small text is unreliable by nature.
Report the characters actually visible, treat the text as a review finding, and
prefer a slot that carries the claim through composition instead of type. Do not
resubmit the identical prompt hoping for cleaner letters.

Say which of the three it is. Reporting "the image looks off" and regenerating
spends the seller's credits on a guess.

## The seller asks whether the images are correct

Report only what the host can actually see. When a result cannot be viewed,
deliver the artifact, say plainly that it has not been visually inspected, and
give the seller the slot's must-keeps to check against. A confident review of an
image the host never rendered is the most expensive error in this package: the
seller ships it.

## A task is queued or running longer than expected

Queued and running work is the original work. Poll it with `beatra.tasks.get`
until a terminal state. Elapsed time is not evidence of failure, and a second
submission of a slot that is still running charges twice for one image.

## The create response is lost

Follow the recovery path in [listing-set workflow](workflow.md): the identical
frozen payload under its original `client_request_id`, and a `beatra.tasks.list`
search when the ID itself is gone. The judgement that belongs here is the last
step of it — an ambiguous match is not a match, and never authorizes a
replacement request.

## A slot comes back failed

A terminal failure ends that slot's approved work. Report the terminal error
instead of quietly trying again: the frozen call count is what the seller
approved, and a seventh call on a six-slot set exceeds it. Whether it also
exceeds the approved total depends on what the failed task reports as charged
and refunded — report those returned figures rather than inferring them.
Re-running the slot is new paid work, with the seller's approval and a new
`client_request_id`.

## The seller wants to change one slot after approving the set

[Listing-set workflow](workflow.md) sets what counts as a change and what it
costs. What belongs here is the timing: say so at the moment the change is
requested, with the added price, rather than absorbing it silently and
surprising the seller at delivery.

## The seller asks what this has cost

Read the balance and the deductions the way [listing-set
workflow](workflow.md) describes, and take the per-task charge from each task's
returned `billing.net_charged_credits`. Never total up the prices quoted during
planning and present that as the charge.

## The run stops on insufficient balance

The set plan survives. Report which slots completed, which are frozen and
unsubmitted, and what remains to be spent; the seller tops up and the run
resumes from the frozen plan with the original IDs. Do not rebuild the plan and
do not re-price the completed slots. See
[billing, errors, and recovery](billing-errors-and-recovery.md).

## Anti-patterns

Each of these is stated as the practice to follow. The failure beside it is what
the habit costs.

**Source every slot from a confirmed fact.** A dimension, certification,
accessory, package content, or benefit that the seller did not supply is
fabricated no matter how plausible it looks in a listing image — and a listing
image is a claim the marketplace can act on.

**Read the product photo as a visual reference only.** It shows what the SKU
looks like. It is not a source for what is in the box, what the product
measures, or what it is certified to do.

**Confirm the ordered set before the first paid call.** Planning is free.
Building three images and then discovering the seller wanted a different slot
order has already spent the credits.

**Submit one slot per request with `count: 1`.** A six-slot gallery is six
requests. Asking one call for six images is not a supported shape, and turning a
slot into multiple candidates spends approved budget on work the seller did not
approve.

**Keep main-image rule checks with `marketplace-main-image-preflight`.**
Marketplace rules change per storefront and per category. Answering a compliance
question from memory inside this package gives the seller a confident answer
that no current rule source stands behind.

**Honour the in-flight ceiling set in [listing-set workflow](workflow.md).**
Beyond it the connection, not the gallery, decides what completes.
