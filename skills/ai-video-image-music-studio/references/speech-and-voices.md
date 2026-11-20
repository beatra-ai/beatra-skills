# Speech and voices

## Discover, preview, and direct speech

Speech synthesis requires text and an opaque Beatra voice ID.

1. Reuse a voice ID the user already selected or that is present in current
   context.
2. Call `beatra.voices.list` when a voice is still needed or the user asks to
   browse or compare (filter `supports_dialogue=true` for multi-speaker dialogue).
   Apply only filters the user actually supplied, and audition candidate voices
   at zero charge with `beatra.voices.preview` (`{"voice_id": "..."}`).
3. When dramatic pauses, emphasis, breath cues, or polyphonic/foreign names
   benefit from direction without rewriting user prose or hand-authoring braced
   tags (`{pause}` or `{pron}`), confirm and run Smart Voice
   Director (`beatra.speech.prepare_script`, `{"capability": "speech_script"}`,
   max 2 concurrent). It returns `directed` and `scripts[]` (`synthesis` text or
   `null` plus `warnings`); fall back cleanly to the plain text when `directed`
   is `false`. Re-calling within 48 hours with identical `input`, `instructions`,
   `language`, and `context` while swapping only `voice` or `model` carries zero
   extra charge.
4. Always run free `beatra.speech.validate` (`estimated_duration_seconds`,
   `price_credits`) before `beatra.speech.synthesize` (`{"capability": "text_to_speech"}`).
   Keep `subtitle_enable: true` by default (never send `subtitles` on speech
   calls) so free aligned JSON/SRT/VTT `output.subtitles` return with the audio.
   Include delivery controls only when they matter to the requested result and
   the current model interface supports them.
5. Submit exactly once and poll the returned asynchronous task with
   `beatra.tasks.get`.

## Multi-speaker dialogue scenes

For multi-character scenes (`2–50` turns, `<= 2,000` characters, at most `10`
distinct `supports_dialogue=true` voices including at most `4` ready custom
voices):

1. Validate turns for free with `beatra.speech.validate_dialogue`.
2. Show the dialogue production card (`{"capability": "text_to_dialogue"}`),
   wait for approval, then submit `beatra.speech.synthesize_dialogue` with
   `subtitle_enable: true` so aligned speaker-turn subtitles arrive with the audio.

## Sound effects and audio finishing

- Generate standalone `0.5–30 s` sound effects or `loop: true` ambient beds on
  their own production card with `beatra.audio.generate_sfx`
  (`{"capability": "sound_effects"}`).
- Use `beatra.audio.process` with `"operation"` (never `"action"`) and `"source"`
  for `trim`, `loop`, `fade`, `normalize_loudness` (default `-14 LUFS`,
  `true_peak_db` `-9` to `0`, default `-1`), `convert_format`, `separate_stems`,
  or `isolate_voice` (never call finishing outputs mastered). See
  [speech and audio](speech-and-audio.md) and
  [music editing and audio](music-editing-and-audio.md).

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
   select the clone model as described in
   [speech and audio](speech-and-audio.md) §5, and show the clone admission
   card with the live clone price before any `client_request_id`: route, tool
   `beatra.voices.clone`, provisional estimate, and what happens if the balance
   is short. Do not submit until the user approves the card.
4. Set `consent_attested: true` only after confirmation. Include the requested
   display name and one new stable `client_request_id`.
5. Submit exactly once and poll the same task with `beatra.tasks.get`. Do not
   create another clone while it is queued or running. On
   `insufficient_balance`, keep the URL exact and retry the same frozen ID only
   after the user says they have topped up. If the refusal names another way
   forward, present it too and follow
   [billing, errors, and recovery](billing-errors-and-recovery.md).

A one-step clone is ready for use as soon as its task succeeds. When a clone
result or a listed voice has status `pending_activation`, follow §5 Step E of
[speech and audio](speech-and-audio.md) before using the voice. Deliver the
returned `voice_id`, display name, and any other returned voice fields. Voice
cloning is charged once: when a one-step clone succeeds, or when a previewed
voice is activated. Later speech usage is separate. Failed tasks are refunded.
Use `beatra.models.list` with the voice-clone capability for current constraints
and price.
