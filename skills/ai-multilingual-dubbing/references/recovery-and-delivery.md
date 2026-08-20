# Recovery and delivery

## One cell, one paid operation

Every approved locale/segment is one logical speech operation. Create one
stable `client_request_id`, submit `beatra.speech.synthesize` exactly once,
and retain the matrix entry that links the operation to its locale and segment.
Use that same ID only if the identical payload must be retried after the
submission response was lost. Any text, voice, language tag, model, speed,
format, pitch, volume, sample rate, or emotion change creates a new operation,
new ID, and needs explicit user approval.

## Poll before retrying

After acceptance, use `beatra.tasks.get` until the task is terminal. Do not
submit a duplicate because it is queued or running. If the Agent lost the task
ID, call `beatra.tasks.list` for recent work with the `text_to_speech`
capability, call `beatra.tasks.get` for every plausible candidate, and compare
its complete `task.input`, resolved model, and timing with the saved matrix cell
before a new paid submission. A list item does not contain enough input detail
to identify the original request. A missing exact match is not proof of a safe
retry unless the previous attempt and matrix record have been checked.

If the user asks to stop a known queued/running task, call
`beatra.tasks.cancel`. A cancellation conflict means the remote work may still
be progressing; return to polling the same task. Do not treat a cancel request
as a completed cancellation.

## Terminal outcomes

- **Succeeded:** attach `task.output.audio.url` and its returned artifact ID to
  the locale/segment delivery record, then report MIME type, size, sample rate
  when present, `task.output.audio.duration_seconds`, task identity, and actual
  billing. Run the listening checklist only when the host can actually play the
  audio; otherwise label listening review incomplete instead of inventing it.
- **Failed:** explain the actual returned error in user language and offer the
  smallest recovery that fits it. Never invent a reason, a refund guarantee,
  or a provider workaround.
- **Canceled:** keep already accepted cells untouched. A new request is only
  made when the user decides to resume and confirms its changed or resumed
  scope.

## Delivery format

Present results grouped first by locale, then in segment order. For every
locale, summarize its audience direction, cast voice, delivery choice, and
which segments are accepted, awaiting review, or need a focused correction.
Include each task ID as a compact recovery handle, but omit raw request payloads,
client request IDs, and polling diagnostics unless the user asks to debug or
integrate the call. Do not claim video synchronization, captions, audio mixing,
translation, or exact duration matching; those are outside this package's
text-to-speech workflow.
