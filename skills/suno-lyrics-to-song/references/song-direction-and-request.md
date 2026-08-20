# Song direction and request

## Build the music direction

The `prompt` is musical direction, never a copy of the lyrics. Keep it between 1 and
1000 characters and cover only useful attributes such as:

- genre and era-neutral style traits;
- mood and emotional arc;
- tempo feel and groove;
- instrumentation and production texture;
- verse, chorus, bridge, and ending contrast;
- lead-vocal delivery, range feel, energy, and phrasing;
- elements to avoid.

Do not promise an exact imitation of a real performer. Translate shorthand into
musical attributes. Keep duet, group, accent, timbre, and character-role requests as
soft descriptive guidance; generation may interpret them differently.

## Exact generation arguments

Every request in this Skill uses:

```json
{
  "model": "suno-5.5",
  "prompt": "1..1000 characters of style, mood, arrangement, and vocal direction",
  "lyrics": "confirmed non-empty lyrics, at most 5000 characters",
  "instrumental": false,
  "title": "confirmed non-empty title, at most 80 characters",
  "model_options": {
    "suno": {
      "custom_mode": true
    }
  },
  "client_request_id": "stable opaque value, 1..128 characters"
}
```

Any non-empty `lyrics` require `model_options.suno.custom_mode: true`, regardless of
whether the text came from the user, conversation context, or an authorized revision.
Never omit the explicit model or use `auto`.

Do not pass `reference_audio`, `callback_url`, `callback_signing_key_id`, or `metadata`.
Do not add speculative controls. If the user requests a single male or female lead,
`model_options.suno.vocal_gender` may be `m` or `f`; omit it for no preference, duets,
ensembles, alternating roles, or any request that cannot be represented by one lead.

## Final production card

Before generating audio, show the complete lyrics, title, and readable music
direction—not raw implementation details. Include `suno-5.5`, relevant options, and the
fact that approval starts one paid generation. Freeze the exact title, lyrics,
direction, model, and options after the user approves this complete card, then create
the request identity and submit. Do not require a second approval or an extra generate
command.

Generate one stable opaque request identity for that logical paid request. Reuse it
only when delivery of the identical request is unknown. If any title, lyric character,
prompt character, model, or option changes afterward, show the revised complete card,
obtain a fresh approval, and use a new identity.
