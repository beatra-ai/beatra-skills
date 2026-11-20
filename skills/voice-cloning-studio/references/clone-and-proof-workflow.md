# Clone execution and recovery

## Select the clone model

Select the clone model as described in
[Speech, voices, cloning, and audio finishing](speech-and-audio.md) §5.

Never name upstream providers or expose internal model IDs; describe the choice
by what it does for the job. When the cloned voice will speak in multi-speaker
dialogue, be the target of speech-to-speech conversion, or carry expressive
reads, select the clone card that states it and lists the job's language;
other work keeps the default.

Use live pricing metadata (`meter`, `unit`, `billing_basis`, `unit_price_credits`,
`scale`, `estimate_formula`, or activation price fields). Never hardcode credit
numbers, treat promotional balances as guaranteed sufficient, or quote remembered prices.

## Freeze and approve one six-field clone card

Before creating `client_request_id` or submitting `beatra.voices.clone`, show
the six-field production card with the live clone price:

1. **Work:** the voice being cloned, described by what the selected clone does
   for the job (no model ID), `beatra.voices.clone`, sample reference,
   `display_name`, and optional profile metadata.
2. **Credits:** live `beatra.models.list` estimate. Keep `beatra.wallet.get`
   optional for balance Q&A; never require balance pre-confirmation as a
   mandatory gate.
3. **Count:** one cloning request (`quantity: 1`).
4. **Identity:** fresh opaque local `client_request_id` minted once final.
5. **If stop:** state what free work remains usable at zero extra charge (consent
   check, readiness review, quote; nothing spent if this is the first paid step).
6. **If balance short:** relay Beatra's official `insufficient_balance` message
   and verbatim top-up URL (`topup_url`), and wait until the user confirms they
   have topped up before retrying with the same frozen `client_request_id`.

Consent alone is not paid approval; paid approval never replaces consent.
Planning, comparison, or "clone it now" never substitutes for explicit confirmation
after seeing live pricing.

## Submit one exact request

After approval, create one new, opaque, locally stored `client_request_id`,
invoke `beatra.voices.clone` once, and handle any refusal per
[Billing, errors, and recovery](billing-errors-and-recovery.md):

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

Include optional `prompt`, `gender`, `age_group`, `use_case`, or `persona` only
when agreed in the card; omit unknown `language`. Store the returned `task_id`
immediately and poll with `beatra.tasks.get`.

## Mandatory confirmation: Activate a pending clone (`beatra.voices.activate`)

When a clone result or a listed voice has status `pending_activation`, follow §5
Step E of [Speech, voices, cloning, and audio finishing](speech-and-audio.md)
before using the voice. After the user approves the live activation price, a
single activation call takes this shape:

```bash
python3 scripts/mcp_client.py call beatra.voices.activate
```

```json
{
  "voice_id": "voice_...",
  "client_request_id": "new-local-activate-id"
}
```

## Mandatory confirmation: Two-step permanent deletion (`beatra.voices.delete`)

Deleting a cloned voice permanently removes it (`deleted: true` cannot be
reversed; using that voice again means cloning it again):

1. Call `beatra.voices.delete` with `voice_id` only (**omit `confirmation_token`**).
2. Present `voice`, `paid_slot_warning`, `irreversible_notice`, and the 15-minute
   `confirmation_token` expiry.
3. Only after the user explicitly confirms irreversible deletion in a reply, call
   `beatra.voices.delete` with `voice_id` and `confirmation_token`. If 15 minutes
   expire before confirmation (`invalid_request` on `confirmation_token`), repeat step 1.

## Poll, reconcile, and preserve the voice handle

For a known task, poll `beatra.tasks.get` until terminal. A slow, queued, or
running task is still the same job. Call `beatra.tasks.cancel` only when the
user requests it; on conflict, continue polling the same task.

If `task_id` was lost, paginate `beatra.tasks.list` for `capability: "voice_clone"`
across every `next_cursor` and verify candidates with `beatra.tasks.get`.
`client_request_id` stays local-only and is not filterable remotely. Replay the
field-for-field identical JSON with the same `client_request_id` only while
creation remains genuinely uncertain (if `request_in_progress`, poll instead);
any changed argument requires a new card, confirmation, and new ID. Never
auto-retry failed or canceled tasks.

On success, preserve the opaque `voice_id`, `status`, `display_name`, resolved
capabilities, usage, and actual billing (`null`/missing values stay unknown,
never zero). Never claim auditioning, similarity, or retention unless verified.
