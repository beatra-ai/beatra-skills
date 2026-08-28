# YouTube insurance caption lookup

Captions normally come from the advisor. This route exists when they
give a public YouTube video link or search wording and this
connection can read it.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is
not available on this connection and continue with pasted lines.

This package uses only these operations:

- `social.youtube.video.search`
- `social.youtube.video.captions.get`

If the platform has no search or caption operation in this list, it
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
the advisor.

Prices are what `beatra.social.tools.get` just returned. Quote that
live number. YouTube video search on this whitelist is catalog
tier 2 today and captions are catalog tier 4; do not reuse a
remembered figure.

## Arguments from a video, a search, or a link

Never ask for an internal ID the advisor would have to go find.

- A pasted watch, `youtu.be`, or `/shorts/` URL is `video_url` on
  `social.youtube.video.captions.get`. An 11-character ID read from
  that URL may go on `video_id`. Neither field is required in the
  catalog; supply one of them from the paste rather than asking.
- Search wording is `keyword` on `social.youtube.video.search`. Prefer
  `type` `video` so the page returns videos. A `video_id` for captions
  comes from that search payload, not from asking the advisor.
- `language_code` on captions: pass it when the advisor named a
  language. Leave it empty only when they asked for the available
  list, and confirm that this captions execute may return the list
  rather than the transcript. Fetching a language after that list is
  another execute and another confirmation.
- `format` on captions defaults to `srt`. `txt` is fine when the
  advisor wants plain spoken lines.
- A second search page is built from the first page's own response.
  Carry back every paging field that response returned and construct
  none of them.

Do not call `social.youtube.video.get`,
`social.youtube.video.comments.list`,
`social.youtube.comment.replies.list`,
`social.youtube.channel.resolve`, `social.youtube.channel.get`,
`social.youtube.channel.videos.list`, or
`social.youtube.channel.shorts.list`.

A confirmed lookup does not authorize clone, speech, or video.
A looked-up caption line is labelled as looked up, with the date it
was read. A pasted caption stays marked as supplied. A missing
clause line is stated as missing. Never estimate, interpolate, or
invent coverage, a deductible, a waiting period, or a payout from a
similar insurance video.
