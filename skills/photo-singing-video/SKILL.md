---
name: "photo-singing-video"
description: "Make a photo sing by animating one clear portrait with a short singing audio excerpt. This photo singing video and AI singing portrait workflow turns a single face into an expressive singing clip from one portrait and a chosen song excerpt, and reviews identity, mouth and facial movement, performance energy, audio presence, and synchronization. Use it for old photo singing, birthday greetings, character art, playful posts, song promos, and memorable messages, with one portrait and one singing audio excerpt per run and honest post-result review."
---

# Photo Singing Video

Make one clear portrait sing a short song excerpt. Use this Skill for making a photo sing, portrait singing, old photo singing, character illustration singing, a greeting song video, a meme singing clip, or a digital-character song performance.

## Scope and adjacent routes

The normal route is one portrait, one approved singing-audio excerpt, and one singing-photo clip. When the supplied song is longer than the video window or carries heavy backing music, this Skill also prepares the driving excerpt first with `beatra.audio.process` (`trim` for the chorus window, `isolate_voice` or `separate_stems` for cleaner vocals, and `convert_format` if the isolated output format requires adaptation). Route a spoken presenter message (no singing) to the talking-avatar-video workflow; a pet photo plus speech to the talking-pet-video workflow; a portrait plus non-audio motion to an image-to-motion workflow; and a finished song that needs broader music-led visuals to the music-video-clip workflow. If the user needs a new song first, route that separate stage to personalized-song-maker or ai-song-cover-studio before this workflow resumes with the finished song or excerpt. Keep this route focused on one portrait plus singing audio. Lyrics alone are not driving audio; only an audio file can drive the singing motion.

## Inputs and defaults

The hard inputs are:

- one accessible portrait the host Agent can inspect;
- a short singing-audio excerpt.

