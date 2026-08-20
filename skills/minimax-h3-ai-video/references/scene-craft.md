# Scene craft for MiniMax H3

## Build one readable shot

Lead with one camera move, then the subject and action, setting, light, color,
pace, and sound. A short H3 clip benefits from one clear visual idea rather than
several competing shots.

```text
Camera move + subject/action + setting + light/color + visual detail + sound cue
```

Example:

```text
Slow dolly push-in toward a centered luxury watch on black granite. A narrow
amber rim light travels across the polished metal while the second hand moves.
Quiet room tone and a crisp mechanical tick land on the final front-facing view.
```

## Camera language

- **Slow push-in:** attention, anticipation, product reveal.
- **Orbit:** form, materials, packaging, fashion, character silhouette.
- **Lateral tracking:** movement through a place, lifestyle, travel, vehicles.
- **Crane rise or descent:** scale, discovery, opening-title energy.
- **Static camera with subject motion:** performance, fabric, food, natural
  character movement.

Name one primary move in the opening sentence. Add a second beat only when the
duration supports a clear beginning and payoff.

## Light, color, and brand presentation

- **Clean studio:** soft controlled light, readable form, product focus.
- **Golden hour:** warm directional light, long shadows, emotional lifestyle.
- **Dramatic rim light:** separation, luxury, automotive, title sequences.
- **Neon practicals:** technology, nightlife, gaming, streetwear.
- **Natural daylight:** beauty, food, home, authentic creator content.

State the important brand color, label, typography, product shape, or character
feature as a positive visual anchor. Reserve calm negative space when a later
layout needs copy or a logo.

## Pace across 4–15 seconds

- **4–7 seconds:** one hook, one move, one payoff.
- **8–11 seconds:** establish, develop, reveal.
- **12–15 seconds:** opening, build, resolution with carefully connected beats.

Keep action physically readable. Use temporal words such as “begin,” “then,”
and “end” to describe the progression.

## Sound direction

H3 creates native stereo sound with the video. Write sound into the scene:

- environmental sound such as wind, water, footsteps, traffic, or room tone;
- musical mood such as restrained piano, energetic electronic rhythm, or a
  cinematic swell;
- a timed sound effect tied to the product reveal, title, or movement;
- dialogue only when the creator has supplied the intended words and voice
  direction.

## Canvas and destination

For text-to-video and explicit reference canvases:

- `16:9` for websites, presentations, YouTube, and landscape advertising;
- `9:16` for TikTok, Reels, Shorts, Douyin, and Xiaohongshu;
- `1:1` for square feeds;
- `3:4` for portrait editorial and product compositions;
- `4:3` for classic editorial or presentation framing;
- `21:9` for cinematic titles and premium widescreen work.

Image-to-video and first/last-frame generation inherit the source canvas and
omit `aspect_ratio`. Reference-to-video can use `adaptive` when the references
should determine the most suitable canvas.

## Ordered reference language

Use array order in the prompt:

```text
Image 1 defines the hero product. Image 2 guides only the warm studio palette.
Video 1 guides the slow orbit. Audio 1 guides the rhythm and final accent.
```

The labels are prompt language, not `role` fields. Preserve the source order in
the request.
