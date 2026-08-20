# Music

Use `beatra.music.generate` for a song with lyrics, an instrumental, or a new
track guided by reference audio.

- For an instrumental, put genre, mood, tempo feel, instrumentation, structure,
  and intended use in the prompt. Keep lyrics absent.
- When the user supplies lyrics, preserve them exactly unless they ask for
  writing or revision. Use the prompt for musical and vocal direction.
- For reference-guided work, state what musical qualities should guide the new
  result. Do not promise exact melody, voice, identity, or arrangement
  preservation.

Omit `model` unless the user explicitly chooses one. Use
`beatra.models.list` with the text-to-music or reference-audio-to-music
capability only when current compatibility, supported controls, constraints, or
price matters. Model-specific options are accepted only when the returned
interface card documents them; never move an option between model families or
silently drop one.

For a local reference, use only:

```text
python3 scripts/mcp_client.py upload <path> --mime-type <type>
```

Use its returned artifact as `reference_audio`. Do not manually call the raw
upload grant, use host HTTP, or send a local path. Respect the general 100 MB
upload ceiling plus any lower current model-specific limit.

The bundled MCP music route does not accept REST-only `callback_url`,
`callback_signing_key_id`, or `metadata`. Do not add them or use another
transport to obtain them.

Music generation is one billable asynchronous request. Finalize the complete
prompt, lyrics, instrumental status, title, model, reference, and accepted model
options before creating the stable `client_request_id`. Submit once and poll
the same task. An identical retry preserves every validated generation
argument; any accepted change is new paid work with a new identity and
confirmation.

On success, deliver every returned clip in order. Include returned title and
lyrics when present plus each audio URL or artifact ID, duration, MIME type,
and size when returned. Report the resolved model, actual usage, and terminal
billing. Do not claim to have reviewed composition, vocals, pronunciation, or
mix when the host cannot play the audio.
