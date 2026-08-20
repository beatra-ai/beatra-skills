# Reading Xiaohongshu

Everything this Skill knows about what already works on Xiaohongshu comes from the user.
When the connection exposes Beatra's public social lookup, it can read the platform
directly instead: the field shows how many cards the topic's strong notes use and what the first card does; a pasted reference note returns its images; the comments say which card's claim readers argued with; and the account's own recent notes keep the card style consistent.

It is optional and it is paid, and on this platform *paid* means something specific —
see the price below before offering it. A run that never touches it is a complete run,
and that is still the default.

## What this Skill may look up

Only these six operations. Do not invent an `operation_key`, and do not reach for one that
is not on this list even when `beatra.social.tools.search` returns it.

| Operation | What it gives |
| --- | --- |
| `social.xiaohongshu.note.search` | one page of notes matching a keyword |
| `social.xiaohongshu.note.image.get` | one image note, with its image URLs |
| `social.xiaohongshu.note.video.get` | one video note, with its cover and video URLs |
| `social.xiaohongshu.note.comments.list` | one page of a note's top-level comments |
| `social.xiaohongshu.user.get` | one public profile |
| `social.xiaohongshu.user.notes.list` | one page of an account's notes |

**Every one of them costs 60 credits.** That is the whole price list, and there is no cheap
operation on this platform to fall back on. Every equivalent read on TikTok costs 6 — ten
times less. Douyin is 6 for the post read, the comments, the profile and the posts list, but
**its keyword search is also 60**, so on that shape Xiaohongshu and Douyin cost the same.
Do not tell the user Xiaohongshu costs ten times Douyin without saying which read you mean.

Read the live price from `beatra.social.tools.get` and quote what it returns rather than
this number — but the shape of the number will not surprise you, and the user should hear
it before agreeing to anything.

Three consequences worth saying out loud to the user:

- **A three-step read is 180 credits.** The field, one reference note, and that note's
  comments are three separate `execute` calls.
- **Every page is another 60.** The search, the comments list and the account's notes are
  all paged, and the next page is a new call with a new charge, never a token on the same
  one. Never page automatically.
- **One note's images and that same note's comments are two calls.** Reading a note does
  not bring its comments along.

## Xiaohongshu only

This Skill publishes to Xiaohongshu, and the whitelist above is the whole of what it can
read. The rule is the whitelist, not a list of exceptions: **a platform with no operation
on this list cannot be looked up from here.** Douyin, WeChat Channels, Bilibili and the
rest are outside it. Never present a neighbouring platform's notes or figures as
Xiaohongshu's — they are wrong in a way the user cannot detect, and the user will publish
on them.

**The two topic operations are deliberately absent.** `social.xiaohongshu.topic.get` and
`social.xiaohongshu.topic.notes.list` both require an opaque `page_id`, and nothing on this
whitelist returns one. They are 60-credit calls this Skill could never legitimately make,
so they are not on the list. Do not ask the user for a `page_id`; search by keyword
instead.

## Turning what the user has into arguments

Never ask for an internal ID. Every operation here takes something a share link already
carries.

- **A pasted share link is `share_text`**, and it works for a note, that note's comments,
  a profile, and that profile's notes. An `xhslink` short link is fine.
- **A note is either an image note or a video note**, and the two operations are separate.
  Pick by what the link actually is. If that is not yet known, ask the user rather than
  paying 60 credits to find out and then 60 more for the other one.
- **The search takes a `keyword`** — the topic, product, category or place already in the
  brief, in the words a Xiaohongshu reader would use rather than a marketing phrase.
- **`note_id` and `user_id`** are accepted where the user genuinely has them, but the share
  link is the normal route and the one to ask for.
- **Ask the comments for the popular ones, every time.** `sort_strategy` defaults to
  `latest_v2`, which is newest first, so a call that omits it buys whatever happened to be
  posted most recently. Pass `sort_strategy: "like_count"`. The public copy promises the
  comments people actually engaged with, and the default does not deliver them — one page
  of the newest comments on a busy note is mostly noise, and it costs the same 60 credits
  as the page worth reading.
- **A second page is built from the first page's own response, never from anything else.**
  Carry back every paging field that response returned, and construct none of them. Today
  that means `cursor` for the account's notes, `cursor` and `index` for the comments, and
  `page` with `search_id` and `search_session_id` for the search — but read what actually
  came back rather than trusting this list, which has been wrong three times. Never carry
  a paging field over from a different query. If the first response returned none, that is
  the end of the results, not a reason to guess.

## The route

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and the credit
   price, and copy the `schema_hash` it just returned.
3. Show the user the `operation_key` and the credit price `tools.get` just returned, in
   plain words alongside them, and get a clear go-ahead. Then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`, `arguments`,
   and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.
5. Deliver what it returned and what it cost: the returned payload, its `task_id`, its
   terminal status, and `billing.net_charged_credits`. A lookup has no model, no canvas
   and no dimensions to report — but it charged, and the user sees the charge for
   everything else this Skill does.

If the create response is lost, reconcile with `beatra.tasks.list` and inspect the
candidate that matches the recorded `operation_key`, arguments and `schema_hash`
**before** repeating anything; only then replay the byte-identical arguments under the
same `client_request_id`. A changed argument, the next page included, is new paid work
with a new identifier and a new confirmation. At 60 credits a call, a careless retry is
the most expensive mistake available here.

Public social lookup has no `model` field. On a failure keep `error.code` and read the
platform wording in `error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user.

If the social tools are not exposed on this connection, say the lookup is not available
here and work from what the user brought. That is the ordinary shape of this route.

Every call goes through the bundled `scripts/mcp_client.py`. Do not configure or call a
host Beatra Connector, and do not fall back to REST or OpenAPI.

## Confirming it

**Every lookup is confirmed on its own before it runs, without exception.** State, before
the call:

- what is being looked up, in plain words, together with the `operation_key` it maps to;
- the credit price `beatra.social.tools.get` just returned;
- how many lookups the plan contains, counting each page and each note as its own charge,
  and the total;
- that the Skill's own deliverable arrives either way, at no cost.

Offer one read first, not a plan of four. The user can always ask for more, and at 60
credits each the difference between one call and four is the difference between a small
decision and a large one.

## What a lookup can and cannot settle

**A returned image URL is not a viewed image.** The note operations return URLs; they do
not give the host eyes. State a visual finding only about an image the host can actually
open. When it cannot, say the note was found but its images were not seen, and keep the
read to the text and the counts that genuinely came back.

**Comments are the audience's words, not proof of cause.** They are the best evidence
available for what readers noticed and objected to. They are not evidence for why a note
performed. Mark that as inference, quote what supports it, and say what would confirm it.

## Carrying it into the work

- A count read from a lookup is marked as looked up, with the time it was read. Public
  counts move.
- Anything the user supplied stays marked as supplied.
- Anything neither produced is stated as missing. It is never estimated, and never carried
  in from what notes in this category usually do.
- **A looked-up number is not a more certain number than a pasted one, only a differently
  sourced one.** It can be stale or inflated. Label it and move on.
- Another account's actual images, wording and captions stay theirs. What comes out of
  this Skill is the user's own note built on what the field taught, not a copy of it.
