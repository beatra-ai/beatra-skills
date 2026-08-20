# Clone execution and recovery

## Resolve the live model and price

Read the available voice-clone card with `beatra.models.list`. Prefer
`model: "auto"`. Under the current contract, automatic selection is not
request-dependent and the omitted request has one declared default, so use
that resolved model and its single current price. If a future live card makes
selection request-dependent or leaves multiple candidates, show the honest
price range rather than guessing a route.

Use the exact live billing contract. The current clone meter and unit are
`task`; the basis is `successful_activated_voice`; the quantity for one clone
is `1`. Apply the returned estimate formula, unit price and scale literally.
Planning or a price lookup creates no clone and no charge.

## Freeze and approve one clone card

The card should identify the sample source, readiness state, authorization
fact, `display_name`, selected `model`, optional BCP-47 `language`, current
sample limits, exact estimate and the fact that approval covers one billable
clone. Do not expose unnecessary sample or consent detail.

Only a current approval of this exact card authorizes execution. A consent
statement alone is not paid approval; paid approval alone does not replace the
required consent statement. Do not ask again when the current user request
already clearly approves the unchanged card.

## Submit one exact request

Create one new, opaque, locally stored `client_request_id`. Invoke the tool by
name through the bundled client, with the JSON body on standard input:

```bash
python3 scripts/mcp_client.py call beatra.voices.clone
```

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Approved display name",
  "consent_attested": true,
  "model": "auto",
  "language": "optional-BCP-47",
  "client_request_id": "new-local-opaque-id"
}
```

The sample, display name, consent attestation and request ID are required.
`model` and `language` are optional; omit an unknown language. Submit once and
store the returned `task_id` immediately.

## Poll, reconcile and cancel without duplication

For a known task, call `beatra.tasks.get` until the returned task is terminal.
A slow, queued or running task remains the same work. Call
`beatra.tasks.cancel` only at the user's request; if cancellation is rejected
or not confirmed, continue polling that task.

If the initial transport or task-creation response is uncertain, keep the
original JSON and local request ID. If the task ID is lost, call
`beatra.tasks.list` for the voice-clone capability, follow every
`next_cursor`, and verify plausible candidates with `beatra.tasks.get`. The
remote list/get envelope does not filter on or return the local
`client_request_id`, so match by the relevant time window, capability and
returned request/output facts; never pretend the display name proves identity.

Only when transport or task creation is still genuinely uncertain may the
field-for-field identical JSON be replayed with the same local request ID. A
new sample, name, model or language is different paid work and needs a new
card, approval and request ID. Do not automatically retry a terminal failed or
canceled task, even if its error says it may be retryable.

## Preserve the reusable voice result

On success, retain actual `task_id`, status, output type, `voice_id`, display
name, resolved model, usage, billing and returned links. Lead the customer
response with the named voice being ready, while preserving the exact opaque
`voice_id` in the handoff. A display name is not a technical substitute or
uniqueness proof.

For a later session, use `beatra.voices.list` with `category: "cloned"` and
match the exact voice ID. Preserve its `compatible_models` for subsequent
speech planning. Do not re-clone because a previous conversation lost the
handle.

For failure, report provider-neutral `TaskError` fields and actionable facts.
Use returned charged, refunded and net billing values; preserve absent or
unsettled values as unknown rather than zero. Never infer a provider, refund,
activation, similarity, persistence or retention result.
