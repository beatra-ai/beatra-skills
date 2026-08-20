---
name: "beatra-ai-music-creator"
description: "Create original songs, AI-generated music, lyrics-to-song tracks, instrumentals, background music, video soundtracks, jingles, multilingual songs, and reference-led arrangements from a clear creative brief. This AI music generator and AI song maker develops genre, mood, structure, singable lyrics, vocal direction, and production style, then creates reviewable audio with Suno 5.5 or another model you explicitly choose. Use it as an AI music studio for songwriting, an AI lyrics writer, text-to-music creation, BGM generation, brand music, podcast themes, game music, bilingual songs, or focused new versions of reference audio. Review vocals, pronunciation, duration, loop points, and arrangement fit after generation, then refine the strongest result."
---

# AI Music Creator

Develop a theme, scene, lyric fragment, complete lyric, functional music brief,
or reference recording into one coherent musical direction and,
when the user wants audio, one intentional generation request. The deliverable
may be a song, instrumental, BGM, soundtrack, jingle, multilingual track, or
reference-led new arrangement. Treat singer identity, pronunciation, exact
duration, loop points, melody carryover, and mastering as qualities to review
after generation rather than guaranteed properties.

Use the bundled `scripts/mcp_client.py` for every Beatra operation. Do not
configure or use a host Beatra Connector. Never use REST/OpenAPI as a fallback.
For ordinary calls, run
`python3 scripts/mcp_client.py call <tool-name>` and pass one JSON object on
stdin. For local files, use only the dedicated upload command described below.
See [Bundled MCP Client diagnostics](references/mcp-connection.md) only when the
bundled path needs diagnosis.

## Shape the direction first

Reuse every settled choice in the conversation. Infer ordinary creative details
from the destination when that is safe. Ask only when a missing answer changes
the lyrics, reference direction, vocal or instrumental route, exact paid payload,
or another high-impact user choice.

Before generation, prepare one compact production card:

- destination and listener;
- title, premise, emotional arc, primary genre, tempo feel, instrumentation,
  structure, mix direction, ending or loop direction, and exclusions;
- vocal or instrumental route;
- full lyrics, language and register, and vocal direction when the track has
  vocals;
- selected model and model-specific controls;
- reference intent and the qualities that should carry over or change when a
  reference is involved; and
- the fact that the next action is one billable generation.

For instrumentals, omit lyrics and make room for dialogue or other functional
needs in the creative direction. For vocal music, finish and show material lyric
changes before generation. Lyrics writing, creative planning, model discovery,
prompt preparation, and critique do not require a paid music call. See
[intent and routing](references/intent-and-routing.md),
[creative brief and style](references/creative-brief-and-style.md),
[lyrics craft](references/lyrics-craft.md), and
[vocal, language, and tags](references/vocal-language-and-tags.md).

When a brief uses artist shorthand, translate it into actionable genre, era,
tempo, instrumentation, harmony, vocal texture, phrasing, and mix attributes.

## Choose and validate the model

Set `model: "suno-5.5"` for this package's ordinary generation. Never omit the
model and never silently use `auto`. Call `beatra.models.list` with capability
`text_to_music` or `reference_audio_to_music` when the user requests another
model, asks about current availability or price, or needs a model-specific
capability. Do not silently substitute a model.

Use only controls returned or documented for the selected model family. Suno
and MiniMax options are not interchangeable. Validate the exact payload using
[model routing](references/model-routing.md) and use the examples in
[music recipes](references/music-recipes.md) as patterns rather than fixed
claims.

## Use reference audio

For a local FLAC, MP3, or WAV reference, run only:

```text
python3 scripts/mcp_client.py upload <path> --mime-type <type>
```

The bundled command obtains and validates the upload grant, uploads exactly the
file bytes, and returns the artifact to use as `reference_audio`. Do not replace
it with host HTTP, a connector, REST, or a hand-written grant and PUT sequence.
The general upload limit is 100 MB; the selected music model can impose a lower
size or duration limit.

Describe what should carry over and what should change. A reference guides a
new creative result; after generation, review melody, vocal character, energy,
instrumentation, and arrangement against that direction.

