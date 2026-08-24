# Brand jingle workflow

## Build the brand card

Write the card before any paid call:

- brand or product name and must-include words;
- destination: feed ad, radio or store loop, podcast intro, livestream open,
  event walk-on, or sonic logo;
- sung hook, instrumental only, or spoken tagline over a bed;
- language and register of any sung or spoken line;
- mood, genre, instrumentation, and exclusions;
- the hook sentence the listener should remember.

For a sung jingle, finish the lyric with a repeated brand line and show it
for approval. For a sonic logo or sting, keep lyrics absent and describe a
two-to-four-note ending figure in the prompt. For a spoken tagline, write the
spoken line separately from the instrumental prompt.

## Sketch, then derive

There is no dedicated duration field on `beatra.music.generate`. Length
targets live in the prompt as arrangement direction.

Default paid music work is three style sketches on one primary length, not
nine cells:

- ads, podcast intros, and livestream opens: about 15 seconds, one section;
- radio spots and store loops: about 30 seconds, intro plus body;
- sonic logos: three short instrumental stings, about 2 to 5 seconds.

Do not ask for a 15 / 30 / 60 table when the destination already picks the
primary length. After the user locks one sketch, each other length is a new
paid cell with a new `client_request_id`. Approve a full 3 × 3 only when the
user asks for every length in every style.

## Submit one music candidate

Ordinary sung 15-second sketch:

```json
{
  "model": "suno-5.5",
  "prompt": "Bright compact brand jingle, one pop section, about 15 seconds, memorable hook, clean ending sting, radio-ready stereo mix",
  "lyrics": "[Hook]\nApproved brand line\n",
  "title": "Brand 15s Hook A",
  "model_options": {"suno": {"custom_mode": true}},
  "client_request_id": "opaque-jingle-15s-a"
}
```

Ordinary 30-second radio-style sketch. Put the timeline in the prompt:
0–3 hook, middle sell, closing brand line.

```json
{
  "model": "suno-5.5",
  "prompt": "30-second radio brand jingle, intro plus body, 0-3 second hook, mid sell, closing brand sting, clean resolved ending",
  "lyrics": "[Hook]\nApproved brand line\n",
  "title": "Brand 30s Spot A",
  "model_options": {"suno": {"custom_mode": true}},
  "client_request_id": "opaque-jingle-30s-a"
}
```

Ordinary instrumental sting:

```json
{
  "model": "suno-5.5",
  "prompt": "Short premium audio logo, three-note sting, about 3 seconds, clean silence after the last hit, polished wide mix",
  "instrumental": true,
  "title": "Brand Sting A",
  "client_request_id": "opaque-jingle-sting-a"
}
```

Set `model: "suno-5.5"` unless the user names another eligible model. Never
omit the model and never silently use `auto`. Call `beatra.models.list` with
`{"capability":"text_to_music"}` before quoting limits, controls, or price.

## Spoken tagline

Use this branch only when the user wants a spoken line over an instrumental
bed, not a sung hook. Generate the bed with `instrumental: true`. Then call
`beatra.voices.list` and `beatra.models.list` with
`{"capability":"text_to_speech"}`. Never put a display name in `voice`.

Confirm a current speech card: exact tagline, opaque `voice_id`, model or
`auto` range, format, weighted-character estimate, and one speech
`client_request_id`. Submit `beatra.speech.synthesize` exactly once after
that card.

There is no mix or loudness tool. Deliver the bed and the spoken line as two
artifacts. Tell the user they will stack them.

## Review

Deliver sketches in the order they were approved. Report actual
`duration_seconds`, MIME type, size, URL or artifact ID, resolved model, and
`billing.net_charged_credits`. Compare the actual duration with the length
target. Review brand-name pronunciation, hook repeat, and whether the ending
can serve as a sting. Offer one concrete next lever, such as BPM 92 to 108.
State what the host Agent could not hear.

A revision is one cell: regenerate only the changed candidate with a new
request ID and leave accepted cells untouched.
