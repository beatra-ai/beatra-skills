---
name: "corporate-podcast-studio"
description: "Turn executive talking points or company column copy into a serialized corporate podcast with one consistent host voice. This executive podcast studio and company podcast series records each branded episode, then continues the brand podcast as an executive column so listeners recognize the same host across the corporate audio series. Use it for leadership podcast episodes, C-suite podcast audio, and company thought-leadership shows."
---

# Corporate Podcast Studio

Turn finished talking points or column copy into serialized company
episodes. One host voice. Finish this episode, then continue the show.

## Scope and adjacent routes

Use this Skill when an executive or company show needs serialized
podcast episodes from a cloned or catalog host voice.

Route a generic article turned into one episode to
`ai-podcast-voiceover`. Route a talking-head video to
`founder-ip-avatar-studio`.

## Inputs and defaults

The hard inputs are:

- final readable text or talking points for at least this episode;
- the episode number or air date in the series;
- the target language;
- a pronunciation table whenever the episode contains recurring names,
  titles, or product terms.

If those terms exist and the table is empty, stop and collect the
readings. Do not guess them. A host sample is optional. Without a
sample, choose a catalog voice with `beatra.voices.list`. Reuse
already-known show tone, speed, and format.

Defaults: `model: "auto"` only when every voice-compatible live card
supports the language; `format: "mp3"`; `speed: 1.0`. Keep each submitted
`input` at or below 50,000 characters. Split on sentence or section
boundaries, never mid-sentence. Write spoken sentences. Do not send
slide titles, stage labels, or picture notes into `input`.

Planning, casting, and the pronunciation table are free. Clone, if used,
and each synthesis block are paid.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the episode ledger: show title, episode number, section labels,
   and the pronunciation table. Turn this episode into speakable text
   only. Confirm the table before it is frozen.
2. If the user brought a host sample, confirm consent first: the user
   must state this is their voice or that the speaker authorized this
   cloning use. Access to a file is not consent. A suitable sample is
   currently about 10 to 300 seconds, no larger than 20 MiB, and clean
   single-speaker speech. Only after consent, upload a local file through
   the bundled client:

   ```text
   python3 scripts/mcp_client.py upload ./host-sample.wav --mime-type audio/wav
   ```

   Then present the current `beatra.voices.clone` admission card before
   any clone `client_request_id` — route `voice_clone`, tool
   `beatra.voices.clone`, live price for one successful activated voice,
   the provisional estimate, the 600-credit gift usually cannot start
   this clone, `https://console.beatra.ai/topup`, starter ¥29 / 11,000
   credits. Do not recommend ¥198. Do not create `client_request_id` or
   submit until the user confirms they have topped up or already have
   enough credits. Do not offer a free clone. Submit `beatra.voices.clone`
   exactly once:

   ```json
   {
     "sample": {"type": "artifact", "artifact_id": "artifact_..."},
     "display_name": "Show Host",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-host-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal, then freeze the returned
   `voice_id`.
3. Without a sample, select a catalog `voice_id` with
   `beatra.voices.list`. Never put a display name in `voice`.
4. Call `beatra.models.list` with `{"capability":"text_to_speech"}`.
   Confirm the host voice and this episode's estimate, then synthesize
   only this episode with `beatra.speech.synthesize`. Poll each speech
   task with `beatra.tasks.get` until terminal.
5. Deliver the episode audio. After the user listens, revise only unclear
   or misread blocks with new request IDs. Do not regenerate the whole
   episode.
6. After the user accepts the episode, keep the same `voice_id` for later
   episodes. Confirm the next-episode estimate before that paid wave.
7. Deliver labeled episode audio in show order with actual duration,
   usage, and `billing.net_charged_credits`. Review names, titles, and
   host consistency.

## Decisions that require confirmation

Confirm the pronunciation table, the host voice, and this episode's
estimate before the first paid TTS. A changed episode text is new paid
work for the changed blocks only.

## Recovery

Recover a lost create response only with the identical frozen payload and
ID. A changed text is a new ID. Recover a lost task ID through
`beatra.tasks.list` and `beatra.tasks.get` before any resend. Cancel only
at the user's request. On `409`, keep polling the same task. On
`insufficient_balance` for clone or TTS, keep
`https://console.beatra.ai/topup` exact and retry the same frozen ID only
after the user says they have topped up.

## References by task

- Read [Corporate podcast workflow](references/workflow.md) for ledgers,
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
