# Whiteboard film workflow (draw only after confirmation)

The user brings a concept, a finished narration script, or a benchmark video
link. Tear down, agree, finalize — then build the draft. Without an explicit
Gate A and Gate B pass, do not create a draft, do not submit paid synthesis,
and do not render.

"You decide" or "looks good" is not a pass. Without an approved narration and
storyboard, "just make it" is not a pass either. Once the narration and the
storyboard table (on-screen words and objects per scene) are approved, "draw
this table" or "make me a version to watch" is a Gate B pass: start drawing.
A new angle or duration reopens Gate A; a narration change reopens Gate B and
re-synthesis; changing only the picture with an unchanged narration never
re-synthesizes.

When the user asks how many credits remain or whether a live estimate fits
the current balance, call `beatra.wallet.get`. When they ask what was
charged, call `beatra.wallet.ledger`. Do not invent an account-balance tool,
a top-up tool, or an account mutation. Use the `topup_url` returned by
`beatra.wallet.get` or the URL inside an `insufficient_balance` error. Live
synthesis prices come from `beatra.models.list` with
`{"capability": "text_to_speech"}`; clone prices from
`{"capability": "voice_clone"}`; lookup prices from
`beatra.social.tools.get`. Never from ledger rows.

## Inputs

At least one of: a concept, a narration script, or a benchmark video. Ask for
what is missing; do not invent an audience, a reader persona, or a platform.

When the user drops a share link or says "teardown this one", fetch it first
through [the benchmark lookup](benchmark-lookup.md), then tear it down. Never
ask the user to download the video themselves.

Optional: audience, publishing platform, duration, voiceover on/off, and
things that must not be said. Without a platform, default to a vertical
social-media knowledge explainer — not an ad and not a lecture. Narration
craft follows [script copywriting](script-copywriting.md). Voiceover always
runs through Beatra; see [voiceover and sync](voiceover-and-sync.md).

## Duration

Default **1–3 minutes**. Estimate narration at an explain-it-clearly pace of
roughly **200 characters per minute** (Mandarin, pauses included). The real
duration comes from the synthesis result; this table exists to size the
script.

| Target | Narration chars | Scenes | Per scene |
|---|---|---|---|
| ~60s | 180–220 | 4–6 | 12–20s |
| ~90s | 270–330 | 5–8 | 12–20s |
| ~120s | 360–440 | 6–10 | 12–22s |
| ~180s | 540–660 | 8–12 | 12–22s |

One scene carries one idea. If it does not fit, cut it or split the film into
a series; never compress a ten-minute lecture into three minutes.

## Tear down the concept (write it for yourself, then put it on the Gate A card)

Keep only the skeleton that can carry the whole film:

1. **One takeaway.** What the viewer should remember. Not a textbook
   definition.
2. **Common confusion.** What viewers mix this up with.
3. **Steps.** The skeleton, for your own use, at most 3–5. Never read the
   skeleton to the viewer.
4. **Main example.** One concrete thing that can serve as both hook and main
   evidence, can be drawn, and is something this audience actually encounters.
   One or two side cases as corroboration. If the audience is not a
   programmer, do not use refactoring or test runs.
5. **Boundary.** What it is not, or when it does not hold.
6. **Cut list.** What this film deliberately skips.

Pick exactly one angle: misconception / mechanism / contrast /
example-first-then-name. The hook style is fixed at Gate A. Do not write a
product ad arc (pain → solution → buy).

Mode: exact flows, relationships, or labels that must be read precisely →
program; words written stroke by stroke — Chinese or English → text. text
is the default for social whiteboard explainers. Announce the choice.

## Gate A · direction

Write one short card and stop for a decision. The card carries:

- the concept as understood
- the audience (mark whether assumed or user-supplied)
- the one takeaway
- the angle
- hook style (contrast / pain / counter-intuitive / benefit / question /
  identity) and the opening conflict in one sentence
- target duration (60 / 90 / 120 / 180)
- text or program, and why
- voiceover or not
- what is cut
- honesty grade: researched public information / a stated view / something
  you actually ran. Never pass a view off as tested work.

Ask for: pass / change angle / change duration / change mode / drop voiceover
/ not this time.

Only after a pass, write the narration and the storyboard.

## Write the script

Narration rules live in [script copywriting](script-copywriting.md). Write
narration and storyboard together; do not finish one and bolt on the other.

One row per scene (in practice the on-screen word is the Chinese noun from
that narration line; one real example is fenced below):

| Scene | ~sec | Narration | On-screen word | Object | Motion |
|---|---|---|---|---|---|
| s1 | 0–12 | … | chat box | speech bubble | draw |

```text
| s1 | 0–12 | 你跟聊天模型说话，它答完就停。 | 聊天框 | 空气泡 | 描 |
```

- **On-screen word**: 2–6 characters, the noun inside that narration line,
  strong enough to be the cover frame. A scene without one cannot pass
  Gate B.
- **Object**: draw that noun. People stay off screen by default.
- Drawing rules live in [visual rules](visual-rules.md).

`script.txt` holds only the spoken words; `# sN` maps to the HTML `#sN`.
Scene notes live in `DESIGN.md`.

Structure follows [script copywriting](script-copywriting.md): hook (0–3s) →
state the conflict → evidence → landing → closing action. Pull the strongest
conflict into the first sentence; delete self-introduction. No lecture arc
(define → example → summarize), no ad arc.

Read the draft aloud once against the plain-language checklist before showing
it. One narration line becomes one caption line.

Without voiceover, the on-screen words are the reading track. With voiceover,
narration plus captions are the reading track and the picture still shows the
short words.

## Gate B · script and storyboard

Show the complete narration plus the storyboard table, then stop. State the
character count and the duration estimate. If scenes are missing on-screen
words or objects, fill the table first. Ask for: pass / change some scenes /
cut scenes / rewrite narration / back to Gate A.

Only after a pass:

1. `new_draft.mjs`
2. Write the approved `script.txt` and `DESIGN.md` into the draft
3. Draw `index.html` (on-screen words + objects, per
   [visual rules](visual-rules.md))
4. Voiceover and render ([voiceover and sync](voiceover-and-sync.md),
   [pipeline commands](pipeline-commands.md)). If the narration is unchanged,
   skip synthesis and render directly.
5. Check `renders/preview/sN.jpg`. If a word or object does not match the
   narration, fix the HTML and re-render; do not rewrite the narration first.

## Series

A concept that needs more than five steps, or whose examples crowd out the
definition, gets a split proposal at Gate A: this film covers one part.
