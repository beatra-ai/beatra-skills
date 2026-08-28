# TikTok creator lookup

Homepage facts normally come from the user. This route exists when they
give a public TikTok profile URL, `@handle`, or display name and this
connection can read it.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted lines.

This package uses only these operations:

- `social.tiktok.user.search`
- `social.tiktok.user.get`
- `social.tiktok.user.posts.list`

If the platform has no user or posts operation in this list, it
has no lookup.

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
the user.

Prices are what `beatra.social.tools.get` just returned. Quote that
live number. Do not reuse a remembered figure.

## Arguments from a handle, a name, or a link

Never ask for an internal ID the user would have to go find.

- An `@handle` or `tiktok.com/@handle` path is `unique_id` on
  `social.tiktok.user.get` and `social.tiktok.user.posts.list`.
- A display name without a handle is `keyword` on
  `social.tiktok.user.search`. Pick the user the operator names from
  that page, then read the profile. The search is its own charge.
- Posts take `unique_id` or `sec_user_id` from the profile URL or
  from a prior user-get or user-search payload. Do not pass a search
  keyword to the posts list.
- A second page is built from the first page's own response. Carry
  back every paging field that response returned — including
  `max_cursor` when a posts page returned it — and construct none of
  them.

Do not call `social.tiktok.video.get_by_url`,
`social.tiktok.video.comments.list`, `social.tiktok.video.search`,
or any Douyin, Xiaohongshu, Instagram, YouTube, or X operation.

A confirmed lookup does not authorize generate, transform, or edit.
A looked-up fact is labelled as looked up, with the date it was
read. A pasted fact stays marked as supplied. A missing collab term
is stated as missing. Never estimate, interpolate, or invent a
follower or play count.
