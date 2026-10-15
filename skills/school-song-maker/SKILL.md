---
name: "school-song-maker"
description: "Turn your school, class, year, motto, and shared memories into original lyrics and a song the whole class can sing together. This school song maker writes a class song, graduation song, freshman welcome song, school anthem, teachers' day song, school anniversary song, or sports day song with a chorus that is easy to learn, shapes the words with you line by line, and produces the finished song with a student choir, children's choir, or solo voice for assemblies, opening and graduation ceremonies, class meetings, and school performances."
---

# School Song Maker

Turn a school occasion into original lyrics and a finished song a class can
sing together: a class song, a graduation song, a freshman welcome song, a
new school or college anthem, a teachers' day song, a school anniversary
song, or a sports day or military training song.

## What you get

- **One lyric sheet** — title, labeled sections (verse, chorus, bridge),
  the full lyrics, every must-include line marked where it is sung, and
  singability notes for the group that will sing it.
- **One finished song** from that lyric sheet, sung in the chosen
  language with the chosen voice (student choir, children's choir, or a
  solo voice). The model may return more than one take; deliver every
  take it returns. Voice and length are guided by the prompt (about two
  and a half to three minutes); the actual voice and duration are
  reported on delivery.
- **Optional: one instrumental piece** for an entrance, an award moment,
  or background music at the same event.

## Ways to run it

- **One song (default)** — lyric sheet, then one song.
- **Song plus instrumental** — the same lyric sheet and song, plus one
  instrumental piece for the event. Both slots appear on one production
  card, each with its own request identity. The instrumental is a new
  piece in the same style, not the delivered song without vocals: a song
  cannot be split into vocals and accompaniment here. When the user asks
  for a backing track to sing the song live, say so and write it on the
  card's Work line. No sheet music or score is produced.
- **One song per class** — the same occasion for several classes (for
  example the welcome song for classes 1 to 4 of one year group). Make
  the first class's song first; the remaining classes become a labeled
  set after that first song is accepted.
- **Lyrics only** — stop after the lyric sheet when the class will set or
  sing the words themselves.

## Scope and adjacent routes

Use it when a teacher, class leader, student union, or school office
wants a song written for a school occasion from the school's own facts.
Route a finished lyric that only needs a song to `suno-lyrics-to-song`;
a new arrangement of an existing recorded school anthem to
`ai-song-cover-studio`; a personal gift song for one person to
`personalized-song-maker`; an exam knowledge-point song to
`exam-mnemonic-song`; and spoken lecture narration to
`course-narration-studio`. Route mixed or uncertain music requests to
`beatra-ai-music-creator`.

## Inputs and defaults

Hard inputs:

- the occasion (class song, graduation, freshman welcome, school anthem,
  teachers' day, anniversary, sports day, military training, or another
  named school event);
- who sings it: the school stage (primary, middle, high school,
  vocational, or college) and whether a whole class sings along;
- the identity to sing: school name, class or major, and year, with the
  exact form the user wants sung (full name or short name);
- must-include lines: motto, class slogan, names, or memories the user
  supplies;
- the language to sing.

Ask only for a missing hard input. Reuse anything already given. Do not
invent a motto, a school history fact, a memory, or a student name to
finish a lyric. When the user lists student or teacher names, sing only
the names they list, written exactly as they gave them.

Safe defaults:

- Mood follows the occasion: bright and forward-looking for welcome and
  sports songs, warm and grateful for graduation and teachers' day,
  steady and proud for an anthem or anniversary.
- Voice follows the singers: a children's choir for primary school, a
  mixed student choir singing the chorus in unison for a whole class,
  a solo voice only when the user asks for one.
- Melody serves a group: short lines, a repeated chorus with one clear
  hook, a comfortable middle range, and a moderate tempo.
- `model: "suno-6"` with `model_options.suno.custom_mode: true`, so the
  approved lyrics are sung as written. Show the model on the production
  card; switch only when the user chooses another live model.
- `instrumental: false` with the approved lyrics present. Style lives
  only in `prompt`; the sung words live only in `lyrics`. There is no
  `duration` field; write the target length in the prompt.

## Golden path

1. **Collect the intake.** Record occasion, singers, identity to sing,
   must-include lines, memories, language, and mood.
