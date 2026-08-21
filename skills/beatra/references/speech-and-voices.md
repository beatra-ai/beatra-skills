# Speech and voices

## Synthesize speech

Speech synthesis requires text and an opaque Beatra voice ID.

1. Reuse a voice ID the user already selected or that is present in current
   context.
2. Call `beatra.voices.list` only when a voice is still needed or the user asks
   to browse or compare. Apply only filters the user actually supplied.
3. Call `beatra.speech.synthesize` with the chosen voice ID and exact text.
   Include delivery controls only when they matter to the requested result and
   the current model interface supports them.
4. Submit exactly once and poll the returned asynchronous task with
   `beatra.tasks.get`.

Omit `model` by default so Beatra can choose a compatible route. All customer
requests remain asynchronous tasks while Beatra applies automatic execution
routing internally. Respect an explicit concrete model and never substitute it
silently.

`language` is an optional provider-neutral BCP-47 tag. Use it only when the
user requests a language or context establishes one clearly; otherwise omit it
for automatic detection. When language support matters, use
`beatra.models.list` with the text-to-speech capability and read the exact
model card's current `constraints.supported_languages`. Do not maintain a
static language list or expose a supplier-private language parameter.

Speech pricing uses weighted characters: each Han ideograph counts as two and
every other character counts as one. Credits are linear per 1,000 weighted
characters, so a request with less than 1,000 is charged for its actual weighted
characters rather than a full block. Use current model discovery for the live
rate. The request estimate is prepaid; failed tasks are refunded. Terminal
usage and billing are final truth.

## Clone an authorized voice

Use `beatra.voices.clone` only when the user requests a reusable voice from a
sample and explicitly confirms that they own the voice or have the voice
owner's permission. Possession of an audio file is not consent.

1. Obtain that explicit confirmation before uploading a local sample.
2. For a local file, use only
   `python3 scripts/mcp_client.py upload <path> --mime-type <type>` and reuse the
   returned artifact. An already returned artifact or supported direct HTTPS
   media value does not need another upload.
3. Call `beatra.models.list` for the voice-clone capability, admit the sample,
   and show the clone admission card before any `client_request_id`: route,
   tool `beatra.voices.clone`, provisional estimate, the fact that the
   600-credit signup gift usually cannot start this clone, the exact URL
   `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not
   recommend ¥198. Do not submit until the user confirms they have topped up or
   already have enough credits for this estimate.
4. Set `consent_attested: true` only after confirmation. Include the requested
   display name and one new stable `client_request_id`.
5. Submit exactly once and poll the same task with `beatra.tasks.get`. Do not
   create another clone while it is queued or running. On
   `insufficient_balance`, keep the URL exact and retry the same frozen ID only
   after the user says they have topped up.

A successful result is a successful activated voice: it is already activated.
Deliver the returned
`voice_id`, display name, and any other returned voice fields. Voice cloning has
one fixed charge on successful activation, including activation; later speech
usage is separate. Failed tasks are refunded. Use `beatra.models.list` with the
voice-clone capability for current constraints and price.
