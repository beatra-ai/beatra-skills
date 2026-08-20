# Reading the reference from a link

The reference usually arrives as something the user already has — a file, screenshots, a
transcript, their own account of it. This route exists for the shape they reach for
first: **the link**. When the connection exposes Beatra's public social lookup, a link
can be read directly.

It is optional and it is paid. A run that never touches it is a complete run, and the
teardown from screenshots is a real teardown.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| Platform | The post itself | Its comments | Credits |
| --- | --- | --- | --- |
| TikTok | `social.tiktok.video.get_by_url` | `social.tiktok.video.comments.list` | 6 |
| Douyin | `social.douyin.video.get_by_url` | `social.douyin.video.comments.list` | 6 |
| X | `social.twitter.tweet.get` | `social.twitter.tweet.comments.list` | 6 |
| YouTube | `social.youtube.video.get` | `social.youtube.video.comments.list` | 6 |
| Instagram | `social.instagram.post.get` | `social.instagram.post.comments.list` | 12 |
| Xiaohongshu | `social.xiaohongshu.note.video.get`, `social.xiaohongshu.note.image.get` | `social.xiaohongshu.note.comments.list` | **60** |

Plus one transcript operation: `social.youtube.video.captions.get`, **60 credits**,
YouTube only. No other platform on this list returns a transcript.

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

## Turning the link into arguments

Each operation takes what a pasted link already contains. Never ask the user for an
internal ID they would have to go and find.

- **TikTok and Douyin** take the share link as `share_url`. The comments operation needs
  an `aweme_id`, and a canonical link carries it already: it is the numeric segment in
  `tiktok.com/@user/video/<id>` or `douyin.com/video/<id>`. Read it from the link when it
  is there — comments then cost one lookup rather than two. A short or redirecting link
  does not carry it; take it from the post lookup's returned payload instead, and if
  neither yields one, say the comments cannot be read for this link rather than paying
  for a guess.
- **Xiaohongshu** takes the share link as `share_text`, including an `xhslink` short
  link. Both the video-note and image-note operations accept it; pick by what the link
  actually is, and if that is not yet known, ask the user rather than paying twice.
- **Instagram** takes the post URL directly as `code_or_url`.
- **YouTube** needs `video_id` — the `v=` parameter, or the last path segment of a
  `youtu.be` or `/shorts/` link. Captions are the exception: they accept `video_url`
  directly.
- **X** needs `tweet_id`, the numeric segment after `/status/`.

## The route

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and the credit
   price, and copy the `schema_hash` it just returned.
3. Show the user the `operation_key` and the credit price that `tools.get` just
   returned, in plain words alongside them, and get a clear go-ahead. Then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`, `arguments`,
   and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.

One `execute` is one prepaid lookup. **The next page of comments is another `execute`
and another charge**, not a page token on the same call. One page of comments is enough
to read the audience; a second page is a new decision for the user.

Public social lookup has no `model` field. On a failure keep `error.code` and read the
platform wording in `error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user.

If the social tools are not exposed on this connection, say the lookup is not available
here and read the reference from whatever the user brought. That is the ordinary shape
of this route, not a degraded one.

The same answer covers a link this route cannot read at all. Only the six platforms in
the table above have operations; a WeChat Channels, Kuaishou, Bilibili, or Weibo link
has none. Say so plainly, name the shapes that do work — a file, screenshots, a
transcript, a description — and never substitute a neighbouring platform's data for the
one the user actually linked.

Every call on this route goes through the bundled `scripts/mcp_client.py`, exactly as
the generation calls do. Do not configure or call a host Beatra Connector, and do not
fall back to REST or OpenAPI.

## The captions trap

`social.youtube.video.captions.get` costs 60 credits per call, and **calling it with an
empty `language_code` returns the list of available captions rather than a transcript**.
That listing call is billed like any other. Pass the language you expect on the first
call, and only fall back to the empty-code listing when that returns nothing — otherwise
one transcript costs 120 credits instead of 60.

Say plainly that a transcript is available for YouTube only. On every other platform the
spoken track still has to come from the user, from the video file, or from the caption
text the post itself carries.

## Confirming it

**Every lookup is confirmed on its own before it runs, without exception.** There is no
request specific enough to skip the price: the operations on this list range from 6 to
60 credits, so the same sentence — "read this link for me" — costs ten times more on
Xiaohongshu than on TikTok, and a transcript costs ten times more than the post it
belongs to.

State, before the call:

- what is being looked up, in plain words — the post, its comments, or its transcript —
  together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting the post, the comments, and the
  transcript as separate charges, and each extra page as one more;
- that the teardown can run on screenshots or a description at no cost.

Offer the post on its own first. Comments and a transcript are worth their price when
the teardown needs them, and the user should be the one who decides that.

## What each lookup adds to the teardown

Keep this straight, because it decides whether a lookup is worth running at all.

- **The post** gives the caption, the author, the visible metrics, and public media URLs.
  It fixes the claims and the call to action, and it dates the reference — a structure
  that worked eighteen months ago is a different bet from one that worked last week.
- **The comments** give the audience's own words. This is the strongest evidence
  available for *why* it held: what viewers quote back, what they ask, what they object
  to. Use it to name the hook that actually landed and to source objections the remake
  should answer.
- **The transcript** gives the spoken track verbatim, so the beat table's `Spoken`
  column stops being reconstructed.

None of the three shows you a frame. Framing, motion, on-screen text, and cutting rhythm
still come from a file the host can open, from screenshots, or from the user. Say which
is which.

## Carrying the result into the teardown

Every figure that reaches the report is labelled with where it came from and when.

- A view, like, comment, or share count read from a lookup is marked as looked up, with
  the time it was read. These move; a count quoted without its read time ages badly.
- Anything the user supplied stays marked as supplied.
- Anything neither source produced is stated as missing, never estimated from what
  videos like this usually do.
- **Why it performed well remains inference even with comments in hand.** Comments are
  evidence about what the audience noticed, not proof of what caused the result. Mark
  the read as inference, quote the comments that support it, and say what would confirm
  it — the same structure repeating across other posts by the same account, or a wider
  sample.
