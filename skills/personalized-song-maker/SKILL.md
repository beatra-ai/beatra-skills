---
name: "personalized-song-maker"
description: "Turn a person's story and occasion into original lyrics and a newly generated song. This personalized song maker and custom song generator workflow collects the recipient, relationship, occasion, memories, and must-include details, drafts the title, lyrics, section structure, genre, and mood for approval, then generates one finished original song, and reviews story accuracy, name pronunciation, hook, lyric rendering, and vocal result. Use it for custom birthday songs, wedding songs, anniversary songs, proposal songs, family tribute songs, and company or team anthems, with one approved lyric draft and one song generation per run and honest post-result review."
---

# Personalized Song Maker

Transform a person's story, occasion, and must-include details into original lyrics and a newly generated song. Use this Skill for a custom birthday song, wedding song, anniversary song, confession or proposal song, family tribute, baby growth song, pet memorial song, team anthem, company song, or a song gift.

## Scope and adjacent routes

The normal route is one story brief, one approved lyric draft, and one finished original song. Route a finished lyric that only needs a song to a lyrics-to-song workflow; a reference song recording that needs reinterpretation to the ai-song-cover-studio workflow; and finished music that needs visuals to the music-video-clip workflow. Keep this route focused on story-to-lyrics-to-song. The broad music creator remains the fallback for mixed or uncertain music requests.

## Inputs and defaults

The hard inputs are:

- an occasion;
- a recipient or audience;
- true story details worth turning into the song;
- names or phrases that must appear;
- a language for the song;
- an emotional direction;
- any private details to omit.

Ask only for a missing hard input. Reuse the known genre, mood, instrumentation, tempo feel, and vocal direction preferences. Lyrics writing, title drafting, section planning, and creative direction are free preparation; only the music generation is paid.

## Golden path

1. Collect the intake. Record the occasion, recipient, relationship, protagonist, turning point, memorable details, names or phrases that must appear, language, emotional direction, must-include facts, and private details to omit. Build a story map: protagonist, relationship, turning point, memorable details, core message, hook, emotional arc, and ending.
2. Draft the creative direction for free. Write a title, full lyrics with section structure, and a production card: genre, mood, instrumentation, tempo feel, and vocal direction. Show the user the must-keep facts and the lyric draft for approval before any paid call. Revise the lyrics and direction until the user approves them; this revision is free.
3. Call `beatra.models.list` with `{"capability":"text_to_music"}` to inspect the current music catalog. Confirm the live prompt, lyrics, and title character limits, supported languages, controls, and price basis. Keep the model at `auto` unless the user chose a concrete eligible model. Numeric estimates are provisional and require live catalog facts.
4. Freeze the approved title, approved lyrics, production prompt, model behavior, and one opaque stable `client_request_id`. Show the exact paid boundary: one song generation from the approved inputs. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"prompt":"Warm acoustic pop, gentle guitar and piano, heartfelt mid-tempo vocal delivery.","lyrics":"[Verse 1]\n...approved lyrics...\n[Chorus]\n...approved lyrics...","title":"Approved Title","client_request_id":"opaque-song-id"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.music.generate` exactly once.
5. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned audio artifact or link, and report only actual returned task status, resolved model, clip count, duration, usage, and `billing.net_charged_credits`. Review accessible output for story accuracy, name pronunciation, hook, lyric rendering, emotion, arrangement, vocal result, audio quality, and duration. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

Song generation is one paid stage. A changed title, lyrics, production prompt, genre, mood, model, or control is new logical paid work with a new ID and fresh approval. Lyric revisions made before the single approved generation are free; regenerating after a paid run with changed inputs is a new paid request.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Story-to-song workflow](references/workflow.md) when collecting a story brief, drafting lyrics and direction, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing story accuracy and vocal result.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md) for update guarantees and controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation. Before ordinary commands it silently checks for a newer release at most once every 24 hours per installation. Silent checks are enabled by default, and a newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable Beatra CDN path embedded for this package, channel, and locale. It verifies the discovery data, archive, manifest, and every file's size and checksum before replacement. It replaces only package-owned files and rejects redirects, downgrades, wrong package/channel/locale/version data, unexpected URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery fail open: the current installation remains usable and the user's original command continues. An update failure never authorizes retrying a paid generation. The automatic-update choice persists across later commands for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files.
