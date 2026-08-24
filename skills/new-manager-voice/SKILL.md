---
name: "new-manager-voice"
description: "Turn a written first-week checklist into one new manager week voice clip per labeled cue. This first week voice pack studio records each new manager voice and first week checklist audio from the list the office already wrote, then delivers 8 to 20 new manager week clip files. Use it for manager onboarding voice packs that keep one cue on each clip."
---

# New Manager Week Voice Pack

Turn a written first-week checklist into one spoken clip per labeled
cue. Deliver 8 to 20 reads. Cover welcome, people, and the written
tasks first.

## Scope and adjacent routes

Use this Skill when a desk needs labeled first-week clips from the
checklist they already wrote.

Route generic narration to `voiceover-narration-studio`. Route a
homeroom week list to `homeroom-week-voice`. Route a grid notice
list to `grid-notice-voice`. Route an incident brief to
`incident-brief-voice`.

Read only the supplied first-week checklist. Do not write a
performance conclusion, a grade, or a fitness-to-lead line.

## Collect the first-week list

Hard inputs are:

- the first-week checklist the office already wrote;
- a pronunciation table whenever names, places, or coined words
  appear;
- how many clips the pack should contain, or permission to use the
  default of 10;
- likeness and voice rights when a cloned staff voice will appear.

Reuse already-known language and a frozen `voice_id`. Ask only for a
missing hard input. A count outside 8 to 20 is still doable: confirm
that pack size and its live cost.

Do not write a performance conclusion, a grade, or a fitness-to-lead
line. File access is not consent.

If names exist and the pronunciation table is empty, stop and collect
the readings.

## Plan the free slot list

Write a labeled first-week voice list before any paid clone or
speech. Default ten slots unless the desk names another count in
8 to 20: welcome, team, tools, meetings, people, sites, contacts,
deadlines, reminder, and follow-up. Each slot records the spoken
line from the written checklist and whether it uses a catalog voice
or a clone.

That list is the free visible result. Planning is not approval.

Safe defaults:

- one `beatra.speech.synthesize` call per slot;
- `model: "auto"` only when every live speech card supports the
  language;
- `format: "mp3"`; `speed: 1.0`;
- one brand voice for the whole pack.

Keep each submitted `input` at or below 50,000 characters. Split on
sentence boundaries. Write short spoken sentences from the list.

Inspect an authorized clone sample when clone is requested. For a
local file, upload only through the bundled client after inspection
(`scripts/mcp_client.py` / `beatra.assets.upload`). Keep the returned
artifact id. Never pass a local path to `beatra.voices.clone` or
`beatra.speech.synthesize`.

## Confirm clone, then speech

Clone and speech are separate paid stages. Each stage gets its own
six-field card and its own opaque `client_request_id`.

If the desk wants a cloned staff voice, inspect an authorized
sample, read the live `voice_clone` card, and wait on the clone card
before `beatra.voices.clone`. A found file is not clone consent. Show
the clone card and wait:

1. Work — one authorized voice sample (`beatra.voices.clone`).
2. Credits — the live `voice_clone` price just read. Do not reuse a
   remembered number.
3. Count — one paid clone call for this sample.
4. Identity — one new opaque `client_request_id`.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the desk says they have
   topped up. Do not recommend ¥198.

Before speech, call `beatra.models.list` for `text_to_speech`:

```json
{"capability": "text_to_speech"}
```

Use `beatra.voices.list` when a catalog voice still needs a choice.
Never put a display name in `voice`. Show the speech card and wait:

1. Work — one spoken first-week cue per named slot
   (`beatra.speech.synthesize`).
2. Credits — the live `text_to_speech` price just read, times the
   slot count. Do not reuse a remembered number.
3. Count — one paid speech call per slot.
4. Identity — one new opaque `client_request_id` per slot.
5. If we stop here — the labeled slot list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the desk says they have
   topped up. Do not recommend ¥198.

Submit each speech slot once through bundled `scripts/mcp_client.py`.
Poll `beatra.tasks.get`. Read actual audio MIME, duration, and size,
and `billing.net_charged_credits`. Do not promise the prepaid
estimate is the final charge. A script preview is not the audio
review.

## Review, deliver, and recover

Review that every clip uses the same voice and that names match the
pronunciation table and the written first-week checklist. Report only
what the host can actually hear. Do not write a performance
conclusion or a grade.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed line, voice, or speed is a new
card and a new ID. Cancel only when the desk asks.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

```text
printf '%s' '{"input":"<the written line for this slot>","voice":"voice_...","format":"mp3","client_request_id":"opaque-manager-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For slot lists, payloads, and recovery, read
  [New manager week voice workflow](references/workflow.md).
- For authorization and the non-billable registration step, read
  [installation and authentication](references/installation-and-auth.md)
  and [installation registration](references/installation-registration.md).
- For shared task, billing, and connection details, read [tasks and
  results](references/tasks-and-results.md), [billing, errors, and
  recovery](references/billing-errors-and-recovery.md), and [Bundled MCP
  Client diagnostics](references/mcp-connection.md).
- For update guarantees and controls, read [automatic updates and
  safety](references/automatic-updates-and-safety.md). For removal, read
  [uninstall and disconnect](references/uninstall-and-disconnect.md).

## Runtime and safe automatic updates

The bundled client silently checks for a newer release at most once
every 24 hours per installation. When a newer version is available, it
installs automatically without separate confirmation. It downloads only
from the fixed official Beatra discovery and immutable CDN paths for
this package, channel, and locale, verifies discovery data, archive,
manifest, and every packaged file, and replaces only package-owned
files.

Update checks, downloads, verification, replacement, rollback, and
recovery fail open: the current installation remains usable and the
original command continues. An update failure never authorizes retrying
a paid clone or speech request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
