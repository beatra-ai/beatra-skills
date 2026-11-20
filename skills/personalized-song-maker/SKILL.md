---
name: "personalized-song-maker"
description: "Turn a person's story and occasion into original lyrics and a newly generated song. This personalized song maker and custom song generator workflow collects the recipient, relationship, occasion, memories, and must-include details, drafts the title, lyrics, section structure, genre, and mood for approval, then generates one finished original song, and reviews story accuracy, name pronunciation, hook, lyric rendering, and vocal result. Use it for custom birthday songs, wedding songs, anniversary songs, proposal songs, family tribute songs, and company or team anthems, with one approved lyric draft and one song generation per run and honest post-result review."
---

# Personalized Song Maker

Transform a person's story, occasion, and must-include details into original lyrics and a newly generated song. Use this Skill for a custom birthday song, wedding song, anniversary song, confession or proposal song, family tribute, baby growth song, pet memorial song, team anthem, company song, or a song gift.

## Scope and adjacent routes

The normal route is one story brief, one approved lyric draft, and one finished original song. Route a finished lyric that only needs a song to a lyrics-to-song workflow; a reference song recording that needs reinterpretation to the ai-song-cover-studio workflow; and finished music that needs visuals to the music-video-clip workflow. Keep this route focused on story-to-lyrics-to-song. The broad music creator remains the fallback for mixed or uncertain music requests. When the user asks for a song in their own voice, use the singer already made from their voice (see "Saved singers" in [Music editing and audio](references/music-editing-and-audio.md)); if there is none, create one first ("A singer from the user's own voice"). Upload a local recording with `python3 scripts/mcp_client.py upload "<file>" --mime-type <type>`.

## Inputs and defaults

The hard inputs are:

- an occasion;
- a recipient or audience;
- true story details worth turning into the song;
- names or phrases that must appear;
- a language for the song;
- an emotional direction;
- any private details to omit.

Ask only for a missing hard input. Reuse the known genre, mood, instrumentation, tempo feel, and vocal direction preferences. Lyrics writing, title drafting, section planning, and creative direction are free preparation; the song generation is paid, and so is every extra deliverable (extra cover art, a song video, a WAV version) and every audio finishing step (trimming an excerpt, fading, normalizing loudness, looping, or converting format).

## Golden path

1. Collect the intake. Record the occasion, recipient, relationship, protagonist, turning point, memorable details, names or phrases that must appear, language, emotional direction, must-include facts, and private details to omit. Build a story map: protagonist, relationship, turning point, memorable details, core message, hook, emotional arc, and ending.
2. Draft the creative direction for free. Write a title, full lyrics with section structure, and a production card: genre, mood, instrumentation, tempo feel, and vocal direction. Show the user the must-keep facts and the lyric draft for approval before any paid call. Revise the lyrics and direction until the user approves them; this revision is free.
3. Read the live music catalog with `beatra.models.list` before quoting anything or composing the paid card:

   ```bash
   python3 scripts/mcp_client.py call beatra.models.list
   ```

   ```json
   {"capability": "text_to_music"}
   ```

   Without a live catalog, do not name a model or a price; say the pick comes from the live catalog. Confirm the live prompt, lyrics, and title character limits, supported languages, controls, and price basis. Keep `model: "auto"` unless the user chose a concrete eligible model. Numeric estimates are provisional and require live catalog facts.
