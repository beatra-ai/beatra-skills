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

Plus two account-level operations, **Douyin only**, used together for the same-account
comparison below: `social.douyin.user.search` and `social.douyin.user.posts.list`, 6
credits each.

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

## A same-account comparison — Douyin only, two lookups

One video doing well can just be the recommendation algorithm rolling the dice. To tell
a repeatable method apart from a one-off, the cheapest evidence is the rest of the
account's output, and on Douyin this route can reach it in two paid steps:

1. **`social.douyin.user.search`** with the creator's name as `keyword` — the same name
   the user already has from watching the reference, never an internal ID they would
   have to go and find. Returns a page of matching users, each carrying its `sec_uid`.
   Confirm this lookup on its own, at its live price, before running it.
2. **`social.douyin.user.posts.list`** fed that `sec_uid`. Returns one page of the
   account's posts, each with its own `statistics` and `video` metadata; a page this
   size typically comes back as an artifact envelope — handle it per "A lookup delivers
   in one of two shapes" below. Confirm this lookup on its own too, at its own live
   price, separately from the search above — it is a second charge, not bundled into the
   first.

**That is two separate paid lookups, each disclosed and confirmed on its own before it
runs**, exactly like every other lookup on this page — never one price quoted for both,
and never the second one run on the strength of the first's approval. Read both prices
live from `beatra.social.tools.get`; quote no number from memory.

Once the page of posts is in hand, check two things against it: how far this post's
public metrics sit from the account's median, and whether the same structural beats show
up in the other posts. Recurrence points to a method; a one-off points to luck.

**This route exists on Douyin only.** No search-by-name operation is whitelisted for
TikTok, Instagram, YouTube, X, or Xiaohongshu — on those platforms, say plainly that a
same-account comparison is not available here, rather than implying this route
generalises.

This whole comparison is optional, and it is the user's call whether the teardown's
directional judgement needs this anchor badly enough to spend twice more — never run it
without asking, and never send the user off to hand-collect other posts manually instead
of running it. When it is skipped — on Douyin by choice, or because the reference is on
another platform — say so in the teardown report: a single-post sample cannot tell a
method from a lucky roll, and the report should state that plainly rather than imply
otherwise.

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

Say plainly that a transcript is available for YouTube only. On every other platform,
the spoken track still has to come from the remaining tiers of the four-tier dialogue
ladder — a transcript the user supplies directly, hard-burned subtitles read from the
frames, or recorded as missing — never from the video's own audio track, which the
vision model cannot hear; see [reading the reference](teardown.md) for the full ladder.

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

## A lookup delivers in one of two shapes

A small result comes back inline in the task output. A large one does not: the
`output` is instead an envelope, `{"delivery": "artifact", "result_artifact": {...}}`,
and the actual data sits at `result_artifact.url` as CDN-hosted JSON. A single page of
a creator's posts measured around 630 KB and came back this way.

Handle both shapes. When `delivery` reads `artifact`, fetch `result_artifact.url` and
parse the JSON it returns — the envelope is not the result, and treating it as one
means working from a payload that is missing everything.

## A direct play address expires fast

The post payload's play address carries a `cdn_url_expired` timestamp, and in practice
it goes stale after roughly 57 minutes.

So: **use a direct address the moment it is fetched, inside the same run that fetched
it.** Never cache it across sessions, and never write it into a deliverable for the user
to click later — it will be dead by the time they do. Re-running the teardown later
means fetching the post again, not reusing the old link.

The same payload carries `has_watermark`. For Douyin it is `true` — the play address
this route can reach is watermarked, and there is no unwatermarked version to ask for
instead. That watermark is why the reference footage itself can never be fed into a
generation call; see [compliance](compliance.md) for what it rules out.

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
