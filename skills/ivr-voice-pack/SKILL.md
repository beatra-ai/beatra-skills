---
name: "ivr-voice-pack"
description: "Build a labeled IVR voice pack for a phone tree: welcome, menu, hold, transfer, after-hours, and error prompts in one consistent brand voice. This phone tree voice studio and hotline voiceover shop records about twelve default prompts as a voice menu you can drop into the switch. Use it for IVR prompts, call center voice, auto attendant audio, and customer-service phone menus."
---

# IVR Voice Pack

Give a phone tree a labeled prompt pack. One brand voice. Welcome, menu,
hold, transfer, after-hours, and error — then the rest of the tree.

## Scope and adjacent routes

Use this Skill when a hotline needs a labeled phone-tree voice pack the
switch can play.

Route hold music or a brand sting to `brand-jingle-studio` or
`livestream-bgm-pack`. Route generic narration to
`voiceover-narration-studio`.

## Inputs and defaults

The hard inputs are:

- the company or line name the caller should hear;
- the menu branches, or permission to write a default twelve-prompt tree;
- the target language;
- a pronunciation table whenever names, product terms, or extensions
  appear.

If those names exist and the table is empty, stop and collect the
readings. Do not invent a company or a menu. A speaker sample is
optional. Without a sample, choose a catalog voice with
`beatra.voices.list`.

Defaults:

- about twelve prompts covering welcome, main menu, hours, location,
  hold, transfer, queue, invalid key, repeat menu, after-hours, error,
  and goodbye;
- one brand voice for the whole pack;
- `language` omitted unless the user asks for a language or the tree
  mixes several;
- `model: "auto"` only when every voice-compatible live card supports the
  language; `format: "mp3"`; `speed: 1.0`;
- one synthesis call per prompt so a single prompt can be redone.

Keep each submitted `input` at or below 50,000 characters. Split on
sentence boundaries, never mid-sentence. Write short spoken sentences.

Planning and casting are free. Clone, if used, and each synthesis block
are paid.

Clone the brand voice only when the user asks. Confirm consent first: the
user must state this is their voice or that the speaker authorized this
cloning use. Access to a file is not consent. A suitable sample is
currently about 10 to 300 seconds, no larger than 20 MiB, and clean
single-speaker speech. Only after consent, inspect the sample and upload
it through the bundled client. Show the live `voice_clone` admission card
before any clone `client_request_id`: route `voice_clone`, tool
`beatra.voices.clone`, live price for one successful activated voice,
the provisional estimate, the 600-credit gift usually cannot start this
clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000 credits.
Do not recommend ¥198. Do not offer a free clone. Do not create
`client_request_id` until the user confirms they have topped up or already
have enough credits. Submit `beatra.voices.clone` exactly once:

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Hotline Voice",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-ivr-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that
`voice_id`.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the prompt ledger: slot ID, spoken text, and intended filename
   for welcome, menu, hold, transfer, after-hours, error, and the
   remaining default slots.
2. Call `beatra.voices.list` when a voice is still needed. Keep one
   `voice_id` for the whole pack. Never put a display name in `voice`.
3. Read the live `text_to_speech` card with `beatra.models.list`. Confirm
   the voice, the prompt count, weighted-character total, current
   estimate, and one `client_request_id` per prompt before the first paid
   TTS.
4. Synthesize each prompt with `beatra.speech.synthesize` exactly once.
   Poll each speech task with `beatra.tasks.get` until terminal.
5. Deliver labeled clips with slot IDs, plus actual duration, MIME type,
   URL or artifact, resolved model, and `billing.net_charged_credits`.
6. Review that every prompt carries the same voice and that names and
   extensions match the table. Redo only the changed prompt.

## Decisions that require confirmation

Confirm the voice and the pack estimate before the first paid TTS. A
changed prompt is one new paid block.

## Recovery

Recover a lost create response only with that prompt's identical frozen
payload and ID. A changed text is a new ID. Recover a lost task ID
through `beatra.tasks.list` and `beatra.tasks.get` before any resend.
Cancel only at the user's request. On `409`, keep polling the same task.
On `insufficient_balance` for clone or TTS, keep
`https://console.beatra.ai/topup` exact and retry the same frozen ID only
after the user says they have topped up.

## References by task

- Read [IVR voice-pack workflow](references/workflow.md) for slot cards,
  payloads, and review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
  for update controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.
Before ordinary commands it silently checks for a newer release at most once
every 24 hours per installation. Silent checks are enabled by default, and a
newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable
Beatra CDN path embedded for this package, channel, and locale. It verifies
the discovery data, archive, manifest, and every file's size and checksum
before replacement. It replaces only package-owned files and rejects
redirects, downgrades, wrong package/channel/locale/version data, unexpected
URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery
fail open: the current installation remains usable and the user's original
command continues. An update failure never authorizes retrying a paid
generation. The automatic-update choice persists across later commands for
this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```