4. Freeze the approved title, approved lyrics, production prompt, model behavior, and one new opaque `client_request_id`, then present the six-field production card and wait for explicit approval:
   - **Work**: one song generation (`beatra.music.generate`) from the approved title, lyrics, and direction.
   - **Credits**: the live price read from `beatra.models.list` (never a remembered number).
   - **Count**: `1` paid generation call.
   - **Identity**: one new opaque `client_request_id` for this song generation.
   - **If we stop here**: your approved story map, title, lyrics, and production card remain yours at zero charge.
   - **If balance fails**: relay the official insufficient-credits message and exact top-up URL without editing the URL, and stop until the user confirms they have topped up.

   Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"prompt":"Warm acoustic pop, gentle guitar and piano, heartfelt mid-tempo vocal delivery.","lyrics":"[Verse 1]\n...approved lyrics...\n[Chorus]\n...approved lyrics...","title":"Approved Title","client_request_id":"opaque-song-id"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.music.generate` exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned audio artifact or link, and report only actual returned task status, resolved model, clip count, duration, usage, and `billing.net_charged_credits`. Lead the reply with the result and format the user asked for; the production card, route choice, and cost notes follow it and never replace it. Review accessible output for story accuracy, name pronunciation, hook, lyric rendering, emotion, arrangement, vocal result, audio quality, and duration. State what the host Agent could and could not inspect.
6. Once the user has listened and chosen a take, offer two optional paid follow-up paths as needed, each on its own six-field production card with its live price from `beatra.models.list` and its own `client_request_id` (none rides on the song's card, and on every card stopping keeps the chosen song at no further charge):
   - **Native deliverables** (`beatra.music.edit` with `operation: "deliverable"`, only when the clip's `editable` field is `{"native": true}`): extra cover art (`{"capability": "music_cover_image"}`), a song video MP4 (`{"capability": "music_video"}`), and a native WAV export (`{"capability": "music_wav"}`, never called mastered).
   - **Audio finishing** (`beatra.audio.process`): trim a chorus or highlight clip for a slideshow/ceremony (`trim`), add smooth entry/exit fades (`fade`), level playback loudness (`normalize_loudness`), extend or loop a walking/reception bed (`loop`), or export another format (`convert_format`, including WAV when a take's `editable` is not `{"native": true}` — disclose plainly that `convert_format` WAV is the same audio, not a higher-quality or mastered file). Fade, loudness, and format parameters carried inside a single `trim`, `loop`, `fade`, or `normalize_loudness` call add no separate charge, while the `beatra.audio.process` call itself is always paid. Read its live price right before the card:

   ```bash
   python3 scripts/mcp_client.py call beatra.models.list
   ```

   ```json
   {"capability": "audio_process"}
   ```

   See [music editing and audio](references/music-editing-and-audio.md) and [Story-to-song workflow](references/workflow.md).

## Before the connection is ready

When Allow is still pending at the end of a turn, finish and deliver
everything that needs no connection, in the format the user asked for:
the drafted title, lyrics, and production card. That free draft is what
this turn delivers. Say in one line that the paid step continues on their
next message after Allow. Do not fill the gap with another tool or
service.

## Paid changes, recovery, and cancellation

Song generation is one paid stage. Each extra deliverable (`beatra.music.edit`) and each audio finishing step (`beatra.audio.process`) offered after the user chooses a take, extra cover art included, is its own paid call on its own six-field card with its own live capability price (`music_cover_image`, `music_video`, `music_wav`, or `audio_process`) and its own `client_request_id`. Never call cover art, a cut, a fade, loudness normalization, looping, or format conversion free. A changed title, lyrics, production prompt, genre, mood, model, trim window, fade, or other control is new logical paid work with a new ID and fresh approval. Lyric revisions made before the single approved generation are free; regenerating or re-processing after a paid run with changed inputs is a new paid request.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

If the tool returns insufficient credits: give the user the tool message in
full. Do not change the URL. You may translate the other words. Do not replace
it with your own top-up copy. Point the user to pay using that message.

When the user asks how many credits remain, call `beatra.wallet.get`. When they
ask what was charged, call `beatra.wallet.ledger`. Both are read-only. Do not
invent an account-balance or top-up tool. Do not make `wallet.get` a required
step before every paid submit. When `beatra.models.list` returns a `top_up`
block, relay its tiers in the order listed without ranking them or picking one.

## References by task

- Read [Story-to-song workflow](references/workflow.md) when collecting a story brief, drafting lyrics and direction, checking live model facts, constructing exact song or audio-finishing payloads, polling, recovering, cancelling, or reviewing story accuracy and vocal result.
- Read [Music editing and audio](references/music-editing-and-audio.md) when the user wants extra cover art, a song video (MP4), a WAV version, or audio trimming, fades, loudness calibration, looping, and format conversion.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

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
