# Reading the account from a handle

Everything this package knows about an account has, until now, come from what the user
could see and paste: profile screenshots, the bio, a list of posts typed out with their
counts. That route still works and it is still the default. This one is for the shape a
user reaches for first — **the handle, or the link to the profile** — when the
connection exposes Beatra's public social lookup.

It is optional and it is paid. A run that never touches it is a complete run, and a
teardown built from screenshots is a real teardown.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| Platform | The account | Its posts | Its audience | Credits |
| --- | --- | --- | --- | --- |
| TikTok | `social.tiktok.user.get`, `social.tiktok.user.search` | `social.tiktok.user.posts.list` | `social.tiktok.video.comments.list` | 6 |
| Douyin | `social.douyin.user.get`, `social.douyin.user.search` | `social.douyin.user.posts.list` | `social.douyin.video.comments.list` | 6 |
| YouTube | `social.youtube.channel.get`, `social.youtube.channel.resolve` | `social.youtube.channel.videos.list`, `social.youtube.channel.shorts.list` | — | 6 |
| X | `social.twitter.user.get` | `social.twitter.user.tweets.list` | — | 6 |
| Instagram | `social.instagram.user.get` | `social.instagram.user.posts.list`, `social.instagram.user.reels.list` | — | 12 |
| Xiaohongshu | `social.xiaohongshu.user.get` | `social.xiaohongshu.user.notes.list` | `social.xiaohongshu.note.comments.list` | **60** |

Twenty operations, and each one is here because a stage of the teardown consumes it: the
account read needs the profile, the content matrix and cadence read needs a page of
posts, the audience read needs comments, the Shorts and Reels lists separate short-form
from long-form inside one account's matrix, and the two search operations are how an
account gets found when the user knows a name rather than a link.

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

**Xiaohongshu costs 60 credits for every one of its three operations, ten times Douyin
and TikTok.** Reading one Xiaohongshu account's profile, one page of its notes, and one
page of comments is 180 credits; the same three reads on Douyin are 18. Never quote one
number for "reading an account."

## The platform this route cannot reach

The rule is the table above, not a list of exceptions: **if a platform has no operation
in it, the account cannot be looked up.** The package is sold for WeChat Channels, which
has no public data operation at all; the same is true of Kuaishou, Bilibili, Weibo, and
Zhihu, and the list is not exhaustive. For any of them, say plainly that the account
cannot be looked up and go back to what the user can see and paste — which is exactly how
this package worked before this route existed, and is a complete route, not a degraded
one.

**Never substitute a neighbouring platform.** A Douyin account's figures presented inside
a WeChat Channels teardown are wrong in a way the user cannot detect, and the user will
act on them.

## Turning a handle into arguments

Never ask the user for an internal ID they would have to go and find. Each operation
takes something a handle or a profile link already carries, or something an earlier
whitelisted call returned.

- **TikTok** takes the `@handle` as `unique_id` for both the profile and the posts list.
- **Douyin** needs `sec_user_id`, which is not the handle. A profile link carries it —
  it is the `MS4wLjABAAAA…` segment in `douyin.com/user/<sec_user_id>`. When the user has
  only a name, `social.douyin.user.search` returns accounts with their `sec_user_id`;
  that search is a separate charge, so say so before running it rather than treating it
  as setup.
- **Xiaohongshu** takes the profile share link as `share_text`, or a `user_id`. The
  comments operation takes a `note_id` read from the notes list, or that note's own
  share link.
- **Instagram** takes the `username` directly.
- **YouTube** needs a `channel_id` for the profile and the videos list, and
  `social.youtube.channel.resolve` is the only whitelisted way to obtain one. Its
  `channel_url` argument documents full channel URL forms, so ask for the URL rather
  than a bare `@handle`, and count the resolve as its own charge. **The Shorts list is
  the exception**: `social.youtube.channel.shorts.list` accepts a `channel_url` directly,
  so resolving first before a Shorts-only read spends six credits for nothing.
- **X** takes the `screen_name` directly.
- **Comments** need the post's own id — `aweme_id` on TikTok and Douyin — read from the
  posts list that was already fetched. Read it off a returned post; if a returned post
  carries no id, say the comments cannot be read for that post rather than guessing one.