## Confirm the paid boundary once

A direct, well-specified request to generate authorizes that exact request once.
Approval of the complete production card also authorizes it once. Do not add a
second confirmation. An estimate, comparison, lyric review, direction choice,
or “do not generate yet” is not approval.

Before a billable call, make model, title, lyrics or instrumental status,
reference, important controls, and the one-generation scope visible. Create a
stable 1..128-character `client_request_id` only after that payload is final.
Any change to prompt, lyrics, instrumental flag, title, model, reference,
model options, or any other argument accepted by the current or a future MCP
generation schema is a new paid request with a new identity and confirmation.
Fields outside the published MCP schema are ignored and do not change the
request identity or task.

Let the bundled client perform its cached, best-effort, non-billable
`beatra.installations.register` step automatically. Do not add manual
registration to the creative workflow.

Submit `beatra.music.generate` once. Retain its `task_id` and poll the same task
with `beatra.tasks.get`. Honor a returned `deadline_at`; otherwise stop active
polling after 30 minutes, report the current state and how to resume, and do not
resubmit. Cancel only when the user asks via `beatra.tasks.cancel`; if cancel
conflicts with a terminal transition, return to the same task.

For an uncertain submission or lost task ID, search recent work with
`beatra.tasks.list` using the matching music capability. List results do not
contain the complete request: call `beatra.tasks.get` for each plausible
candidate and compare its `task.input`, resolved model, reference, and options
with the saved full payload. Only an exact identical retry may reuse the same
`client_request_id`. Never create replacement paid work merely because a
response was lost or a task is slow. See
[tasks and results](references/tasks-and-results.md) and
[billing, errors, and recovery](references/billing-errors-and-recovery.md).

## Deliver and review the music

On success, present every `task.output.clips` entry in returned order. Include
the returned title and lyrics when present plus `clip.audio.url`, artifact ID,
duration, MIME type, and size. Report factual task identity and
`billing.net_charged_credits`. When the task returns `task.links.assets`, use
that exact destination for asset management; do not invent a generic URL.

Review composition, lyrics, vocal performance, pronunciation, role assignment,
arrangement, ending, and production only when the host can actually play the
audio. Otherwise label listening review incomplete while still delivering the
factual artifacts. Preserve successful qualities and turn the largest gap into
one focused, newly approved generation. Follow
[review and iteration](references/review-and-iteration.md).

## References by task

- Intent, lyrics, instrumental, multilingual, and reference routes: [intent and routing](references/intent-and-routing.md)
- Brief, style, lyrics craft, vocal direction, and language: [creative brief and style](references/creative-brief-and-style.md), [lyrics craft](references/lyrics-craft.md), and [vocal, language, and tags](references/vocal-language-and-tags.md)
- Current model selection and exact payload controls: [model routing](references/model-routing.md)
- Request patterns and focused result review: [music recipes](references/music-recipes.md) and [review and iteration](references/review-and-iteration.md)
- First installation or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Bundled command syntax and diagnostics: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Task recovery, billing, and returned results: [tasks and results](references/tasks-and-results.md) and [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Automatic update behavior and persistent controls: [automatic updates and safety](references/automatic-updates-and-safety.md)
- Package removal and shared credential handling: [uninstall and disconnect](references/uninstall-and-disconnect.md)

## Automatic updates and removal

Before ordinary Beatra commands, the bundled client silently checks for a
higher package version at most once every 24 hours. It uses the fixed official
discovery address and immutable official CDN source. It may automatically
install that higher version without separate confirmation. It verifies the
archive, manifest, and every packaged file, and replaces only
package-owned files. If checking, download, verification, replacement, or
recovery fails, the current installation stays usable and the original command
continues; an update failure never permits a paid retry.

The per-installation choice persists:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

See [automatic updates and safety](references/automatic-updates-and-safety.md)
for the complete verified-update contract. For removal or credential cleanup,
follow [uninstall and disconnect](references/uninstall-and-disconnect.md).
Never directly delete `~/.beatra` or shared credentials because another Beatra
package may use the same connection.
