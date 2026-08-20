# Intent and routing

Identify the musical job before writing a payload.

## Request classes

- **Song from an idea**: develop concept, style, lyrics, structure, and vocal
  direction, then generate.
- **Lyrics to song**: preserve the user's meaning and strongest lines; improve
  singability while retaining their intent; then arrange and generate.
- **Lyrics only**: write, translate, localize, or revise text. Do not call
  music generation.
- **Instrumental or BGM**: define use, duration feel, energy curve, loop or
  ending behavior, instrumentation, and elements to avoid. Set
  `instrumental: true` and omit lyrics.
- **Reference-led creation**: identify what should carry over and what should
  change, upload the recording through the bundled command, then build a
  new-arrangement brief and review the returned result against that direction.
- **Style exploration**: propose two or three meaningfully different directions
  before generation. Do not spend one call per vague idea unless requested.
- **Multilingual or bilingual song**: decide which language owns each section,
  why the switch happens, and which phrase should remain recognizable across
  languages. Write for natural performance rather than translating line by
  line.
- **Refinement**: diagnose the current result first; change the smallest set of
  musical instructions that addresses the problem.

## Minimum useful brief

Infer obvious details from context, but ask a compact question when a missing
answer would change the song:

- purpose and audience;
- vocal or instrumental;
- language, region, script, lyric register, and any section-level language mix;
- emotional destination;
- genre family or acceptable references;
- voice casting: male, female, duet, group, or no preference;
- any must-keep words, melody, audio, duration, or prohibited elements.

Do not interrogate the user for every field. If they say “make a warm café
BGM,” infer instrumental, restrained dynamics, unobtrusive arrangement, and a
clean ending or loop-friendly arc, then offer a concise direction.

If the user asks in a language not covered by a dedicated reference example,
use the universal lyric checks and ask only about regional wording that could
materially change the result. Do not pretend native certainty; invite the user
to correct identity-sensitive phrases before generation.

## Artist shorthand and reference requests

Translate artist-name shorthand into musical attributes such as era, genre,
tempo feel, instrumentation, vocal texture, phrasing, harmony, and mix so the
generation direction is concrete and reviewable.

For a cover or reference-led request:

1. Ask what musical identity should carry over and what they want to transform.
2. For a local FLAC, MP3, or WAV file, use only
   `python3 scripts/mcp_client.py upload <path> --mime-type <type>` and pass the
   returned artifact as `reference_audio`.
3. Build the creative brief around the requested genre, instrumentation,
   energy, language, vocal treatment, and arrangement.
4. Submit only after the exact direction is approved. Listen against the
   brief when playback is available and turn the largest gap into one focused
   next revision.

## Generation boundary

Preparing lyrics, a title, a style shortlist, or a production brief is free of
music-generation charges. Call `beatra.music.generate` only when audio is the
requested next outcome. If the user is still choosing between directions,
present the choices first.
