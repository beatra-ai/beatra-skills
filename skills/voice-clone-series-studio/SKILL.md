---
name: "voice-clone-series-studio"
description: "Clone one voice you own and keep using it for a series of episodes, updates, and lessons. This voice cloning and AI voice clone studio for series narration creates a reusable AI voice, custom AI voice, and brand voice clone from a clean sample, then turns each new script into narration in that same voice so a podcast, course, or creator series stays consistent. Use it to clone my voice, build a podcast voice clone, and generate the next episode voiceover or recurring voiceover without recasting."
---

# Voice Clone Series Studio

Create one authorized reusable voice, then keep synthesizing new episodes in
that same voice. The clone is the setup. The series ledger is the product.

## Scope and adjacent routes

Use this Skill when the user wants their own voice, or an authorized brand
voice, reused across a podcast, course, creator series, or recurring update.

Route a one-off clone with no series plan to `voice-cloning-studio`. Route a
whole book or one-narrator manuscript to `ai-audiobook-narration`. Route a
lecture pack without a clone to `course-narration-studio`. Route a
multi-character script to `audio-drama-voice-studio` or
`game-script-voice-pack`. Route a talking-head video to
`founder-ip-avatar-studio` or `talking-avatar-video`.

## Inputs and defaults

The hard inputs are:

- a clean single-speaker sample, or an already activated `voice_id`;
- explicit consent that this is the user's voice or that the speaker
  authorized this cloning use. Access to a file is not consent;
- the first episode script, or the next episode script once the voice exists.

A suitable sample is currently about 10 to 300 seconds, no larger than
20 MiB, and clean single-speaker speech. Treat live `voice_clone`
constraints as truth.

Reuse the display name, language hint, series name, and pronunciation table.
Ask only for a missing hard input.

A short test reading is optional, separate paid work, and never part of
clone approval.

## Golden path

1. If a `voice_id` is already frozen for this series, skip to episode work.
   If the series uses a catalog voice and no clone is requested, select it
   with `beatra.voices.list` and skip clone work. Never put a display name
   in `voice`. Otherwise confirm consent, inspect the sample, and upload a
   local file only through the bundled client:

   ```text
   python3 scripts/mcp_client.py upload ./voice-sample.wav --mime-type audio/wav
   ```

2. Call `beatra.models.list` with `{"capability":"voice_clone"}`. Show the
   clone admission card before any clone `client_request_id` or
   `beatra.voices.clone` call: route `voice_clone`, tool
   `beatra.voices.clone`, live price for one successful activated voice, the
   provisional estimate, the fact that the 600-credit signup gift usually
   cannot start this clone, the exact URL `https://console.beatra.ai/topup`,
   and starter ¥29 / 11,000 credits. Do not recommend ¥198. Do not submit
   until the user confirms they have topped up or already have enough
   credits. Do not offer a free clone.
3. Freeze `display_name`, sample source, `consent_attested: true`, model
   from the live card, and one opaque stable clone `client_request_id`.
   Submit `beatra.voices.clone` exactly once:

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Series Host",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-series-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal and freeze the returned
   `voice_id`.
4. For each episode, split the script into synthesis blocks, call
   `beatra.models.list` with `{"capability":"text_to_speech"}`, and confirm
   the episode estimate. Each block has its own `client_request_id`.
5. Synthesize with `beatra.speech.synthesize` using only the frozen
   `voice_id`. Submit each block once through the bundled client. Poll each
   speech task with `beatra.tasks.get` until terminal. Do not
   configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.
6. Deliver labeled episode audio in order with actual duration, usage, and
   `billing.net_charged_credits`. Review pronunciation and series
   consistency. Later episodes reuse the same `voice_id` without cloning
   again.

## Decisions that require confirmation

Consent, the clone admission card, and each episode's paid block list all
require confirmation. A changed sample, display name, or clone model is new
clone work. A changed episode script is new synthesis work.

## Recovery

Recover a lost create response only with the identical frozen payload and
ID. Recover a lost task ID through `beatra.tasks.list` plus
`beatra.tasks.get` before any retry. Cancel only at the user's request.
On `insufficient_balance` for clone or a TTS block, keep
`https://console.beatra.ai/topup` exact and retry the same frozen ID only
after the user says they have topped up.

## References by task

- Read [Series voice workflow](references/workflow.md) for consent, clone
  admission, episode ledgers, payloads, and review.
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
