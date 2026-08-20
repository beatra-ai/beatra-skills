# Looking up what is trending

The topic normally comes from the user. This route exists for the other case: the user
wants to know what is moving right now, or wants the topic they named checked against
what people are actually posting, and the connection exposes Beatra's public social
lookup.

It is optional and it is paid. A run that never touches it is a complete run.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| What you want | Operation | Credits |
| --- | --- | --- |
| The Douyin hot-search board | `social.douyin.hot_search.list` | 6 |
| TikTok trending hashtags | `social.tiktok.hashtag.trends.list` | 6 |
| X trends | `social.twitter.trends.list` | 6 |
| Posts about a named topic, TikTok | `social.tiktok.video.search` | 6 |
| Posts about a named topic, X | `social.twitter.tweet.search.top` | 6 |
| Posts about a named topic, Douyin | `social.douyin.video.search` | **60** |
| Notes about a named topic, Xiaohongshu | `social.xiaohongshu.note.search` | **60** |

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

The three board operations answer "what is moving"; the four searches answer "what are
people saying about this one topic". There is no Xiaohongshu board on this list — a
Xiaohongshu lookup needs a topic to search for, which means the user names it first.

**There is no trend board for Instagram, YouTube, or WeChat Channels.** When the post is
destined for Reels, Shorts, or Channels, the trend still has to come from the user or
from one of the platforms above, stated as such. Never present a Douyin board as if it
were a Channels board.

## The route

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and the credit
   price, and copy the `schema_hash` it just returned.
3. Show the user the `operation_key` and the credit price that `tools.get` just
   returned, in plain words alongside them, and get a clear go-ahead. Then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`, `arguments`,
   and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.

One `execute` is one prepaid lookup. **The next page of results is another `execute` and
another charge**, not a page token on the same call. Never page on your own — one page
is almost always enough to pick an angle, and a second page is a new decision for the
user.

Public social lookup has no `model` field. On a failure keep `error.code` and read the
platform wording in `error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user.

If the social tools are not exposed on this connection, say the lookup is not available
here and continue from what the user brought. That is the normal shape of this route,
not a degraded one.

## Confirming it

**Every lookup is confirmed on its own before it runs, without exception.** There is no
request specific enough to skip the price: the operations on this list range from 6 to
60 credits, and "see what people are posting about this" costs ten times more on Douyin
and Xiaohongshu than the same request on TikTok or X. A user who has not been shown the
number cannot have agreed to it.

State, before the call:

- what is being looked up, in plain words — the board you are reading or the topic you
  are searching — together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each page as one;
- that the angles can be produced from what the user already gave, at no cost.

When the user asks for "whatever is trending" without naming a platform, offer the
6-credit boards first and name the 60-credit price before running
`social.douyin.video.search` or `social.xiaohongshu.note.search`.

## Delivering the lookup

A lookup is a task, and it is reported like one — but not like a generation task. Give
the returned payload, the `task_id`, the terminal status, and
`billing.net_charged_credits`. There is no resolved model, no dimensions, no duration,
and no media artifact; do not look for them and do not report them as missing.

If the lookup's task ID is lost, do not list tasks by capability — a lookup has no
capability. Compare the saved `operation_key`, arguments, and `schema_hash` against the
candidates instead.

## Carrying the result into the angles

Every figure that reaches the angles is labelled with where it came from and when.

- A topic, rank, count, or post read from a lookup is marked as looked up, with the
  time it was read. Boards move within hours; a rank quoted without its read time is
  the fastest way this route becomes wrong.
- Anything the user supplied stays marked as supplied.
- Anything neither source produced is stated as missing. It is never estimated,
  interpolated, or filled in from what topics like this usually do.
- Why a topic is moving, and how long it has left, remain inference even with the board
  in hand. Mark them as inference, give the evidence — position on the board, how many
  recent posts, what the posts are actually about — and say what would confirm it.

A search result is evidence about the conversation, not about the account. It tells you
what people are saying and roughly how much; it does not tell you whether this account
should join in. That judgment is unchanged by having the data.
