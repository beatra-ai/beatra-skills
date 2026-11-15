# Clone execution and recovery

## Discover all three cloning capability routes

Query `beatra.models.list` with `include_activation_required: true`:

```bash
python3 scripts/mcp_client.py call beatra.models.list
```

```json
{"capability": "voice_clone", "include_activation_required": true}
```

Never name upstream providers or expose internal model IDs. Explain routes by
their live capabilities:

1. **Fast everyday clone (`model: "auto"`):** Immediate `status: "ready"`,
   supports optional `prompt` (`sample` < 8 s + verbatim `text`) and profile
   metadata (`gender`, `age_group`, `use_case`, `persona`).
2. **10-language expressive, dialogue, and speech-to-speech clone:** Chosen
   from the live `{"capability": "voice_clone"}` cards when the user needs
   10-language expressive output, `supports_dialogue: true`, or
   `supports_speech_to_speech: true` (`beatra.speech.convert`). Immediate
   `status: "ready"`.
3. **Free-trial training + paid activation precision clone:** Surfaced when
   `include_activation_required: true`. Creates `status: "pending_activation"`
   so the user can preview the trained voice before deciding whether to confirm
   and pay for permanent activation via `beatra.voices.activate`.

Use live pricing metadata (`meter`, `unit`, `billing_basis`, `unit_price_credits`,
`scale`, `estimate_formula`, or activation quote fields). Never hardcode credit
numbers, treat promotional balances as guaranteed sufficient, or quote remembered prices.

## Freeze and approve one six-field clone card

Before creating `client_request_id` or submitting `beatra.voices.clone`, show
the six-field production card:

1. **Work:** chosen cloning capability route, `beatra.voices.clone`, sample
   reference, `display_name`, and optional profile metadata.
2. **Credits:** live `beatra.models.list` estimate (or free-trial training +
   activation quote terms for route 3). Keep `beatra.wallet.get` optional for
   balance Q&A; never require balance pre-confirmation as a mandatory gate.
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

After approval, create one new, opaque, locally stored `client_request_id` and
invoke `beatra.voices.clone`:

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

## Mandatory confirmation: Activate a pending trial clone (`beatra.voices.activate`)

If `beatra.voices.clone` returns `status: "pending_activation"`:

1. Read embedded `activation.quote` (`price_credits` / `confirm_credits`, terms,
   `preview_url`, and 24-hour `confirmation_token` expiry). If expired
   (`price_confirmation_required`) or missing, call `beatra.voices.activate` with
   `voice_id` and a `client_request_id` (**omit `confirmation_token`**) for a
   **free** refreshed quote and token.
2. Present the quote and terms to the user and wait for explicit approval of both
   the credit amount and terms.
3. Call `beatra.voices.activate` with `voice_id`, `confirmation_token`,
   `confirm_credits`, and a fresh `client_request_id`:

```bash
python3 scripts/mcp_client.py call beatra.voices.activate
```

```json
{
  "voice_id": "voice_...",
  "confirmation_token": "tok_...",
  "confirm_credits": 1,
  "client_request_id": "new-local-activate-id"
}
```

(Pass the exact live quoted `confirm_credits`, never a remembered figure.)

## Mandatory confirmation: Two-step permanent deletion (`beatra.voices.delete`)

Deleting a voice permanently removes it (`deleted: true` cannot be reversed) and
relinquishes an active cloned voice slot:

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
