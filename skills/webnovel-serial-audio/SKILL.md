---
name: "webnovel-serial-audio"
description: "Turn a serialized web novel into chapter-by-chapter webnovel audiobook audio with one consistent narrator. This serialized webnovel audio studio and web novel narration shop records the current chapter first, then continues later chapters in the same voice so listeners can follow a serial novel TTS library as new chapters land. Use it for chapter audiobook production, webnovel chapter audio, serial fiction narration, and ongoing web novel listening."
---

# Webnovel Serial Audio

Turn finished chapter text into serial listening audio. One narrator.
Finish the current chapter, then continue when the next chapter is ready.

## Scope and adjacent routes

Use this Skill when a webnovel needs chapter-serial audio with one
consistent narrator, and later chapters should continue in that voice.

Route a one-shot literary book to `ai-audiobook-narration`. Route course
lectures to `course-narration-studio`. Route personal IP episodes to
`voice-clone-series-studio`.

## Inputs and defaults

The hard inputs are:

- final readable text for at least the current chapter;
- chapter order or the next chapter number;
- the target language;
- a pronunciation table whenever the chapter contains recurring names,
  terms, or place names.

If those names exist and the table is empty, stop and collect the
readings. Do not guess them. A narrator sample is optional. Without a
sample, choose a catalog voice with `beatra.voices.list`. Reuse
already-known tone, speed, and format.

Defaults: `model: "auto"` only when every voice-compatible live card
supports the language; `format: "mp3"`; `speed: 1.0`. Keep each submitted
`input` at or below 50,000 characters. Split on sentence or section
boundaries, never mid-sentence. Write short spoken sentences. Do not send
chapter headings, author notes, or bracket labels into `input`.

Planning, casting, and the pronunciation table are free. Clone, if used,
and each synthesis block are paid.

## Golden path

Submit every Beatra call through the bundled `scripts/mcp_client.py`. Do not
configure a host Beatra Connector. Do not use REST/OpenAPI as a fallback.

1. Build the chapter ledger: title, order, block labels, and the
   pronunciation table. Turn the current chapter into speakable text
   only. Confirm the table before it is frozen.
2. If the user brought a narrator sample, confirm consent first: the user
   must state this is their voice or that the speaker authorized this
   cloning use. Access to a file is not consent. A suitable sample is
   currently about 10 to 300 seconds, no larger than 20 MiB, and clean
   single-speaker speech. Only after consent, upload a local file through
   the bundled client:

   ```text
   python3 scripts/mcp_client.py upload ./narrator-sample.wav --mime-type audio/wav
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
     "display_name": "Serial Narrator",
     "consent_attested": true,
     "model": "auto",
     "client_request_id": "opaque-webnovel-clone"
   }
   ```

   Poll with `beatra.tasks.get` until terminal, then freeze the returned
   `voice_id`.
3. Without a sample, select a catalog `voice_id` with
   `beatra.voices.list`. Never put a display name in `voice`.
4. Call `beatra.models.list` with `{"capability":"text_to_speech"}`.
   Confirm the voice and the current-chapter estimate, then synthesize
   only that chapter with `beatra.speech.synthesize`. Poll each speech
   task with `beatra.tasks.get` until terminal.
5. Deliver the chapter audio. After the user listens, revise only unclear
   or misread blocks: edit the spoken text, then resubmit those blocks
   with new request IDs. Do not regenerate the whole chapter.
6. After the user accepts the chapter, keep the same `voice_id` for later
   chapters. Confirm the next-chapter estimate before that paid wave.
7. Deliver labeled chapter audio in reading order with actual duration,
   usage, and `billing.net_charged_credits`. Review names, numbers, and
   voice consistency.

## Decisions that require confirmation

Confirm the pronunciation table, the voice, and the current-chapter
estimate before the first paid TTS. A changed chapter text is new paid
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

- Read [Webnovel serial-audio workflow](references/workflow.md) for
  ledgers, payloads, and review.
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
