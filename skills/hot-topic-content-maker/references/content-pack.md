# Content pack

The angle is picked. This turns it into the set the user will actually post: an image set, a video, or both. Everything here is planning, which costs nothing; the paid calls and their cards are in [hot topic workflow](workflow.md).

## Choosing the set

The set follows the platform. The user's choice always wins; otherwise:

| Where it will be posted | Set |
| --- | --- |
| Xiaohongshu, or another image-first feed | Image set |
| Douyin, WeChat Channels, Kuaishou, TikTok, Reels, Shorts | Video |
| Both kinds of feed | Image set plus video |

A video's style follows the angle:

| The angle is mostly | Default video |
| --- | --- |
| News, a quick briefing, an explainer, health or money basics, an opinion | Presenter video, virtual presenter |
| A product, a place, a scene, a holiday or seasonal moment | Scene video |

When the user asked for both kinds of feed, plan one angle, one cover, and one caption core, then adapt the caption's length and hashtags per platform. Do not plan two unrelated posts.

The cover's ratio follows the set. Whenever the image set is included, the cover is 3:4: on Xiaohongshu it is the note's first image and opens the post at the same ratio as the cards behind it. For a video on its own, the cover is 9:16. Name the ratio on the first approval card.

## Image set: inner cards

Plan 3 to 6 cards after the cover. Each card carries one point:

- a headline of about ten characters or four words;
- at most three short lines under it;
- the same palette, type style, and visual motif as the cover;
- 3:4 vertical.

Order the cards the way the caption delivers its points, so the post reads the same in pictures and in text. Each card's exact text is part of the plan the user approves; nothing is rendered from text they have not seen.

Keep text short for a reason that is practical, not stylistic: generated images render long text unreliably, and a card is read at phone size. When a point needs more words than a card holds, it belongs in the caption.

## Scene video

Plan 3 to 5 shots, 15 to 30 seconds in total, with one narration running across all of them.

| Field | Written for | Contains |
| --- | --- | --- |
| On screen | The image and video calls | Subject, framing, setting, lighting, one motion |
| Spoken | The speech call | The exact words, in speaking rhythm |

Budget the spoken fields at roughly four to five Chinese characters or two to three English words per second, and write to that rather than trimming after synthesis. The first shot carries the hook that names the topic; the last carries the one ask.

When the whole narration fits one take that the selected model admits (15 seconds or less on current cards), make a single take: the opening still is animated with the narration as its driving audio, and the other shots' stills are delivered as stills. Otherwise make one clip per shot, each as long as its share of the narration. Either way, the take or the per-shot clips are then joined into one finished video with the music and the subtitles (and, for per-shot clips, the narration), per [hot topic workflow](workflow.md).

Write a music brief: mood, tempo, two or three instruments, and "no vocals". The music is generated without lyrics and arrives as its own track.

## Presenter video

The presenter comes from, in this order:

1. **The user's own photo**, when they bring one and confirm they are the person pictured or have that person's consent. Upload it with the bundled client and check it against the live `image_to_video` card before it goes on a card, per [hot topic workflow](workflow.md). Once its video is delivered, offer to save it as an avatar for later posts, with the consent sentence given there.
2. **A saved avatar**, from `beatra.avatars.list`, with the voice paired to it. When the list returns a `default_avatar_id`, put that avatar on the first approval card as the proposed presenter, named, with the virtual presenter as the alternative: the user chose it as their default.
3. **A virtual presenter** made for this post: the default when no avatar is saved, or when the avatar list cannot be read. Describe a fictional presenter who resembles no real person, chest-up, facing the camera, plain or studio background, 9:16. It is made for one post and is not saved as an avatar, because saving asks the user to vouch for the person pictured.

Write the script for speaking: short sentences, one idea each, at the same speaking budget as above. One take holds up to the selected model's ceiling (15 seconds on current cards). A script that fits one take stays one take, whatever its sentence count; only a longer script splits into takes at sentence boundaries. Each take gets its own narration slice and its own video call, and the takes are joined into one finished video, each keeping its own sound, with the music and the subtitles.

When a broadcast has two or more takes, a scene shot may sit between two of them as a cutaway — a still of the topic's place or object, animated like a per-shot clip, two to four seconds long, muted, with no line, so only the music plays under it; it is one more video call on the gate-2 card; offer it when the topic has a picture worth showing, and do not add it by default. Decide the cutaway in the free plan, before gate 1, so its still and its video call are counted in gate 1's estimated total; it is not added after gate 1.

Do not put a real public figure's face or name on a presenter, and do not describe a virtual presenter that looks like one. A clip that seems to show a real person saying words they never said is impersonation, and a post riding a trend spreads faster than a correction can follow it. This covers the virtual presenter's description and any photo outside route 1: a real person's face comes only through route 1, the user's own photo or one they have that person's consent for, with the confirmation above.

## Subtitles, the finished video, and the edit list

Subtitles come from the approved narration, never from a transcript of the audio: the approved text is already exact, and nothing in this route transcribes speech. Split the narration at sentence or clause boundaries into lines of up to about 16 Chinese characters or 7 English words. Time each line from the real narration duration returned by the speech call: share the duration in proportion to each line's length, then move each boundary to the nearest clause end. Deliver them as an SRT file:

```text
1
00:00:00,000 --> 00:00:02,400
台风天出门前先拍三张照

2
00:00:02,400 --> 00:00:05,100
门窗、车辆、贵重物品各一张
```

The same lines and times are passed to the join as cues, which burns them into the picture. The join trims the music to the video, fades it out, and lowers it under speech.

The edit list is the fallback: it is delivered when the finished video could not be made, or when the user wants to cut the parts themselves. One row per shot or take, and the clip-audio column says whether the clip's own sound is kept.

A scene video's shots carry no narration, and a clip from an `auto` model may come back with generated sound of its own, so every shot is muted and the narration runs as its own track:

```text
| # | File | In | Out | Narration span | Subtitle lines | Clip audio | Music |
| 1 | shot-1.mp4 | 0.0 | 5.0 | 00:00.0–00:05.0 | 1–2 | mute | music.mp3 starts at 0.0, about 25% volume |
| 2 | shot-2.mp4 | 0.0 | 6.0 | 00:05.0–00:11.0 | 3–4 | mute | continue |
| 3 | shot-3.mp4 | 0.0 | 5.5 | 00:11.0–00:16.5 | 5–6 | mute | fade out over the last 1.5 s, cut at 16.5 |
```

Lay the narration as one continuous track from 0, put the muted shots on top in order, keep the music under the narration, and cut the music where the last shot ends.

A presenter take already carries its narration, lip-synced inside the clip, so the clip's sound is kept and no separate narration track is laid; the narration files are delivered for reference only. Laying them as well would play every line twice:

```text
| # | File | In | Out | Narration span | Subtitle lines | Clip audio | Music |
| 1 | take-1.mp4 | 0.0 | 12.6 | in the clip | 1–4 | keep | music.mp3 starts at 0.0, about 25% volume |
| 2 | take-2.mp4 | 0.0 | 9.8  | in the clip | 5–7 | keep | fade out over the last 1.5 s, cut at 22.4 |
```

A single take, scene or presenter, keeps its own sound for the same reason: its narration is inside it.
