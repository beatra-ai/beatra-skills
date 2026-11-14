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

A single synthesis `input` is limited to 50,000 characters. Split large
chapters at natural chapter, section, scene, paragraph, or sentence boundaries,
never mid-sentence. Use stable labels such as `01-opening`,
`02-chapter-one-a`, and `02-chapter-one-b` so the output can be restored to
listening order.

The voice reads the submitted text. Remove only citations, URLs, stage notes,
or headings the user does not want spoken. Use punctuation and sentence breaks
to express pauses. Decide readings for names, dates, numbers, currencies, units,
initials, acronyms, and foreign terms. Preserve the manuscript's meaning and
keep a pronunciation glossary beside the ledger.

## Cast with live voice facts

When a narrator has not been frozen, call `beatra.voices.list` with the useful
language or preference filters. Treat each returned `voice_id` as an opaque
handle. A `display_name`, prose preference, remembered label, or preview name is
never a substitute for `voice_id`. Use `preview_url` for free comparison and
freeze the chosen voice's actual `voice_id`, returned language information, and
`compatible_models`.

Call `beatra.models.list` with `capability: "text_to_speech"` before a model,
language, or price decision. An explicit model must be available in its live
card, present in the voice's `compatible_models`, and support the requested
language. Language is not an `auto` routing input; the service first resolves
from the voice and then validates language. For `auto`, collect all live
available voice-compatible candidates and compare the requested BCP-47 primary
language with every candidate's `constraints.supported_languages`, using
documented aliases only. If any candidate lacks that language, do not use
`auto`; ask the user to confirm a viable explicit model. Only when every
candidate supports the language may `auto` remain and the complete candidate
set define the price range.

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
