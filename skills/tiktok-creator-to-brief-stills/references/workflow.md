# Collaboration brief still workflow

## Memo and still list

Write one slot per user-picked collab term before any paid call.
Default six slots unless the user names another count in 4 to 8.
Each slot names the creator fact it uses, the printed collab term
from operator-supplied copy, layout, and canvas. Do not invent a
handle, count, or collab term. The labeled memo and list are the
free artifact. They are not approval.

If the user wants this connection to read a public TikTok profile
or recent works, follow [creator lookup](creator-lookup.md) on its
own card first.

For a local brand still, upload only through the bundled client
(`scripts/mcp_client.py` / `beatra.assets.upload`) and keep the
returned artifact id. Never pass a local path to
`beatra.images.generate`, `beatra.images.transform`, or
`beatra.images.edit`.

## Image admission

Call `beatra.models.list` with `{"capability":"text_to_image"}`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_image"}
```

Show the generate production card, then submit once per slot with
`count` 1. A brand-still look uses a separate `image_to_image` card.
A local correction after accept uses a separate `image_edit` card
with the accepted image as `images[0]`.

Poll `beatra.tasks.get` until terminal. Read actual MIME, dimensions,
size, and `billing.net_charged_credits`. Keep
`https://console.beatra.ai/wallet?intent=buy` exact. Do not recommend
¥198.

```text
printf '%s' '{"prompt":"Create the approved collaboration brief still for the named creator term. Print only the operator-supplied collab line.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-tiktok-brief-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

## Review and recovery

Review that each still prints the picked creator fact and only the
operator-supplied collab term. After a returned `task_id`, poll that
task. If the create response is lost, search with `beatra.tasks.list`
and verify with `beatra.tasks.get` before replay. Reuse an ID only
with byte-identical arguments. A changed creator fact, collab term,
still, model, or canvas is a new card and a new ID.
