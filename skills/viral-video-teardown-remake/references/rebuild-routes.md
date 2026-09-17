# Three rebuild routes

The teardown is done and the rewrite is done. One decision is still open: how the film actually gets built.

The answer is not fixed, but it is total: every clip lands in exactly one of the two routes below, and no clip matches neither or both.

Three structural facts rule out R1 outright, each on its own: table 3 having more than two rows, an obvious hard cut anywhere in table 3, or the selected model's ceiling being smaller than `T`. **Any one of those means R2** — there is nothing left to ask.

Only when none of the three holds — at most two rows, no hard cut, and the ceiling covers the whole clip — are both routes actually available, and there the decisive factor is **whether the user edits video themselves**, asked directly before the route is chosen. A user who edits gets R2's editable segments even though the clip would have fit in one take; a user who does not gets R1's one-click clip.

## Generation-unit length is a variable, not a constant

Every video generation path on this platform takes an integer duration of 2 through 30 seconds, or `auto`. Which of those values a given model actually supports is not fixed — read it live from `beatra.models.list`.

So how long one generation unit can be is a consequence of the model the user picked, not a constant this reference can state. The same teardown packs into different unit boundaries under different models. **Read the model card before the shot list is signed off**, because it decides everything that follows: which route applies, how many units the clip splits into, and where the boundaries fall.

## R1 — one continuous take

**When it applies:** table 3 has at most two rows, no hard cut, and the selected model's ceiling is at least `T` — **and** the user says they do not edit video themselves. Typical of a slow talking-head piece or anything shot as a single continuous take.

**How to build it:** build the opening frame from the real-assets-first tiers — plus the closing frame, when both the first and the last frame are locked — and run one call: `beatra.videos.animate` (first frame only) or `beatra.videos.interpolate` (both first and last frames locked) — then `beatra.speech.synthesize` for the narration.

Those two are the whole list on this route, and the reason is that R1 is audio-led: only their requests carry a `driving_audio` track. A subject or product lock here is satisfied **in the reference frame** — the frame comes from the user's own asset and carries the identity, and the call animates that frame — never by swapping in `beatra.videos.generate_from_references`, whose request has no driving-audio field and would leave the finished clip with no narration on it, per [rewriting onto your subject](remake-plan.md).

## R2 — segmented generation plus an edit list

**When it applies:** table 3 has more than two rows, or it contains an obvious hard cut, or `T` exceeds the selected model's ceiling — any one of those, on its own, is enough. It also applies when none of those hold but the user says they do edit video themselves.

**How to build it:**

1. Repack table 3 into a unit sequence, landing unit boundaries on table 3's shot boundaries by preference; only when a single shot by itself exceeds the ceiling do you cut inside it, and there you use `beatra.videos.extend` to continue within that shot. **`T` divided by the ceiling, rounded up, is only a lower bound on the unit count** — packing whole shots without splitting them will often need more units than that division suggests, because a boundary usually lands before a shot's actual end rather than exactly on the ceiling. Count the units your actual packing produces, and state that count — not the division's result — at the free gate.
2. Each unit takes its reference frame from the real-assets-first tiers and wears the locks its mode requires. No unit's call carries the narration, so a unit that needs several ordered references to hold a subject or product identity steady runs `beatra.videos.generate_from_references` in place of `beatra.videos.animate` or `beatra.videos.interpolate`, fed those references in order — the mechanism R1 cannot use, and the one this route can.
3. Generate each unit.
4. **Synthesize the narration once for the whole clip**, so the voice stays continuous and consistent. **Do not split the audio locally.** Deliver one track, and let the edit list carry each unit's audio timecode so the user can align it in their own editor.
5. Deliver the segment sources, the single narration track, captions, and a timecoded edit list.

### Continuity across units, without flattening the cuts

Inside one scene, use the previous unit's last frame as the next unit's first frame. That is one inherited frame, not two, so the call is `beatra.videos.animate`, not `beatra.videos.interpolate` — which needs a genuine required last frame that nothing here supplies — and the picture still carries across the boundary.

At a scene change, **keep the hard cut** and start from a fresh reference frame. Fast cutting is exactly what this genre lives on — smoothing it away in the name of continuity destroys the thing being copied.

## R3 — segmented generation plus platform compose

R2's first four steps, plus the platform stitching the units into one finished cut.

**This route cannot run today** — the platform has no compose capability. When a user asks for a single publishable file, say plainly what is available instead: R2's segments and edit list. Do not blur this into a promise the platform cannot keep.

## R2 is not a lesser R3

Do not assume a finished cut beats segments. A user who edits wants an editable project — a welded single file is a liability to them, because changing one shot means rebuilding the whole thing. Segments plus an edit list is what they actually want.

The one-click finished cut is for users who do not edit.

So, whenever the clip's structure leaves both routes open, the route follows **what the user says about their own editing** — asked directly before the route is chosen, never inferred for them, and then stated plainly together with the shot list at the free gate that follows. When the clip's structure rules out one route outright, there is nothing to ask: the surviving route is stated at that same gate, without a question attached to it.

## That gate is free

Mode, route, the unit sequence, and each unit's locks and reference-frame source are shown together with the shot list, revisable without limit, at no cost.

**The route and the unit count must be settled and stated at this gate.** R1 and R2 differ in final cost by a factor of the unit count, and the route follows from the clip's structure, the selected model's ceiling, and — whenever both remain open — the user's own answer about editing. Spell out the whole chain — this model, therefore this route, therefore this many units (the actual packed count, not the raw division), therefore roughly this much — rather than letting it surface only at the last paid confirmation.

## Do not make `videos.extend` chaining a main route

Chaining `beatra.videos.extend` needs no new capability and grows one continuous piece, but it cannot produce a hard cut, and its error compounds unit over unit. Keep it to the one job named above: continuing inside a single shot that overruns the ceiling — nothing broader.
