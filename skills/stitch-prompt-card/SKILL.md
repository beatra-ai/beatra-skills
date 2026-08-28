---
name: "stitch-prompt-card"
description: "Turn a public TikTok stitch target into one quote reply card per chosen hook. This stitch prompt card studio reads the quoted video and comments, then makes quote reply stills from the reply lines you already wrote. Use it for quote reply cards, stitch prompt cards, and TikTok quote reply stills."
---

# Stitch Prompt Card

Turn a public TikTok stitch target into one quote reply card per
chosen hook. Deliver 1 to 6 stills. Cover the opening hook first.

## Scope and adjacent routes

Use this Skill when an operator needs quote reply cards for a TikTok
stitch or quote post, not a stitched clip.

Route pin screenshot stills to `comment-pin-card`. Route a spoken
script to `tiktok-script-studio`. Route Douyin FAQ stills to
`douyin-video-comments-to-faq`.

This package reads a TikTok video and comments, then makes stills. It
does not stitch or animate a clip, and it does not post a reply on
TikTok. If this connection has no TikTok lookup, work from pasted
lines only.

## Collect the quote and reply

Hard inputs are:

- either a public TikTok share URL the host can open, or the caption
  and comments already copied;
- the reply lines the operator already wrote;
- how many cards the pack should contain, or permission to use the
  default of 4.

Reuse already-known language and brand look. Ask only for a missing
hard input. A count outside 1 to 6 is still doable: confirm that pack
size and its live cost.

Do not invent a caption, a comment, a username, a like count, or a
reply. File access is not consent.

Inspect every still the operator supplies. Record MIME type, width,
height, aspect ratio, byte size, and whether it has an alpha channel.
For a local file, upload only through the bundled client after
inspection (`scripts/mcp_client.py` / `beatra.assets.upload`). Keep
the returned artifact id. Never pass a local path to
`beatra.images.generate`.

## Plan the free cover list

Write a labeled quote-reply cover plan before any paid lookup or
image. Default four slots unless the operator names another count in
1 to 6. Each slot records the quoted caption or comment, the written
reply line, layout, canvas, and whether a brand still drives the look.
Leave a missing reply off the paid list.

That list is the free visible result from whatever the operator
already pasted. Planning is not approval.

Safe defaults:

- one `beatra.images.generate` call per slot;
- `model: "auto"` unless the operator chose a live SKU;
- `count` 1 per slot;
- 9:16 2K unless the operator named another destination ratio.

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
5. If we stop here — the pasted cover plan remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

This package uses only `social.tiktok.video.get_by_url` and
`social.tiktok.video.comments.list`. Do not show `schema_hash` to the
operator. A confirmed lookup does not authorize generate.

## Confirm generate separately

Before any billable image, read the current `beatra.models.list` card
for `text_to_image`:

```json
{"capability": "text_to_image"}
```

Keep `model` as `auto` and `count` at `1` per card. Show one current
generate production card and wait:

1. Work — one quote reply still per chosen hook
   (`beatra.images.generate`).
2. Credits — the live `text_to_image` price just read. Do not reuse a
   remembered number.
3. Count — one paid call per card. Do not batch hooks into one
   `count`.
4. Identity — one new opaque `client_request_id` per card. A changed
   quote, reply, prompt, file, model, or canvas mints a new ID.
5. If we stop here — the labeled cover plan remains usable.
6. If the balance is insufficient — relay the official message and
   its top-up URL exactly
   (`https://console.beatra.ai/wallet?intent=buy`). Translate the
   prose; keep the URL. Do not retry until the operator says they
   have topped up. Do not recommend ¥198.

A confirmed lookup does not authorize generate. Submit once through
bundled `scripts/mcp_client.py`. Poll `beatra.tasks.get`. Deliver
actual bytes plus `billing.net_charged_credits`.

## Review, deliver, and recover

Review printed words against the chosen caption, comments, and written
reply lines. Report only the text the host can actually see.

After a returned `task_id`, poll that task. If the create response is
lost, search with `beatra.tasks.list` and verify with
`beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. Cancel only when the operator asks.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input.

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

```text
printf '%s' '{"query":"comments","platform":"tiktok","capability_family":"comments"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector, and do not use
REST/OpenAPI as a fallback.

## References by task

- For cover lists, lookup, generate payloads, and recovery, read
  [Stitch prompt workflow](references/workflow.md) and
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
a paid lookup or image request. The setting persists for this
installation. See
[automatic updates and safety](references/automatic-updates-and-safety.md).

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
