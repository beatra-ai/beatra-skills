---
name: "short-drama-voice-pack"
description: "Turn a vertical short-drama episode script into a labeled short drama voiceover pack with one consistent voice per role. This short drama dialogue studio and vertical short drama voiceover shop casts the episode, records every spoken line as labeled clips, and keeps those character voices through the episode so editors can place AI short drama voice and multi-character voiceover without recasting. Use it for short drama voice acting, episode dialogue audio, vertical drama TTS, micro drama voiceover, and serialized short-drama line clips."
---

# Short Drama Voice Pack

Give a vertical short-drama episode a cast and labeled line clips. One
voice per role. Deliver the spoken lines for that episode.

## Scope and adjacent routes

Use this Skill when a vertical short-drama episode needs dialogue audio
with one consistent voice per role and labeled clips the editor can place.

Route a radio play or literary audio drama to `audio-drama-voice-studio`.
Route a murder-mystery or game dialogue pack to `game-script-voice-pack`. Route video
shots to `ai-short-drama-shot-maker`. Route a personal cloned-voice series
to `voice-clone-series-studio`.

## Inputs and defaults

The one hard input is the episode script with speaker attribution. Role
names alone are not a script: do not invent dialogue. Reuse already-known
genre, language, tone, and voices.

Defaults:

- one voice per named role, plus a narrator when the episode has one;
- line order follows the episode script;
- `language` omitted unless the user asks for a language or the script
  mixes several;
- `model: "auto"` only when every voice-compatible live card supports the
  language; `format: "mp3"`; `speed: 1.0`;
- one synthesis call per speech block so a single line can be redone.

Keep each submitted `input` at or below 50,000 characters. Split on
sentence or section boundaries, never mid-sentence.

Planning and casting are free. Clone, if used, and each synthesis block
are paid.

Clone a role voice only when the user asks. Confirm consent first: the
user must state this is their voice or that the speaker authorized this
cloning use. Access to a file is not consent. A suitable sample is
currently about 10 to 300 seconds, no larger than 20 MiB, and clean
single-speaker speech. Only after consent, inspect the sample and upload
it through the bundled client. Show the live `voice_clone` admission card
before any clone `client_request_id`: route `voice_clone`, tool
`beatra.voices.clone`, live price for one successful activated voice,
the provisional estimate, the 600-credit gift usually cannot start this
clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits.
Do not recommend ¥198. Do not offer a free clone. Do not create
`client_request_id` until the user confirms they have topped up or already
have enough credits. Submit `beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Role Name",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-role-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that role's
`voice_id`.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the episode cast sheet and the line ledger: role ID, line ID,
   spoken text, and intended filename.
2. Call `beatra.voices.list` when a voice is still needed. Keep each
   role's `voice_id` fixed for the whole episode. Never put a display
   name in `voice`.
3. Read the live `text_to_speech` card with `beatra.models.list`. Confirm
   the voice cast, block count, weighted-character total, current
   estimate, and one `client_request_id` per block before the first paid
   TTS.
4. Synthesize each block with `beatra.speech.synthesize` exactly once.
   Poll each speech task with `beatra.tasks.get` until terminal.
5. Deliver numbered clips in script order, each labeled with role ID and
   line ID, plus actual duration, MIME type, URL or artifact, resolved
   model, and `billing.net_charged_credits`.
6. Review that each block carries the assigned voice and that order
   matches the episode. Redo only the changed line.

## Decisions that require confirmation

Confirm the voice cast and the episode estimate before the first paid
TTS. A changed line is one new paid block.

## Recovery

Recover a lost create response only with that block's identical frozen
payload and ID. A changed text is a new ID. Recover a lost task ID
through `beatra.tasks.list` and `beatra.tasks.get` before any resend.
Cancel only at the user's request. On `409`, keep polling the same task.
On `insufficient_balance` for clone or TTS, keep
`https://console.beatra.ai/topup` exact and retry the same frozen ID only
after the user says they have topped up.

## References by task

- Read [Short-drama voice-pack workflow](references/workflow.md) for
  ledgers, payloads, and review.
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
