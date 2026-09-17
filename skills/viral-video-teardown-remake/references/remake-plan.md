# Rewriting onto your subject

The teardown produced a structure. This stage carries that structure onto the user's own subject and turns it into something that can be shot.

## What carries over and what does not

Carry over table 2's line count and its per-line timing budget, table 3's shot count and the functional sequence of its shots, and the timing shape. Replace every piece of content.

The most common failure is a remake that keeps the reference's specifics — its numbers, its demonstration, its story — and swaps only the product name. That produces a claim the user cannot stand behind and a video that reads as a copy. Keep the skeleton; rewrite the flesh.

Timing shape means proportion, not exact seconds. If the reference gave 3 seconds of its 30 to the hook, a 12-second remake gives the hook about 1. Hold the ratios, then round to whole seconds.

## Write each beat as two fields

Every beat gets **on screen** and **spoken** as separate fields. Never merge them.

A merged field cannot be shot: the frame prompt needs the visual with no dialogue in it, and the narration needs the spoken line with no scene description in it. Writing them together means untangling them later, badly.

| Field | Written for | Contains |
| --- | --- | --- |
| On screen | The image call | Subject, framing, setting, lighting, motion, any on-screen text — no dialogue |
| Spoken | The speech call | The exact words in speaking rhythm — no scene description, no stage directions |

Budget the spoken fields against the target length. Natural narration runs roughly four to five Chinese characters, or two to three English words, per second.

What caps the target length depends on how the rebuild will actually be built, and the two routes cap it differently. A single continuous take is one generation call: the clip has to be at least as long as the narration and the selected live model card sets the maximum, so the whole spoken script — every beat added together — has to read aloud inside that live ceiling. A segmented rebuild splits the clip into units, and that split is what absorbs a clip longer than one card allows; the narration stays one continuous track, and the card's ceiling binds each unit's own duration rather than the script as a whole. See [three rebuild routes](rebuild-routes.md) for which route this rebuild takes.

Either way, total the spoken fields at the rate above before the shot list is shown, and cut lines until they fit the target length. Write to that budget rather than trimming after synthesis: a script that merely overruns its target costs a second paid call, and a script that overruns a single continuous take's ceiling stops the run outright, because shortening the video would cut off the ending. Discovering either one after a video call costs one of the most expensive calls in the run.

## Where the facts come from

Everything the user's remake asserts about the user's own subject comes from the user.

Specifications, prices, materials, ingredients, certifications, awards, before-and-after results, timeframes, and promotional terms are theirs to supply. When one is missing, write the beat around it — a beat can carry a demonstration or a scene instead of a number. Never fill the gap with a plausible-looking figure; the user is the one who answers for it.

What is safe to write without asking: what the subject visibly is and does, how it is used, who it is for, and the feeling the beat should carry.

## Screen the copy before it becomes a frame or a voice

Run every spoken and on-screen line through three checks while it is still free to change.

**Superlatives and absolutes.** Words claiming top rank, totality, or permanence — best, first, number one, absolute, permanent, national-grade, 100% — are restricted in advertising copy in several markets, and their local-language equivalents carry the same restriction. They are also cheap to replace. Rewrite to the specific thing that is actually true: not "the best cleaning power", but "lifts the mark in one wipe" when the user has seen it do that.

**Efficacy claims.** Health, medical, curative, weight, and safety outcomes need substantiation the user actually holds. Without it, move the line to what the user observed rather than what the product does.

**Prices.** A price stated without its unit, size, or condition invites a complaint. Whenever a number appears, the specification appears with it.

Then read it aloud once. Short sentences. Natural stops. No written-register connectives — the line has to sound like a person talking, because a voice is about to say it.

## The shot list

Deliver one table the user approves before any generation is paid for. An optional reference lookup, or a `beatra.videos.understand` read of a reference video file, may already have run and been paid for ahead of the teardown; each has its own gate and neither moves this one.

| Column | Contents |
| --- | --- |
| # | Beat order |
| Beat | Its function in this remake, assigned here rather than carried over |
| Seconds | In and out, contiguous, ending at the target length; the selected live model card's supported duration bounds the whole clip under a single continuous take, and each unit's own slice under a segmented rebuild |
| On screen | The visual, written so it can become an image prompt as-is |
| Spoken | The exact words |
| Note | Anything the shoot needs: on-screen text, a pace change, a sound cue |

Mark which beats become generated frames. How many are actually animated follows the rebuild route: under a single continuous take not every beat needs one — the opening frame governs the finished clip, and the rest are reference material for the user's own shoot — while a segmented rebuild gives every unit in the sequence its own reference frame and its own generation call, per [three rebuild routes](rebuild-routes.md). Say which is which, so the frame count in the confirmation is the frame count they expected.

## What the remake fixes

The teardown named one weakness in the reference. Say, in one line, how the remake addresses it. That is the difference between matching the reference and beating it, and it is the part the user remembers.

## Two modes this version builds, and one it does not

Read table 2 for whether the clip carries spoken dialogue, and table 3's subject column for whether the on-screen subject is a person speaking to camera. Those two answers place the clip into one of three shapes — talking head, voiceover, or no dialogue at all.

