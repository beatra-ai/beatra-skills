# Reading the same-topic baseline

The preflight card is a judgement about one cover. Left on its own it is only that: a
careful opinion with nothing outside the frame to check it against. This route puts a
referent next to it — **what the covers that already compete for this topic actually
look like, and what the numbers next to them are** — so a finding can move from "the
focal subject reads small" to "it reads small next to the field it will appear in."

It is optional and it is paid. A run that never touches it is a complete run. The
qualitative card is the package's deliverable and it stays free.

## What this package may look up

Only these operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| Platform | Operation | What it gives | Credits |
| --- | --- | --- | --- |
| YouTube | `social.youtube.video.search` | one page of the topic's field | 12 |
| YouTube | `social.youtube.video.get` | one video's metadata, statistics, **and thumbnails** | 6 |
| YouTube | `social.youtube.channel.resolve` | a channel URL or handle → `channel_id` | 6 |
| YouTube | `social.youtube.channel.videos.list` | one page of a channel's own videos | 6 |
| TikTok | `social.tiktok.video.search` | one page of the topic's field | 6 |
| Douyin | `social.douyin.video.search` | one page of the topic's field | **60** |
| Xiaohongshu | `social.xiaohongshu.note.search` | one page of the topic's field | **60** |

Prices are what the catalog charges today; read the live price from
`beatra.social.tools.get` and quote that, not this table.

**The same request costs ten times more on Douyin and Xiaohongshu than on TikTok.**
"Show me what else is out there for this topic" is one sentence and three different
prices across four platforms — 6 on TikTok, 12 on YouTube, 60 on Douyin and on
Xiaohongshu. Never quote a single number for "a search."

## Platforms this route does not cover

The criterion is the whitelist, not a list of exceptions: **if a platform has no
operation in the table above, it has no baseline.** This package is sold for several
such surfaces — WeChat article covers, WeChat Channels covers, Bilibili covers, podcast
covers — and the list is not exhaustive. There is nothing to look up for any of them,
and there is no acceptable substitute: a Douyin baseline presented inside a WeChat
Channels review is wrong in a way the user cannot detect. Say plainly that the baseline
is not available for that surface and deliver the qualitative card, which is what the
package was doing before this route existed.

## Turning the request into arguments

- **Every search takes `keyword`** — the content topic, in the language of the platform
  being searched. Take it from the title or topic the user already supplied for the
  card. Do not silently translate a Chinese topic into English to search YouTube, or the
  reverse; ask which market the user means when the cover could belong to either.
- **`social.youtube.video.get` needs a `video_id`.** Read it off an item the search just
  returned. If a returned item carries no id, skip that entry and say so — do not
  construct an id, and do not ask the user to go and find one.
- **`social.youtube.channel.resolve` needs a `channel_url`** — the channel URL or `@handle`,
  which the user has for their own channel. It returns the `channel_id` that
  `social.youtube.channel.videos.list` requires. Those two are a pair: without the
  resolve step there is no legitimate way for this package to obtain a `channel_id`.

## The route

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and the credit
   price, and copy the `schema_hash` it just returned.
3. Show the user the `operation_key` and the credit price that `tools.get` just
   returned, in plain words alongside them, and get a clear go-ahead. Then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`, `arguments`,
   and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.
5. Deliver what the lookup actually returned: the returned payload, its `task_id`, its
   terminal status, and `billing.net_charged_credits`. A lookup has no model, no
   dimensions, and no duration to report, but it does have a real charge, and the user
   sees it for every other paid call this package makes.

If the create response is lost, reconcile with `beatra.tasks.list` and inspect the match
with `beatra.tasks.get` **before** repeating anything; only then replay the byte-identical
arguments under the **same** `client_request_id`, which is what makes it one prepaid
lookup rather than two. Changing any argument, including the page, is new paid work with
a new identifier and a new confirmation.

One `execute` is one prepaid lookup. **The next page of results is another `execute` and
another charge**, not a page token on the same call. One page is a baseline; a second
page is a new decision for the user. Never page automatically.

**Reading a competitor's thumbnail is a YouTube-only step.** `social.youtube.video.get`
is the one whitelisted operation that returns an image, and it is its own `execute` on
top of the search that found it — ten thumbnails is ten charges, so pick the few that
matter and say how many before running any. After a TikTok, Douyin, or Xiaohongshu
search there is no whitelisted follow-up that returns a cover: those platforms give the
field's titles and counts and stop there. Do not reach for a catalog operation that is
not on this list to close the gap.

Public social lookup has no `model` field. On a failure keep `error.code` and read the
platform wording in `error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user.

