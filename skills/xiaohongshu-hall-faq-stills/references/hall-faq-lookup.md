# Xiaohongshu hall FAQ lookup

Complaints normally come from the user. This route exists when they
give a public Xiaohongshu note link or search wording and this
connection can read it.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted lines.

This package uses only these operations:

- `social.xiaohongshu.note.search`
- `social.xiaohongshu.note.image.get`
- `social.xiaohongshu.note.video.get`
- `social.xiaohongshu.note.comments.list`

If the platform has no note or comment operation in this list, it
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
live number. Xiaohongshu operations on this whitelist are catalog
tier 4 today; do not reuse a remembered figure.

## Arguments from a note, a search, or a link

Never ask for an internal ID the user would have to go find.

- A pasted note link is `share_text` on the image-note read, the
  video-note read, and the comments list. If the note type is
  unknown, confirm the image read first; a retry as video is a new
  execute and a new confirmation.
- Search wording is `keyword` on `social.xiaohongshu.note.search`.
- Comments take `share_text` or `note_id` from a prior note-read or
  search payload. Do not pass a search keyword to the comments list.
- A second page is built from the first page's own response. Carry
  back every paging field that response returned — including
  `search_id` and `search_session_id` when a search returned them —
  and construct none of them.

Do not call `social.xiaohongshu.comment.replies.list`,
`social.xiaohongshu.user.get`, `social.xiaohongshu.user.search`,
`social.xiaohongshu.user.notes.list`, `social.xiaohongshu.topic.get`,
or `social.xiaohongshu.topic.notes.list`.

A confirmed lookup does not authorize generate, transform, or edit.
A looked-up complaint is labelled as looked up, with the date it was
read. A pasted complaint stays marked as supplied. A missing
materials line is stated as missing. Never estimate, interpolate, or
invent a document from a similar hall.