- **talking head** — dialogue, with the speaker on camera.
- **voiceover** — dialogue, with no speaker on camera.
- **no dialogue** — no spoken line at all.

**This version builds only the first two.** Every generation path this route runs always synthesizes and attaches a narration track — the single continuous take is audio-led, and a segmented rebuild still delivers one continuous narration track for the user to align — so a clip with nothing to say has nothing for that track to carry, and there is no path here that skips it.

**When the reference itself has no dialogue at all, say so plainly and stop before offering a third mode.** Do not present "no dialogue" as something this run can build — it cannot, end to end, in this version. Offer the two real choices instead: write a narration for the remake and build it as a voiceover, or treat the request as out of scope for now.

Decide talking head or voiceover once, for the whole clip, before writing a single line, and never mix the two inside one video.

Each mode requires a different set of locks. "Required" and "Advised" name a constraint on the finished clip — a subject, product, or voice identity that must not drift shot to shot, or a picture that must land on a specific last frame — not a specific tool or a specific price; which mechanism satisfies it, and what that mechanism costs, is set out below the table.

| Mode | Reads as | Voice lock | Subject lock | First-and-last-frame lock | Product lock |
| --- | --- | --- | --- | --- | --- |
| Talking head | Dialogue, speaker on camera | Required | Required | Optional | Depends on the subject matter |
| Voiceover | Dialogue, no speaker on camera | Required | Not applicable | Advised | Depends on the subject matter |

## Four locks, and what satisfies each

- **first-and-last-frame lock** — `beatra.videos.interpolate`. The last frame is required; the first frame and a driving audio track are optional. Billable: it is the video call itself for the unit it locks, disclosed and confirmed at approval gate 2 like any other shoot call.
- **subject lock** and **product lock** — the mechanism follows the route, because the two routes carry the narration differently.

  **Under a single continuous take, the lock lives in the reference frame.** The frame is built from the user's own asset through the real-assets-first tiers below, and `beatra.videos.animate` or `beatra.videos.interpolate` animates that frame — so the identity is held by what the frame carries, while the call still takes the narration as `driving_audio`. Do not reach for `beatra.videos.generate_from_references` here: its request takes a prompt and an ordered `references` list and has no driving-audio field at all, and an unrecognised field is dropped rather than refused, so a take built that way pays for the most expensive call in the run and comes back with no narration on it. There is nothing later that recovers it.

  **Under a segmented rebuild, no unit's call carries the narration**, so `beatra.videos.generate_from_references` fits, and it is the mechanism for a unit that needs several ordered image references — drawn from the same real-assets-first tiers below — to hold the identity steady across the unit. It is billable, and it is a video call, not a preparation step: for the unit it locks, it replaces `beatra.videos.animate` or `beatra.videos.interpolate` as the call this route makes. Read the live `reference_to_video` card with `beatra.models.list` before the shot list is signed off, disclose its current price at approval gate 2 alongside the other shoot options, give it its own stable `client_request_id`, and never submit it before the user has confirmed the estimate — the same footing as every other shoot call.
- **voice lock** — **the default, at no cost, is picking one `status: ready` voice with `beatra.voices.list` and reusing that same voice id for the whole clip.** `beatra.voices.clone` is a separate, optional, billable upgrade for when the user wants a voice built from their own sample instead of a preset — it is never the only way to satisfy this lock, and it is never chosen silently on the user's behalf. Offer the free pick first. If the user asks to clone one instead, read the live `voice_clone` card with `beatra.models.list`, quote its current price, and get the user's explicit confirmation together with `consent_attested: true` — set only once the user attests they hold the rights to clone that sample. Give the clone its own stable `client_request_id`, submit it once, and disclose it at approval gate 1 alongside the frame and narration calls, since the clip's voice has to exist before narration can be synthesized.
- **length adaptation** — `beatra.videos.extend`, used only when a single continuous shot runs longer than the selected model's supported duration.

## Reference frames: real assets before anything generated

Take reference images in this order, and do not skip a tier:

1. **What the user uploads for this run** — `beatra.assets.upload`, up to 100 MiB.
2. **Assets the user already has** — material already sitting in the user's own library.
3. **Generation** — `beatra.images.generate`, only once neither of the first two tiers has anything usable.

A subject lock's or a product lock's reference images are drawn from these same three tiers — both the single frame a continuous take animates and the ordered references a segmented rebuild's unit feeds into `beatra.videos.generate_from_references` — and the physical-product rule below applies to them exactly as it applies to any other reference frame.

**When the subject matter involves a physical product, its product-lock reference image comes from tier one or tier two only — it is never generated.** A generated product shot is not that product: its packaging, colour, logo, and proportions will all be subtly wrong, and the user usually only discovers this once the cut is finished. Treat this as a hard rule, not a preference.

## Rewrite losslessly

Change the words. Do not change the skeleton:

- Keep table 2's line count and its per-line timing budget; a swing of up to 15% either way is fine.
- Keep table 3's shot count and the functional sequence of its shots.
- Never let the rewritten words contradict what is on screen — a line that says "open the box" over a static product shot is a contradiction, not a rewrite.

Once the rewrite is done, rehearse it against the chosen voice for real timing. If it overruns, **cut spoken words first, not shots** — table 3 has already fixed the shot count.
