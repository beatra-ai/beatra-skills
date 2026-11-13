---
name: "brand-jingle-studio"
description: "Turn a brand name, slogan, and campaign use into a set of original brand jingles, ad songs, and audio-logo stings. This brand jingle maker and AI jingle generator drafts the hook and optional sung line, then generates reviewable tracks in the lengths and styles the campaign needs for ads, store openings, podcast intros, and radio spots. Use it as an ad song generator and brand music generator for brand theme songs, commercial jingles, advertising jingles, sonic logos, audio logo stings, campaign music, radio jingles, podcast intro jingles, and event walk-on themes, with each candidate generated as original music you can use commercially."
---

# Brand Jingle Studio

Turn a brand brief into reviewable original jingles, ad songs, and audio-logo
stings. Hear a few style sketches first, lock the DNA, then derive the other
lengths.

## Scope and adjacent routes

Use this Skill when the user needs commercial brand music.

Split the job before spending:

- A sonic logo or sting is a short instrumental identity sound. Deliver three
  short sketches and stop unless the user asks to derive a longer cut.
- A sung jingle or brand theme is the hook-and-length path: three style
  sketches on one primary length, then derived lengths after the user locks
  one.
- A spoken tagline over an instrumental bed is not a sung lyric. Generate the
  bed and the spoken line as two artifacts. This Skill cannot mix them.

Route a gift or occasion song about a person to `personalized-song-maker`.
Route finished lyrics that only need a melody to `suno-lyrics-to-song`. Route
one instrumental bed for a specific video cut to `short-video-bgm-studio`.
Route a labeled livestream or store playlist of many beds to
`livestream-bgm-pack`. Route a cover of an existing recording to
`ai-song-cover-studio`. Keep mixed or uncertain music requests on
`music-generation-studio`.

## Inputs and defaults

The hard inputs are:

- the brand or product name;
- the destination (ad, store, podcast intro, livestream open, event walk-on,
  or sonic logo);
- the language of any sung or spoken line;
- whether the track should sing a hook, stay instrumental, or carry a spoken
  tagline.

Reuse already-known slogan, must-include words, mood, genre, vocal direction,
and exclusions. Ask only when a missing answer changes the hook, the vocal
route, or the paid cells. When the destination is known, do not ask for a
15 / 30 / 60 table.

Safe defaults:

- Three style sketches on one primary length. Ads, podcast intros, and
  livestream opens default to about 15 seconds. Radio spots and store loops
  default to about 30 seconds. Sonic logos default to a 2-to-5-second
  instrumental sting.
- Full 3 × 3 only when the user asks for every length in every style.
- About-15-second prompts stay one section. About-30-second prompts use
  intro plus body. Stings describe two-to-four notes and a clean ending.
- `model: "suno-6"` for ordinary music. Never omit the model and never
  silently use `auto`.
- Length: when this account has the music tools (the bundled client's `tools`
  command lists `beatra.music.edit` and `beatra.audio.process`; see
  [music editing and audio](references/music-editing-and-audio.md)), send
  `duration_seconds` of 30 or more without `duration_fit` for every jingle
  sketch, a 15-second ad or a fixed broadcast slot included (stings have their
  own rule in the next bullet). A target under 30 seconds is generated at 30
  and cut, and `exact` cuts any take at its target; either way only a faded cut
  is kept, so the written ending and any words still being sung are lost. Ask
  in the prompt for the hook and brand line inside the slot's first seconds
  (for example "hook and brand line inside the first 15 seconds"), and put the
  plan on the card's Work line ("each sketch made at about 30 seconds; the one you pick is then cut to 15 seconds, listed below as its own line"). The slot length is
  cut from the locked sketch (Golden path, step 6). Without the tools, write
  length only in the prompt and do not add a duration argument.
- A sting: with the music tools, generate each of the three sketches with
  `duration_seconds: 10`, then cut it to the 2 to 5 seconds its prompt asks for
  with `beatra.audio.process` `operation: "trim"` and a short `fade_out_ms`: a paid call at the live `audio_process` price (`beatra.models.list` with `{"capability": "audio_process"}`), listed for each sting as its own line on the sketches' card with its own `client_request_id`. The
  sting is cut from a longer sketch and ends on a fade, so say so. Another cut of the same sketch is one more paid call on its own card; after listening, the user can choose where that sting starts and ends (seconds as their player shows them). Without the
  tools, ask for the short length in the prompt.
- Caller-supplied lyrics require `model_options.suno.custom_mode: true`.
- Write and show the hook, sung line, or spoken tagline before any paid call.
- For a sonic logo or sting, set `instrumental: true` and keep lyrics absent.

Lyrics, slogan shaping, style cards, and planning are free. Each `beatra.music.generate` call and each cut is paid. A spoken tagline is a separate paid
`beatra.speech.synthesize` call.

## Golden path

1. Collect the brand card. Draft the hook and, when the track sings, a short
   lyric with a repeated brand line. When the user wants a spoken tagline,
   write that line as speech, not as sung lyrics.
2. Choose the primary length from the destination. Call
   `beatra.models.list` with `{"capability":"text_to_music"}`, read the
   `pricing` of the chosen model's entry (`suno-6` unless the user named
   another eligible model), and price the three sketches per slot and in
   total. When the card will list a cut, also call `beatra.models.list` with
   `{"capability":"audio_process"}` and add each cut at that live price.
   Never a remembered number.
