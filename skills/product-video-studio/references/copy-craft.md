# Writing the narration

The narration is what separates this from an animated product photo. It is also the part that can put a merchant in legal trouble, so it is written under real constraints.

## Where each claim comes from

Two kinds of statements go into commerce copy, and they have different sources.

**Visible facts** are yours to write. Shape, colour, finish, apparent material, proportions, how it would sit in a hand or on a counter, what kind of person it suits, where it would be used. You can see these in the photo, so you can say them.

**Non-visible claims** belong to the merchant. Material grade, capacity, measurements, certifications, test results, durability numbers, price, discounts, shipping terms, warranty, return policy. None of these are visible in a photograph. Ask for the ones the script needs.

When the merchant does not supply them, write around them. "A matte-looking finish" can describe what the photo shows without asserting performance. What you must never do is produce a plausible number or performance result. A merchant who runs an ad containing a specification you invented is the one who answers for it.

If the merchant asks you to state a claim they have not verified, say plainly that you will include it once they confirm it, and offer the claim-free version meanwhile.

## Length is a budget, and it is spent before you know the price

The finished video runs at most 15 seconds, and the video cannot be shorter than the narration without cutting the last words off. But the narration's real duration is only known after it is synthesized and paid for.

So write to about **12 seconds**, not to the ceiling. In Simplified Chinese that is roughly 55 to 60 characters; in English, a little over a sentence. The three-second reserve absorbs the difference between how you imagine the line and how the voice actually says it.

Tell the merchant this number is an estimate and that the real duration comes back with the audio. If the synthesized narration overruns, shorten the script and synthesize again — the first frame is unaffected and is reused.

## Shape of a 12-second commerce script

There is room for three beats and no more:

1. **A reason to keep watching** — the visible thing that makes this product worth a second. Not a greeting, not the brand name.
2. **The claim that matters most** — one merchant-supplied fact, or one strong visible one.
3. **What to do next** — short, concrete, and only as strong as the merchant's actual offer supports.

Cut anything that is not one of those three. A 12-second script has no room for a preamble.

## Screen the copy before synthesizing

Read the finished script against each of these. A hit means rewrite, not a disclaimer.

**Absolute superlatives.** Chinese advertising law prohibits absolute claims, and their equivalents in any language. The penalty falls on the merchant. Screen for at least:

```text
最   第一   顶级   国家级   销量冠军   绝对
```

Replace them with something specific: not "the best insulation" but "still warm at lunchtime", once the merchant confirms it.

**Efficacy claims on regulated categories.** Food, health supplements, cosmetics, and medical devices get no therapeutic, curative, or functional health claims. Describe what the product is and how it is used, not what it will do to a body.

**Third-party platform names.** Chinese commerce and short-video platform names are other companies' trademarks:

```text
抖音   快手   小红书   淘宝   拼多多
```

Write "made for vertical short-video feeds" rather than naming them.

**Anything you cannot point at.** If you cannot name where a statement came from — the photo, or the merchant — it does not go in.

## Choosing the voice

Call `beatra.voices.list` and match on `use_case`. Commerce narration wants a voice built for short social content, not an audiobook or a news reader; the catalogue labels these.

Match the language to the destination market, and confirm the selected speech model supports that language before synthesizing.

When the merchant has not expressed a preference, choose a sensible default and name it in the confirmation rather than asking. One fewer question is worth more than a marginally better match.