Ask only for a missing hard input. Reuse the known occasion, framing, crop, background, and destination. For a local image or audio file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./singing-portrait.png --mime-type image/png
python3 scripts/mcp_client.py upload ./song-excerpt.mp3 --mime-type audio/mpeg
```

Upload is transport, not visual or audio review. Retain each returned artifact reference and never pass a local path to a remote tool.

Default to one singing clip, `model: "auto"`, the portrait as the strict first frame, and a source-derived aspect ratio. Omit resolution and other optional controls unless the destination or an explicit user choice requires them. Treat identity, clothing, framing, and background as must-keeps and review the result for drift rather than promising exact preservation or perfect lip sync. If a new portrait canvas or cleanup is needed, route that to a suitable image workflow and return with an approved first frame.

## Golden path

1. Inspect the portrait. Record its actual MIME type, width, height, aspect ratio, byte size, and whether it has an alpha channel. Identify the face visibility, identity, framing, background, desired crop, and the singing excerpt. If the user supplied singing audio, review what is actually accessible and record its real MIME type, duration, and byte size.
2. If the user needs a new song first, route that separate stage to personalized-song-maker or ai-song-cover-studio. Before paying for that upstream music, call `beatra.models.list` with `{"capability":"image_to_video"}` and prove that a current card admits the portrait plus the planned audio format and a duration envelope the route can contain (or prepare with a post-generation chorus trim). Resume this workflow once the user supplies the finished track or excerpt.
3. **Prepare the singing excerpt when needed (`beatra.audio.process`, paid).** Skip this step when the user already supplied a clean vocal excerpt whose duration and format match `image_to_video`. Never call audio trimming, vocal isolation, stem separation, or format conversion free; read live credits from `beatra.models.list` first and present a six-field production card (Work, Credits, Count, opaque `client_request_id`, If we stop here, If balance fails) before each call:
   - **Trim a full song to the chorus excerpt (`operation: "trim"`):** query `{"capability": "audio_process"}` and pass `start_ms` / `end_ms` (or `target_duration_ms`, plus optional `fade_in_ms` / `fade_out_ms` in the same call at no extra charge) so the excerpt fits a supported video duration.
   - **Isolate singing vocals from heavy backing instrumentation:** either run `operation: "isolate_voice"` (query `{"capability": "audio_voice_isolation"}`, `4.6 s – 5 min` input, default WAV) or `operation: "separate_stems"` (`mode: "two_stem"` for `[vocals, accompaniment]`, or `"multi_stem"` if 6 stems are wanted; query `{"capability": "audio_stem_separation"}` and read the pricing option whose `pricing[].dimensions.stem_mode` equals `mode`, falling back to the pricing option without `dimensions` when no option names that mode; pass no `format` field to `separate_stems`). Disclose that slight backing bleed may remain audible. If the isolated vocal output format/size is not admitted by `image_to_video`, convert it with `operation: "convert_format"` (`{"capability": "audio_process"}`) on its own card.

   ```bash
   python3 scripts/mcp_client.py call beatra.models.list
   ```

   ```json
   {"capability": "audio_process"}
   ```

4. For the singing-photo video, call `beatra.models.list` with `{"capability":"image_to_video"}`. Require a current card whose `input_combinations` admits `[image, driving_audio]`. Compare the portrait's actual MIME type, width and height, aspect ratio, byte size, and alpha-channel presence with every advertised image constraint; compare the prepared singing audio's actual MIME type, duration, and byte size with every advertised driving-audio constraint. Confirm the audio duration is at least the live minimum and within the longest eligible video duration that can contain it. If any media fact is unavailable or incompatible, stop before the video call and request the smallest compatible source change.
5. Show an admission card before any `client_request_id` or `beatra.videos.animate` call: route `image_to_video`, tool `beatra.videos.animate`, portrait, prepared singing audio, prompt, audio-led duration, resolution if set, output count (`1`), provisional live estimate from `beatra.models.list`, that starter gift credits alone usually cannot start video animation, what the user keeps if they stop here, and what happens if the balance is short (`insufficient_balance` top-up link). Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms the card and confirms they have topped up or already hold enough credits for this estimate. The audio duration determines the duration: use the smallest supported integer video duration at or above the actual audio length so the singing is not clipped; do not truncate or add silence during animation. Freeze them with one opaque stable `client_request_id`. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example:

   ```text
   printf '%s' '{"image":{"type":"artifact","artifact_id":"art_portrait"},"driving_audio":{"type":"artifact","artifact_id":"art_song"},"prompt":"An expressive singing performance with natural mouth movement and engaged facial energy, keeping the portrait identity and background stable.","duration":10,"client_request_id":"opaque-singing-video-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit `beatra.videos.animate` exactly once.
6. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for identity, mouth and facial movement, singing performance energy, audio presence and synchronization, background and wardrobe stability, ending quality, ratio, and actual duration. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

A new song, any audio preparation step (`trim`, `isolate_voice`, `separate_stems`, `convert_format` via `beatra.audio.process`), and the singing-photo video (`beatra.videos.animate`) are separate paid stages when run here; each has its own live price check, frozen payload, stable `client_request_id`, approval, create response, and task ID. Never fold audio trimming or vocal isolation onto the video card without listing it explicitly as its own paid line, and never call any finishing or preprocessing step free. A changed portrait, singing audio, song, trim window, stem mode, prompt, model, duration, aspect ratio, resolution, or video control is new logical paid work with a new ID, a new card (and admission check for video), and fresh confirmation. On `insufficient_balance`, relay the returned message, keep the top-up URL inside the balance error exact, and retry the same frozen `client_request_id` only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

If the tool returns insufficient credits: give the user the tool message in
full. Do not change the URL. You may translate the other words. Do not replace
it with your own top-up copy. Point the user to pay using that message.

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

- Read [Singing-photo workflow](references/workflow.md) when inspecting a portrait, admitting, trimming, or isolating singing audio, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing singing motion.
- Read [Music editing and audio](references/music-editing-and-audio.md) for audio trimming (`trim`), voice isolation (`isolate_voice`), stem separation (`separate_stems`), format conversion (`convert_format`), and limits.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Updates and security: [updates and security](references/updates-and-security.md)
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

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
