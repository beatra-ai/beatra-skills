---
name: "tiktok-comment-reply-voice"
description: "Turn public TikTok comments into one spoken reply clip per written line. This TikTok comment reply voice studio reads the comments on a finished post, then records each TikTok comment reply from the reply lines you already wrote. Operators use it when they need TikTok comment replies as a comment reply voice pack, or spoken comment replies they can import one file at a time."
---

# TikTok Comment Reply Voice

Turn public TikTok comments into one spoken reply clip per written
line. Deliver 8 to 20 reads. Cover the opening thanks first.

## Scope and adjacent routes

Use this Skill when an operator needs spoken TikTok comment replies
they can import into a player.

Route a VOC memo to `comment-voc-miner`. Route a talking-head clip to
`tiktok-comment-to-talking-clip`. Route quote-reply stills to
`stitch-prompt-card`.

This package reads a TikTok video and comments, then speaks the
written replies. It does not post a reply on TikTok, and it does not
animate a clip. If this connection has no TikTok lookup, work from
pasted lines only.

## Collect the comments and replies

Hard inputs are:

- either a public TikTok share URL the host can open, or the comments
  already copied;
- the reply lines the operator already wrote;
- a pronunciation table whenever names or place words appear;
- how many clips the pack should contain, or permission to use the
  default of 10;
- likeness and voice rights when a cloned voice will appear.

Reuse already-known language and a frozen `voice_id`. Ask only for a
missing hard input. A count outside 8 to 20 is still doable: confirm
that pack size and its live cost.

Do not invent a comment, a username, a like count, or a reply. File
access is not consent.

If names exist and the pronunciation table is empty, stop and collect
the readings.

A talking clip is a different job. Keep this pack on spoken files.

## Plan the free listen list

Write a labeled original-words list and term table before any paid
lookup, clone, or speech. Default ten slots unless the operator names
another count in 8 to 20: opening thanks, first question, shipping,
size, refund, restock, pin reply, late comment, thank-you, and close.
Each slot records the sourced comment, the written reply line, and
whether it uses a catalog voice or a clone. Leave a missing reply off
the paid list.

That list is the free visible result from whatever the operator
already pasted. Planning is not approval.

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

## Look up the video and comments on their own cards

A share URL does not authorize a lookup. When the operator wants this
connection to read a public TikTok post, follow
[comment lookup](references/comment-lookup.md). Search, inspect, then
show a six-field lookup card for each prepaid execute and wait.

Video get and comments list are separate lookups. The next comments
page is another charge.

1. Work — one public TikTok video get or one comments page
   (`beatra.social.execute` with the inspected `operation_key`).
2. Credits — the live price `beatra.social.tools.get` just returned.
   Quote that live number, not a remembered one.
3. Count — one prepaid lookup. The next page is another charge.
4. Identity — one new opaque `client_request_id` per execute.
5. If we stop here — the pasted listen list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

This package uses only `social.tiktok.video.get_by_url` and
`social.tiktok.video.comments.list`. Do not show `schema_hash` to the
operator. A confirmed lookup does not authorize clone or speech.

## Confirm clone, then speech

Clone and speech are separate paid stages. Each stage gets its own
six-field card and its own opaque `client_request_id`.

If the operator wants a cloned voice, inspect an authorized sample,
read the live `voice_clone` card, and wait on the clone card before
`beatra.voices.clone`. A found file is not clone consent. Show the
clone card and wait:

1. Work — one authorized voice sample (`beatra.voices.clone`).
2. Credits — the live `voice_clone` price just read. Do not reuse a
   remembered number.
3. Count — one paid clone call for this sample.
4. Identity — one new opaque `client_request_id`.
5. If we stop here — the labeled listen list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

Before speech, call `beatra.models.list` for `text_to_speech`:

```json
{"capability": "text_to_speech"}
```

Use `beatra.voices.list` when a catalog voice still needs a choice.
Never put a display name in `voice`. Show the speech card and wait:

1. Work — one spoken reply per named slot
   (`beatra.speech.synthesize`).
2. Credits — the live `text_to_speech` price just read, times the
   slot count. Do not reuse a remembered number.
3. Count — one paid speech call per slot.
4. Identity — one new opaque `client_request_id` per slot.
5. If we stop here — the labeled listen list remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

Submit each speech slot once through bundled `scripts/mcp_client.py`.
Poll `beatra.tasks.get`. Read actual audio MIME, duration, and size,
and `billing.net_charged_credits`. Do not promise the prepaid
estimate is the final charge. A script preview is not the audio
review.

## Review, deliver, and recover

Review that every clip uses the same voice and that names match the
pronunciation table and the written reply list. Report only what the
host can actually hear.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed comment, reply, voice, or speed
is a new card and a new ID. Cancel only when the operator asks.

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
printf '%s' '{"query":"comments","platform":"tiktok","capability_family":"comments"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

```text
printf '%s' '{"input":"<the written reply for this slot>","voice":"voice_...","format":"mp3","client_request_id":"opaque-tiktok-reply-speech-01"}' | python3 scripts/mcp_client.py call beatra.speech.synthesize
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For listen lists, lookup, payloads, and recovery, read
  [TikTok comment reply workflow](references/workflow.md) and
  [comment lookup](references/comment-lookup.md).
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
a paid lookup, clone, or speech request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
