---
name: "brand-jingle-studio"
description: "Turn a brand name, slogan, and campaign use into a set of original brand jingles, ad songs, and audio-logo stings. This brand jingle maker and AI jingle generator drafts the hook and optional sung line, then generates reviewable tracks in the lengths and styles the campaign needs for ads, store openings, podcast intros, and radio spots. Use it as an ad song generator and brand music generator for brand theme songs, commercial jingles, advertising jingles, sonic logos, audio logo stings, campaign music, radio jingles, podcast intro jingles, and event walk-on themes, with each candidate generated as original music you can use commercially."
---

# Brand Jingle Studio

Turn a brand brief into reviewable original jingles, ad songs, and audio-logo
stings. Hear a few style sketches first, lock the DNA, then derive the other
lengths.

## Scope and adjacent routes

Use this Skill when the user needs commercial brand music.

Split the job before spending:

- A sonic logo or sting is a short instrumental identity sound. Deliver three
  short sketches and stop unless the user asks to derive a longer cut.
- A sung jingle or brand theme is the hook-and-length path: three style
  sketches on one primary length, then derived lengths after the user locks
  one.
- A spoken tagline over an instrumental bed is not a sung lyric. Generate the
  bed and the spoken line as two artifacts. This Skill cannot mix them.

Route a gift or occasion song about a person to `personalized-song-maker`.
Route finished lyrics that only need a melody to `suno-lyrics-to-song`. Route
one instrumental bed for a specific video cut to `short-video-bgm-studio`.
Route a labeled livestream or store playlist of many beds to
`livestream-bgm-pack`. Route a cover of an existing recording to
`ai-song-cover-studio`. Keep mixed or uncertain music requests on
`music-generation-studio`.

## Inputs and defaults

The hard inputs are:

- the brand or product name;
- the destination (ad, store, podcast intro, livestream open, event walk-on,
  or sonic logo);
- the language of any sung or spoken line;
- whether the track should sing a hook, stay instrumental, or carry a spoken
  tagline.

Reuse already-known slogan, must-include words, mood, genre, vocal direction,
and exclusions. Ask only when a missing answer changes the hook, the vocal
route, or the paid cells. When the destination is known, do not ask for a
15 / 30 / 60 table.

Safe defaults:

- Three style sketches on one primary length. Ads, podcast intros, and
  livestream opens default to about 15 seconds. Radio spots and store loops
  default to about 30 seconds. Sonic logos default to a 2-to-5-second
  instrumental sting.
- Full 3 × 3 only when the user asks for every length in every style.
- About-15-second prompts stay one section. About-30-second prompts use
  intro plus body. Stings describe two-to-four notes and a clean ending.
- `model: "suno-5.5"` for ordinary music. Never omit the model and never
  silently use `auto`.
- There is no `duration` field on `beatra.music.generate`. Write length
  only in the prompt. Do not add a duration argument.
- Caller-supplied lyrics require `model_options.suno.custom_mode: true`.
- Write and show the hook, sung line, or spoken tagline before any paid call.
- For a sonic logo or sting, set `instrumental: true` and keep lyrics absent.

Lyrics, slogan shaping, style cards, and planning are free. Each
`beatra.music.generate` call is paid. A spoken tagline is a separate paid
`beatra.speech.synthesize` call.

## Golden path

1. Collect the brand card. Draft the hook and, when the track sings, a short
   lyric with a repeated brand line. When the user wants a spoken tagline,
   write that line as speech, not as sung lyrics.
2. Choose the primary length from the destination. Call
   `beatra.models.list` with `{"capability":"text_to_music"}` and price the
   three sketches.
3. Confirm three frozen music payloads: prompt, lyrics or instrumental flag,
   title, model, current maximum charge, and one opaque stable
   `client_request_id` each. Planning is not approval. A sting path confirms
   only those three short instrumentals.
4. Submit each sketch exactly once through the bundled
   `scripts/mcp_client.py`. Example:

   ```text
   printf '%s' '{"model":"suno-5.5","prompt":"Bright brand jingle, one compact pop section, about 15 seconds, clean ending sting.","lyrics":"[Hook]\nApproved brand line\n","title":"Approved 15s Hook","model_options":{"suno":{"custom_mode":true}},"client_request_id":"opaque-jingle-15s-a"}' | python3 scripts/mcp_client.py call beatra.music.generate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use
   REST/OpenAPI as a fallback.
5. Poll each task with `beatra.tasks.get`. Deliver actual
   `duration_seconds`, MIME type, size, URL or artifact ID, resolved model,
   and `billing.net_charged_credits`. Review the hook, ending, and how close
   the actual duration sits to the target. Give one concrete next lever, such
   as BPM 92 to 108, not "make it different."
6. After the user locks one sketch, confirm each derived length as new paid
   work with a new request ID. Leave accepted sketches untouched.
7. If the user asked for a spoken tagline rather than a sung hook, call
   `beatra.voices.list` and `beatra.models.list` with
   `{"capability":"text_to_speech"}`. Confirm a current speech card, then
   submit `beatra.speech.synthesize` once with its own
   `client_request_id`. Deliver the instrumental bed and the spoken line as
   two artifacts. Do not claim they are mixed.

For a 30-second radio-style spot, describe the timeline in the prompt and
again at delivery: 0–3 hook, middle sell, closing brand line.

## Decisions that require confirmation

Confirm the three sketches and the live music estimate before the first paid
music call. Confirm each derived length before that call. Confirm the spoken
tagline card before `beatra.speech.synthesize`. A changed hook, lyric, spoken
line, prompt, length, style, model, voice, or instrumental setting is new
paid work with a new request ID.

Requested length is arrangement guidance. Read the actual returned duration.
Do not promise a sample-perfect 15.00-second cut, and do not force a
verse–chorus–bridge into a 15-second prompt.

## Recovery

If a create response is lost, retry only that candidate's identical frozen
payload and ID. If a task ID is lost, list the matching capability with
`beatra.tasks.list`, inspect candidates with `beatra.tasks.get`, and
recover the original before new work.
Music and speech recover independently. Never duplicate a paid submission.

Call `beatra.tasks.cancel` only when the user asks to cancel that candidate.
On 409 keep polling the same task.

## References by task

- Read [Brand jingle workflow](references/workflow.md) for brand cards,
  sketch-then-derive payloads, spoken-tagline cards, polling, recovery, or
  review.
- Read [Installation and authentication](references/installation-and-auth.md)
  only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md)
  for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared
  terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md)
  for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when
  the bundled client cannot connect. Do not configure a host Connector.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md)
  for update guarantees and controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md)
  only when the user asks to remove the package or shared credentials.

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

`--auto off` disables silent checks, `--auto on` restores them, and `--check`
reports the official available version without replacing files.
