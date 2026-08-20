# Looking up captions

Captions normally come from the user. This route exists for the other case: the user
gives a YouTube link, and the connection exposes Beatra's public social lookup.

It is optional and it is paid. A run that never touches it is a complete run.

Captions exist only when the catalog returns them.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| What you want | Operation | Credits |
| --- | --- | --- |
| One YouTube video | `social.youtube.video.get` | 6 |
| YouTube video captions | `social.youtube.video.captions.get` | **60** |
| YouTube video comments | `social.youtube.video.comments.list` | 6 |

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

A link becomes an optional video read, then a captions read. Comments are a separate
optional lookup. An empty `language_code` on captions may return the available
language list rather than the transcript; fetching a language after that list is
another execute and another charge. Never page automatically.

**If the platform has no operation in this whitelist, it has no lookup.** Do not
substitute a neighbouring platform's captions.

## Turning what the user has into arguments

Never ask for an internal ID the user would have to go and find.

- **`social.youtube.video.captions.get` accepts `video_id` or `video_url`.** Neither
  is required in the catalog. A pasted watch, `youtu.be`, or `/shorts/` URL can go
  on `video_url`. An 11-character ID can go on `video_id`.
- **The 11-character `video_id`** is required on `social.youtube.video.get` and on
  `social.youtube.video.comments.list`. Read it from `watch?v=`, `youtu.be/`, or
  `/shorts/` when it is there rather than asking the user to go find it. A full
  watch URL fails the 11-character schema — do not pass it as `video_id`.
- **`language_code` on captions.** Pass it when the user named a language. Leave it
  empty only when they asked for the available list, and confirm that this 60-credit
  call may return the list rather than the transcript.
- **`format` on captions** defaults to `srt`. `txt` is fine when the user wants plain
  spoken lines.
- **Comments** take `video_id`. They are optional and 6 credits. Confirm them on their
  own.
- **A second page of comments is built from the first page's own response.** Carry
  back every paging field that response returned and construct none of them.

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
request specific enough to skip the price: the captions read is 60 credits, ten times
the video metadata read.

State, before the call:

- what is being looked up, in plain words, together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each page as one;
- that the script can still be written from a transcript the user already pasted, at
  no cost.

When the user asks to "just pull the captions" without a pasted transcript, name the
60-credit price before running `social.youtube.video.captions.get`.

## Reporting a lookup

Deliver the returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or duration to
report.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the
match with `beatra.tasks.get` against the saved `operation_key`, arguments, and
`schema_hash`, then replay byte-identical arguments under the same
`client_request_id`. Writing only the replay half authorizes a duplicate charge.
