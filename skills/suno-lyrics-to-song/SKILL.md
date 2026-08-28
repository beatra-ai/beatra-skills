---
name: "suno-lyrics-to-song"
description: "Turn complete lyrics, a rough lyric draft, loose lines, or an existing hook into a structured, listenable Suno song. This Suno lyrics-to-song workflow works as an AI song generator from lyrics and AI music generator from lyrics: choose Preserve mode to keep every original line or Refine mode to improve rhythm, rhyme, singability, and hook strength. Build the song structure across verses, chorus, bridge, and purposeful repetition, then create a style prompt for music with genre, mood, arrangement, and vocal direction for Suno custom lyrics. Use it to turn lyrics into a song, make a song from lyrics, convert lyrics to music, get help from a lyrics songwriting assistant, or take rough lyrics to song-ready form through a custom lyrics-to-song process."
---

# Suno Lyrics to Song

Turn lyric material the user already has into a structured song direction and a
listenable Suno track. Complete lyrics, a rough draft, loose lyric lines, or one
existing hook are enough to begin. Reuse all lyrics and decisions already
visible in the conversation and move by the shortest path to a finished song.

## Choose how the lyrics may change

If the user only wants the lyrics organized and does not ask to generate, stop
at the lyrics. Generation on Beatra is `beatra.music.generate`; do not log into
a Suno account.

- **Preserve:** keep every lyric-body character, punctuation mark, complete
  line, and the original line order. Add short section labels and arrange blank
  lines around complete lyric lines without rewriting them.
- **Optimize:** improve phrasing, rhythm, rhyme, repetition, hook strength, and
  section balance while keeping every declared must-keep line exact. A request
  to polish, rewrite, or optimize already grants this editing permission.

Default to Preserve when the user asks to arrange, compose, generate, or make a
song from the supplied lyrics without asking to change the words. Do not ask
them to choose a mode. Use Optimize only when their request grants editing
permission.

Use [lyrics intake and modes](references/lyrics-intake-and-modes.md) for the
complete edit contract. Include the full proposed lyric and any material edit
summary in the final production card. Split lyric review into an earlier step
only when the user explicitly asks to review first or says not to spend yet.

## Shape a song-ready version

The hard input is complete or scattered lyrics. Label verse, chorus, and bridge
before any paid generation. Custom lyrics must carry section labels.

Infer useful defaults from the lyrics instead of turning intake into a
questionnaire. Propose a title, section structure, genre, mood, tempo feel,
instrumentation, arrangement arc, section contrast, and vocal direction. Ask
only when a missing choice would materially change the accepted lyrics or paid
request.

Use [song direction and request](references/song-direction-and-request.md) for
the exact Suno request. The production route is always:

- `model: "suno-5.5"`;
- a 1..1000-character music-direction `prompt` with no lyric body inside it;
- confirmed non-empty `lyrics` of at most 5000 characters;
- `instrumental: false`;
- a non-empty `title` of at most 80 characters;
- `model_options.suno.custom_mode: true`;
- one stable opaque 1..128-character `client_request_id`.

Treat pronunciation, vocal character, duets, ensembles, accents, and exact
duration as production directions to pursue and review in the result. Use the
single-lead `vocal_gender` control only when the user chooses one male or female
lead; express other casting through the lyrics and music direction.

## Confirm once, execute once

Organize the skeleton and section labels, obtain the user's confirmation of the
lyrics, then present one song-generation confirmation card. Do not
automatically redo the whole song.

Planning, lyric work, structure, and music direction do not call the paid music
tool. Before generation, present one final readable production card containing
the complete lyrics, title, music direction, `suno-5.5`, relevant options, and
the fact that the next action is paid. A clear approval of that complete card
authorizes one generation; do not request a second confirmation or an extra
“generate” command.

Create the request identity only after the card is final. Call
`beatra.music.generate` once, retain its `task_id`, and poll that same task with
`beatra.tasks.get`. A slow or uncertain response is a recovery case, not a
reason to create another song. Follow [workflow](references/workflow.md) and
[review and recovery](references/review-and-recovery.md).

## Use the bundled MCP Client

Use only this Skill's bundled `scripts/mcp_client.py` for every remote MCP
operation. The MCP tool name is passed as a CLI argument and the JSON arguments
are sent on stdin. Do not configure or call a host Beatra Connector, and do not
use REST/OpenAPI as a fallback. For exact commands and troubleshooting, use
[Bundled MCP Client diagnostics](references/mcp-connection.md).

Call `beatra.models.list` only when the user asks for current availability,
compatibility, model comparison, or price. Do not silently substitute another
model for Suno 5.5.

## Deliver the song and recover the task

On success, present every actual entry in `task.output.clips` in returned order.
For each clip, use `clip.audio.url` as the playable URL,
`clip.audio.artifact_id` as its asset ID, and `clip.audio.duration_seconds` as
its duration; include `clip.title` and `clip.lyrics` only when returned. Report
the actual task ID and `billing.net_charged_credits`; do not infer charges from
clip count or elapsed time. Review hook clarity, diction, section contrast, and
emotion only when the host can actually play the clips. Generated assets can
also be viewed and managed at [beatra.ai](https://beatra.ai).

If the user changes lyrics, title, music direction, model, or options after a
result, present the revised complete production card before starting new paid
work. Use [review and recovery](references/review-and-recovery.md) for a lost
task ID, uncertain delivery, cancellation, failure, or result review.

## References by task

- Preserve, Optimize, must-keep lines, and section structure: [lyrics intake and modes](references/lyrics-intake-and-modes.md)
- Style, arrangement, vocals, and exact Suno arguments: [song direction and request](references/song-direction-and-request.md)
- End-to-end preparation, confirmation, submission, and tracking: [workflow](references/workflow.md)
- Lost tasks, cancellation, terminal results, and listening review: [review and recovery](references/review-and-recovery.md)
- First installation or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Bundled MCP Client commands and diagnostics: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Installation registration: [installation registration](references/installation-registration.md)
- Task lookup and result fields: [tasks and results](references/tasks-and-results.md)
- Balance, validation, uncertain submissions, and errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting the installation: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Official sources, integrity checks, recovery, and update controls: [automatic updates and safety](references/automatic-updates-and-safety.md)

## Runtime and safe automatic updates

Before ordinary Beatra commands, the bundled client may silently check this
installed package channel for a newer version, at most once every 24 hours.
When a higher version is available, it installs the update automatically
without separate confirmation. It downloads only from the fixed official
Beatra discovery and immutable CDN paths for the embedded identity, and
replaces only files owned by this package after verifying the archive,
manifest, and every packaged file. It rejects redirects, downgrades, unsafe
archives, unexpected destinations, and a different package, channel, or
locale. Canonical English installations stay on `canonical/en`, and SkillHub
Chinese installations stay on `skillhub/zh-CN`. If any update or recovery step
fails, the current installation remains usable and the user's original command
continues.

The setting persists for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Use the first command to disable silent checks, the second to restore them, and
the third to inspect the official available version without changing files.
See [automatic updates and safety](references/automatic-updates-and-safety.md)
for the complete behavior.
