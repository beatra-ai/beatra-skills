# Review and iteration

## Presenting a completed result

Lead with every returned `task.output.clips` entry in order, including the
returned title or lyrics when present and the factual `clip.audio` URL,
artifact ID, duration, MIME type, and size. Then state:

- the realized direction in one sentence;
- resolved model and returned clip count;
- any important soft request that should be checked by ear, such as Cantonese
  pronunciation, regional wording, bilingual switching, duet role assignment,
  or ending behavior;
- actual `billing.net_charged_credits` returned by the task; and
- the exact `task.links.assets` destination when returned, without inventing a
  generic asset URL.

Do not bury the audio under request diagnostics. Offer two or three specific
next refinements, not a generic “try again.”

Include the task ID as a compact recovery handle. Unless the user asks to debug
or integrate the call, do not show raw payloads, client request IDs, polling
mechanics, or schema limits. Translate necessary constraints into ordinary
creative language, such as “the requested 30 seconds may need a final trim.”

## Listening review

Evaluate the artifact against the approved brief only when the host can play
the audio. Otherwise label listening review incomplete and limit the delivery
to factual task and artifact fields.

1. **Composition** — hook strength, melody shape, harmony, pacing.
2. **Lyrics** — clarity, prosody, rhyme, emotional progression, language
   naturalness, regional register, and whether code-switching has a purpose.
3. **Performance** — vocal character, diction, pronunciation, role assignment,
   energy, and fit for the intended audience.
4. **Arrangement** — instrument choices, density, transitions, climax, ending.
5. **Production** — balance, space, texture, suitability for the intended use.

Separate a model miss from a brief problem. If a Cantonese lyric is unnatural,
fix the text; if the lyrics are good but pronunciation is inconsistent,
strengthen concise language guidance. If a duet collapses into one singer,
clarify role tags and call-and-response structure while acknowledging the
control remains soft.

For any language, distinguish four different failures: unnatural writing,
incorrect regional register, weak model pronunciation, and an arrangement
that does not leave the words space. Fix the correct layer rather than adding
more generic language tags.

## Revision discipline

Before another billable generation:

- name the two or three most important changes;
- preserve what already works;
- show material lyric changes to the user;
- get approval when the user did not already request another version;
- use a new `client_request_id` only for that newly approved generation.

Do not resubmit an existing direction because polling is slow. Recover and poll
the original task.

## Common focused revisions

- **Chorus lacks lift**: shorten the pre-chorus, strengthen the hook, request
  wider harmony and added rhythmic energy at the chorus.
- **Lyrics feel generic**: replace abstractions with scene-specific images and
  make the final chorus change one key line.
- **BGM competes with dialogue**: reduce lead density, percussion transients,
  and midrange activity; request more negative space.
- **Cantonese feels translated**: rewrite in natural Cantonese syntax and rhyme,
  remove decorative particles, simplify dense lines.
- **Bilingual switch feels decorative**: give each language a section purpose,
  keep one shared hook, and remove switches that do not change meaning or
  perspective.
- **Japanese phrasing feels crowded**: reduce mora density, restore natural
  phrase boundaries, and simplify loanwords at fast notes.
- **Spanish stress feels forced**: restore natural lexical stress and rewrite
  translated idioms around a native image.
- **Duet roles blur**: give voices opposed perspectives, alternate complete
  sections, and mark only the shared hook as duet.
- **Too conventional**: raise the unusual structural or textural idea first;
  increase `weirdness_constraint` modestly only when that supports the brief.
- **Too chaotic**: reduce competing genres, lower weirdness, simplify section
  count, and anchor the instrumentation.
