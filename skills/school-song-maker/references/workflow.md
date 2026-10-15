# School song workflow

## Collect the intake

Record only what the user supplies. Keep a private intake card:

- occasion and the event it is for (opening ceremony, graduation
  ceremony, class meeting, arts festival, New Year gala, anniversary,
  sports day, military training);
- singers and listeners: school stage, class size if known, whether the
  whole class sings along, and who performs;
- identity to sing: school name, class or major, year, written exactly
  as the user wants it sung (full name, short name, or nickname);
- must-include lines: motto, class slogan, listed names, memories, inside
  jokes the user offers;
- language, and any dialect or bilingual lines the user asks for;
- mood and style the user already named.

A missing fact stays a named gap in the sheet. Do not fill it with a
guessed motto, a guessed history, or an invented memory.

## Write the lyric sheet

The free lyric sheet has:

- title;
- labeled sections, usually Verse 1, Pre-Chorus, Chorus, Verse 2,
  Chorus, Bridge, Final Chorus;
- full lyrics;
- a must-include map: each supplied line or name and the section where
  it is sung;
- singability notes: line lengths, the hook, where the school or class
  name falls, and any word likely to be mispronounced;
- the production prompt: genre, mood, tempo, instrumentation, voice,
  target length.

Singability rules for a group:

- Keep chorus lines short and parallel so a class can learn them after
  two listens. Repeat the hook at least twice per chorus.
- Put the school or class name where the melody can hold it, usually
  the first or last line of the chorus.
- Avoid tongue-twisters and dense clusters of similar sounds in the
  chorus.
- For Chinese lyrics, keep rhymes on open vowels for the chorus and
  avoid long runs of the same tone at the end of lines.

Voice and range by school stage:

| Stage | Default voice in the prompt | Writing notes |
| --- | --- | --- |
| Primary | children's choir, bright and clear | simple words, concrete images, short verses |
| Middle and high school | mixed student choir, chorus in unison | energetic, forward-looking, a strong hook |
| Vocational and college | mixed choir; a solo verse only when the user asks | room for imagery about the major and the city |

Mood and style by occasion (defaults the user may change):

| Occasion | Mood | Style starting point |
| --- | --- | --- |
| Class song | proud, upbeat | campus pop anthem, piano and drums |
| Freshman welcome | bright, welcoming | pop rock or light march feel |
| Graduation | warm, grateful, hopeful | folk-pop ballad that builds to a big final chorus |
| School anthem | steady, dignified | choral with orchestra or brass |
| Teachers' day | tender, thankful | gentle ballad, piano and strings |
| Anniversary | grand, celebratory | orchestral choir |
| Sports day, military training | driving, rousing | marching drums, call-and-response chorus |

## Read the live model card

Before the production card, read the live catalog once:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_music"}
```

Confirm the live prompt, lyrics, and title character limits, the
`suno-6` controls, and the current price. If the approved lyrics exceed
the live lyrics limit, shorten them with the user before the card.

When the user chooses another live model, drop `model_options.suno`
(it is rejected for `minimax-music-3.0` and `auto`), re-read that model's
controls and limits from the live card, show the model on a new card, and
mint a new `client_request_id`.

## Production card examples

Show the six fields from the root before any billable generate.

Song plus instrumental, one card, two slots:

1. Work — "the class 2 welcome song" and "one instrumental entrance
   piece, a new piece in the same style", two `beatra.music.generate`
   calls.
2. Credits — the live `text_to_music` price for each slot and the total.
3. Count — two paid calls.
4. Identity — two new opaque `client_request_id` values, one per slot.
5. If we stop here — the lyric sheet stays complete and usable.
6. If the balance is insufficient — relay the official message and
   top-up URL exactly; wait for the user.

Per-class set after the first song is accepted: list every remaining
class as its own slot with its own ID, the live price times the slot
count, and one paid call per slot.

## Payloads

Send every payload through a quoted heredoc or a JSON file on standard
input. Never put lyrics or a title inside a single-quoted shell string:
an apostrophe in a lyric or a school name (`We're`, `St. Mary's`) breaks
the quoting and can silently change the words that are sent. The lyrics
and title sent must equal the approved sheet character for character;
inside the JSON escape double quotes, backslashes, and control
characters such as line breaks (`\n`) and tabs (`\t`).

Song (default):

```bash
python3 scripts/mcp_client.py call beatra.music.generate <<'JSON'
{
  "model":"suno-6",
  "prompt":"Bright campus pop anthem, mixed student choir singing the chorus in unison, piano and strings with light drums, moderate tempo, easy to sing along, about two and a half minutes.",
  "lyrics":"[Verse 1]\nWe're the class that never quits\n[Chorus]\nApproved hook",
  "instrumental":false,
  "title":"Approved Title",
  "model_options":{"suno":{"custom_mode":true}},
  "client_request_id":"opaque-school-song-01"
}
JSON
```

Instrumental slot (omit `lyrics` entirely):

```bash
python3 scripts/mcp_client.py call beatra.music.generate <<'JSON'
{
  "model":"suno-6",
  "prompt":"Uplifting instrumental entrance music for a school ceremony, brass and strings over steady drums, about two minutes.",
  "instrumental":true,
  "title":"Approved Title Entrance",
  "model_options":{"suno":{"custom_mode":true}},
  "client_request_id":"opaque-school-song-02"
}
JSON
```

Per-class set: the same shape, one call per class, each with that
class's approved lyrics, title, and its own `client_request_id`. The
account's limit on unfinished creations comes back from
`beatra.wallet.get` (an optional read). A create refused for that limit
made no task and no charge: honor the retry delay it returns, wait for a
running task to finish, then resend the same frozen payload with the
same ID.

## Poll, recover, and cancel

After each create response, record the `task_id` beside its slot and ID
and poll `beatra.tasks.get` until a terminal state. If a create response
is lost, call `beatra.tasks.list` with `{"capability":"text_to_music"}`,
inspect plausible candidates with `beatra.tasks.get`, and match title,
lyrics, and time against the private ledger before any replay. Replay
only the byte-identical payload with the same ID. A changed lyric, title,
prompt, or model is new work with a new card and a new ID.

Call `beatra.tasks.cancel` only when the user asks, once, and confirm the
terminal state with `beatra.tasks.get`. A 409 means cancellation is not
confirmed; keep polling the same task.

## Review checklist

For every returned take:

- the school and class names are sung in the chosen form;
- every must-include line is present and audible;
- the chorus repeats the hook and a class could sing it back;
- the voice matches the chosen choir or solo voice;
- mood and tempo fit the occasion;
- vocals and mix are clean, with no cut-off ending;
- actual duration and the number of takes returned.

Say which items the host actually heard. When it could not listen,
hand the list to the user.

## When the user asks for something adjacent

- **A backing track of the delivered song for live singing.** The song
  cannot be split into vocals and accompaniment here. Offer an
  instrumental slot instead and explain it is a new piece in the same
  style, not the same melody without vocals. A class that wants to sing
  the delivered melody live can sing along with the full song in
  rehearsal.
- **Sheet music or a score.** Not produced here; the delivery is audio.
- **A new arrangement of an existing recorded school anthem.** Route to
  `ai-song-cover-studio` with the recording as the reference.
- **An exact duration.** Length is guided by the prompt; report the
  actual duration returned.
