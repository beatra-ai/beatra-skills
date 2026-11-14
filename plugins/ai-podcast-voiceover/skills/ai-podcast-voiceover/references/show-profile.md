# Show profile

## Find the show before producing an episode

At the start of every episode, look for `./<show>/show-profile.json`. When it
exists, restate its intended listener, `listener_level`, host, language,
`words_per_minute`, synthesis settings, opener, closer, pronunciations,
known episode order, and the latest `one_line_recap` before proposing work.
Treat it as a useful local snapshot, then re-validate the stored host with a
fresh `beatra.voices.list` result before reuse.

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
  "listener_level": "<入门 | 进阶 | 专业>",
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
  "words_per_minute": null,
  "pronunciations": [{ "term": "<written>", "say": "<spoken>" }],
  "episodes": [
    {
      "n": 12,
      "title": "<title>",
      "one_line_recap": "<one sentence of what this episode already said>",
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

`listener_level` is one of the three tokens in the schema. The gloss beside
each token says how much background the host gives:

```text
入门: beginner. Explain terms a new listener would not know.
进阶: intermediate. Assume the common vocabulary.
专业: specialist. Spend the time on the point.
```

When the user does not choose, infer one token from the intended listener and
mark that inference with the draft.

`words_per_minute` stays null until the returned sample supplies a measured
rate in characters per minute. The first length estimate, before that
measurement, is about 225 characters per minute and stays labelled as an
estimate. Later estimates use the stored rate. An episode that skips the
sample keeps the stored rate. The measurement is in
[voice, delivery, and recovery](voice-and-delivery.md).

Each episode record includes `one_line_recap`, one sentence of what that
episode already said. The next episode's opening may continue from the
previous recap. The close may name the next episode when the profile already
has that plan, and the tease adds no new fact. The recap itself only restates
what that episode said.

## Re-validate before reuse

Use `beatra.voices.list` to confirm the stored `voice_id` is still listed as
`ready`, then use the current text-to-speech model cards to confirm the model
and language path still holds. If the voice is absent, unavailable, or no
longer has a usable path, explain that before freezing a new host. Never submit
a stored value that the current listing does not confirm.

After successful delivery, append the episode number, title, `one_line_recap`,
task ID, weighted-character total, returned `billing.net_charged_credits` when
present, and timestamp. Write the profile, script, or an episode record only when the
host has user-approved access to that working directory. Otherwise hand the
same factual record and returned artifact URL to the user for their own ledger.
An accepted episode keeps its own user-managed record so later work preserves
the earlier delivery.