3. Confirm three frozen music payloads (prompt, length, lyrics or
   instrumental flag, title, model, and one opaque stable `client_request_id`
   each), plus each planned cut as its own line with its own
   `client_request_id`, and the current maximum charge of every line. Planning
   is not approval. A sting path confirms only those three short instrumentals
   and their three sting cuts.
4. Submit each sketch exactly once through the bundled
   `scripts/mcp_client.py`. Example:

   ```text
   printf '%s' '{"model":"suno-6","prompt":"Bright compact brand jingle, one pop section, hook and brand line inside the first 15 seconds, clean ending sting.","lyrics":"[Hook]\nApproved brand line\n","title":"Approved 15s Hook","duration_seconds":30,"model_options":{"suno":{"custom_mode":true}},"client_request_id":"opaque-jingle-15s-a"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Without the music tools, drop `duration_seconds` and write "about 15
   seconds" in the prompt.

   Do not configure, call, or use a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback.
5. Poll each task with `beatra.tasks.get`. Deliver actual
   `duration_seconds`, MIME type, size, URL or artifact ID, resolved model,
   and `billing.net_charged_credits`. Review the hook, ending, and how close
   the actual duration sits to the target. Give one concrete next lever, such
   as BPM 92 to 108, not "make it different."
6. After the user locks one sketch, make each derived length. A shorter length,
   such as a 15-second or 6-second cut of the locked jingle, is one
   `beatra.audio.process` call with `operation: "trim"`, `target_duration_ms` set
   to the length, and a `fade_out_ms`, from the start unless the user names
   another `start_ms`. It is a paid call at the live `audio_process` price with its own `client_request_id`: the sketches' card lists it as its own line when the slot length was planned there; any other cut gets its own card. It is not a new generation: the cut keeps the jingle's opening
   and ends on a fade rather than the written ending, so say so. Deliver the
   cut beside the uncut sketch, which keeps the written ending. A longer length
   is a new `beatra.music.generate` sketch (this Skill does not call
   `beatra.music.edit`): confirm it on a new card with a new request ID. Without
   the music tools, confirm every derived length as new paid work with a new
   request ID. Leave accepted sketches untouched.
7. If the user asked for a spoken tagline rather than a sung hook, call
   `beatra.voices.list` and `beatra.models.list` with
   `{"capability":"text_to_speech"}`. Confirm a current speech card, then
   submit `beatra.speech.synthesize` once with its own
   `client_request_id`. Deliver the instrumental bed and the spoken line as
   two artifacts. Do not claim they are mixed.

For a 30-second radio-style spot, describe the timeline in the prompt and
again at delivery: 0–3 hook, middle sell, closing brand line by 26 seconds.

## Decisions that require confirmation

Confirm the three sketches and the live music estimate before the first paid
music call. Show one current production card and wait:

1. Work — the three style sketches in the user's words, each a
   `beatra.music.generate` call (and, when chosen, the spoken tagline as `beatra.speech.synthesize`), and with the music tools each planned cut or sting cut as its own `beatra.audio.process` line.
2. Credits — the live price of the chosen model (`suno-6` by default) just read from `beatra.models.list`, and the live `audio_process` price of each cut listed, per line and in total. Never a remembered
   number.
3. Count — one paid call per line listed on the card: each sketch, and each planned cut. Each derived longer length is another card; any other shorter cut is a paid `audio_process` call on its own card.
4. Identity — one new opaque `client_request_id` per line listed on the card. Any changed hook,
   lyric, spoken line, prompt, length, style, model, voice, or instrumental
   setting mints a new ID.
5. If we stop here — the brand card, hook, and sung or spoken line remain
   usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Translate the prose; keep the URL. Do not retry
   until the user says they have topped up.

Confirm each paid derived length before that call. Confirm the spoken
tagline card before `beatra.speech.synthesize`. A changed hook, lyric, spoken
line, prompt, length, style, model, voice, or instrumental setting is new
paid work with a new request ID.

When the user asks how many credits remain, call `beatra.wallet.get`. When they
ask what was charged, call `beatra.wallet.ledger`. Both are read-only. Do not
invent an account-balance or top-up tool. Do not make `wallet.get` a required
step before every paid submit.

Read the actual returned duration. With the music tools, a length under 30
seconds or any length with `exact` comes back at that length unless the song ends
early; others land within about 10%. Without the music tools a requested length
is arrangement guidance. Do not force a verse–chorus–bridge into a 15-second
prompt.

## Recovery

If a create response is lost, retry only that candidate's identical frozen
payload and ID. If a task ID is lost, list the matching capability with
`beatra.tasks.list`, inspect candidates with `beatra.tasks.get`, and
recover the original before new work.
Music and speech recover independently. Never duplicate a paid submission.

Call `beatra.tasks.cancel` only when the user asks to cancel that candidate.
On 409 keep polling the same task.

## References by task

- Read [Brand jingle workflow](references/workflow.md) for brand cards,
  sketch-then-derive payloads, spoken-tagline cards, polling, recovery, or
  review.
- Read [Music editing and audio](references/music-editing-and-audio.md) for
  the length and trim steps.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md)
  for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared
  terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect. Do not configure a host Connector.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package or shared credentials.

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
