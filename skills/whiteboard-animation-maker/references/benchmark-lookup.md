# Looking up a benchmark video

When the user drops a share link, a note id, or says "teardown this one" /
"benchmark against this", read the public social data through this
connection's Beatra social tools. Never ask the user to download the video,
never use a headless browser, never use another scraper. This package is
**read-only**: it never posts, comments, or likes on the user's behalf.

Do not invent an `operation_key`. Live operations, arguments, and credit
prices come from `beatra.social.tools.search` and `beatra.social.tools.get`
on this connection. If those tools are not exposed, say the lookup is not
available on this connection and continue with what the user supplied.

This package uses only these operations (one "read a single item" per
platform, no searches, no comment threads):

```text
social.xiaohongshu.note.video.get   (Xiaohongshu video note; share_text or note_id; 60 credits)
social.douyin.video.get_by_url      (Douyin; share_url; 6 credits)
social.tiktok.video.get_by_url      (TikTok; share_url; 6 credits)
social.youtube.video.get            (YouTube; video_id; 6 credits)
social.instagram.post.get           (Instagram post or reel; code_or_url; 12 credits)
social.twitter.tweet.get            (X/Twitter; tweet_id; 6 credits)
```

A platform with no operation in this whitelist has no lookup — say so once,
in words, and never enumerate the gap as a list. Each operation returns one
result and is not paginated; there is no next-page charge on this whitelist.
Credit figures above are catalog facts; the price on the confirmation card is
always the one `beatra.social.tools.get` just returned.

## The route

1. Find the operation with `beatra.social.tools.search`. Free.

   ```bash
   printf '%s' '{"query":"video","platform":"xiaohongshu","capability_family":"content","limit":8}' \
     | python3 "$SKILL/scripts/mcp_client.py" call beatra.social.tools.search
   ```

2. Inspect it with `beatra.social.tools.get`. Free. Read the arguments and
   the credit price, and copy the `schema_hash` it just returned.

   ```bash
   printf '%s' '{"operation_key":"social.xiaohongshu.note.video.get"}' \
     | python3 "$SKILL/scripts/mcp_client.py" call beatra.social.tools.get
   ```

3. Show the lookup card (below), wait for the pass, then call
   `beatra.social.execute` once with `operation_key`, that `schema_hash`,
   `arguments`, and one fresh `client_request_id`. Never reuse an id across
   changed arguments.

4. Poll with `beatra.tasks.get` until terminal, per
   [tasks and results](tasks-and-results.md).

5. Save the returned video or cover URL into the draft's `ref/` directory:

   ```bash
   node "$SKILL/scripts/voice.mjs" fetch <url> -o <outdir>/ref/video.mp4
   ```

If the task returned captions or copy, save those into `ref/` too.

## The lookup card

Every lookup confirms on its own card, without exception, before it runs —
this is a separate card from any synthesis card. Show, in the user's
language:

1. Work — the link in their words, mapped to one `operation_key`.
2. Credits — the live price `beatra.social.tools.get` just returned.
3. Count — one paid lookup for this link (this whitelist is not paginated).
4. Identity — one new opaque `client_request_id`.
5. If we stop here — the concept-route film still works with no lookup.
6. If the balance is insufficient — relay the official message and the
   top-up URL, and wait; retry only after the user says they topped up.

A failed lookup keeps `error.code` and reads the platform wording in
`error.message`; do not call `beatra.models.list` and do not offer a
different model. Do not show `schema_hash` to the user. Report the lookup's
task id, terminal status, and charged credits alongside the teardown.

## What the teardown borrows

After fetching, extract frames from the benchmark and tear down what to
borrow and what to refuse. Borrow structure only — the dual text tracks and
one-object-per-sentence. Do not borrow color clip-art, photos of real hands,
or like-and-follow prompts; see [visual rules](visual-rules.md). Every
number carried out of the lookup (views, likes) is labelled with the date it
was read; user-supplied numbers stay labelled as supplied; missing numbers
are stated as missing, never estimated.

Recovery for an uncertain submit is reconcile-first: check
`beatra.tasks.list`, inspect the match with `beatra.tasks.get`, then replay
byte-identical arguments under the same `client_request_id`. Never auto-
retry, never mint a new id for the same request.
