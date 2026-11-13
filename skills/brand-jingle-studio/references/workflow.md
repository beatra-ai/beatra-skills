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

Length is a control when this account has the music tools. Run the client's
`tools` command once per conversation: the tools are there when it lists
`beatra.music.edit` and `beatra.audio.process` (see
[music editing and audio](music-editing-and-audio.md)). Then send
`duration_seconds` of 30 or more without `duration_fit` for every jingle
sketch, a 15-second ad or a fixed broadcast slot included (sonic-logo stings
follow their own rule below). A target under 30 seconds is generated at 30 and
cut, and `exact` cuts any take at its target; either way only a faded cut is
kept, so the written ending and any words still being sung are lost. Ask in the
prompt for the hook and brand line inside the slot's first seconds (for example
"hook and brand line inside the first 15 seconds"), and tell the user on the
card that each sketch is made at about 30 seconds and that the one they pick is then cut to their slot length, a paid cut listed on the same card as its own line. Without the tools, length targets live in the prompt as
arrangement direction and there is no duration argument.

Default paid music work is three style sketches on one primary length, not
nine cells:

- ads, podcast intros, and livestream opens: about 15 seconds, one section;
- radio spots and store loops: about 30 seconds, intro plus body;
- sonic logos: three short instrumental stings, about 2 to 5 seconds. With the
  music tools, generate each with `duration_seconds: 10`, then cut it to that
  length with `beatra.audio.process` `operation: "trim"` (`target_duration_ms` and a short `fade_out_ms`; a paid call at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`), listed for each sting as its own line on the sketches' card with its own `client_request_id`). The sting is cut from a longer sketch and ends on a fade,
  so say so. Another cut of the same sketch is one more paid call on its own card; after listening, the user can choose where that sting starts and ends.

Do not ask for a 15 / 30 / 60 table when the destination already picks the
primary length. After the user locks one sketch, derive the other lengths. With
the music tools, a shorter length is a cut of the locked sketch, not a new
generation: one `beatra.audio.process` call with `operation: "trim"`,
`target_duration_ms` set to the length (from `start_ms` 0 unless the user names
another start), and a `fade_out_ms`. The cut keeps the jingle's opening and ends
on a fade rather than the written ending, so say so. Deliver the cut beside the
uncut sketch, which keeps the written ending. A longer length, or any length
without the tools, is a new paid cell with a new `client_request_id`.
Approve a full 3 × 3 only when the user asks for every length in every style.

## Submit one music candidate

Ordinary sung sketch for a 15-second slot:

```json
{
  "model": "suno-6",
  "prompt": "Bright compact brand jingle, one pop section, hook and brand line inside the first 15 seconds, memorable hook, clean ending sting, radio-ready stereo mix",
  "lyrics": "[Hook]\nApproved brand line\n",
  "title": "Brand 15s Hook A",
  "duration_seconds": 30,
  "model_options": {"suno": {"custom_mode": true}},
  "client_request_id": "opaque-jingle-15s-a"
}
```

Ordinary 30-second radio-style sketch. Put the timeline in the prompt: 0–3
hook, middle sell, closing brand line by 26 seconds. With the music tools, a
take that runs past the slot is cut with `beatra.audio.process` `trim` after the
user locks it (a paid call at the live `audio_process` price with its own
`client_request_id`, on its own card unless the sketches' card already listed
it), and the cut ends on a fade.

```json
{
  "model": "suno-6",
  "prompt": "30-second radio brand jingle, intro plus body, 0-3 second hook, mid sell, closing brand line by 26 seconds, clean resolved ending",
  "lyrics": "[Hook]\nApproved brand line\n",
  "title": "Brand 30s Spot A",
  "duration_seconds": 30,
  "model_options": {"suno": {"custom_mode": true}},
  "client_request_id": "opaque-jingle-30s-a"
}
```

Ordinary instrumental sting:

```json
{
  "model": "suno-6",
  "prompt": "Short premium audio logo, three-note sting, about 3 seconds, clean silence after the last hit, polished wide mix",
  "instrumental": true,
  "title": "Brand Sting A",
  "duration_seconds": 10,
  "client_request_id": "opaque-jingle-sting-a"
}
```

The length fields in these three examples are sent only when this account has
the music tools; without them, drop them and keep the length in the prompt.
With them, the sting is then cut to about 3 seconds with `beatra.audio.process`
`trim`, as described above.

Set `model: "suno-6"` unless the user names another eligible model. Never
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

There is no mix tool. Deliver the bed and the spoken line as two artifacts.
Tell the user they will stack them.

## Review

Deliver sketches in the order they were approved. Report actual
`duration_seconds`, MIME type, size, URL or artifact ID, resolved model, and
`billing.net_charged_credits`. Compare the actual duration with the length
target. Review brand-name pronunciation, hook repeat, and whether the ending
can serve as a sting. Offer one concrete next lever, such as BPM 92 to 108.
State what the host Agent could not hear.

A revision is one cell: regenerate only the changed candidate with a new
request ID and leave accepted cells untouched.
