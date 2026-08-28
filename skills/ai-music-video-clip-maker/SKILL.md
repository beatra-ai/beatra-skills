---
name: "ai-music-video-clip-maker"
description: "Create a short visual clip guided by a song's mood, rhythm, and visual concept. This AI music video clip maker and song-to-video generator turns a music excerpt and visual direction into a cinematic music promo clip, animates approved cover art or a portrait in time with the music, interpolates motion between opening and ending art, or uses audio as a loose mood reference for a new visual concept. Use it for new-song teasers, album promo clips, cover art animation, mood visuals, virtual performer scenes, and social music teasers, with an audio-visual map built from the song's hook, energy, palette, and landing image."
---

# AI Music Video Clip Maker

Create a short visual clip guided by a song's mood, rhythm, and visual concept. Use this Skill for AI music video clips, song-to-video teasers, new-song promos, album promo clips, cover art animation, mood visuals, virtual performer scenes, and social music teasers.

## Scope and adjacent routes

The song is the fixed spine: the clip exists to amplify its structure, artist identity, lyrics, and release goal. If rights are not cleared, stay at planning or an internal sample and do not treat the result as a publishable official music video. Route a portrait-plus-singing-audio request to a photo-singing workflow; a story-to-lyrics-to-song request to a personalized-song workflow; a reference-song reinterpretation to a song-cover workflow; and a broad non-music video request to a general video studio. Keep this route focused on finished music becoming a short visual clip. Do not generate a song from a theme in this package.

## Inputs and defaults

The hard inputs are:

- one finished song or accessible excerpt whose real duration can be cut to a supported video duration;
- one main route: performance, narrative, lyric-led, or visualization.

Ask only for a missing hard input. Reuse the known genre, energy, opening image, and aspect ratio. A cover or opening still is not a hard input. When the visual direction exists and no usable cover or opening still is present, generate one cover or keyframe with `beatra.images.generate` as its own paid stage. For a local audio or image file the host Agent can access, use the bundled upload helper only after inspection:

```text
python3 scripts/mcp_client.py upload ./song-excerpt.mp3 --mime-type audio/mpeg
python3 scripts/mcp_client.py upload ./cover-art.png --mime-type image/png
```

Upload is transport, not creative review. Retain the returned artifact reference and never pass a local path to a remote tool.

Default to cutting the chorus or strongest 20–30 seconds rather than forcing the whole song into one clip. Keep `model: "auto"` and a source-appropriate aspect ratio. Build a compact audio-visual map before any paid call: hook or energy, dominant mood, pulse, visual motif, subject, movement, palette, camera, opening image, and landing image. Write the beat, phrase, or climax cut into the paid card. Route by visual control:

- text plus compatible driving audio → `beatra.videos.generate`;
- strict approved cover art or portrait opening → `beatra.videos.animate` with driving audio;
- strict approved opening and ending art → `beatra.videos.interpolate`;
- audio used only as loose mood reference → `beatra.videos.generate_from_references`.

After a delivered gift cover, prefer `beatra.videos.animate` with driving audio when that still is the opening frame. Inspect the real audio duration and write the smallest admitted whole-second video `duration` at or above that length. Do not shorten the track to cheapen the clip. If no current card admits a duration that contains the excerpt in full, stop and ask for the smallest compatible excerpt change.

## Golden path

1. Inspect the music excerpt and every available image. Record the audio's actual MIME type, byte size, and real duration. Record each image's actual MIME type, width, height, aspect ratio, and byte size. Identify the hook, energy, dominant mood, pulse, and the visual direction this clip should deliver.
2. Build an audio-visual map: hook or energy, dominant mood, pulse, visual motif, subject, movement, palette, camera, opening image, and landing image. Then write one positive prompt that encodes the visual response to the music for this single clip.
3. If no usable cover or opening still exists, call `beatra.models.list` with `{"capability":"text_to_image"}`, show that image stage's own card, and submit one `beatra.images.generate` cover or keyframe. Deliver and inspect that still before any video work. This gift-sized stage does not authorize `beatra.videos.generate`, `beatra.videos.animate`, `beatra.videos.interpolate`, or `beatra.videos.generate_from_references`. For example:

   ```text
   printf '%s' '{"prompt":"Album-cover keyframe of a neon-soaked night drive through rain, cinematic teal-and-magenta palette.","count":1,"client_request_id":"opaque-mv-cover-id"}' | python3 scripts/mcp_client.py call beatra.images.generate
   ```

