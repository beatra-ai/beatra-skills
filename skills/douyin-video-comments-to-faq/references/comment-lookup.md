# Douyin comment lookup

Comments normally come from the seller. This route exists when they
give a public Douyin post link and this connection can read it.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted lines.

This package uses only these operations:

- `social.douyin.video.get_by_url`
- `social.douyin.video.comments.list`

If the platform has no comment operation in this list, it has no lookup.

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments
   and the credit price, and copy the `schema_hash` it just returned.
3. Show the six-field lookup production card, then call
   `beatra.social.execute` once with `operation_key`, that
   `schema_hash`, `arguments`, and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal. Report the returned
   payload, task ID, terminal status, and `billing.net_charged_credits`.
   A lookup has no model, dimensions, or duration to report.

One `execute` is one prepaid lookup. The next page of results is
another `execute` and another charge. Never page automatically.

Public social lookup has no `model` field. On a failed lookup keep
`error.code` and read the platform wording in `error.message`. Do not
call `beatra.models.list` for a lookup. Do not show `schema_hash` to
the seller.

## Arguments from a Douyin link

Never ask for an internal ID the seller would have to go find.

A share link is `share_url` on the video get. That resolve is one
prepaid `execute`. Comments take `aweme_id` from that payload or from
a `/video/<id>` path and are a second prepaid `execute`. Do not pass
the share URL to the comments list.

Do not call `social.douyin.comment.replies.list` or
`social.douyin.video.search`.

A confirmed lookup does not authorize generate, transform, or edit.