## The route

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and the credit
   price, and copy the `schema_hash` it just returned.
3. Show the user the `operation_key` and the credit price that `tools.get` just
   returned, in plain words alongside them, and get a clear go-ahead. Then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`, `arguments`,
   and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.
5. Deliver what it actually returned and what it actually cost: the returned payload, its
   `task_id`, its terminal status, and `billing.net_charged_credits`. A lookup has no
   model, no dimensions, and no duration to report — but it has a real charge, and the
   user sees the charge for every other paid call this package makes.

If the create response is lost, list the tasks and inspect the candidate that matches the
recorded `operation_key`, arguments and `schema_hash` **before** repeating anything; only
then replay the byte-identical arguments under the **same** `client_request_id`, which is
what keeps it one prepaid lookup instead of two. Any changed argument — the next page
included — is new paid work with a new identifier and its own confirmation.

One `execute` is one prepaid lookup. **The next page of posts or comments is another
`execute` and another charge**, not a page token on the same call. This package's default
is a read of ten to twenty recent posts, which is normally one page; if it is not, the
second page is a new decision for the user, not an automatic continuation. Never page
automatically.

Public social lookup has no `model` field. On a failure keep `error.code` and read the
platform wording in `error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user.

If the social tools are not exposed on this connection, say the lookup is not available
here and build the evidence table from whatever the user brought.

Every call on this route goes through the bundled `scripts/mcp_client.py`, exactly as the
cover and narration calls do. Do not configure or call a host Beatra Connector, and do
not fall back to REST or OpenAPI.

## Confirming it

**Every lookup is confirmed on its own before it runs, without exception**, and it is
confirmed separately from the production confirmation at stage 7. The two are different
decisions about different amounts of money, and folding the lookup into the production
approval would charge for it inside the stages this package promises are free.

State, before the call:

- what is being looked up, in plain words — the profile, a page of posts, or a page of
  comments — together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting the profile, each page of posts, and each
  page of comments as separate charges;
- that the whole teardown, template, and first-post plan can be built at no cost from
  what the user pastes.

Offer the profile and one page of posts first. Comments are worth their price when the
audience read needs them, and the user should be the one who decides that. A full plan —
profile, posts, and comments across three platforms — is a large number of charges, and
naming the total before any of it runs is the difference between an informed decision and
a surprise.

## What each lookup adds, and what it still cannot settle

- **The profile** gives the bio, the follower and following counts, and the account's own
  stated positioning. It replaces the screenshot, and it dates the read.
- **The posts list** gives titles or captions and the visible counts, in order. This is
  what the content matrix, the cadence read, and the hook pattern are built from, and it
  is the single largest upgrade: the evidence table stops depending on how much the user
  was willing to type.
- **The comments** give the audience's own words, which is the only direct evidence for
  *who the account actually speaks to* — as opposed to who its bio says it speaks to.
  **Comments are available on TikTok, Douyin, and Xiaohongshu only.** On YouTube,
  Instagram, and X the audience read stays a read of the copy, however the account was
  obtained; say so rather than leaving the user to assume the read was evidence-backed.

None of the three tells you why the account works. Structure, editing, thumbnail craft,
and the creator's own delivery still come from what the host can see and from the user.

## Carrying the result into the evidence table

The evidence table's rule is unchanged: **every row carries where it came from.** The
route just added a second legitimate source next to the user.

- A follower, view, like, comment, save, or share count read from a lookup is marked as
  looked up, with the time it was read. Public counts move, and a count quoted without
  its read time ages badly.
- Anything the user supplied stays marked as supplied.
- Anything neither source produced is stated as missing. It is never estimated, never
  interpolated, and never carried in from what similar accounts usually look like. A
  plausible-looking metric about a real account is still the worst possible output here,
  because the user will act on it.
- **Why a post performed well remains inference even with comments in hand.** Comments
  are evidence about what the audience noticed, not proof of what caused the result. Mark
  the read as inference, quote the comments behind it, and say what would confirm it — a
  wider sample, or the same structure repeating across the top performers.
- **A looked-up number is not a more certain number than a pasted one; it is a
  differently sourced one.** A count read from the platform can still be stale, disputed,
  or inflated by the account itself. Label it and move on rather than presenting it as
  settled fact.
