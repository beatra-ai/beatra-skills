# Beatra Skills

Agent Skills for creative production. Each skill runs in your agent and renders on [Beatra](https://beatra.ai).

> [!IMPORTANT]
> Rendering needs a [Beatra](https://beatra.ai) account and uses credits. Every skill is free to install.

| Question | Answer |
| --- | --- |
| **What it does** | Agent Skills that plan, direct, and review AI images, video, music, and voice, then render them on Beatra. |
| **Requirements** | Python 3.10+ and an agent that loads `SKILL.md` |
| **Cost** | Free to install. Each render uses credits on your Beatra account, and paid steps run only when you ask for that exact render or approve its card. |
| **Works with** | Claude Code, Codex, OpenClaw |

Every skill here is the same package Beatra publishes to its official channels,
built from the immutable release archive on `cdn.beatra.ai` and verified by
SHA-256 before it lands in this repository.

## Install

With the [`skills`](https://skills.sh) CLI, from this repository:

List everything available here:

```bash
npx skills add beatra-ai/beatra-skills --list
```

Install one skill:

```bash
npx skills add beatra-ai/beatra-skills --skill ai-logo-maker
```

Install all of them:

```bash
npx skills add beatra-ai/beatra-skills --all
```

Or copy a skill folder straight into your agent's skills directory —
`~/.claude/skills/` for Claude Code, `~/.agents/skills/` for Codex,
`~/.openclaw/skills/` for OpenClaw, and the equivalent path for any other agent
that reads `SKILL.md`.

## Specs

As of 2026-10-16. Live list: https://docs.beatra.ai/en/docs/models

- **Image understanding** — 1 model (MiniMax M3)
- **Video understanding** — 1 model (MiniMax M3)
- **Text to image** — 10 models (Qwen Image 2.0 Fast, Qwen Image 3.0, Qwen Image 3.0 Pro, GPT Image 2.5 Flare, GPT Image 2.5 Sunburst, GPT Image 2, Wan Image 2.7 Fast, Qwen Image 2.0 Pro, Wan Image 2.7 Pro, MiniMax Image 01 Live); up to 4 images per request; canvas up to 16777216 pixels
- **Image to image** — 10 models (Qwen Image 2.0 Fast, Qwen Image 3.0, Qwen Image 3.0 Pro, Wan Image 2.7 Fast, Qwen Image 2.0 Pro, Wan Image 2.7 Pro, GPT Image 2.5 Flare, GPT Image 2.5 Sunburst, GPT Image 2, MiniMax Image 01 Live); up to 4 images per request; canvas up to 16777216 pixels
- **Image editing** — 6 models (Qwen Image 2.0 Fast, Qwen Image 3.0, Qwen Image 3.0 Pro, Wan Image 2.7 Fast, Qwen Image 2.0 Pro, Wan Image 2.7 Pro); up to 4 images per request; canvas up to 4194304 pixels
- **Text to video** — 9 models (seedance-2-mini, wan2.7-t2v, wan3.0-video, minimax-h3, happyhorse-1.1-t2v, seedance-2-fast, seedance-2, wan3.0-video-prime, seedance-2.5); 480p to 4K; 2–30 s; aspect ratios 16:9, 1:1, 21:9, 3:4, 4:3, 9:16, 4:5, 5:4, 9:21; MOV, MP4; 2 with native audio
- **Image to video** — 9 models (wan2.7-i2v, wan3.0-video, minimax-h3, seedance-2-mini, happyhorse-1.1-i2v, seedance-2-fast, seedance-2, wan3.0-video-prime, seedance-2.5); 480p to 4K; 2–30 s; aspect ratios 16:9, 1:1, 21:9, 3:4, 4:3, 9:16; MOV, MP4; 2 with native audio
- **Reference to video** — 9 models (wan2.7-r2v, minimax-h3, wan3.0-video, happyhorse-1.1-r2v, seedance-2-mini, seedance-2-fast, seedance-2, wan3.0-video-prime, seedance-2.5); 480p to 4K; 2–30 s; aspect ratios 16:9, 1:1, 3:4, 4:3, 9:16, 21:9, 4:5, 5:4, 9:21; MOV, MP4; 2 with native audio
- **First and last frames to video** — 8 models (wan2.7-i2v, wan3.0-video, minimax-h3, seedance-2-mini, seedance-2-fast, seedance-2, wan3.0-video-prime, seedance-2.5); 480p to 4K; 2–30 s; aspect ratios 16:9, 1:1, 21:9, 3:4, 4:3, 9:16; MOV, MP4; 2 with native audio
- **Video editing** — 8 models (wan2.7-videoedit, wan3.0-video, happyhorse-1.0-video-edit, seedance-2-mini, seedance-2-fast, seedance-2, wan3.0-video-prime, seedance-2.5); 480p to 4K; 2–30 s; aspect ratios 16:9, 1:1, 3:4, 4:3, 9:16, 21:9; MOV, MP4
- **Video extension** — 7 models (wan2.7-i2v, wan3.0-video, seedance-2-mini, seedance-2-fast, seedance-2, wan3.0-video-prime, seedance-2.5); 480p to 4K; 2–30 s; aspect ratios 16:9, 1:1, 21:9, 3:4, 4:3, 9:16; MOV, MP4; 1 with native audio
- **Text to music** — 2 models (Suno 6, MiniMax Music 3.0); lyrics up to 5000 characters
- **Reference audio to music** — 2 models (Suno 6, MiniMax Music 3.0); lyrics up to 5000 characters
- **Text to speech** — 2 models (MiniMax Speech 2.8 HD, MiniMax Speech 2.8 Turbo); FLAC, MP3, OPUS, PCM, WAV; 40 languages; up to 44.1 kHz; up to 50000 characters per request
- **Voice cloning** — 1 model (MiniMax Voice Clone)

## Skills

| Skill | What it does | Version |
| --- | --- | --- |
| [`ai-audiobook-narration`](skills/ai-audiobook-narration) | Turn final manuscript or course text into ordered chapter audio with one narrator, a representative sample, clear pricing, and focused refinements. | 0.2.9 |
| [`ai-comic-drama-shot-maker`](skills/ai-comic-drama-shot-maker) | Turn an approved comic panel, character sheet, or story beat into one dynamic comic-drama shot — animate a manga frame, interpolate two comic panels, or combine loose references into a new motion-comic shot. | 0.2.4 |
| [`ai-courseware-maker`](skills/ai-courseware-maker) | Turn a topic, grade, and lesson length into an editable PowerPoint lesson deck with matching illustrations and the script in the notes. | 0.1.5 |
| [`ai-headshot-studio`](skills/ai-headshot-studio) | Turn a casual selfie into a studio-quality professional headshot with new backgrounds, professional attire, and studio lighting for LinkedIn, resume, company website, and social media. | 0.2.1 |
| [`ai-image-generation-studio`](skills/ai-image-generation-studio) | Generate, compose, and edit product images, brand visuals, posters, social graphics, illustrations, and photo variations. | 0.2.2 |
| [`ai-image-realism`](skills/ai-image-realism) | Make existing AI portraits, product images, and marketing visuals look more natural by fixing plastic skin, malformed hands and faces, repeated textures, and inconsistent lighting. | 0.3.4 |
| [`ai-logo-maker`](skills/ai-logo-maker) | Turn a brand name, industry, or reference image into a professional AI logo, brand mark, or app icon with multi-concept exploration, precise brand colors, and scalable composition. | 0.2.5 |
| [`ai-multilingual-dubbing`](skills/ai-multilingual-dubbing) | Create reviewable multilingual voice-over audio from scripts for each language, with deliberate casting, pronunciation and timing pilots, and delivery organized by market and segment. | 0.2.6 |
| [`ai-music-video-clip-maker`](skills/ai-music-video-clip-maker) | Create a short visual clip guided by a song's mood and rhythm — turn a music excerpt and visual direction into a cinematic promo clip, animate cover art in time with the music, or build a mood visual from loose references. | 0.2.3 |
| [`ai-photo-cleanup-studio`](skills/ai-photo-cleanup-studio) | Point at what you want gone and get the photo back without it, with the space behind filled to match. | 0.2.0 |
| [`ai-photo-restyler`](skills/ai-photo-restyler) | Turn a photo into anime, manga, comic, cartoon, watercolor, clay, or 3D character art while the subject stays recognisable, and repeat the same look across a whole set. | 0.2.1 |
| [`ai-podcast-voiceover`](skills/ai-podcast-voiceover) | Turn an article, notes, or finished script into a listenable solo podcast episode with a consistent host voice, natural pacing, pronunciation control, and MP3 delivery. | 0.2.4 |
| [`ai-short-drama-shot-maker`](skills/ai-short-drama-shot-maker) | Generate one cinematic vertical micro-drama shot from a frozen beat and references — from text alone, an approved opening image, two endpoint images, or loose actor and location references. | 0.2.3 |
| [`ai-song-cover-studio`](skills/ai-song-cover-studio) | Upload a reference song and reimagine it as a new cover — change the genre, arrangement, and vocal direction into rock, acoustic, folk, jazz, or Chinese-style. | 0.2.0 |
| [`ai-storyboard-generator`](skills/ai-storyboard-generator) | Turn a script, scene, or ad brief into a practical shot list and one to four storyboard key-frame images. | 0.2.4 |
| [`ai-video-continuation`](skills/ai-video-continuation) | Continue one short clip before or after its action — add matching footage to the opening or ending for a natural continuation, longer hold, or stronger ending. | 0.2.5 |
| [`ai-video-image-music-studio`](skills/ai-video-image-music-studio) | Generate AI video, images, music, and voice-over in one creative flow, edit visual results, and keep every finished piece easy to find. | 0.2.7 |
| [`ai-video-restyler`](skills/ai-video-restyler) | Restyle one short video into a new visual treatment — turn live action into anime, illustration, Chinese comic, ink, clay, or cyberpunk while keeping the subject, action, and camera. | 0.2.1 |
| [`airbnb-welcome-avatar`](skills/airbnb-welcome-avatar) | Turn authorized stills and stay facts into one welcome talking clip per photo. | 0.2.2 |
| [`amazon-a-plus-module-pack`](skills/amazon-a-plus-module-pack) | Turn seller-supplied selling points into one Amazon A+ module still per point. | 0.2.1 |
| [`amazon-main-image-motion`](skills/amazon-main-image-motion) | Turn one approved white-background main image into one short clip for the listing main video slot. | 0.2.2 |
| [`art-demo-set`](skills/art-demo-set) | Turn user-supplied drawing steps into one still per art demo page. | 0.2.1 |
| [`assembly-one-step-clip`](skills/assembly-one-step-clip) | Turn authorized stills and seller-supplied step facts into one assembly step video per still. | 0.2.1 |
| [`audio-drama-voice-studio`](skills/audio-drama-voice-studio) | Give every character in your script its own voice and get the whole scene recorded line by line, in script order. | 0.2.5 |
| [`beatra`](skills/beatra) | Create AI images, videos, music, and voice, look up public social data, edit supported visual results, and keep returned files and credit use easy to track through one shared connection. | 2.9.6 |
| [`beatra-ai-image-studio`](skills/beatra-ai-image-studio) | Generate, compose, and edit product images, brand visuals, posters, social graphics, illustrations, and photo variations. | 1.2.1 |
| [`beatra-ai-music-creator`](skills/beatra-ai-music-creator) | Turn a theme, lyric, scene, or reference audio into reviewable songs, instrumentals, BGM, and soundtracks with a clear creative direction and focused revisions. | 1.4.3 |
| [`beatra-ai-video-studio`](skills/beatra-ai-video-studio) | Generate, animate, edit, and extend short AI videos for ads, product stories, social posts, b-roll, transitions, and cinematic concepts. | 1.3.4 |
| [`beatra-ai-voice-studio`](skills/beatra-ai-voice-studio) | Choose or reuse a voice, turn scripts into ready-to-edit narration, plan ordered long-form or multilingual audio, and create a reusable custom voice. | 0.3.4 |
| [`bilibili-publishing-pack`](skills/bilibili-publishing-pack) | Turn a Bilibili video topic, outline, or script into title options, a clear description, tags, a pinned comment, chapters when you supply timestamps, and a thumbnail brief. | 0.2.4 |
| [`bilibili-thumbnail-maker`](skills/bilibili-thumbnail-maker) | Turn a Bilibili video topic, title, script, clip frame, portrait, product photo, or draft into a clear Bilibili video thumbnail with a strong visual hook and headline-safe space. | 0.2.1 |
| [`bilibili-video-storyboard`](skills/bilibili-video-storyboard) | Turn a Bilibili topic, title, outline, or script into a chapter-led shot list and one to four key storyboard frames for an explainer, review, tutorial, vlog, gameplay, or creative video. | 0.2.2 |
| [`blackboard-one-shot`](skills/blackboard-one-shot) | Turn authorized blackboard photos and teacher-supplied facts into one blackboard one-shot clip per photo. | 0.2.2 |
| [`brand-jingle-studio`](skills/brand-jingle-studio) | Turn a brand name, slogan, and campaign use into a set of original brand jingles, ad songs, and audio-logo stings. | 0.1.9 |
| [`comment-pin-card`](skills/comment-pin-card) | Turn a finished video's comments into one pin comment still per original quote. | 0.2.2 |
| [`comment-voc-miner`](skills/comment-voc-miner) | Give a post link, a category, or comments you already copied, and get objections, verbatim lines, FAQ answers, and spoken hooks written in the audience's own words. | 0.2.2 |
| [`community-site-clip`](skills/community-site-clip) | Turn authorized community event site photos and office-supplied facts into one community site clip per photo. | 0.2.2 |
| [`course-narration-studio`](skills/course-narration-studio) | Turn lecture manuscripts and course slides into a lecture-by-lecture narration pack with one consistent teacher voice. | 0.2.4 |
| [`course-video-studio`](skills/course-video-studio) | Turn lecture scripts and one authorized teacher portrait into talking-head lesson videos. | 0.2.5 |
| [`cover-performance-preflight`](skills/cover-performance-preflight) | Review an existing thumbnail or cover, optionally against what already ranks for the same topic, receive a practical improvement plan, and create two or three visual candidates ready to compare. | 0.2.1 |
| [`creator-account-teardown`](skills/creator-account-teardown) | Read a creator account from a handle, or from the screenshots, bio, captions, and visible post metrics you have, diagnose its positioning, audience, content matrix, hook pattern, and cadence, then turn all of it into your own positioning, pillars, hook formula, opening plan, and a first post produced with its cover rendered and its script voiced. | 0.2.3 |
| [`creator-drop-talking`](skills/creator-drop-talking) | Turn a confirmed new-drop script and authorized stills into one drop talking clip per still. | 0.2.2 |
| [`cs-macro-card-set`](skills/cs-macro-card-set) | Turn user-supplied customer-service macro titles and talk tracks into a four-to-eight still CS macro card set. | 0.2.1 |
| [`douyin-cover-maker`](skills/douyin-cover-maker) | Turn a short-video topic, hook, portrait, product photo, or reference image into a clear vertical Douyin cover with a bold focal visual and a headline-safe composition. | 0.2.1 |
| [`douyin-data-brief`](skills/douyin-data-brief) | Give a Douyin link, a keyword, or counts you already copied, and get an attributed one-page brief. | 0.1.9 |
| [`douyin-hot-to-hook-clip`](skills/douyin-hot-to-hook-clip) | Turn a Douyin hot search topic into one talking hook clip per still. | 0.2.1 |
| [`douyin-live-commerce-visual-kit`](skills/douyin-live-commerce-visual-kit) | Turn a live-selling theme, product details, product photos, and brand references into a coordinated Douyin live-commerce visual kit with a pre-live promo cover, product selling-point card, and live-room background or overlay visual. | 0.1.9 |
| [`douyin-ugc-ad-creator`](skills/douyin-ugc-ad-creator) | Turn a product photo, selling point, and creator direction into a short vertical Douyin UGC ad with an AI presenter, natural spoken pitch, and a clear product moment. | 0.2.6 |
| [`douyin-video-comments-to-faq`](skills/douyin-video-comments-to-faq) | Turn Douyin video comments into one comment FAQ still per picked question. | 0.2.2 |
| [`douyin-video-script-maker`](skills/douyin-video-script-maker) | Turn a video topic, product, service, or creator idea into three hooks and a ready-to-film Douyin script with spoken lines, shot beats, caption cues, a title, hashtags, and a comment prompt. | 0.2.6 |
| [`earnings-script-read`](skills/earnings-script-read) | Turn an official earnings script into one spoken earnings script read per labeled section. | 0.2.3 |
| [`ecommerce-detail-module-studio`](skills/ecommerce-detail-module-studio) | Create three to six coordinated ecommerce detail modules with a product story and layout guide. | 0.2.1 |
| [`ecommerce-listing-image-set`](skills/ecommerce-listing-image-set) | Turn verified SKU facts and product photos into a cohesive ecommerce image set with a hero image, feature visuals, lifestyle scenes, size views, and in-box images. | 0.2.7 |
| [`exam-mnemonic-song`](skills/exam-mnemonic-song) | Turn one exam knowledge point into a mnemonic song you can replay, then turn the rest of the syllabus into a set. | 0.2.1 |
| [`first-last-frame-video`](skills/first-last-frame-video) | Turn two approved images into one directed clip — generate a smooth transition from a first frame to a last frame for transformations, reveals, and scene changes. | 0.2.3 |
| [`founder-ip-avatar-studio`](skills/founder-ip-avatar-studio) | Turn one authorized founder or expert portrait and a weekly script into a talking-head IP video in that person's likeness and voice. | 0.2.0 |
| [`game-script-voice-pack`](skills/game-script-voice-pack) | Turn a murder-mystery or indie-game script into a labeled multi-character voice pack. | 0.2.0 |
| [`game-ui-voice-pack`](skills/game-ui-voice-pack) | Turn written game UI lines into one game voiceover clip per labeled cue. | 0.2.1 |
| [`geo-place-talking`](skills/geo-place-talking) | Turn a user-supplied geography place table and authorized stills into one geography place talking clip per still. | 0.2.1 |
| [`gpt-image-2-5-studio`](skills/gpt-image-2-5-studio) | Create one GPT Image 2.5 still from a brief or reference images with Flare or Sunburst. | 0.1.9 |
| [`hanzi-card-set`](skills/hanzi-card-set) | Turn user-supplied character lists into a four-to-eight still hanzi card set. | 0.2.1 |
| [`hiring-avatar-studio`](skills/hiring-avatar-studio) | Turn one HR or founder portrait and a job brief into one talking-avatar hiring video per open role. | 0.2.0 |
| [`hot-topic-content-maker`](skills/hot-topic-content-maker) | Bring a trending topic or seasonal peg, or have it read the trending boards for you, and get the angles, the cover, the caption, the hashtags, and a short narrated clip — ready to publish while the topic is still moving. | 0.3.1 |
| [`hotel-amenity-clip`](skills/hotel-amenity-clip) | Turn hotel amenity stills the property already took into one hotel amenity video per labeled still. | 0.2.1 |
| [`image-to-motion`](skills/image-to-motion) | Animate one product image, portrait, photo, illustration, or AI artwork into a directed short video with purposeful motion and camera movement. | 0.2.5 |
| [`indie-game-ost-pack`](skills/indie-game-ost-pack) | Build an original indie game OST pack of 8 to 15 instrumental tracks for title, explore, battle, shop, and victory. | 0.1.9 |
| [`influencer-fit-analyzer`](skills/influencer-fit-analyzer) | Give a category, budget, and market, or handles you already have, and get an 8-12 person memo. | 0.2.1 |
| [`instagram-highlight-cover`](skills/instagram-highlight-cover) | Make one Instagram highlight cover still per named highlight, after reading the account's Reels and posts or from a highlight list you already wrote. | 0.2.3 |
| [`ip-character-consistency-studio`](skills/ip-character-consistency-studio) | Build a reusable character visual pack from one to four ordered references or an original brief, then create character sheets, poses, expressions, and story scenes. | 0.2.1 |
| [`ivr-voice-pack`](skills/ivr-voice-pack) | Build a labeled IVR voice pack for a phone tree: welcome, menu, hold, transfer, after-hours, and error prompts in one consistent brand voice. | 0.2.1 |
| [`lecture-video-maker`](skills/lecture-video-maker) | Turn slides and lecture notes into a whole course of lecture videos in the teacher's voice, with subtitles and an optional digital-human opening and closing. | 0.1.5 |
| [`legal-explainer-clip`](skills/legal-explainer-clip) | Turn one public-education legal topic into a labeled digital-human still, a speakable explainer script, and one talking clip. | 0.2.1 |
| [`listing-room-video-pack`](skills/listing-room-video-pack) | Turn listing photos into a labeled set of listing room video clips, one room at a time. | 0.2.0 |
| [`live-commerce-script-studio`](skills/live-commerce-script-studio) | Turn a product lineup into a minute-by-minute live selling schedule, a seven-step talk track per product, a library of ready-to-read lines, and the cards and spoken takes the room works from. | 0.2.1 |
| [`livestream-bgm-pack`](skills/livestream-bgm-pack) | Build an original livestream BGM playlist of 10 to 20 instrumental tracks for a room, store, or live-commerce shift. | 0.2.0 |
| [`marketplace-main-image-preflight`](skills/marketplace-main-image-preflight) | Review an existing marketplace main image, create a clear preflight card, and make one focused cleanup edit. | 0.2.0 |
| [`micro-lesson-maker`](skills/micro-lesson-maker) | One lesson's slides or a single topic into a narrated micro-lesson video with subtitles and an optional digital-human opening. | 0.1.6 |
| [`minimax-h3-ai-video`](skills/minimax-h3-ai-video) | Turn ideas, images, opening and closing frames, or multimodal references into polished 2K AI videos for ads, ecommerce, brands, dynamic posters, games, film titles, and social content. | 0.2.3 |
| [`music-generation-studio`](skills/music-generation-studio) | Turn a theme, lyric, scene, or reference audio into reviewable songs, instrumentals, BGM, and soundtracks with a clear creative direction and focused revisions. | 0.2.5 |
| [`novel-promo-video-maker`](skills/novel-promo-video-maker) | Turn a novel chapter or story script into narrated vertical short video scenes with illustrated shots that keep every character looking the same from beat to beat. | 0.2.3 |
| [`office-floor-tour`](skills/office-floor-tour) | Turn seller-supplied office floor stills into one office floor tour clip per labeled still. | 0.2.2 |
| [`oral-seeding-video-maker`](skills/oral-seeding-video-maker) | Start from a topic and get a narrated vertical recommendation video — script, ready-to-edit still frames, voice, and a clip animated from the opening frame, with nothing to upload. | 0.2.6 |
| [`personalized-song-maker`](skills/personalized-song-maker) | Turn a person's story and occasion into original lyrics and a newly generated song. | 0.1.9 |
| [`photo-singing-video`](skills/photo-singing-video) | Animate one clear portrait with a short singing audio excerpt to create an expressive singing-photo clip. | 0.2.2 |
| [`poster-design-studio`](skills/poster-design-studio) | Turn a topic description, a product photo, or brand references into a scroll-stopping event poster, promotional banner, or social media graphic with strong visual hierarchy, category-matched styling, and text-safe zones. | 0.2.1 |
| [`product-on-model-locale-studio`](skills/product-on-model-locale-studio) | Turn apparel and wearable product photos into localized on-model ecommerce images, with one fashion-model visual for each market. | 0.2.1 |
| [`product-photo-studio`](skills/product-photo-studio) | Transform a real product photo into a studio-quality ecommerce image, lifestyle scene, or marketplace-ready hero shot with clean backgrounds, professional lighting, and composition guided by confirmed product details. | 0.2.7 |
| [`product-video-studio`](skills/product-video-studio) | Turn one product photo into a vertical product video with spoken narration, ready to post. | 0.2.3 |
| [`publish-preflight-studio`](skills/publish-preflight-studio) | Paste the copy and get a compliance read with a replacement for every flagged phrase, an audience read that names the line losing each reader, a hook and share score, the corrected copy, and a cover rendered from the fixed wording. | 0.2.1 |
| [`radio-drama-ad-break`](skills/radio-drama-ad-break) | Turn written radio-drama ad-break lines into one spoken bumper clip per labeled slot. | 0.2.2 |
| [`real-estate-listing-set`](skills/real-estate-listing-set) | Turn seller-supplied floor-plan facts into one listing still per room. | 0.2.1 |
| [`rednote-beauty-note-maker`](skills/rednote-beauty-note-maker) | Turn beauty or skincare facts into a Xiaohongshu 3:4 note concept with review copy, usage scenes, titles, cover wording, and hashtags. | 0.1.9 |
| [`rednote-carousel-maker`](skills/rednote-carousel-maker) | Turn a post outline, product details, photo set, or style reference into an ordered 3:4 Xiaohongshu carousel with a hook cover and coherent supporting slides. | 0.2.0 |
| [`rednote-food-note-maker`](skills/rednote-food-note-maker) | Turn a dish photo, restaurant visit theme, or dining-atmosphere reference into a coordinated vertical 3:4 REDnote food note with a cover and supporting restaurant-story images. | 0.1.9 |
| [`rednote-local-business-note-maker`](skills/rednote-local-business-note-maker) | Turn a storefront photo, service image, merchant brief, or brand reference into a coordinated vertical 3:4 REDnote local-business note with a cover, store or service highlight, and a closing visual with room for visit details. | 0.1.9 |
| [`rednote-note-copywriter`](skills/rednote-note-copywriter) | Turn a product, experience, topic, or audience brief into Xiaohongshu title options, a readable note body, cover text, hashtags, and a natural comment starter. | 0.2.2 |
| [`rednote-ootd-lookbook-maker`](skills/rednote-ootd-lookbook-maker) | Turn outfit photos and styling ideas into a coordinated vertical 3:4 REDnote OOTD lookbook, with cover, full-look, detail, and lifestyle images plus a ready-to-post fashion story. | 0.2.0 |
| [`school-song-maker`](skills/school-song-maker) | Turn your school, class, motto, and memories into original lyrics and a sing-along class song, graduation song, or welcome song. | 0.1.4 |
| [`shopify-pdp-set`](skills/shopify-pdp-set) | Turn seller-supplied product facts into one Shopify product-page stills set for a single SKU. | 0.2.2 |
| [`short-drama-score-pack`](skills/short-drama-score-pack) | Build an original short-drama score pack of 8 to 15 instrumental beds for tension, romance, comedy, and tearjerker scenes. | 0.1.9 |
| [`short-drama-voice-pack`](skills/short-drama-voice-pack) | Turn a vertical short-drama episode script into a labeled short drama voiceover pack with one consistent voice per role. | 0.2.0 |
| [`short-form-voiceover-audio`](skills/short-form-voiceover-audio) | Turn a final short-video script into ready-to-edit voiceover audio, with a suitable voice, pronunciation control, current price estimate, and duration review. | 0.2.6 |
| [`short-video-bgm-studio`](skills/short-video-bgm-studio) | Describe the footage and get an original instrumental track written for it, yours to keep and use commercially. | 0.2.3 |
| [`slide-narration-studio`](skills/slide-narration-studio) | A spoken script and narration for every slide, in the teacher's own voice or a chosen narrator, as audio per slide or a narrated slide video. | 0.1.5 |
| [`stitch-prompt-card`](skills/stitch-prompt-card) | Turn a public TikTok stitch target into one quote reply card per chosen hook. | 0.2.2 |
| [`store-pa-broadcast-pack`](skills/store-pa-broadcast-pack) | Build dated store PA announcement reads for one campaign window: open, promo, flash, and close. | 0.2.0 |
| [`suno-lyrics-to-song`](skills/suno-lyrics-to-song) | Turn complete lyrics, rough drafts, loose lines, or a hook into a structured Suno song with custom lyrics, clear sections, style, mood, arrangement, and vocal direction. | 0.2.7 |
| [`talking-avatar-video`](skills/talking-avatar-video) | Turn one portrait and a short script or speech track into a directed talking-avatar video for explainers, announcements, lessons, and product messages. | 0.2.9 |
| [`talking-pet-video`](skills/talking-pet-video) | Turn one clear pet photo and a short message or voice clip into a shareable talking-pet clip. | 0.2.5 |
| [`taobao-main-video-maker`](skills/taobao-main-video-maker) | Turn product photos and selling points into a concise Taobao or Tmall product main-image video with a clear opening, product details, and a clean finish. | 0.2.3 |
| [`temu-main-image-motion`](skills/temu-main-image-motion) | Turn one Temu main image into one Temu main image video for the listing video slot. | 0.2.2 |
| [`tiktok-comment-reply-voice`](skills/tiktok-comment-reply-voice) | Turn public TikTok comments into one spoken reply clip per written line. | 0.2.1 |
| [`tiktok-creator-to-brief-stills`](skills/tiktok-creator-to-brief-stills) | Turn a TikTok creator homepage and recent posts into a collaboration brief still set. | 0.2.1 |
| [`tiktok-hashtag-to-hook-clip`](skills/tiktok-hashtag-to-hook-clip) | Turn a TikTok hashtag trend into one talking hook clip per still. | 0.2.2 |
| [`tiktok-shop-product-video-maker`](skills/tiktok-shop-product-video-maker) | Turn product facts, photos, and an English or Japanese audience brief into a TikTok Shop product-video script, shot plan, captions, and localized post copy. | 0.2.3 |
| [`unattended-live-avatar`](skills/unattended-live-avatar) | Turn one shop portrait and short welcome, product, FAQ, and close scripts into talking-avatar clips a store can loop overnight. | 0.2.0 |
| [`used-car-walkaround`](skills/used-car-walkaround) | Turn one used-car condition sheet into a listing hero still and a speakable walkaround script, then turn that still into one used car walkaround clip. | 0.2.1 |
| [`video-generation-studio`](skills/video-generation-studio) | Generate, animate, edit, and extend short AI videos for ads, product stories, social posts, b-roll, transitions, and cinematic concepts. | 0.2.3 |
| [`video-realism-retoucher`](skills/video-realism-retoucher) | Polish an existing AI video with a focused realism pass for more natural light, materials, color balance, and less distracting repeated detail. | 0.2.2 |
| [`viral-video-teardown-remake`](skills/viral-video-teardown-remake) | Paste the link or bring the file, break a short video that worked into its hook, beats, and call to action, then rebuild that structure around your own subject as a shot list, beat frames, and narration — delivered as one vertical clip animated from your opening frame, or, when the reference cuts too fast or runs too long for a single take, as segmented sources with captions and a timecoded edit list. | 0.3.9 |
| [`voice-clone-series-studio`](skills/voice-clone-series-studio) | Clone one voice you own and keep using it for a series of episodes, updates, and lessons. | 0.2.1 |
| [`voice-cloning-studio`](skills/voice-cloning-studio) | Create a reusable personal or brand voice from a clean audio sample, give it a memorable name, and hear it in a short test reading. | 0.2.8 |
| [`voiceover-narration-studio`](skills/voiceover-narration-studio) | Choose or reuse a voice, turn scripts into ready-to-edit narration, plan ordered long-form or multilingual audio, and create a reusable custom voice. | 0.2.6 |
| [`webinar-recap-talking`](skills/webinar-recap-talking) | Turn an authorized presenter still and a post-meeting external script into one webinar recap talking clip per still. | 0.2.2 |
| [`wechat-article-visual-pack`](skills/wechat-article-visual-pack) | Turn a WeChat Official Account article, outline, or brand imagery into a coordinated lead cover and supporting article-image set. | 0.2.1 |
| [`wechat-article-visual-story`](skills/wechat-article-visual-story) | Give a topic and get title candidates, the digest line, a full article body written for phone reading, a 2.35:1 cover, and in-body images that answer specific paragraphs. | 0.2.3 |
| [`wechat-channels-cover-maker`](skills/wechat-channels-cover-maker) | Turn a video topic, title, script, key frame, portrait, product photo, or reference image into a clear WeChat Channels cover with a focal visual and text-safe space. | 0.2.1 |
| [`wechat-channels-product-video`](skills/wechat-channels-product-video) | Turn a real product photo and confirmed product details into a clear vertical WeChat Channels product showcase video, title, and publishing copy. | 0.2.6 |
| [`wechat-channels-script-studio`](skills/wechat-channels-script-studio) | Turn a product and its confirmed facts into a WeChat Channels short-video script: a second-by-second segment table, the full spoken narration, the product-link conversion beats placed on named segments, and a six-dimension score on the draft. | 0.2.3 |
| [`wechat-cover-maker`](skills/wechat-cover-maker) | Turn an article title, topic, or reference image into a WeChat Official Account cover, article hero image, post cover, or supporting article visual with headline-safe space and focused refinement. | 0.2.9 |
| [`wechat-moments-poster-maker`](skills/wechat-moments-poster-maker) | Turn a campaign message, event, offer, product photo, or brand reference into a share-ready WeChat Moments poster with a clear visual hook and text-safe composition. | 0.1.9 |
| [`whiteboard-animation-maker`](skills/whiteboard-animation-maker) | Turn a concept, a script, or a benchmark video into a vertical black-and-white hand-drawn whiteboard film, with stroke-by-stroke Chinese and English words, cards and diagrams, and spoken narration. | 0.1.9 |
| [`xiaohongshu-hall-faq-stills`](skills/xiaohongshu-hall-faq-stills) | Turn Xiaohongshu hall FAQ complaints into a 4 to 8 still materials set. | 0.2.1 |
| [`xiaohongshu-note-research`](skills/xiaohongshu-note-research) | Give a category, a note link, or notes you already copied, and get title patterns, structure, and followable angles. | 0.2.0 |
| [`xiaohongshu-wealth-faq-talking`](skills/xiaohongshu-wealth-faq-talking) | Turn Xiaohongshu wealth FAQ notes into one talking FAQ clip per still. | 0.2.2 |
| [`youtube-caption-studio`](skills/youtube-caption-studio) | Give a YouTube link or a pasted transcript and get a Chinese spoken script with remake beats. | 0.2.1 |
| [`youtube-lesson-card-set`](skills/youtube-lesson-card-set) | Turn YouTube lesson captions into a 4 to 8 takeaway card set. | 0.2.2 |
| [`youtube-thumbnail-maker`](skills/youtube-thumbnail-maker) | Turn a YouTube topic, title, script, key frame, portrait, product photo, or channel reference into three thumbnail directions described in text, then render the one you pick as a 16:9 image with the headline area kept clear. Leave with a title that matches the image and a channel rule the next video can reuse. | 0.3.0 |
| [`zhongcao-beauty-note-maker`](skills/zhongcao-beauty-note-maker) | Turn beauty or skincare facts into a Xiaohongshu 3:4 note concept with review copy, usage scenes, titles, cover wording, and hashtags. | 0.2.0 |
| [`zhongcao-carousel-maker`](skills/zhongcao-carousel-maker) | Turn a post outline, product details, photo set, or style reference into an ordered 3:4 Xiaohongshu carousel with a hook cover and coherent supporting slides. | 0.2.1 |
| [`zhongcao-cover-maker`](skills/zhongcao-cover-maker) | Turn a photo or a topic idea into a scroll-stopping vertical 3:4 Xiaohongshu cover with clean backgrounds, bold focal composition, and text-safe areas for beauty, food, fashion, and lifestyle notes. | 0.2.5 |
| [`zhongcao-food-note-maker`](skills/zhongcao-food-note-maker) | Turn a dish photo, restaurant visit theme, or dining-atmosphere reference into a coordinated vertical 3:4 REDnote food note with a cover and supporting restaurant-story images. | 0.2.0 |
| [`zhongcao-local-business-note-maker`](skills/zhongcao-local-business-note-maker) | Turn a storefront photo, service image, merchant brief, or brand reference into a coordinated vertical 3:4 REDnote local-business note with a cover, store or service highlight, and a closing visual with room for visit details. | 0.2.0 |
| [`zhongcao-note-copywriter`](skills/zhongcao-note-copywriter) | Turn a product, experience, topic, or audience brief into Xiaohongshu title options, a readable note body, cover text, hashtags, and a natural comment starter. | 0.2.4 |
| [`zhongcao-ootd-lookbook-maker`](skills/zhongcao-ootd-lookbook-maker) | Turn outfit photos and styling ideas into a coordinated vertical 3:4 REDnote OOTD lookbook, with cover, full-look, detail, and lifestyle images plus a ready-to-post fashion story. | 0.2.2 |

## Updates and security

Since the 2026-10 release, these skills contain no self-updater: they run only the
files you installed and never replace them on their own. Update a skill with the tool
you installed it with — `npx skills update <skill>` or `gh skill update <skill>`.
Details: `references/updates-and-security.md` inside each skill.

## License

[MIT-0](LICENSE) — free to use, modify, and redistribute, including
commercially. No attribution required. Same terms as these skills carry on
ClawHub.

## Links

- Beatra — https://beatra.ai
- Skill catalog — https://beatra.ai/skills
- Docs — https://docs.beatra.ai
- Console — https://console.beatra.ai
- For AI agents — https://beatra.ai/llms.txt (index) · https://beatra.ai/llms-full.txt (every skill in one file)
- WeChat mini program (mainland China) · 国内用户微信扫码使用

<img src="assets/beatra-mini-program-qr.jpg" alt="Beatra WeChat mini program code" width="160">
