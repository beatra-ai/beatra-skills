# Questions and anti-patterns

Symptoms a user reports, and the practice each one calls for. The procedures
live in [hot topic workflow](workflow.md), [building the post](post-plan.md) and
[finding the angle](angle-finding.md); this file routes a symptom to the right
one and names the habits that spend money on a guess.

## The cover or a card came back with garbled text

Generated text is unreliable at small sizes and in dense strings, and Chinese
characters are the hardest case. Report the characters actually visible rather
than the ones that were requested, and treat it as a review finding rather than
a reason to resubmit the identical prompt.

The fix is usually shorter wording, not another attempt. A headline of about ten
characters survives generation and renders at thumbnail size; longer wording
fails both. When a cover or card is already short and still wrong, offer one
`beatra.images.edit` with the exact text quoted, on its own one-call card with the
live `image_edit` price, and make it only after the user approves. If that is
still wrong, stop retrying the text: both images still carry wrong characters.
The user chooses between taking the better one as returned, with the wrong
characters listed and the text alongside for the platform's own editor or the
caption, and one more carded call for a text-free base. The steps are in
[hot topic workflow](workflow.md).

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

## The finished video could not be joined

When the day's allowance for joining is used up, the parts are delivered now
and there is no retry. When the join task fails, it gets one more attempt with
the identical payload under a new request ID, per
[hot topic workflow](workflow.md), and if that fails too the parts are
delivered. The parts are every clip, the narration, one music track, an SRT
subtitle file, and an edit list that says which clip goes where, whether its
own sound is kept, and where the music is cut and faded.

- **Scene video:** the shots are muted and the narration is its own track. Lay
  the narration from the start, the muted shots over it in order, the music
  under it, and the subtitles on top.
- **Presenter video:** each take already speaks its own lines, lip-synced, so its
  sound is kept and no narration track is laid; the narration files are for
  reference. Lay the takes in order, the music under them, and the subtitles on
  top.

The edit list's rows are that order. See [content pack](content-pack.md).

## The music is longer than the video

The music model decides the length. The join trims it to the video and fades it
out at the end. When the parts are delivered instead, the edit list says where
it is cut and faded. Never generate it again to get a shorter track.

## A subtitle in the finished video is wrong

The subtitles come from the approved narration, so first check the narration
text. A wrong or mistimed line is fixed in the cue and the clips are joined
again, and nothing paid is made again. When the narration itself was spoken
wrong, that is a new speech call, and for a presenter take a new video call
too, each on its own card.

## The user wants to cut the video themselves

Every clip, the narration, the music, and the SRT are delivered beside the
finished video. Give the edit list too, per [content pack](content-pack.md).

## The user offers someone else's photo as the presenter

Ask whether they are the person pictured or have that person's consent. If not,
offer the virtual presenter, which resembles no real person, or their own photo.
Never make a virtual presenter that looks like a public figure. A real public
figure's face goes on the presenter only through that confirmation, because a
clip that seems to show a real person saying what they never said is
impersonation.

With that confirmation, upload the photo with the bundled client's `upload`
command and check it against the video card before it goes on a card. After its
video is delivered, the photo can be saved as an avatar with
`beatra.avatars.save`, once the user confirms the consent sentence for whoever is
pictured. Both steps are in [hot topic workflow](workflow.md).

## The clip came back a different length than planned

Read the returned duration rather than the one submitted, and report that.

When the mismatch is large, the cause is nearly always the spoken fields being
written past the speaking budget and then trimmed at synthesis. Budget the words
before the speech call rather than cutting after it — the rates are in
[content pack](content-pack.md).

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

**Never leave the video model to `auto` when the clip carries narration.** Most
models on that capability do not accept supplied narration, and choosing one
silently discards it. A per-shot clip without narration may use `auto`. Select an admitted model explicitly and read its duration behaviour from the
live card.

**Read the live card for prices and limits.** Model availability, price, duration
support, and canvas limits are server truth. A remembered price quoted to a user
is wrong the day the server changes it.

**Materials approval is not video approval.** The two production gates exist so
the cheap reversible work is approved separately from the expensive irreversible
work. Approving the cover, the cards, the stills, the narration, or the music
authorizes none of the video, and a run that opens with a trend lookup confirms
that separately again. The first card still shows the whole set's estimated
total, so the second price is never a surprise.

**Do not invent what the lookup did not return.** A thin result reported honestly
is worth more than a rich one that was partly written by the agent.

**Deliver every still and every card.** Images that were not animated are
finished artifacts the user paid for, not intermediate scrap.

**Report returned truth.** Task IDs, resolved models, returned dimensions and
durations, and `billing.net_charged_credits` are read from the task, never
inferred.

**Never pass the narration with clips that keep their own sound.** A presenter
take already speaks its lines, and laying the narration again plays every line
twice.

**Join only when every clip exists.** A video with a missing shot is not
finished. Deliver what was made, as parts.
