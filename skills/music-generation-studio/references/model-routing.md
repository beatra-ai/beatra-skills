# Model routing

## Creative default and live discovery

Set `model: "suno-5.5"` for every ordinary generation in this package. Do not
omit the field and do not use `auto` silently.

Call `beatra.models.list` with `text_to_music` or
`reference_audio_to_music` when the user names an alternative, asks for current
price or availability, or needs model-specific behavior. Report only returned
facts. If the default is unavailable, explain the result and ask before using a
different model.

The base request requires `prompt` and `client_request_id`. It may include
`lyrics`, `instrumental`, `title`, `reference_audio`, and `model_options`.
Outside family-specific limits, prompt is at most 2,000 characters, lyrics at
most 5,000, and title at most 100.

## Suno 5.5

Use Suno custom mode for caller-supplied lyrics, dedicated Suno controls, or a
reference with `audio_weight`.

- simple prompt: at most 500 characters;
- custom prompt: at most 1,000 characters;
- lyrics: at most 5,000 characters;
- title: at most 80 characters;
- caller-supplied lyrics require `custom_mode: true`;
- custom mode requires a title, and a custom vocal request also requires
  lyrics;
- reference: FLAC, MP3, or WAV, at most 480 seconds;
- `negative_tags`: at most 200 characters; this limit applies only to
  exclusions, while prompts, lyrics, and titles keep their own limits above;
- `vocal_gender`: `m` or `f`;
- `style_weight`, `weirdness_constraint`, and `audio_weight`: 0..1 in 0.01
  increments.

## MiniMax

Use MiniMax only after the user explicitly selects it from current returned
options.

For ordinary MiniMax generation:

- prompt: at most 2,000 characters;
- lyrics: at most 3,500 characters;
- title: at most 100 characters; and
- vocal music requires lyrics unless
  `model_options.minimax.lyrics_optimizer=true`.

For MiniMax reference generation:

- prompt: 10..300 characters;
- lyrics are optional; when supplied, they must be 10..1,000 characters;
- reference: FLAC, MP3, or WAV, 6..360 seconds, no more than 50 MB;
- `instrumental=true` is rejected; and
- `lyrics_optimizer` is rejected.

Never send Suno controls to MiniMax, MiniMax controls to Suno, or guessed
controls to a newly discovered model.

## Reference upload

For a local reference file, use only:

```text
python3 scripts/mcp_client.py upload <path> --mime-type <type>
```

The command validates the upload grant and returns the artifact reference:

```json
{
  "reference_audio": {
    "type": "artifact",
    "artifact_id": "art_..."
  }
}
```

Do not use host HTTP, a connector, REST, or a manual grant and PUT flow. The
general upload route accepts at most 100 MB, but the selected model's lower
limits still apply. Record what should carry over and what should change, then
review the returned voice character, melody, energy, instrumentation, and
arrangement against that direction.

## Request identity and recovery

One exact approved payload equals one billable `beatra.music.generate` call.
Assign one stable 1..128-character `client_request_id`, submit once, retain the
returned `task_id`, and poll that task with `beatra.tasks.get`. Use a returned
`deadline_at`; otherwise bound active polling to 30 minutes and report how to
resume.

Every argument accepted by the current or a future MCP music-generation schema
is part of identity, including prompt, lyrics, instrumental flag, title, model,
reference, and model options. Any change requires a new ID and paid
confirmation. Fields outside that schema are ignored and do not change the
request identity or task.

If the response or task ID is lost, call `beatra.tasks.list` for the plausible
music capability. Then call `beatra.tasks.get` for each candidate and compare
its `task.input`, resolved model, reference, and options with the saved full
payload. A list item alone is not enough to establish identity. Resubmit with
the original ID only when the full payload is exactly identical and recovery
still requires the idempotent retry.
