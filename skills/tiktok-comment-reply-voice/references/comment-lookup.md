# Comment lookup

Comments normally come from the operator. This route exists when they
give a public TikTok share URL and this connection can read it.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted lines.

This package uses only these operations:

- `social.tiktok.video.get_by_url`
- `social.tiktok.video.comments.list`

If TikTok has no comment operation on this connection, it has no lookup.

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments
   and the credit price, and copy the `schema_hash` it just returned.
3. Show the six-field lookup production card, then call
   `beatra.social.execute` once with `operation_key`, that
   `schema_hash`, `arguments`, and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.

One `execute` is one prepaid lookup. Video get and comments list are
separate executes. The next page of comments is another `execute` and
another charge. Never page automatically.

Public social lookup has no `model` field. On a failed lookup keep
`error.code` and read the platform wording in `error.message`. Do not
call `beatra.models.list` for a lookup. Do not show `schema_hash` to
the operator.

## Arguments from a link

Never ask for an internal ID the operator would have to go find.

A TikTok share link is `share_url` on `social.tiktok.video.get_by_url`.
Comments take `aweme_id` from that payload or from a `/video/<id>`
path. Do not pass the share URL to the comments list.

A confirmed lookup does not authorize clone or speech.
