# Parent FAQ still workflow

## Slot list

Write one slot per user-picked parent question before any paid
call. Default four slots unless the user names another count in 4
to 8. Each slot names the original parent question wording, the
printed answer line from confirmed teaching facts, layout, and canvas.
Do not invent a parent question, username, score, or answer line. The
labeled list is the free artifact. It is not approval.

If the user wants this connection to read a public Xiaohongshu
note or search, follow [parent FAQ lookup](parent-faq-lookup.md) on its
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
printf '%s' '{"prompt":"Create the approved answer still for the named parent FAQ question. Print only the confirmed teaching-fact line. Do not print a score.","model":"auto","count":1,"canvas":{"type":"preset","tier":"2K","aspect":"1:1"},"client_request_id":"opaque-parent-faq-01"}' | python3 scripts/mcp_client.py call beatra.images.generate
```

## Review and recovery

Review that each still prints the picked parent question and only the
confirmed answer line. After a returned `task_id`, poll that task.
If the create response is lost, search with `beatra.tasks.list` and
verify with `beatra.tasks.get` before replay. Reuse an ID only with
byte-identical arguments. A changed parent question, answer line, still,
model, or canvas is a new card and a new ID.
