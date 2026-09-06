# Questions and anti-patterns

Symptoms a user reports, and the practice each one calls for. The procedures
live in [hot topic workflow](workflow.md), [building the post](post-plan.md) and
[finding the angle](angle-finding.md); this file routes a symptom to the right
one and names the habits that spend money on a guess.

## The cover text came back garbled or misspelled

Generated text is unreliable at small sizes and in dense strings, and Chinese
characters are the hardest case. Report the characters actually visible rather
than the ones that were requested, and treat it as a review finding rather than
a reason to resubmit the identical prompt.

The fix is usually shorter wording, not another attempt. A headline of about ten
characters survives generation and renders at thumbnail size; longer wording
fails both. If the wording is already short and still fails, offer the
user the choice between accepting a cover without on-image type and carrying the
hook in the caption instead.

## The user says the angles all sound the same

That is the account being missing, not the angle work failing. Angles connect a
topic to a specific industry, brand, or persona; without one, the output is
generic trend commentary and every angle reads alike. Ask for the account before
writing more angles, not after.

If the account is known and the angles still converge, the topic is probably
carrying them — check that each angle leads with something other than the topic
itself. See [finding the angle](angle-finding.md).

## A trend lookup returned nothing worth using

That is a real outcome and it was still paid for. Say plainly what came back,
and do not top it up with plausible-sounding trends that were not in the result.
Work from what the user brought instead, which is the ordinary shape of this
route anyway.

Remember which platforms have no board at all. A lookup cannot be run where
there is nothing to read, and saying so before charging is the point of
confirming each lookup on its own. See
[looking up what is trending](trend-lookup.md).

## The clip came back a different length than planned

Its finished length follows the narration, not the requested number. Read the
returned duration rather than the one submitted, and report that.

When the mismatch is large, the cause is nearly always the spoken fields being
written past the beat budget and then trimmed at synthesis. Budget the words
before the speech call rather than cutting after it — the rates are in
[building the post](post-plan.md).

## The user wants a different aspect ratio after production

Every paid artifact was produced at the frozen canvas, so changing the ratio
means producing them again. That is why the ratio and its consequence are named
in the first approval card rather than assumed.

Say what a change would cost before offering it, and do not re-render selectively
to hide the cost — a post whose cover and beats came from different canvases
reads as two posts.

## The run stops on insufficient balance

Relay the returned message, keep the top-up URL inside the balance error exact,
and translate the rest. Retry the same frozen `client_request_id` with the same
payload once the user says they have topped up; a new ID would be new paid work.
State that nothing was charged only when the error itself says so.

## A task is queued or running longer than expected

Queued and running mean wait. Poll only the task you recorded, and never submit a
second request because the first is slow — that pays twice for one artifact.

## The create response is lost

Resubmit only the identical frozen payload under the same identifier. If the task
ID itself is lost, list tasks for that capability and match candidates against
your own ledger before any retry. A trend lookup lists under the
`social_data_fetch` capability, but returns no resolved model or dimensions, so
match its candidates on the saved `operation_key`, arguments, and `schema_hash`.

## The user asks whether the post is safe to publish

Screen the copy during the free stage, which is what that stage is for. Absolutes
and superlatives, efficacy claims the user cannot substantiate, prices without
their unit, and any statement about the real event that the user did not supply
all get fixed before anything is paid for. The rules are in
[building the post](post-plan.md).

Trending pegs raise this rather than relax it: a post that rides a moment is seen
by more people than the account's usual audience, including people who will check
the claim. When a fix is not possible, say which line cannot ship rather than
softening it.

## The topic turns out to be a real event involving real people

Read the risk before writing angles, not after. Where a topic involves someone's
loss, a live dispute, a named person, a regulated subject, or a fuse short enough
that the situation may change before the post lands, say so and offer the user
the choice. See [finding the angle](angle-finding.md) for the five risk classes
and how each is handled.

## Anti-patterns

**Offer the angles in the first reply.** Speed is the constraint this whole route
is shaped around. A round of clarifying questions before any angle spends the
window the topic was worth.

**Screen the copy while it is still free.** Compliance findings after production
cost a re-render; before it they cost a sentence.

**Never leave the video model to `auto` on this route.** Most models on that
capability do not accept supplied narration, and choosing one silently discards
it. Select an admitted model explicitly and read its duration behaviour from the
live card.

**Read the live card for prices and limits.** Model availability, price, duration
support, and canvas limits are server truth. A remembered price quoted to a user
is wrong the day the server changes it.

**Cover approval is not shoot approval.** The two production gates exist so the
cheap reversible work is approved separately from the expensive irreversible
work. Approving the cover, the frames, or the narration authorizes none of the
video, and a run that opens with a trend lookup confirms that separately again.

**Do not invent what the lookup did not return.** A thin result reported honestly
is worth more than a rich one that was partly written by the agent.

**Deliver every beat still.** The frames that were not animated are finished
artifacts the user paid for, not intermediate scrap.

**Report returned truth.** Task IDs, resolved models, returned dimensions and
durations, and `billing.net_charged_credits` are read from the task, never
inferred.
