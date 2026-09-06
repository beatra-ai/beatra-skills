# Questions and anti-patterns

Symptoms a merchant or host reports, and the practice each one calls for. The
procedures live in [planning the session](session-plan.md),
[writing the talk track](talk-track.md) and
[live-commerce workflow](workflow.md); this file routes a symptom to the right
one and names the habits that spend money on a guess.

## A line will not pass the compliance screen

Offer the closest wording that does pass, and continue from there — do not stop
the run to ask what to do. The screen exists in the free stage precisely so this
costs a sentence rather than a re-render.

Say which line changed and to what, in the compliance list that ships with the
plan. A merchant who sees only the cleaned copy cannot tell you the original was
a claim they can actually substantiate, which is the one case where the line
should go back in.

## The merchant insists on a line the screen rejects

Their instruction does not change what a platform reviewer will do with a
transcript. State which words carry the restriction and what would make the
claim sayable — usually a document they already have. If they supply it, the
line goes in with the evidence attached; if they do not, it stays out and that
is recorded as needing their confirmation before air.

Softening an absolute into a hedge is the worst of the three options: it keeps
the exposure and loses the persuasion.

## The card came back with a wrong number

Card text is generated artwork, so every figure is read back against the
approved schedule after rendering — that read-back is the step, not an
afterthought. Report the digits actually visible rather than the ones requested.

A wrong figure is a re-render of that one card under a new request ID, not a
reason to re-run the set. A card whose figure is right but whose text is
misshapen is the same fix. Do not hand a card to a host without the read-back
having happened.

## The host says the lines do not sound like them

The line library is written to be read aloud as-is, so this is a real defect
rather than a preference. Rewrite in the host's register and keep the structure:
the seven steps stay in order and the twelve categories stay populated, because
those carry the selling logic rather than the voice.

Bring the host in before production if they are available. A take synthesized in
a voice the host will not use is paid work with no audience.

## The merchant changes a price after approval

Every changed argument is new paid work with a new request identifier and fresh
approval. That includes a price on a card already rendered, because the figure
is baked into the artwork.

Say what the change costs before making it. A price that moves during the session
is a schedule problem rather than a card problem — the host reads the live number
from the schedule, and only cards need re-rendering.

## The session is longer than planned, or the lineup grew

A session past six hours or a lineup past eight featured products is confirmed
rather than absorbed. Both change the schedule's shape, not just its length: the
three phases have to hold, and a lineup that outgrows its slots produces products
introduced with no selling chain behind them.

## Stock or price figures are not verified

Do not write them into a line. Urgency is stated as fact because the room can
check it: a stock number that does not move as it is announced costs more
credibility than the urgency buys. Ask the merchant to verify, and meanwhile
choose an urgency type that is true — a time-based line needs no stock figure.
A held slot is the exception: it states a release quantity by definition, so
hold the slot itself until the number arrives.

## A take came back the wrong length

Read the returned duration, size and MIME type rather than the requested ones.
Spoken takes follow the words written, so a long take is a script problem —
shorten the line rather than resynthesizing the same text and hoping.

## The run stops on insufficient balance

Relay the returned message, keep the top-up URL inside the balance error exact,
and retry the same frozen request ID once the merchant says they have topped up.
A new ID would be new paid work. State that nothing was charged only when the
error itself says so.

## A task is slow, or a create response is lost

Queued and running mean wait; poll only the task you recorded. If a create
response is lost, resubmit only the identical frozen payload under the same
identifier. If the task ID itself is lost, list tasks for that capability and
match candidates against your own ledger before any retry.

## Anti-patterns

**Screen before producing, not after.** A compliance finding in the free stage
costs a sentence. The same finding after rendering costs every card that carries
the line.

**Do not screen by substring.** The banned list is about claims, not strings.
Cutting a time ordinal because it contains a ranking word destroys copy that was
already compliant.

**Never invent a number to create pressure.** A stock figure that does not move
as it is announced is visible to the room.

**Write lines to be read, not instructions to be interpreted.** A host reading
live cannot expand a stage direction into a sentence.

**One approval covers the cards and the takes together.** There is no second
gate, so the one card has to carry every figure, every line getting a take, the
voice, and a request ID per call — before anything is spent.

**Read the live card for prices and limits.** Model availability, price and
voice compatibility are server truth, and a remembered price is wrong the day
the server changes it.

**Report returned truth.** Task IDs, resolved models, returned durations and
`billing.net_charged_credits` are read from the task, never inferred.
