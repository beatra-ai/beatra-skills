---
name: "game-script-voice-pack"
description: "Turn a murder-mystery or indie-game script into a labeled multi-character voice pack. This AI game voice pack and character dialogue studio casts one consistent voice per role, records every line in script order, and delivers numbered clips with character IDs ready for an engine or tabletop production. Use it for game voice acting, indie game dialogue, murder mystery voiceover, multi character TTS, NPC voice acting, interactive story audio, tabletop voice pack work, and scripted game audio."
---

# Game Script Voice Pack

Give a game or murder-mystery script a cast and a labeled voice pack. One
voice per character. Every line stays in script order.

## Scope and adjacent routes

Use this Skill when a murder-mystery script, indie-game dialogue tree,
interactive story, or training scene needs many speaking roles delivered as
importable clips.

Route a literary audio drama or radio play to `audio-drama-voice-studio`.
Route a single-narrator course to `course-narration-studio`. Route creating
only a reusable voice to `voice-cloning-studio`. Route a talking-head video
to `talking-avatar-video`.

## Inputs and defaults

The one hard input is the script text with speaker attribution. Character
labels alone are not a script: do not invent dialogue. Reuse genre, era,
tone, language, and already-chosen voices.

Defaults:

- one voice per named character, plus a narrator when the script has one;
- speaker order follows the script;
- `language` omitted unless the user asks for a language or the script
  mixes several;
- one synthesis call per speech block so a single line can be redone.

Casting is free. Each synthesis block is paid. Clone a character voice
only when the user asks. Confirm consent first: the user must state this
is their voice or that the speaker authorized this cloning use. Access to
a file is not consent. A suitable sample is clean single-speaker speech
within the length and size limits on the `voice_clone` card. Only
after consent, inspect the sample and upload it through the bundled
client. Show the live `voice_clone` admission card before any clone
`client_request_id`: route `voice_clone`, tool `beatra.voices.clone`, live
price for one successful clone, the provisional estimate, and what happens if
the balance is short. Create the clone's `client_request_id` only after the
user approves this card, then submit `beatra.voices.clone` exactly once and
handle any refusal per
[Billing, errors, and recovery](references/billing-errors-and-recovery.md):

```json
{
  "sample": {"type": "artifact", "artifact_id": "artifact_..."},
  "display_name": "Character Name",
  "consent_attested": true,
  "model": "auto",
  "client_request_id": "opaque-character-clone"
}
```

Poll with `beatra.tasks.get` until terminal, then freeze that
character's `voice_id`. Offer the free clone preview only when the user asks to hear the
voice before paying, or when a paid clone is refused and the refusal offers it.
If the result has status `pending_activation`, present the preview and the
live activation price, and call `beatra.voices.activate` once after the user agrees.

## Golden path

1. Build the cast sheet and the line ledger: character ID, line ID, text,
   and intended filename.
2. Call `beatra.voices.list` when a voice is still needed. Keep each
   character's `voice_id` fixed for the whole pack. Never put a display
   name in `voice`.
3. Read the live `text_to_speech` card with `beatra.models.list`. Confirm
   the cast, block count, weighted-character total, current estimate, and
   one `client_request_id` per block.
4. Synthesize each block with `beatra.speech.synthesize` exactly once
   through the bundled `scripts/mcp_client.py`. Poll each speech task with
   `beatra.tasks.get` until terminal. Do not configure a host
   Beatra Connector. Do not use REST/OpenAPI as a fallback.
5. Deliver numbered clips in script order, each labeled with character ID
   and line ID, plus actual duration, MIME type, URL or artifact, resolved
   model, and `billing.net_charged_credits`.
6. Review that each block carries the assigned voice and that order matches
   the script. Redo only the changed line.

## Decisions that require confirmation

Confirm the cast sheet and the pack estimate before the first paid call.
A changed line is one new paid block.

## Recovery

Recover a lost create response only with that block's identical payload
and ID. Recover a lost task ID through `beatra.tasks.list` and
`beatra.tasks.get`. Cancel only at the user's request. On
`insufficient_balance` for clone or TTS, keep the top-up URL inside the
balance error exact and retry the same frozen ID only after the user
says they have topped up. If the refusal names another way forward, present
it too and follow
[Billing, errors, and recovery](references/billing-errors-and-recovery.md).

## Account balance

When the user asks how many credits remain or whether a live estimate fits,
call `beatra.wallet.get`. When they ask what was charged, call
`beatra.wallet.ledger`. Both are read-only. Do not invent an account-balance or
top-up tool. Do not make `wallet.get` a required step before every paid submit.

When a model card comes back carrying a `top_up` block, relay its tiers as the
card lists them and in that order. Do not rank them, do not talk one down, and
do not pick one for the user. Which tier suits them is their call, made on
the wallet page with the whole list in front of them. Never quote a tier from
memory.

## References by task

- Read [Game voice-pack workflow](references/workflow.md) for cast sheets,
  line IDs, payloads, and review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization needs attention.
- Read [Installation registration](references/installation-registration.md)
  for first-use registration.
- Read [Tasks and results](references/tasks-and-results.md) and
  [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for task and billing facts.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package.

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation.

## Updates and security

This Skill runs only the files installed with it and leaves them unchanged while
it runs; it never downloads or executes other code. It talks to Beatra's official
services over HTTPS, and a file you choose to upload goes only to the one-time
upload address Beatra issues for it.

Once a day at most, the bundled client reads Beatra's public version list. When
the store or tool you installed from has a newer version, it prints one line with
the command that updates it there. Updating stays your choice, through that store
or tool. See [updates and security](references/updates-and-security.md).
