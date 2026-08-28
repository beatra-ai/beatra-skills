# Xiaohongshu wealth FAQ note lookup

Note questions normally come from the advisor. This route exists
when they give public Xiaohongshu search wording and this
connection can read it.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted questions.

This package uses only these operations:

- `social.xiaohongshu.note.search`

If the platform has no note-search operation in this list, it has
no lookup.

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
the advisor.

Prices are what `beatra.social.tools.get` just returned. Quote that
live number. Xiaohongshu note search on this whitelist is catalog
tier 4 today; do not reuse a remembered figure.

## Arguments from search wording

Never ask for an internal ID the advisor would have to go find.

- Search wording is `keyword` on `social.xiaohongshu.note.search`.
  Prefer the advisor's own phrasing. Do not invent a richer query
  to “improve” the page.
- A second search page is built from the first page's own response.
  Carry back every paging field that response returned (`page`,
  `search_id`, `search_session_id`, and any other paging field it
  actually returned) and construct none of them.

Do not call `social.xiaohongshu.note.image.get`,
`social.xiaohongshu.note.video.get`,
`social.xiaohongshu.note.comments.list`,
`social.xiaohongshu.comment.replies.list`,
`social.xiaohongshu.user.get`, `social.xiaohongshu.user.search`,
`social.xiaohongshu.user.notes.list`, `social.xiaohongshu.topic.get`,
or `social.xiaohongshu.topic.notes.list`.

A confirmed lookup does not authorize clone, speech, or video.
A looked-up note question is labelled as looked up, with the date
it was read. A pasted question stays marked as supplied. A missing
product line is stated as missing. Never estimate, interpolate, or
invent a return, yield, or personalized buy-or-sell line from a
similar wealth note.