If the social tools are not exposed on this connection, say the baseline is not
available here and deliver the qualitative card from the cover and the user's context.
That is the ordinary shape of this route, not a degraded one.

Every call on this route goes through the bundled `scripts/mcp_client.py`, exactly as
the image calls do. Do not configure or call a host Beatra Connector, and do not fall
back to REST or OpenAPI.

## Confirming it

**Every lookup is confirmed on its own before it runs, without exception**, and it is
confirmed separately from the image confirmation in the workflow's later stage. The two
are different decisions about different amounts of money, and folding the lookup into
the generation approval would charge for it inside the window this package promises is
free.

State, before the call:

- what is being looked up, in plain words — the topic's field, one competitor's
  thumbnail, or the user's own recent covers — together with the `operation_key` it
  maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each search page and each thumbnail
  read as one;
- that the preflight card is delivered either way, at no cost.

Offer the search on its own first. Individual thumbnails are worth their price only once
the search has shown which entries are worth looking at.

## What a lookup can and cannot establish

This is the boundary that matters most in this package, because this package is about
what something *looks like*.

**A lookup returns numbers, titles, and URLs. It does not return eyes.** A thumbnail URL
sitting in a response is not a visual fact. The package's rule is unchanged and it now
matters more, not less: state a visual finding only about an image the host can actually
see. If the host cannot open a returned thumbnail, say the competitor's cover was found
but not viewed, and keep the baseline to the titles and counts that were genuinely
returned.

So, honestly divided:

- **The search** establishes the field: which entries rank for this topic, what their
  titles do, and what their public counts are. This is real evidence about the
  competitive context and it needs no image at all.
- **A thumbnail read** offers a specific competitor's cover for review — *if* the host
  can view it. When it can, the same card that reviews the user's cover reviews that
  one, and a comparison becomes a described observation rather than an impression.
- **The channel listing** establishes the user's own recent history — which videos, their
  titles, and their public counts. **YouTube only**; no other platform on this whitelist has
  an own-account history operation. It is the one baseline unambiguously about them, and it
  is where a drifted house style, a hook that used to be bigger, or a title-safe area that
  stopped being reserved becomes visible **once the covers themselves have been read**.
  Seeing them is the same `social.youtube.video.get` step as for a competitor — one `execute`
  and one charge per thumbnail — so pick the few that matter and say how many before running
  any. The listing on its own returns titles and counts; the catalog promises thumbnails from
  `social.youtube.video.get` and from nothing else.

## Carrying the baseline into the card

- A count read from a lookup is marked as looked up, with the time it was read. Public
  counts move; a number quoted without its read time ages badly.
- Anything the user supplied stays marked as supplied.
- Anything neither source produced is stated as missing. It is never estimated and never
  filled in from what covers in this category usually do.
- **A high count next to a cover does not mean the cover earned it.** Title, topic,
  timing, the channel's existing audience, and the platform's own distribution all move
  that number. Treat every read of "this cover worked" as inference, say what the
  evidence is, and say what would confirm it — the same treatment repeating across
  several strong entries, or the platform's own post-publication comparison test.
- **The baseline never becomes a forecast.** The package still delivers no numerical
  performance score, no CTR prediction, and no click guarantee for the user's cover.
  Real numbers about other people's videos make that temptation stronger, not weaker;
  the counts describe the field the cover is entering, and nothing about what it will do
  once it is there.