4. Select the route by visual control. Call `beatra.models.list` with the matching capability to confirm a current card admits every actual media fact, the driving-audio combination, and the selected video duration. Keep the model at `auto` unless the user chose a concrete eligible model. Write the smallest admitted whole-second `duration` at or above the real song length. Do not omit `duration` on `model=auto`. Any numeric estimate is provisional; the terminal task's `billing.net_charged_credits` is final.
5. Show an admission card before any video `client_request_id` or `beatra.videos.generate` / `beatra.videos.animate` / `beatra.videos.interpolate` / `beatra.videos.generate_from_references` call: route and MCP tool name, live-card duration, resolution if set, aspect if set, provisional live estimate, the fact that the 600-credit signup gift usually cannot start this video, the exact URL `https://console.beatra.ai/topup`, and starter ¥29 / 11,000 credits. Do not recommend ¥198. Planning, comparison, or “make the clip” is not approval. Do not submit until the user confirms they have topped up or already have enough credits for this estimate.
6. Freeze the exact route, audio, source images, reference media when used, prompt, selected duration, model behavior, and one opaque stable `client_request_id`; then submit exactly one video call. Invoke only the bundled `scripts/mcp_client.py`: the MCP tool name is the CLI argument and its arguments are JSON on standard input. For example, text plus driving audio:

   ```text
   printf '%s' '{"prompt":"A neon-soaked night drive through a rain-streaked city, reflections shimmering on the windshield, the beat syncing with passing streetlights, cinematic teal-and-magenta palette.","audio":{"type":"artifact","artifact_id":"art_song"},"duration":10,"client_request_id":"opaque-mv-generate-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate
   ```

   Strict cover art or portrait with driving audio:

   ```text
   printf '%s' '{"image":{"type":"artifact","artifact_id":"art_cover"},"prompt":"The cover art comes alive: light blooms across the frame, particles drift upward, the subject's eyes slowly open in time with the music.","driving_audio":{"type":"artifact","artifact_id":"art_song"},"duration":8,"client_request_id":"opaque-mv-animate-id"}' | python3 scripts/mcp_client.py call beatra.videos.animate
   ```

   Strict opening and ending art:

   ```text
   printf '%s' '{"first_frame":{"type":"artifact","artifact_id":"art_open"},"last_frame":{"type":"artifact","artifact_id":"art_end"},"prompt":"A surreal transition from a desolate moonlit shore to a vibrant sunrise festival, the energy building with the music.","driving_audio":{"type":"artifact","artifact_id":"art_song"},"duration":10,"client_request_id":"opaque-mv-interpolate-id"}' | python3 scripts/mcp_client.py call beatra.videos.interpolate
   ```

   Audio as loose mood reference:

   ```text
   printf '%s' '{"references":[{"kind":"audio","media":{"type":"artifact","artifact_id":"art_song"}},{"kind":"image","media":{"type":"artifact","artifact_id":"art_mood"}}],"prompt":"A dreamlike sequence of a dancer moving through shifting colored smoke, the visuals guided by the song's energy and the mood reference palette.","duration":10,"client_request_id":"opaque-mv-references-id"}' | python3 scripts/mcp_client.py call beatra.videos.generate_from_references
   ```

   Do not configure, call, or use a host Beatra Connector. Do not use REST/OpenAPI fallback. Submit the chosen video tool exactly once.
7. Record the returned task ID immediately and poll the same task with `beatra.tasks.get` until terminal. Deliver every returned video artifact or link. Report only actual returned task status, resolved model, dimensions, duration, usage, and `billing.net_charged_credits`. Review accessible output for visual response to the music, motion, mood, subject stability, presence and handling of the track, ratio, and actual duration. State what the host Agent could and could not inspect.

## Paid changes, recovery, and cancellation

The optional cover stage and the video stage are separate paid requests with distinct IDs. A changed music excerpt, visual direction, cover image, prompt, model, selected duration, aspect ratio, or video control is new logical paid work: create a new ID, show the changed admission card, and obtain fresh top-up or balance confirmation. Never reuse an ID across changed arguments. On `insufficient_balance`, relay the returned message, keep the top-up URL exact, and retry the same frozen ID only after the user says they have topped up.

If a create response is lost, retry only the identical frozen payload with the same stage ID. If a task ID is lost, call `beatra.tasks.list` for the relevant capability, inspect plausible candidates with `beatra.tasks.get`, and match them against that stage's private ledger before considering an identical retry. Queued and running are progress states, not failures. Recover the original stage before planning changed work; never duplicate a paid submission or guess its charge or refund.

Call `beatra.tasks.cancel` only when the user asks to cancel. Call it once and confirm the resulting terminal state with `beatra.tasks.get`. A 409 means cancellation is not confirmed, so continue polling that same task without creating replacement work.

## References by task

- Read [Music video clip workflow](references/workflow.md) when building an audio-visual map, choosing a route, checking live model facts, constructing exact payloads, polling, recovering, cancelling, or reviewing the visual response to the music.
- Read [Installation and authentication](references/installation-and-auth.md) only when authorization or shared credentials need attention.
- Read [Installation registration](references/installation-registration.md) for the non-billable best-effort package registration step.
- Read [Tasks and results](references/tasks-and-results.md) for shared terminal task and artifact semantics, and [Billing, errors, and recovery](references/billing-errors-and-recovery.md) for returned billing or error details.
- Read [Bundled MCP Client diagnostics](references/mcp-connection.md) when the bundled client cannot connect. Do not configure a host Connector.
- Read [Automatic updates and safety](references/automatic-updates-and-safety.md) for update guarantees and controls.
- Read [Uninstall and disconnect](references/uninstall-and-disconnect.md) only when the user asks to remove the package or shared credentials.

## Runtime and safe automatic updates

Use or invoke the bundled `scripts/mcp_client.py` for every Beatra operation. Before ordinary commands it silently checks for a newer release at most once every 24 hours per installation. Silent checks are enabled by default, and a newer release installs without separate confirmation.

The updater accepts only the fixed official discovery address and immutable Beatra CDN path embedded for this package, channel, and locale. It verifies the discovery data, archive, manifest, and every file's size and checksum before replacement. It replaces only package-owned files and rejects redirects, downgrades, wrong package/channel/locale/version data, unexpected URLs, unsafe archives, and files outside the owned destination.

Update checks, downloads, verification, replacement, rollback, and recovery fail open: the current installation remains usable and the user's original command continues. An update failure never authorizes retrying a paid generation. The automatic-update choice persists across later commands for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

`--auto off` disables silent checks, `--auto on` restores them, and `--check` reports the official available version without replacing files.
