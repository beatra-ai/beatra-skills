# Reel lookup

Competitor Reel composition normally comes from the seller. This
route exists when they give a public Instagram Reel URL, a
competitor username, or a search keyword, and this connection can
read it.

Do not invent an `operation_key`. Live operations, arguments, and
credit prices come from `beatra.social.tools.search` and
`beatra.social.tools.get` on this connection. If those tools are
not exposed, say the lookup is not available on this connection
and continue with the written composition notes.

This package uses only these operations:

- `social.instagram.user.search`
- `social.instagram.user.get`
- `social.instagram.user.reels.list`
- `social.instagram.post.get`
- `social.instagram.reel.search`

If the platform has no Reel operation in this list, it has no
lookup.

1. Find the operation with `beatra.social.tools.search`. Free.
2. Inspect it with `beatra.social.tools.get`. Free. Read the
   arguments and the credit price, and copy the `schema_hash` it
   just returned.
3. Show the six-field lookup production card, then call
   `beatra.social.execute` once with `operation_key`, that
   `schema_hash`, `arguments`, and one `client_request_id`.
4. Poll with `beatra.tasks.get` until terminal.

One `execute` is one prepaid lookup. The next page of Reels is
another `execute` and another charge. Never page automatically.

Public social lookup has no `model` field. On a failed lookup
keep `error.code` and read the platform wording in
`error.message`. Do not call `beatra.models.list` for a lookup.
Do not show `schema_hash` to the seller.

## Arguments from a Reel or account

Never ask for an internal ID the seller would have to go find.

- A pasted Reel URL is `code_or_url` on `post.get`.
- A handle or profile URL is `username` on `user.get` and
  `user.reels.list`. Strip a leading `@`.
- If only a brand name is given, `user.search` takes `keyword`.
  Pick the matching public account the seller confirms, then use
  that username on the next card.
- A keyword search for public Reels is `keyword` on
  `reel.search`.
- `user_id` may be reused when a prior confirmed payload already
  returned it. Do not ask the seller to look it up.
- `pagination_token` comes only from the previous confirmed list
  payload. The next page is a new card.

A confirmed lookup does not authorize animate.
