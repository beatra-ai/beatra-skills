# Looking up notes

Notes normally come from the user. This route exists for the other case: the user
gives a category or a note link, and the connection exposes Beatra's public social
lookup.

It is optional and it is paid. A run that never touches it is a complete run.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| What you want | Operation | Credits |
| --- | --- | --- |
| Search Xiaohongshu notes | `social.xiaohongshu.note.search` | **60** |
| One Xiaohongshu image note | `social.xiaohongshu.note.image.get` | **60** |
| One Xiaohongshu video note | `social.xiaohongshu.note.video.get` | **60** |
| Xiaohongshu note comments | `social.xiaohongshu.note.comments.list` | **60** |
| Xiaohongshu user notes | `social.xiaohongshu.user.notes.list` | **60** |

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

Every operation on this list is 60 credits. A link becomes a note read, then one
comments page. A category becomes one search page, then one note the user picks, then
one comments page. A creator's recent notes are a separate lookup after a profile
link or `user_id` is in hand. Never page automatically.

**If the platform has no operation in this whitelist, it has no lookup.** Do not
substitute a neighbouring platform's notes.

## Turning what the user has into arguments

Never ask for an internal ID the user would have to go and find.

- **A pasted note link is `share_text`** on the image-note read, the video-note read,
  and the comments list. That is the normal note route. If the note type is unknown,
  confirm the 60-credit image read first; a retry as video is a new execute and a new
  confirmation.
- **A category is `keyword`** on `social.xiaohongshu.note.search`. Confirm the
  60-credit price before it runs.
- **A creator's notes** take `share_text` (a profile link) or `user_id` from a prior
  payload on `social.xiaohongshu.user.notes.list`.
- **Comments** take `share_text` or `note_id` from the note-read payload.
- **A second page is built from the first page's own response.** Carry back every
  paging field that response returned — including `search_id` and `search_session_id`
  when a search returned them — and construct none of them.

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
request specific enough to skip the price: every operation on this list is 60 credits.

State, before the call:

- what is being looked up, in plain words, together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each page as one;
- that the memo can still be written from notes the user already pasted, at no cost.

When the user asks to "just search Xiaohongshu" without a link, name the 60-credit
price before running `social.xiaohongshu.note.search`. A second page of that search is
another 60.

## Reporting a lookup

Deliver the returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or duration to
report.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the
match with `beatra.tasks.get` against the saved `operation_key`, arguments, and
`schema_hash`, then replay byte-identical arguments under the same
`client_request_id`. Writing only the replay half authorizes a duplicate charge.
