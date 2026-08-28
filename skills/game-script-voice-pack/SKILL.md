---
name: "game-script-voice-pack"
description: "Turn a murder-mystery or indie-game script into a labeled multi-character voice pack. This AI game voice pack and character dialogue studio casts one consistent voice per role, records every line in script order, and delivers numbered clips with character IDs ready for an engine or tabletop production. Use it for game voice acting, indie game dialogue, murder mystery voiceover, multi character TTS, NPC voice acting, interactive story audio, tabletop voice pack work, and scripted game audio."
---

# Game Script Voice Pack

Give a game or murder-mystery script a cast and a labeled voice pack. One
voice per character. Every line stays in script order.

## Scope and adjacent routes

Use this Skill when a murder-mystery script, indie-game dialogue tree,
interactive story, or training scene needs many speaking roles delivered as
importable clips.

Route a literary audio drama or radio play to `audio-drama-voice-studio`.
Route a single-narrator course to `course-narration-studio`. Route creating
only a reusable voice to `voice-cloning-studio`. Route a talking-head video
to `talking-avatar-video`.

## Inputs and defaults

The one hard input is the script text with speaker attribution. Character
labels alone are not a script: do not invent dialogue. Reuse genre, era,
tone, language, and already-chosen voices.

Defaults:

- one voice per named character, plus a narrator when the script has one;
- speaker order follows the script;
- `language` omitted unless the user asks for a language or the script
  mixes several;
- one synthesis call per speech block so a single line can be redone.

Casting is free. Each synthesis block is paid. Clone a character voice only
when the user asks. Confirm consent first: the user must state this is
their voice or that the speaker authorized this cloning use. Access to a
file is not consent. A suitable sample is currently about 10 to 300
seconds, no larger than 20 MiB, and clean single-speaker speech. Only
after consent, inspect the sample and upload it through the bundled
client. Show the live `voice_clone` admission card before any clone
`client_request_id`: route `voice_clone`, tool `beatra.voices.clone`, live
price for one successful activated voice, the provisional estimate, the
600-credit gift usually cannot start this clone,
`https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits. Do not
recommend ¥198. Do not offer a free clone. Do not create
`client_request_id` until the user confirms they have topped up or already
have enough credits. Submit `beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Character Name",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-character-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that
character's `voice_id`.

## Golden path

1. Build the cast sheet and the line ledger: character ID, line ID, text,
   and intended filename.
2. Call `beatra.voices.list` when a voice is still needed. Keep each
   character's `voice_id` fixed for the whole pack. Never put a display
   name in `voice`.
3. Read the live `text_to_speech` card with `beatra.models.list`. Confirm
   the cast, block count, weighted-character total, current estimate, and
   one `client_request_id` per block.
4. Synthesize each block with `beatra.speech.synthesize` exactly once
   through the bundled `scripts/mcp_client.py`. Poll each speech task with
   `beatra.tasks.get` until terminal. Do not configure a host
   Beatra Connector. Do not use REST/OpenAPI as a fallback.
5. Deliver numbered clips in script order, each labeled with character ID
   and line ID, plus actual duration, MIME type, URL or artifact, resolved
   model, and `billing.net_charged_credits`.
6. Review that each block carries the assigned voice and that order matches
   the script. Redo only the changed line.

## Decisions that require confirmation

Confirm the cast sheet and the pack estimate before the first paid call.
A changed line is one new paid block.

## Recovery

Recover a lost create response only with that block's identical payload
and ID. Recover a lost task ID through `beatra.tasks.list` and
`beatra.tasks.get`. Cancel only at the user's request. On
`insufficient_balance` for clone or TTS, keep
`https://console.beatra.ai/topup` exact and retry the same frozen ID only
after the user says they have topped up.

## References by task

- Read [Game voice-pack workflow](references/workflow.md) for cast sheets,
  line IDs, payloads, and review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
  for update controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.
Before ordinary commands it silently checks for a newer release at most once
every 24 hours per installation. Silent checks are enabled by default, and a
newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable
Beatra CDN path embedded for this package, channel, and locale. It verifies
the discovery data, archive, manifest, and every file's size and checksum
before replacement. It replaces only package-owned files and rejects
redirects, downgrades, wrong package/channel/locale/version data, unexpected
URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the user's original
command continues. An update failure never authorizes retrying a paid
generation. The automatic-update choice persists across later commands for
this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
