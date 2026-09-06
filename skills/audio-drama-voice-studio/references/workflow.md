# Audio drama workflow

## Build the cast sheet

Read the script and list every speaking part before any paid call. For each
character record the name as it appears in the script, age and temperament, how
they should sound relative to the others, and whether they narrate as well as
speak. Add a narrator row when the script carries narration.

Then split the script into speech blocks. One block belongs to exactly one
character and holds the text that character says in one continuous turn. Keep
blocks separate even when two turns are adjacent, because one call per block is
what lets a single line be redone later without paying for the scene again.

Number the blocks in script order and never reorder them.

## Assign one voice per character

Call `beatra.voices.list` only when a voice is still needed or the user asks to
browse or compare, and apply only filters the user actually supplied:

```bash
python3 scripts/mcp_client.py call beatra.voices.list
```

```json
{}
```

Assign one opaque voice ID per character and keep the assignment fixed for the
whole piece. Contrast matters more than any single voice: pick voices that stay
distinguishable from each other in the ranges the script actually uses.

Read the live rate before quoting anything:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "text_to_speech"}
```

Take `estimate_formula`, `unit_price_credits`, and `scale` from the returned
card rather than from memory.

## Synthesize one block at a time

```bash
python3 scripts/mcp_client.py call beatra.speech.synthesize
```

```json
{"voice": "<opaque voice_id>", "input": "我早说过这扇门不该开。", "client_request_id": "opaque-block-07-id"}
```

Include `model`, `language`, or delivery controls only when they matter to the
requested result and the current model interface supports them. Omit `language`
for automatic detection unless the user requested a language or the script mixes
several. Omit `model` by default so Beatra can route.

Submit each block exactly once with its own stable opaque `client_request_id`
and poll that block's own task. Never reuse an ID across blocks.

## Estimate the cost honestly

Speech is charged linearly per 1,000 weighted characters: each Han ideograph
counts as two and every other character counts as one. A block below 1,000
weighted characters is charged for its actual weighted characters rather than a
full block. Count the exact final text of every block, apply the live card's
formula, and show the total before the first submission. Terminal usage and
billing are the final truth.

## Use a cloned voice

Use `beatra.voices.clone` only when the user wants a reusable voice from a
sample and explicitly confirms they own the voice or have the owner's
permission. Possession of an audio file is not consent.

1. Obtain that explicit confirmation before uploading a local sample.
2. Read the live voice-clone card for the current sample constraints and the
   one-off activation price. Never quote that price from memory:

   ```bash
   python3 scripts/mcp_client.py call beatra.models.list
   ```

   ```json
   {"capability": "voice_clone"}
   ```

3. Upload with `python3 scripts/mcp_client.py upload <path> --mime-type <type>`
   and reuse the returned artifact.
4. Show the six-field clone production card and wait. Consent is not the card.
   After the user confirms ownership or permission, show:

   1. Work — one authorized voice sample (`beatra.voices.clone`) for a named
      character.
   2. Credits — the live `voice_clone` price just read. Do not reuse a
      remembered number.
   3. Count — one paid clone call for this sample.
   4. Identity — one new opaque `client_request_id`.
   5. If we stop here — the cast sheet remains usable with catalog voices.
   6. If the balance is insufficient — relay the official message and its
      top-up URL exactly. Translate the prose; keep the URL. Do not retry
      until the user says they have topped up.

   Do not offer a free clone or a free sample that replaces the clone. Do not
   make a balance read a required step before this card. On
   `insufficient_balance`, relay the returned public message, keep the URL
   exact, and retry the same frozen `client_request_id` only after the user
   says they have topped up.
5. Set `consent_attested: true` only after the user confirms the six-field
   clone card, then submit once:

   ```bash
   python3 scripts/mcp_client.py call beatra.voices.clone
   ```

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Approved display name",
     "consent_attested": true,
     "client_request_id": "new-local-opaque-id"
   }
   ```

6. Poll the same task; do not create another clone while one is queued or
   running.

Omit the optional `language` unless the user named one. A successful result is
an already-activated voice: deliver every returned voice field, including
`type`, `voice_id`, `status`, and `display_name`, and add that voice to the cast
sheet like any other. Cloning has one fixed
charge on successful activation, confirmed separately from the synthesis
estimate; later synthesis is billed per weighted character as usual.

## Poll, recover, and cancel

Keep a private ledger row per block: block number, character, voice ID, exact
text, stable request ID, approval, creation time, create response, task ID, and
terminal result. Record each returned task ID immediately and call
`beatra.tasks.get` until `succeeded`, `failed`, or `canceled`. `queued` and
`running` mean wait, not retry.

If a create response is lost, retry only the identical frozen payload with the
same ID. If a task ID is lost, call `beatra.tasks.list` with the capability of
that call (`text_to_speech` for synthesis, `voice_clone` for a clone), follow
every returned `next_cursor` needed to cover the submission window, call
`beatra.tasks.get` on plausible candidates, and match returned facts against
the ledger; an ambiguous match stops submission. A search that stops before the
window is covered is what precedes a duplicate paid submission. If the request
ID itself is lost, do not invent a new one and do not replay.

Cancel only at the user's request. Call `beatra.tasks.cancel` once and confirm a
terminal state with `beatra.tasks.get`. On `409`, keep polling the same task.

When one block fails and the rest succeed, recover that block alone; the
delivered blocks stay valid.

## Deliver and review real results

Deliver the blocks in script order, numbered and labelled with the speaking
character, so the sequence can be assembled in the user's editor exactly as
scripted. For each block report the actual returned duration, size, MIME type,
and URL or artifact ID, plus the resolved model and
`billing.net_charged_credits`.

Review only audio the host Agent can actually play. Check that each block
carries the voice assigned to its character, that the characters stay
distinguishable from one another, that pronunciation and pacing suit the line,
and that the block order matches the script. Do not claim to have judged
delivery or performance when the host cannot hear the file — say so instead.

When one focused revision would help, name the single block and the single
change, and wait for a new paid approval.

## Balance and deductions

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Live prices still come from
`beatra.models.list`, never from ledger amounts. Do not make a balance read a
required step before every paid submit.
