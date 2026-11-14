# The six red lines

This route borrows the structure of someone else's video. Structure is the only thing
it borrows. The six rules below get checked before any generation call runs, not after
the fact.

## 1. Labelling AI-generated content is the user's obligation

Labelling AI-generated content is a legal obligation in the places this package
operates, and it falls on the user, not on this package. **This package does not stamp
a label onto the deliverable on the user's behalf.** Say so plainly, so the user does
not assume the deliverable already satisfies the obligation, and tell them clearly that
meeting it — before or at the moment they publish — is theirs to do.

If the selected video model exposes a `watermark` option, that is a different thing: a
model watermark the provider burns into the generated video, not a legal AI-content
label. Do not present accepting or enabling it as satisfying the user's labelling
obligation.

## 2. Deduplication is not reuploading

Washing someone's original commerce video and reposting it under a different account is
a violation, not a derivative work. This package does not do that.

What it reuses is **structure only** — where the hook sits, what each beat is for, the
shape of the timing. It never reuses the reference's footage, its music, or the person
who appears on camera in it.

When a user asks for the original's footage, its music, or its on-screen person to be
carried over rather than rebuilt, say plainly what this route does produce instead — an
original clip built on the same structure — and continue the run from there.

## 3. Treat every frame of the reference as unsafe to feed back in

Measured, not assumed, for Douyin: the play address this package can reach for a Douyin
post reports `has_watermark` as true, and there is no clean version to fetch instead —
see [reading the reference from a link](reference-lookup.md). Other platforms have not
been measured the same way, but a platform-served copy carrying a visible or embedded
mark is an ordinary risk, not a Douyin-specific one, so treat a downloaded reference
frame from any platform as unsafe to feed back in unless the source is proven clean.

So a frame of the reference must never enter any generation call's reference input,
on any platform. Looking at those frames for your own analysis — reading a shot, timing
a cut — is fine. Feeding them into a model is not: whatever mark sits in the input gets
learned into the output, not filtered out of it.

## 4. Likeness

The subject lock's reference image has to come from the user themselves, or from
material the user has already cleared to use.

**Never pull a frame out of the reference clip to use as a subject lock.** The person on
screen in the reference is not the user. That is someone else's face, and how well the
frame would work is beside the point.

## 5. Advertising law

The per-line evidence table's on-screen-keyword column collects the reference's prices,
discounts, figures, and promises. Go through that column again once the rewrite starts:
absolute superlatives, efficacy promises, and price promises found there must not carry
across onto the user's own video unchanged. The same screening in
[rewriting onto your subject](remake-plan.md) — superlatives, efficacy claims, prices —
applies here too, to whatever came from the reference and not only to what the user
wrote fresh.

The user's own specifications, prices, results, certifications, and promotions can only
come from the user. When one of those is missing, write the beat around it. **Never
invent a plausible-looking number to fill the gap** — the user is the one who answers
for whatever the video claims, not this package.

## 6. Platforms judge reuploads on their own terms

Even a remake that reuses structure alone, and nothing else, can still trip a platform's
duplicate-content detection — the platform does not see the same intent this package
does. Tell the user about that risk plainly, and advise making the picture, the voice,
and the pacing of the remake genuinely different from the reference, not just the
product name.
