# Portrait craft

## Identity-first composition

A professional headshot exists to represent a specific person. Unlike a
generated concept, the source selfie carries an identity that must remain
recognizable. Build the prompt around the person, not the environment:

- preserve face shape, eye color, skin tone, hair, and age range from the
  source selfie;
- change only the background, attire, and lighting unless the user explicitly
  requests otherwise;
- state identity cues explicitly: "Image 1 is the source person; preserve their
  facial structure, skin tone, eye color, and hair exactly."

## Composition for professional framing

Professional headshot composition follows established portrait conventions:

- **Head-and-shoulders framing.** The person fills 60-75% of the vertical frame.
  Tighter crops risk an overly aggressive look; looser crops lose the person at
  small display sizes.
- **Eye-level camera.** The virtual camera sits at or slightly above eye level.
  This projects equality and confidence. A low angle looks dominant; a high
  angle looks submissive.
- **Rule of thirds.** Place the eyes along the upper-third line. This creates a
  natural, balanced composition that reads well in circular LinkedIn crops.
- **Headroom.** Leave a small amount of space above the head. Too much headroom
  wastes valuable frame space; too little feels cramped.
- **Shoulder angle.** A slight body turn (10-15 degrees from camera) with the
  face toward the lens creates dimension and professionalism. A flat square-on
  pose looks rigid.

## Lighting for professional mood

Lighting quality determines whether a headshot looks premium or amateur. Match
the light to the industry and style:

- **Studio key light** — the standard professional look. A large soft light
  source at 45 degrees from the face creates flattering, even illumination with
  gentle shadows. Default for corporate, academic, and legal.
- **Soft fill** — a secondary low-intensity light from the opposite side reduces
  shadow contrast. Creates a clean, approachable look suitable for tech and
  startup.
- **Rim light** — a light from behind the subject that outlines the hair and
  shoulders. Adds depth and separation from the background. Pairs well with
  creative and editorial styles.
- **Natural window light** — soft directional light from one side mimicking a
  window. Creates a warm, authentic, modern feel. Excellent for startup and
  lifestyle-forward industries.
- **Bright high-key** — bright, nearly shadowless lighting on a white or light
  background. Clean and modern. Ideal for medical, clean tech, and minimal
  branding.

State the light quality in the prompt: "soft studio key light at 45 degrees,
gentle fill, even illumination, flattering professional lighting."

## Background discipline

The background must support the person, not compete:

- **Solid white** — clean, modern, versatile. Works for LinkedIn, corporate
  websites, and medical directories. Maximizes flexibility for the user to add
  their own background later.
- **Soft gray** — professional, neutral, reduces harsh contrast. A popular
  default for corporate and tech headshots.
- **Navy or dark** — authoritative and formal. Excellent for legal, finance, and
  executive portraits.
- **Gradient** — a smooth transition from light to dark adds depth without
  distraction. Modern and polished.
- **Modern office** — a softly blurred office interior behind the person.
  Communicates a professional environment while keeping focus on the subject.
- **Outdoor urban** — a softly blurred cityscape or natural setting. Works for
  startup, creative, and lifestyle-forward brands.
- **Studio backdrop** — a textured or colored professional backdrop (seamless
  paper, muslin, or painted canvas). Classic photography studio look.

Include the background constraint in the prompt: "clean [color/type] background,
softly blurred, no competing objects or text, subject sharply separated from
background."

## Attire guidance by industry

Attire signals professional context. Match it to the industry:

- **Corporate and finance** — tailored navy or charcoal suit, white or light
  blue dress shirt, optional tie. Classic, authoritative.
- **Tech and engineering** — blazer over open-collar shirt, clean knit, or
  polished polo. Smart casual, approachable.
- **Creative and design** — individual style within professional bounds. Bold
  colors, interesting textures, or statement accessories welcome.
- **Academic and research** — formal jacket, collared shirt or blouse, neutral
  tones. Credible and composed.
- **Medical and healthcare** — white coat over professional attire, or clean
  scrubs. Trustworthy and clinical.
- **Startup and entrepreneurship** — clean shirt without tie, fitted jacket, or
  modern business casual. Dynamic and confident.
- **Legal and consulting** — dark suit, white shirt, tie or formal blouse.
  Authoritative and trustworthy.

State attire explicitly in the prompt so the model dresses the person
appropriately for the target industry.

## Expression and grooming

- **Expression** — confident and approachable. A slight, genuine smile or a
  composed neutral expression works best. Avoid forced grins or overly stern
  looks unless the industry calls for it.
- **Grooming** — neat hair, clean skin, appropriate makeup if desired.
  Professional grooming reads as attention to detail and competence.
- **Eye contact** — direct eye contact with the camera projects confidence and
  builds trust with the viewer.

State expression cues in the prompt: "confident approachable expression with a
slight smile, direct eye contact with the camera."

## Quality standards

Every professional headshot must meet baseline quality:

- **Sharp focus on the eyes.** The eyes are the most important element. They
  must be crisp and well-defined.
- **Even skin tone.** Natural, well-balanced skin without blemishes,
  redness, or shininess. Retouching should look natural, not plastic.
- **Professional grooming.** Hair, skin, and (if applicable) facial hair must
  look deliberate and maintained.
- **Appropriate attire.** Clothing must match the stated industry and fit well.
  Wrinkled, casual, or mismatched attire undermines the professional image.
- **Clean background.** No distracting objects, harsh shadows, busy patterns,
  or competing elements behind the person.
- **Balanced exposure.** Neither too dark nor too bright. Details visible in
  both highlights and shadows.

## Canvas and output

- Default canvas: square `1:1` at `2K` tier (approx. 1080 × 1080 px or higher).
- Portrait `3:4` or `4:5` only on explicit request for resume or print.
- A different ratio is a separate paid request with its own confirmation and
  `client_request_id`.

## Circular crop resilience

LinkedIn and many social platforms display profile photos in a circular crop.
The headshot must survive this:

- keep the face within the center 60% of the frame so the circular crop does not
  cut off the head or shoulders;
- avoid placing ears or hair edges at the extreme horizontal edges;
- ensure the background is clean enough that the circular crop does not create
  an awkward partial object.
