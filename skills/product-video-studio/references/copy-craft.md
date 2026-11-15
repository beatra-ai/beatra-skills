# Writing the narration

The narration is what separates this from an animated product photo. It is also the part that can put a merchant in legal trouble, so it is written under real constraints.

## Where each claim comes from

Two kinds of statements go into commerce copy, and they have different sources.

**Visible facts** are yours to write. Shape, colour, finish, apparent material, proportions, how it would sit in a hand or on a counter, what kind of person it suits, where it would be used. You can see these in the photo, so you can say them.

**Non-visible claims** belong to the merchant. Material grade, capacity, measurements, certifications, test results, durability numbers, price, discounts, shipping terms, warranty, return policy. None of these are visible in a photograph. Ask for the ones the script needs.

When the merchant does not supply them, write around them. "A matte-looking finish" can describe what the photo shows without asserting performance. What you must never do is produce a plausible number or performance result. A merchant who runs an ad containing a specification you invented is the one who answers for it.

If the merchant asks you to state a claim they have not verified, say plainly that you will include it once they confirm it, and offer the claim-free version meanwhile.

## Length is a budget — verify it free with `beatra.speech.validate` before paying

The finished video runs at most 15 seconds, and the video cannot be shorter than the narration without cutting the last words off. Always write to about **12 seconds** first (roughly 55 to 60 Simplified Chinese characters, or a little over one English sentence), leaving a three-second reserve so the cut lands cleanly.

When pacing, pauses, dramatic emphasis, or pronunciation notes would help the read, call **`beatra.speech.prepare_script`** (Smart Voice Director, after `{"capability": "speech_script"}`, listed as its own paid line when run; never alters the merchant's approved wording; re-calling `prepare_script` within 48 hours with the same script and instructions when changing only `voice`/`model` charges zero credits; max 2 concurrent). Never hand-author braced markup or strip `/` slashes manually.

Before committing to paid synthesis, run free **`beatra.speech.validate`** with the chosen voice, prepared `input`, `model`, `language`, and `format`. Read `valid`, `warnings`, `weighted_characters`, live `price_credits`, and **`estimated_duration_seconds`** at zero charge: if `estimated_duration_seconds` threatens the 15-second video ceiling, tighten the line before paying to synthesize. Keep `subtitle_enable: true` (default) on `beatra.speech.synthesize` to receive free aligned `output.subtitles` (`JSON`/`SRT`/`VTT`) and check the returned `audio.duration_seconds` before the video stage. If the actual rendered audio still overruns, shorten the script, re-validate free, and re-synthesize only speech — the first frame is unaffected and reused.

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

## Choosing and auditioning the voice

Call `beatra.voices.list` using bilingual `search` plus `use_case` and capability filters (`supports_direction`, `supports_emotion`, `supports_performance_tags`, `supports_context`). Commerce narration wants a crisp short-video voice, not an audiobook or news reader; check all 11 `capabilities.*` metadata fields returned on the candidate voice before combining expressive markup or delivery cues.

Match the language to the destination market, confirm the selected speech model supports that language, and run free **`beatra.voices.preview`** (`{"voice_id": "..."}`) so the merchant can audition the voice at zero charge before committing synthesis credits. When the merchant has not expressed a preference, pick a sensible default, audition/validate it cleanly, and name it in the preparation confirmation rather than stalling for another round.
