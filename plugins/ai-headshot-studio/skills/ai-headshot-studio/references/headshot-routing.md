# Headshot routing

## Start from the user's actual starting point

A professional headshot request arrives in one of three shapes. Identify which
one before choosing a tool.

| Starting point | What is enough to start | Route |
| --- | --- | --- |
| One selfie + industry or style | The source selfie plus one target professional look | `beatra.images.transform` |
| One selfie + background reference | Ordered references (selfie first, background second) | `beatra.images.transform` |
| Accepted headshot + specific fix | The accepted headshot plus the requested change | `beatra.images.edit` |

A single selfie with no explicit style preference is enough to propose a
corporate-appropriate studio headshot with a clean neutral background and include
it in the single paid-call confirmation.

## Extract the headshot brief

Collect what is already known and fill gaps only when they materially change
the result.

- **Professional context and industry.** What the headshot is for—corporate
  LinkedIn profile, resume, company website team page, business card, academic
  profile, medical directory, or social media. The industry determines the
  attire, background, and lighting direction.
- **Target platform and use case.** Where the headshot will appear—LinkedIn
  circular crop, printed resume, website team grid, or Instagram profile. The
  platform determines the aspect ratio and framing.
- **Style direction.** Corporate formal (suit, solid background), modern casual
  (smart casual, modern office), creative artistic (editorial, studio backdrop),
  clean academic (formal, neutral background), medical clinical (white coat,
  clean clinical), or startup vibrant (casual, bright environment).
- **Background preference.** Solid white, soft gray, navy, gradient, modern
  office interior, outdoor urban, or studio backdrop. The background must
  support the professional tone, not distract from the person.
- **Output format.** Square 1:1 for LinkedIn and social media profiles, portrait
  3:4 or 4:5 for resume and print. Different formats are separate paid requests.
- **Visual references.** Style inspiration, desired background, or a colleague's
  headshot to match—ordered with the source selfie first.

## Industry style matrix

When the user names an industry but not a full style, infer the visual direction
from the industry:

- **Corporate and finance** — tailored suit or blazer, solid white or navy
  background, classic studio key light with soft fill, confident neutral
  expression. The look projects authority and reliability.
- **Tech and engineering** — smart casual (blazer over open shirt or clean
  knit), modern office or soft gray background, bright natural-feeling lighting,
  approachable expression. The look projects competence and approachability.
- **Creative and design** — artistic styling, studio backdrop or textured wall,
  directional rim light for depth, individual personality in expression and
  pose. The look projects originality and confidence.
- **Academic and research** — formal attire, neutral solid background, even soft
  lighting, composed expression. The look projects credibility and intellect.
- **Medical and healthcare** — white coat or scrubs, clean clinical or soft
  white background, bright even lighting, warm trustworthy expression. The look
  projects professionalism and care.
- **Startup and entrepreneurship** — casual polished attire (no tie, clean
  shirt), vibrant modern office or bright gradient background, energetic
  lighting, friendly confident expression. The look projects dynamism and
  vision.
- **Legal and consulting** — formal suit, dark solid or gradient background,
  classic studio lighting, composed authoritative expression. The look projects
  trust and expertise.

These are starting points, not constraints. Override with the user's stated
preference whenever available.

## Canvas and format defaults

- Canvas: square `1:1` at `2K` tier. This is the recommended format for LinkedIn
  profile photos, social media avatars, and company website team grids.
- Portrait `3:4` or `4:5` only when the user explicitly requests resume, print,
  or formal document format.
- Headshot crop (tight head-and-shoulders) is the standard framing; a wider
  bust crop is available on explicit request.
- Count: 1 (a headshot requires precision and identity fidelity, not variation).
- Model: `auto`.

## Identity preservation

Every route must preserve the person's recognizable identity. State identity
cues explicitly in the prompt:

- face shape and structure;
- eye color and distinctive features;
- skin tone and undertone;
- hair color, style, and texture;
- age range and gender presentation.

The transform changes background, attire, and lighting but must not alter the
person's fundamental facial identity. If the user requests an identity change
(such as different hair color or facial feature modification), that is a
separate workflow outside this Skill's scope.

## Visual access

Local files enter the workflow through `beatra.assets.upload`. Upload makes the
bytes available to the remote tool; it does not itself inspect the image.
Review only visual facts the host can actually see. When the host cannot view an
image, state that visual verification was not possible and proceed on the
user's declared intent.
