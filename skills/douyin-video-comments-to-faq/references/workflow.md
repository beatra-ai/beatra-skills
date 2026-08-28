# Douyin comment FAQ workflow

## Slot list

Write one slot per seller-picked comment question before any paid call.
Default four slots unless the seller names another count in 4 to 8.
Each slot names the original comment wording, the printed answer from
confirmed listing facts, layout, and canvas. Do not invent a comment,
username, or answer. The labeled list is the free artifact. It is not
approval.

If the seller wants this connection to read a public Douyin post,
follow [comment lookup](comment-lookup.md) on its own card first.

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

## Review and recovery

Review that each still prints the picked question and only the
confirmed answer. After a returned `task_id`, poll that task. If the
create response is lost, search with `beatra.tasks.list` and verify
with `beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed question, answer, still, model,
or canvas is a new card and a new ID.
