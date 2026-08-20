# Long-form and multilingual production

## Build one ordered ledger

Split only at natural chapter, lesson, scene, or paragraph boundaries. One
request accepts at most 50,000 characters, but the approved editorial
boundaries and review cost normally justify smaller segments. Record:

- route, language, segment number, title, and exact approved text;
- exact `voice_id`, possible auto set or explicit model, format, and controls;
- weighted-character count, current formula, price or range, and approval;
- local `client_request_id`, returned `task_id`, terminal state, artifact,
  and billing facts when they exist.

Every segment is one logical paid request. Generate IDs only after approval.
Do not submit the next batch merely because the ledger has been prepared.

## Pilot a long-form route

Choose one representative passage from text the user supplied and approved.
The pilot card covers only that passage. After the returned audio is reviewed
for narrator fit, readings, pacing, tone, and destination, freeze any accepted
settings.

Then present the remaining ordered segment count, exact or ranged total
estimate, paid-call count, and delivery order for a separate approval. A pilot
approval never authorizes the remainder. Keep a single accepted narrator and
settings unless the user explicitly approves a route change.

## Pilot every distinct multilingual route

The target-language texts must already be supplied or shown and approved.
This workflow does not silently translate, invent, or merge scripts.

Define a route by:

- exact voice ID;
- supplied BCP-47 language;
- ordered possible auto set or explicit model;
- controls and output format.

Validate both layers: the selected voice must list the language, and the live
model decision must follow `constraints.supported_languages`. One voice may
serve several languages only when each route passes independently.

Run one approved pilot for every distinct route. A pilot in one language or
with one voice/model route does not authorize another. After all required
pilots are accepted, present the complete language-by-segment remainder,
weighted totals, price per route, total range or upper bound, paid-call count,
and delivery order for separate approval.

## Submit in controlled order

Submit each approved JSON once and poll its task to terminal before moving
beyond the concurrency and order the user approved. Keep results grouped by
route and language, then ordered by segment:

```text
<language-or-route>/01-<segment>
<language-or-route>/02-<segment>
```

Do not represent the audio as synchronized, mixed, merged, or published.
Deliver ready-to-edit artifacts with their actual media facts.

## Continue after interruption

Start from the ledger. Poll every known `task_id` before looking for more work.
For a lost task ID, call `beatra.tasks.list` with
`capability: "text_to_speech"` and paginate through every `next_cursor` needed
to cover the relevant window. Verify candidates with `beatra.tasks.get`,
comparing capability, time, returned input, voice, settings, and task facts.

The local `client_request_id` is not a remote filter or returned task field.
Do not resubmit while the original may exist. Reuse it only for an identical
JSON replay when task creation remains genuinely uncertain after
reconciliation. Any changed text, language, voice, model, or control is a new
paid request with a new card, approval, and ID.

Resume only ledger rows with no completed artifact and no known queued or
running task. Accepted rows remain final. If the user requests cancellation,
call `beatra.tasks.cancel` for the exact task; a conflict or unconfirmed stop
means continue polling that same task rather than create a replacement.

## Correct only the approved segment

For a misread word, correct the supplied reading and show the changed segment.
For pace or tone, adjust the smallest relevant control. Present the affected
text, new settings, incremental estimate, and one new paid request. After
approval, use a new identity and preserve every accepted segment.
