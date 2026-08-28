# Douyin hot-search lookup

Topics normally come from the seller. This route exists when they want
this connection to read the current public Douyin hot-search board.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted topics.

This package uses only these operations:

- `social.douyin.hot_search.list`

If the platform has no hot-search operation in this list, it has no
lookup.

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments
   and the credit price, and copy the `schema_hash` it just returned.
3. Show the six-field lookup production card, then call
   `beatra.social.execute` once with `operation_key`, that
   `schema_hash`, `arguments`, and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal. Report the returned
   payload, task ID, terminal status, and `billing.net_charged_credits`.
   A lookup has no model, dimensions, or duration to report.

One `execute` is one prepaid lookup. This board read is not paginated.
A different board type is another `execute` and another charge. Never
page automatically. Do not ask the seller for an internal board id;
use the live argument defaults `tools.get` just returned unless they
named a board already in the conversation.

Public social lookup has no `model` field. On a failed lookup keep
`error.code` and read the platform wording in `error.message`. Do not
call `beatra.models.list` for a lookup. Do not show `schema_hash` to
the seller.

A confirmed lookup does not authorize clone, speech, or video.
