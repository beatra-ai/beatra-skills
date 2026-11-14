# Dubbing matrix design

## Start with a release map

Treat multilingual narration as a matrix, not one source file with a language
dropdown. Make one row per natural segment and one column per target locale.
For every cell, keep the following production facts together:

| Field | Why it matters |
| --- | --- |
| Segment label and order | Keeps chapters, scenes, lessons, or campaign variants easy to deliver and correct. |
| Locale and BCP-47 tag | Prevents an ambiguous text from being read in the wrong language or dialect. |
| Approved speech script | This is the sole text that will be rendered. |
| Message invariants | Product names, mandatory claims, pricing, dates, legal lines, or CTA intent that cannot drift. |
| Pronunciation notes | Readings for names, acronyms, currency, dates, units, and loan words. |
| Voice and delivery | The accepted voice, pace, emotion when appropriate, and target format. |
| Status | Draft, ready for review, pilot, approved, queued, delivered, accepted, or revision proposed. |

Use the user's actual publishing purpose to make choices. A product launch may
need confident, concise phrasing; a learning module needs steady clarity; a
creator series needs familiar energy; a regional ad may need a local call to
action. Preserve the meaning that matters, but do not assume source sentence
order, metaphor, or humor belongs unchanged in every market.

## Locale scripts are production input

The verified speech graph accepts text, not source video or audio, and has no
translation or linguistic-review tool. If the source exists only as media, use
an actually available host capability to obtain a transcript or ask the user
for one; never upload the media as though speech synthesis could transcribe it.
Keep any transcript unapproved until the user confirms the text to be spoken.
Never claim that a Beatra call translated, culturally adapted, or certified
text. When localization is still open, distinguish three states in the matrix:

- **source brief:** message and constraints are known, but no target text is
  ready;
- **draft locale copy:** it needs the user's linguistic/content approval;
- **approved speech script:** it may enter a paid speech request.

For high-risk or brand-critical material, ask the user to supply or obtain a
qualified local review. A user can decide to approve a draft; the Skill must
state that decision plainly rather than imply an unavailable service reviewed
it.

## Cast for local audience, not convenience

Call `beatra.voices.list` only when no usable voice is already chosen. Filter
by the locale language first, then by user preference. Each returned card may
show language support, accent, age, use case, compatible models, and a preview.
Recommend a short list with a reason tied to audience and destination.

One voice across several locales is a conscious continuity choice, never the
default. Use it only when the returned voice supports those locales and the
brand genuinely benefits from a consistent persona. A native voice per locale
will often make a broader release feel more local. Do not infer language
support from a voice name, accent, or preview; use the returned card and, when
necessary, the live text-to-speech model card.

## Delivery defaults

- Use `mp3` for direct distribution, `wav` or `flac` for a downstream editing
  workflow, and `opus` for web embedding; do not choose `pcm` unless the user
  has a raw-audio pipeline.
- Start at speed `1.0`. Long-form narration usually benefits from 0.95–1.05;
  a short social or campaign read may support 1.05–1.15. Move further only on
  request or after a failed pilot.
- Set an `emotion` only when the brief calls for it. A neutral explainer needs
  no emotional label. Do not use pitch/volume to force a voice into a role
  better served by recasting.
- The request `input` limit is 50,000 characters. Segment large releases at
  chapters/scenes/lessons, preserve the user-visible order, and avoid breaks
  inside a sentence or pronunciation unit.

## Pilot and scale

A batch's sensible pilot is one representative, highest-risk segment for each
locale: a product-name line, dense instructional paragraph, or local CTA—not
the easiest greeting. Review the pilot before expanding. If a locale has an
unresolved voice or style question, do not allow a successful different locale
to imply approval for it.

When the user requests an estimate, call `beatra.models.list` with
`capability: "text_to_speech"` and use only its current pricing/billing basis.
Explain the count as approved matrix cells and script length; do not invent a
flat multilingual-package price. Explicitly confirm the whole listed scope
before paid requests begin. One clear approval may authorize every precisely
listed matrix cell once; do not interrupt again for each cell unless its text,
voice, language, model, speed, format, pitch, volume, sample rate, or emotion
changes.
