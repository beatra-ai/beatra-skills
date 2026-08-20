# MiniMax H3 media requirements

Check local files before uploading when their metadata is available. Remote
HTTPS and data-URI inputs are probed by Beatra before the paid task is admitted.

## Images

Strict first/last frames and reference images accept:

- MIME: `image/jpeg`, `image/png`, `image/webp`, `image/heic`, or `image/heif`;
- size: at most 30 MiB;
- width and height: 256–5760 px each;
- width-to-height ratio: 0.4–2.5.

The two strict boundary frames should use compatible dimensions, subject scale,
viewpoint, light, and scene logic. Their exact intermediate path is generated,
not manually keyframed.

## Reference video

Reference videos accept:

- MIME: `video/mp4` or `video/quicktime`;
- size: at most 50 MiB each;
- width and height: 256–5760 px each;
- width-to-height ratio: 0.4–2.5;
- duration: 2–15 seconds each, with all reference videos totaling at most
  15 seconds;
- frame rate: 23.976–60 FPS;
- video codec: H.264 or H.265;
- audio track: absent, AAC, or MP3.

At most three reference videos are accepted.

## Reference audio

Reference audio accepts:

- MIME: `audio/mpeg`, `audio/mp3`, `audio/wav`, or `audio/x-wav`;
- size: at most 15 MiB each;
- duration: 2–15 seconds each, with all reference audio totaling at most
  15 seconds.

At most three audio clips are accepted. An audio-only reference set is valid.

## Upload behavior

Use the bundled client helper:

```text
python3 scripts/mcp_client.py upload ./creative-reference.png --mime-type image/png
```

Preserve the returned artifact reference. Upload only makes bytes available to
the remote tool; it does not establish what is visible or audible in the file.
