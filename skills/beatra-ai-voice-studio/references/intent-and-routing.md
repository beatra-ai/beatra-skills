# Intent and routing

## Keep the Studio central only when it adds coordination

Choose one primary route, reuse known facts, and ask only for a missing hard
input or a choice that changes paid work.

| Request shape | Route | Minimum before a paid call |
| --- | --- | --- |
| One short-video, advertisement, social, or promo voiceover | `short-form-voiceover-audio` | Final supplied or approved text and an exact current voice |
| Audiobook, course, serialized narration, or other ordered long-form work | `ai-audiobook-narration` | Approved segment plan, pilot text, and narrator |
| Supplied target-language scripts for a multilingual production | `ai-multilingual-dubbing` | Approved text per language and one valid voice route per language |
| One authorized reusable voice | `voice-cloning-studio` | Explicit speaker authorization, valid sample, and display name |
| Mixed, ongoing, or cross-route production | This Studio | An ordered route ledger and the first exact paid card |

Do not move a mixed request wholesale into a focused package. Sequence its
parts. For example, create and finish an authorized clone before resolving its
returned `voice_id` for later synthesis; pilot each distinct multilingual
route before approving its remainder.

## Minimum questions and positive defaults

For synthesis, ask for final text or permission to prepare a speakable version,
and ask for a target language only when the user intends a language not already
clear from the supplied text or context. Do not ask for language merely because
the request omitted it. Ask for voice preferences only when no voice has been
selected and “choose for me” is not already an answer.

Use `model: "auto"`, MP3, speed 1.0, volume 1.0, pitch 0, no emotion, and no
sample rate unless the user's destination changes one of those choices. Treat
duration as a review target, not a guarantee. Preserve supplied claims,
pronunciations, names, ordering, and target-language text.

For cloning, the one non-negotiable first fact is consent. A clear statement
that it is the user's own voice is enough; otherwise obtain a clear statement
that the speaker authorized cloning. Do not turn that confirmation into
paperwork. Stop before upload while it is missing.

## Free planning and paid units

Free planning includes:

- routing and ledger preparation;
- speakable edits shown for approval;
- `beatra.voices.list`, returned preview links, and casting comparison;
- `beatra.models.list`, compatibility and language checks, and price estimates;
- search and reconciliation of already-created tasks.

Each `beatra.speech.synthesize` and `beatra.voices.clone` submission is a
separate billable request. A card must state the exact approved text or sample,
voice and model decision, controls, count, current estimate, delivery position,
and what the user will review.

## Pilot coverage

- For one supplied and approved short script, the one synthesis is the complete
  approved unit; do not add alternate takes.
- For long-form work, select one representative supplied passage and obtain
  approval for that pilot alone. Review it, then present the remaining ordered
  segments and total estimate as a separate approval.
- For multilingual work, define a distinct route by its voice, BCP-47 language,
  and possible or explicit model set. Run one supplied and approved pilot for
  every distinct route. Only after all required pilots are accepted may the
  remaining language-by-segment matrix receive a separate approval.
- A clone does not include a spoken proof. If the user wants one, it begins
  after clone success as a separate text-to-speech card.

Never use invented text for a paid sample. General permission, earlier pilot
approval, or clone approval does not approve a remainder, another language,
an alternate take, or a spoken proof.

## Adjacent outcomes

Keep this package's result at ready-to-edit speech audio or a returned reusable
voice. A request for transcription needs text first. Existing-audio repair,
mixing, synchronization, video, avatar, lip-sync, music, and publication use
their own workflows. Preserve and complete the voice component rather than
claiming those adjacent deliverables.
