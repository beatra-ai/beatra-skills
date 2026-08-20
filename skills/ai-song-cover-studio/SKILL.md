---
name: "ai-song-cover-studio"
description: "Turn a song recording into a newly interpreted cover or rearranged song from a reference performance and a fresh genre, arrangement, and vocal direction. This AI song cover studio and reference-audio cover generator reinterprets a classic song as rock, acoustic, folk, jazz, Chinese-style, ballad, or a new vocal character, and reviews recognizable reference influence, arrangement freshness, vocal delivery, lyrics, pronunciation, and structure. Use it for classic-song reinterpretation, genre swaps, creator demos, tribute performances, and personal practice recordings, with one cover generation per run and honest post-result review."
---

# AI Song Cover Studio

Turn one accessible song recording into a newly interpreted cover or rearranged song. Use this Skill when the user already has a reference song and asks for a cover, classic-song reinterpretation, genre change, acoustic version, rock version, Chinese-style arrangement, a fresh vocal or performance direction, or a reimagined arrangement of an existing track.

## Scope and adjacent routes

The normal route is one reference song recording, one reinterpretation direction, and one new cover. Route a request that starts with a story and no finished lyrics or song to a personalized-song workflow; a request that begins with finished lyrics to a lyrics-to-song workflow; and a request that begins with finished music and needs visuals to a music-video workflow. Keep this route focused on whole-song reinterpretation of one reference recording.

## Inputs and defaults

The hard inputs are:

- one accessible reference song recording (FLAC, MP3, or WAV) the host Agent can inspect;
- the desired reinterpretation direction — a genre change, new arrangement, fresh vocal character, or reimagined mood.

Ask only for a missing hard input. Reuse the known language, mood, instrumentation, vocal character, and must-keep details. Beatra has no lyrics-transcription step: any lyric text that must be preserved accurately must be supplied and approved by the user before generation.

For a local reference file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./reference-song.mp3 --mime-type audio/mpeg
```

Upload is transport, not creative review. Retain the returned artifact reference and never pass a local path to a remote tool.

Prepare a short production card before any paid call: song identity, language, mood, target genre, energy, instrumentation, vocal character, must-keep lyrical details, and the desired degree of reinterpretation. Default to one cover generation and `model: "auto"`. Build one positive reinterpretation instruction that states the single dominant creative change this run should deliver.

## Golden path

1. Inspect the reference recording. Record its actual MIME type, format, duration, and byte size. Identify the song identity, language, mood, genre, energy, instrumentation, vocal character, source-audio intent, and the requested reinterpretation direction.
2. Build a production card: song identity, language, mood, target genre, energy, instrumentation, vocal character, must-keep lyrical details, and desired degree of reinterpretation. Then write one positive reinterpretation instruction that states the single dominant creative change.
3. Call `beatra.models.list` with `{"capability":"reference_audio_to_music"}` to confirm a current card admits the reference recording's actual MIME type, format, duration, and byte size. Confirm the live duration and byte-size limits, the accepted reference-audio route, and the price basis. Keep the model at `auto` unless the user chose a concrete eligible model or the requested route requires an explicit model family.
4. Route the reinterpretation explicitly and show the user the exact route, reference recording, production prompt, lyrics and title when supplied, model behavior, and paid boundary:
   - vocal reinterpretation without supplied lyrics: use a supported reference-audio card and a concise production prompt; do not claim exact lyric preservation;
   - vocal reinterpretation with user-supplied lyrics: the current `auto` reference route requires a 10–300-character prompt; supplied lyrics must contain 10–1000 characters and require a nonempty title;
   - instrumental reinterpretation: do not use `model: "auto"`; select an explicit live model family that affirmatively supports this combination;
   - model-family controls: send only controls published by the chosen live family and never mix family-specific options.
5. Freeze the route, reference recording, production prompt, lyrics and title when supplied, model, and paid boundary with one opaque stable `client_request_id`; then submit one `beatra.music.generate` call exactly once. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"reference_audio":{"type":"artifact","artifact_id":"art_reference"},"prompt":"Reimagine this ballad as an upbeat acoustic folk cover with warm vocals and a lighter, brighter arrangement.","client_request_id":"opaque-cover-id"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.music.generate` exactly once.
6. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned audio artifact or link. Report only actual returned task status, resolved model, duration, usage, and `billing.net_charged_credits`. Review accessible output for recognizable reference influence, freshness of arrangement, vocal delivery, lyrics, pronunciation, structure, and actual duration. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

A cover is one paid stage. A revised reference recording, production prompt, supplied lyrics or title, genre, arrangement, vocal direction, model, or control is new logical paid work with a new ID and fresh approval.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Song cover workflow](references/workflow.md) when building a production card, choosing the reference-audio route, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing arrangement and vocal results.
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
