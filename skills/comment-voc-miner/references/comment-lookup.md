# Looking up comments

Comments normally come from the user. This route exists for the other case: the user
gives a public post link or a category, and the connection exposes Beatra's public
social lookup.

It is optional and it is paid. A run that never touches it is a complete run.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| What you want | Operation | Credits |
| --- | --- | --- |
| One TikTok video by URL | `social.tiktok.video.get_by_url` | 6 |
| One TikTok video by ID | `social.tiktok.video.get_by_id` | 6 |
| TikTok video comments | `social.tiktok.video.comments.list` | 6 |
| TikTok comment replies | `social.tiktok.comment.replies.list` | 6 |
| Search TikTok videos | `social.tiktok.video.search` | 6 |
| One Douyin video by URL | `social.douyin.video.get_by_url` | 6 |
| One Douyin video by ID | `social.douyin.video.get_by_id` | 6 |
| Douyin video comments | `social.douyin.video.comments.list` | 6 |
| Douyin comment replies | `social.douyin.comment.replies.list` | 6 |
| Search Douyin videos | `social.douyin.video.search` | **60** |
| One Xiaohongshu image note | `social.xiaohongshu.note.image.get` | **60** |
| One Xiaohongshu video note | `social.xiaohongshu.note.video.get` | **60** |
| Xiaohongshu note comments | `social.xiaohongshu.note.comments.list` | **60** |
| Xiaohongshu comment replies | `social.xiaohongshu.comment.replies.list` | **60** |
| Search Xiaohongshu notes | `social.xiaohongshu.note.search` | **60** |
| One Instagram post | `social.instagram.post.get` | 12 |
| Instagram post comments | `social.instagram.post.comments.list` | 12 |
| Instagram comment replies | `social.instagram.comment.replies.list` | 12 |
| Search Instagram Reels | `social.instagram.reel.search` | 12 |
| One YouTube video | `social.youtube.video.get` | 6 |
| YouTube video comments | `social.youtube.video.comments.list` | 6 |
| YouTube comment replies | `social.youtube.comment.replies.list` | 6 |
| Search YouTube videos | `social.youtube.video.search` | 12 |
| One X post | `social.twitter.tweet.get` | 6 |
| X post comments | `social.twitter.tweet.comments.list` | 6 |
| Search recent X posts | `social.twitter.tweet.search.recent` | 6 |

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

A link becomes a post read, then a comments list. A category becomes one search page,
then one post the user picks, then one comments page. A reply thread is a second
lookup after the parent comment is already in the comments payload. Never page
automatically.

## Turning what the user has into arguments

Never ask for an internal ID the user would have to go and find.

- **TikTok and Douyin.** A share link is `share_url` on `social.tiktok.video.get_by_url`
  or `social.douyin.video.get_by_url`. Comments take `aweme_id`. Read it from a
  canonical `/video/<id>` path when the link already carries it; otherwise take it
  from the post-read payload. Do not pass the share URL to the comments list.
- **Xiaohongshu.** A share link, including an `xhslink` short link, is `share_text` on
  the image-note get, the video-note get, and the comments list. Pick image or video
  from what the link actually is; if that is not yet known, ask rather than paying
  twice.
- **Instagram.** A post URL is `code_or_url` on the post get and on the comments list.
  A category is `keyword` on `social.instagram.reel.search`.
- **YouTube.** `video_id` is the 11-character `v=` value, or the last path segment of a
  `youtu.be` or `/shorts/` link. Pass that to `social.youtube.video.get` and
  `social.youtube.video.comments.list`. A full watch URL fails the 11-character schema.
  There is no YouTube get-by-URL on this list.
- **X.** `tweet_id` is the numeric segment after `/status/`. Pass that to
  `social.twitter.tweet.get` and `social.twitter.tweet.comments.list`. There is no X
  get-by-URL on this list.

A category search takes `keyword` on the platform's search operation. After the user
picks one result, use that result's own identifiers — do not ask the user to go copy
an ID from the app.

### Reply threads

Confirm each reply lookup on its own. Take every identifier from the comments payload
already in hand, plus the post identifier already used. Never ask the user for
`comment_id`, `item_id`, or `continuation_token`.

- **TikTok and Douyin** require `item_id` and `comment_id`. `item_id` is the same
  `aweme_id` already used for comments.
- **Xiaohongshu** requires `comment_id`. Carry `share_text` or `note_id` from the
  note already read when the schema accepts them.
- **Instagram** requires `code_or_url` and `comment_id`.
- **YouTube** requires `continuation_token` from the parent comment's
  `reply_continuation_token`. It does not accept `comment_id`. If that token is
  missing, there is no YouTube reply lookup for that comment.
- **X** has no reply operation on this list. Stay on the comments page.

**If the platform has no operation in this whitelist, it has no lookup.** Do not
substitute a neighbouring platform's comments.

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
request specific enough to skip the price: operations on this list range from 6 to 60
credits, and a Xiaohongshu or Douyin search costs ten times a TikTok comments page.

State, before the call:

- what is being looked up, in plain words, together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each page as one;
- that the brief can still be written from comments the user already pasted, at no cost.

When the user asks to "just search Douyin" or Xiaohongshu without a link, name the
60-credit price before running `social.douyin.video.search` or
`social.xiaohongshu.note.search`.

## Reporting a lookup

Deliver the returned payload, `task_id`, terminal status, and
`billing.net_charged_credits`. A lookup has no model, dimensions, or duration to
report.

## Recovery

If the task ID is lost, list plausible tasks with `beatra.tasks.list`, inspect the
match with `beatra.tasks.get` against the saved `operation_key`, arguments, and
`schema_hash`, then replay byte-identical arguments under the same
`client_request_id`. Writing only the replay half authorizes a duplicate charge.
