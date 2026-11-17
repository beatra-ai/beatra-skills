# Price a whole job

Use this when one request becomes more than 3 paid calls, or when one kind of
paid call leads to another, such as narration followed by video, or clips
followed by a join. The user should know the whole price before the first
charge, not after the narration is already paid for. A step whose result the
user must accept before the next one is planned, such as a text-led video's
opening frame, keeps its own card.

1. List the planned calls. Read each kind's live price from
   `beatra.models.list` and pick the option that matches the output you will
   request: image cards nest options under `pricing.options`, a video card's
   `pricing` is a list, and speech and music have one `pricing` object. Video
   is priced per second at the chosen resolution, so multiply by each clip's
   `duration`.
2. Speech is priced on weighted characters, and a Chinese character counts as
   two. Send each script part to `beatra.speech.validate`, which is free, and
   use its `price_credits`.
3. If the card carries an `account_offer`, count the free video once, and only
   for a clip inside its limits.
4. Read `beatra.wallet.get` once. It returns the balance,
   `concurrent_task_limit`, and `topup_url`.
5. Show one production card for the whole job, with all six fields: the work;
   the live price, count, and subtotal of each kind of call; the estimated
   total; that each call gets its own `client_request_id`, minted once that
   call's payload is final and kept in your notes, never shown; what the user
   keeps if they stop; and what happens if the balance fails. The
   total is an estimate; the task results decide the real charge. A paid
   social lookup keeps its own card.
6. If the balance does not cover the total, say the shortfall and which parts
   of the job it covers, with `topup_url`. Ask whether to top up first or make a shorter
   version the balance covers. Start a job the balance cannot finish only when
   the user chooses that knowingly. Do not ask the user to confirm their
   balance.
7. One confirmation covers the listed calls at the listed total. A failed call
   is not covered: ask again before running it again. A balance refusal is not
   a failure (steps 9 and 10).
8. Keep within `concurrent_task_limit`. Send the next call when one finishes.
9. The first `insufficient_balance` stops the whole job. Report which items
   finished and which did not, and relay the returned message in the user's
   language with its top-up URL unchanged.
10. Resume only the unfinished items after the user says they have topped up,
    without a new card. A refused item keeps its `client_request_id` and
    arguments.
