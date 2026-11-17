# Chapter production

## Start from production-ready source text

Use final readable text. At minimum, obtain enough exact text for one
representative pilot, the intended chapter or
section order, a valid BCP-47 language or dialect, must-follow pronunciations,
and any purpose, format, or delivery preference that changes the result. Do not
invent missing manuscript text or silently translate it.

Maintain one ordered ledger with:

- chapter and segment labels in listening order;
- the exact approved text and weighted-character count;
- pronunciation and delivery notes;
- the frozen opaque `voice_id`, model choice, language, format, and controls;
- confirmation scope and time; and
- `client_request_id`, `task_id`, terminal state, artifact, and billing facts
  when those values exist.

## Prepare text for speech

If `beatra.speech.validate` or synthesis refuses a chapter as too long, follow
the refusal message: split at natural chapter, section, scene, paragraph, or
sentence boundaries, never mid-sentence, and submit the parts in order. If a
native multi-cast `beatra.speech.synthesize_dialogue` scene is refused as too
long, split it at scene or turn boundaries as the refusal message says, passing
`previous_text` / `next_text` across boundaries. Use stable labels such as
`01-opening`, `02-chapter-one-a`, and `02-chapter-one-b` so audio restores to
listening order.

Keep spoken text clean: remove only citations, URLs, stage notes, or headings
the user does not want spoken, and never manually write braced performance
tags. When pausing, expressive pacing, or polyphonic pronunciation needs
directing, quote and use **Smart Voice Director**
(`beatra.speech.prepare_script`, word-preserving) and verify with free
`beatra.speech.validate` / `beatra.speech.validate_dialogue`. Decide readings
for names, dates, numbers, currencies, units, initials, acronyms, and foreign
terms, preserving the manuscript's meaning in the glossary.

## Cast with live voice facts and previews

When a narrator or scene cast has not been frozen, call `beatra.voices.list`
with bilingual `search`, facet filters, or `supports_dialogue=true` (when
planning `synthesize_dialogue`), and inspect all `11` `capabilities.*` metadata
fields. Call free `beatra.voices.preview` (`preview_url`, `kind`) so the user
can audition candidates at zero cost, and use free `beatra.voices.update` when
renaming or pinning a recurring narrator (`make_default=true`). Treat every
returned `voice_id` as an opaque handle — never substitute a `display_name` or
remembered label.

Call `beatra.models.list` with `capability: "text_to_speech"` (or
`"text_to_dialogue"`) before any model, language, or price decision. Require an
explicit single-speaker model to be live, present in `compatible_models`, and
support the requested BCP-47 language. For `auto`, collect all live available
voice-compatible candidates and check `constraints.supported_languages` across
every candidate before retaining `auto`.

## Separate the pilot from the book

Choose one representative passage: dialogue, names, and exposition for fiction;
dense explanation, numbers, or terminology for nonfiction and courses. The
pilot production card freezes the segment, voice, language, format, delivery
controls, and estimated cost. Its approval authorizes only those listed pilot
requests.

After the user hears the pilot, record accepted pronunciation, pace, and voice
direction. If the remaining book should continue, calculate its incremental
weighted-character total and price range or upper bound, then obtain a separate
batch approval. A previously accepted production card does not need a redundant
confirmation while it remains exact and current.
