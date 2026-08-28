# TikTok hashtag lookup

Hashtags normally come from the operator. This route exists when they
want this connection to read public TikTok hashtag rankings or head
posts.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted tags.

This package uses only these operations:

- `social.tiktok.hashtag.trends.list`
- `social.tiktok.video.search`

If the platform has no hashtag or video-search operation in this list,
it has no lookup.

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
the operator.

Prices are what `beatra.social.tools.get` just returned. Quote that
live number. Do not reuse a remembered figure.

## Arguments from a country, a tag, or a search

Never ask for an internal ID the operator would have to go find.

- A country already in the conversation is `country_code` on
  `social.tiktok.hashtag.trends.list`. Use the live default
  `tools.get` just returned when they did not name one.
- A time window they named is `time_range`. Otherwise keep the live
  default.
- Head posts take the operator-picked hashtag as `keyword` on
  `social.tiktok.video.search`. Do not pass a share URL to video
  search.
- A second page is built from the first page's own response. Carry
  back every paging field that response returned — including `page`
  on the trends list and `offset` on video search — and construct
  none of them.

Do not call `social.tiktok.user.get`, `social.tiktok.user.posts.list`,
`social.tiktok.video.comments.list`, or any Douyin hot-search
operation.

A confirmed lookup does not authorize clone, speech, or video.
A looked-up hashtag is labelled as looked up, with the date it was
read. A pasted tag stays marked as supplied. A missing hook line is
stated as missing. Never estimate, interpolate, or invent a rank or
heat score.
