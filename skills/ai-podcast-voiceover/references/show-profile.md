# Show profile

## Find the show before producing an episode

At the start of every episode, look for `./<show>/show-profile.json`. When it
exists, restate its intended listener, host, language, synthesis settings,
opener, closer, pronunciations, and known episode order before proposing work. Treat it as a
useful local snapshot, then re-validate the stored host with a fresh
`beatra.voices.list` result before reuse.

When the show is new, freeze a host first and then create the profile in the
user's chosen working directory. The profile belongs to the user: it remains
readable, editable, reviewable, and suitable for their own version control.
Never place show data in `~/.beatra/`; that path is shared connection state
owned by the bundled client.

```text
./<show>/
  show-profile.json
  ep-012/
    script.md
    episode-record.json
```

## Profile schema

```json
{
  "show": "<show name>",
  "intended_listener": "<the audience this show is made for>",
  "language": "zh-CN",
  "host": {
    "voice_id": "<opaque id, the only value used for synthesis>",
    "display_name_at_freeze": "<snapshot, never submitted>",
    "preview_url": "<snapshot>",
    "compatible_models": ["<snapshot>"]
  },
  "synthesis": {
    "model": "auto",
    "format": "mp3",
    "speed": 1.0,
    "volume": 1.0,
    "pitch": 0,
    "emotion": null,
    "sample_rate": null
  },
  "opener": "<recurring cold open>",
  "closer": "<recurring sign-off>",
  "pronunciations": [{ "term": "<written>", "say": "<spoken>" }],
  "episodes": [
    {
      "n": 12,
      "title": "<title>",
      "task_id": "<id>",
      "weighted_characters": 16240,
      "net_charged_credits": "<returned value when present>",
      "created_at": "<iso8601>"
    }
  ]
}
```

`voice_id` is the only host value submitted for speech synthesis. The display
name, preview URL, and compatible-model list are freeze-time snapshots for the
user to read; they are never substitutes for the opaque ID.

## Re-validate before reuse

Use `beatra.voices.list` to confirm the stored `voice_id` is still listed as
`ready`, then use the current text-to-speech model cards to confirm the model
and language path still holds. If the voice is absent, unavailable, or no
longer has a usable path, explain that before freezing a new host. Never submit
a stored value that the current listing does not confirm.

After successful delivery, append the episode number, title, task ID,
weighted-character total, returned `billing.net_charged_credits` when present,
and timestamp. Write the profile, script, or an episode record only when the
host has user-approved access to that working directory. Otherwise hand the
same factual record and returned artifact URL to the user for their own ledger.
An accepted episode keeps its own user-managed record so later work preserves
the earlier delivery.