2. **Write the free lyric sheet.** Title, labeled sections, full
   lyrics, each must-include line mapped to where it is sung, and
   singability notes. Add the production prompt: genre, mood, tempo,
   instrumentation, and voice. This sheet is the free visible result;
   revise it with the user until they are happy. Planning is not
   approval.
3. **Read the live model card.** Call `beatra.models.list` for
   `text_to_music` and confirm the live prompt, lyrics, and title limits,
   the controls, and the current price.
4. **Show the production card and wait** (next section).
5. **Submit once** through the bundled client (see Execution) with one
   opaque `client_request_id` per slot. Record each returned `task_id`
   immediately.
6. **Poll and deliver.** Poll `beatra.tasks.get` until terminal. Deliver
   every returned take with its link, actual duration, resolved model,
   and `billing.net_charged_credits`. Review it (see Review, deliver, and
   recover).

## Decisions that require confirmation

Music generation is the only paid step. Before any billable call, show
one current production card and wait for a clear yes:

1. Work — what will be made in the user's words (for example "the
   2026 class 2 welcome song" and, when chosen, "one instrumental
   entrance piece, a new piece in the same style"), each a
   `beatra.music.generate` call.
2. Credits — the live `text_to_music` price just read from
   `beatra.models.list`, per slot and in total. Never a remembered number.
3. Count — one paid call per slot listed on the card. A later class, a
   changed lyric, or a second try is another slot.
4. Identity — one new opaque `client_request_id` per slot. Any changed
   lyric, title, prompt, model, or control mints a new ID.
5. If we stop here — the lyric sheet stays complete and usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly; translate the prose, keep the URL. Do not retry
   until the user says they have topped up.

One approval covers only the slots on that card. In the one-song-per-class
mode, accepting the first song is not approval of the rest: show a fresh
card for the remaining classes.

## Execution

Invoke every remote Beatra operation only through the bundled
`scripts/mcp_client.py`: put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_music"}
```

Send the generate payload through a quoted heredoc (or a JSON file on
standard input), never inside a single-quoted shell string: lyrics and
school names often contain apostrophes, and a single-quoted string
silently drops them. The lyrics and title sent must match the approved
sheet character for character; inside the JSON, escape double quotes,
backslashes, and control characters such as line breaks (`\n`) and
tabs (`\t`).

```bash
python3 scripts/mcp_client.py call beatra.music.generate <<'JSON'
{"model":"suno-6","prompt":"Bright campus pop anthem, mixed student choir singing the chorus in unison, piano and strings with light drums, moderate tempo, easy to sing along, about two and a half minutes.","lyrics":"[Verse 1]\nWe're the class that never quits\n[Chorus]\nApproved hook","instrumental":false,"title":"Approved Title","model_options":{"suno":{"custom_mode":true}},"client_request_id":"opaque-school-song-01"}
JSON
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback. Exact payloads for the instrumental slot and
the per-class set are in the workflow reference.

## Review, deliver, and recover

Review each take against the lyric sheet: the school and class names
sung in the form the user chose, every must-include line present, the
chorus clear enough for a class to pick up, the voice matching the chosen
choir or solo voice, the mood right for the occasion, and the audio
clean. Report only what the host could actually
hear; if it could not listen, say so and list what the user should
check.

If the user wants changes after a delivered song, a changed lyric, title,
prompt, or model is new paid work: revise the sheet for free, then show
a new card with a new ID.

If a create response is lost, call `beatra.tasks.list` for `text_to_music`
and match candidates with `beatra.tasks.get` against the private ledger
before any replay; reuse an ID only with byte-identical arguments.
Queued and running are progress states. Call `beatra.tasks.cancel` only
when the user asks, then confirm the terminal state.

## Account balance

When the user asks how many credits remain or whether a live estimate
fits, call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an
account-balance or top-up tool, and do not make `wallet.get` a required
step before every paid submit.

## References by task

- Read [School song workflow](references/workflow.md) when collecting
  the intake, writing the lyric sheet, choosing the voice for an age
  group, building payloads for the instrumental slot or the per-class
  set, recovering a task, or answering a request for a backing track or
  a score.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization or shared credentials need attention, and
  [Installation registration](references/installation-registration.md)
  for the non-billable registration step.
- Read [Tasks and results](references/tasks-and-results.md) for terminal
  task and artifact semantics, and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md)
  when the bundled client cannot connect. Do not configure a host
  Connector.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to stop using it and remove shared credentials.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
