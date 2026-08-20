# Lyrics craft

Write lyrics to be sung, not merely read.

## Start with the song's engine

Before drafting, define:

- one-sentence premise;
- narrator and addressee;
- emotional movement from verse to final chorus;
- central image or metaphor;
- hook: a short phrase worth repeating;
- language, region, script, register, rhyme density, and intended vocal range.

Each section needs a job. Verses reveal specific images or events. A
pre-chorus raises tension or reframes the question. The chorus delivers the
emotional thesis and most memorable phrase. A bridge changes perspective,
time, harmony, or intensity rather than paraphrasing the chorus.

## Universal language checks

Apply these checks in any language:

1. Confirm the intended language, regional variety, writing system, and
   conversational or literary register.
2. Keep natural word order and speech stress; do not force a translated syntax
   into the target language.
3. Match syllable or mora density to the tempo and leave credible breaths.
4. Favor vowels and line endings that can open on sustained notes.
5. Choose a rhyme approach that serves meaning: exact rhyme, near rhyme,
   assonance, consonance, or deliberate repetition.
6. Use culturally coherent images rather than replacing words one for one.
7. Read every line aloud. Rewrite tongue-twisters, unnatural stress, and
   over-dense phrases.
8. For mixed-language songs, give each switch a structural or emotional reason.

Language, accent, and pronunciation remain soft generation guidance. Treat a
finished vocal as something to audition, not proof that a written instruction
was followed exactly.

## Singability

- Prefer concrete images and active verbs over generic declarations.
- Keep neighboring lines reasonably similar in rhythmic weight.
- Place important vowels and emotionally charged words where a note can open.
- Avoid tongue-twisting consonant clusters at fast tempos.
- Use repetition with development: the final chorus should gain meaning,
  harmony, role exchange, or a changed last line.
- Do not force rhyme at the cost of clarity.

## Section and performance tags

Use conventional tags in caller-supplied lyrics:

```text
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Post-Chorus]
[Bridge]
[Instrumental Break]
[Final Chorus]
[Outro]
```

Only include sections the song needs. Tags guide structure but do not guarantee
an exact duration, melody, arrangement, or performance.

Add performance cues sparingly:

```text
[Verse 1 - Voice A, intimate]
[Verse 2 - Voice B, clear and warm]
[Pre-Chorus - Alternating lines]
[Chorus - Duet, harmony]
```

Keep lyrics readable; do not put production essays in every tag.

## English

- Let ordinary spoken stress lead the melodic stress.
- Use contractions and weak forms when the character would naturally speak
  that way.
- Watch clusters at line endings, especially before fast pickups.
- Keep a chorus hook concise and vowel-friendly.
- Prefer near rhyme to a grammatically awkward exact rhyme.

## Mandarin Chinese

- Choose colloquial Mandarin unless the brief calls for literary language.
- Avoid filling lines with abstract four-character phrases.
- Watch tonal and syntactic naturalness, but do not claim deterministic
  tone-to-melody control.
- Use punctuation and line breaks to shape breaths.
- Give a modern pop chorus one concise Chinese hook rather than several
  competing slogans.

## Cantonese

Confirm whether the user wants colloquial written Cantonese or more formal
written Chinese sung with Cantonese pronunciation. For conversational
Cantonese, use natural syntax, particles, and vocabulary rather than
mechanically translating Mandarin.

Default Hong Kong colloquial lyrics to Traditional Chinese unless the user
requests another script. Keep section tags in English for model guidance. Read
lines aloud and check:

- final particles sound intentional, not decorative;
- word order is natural;
- rhymes work in Cantonese pronunciation;
- rhyme finals and line endings do not force unnatural wording;
- important words are not buried in dense lines;
- mixed English is purposeful and pronounceable.

Do not add Jyutping unless the user requests a romanized guide; romanization
can itself be sung.

## Japanese

- Count rhythmic weight in morae rather than treating every written character
  as one beat.
- Keep phrase boundaries natural; do not split particles from the words they
  support merely to force a rhyme.
- Balance kanji, kana, and loanwords for the requested character and audience.
- Use open vowel endings and repeated sounds intentionally in hooks.
- Check whether English loanwords sound natural in Japanese performance or
  need a simpler alternative.

## Spanish and other Latin-language songs

- Respect natural lexical stress and avoid shifting it only to satisfy an
  English-derived melody idea.
- Use open vowels and flowing line endings as musical strengths.
- Confirm regional vocabulary when it changes the speaker's identity.
- Do not translate English idioms literally; rebuild the image in the target
  language.
- Keep fast consonant runs and elisions singable at the intended tempo.

For another Romance language, reuse the universal checks and verify its own
stress, elision, rhyme, and regional conventions rather than assuming Spanish
rules transfer unchanged.

## Bilingual and mixed-language songs

Choose the job of each language before writing:

- verses can hold narrative detail in one language;
- a pre-chorus can mark a perspective or location shift;
- the chorus can use a shared phrase that remains recognizable;
- a bridge can reveal what the narrator could not say in the first language;
- short code-switches can mark intimacy, distance, humor, or identity.

Avoid alternating languages merely for novelty. Keep terminology and spelling
consistent, and check that both sides of a switch are natural to sing. If the
Agent lacks confidence in a region-specific phrase, show it before generation
and ask the user to correct it.

## Duets and ensembles

Give voices distinct viewpoints. Label roles consistently as `Male`, `Female`,
`Voice A`, `Voice B`, or named characters; do not switch systems mid-song.
Useful forms include:

- question and answer;
- two timelines converging in the chorus;
- disagreement that resolves or remains deliberately open;
- unison hook with alternating verses;
- overlapping final lines followed by harmony.

The single `vocal_gender` field cannot encode two singers. For a duet, omit it
and use role-tagged lyrics plus a concise duet instruction in the prompt.
Casting remains soft guidance.

## Editing user lyrics

Preserve must-keep lines, names, facts, and intent. Separate proofreading from
creative rewriting. When changes are substantial, show the revised lyric and
briefly identify what improved before generating audio.
