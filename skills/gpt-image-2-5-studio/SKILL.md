---
name: "gpt-image-2-5-studio"
description: "Create one GPT Image 2.5 still from a written brief or from one to four reference images. GPT Image 2.5 Studio uses GPT-Image-2.5 Flare (gpt-image-2.5-flare) or GPT-Image-2.5 Sunburst (gpt-image-2.5-sunburst) for ChatGPT Images 2.5 text to image and reference-guided pictures. Make posters, product stills, infographics, social crops, and campaign frames with readable on-image type."
---

# GPT Image 2.5 Studio

Make one GPT Image 2.5 still from the creator's actual starting point.
Pin the model to GPT Image 2.5. Do not send `auto`. Reuse decisions
already in the conversation. Ask only when a missing input changes the
route or the paid result.

## What you get

- One still per confirmed call.
- Default canvas 2K square unless the destination needs another ratio.
- On-image type, faces, products, and logos treated as must-keeps.

## Ways to run it

| Starting point | Tool | Capability |
| --- | --- | --- |
| A written brief, no source image | `beatra.images.generate` | `text_to_image` |
| One to four ordered reference images | `beatra.images.transform` | `image_to_image` |

Use [GPT Image 2.5 workflow](references/workflow.md) for payloads. Do
not call `beatra.images.edit`. A later focused change is a new transform
or generate after delivery.

## Inputs and defaults

The hard input is a nonblank visual direction. Transform also needs one
to four accessible reference images. Do not invent a scene, product, or
reference to skip the ask. Reuse destination, subject, on-image wording,
style, must-keeps, canvas, and the named GPT Image 2.5 SKU.

Default `model` to `gpt-image-2.5-flare`. Use `gpt-image-2.5-sunburst`
only when the creator names Sunburst, finest quality, or identity-heavy
reference work. Never switch the SKU silently.

Default `count` to `1` and `output_relationship` to `independent`.
Default canvas to a 2K `1:1` preset. Change aspect when the destination
needs 16:9, 9:16, 7:3, or another live GPT Image 2.5 ratio. Send `4K`
only when the creator names 4K.

Inspect every local source before upload. Upload is transport, not
inspection:

```text
python3 scripts/mcp_client.py upload ./reference.png --mime-type image/png
```

## Golden path

1. Classify generate versus transform. Write a compact brief: message,
   subject, composition, style, on-image wording, must-keeps, canvas,
   and Flare or Sunburst. Name each reference's role in order.
2. That labeled brief is the free visible result. Planning is not
   approval.
3. Call `beatra.models.list` for the selected capability and read the
   live card — prompt limits, source count, canvas, and price — before
   freezing the paid payload:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

   Transform uses `{"capability": "image_to_image"}` the same way. See
   [GPT Image 2.5 workflow](references/workflow.md).
4. Show the six-field production card and wait. After approval, mint
   one opaque `client_request_id` and submit once through bundled
   `scripts/mcp_client.py`.
5. Poll `beatra.tasks.get`. Deliver actual bytes, dimensions, the
   terminal model, and `billing.net_charged_credits`. Review on-image
   type and must-keeps, then offer at most one unexecuted follow-up.

## Decisions that require confirmation

Planning, labeled briefs, and live price quotes are free. They are not
approval.

Before every paid call (`beatra.images.generate` or
`beatra.images.transform`), show a current production card and wait:

1. Work — what will be made, in the user's words, and that this is a
   generate or transform call.
2. Credits — the live price just read from the model card. Do not reuse
   a remembered number.
3. Count — one paid call this turn. Each still is one call.
4. Identity — one new opaque `client_request_id` per call. If prompt,
   file, model, or controls change, mint a new ID. Never reuse an ID
   for different arguments.
5. If we stop here — the labeled brief remains usable.
6. If the balance is insufficient — relay the official message and its
   top-up URL exactly. Translate the prose; keep the URL. Do not retry
   until the user says they have topped up.

Submit once through bundled `scripts/mcp_client.py`. Poll
`beatra.tasks.get`. Deliver actual bytes plus
`billing.net_charged_credits`. Do not promise the prepaid estimate is
the final charge.

A "one approval covers retries" request is refused. Silent `auto` is
refused.

## Execution

Invoke every remote Beatra operation only through this package's bundled
`scripts/mcp_client.py`. Put the MCP tool name after `call` and send one
JSON object on standard input. Do not configure or call a host Beatra
Connector, and do not use REST/OpenAPI as a fallback.

```text
printf '%s' '{"prompt":"A matte red cube on a white studio table, no extra props.","model":"gpt-image-2.5-flare","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"output_relationship":"independent","client_request_id":"opaque-gpt25-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

## Review, deliver, and recover

Review readable on-image type, subject identity, composition, and
destination fit. Report only what the host can see.

After a returned `task_id`, poll that task. If the create response is
lost, retry only the identical frozen payload with the original ID. If
the task ID is missing, use `beatra.tasks.list` and verify candidates
with `beatra.tasks.get` before another submit. Use `beatra.tasks.cancel`
only when the creator asks. A changed prompt, file, model, or canvas is
new paid work with a new card and ID.

If the tool returns insufficient credits: give the user the tool message in
full. Do not change the URL. You may translate the other words. Do not replace
it with your own top-up copy. Point the user to pay using that message.

## Account balance

When the user asks how many credits remain or whether a live estimate
fits, call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an
account-balance or top-up tool. Do not make `wallet.get` a required step
before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers
as the card lists them and in that order. Do not rank them, do not talk
one down, and do not pick one for the user. Never quote a tier from
memory.

## References by task

- Payloads, transform JSON, polling, and recovery:
  [GPT Image 2.5 workflow](references/workflow.md)
- Authorization and registration:
  [installation and authentication](references/installation-and-auth.md),
  [installation registration](references/installation-registration.md)
- Shared task and billing details: [tasks and results](references/tasks-and-results.md),
  [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Connection help: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Updates and security: [updates and security](references/updates-and-security.md)
- Removal: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
