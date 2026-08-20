# Looking up Douyin

Evidence normally comes from the user. This route exists for the other case: the user
gives a Douyin link or a keyword, and the connection exposes Beatra's public social
lookup.

It is optional and it is paid. A run that never touches it is a complete run.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| What you want | Operation | Credits |
| --- | --- | --- |
| One Douyin video by URL | `social.douyin.video.get_by_url` | 6 |
| One Douyin video by ID | `social.douyin.video.get_by_id` | 6 |
| One Douyin user | `social.douyin.user.get` | 6 |
| Douyin video comments | `social.douyin.video.comments.list` | 6 |
| Douyin hot search | `social.douyin.hot_search.list` | 6 |
| Search Douyin videos | `social.douyin.video.search` | **60** |

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

A link becomes a post read, then one comments page. A keyword becomes one video-search
page, then one post the user picks, then one comments page. The hot-search board is a
different 6-credit lookup when they want the board; it is not a substitute for a
keyword search. A creator read is a second lookup after `sec_user_id` is in hand from
the post payload. Never page automatically.

**If the platform has no operation in this whitelist, it has no lookup.** Do not
substitute a neighbouring platform's posts.

## Turning what the user has into arguments

Never ask for an internal ID the user would have to go and find.

- **A pasted share link is `share_url`** on `social.douyin.video.get_by_url`. That is
  the normal post route.
- **A numeric video ID is `aweme_id`** on `social.douyin.video.get_by_id` and on
  `social.douyin.video.comments.list`. Read it from a canonical
  `douyin.com/video/<id>` link when it is there; a short or redirecting link does not
  carry one, so take it from the post read's returned payload instead.
- **A keyword is `keyword`** on `social.douyin.video.search`. That search is 60
  credits. Confirm it on its own.
- **The hot-search board** takes nothing required. Confirm it as its own 6-credit
  lookup when the user wants the board.
- **A creator read** takes `sec_user_id` from the post payload. Do not ask the user
  to go find it.
- **A second page is built from the first page's own response.** Carry back every
  paging field that response returned and construct none of them.

## The route

Do not invent an `operation_key`. Live operations, arguments, and credit prices come
from `beatra.social.tools.search` and `beatra.social.tools.get` on this connection.
If those tools are not exposed, say the lookup is not available on this connection and
continue with what the user supplied.

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and the credit
   price, and copy the `schema_hash` it just returned.
3. Show the user the `operation_key` and the credit price that `tools.get` just
   returned, in plain words alongside them, and get a clear go-ahead. Then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`, `arguments`,
   and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.

One `execute` is one prepaid lookup. **The next page of results is another `execute`
and another charge**, not a page token on the same call. Never page on your own —
ask. Carry back every paging field the response returned; construct none.

Public social lookup has no `model` field. On a failure keep `error.code` and read the
platform wording in `error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user.

## Confirming it

**Every lookup is confirmed on its own before it runs, without exception.** There is no
request specific enough to skip the price: operations on this list are 6 credits except
`social.douyin.video.search`, which is 60.

State, before the call:

- what is being looked up, in plain words, together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each page as one;
- that the brief can still be written from material the user already pasted, at no
  cost.

When the user asks to "just search Douyin" without a link, name the 60-credit price
before running `social.douyin.video.search`. A second page of that search is another
60.

## Reporting a lookup

Deliver the returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or duration to
report.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the
match with `beatra.tasks.get` against the saved `operation_key`, arguments, and
`schema_hash`, then replay byte-identical arguments under the same
`client_request_id`. Writing only the replay half authorizes a duplicate charge.
