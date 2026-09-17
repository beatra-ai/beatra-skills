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

## Skills

| Skill | What it does | Version |
| --- | --- | --- |
| [`ai-audiobook-narration`](skills/ai-audiobook-narration) | Turn final manuscript or course text into ordered chapter audio with one narrator, a representative sample, clear pricing, and focused refinements. | 0.2.2 |
| [`ai-comic-drama-shot-maker`](skills/ai-comic-drama-shot-maker) | Turn an approved comic panel, character sheet, or story beat into one dynamic comic-drama shot — animate a manga frame, interpolate two comic panels, or combine loose references into a new motion-comic shot. | 0.1.7 |
| [`ai-headshot-studio`](skills/ai-headshot-studio) | Turn a casual selfie into a studio-quality professional headshot with new backgrounds, professional attire, and studio lighting for LinkedIn, resume, company website, and social media. | 0.1.4 |
| [`ai-image-generation-studio`](skills/ai-image-generation-studio) | Generate, compose, and edit product images, brand visuals, posters, social graphics, illustrations, and photo variations. | 0.1.4 |
| [`ai-image-realism`](skills/ai-image-realism) | Make existing AI portraits, product images, and marketing visuals look more natural by fixing plastic skin, malformed hands and faces, repeated textures, and inconsistent lighting. | 0.2.7 |
| [`ai-logo-maker`](skills/ai-logo-maker) | Turn a brand name, industry, or reference image into a professional AI logo, brand mark, or app icon with multi-concept exploration, precise brand colors, and scalable composition. | 0.1.7 |
| [`ai-multilingual-dubbing`](skills/ai-multilingual-dubbing) | Create reviewable multilingual voice-over audio from scripts for each language, with deliberate casting, pronunciation and timing pilots, and delivery organized by market and segment. | 0.1.9 |
| [`ai-music-video-clip-maker`](skills/ai-music-video-clip-maker) | Create a short visual clip guided by a song's mood and rhythm — turn a music excerpt and visual direction into a cinematic promo clip, animate cover art in time with the music, or build a mood visual from loose references. | 0.1.6 |
| [`ai-photo-cleanup-studio`](skills/ai-photo-cleanup-studio) | Point at what you want gone and get the photo back without it, with the space behind filled to match. | 0.1.3 |
| [`ai-photo-restyler`](skills/ai-photo-restyler) | Turn a photo into anime, manga, comic, cartoon, watercolor, clay, or 3D character art while the subject stays recognisable, and repeat the same look across a whole set. | 0.1.4 |
| [`ai-podcast-voiceover`](skills/ai-podcast-voiceover) | Turn an article, notes, or finished script into a listenable solo podcast episode with a consistent host voice, natural pacing, pronunciation control, and MP3 delivery. | 0.1.7 |
| [`ai-short-drama-shot-maker`](skills/ai-short-drama-shot-maker) | Generate one cinematic vertical micro-drama shot from a frozen beat and references — from text alone, an approved opening image, two endpoint images, or loose actor and location references. | 0.1.5 |
| [`ai-song-cover-studio`](skills/ai-song-cover-studio) | Upload a reference song and reimagine it as a new cover — change the genre, arrangement, and vocal direction into rock, acoustic, folk, jazz, or Chinese-style. | 0.1.2 |
| [`ai-storyboard-generator`](skills/ai-storyboard-generator) | Turn a script, scene, or ad brief into a practical shot list and one to four storyboard key-frame images. | 0.1.7 |
| [`ai-video-continuation`](skills/ai-video-continuation) | Continue one short clip before or after its action — add matching footage to the opening or ending for a natural continuation, longer hold, or stronger ending. | 0.1.8 |
| [`ai-video-image-music-studio`](skills/ai-video-image-music-studio) | Generate AI video, images, music, and voice-over in one creative flow, edit visual results, and keep every finished piece easy to find. | 0.2.0 |
| [`ai-video-restyler`](skills/ai-video-restyler) | Restyle one short video into a new visual treatment — turn live action into anime, illustration, Chinese comic, ink, clay, or cyberpunk while keeping the subject, action, and camera. | 0.1.4 |
| [`airbnb-welcome-avatar`](skills/airbnb-welcome-avatar) | Turn authorized stills and stay facts into one welcome talking clip per photo. | 0.1.4 |
| [`allergen-label-card`](skills/allergen-label-card) | Turn seller-supplied ingredients into one allergen explanation still per SKU. | 0.1.4 |
| [`amazon-a-plus-module-pack`](skills/amazon-a-plus-module-pack) | Turn seller-supplied selling points into one Amazon A+ module still per point. | 0.1.3 |
| [`amazon-main-image-motion`](skills/amazon-main-image-motion) | Turn one approved white-background main image into one short clip for the listing main video slot. | 0.1.4 |
| [`apartment-kitchen-tour`](skills/apartment-kitchen-tour) | Turn one kitchen photo the listing already uses into one short clip for the listing page. | 0.1.3 |
| [`art-demo-set`](skills/art-demo-set) | Turn user-supplied drawing steps into one still per art demo page. | 0.1.3 |
| [`assembly-one-step-clip`](skills/assembly-one-step-clip) | Turn authorized stills and seller-supplied step facts into one assembly step video per still. | 0.1.3 |
| [`audio-drama-voice-studio`](skills/audio-drama-voice-studio) | Give every character in your script its own voice and get the whole scene recorded line by line, in script order. | 0.1.8 |
| [`bank-desk-board-set`](skills/bank-desk-board-set) | Turn user-supplied branch window names and board lines into a four-to-eight still bank desk board set. | 0.1.3 |
| [`beatra`](skills/beatra) | Create AI images, videos, music, and voice, look up public social data, edit supported visual results, and keep returned files and credit use easy to track through one shared connection. | 2.8.8 |
| [`beatra-ai-image-studio`](skills/beatra-ai-image-studio) | Generate, compose, and edit product images, brand visuals, posters, social graphics, illustrations, and photo variations. | 1.1.4 |
| [`beatra-ai-music-creator`](skills/beatra-ai-music-creator) | Turn a theme, lyric, scene, or reference audio into reviewable songs, instrumentals, BGM, and soundtracks with a clear creative direction and focused revisions. | 1.3.6 |
| [`beatra-ai-video-studio`](skills/beatra-ai-video-studio) | Generate, animate, edit, and extend short AI videos for ads, product stories, social posts, b-roll, transitions, and cinematic concepts. | 1.2.6 |
| [`beatra-ai-voice-studio`](skills/beatra-ai-voice-studio) | Choose or reuse a voice, turn scripts into ready-to-edit narration, plan ordered long-form or multilingual audio, and create a reusable custom voice. | 0.2.7 |
| [`bilibili-publishing-pack`](skills/bilibili-publishing-pack) | Turn a Bilibili video topic, outline, or script into title options, a clear description, tags, a pinned comment, chapters when you supply timestamps, and a thumbnail brief. | 0.1.6 |
| [`bilibili-thumbnail-maker`](skills/bilibili-thumbnail-maker) | Turn a Bilibili video topic, title, script, clip frame, portrait, product photo, or draft into a clear Bilibili video thumbnail with a strong visual hook and headline-safe space. | 0.1.4 |
| [`bilibili-video-storyboard`](skills/bilibili-video-storyboard) | Turn a Bilibili topic, title, outline, or script into a chapter-led shot list and one to four key storyboard frames for an explainer, review, tutorial, vlog, gameplay, or creative video. | 0.1.5 |
| [`blackboard-one-shot`](skills/blackboard-one-shot) | Turn authorized blackboard photos and teacher-supplied facts into one blackboard one-shot clip per photo. | 0.1.3 |
| [`brand-jingle-studio`](skills/brand-jingle-studio) | Turn a brand name, slogan, and campaign use into a set of original brand jingles, ad songs, and audio-logo stings. | 0.1.2 |
| [`broker-account-voice`](skills/broker-account-voice) | Turn written account-opening steps into one account opening voice clip per labeled cue. | 0.1.3 |
| [`census-notice-voice`](skills/census-notice-voice) | Turn a written census schedule into one census notice voice clip per labeled cue. | 0.1.3 |
| [`civil-affairs-voice`](skills/civil-affairs-voice) | Turn a written civil-affairs materials list into one civil affairs voice clip per labeled cue. | 0.1.3 |
| [`class-duty-voice`](skills/class-duty-voice) | Turn a written class duty roster into one class duty voice clip per labeled cue. | 0.1.3 |
| [`club-notice-talking`](skills/club-notice-talking) | Turn a user-supplied club-activity script and authorized stills into one club activity talking clip per still. | 0.1.4 |
| [`comment-pin-card`](skills/comment-pin-card) | Turn a finished video's comments into one pin comment still per original quote. | 0.1.4 |
| [`comment-voc-miner`](skills/comment-voc-miner) | Give a post link, a category, or comments you already copied, and get objections, verbatim lines, FAQ answers, and spoken hooks written in the audience's own words. | 0.1.5 |
| [`community-site-clip`](skills/community-site-clip) | Turn authorized community event site photos and office-supplied facts into one community site clip per photo. | 0.1.3 |
| [`corporate-podcast-studio`](skills/corporate-podcast-studio) | Turn executive talking points or company column copy into a serialized corporate podcast with one consistent host voice. | 0.1.3 |
| [`course-narration-studio`](skills/course-narration-studio) | Turn lecture manuscripts and course slides into a lecture-by-lecture narration pack with one consistent teacher voice. | 0.1.4 |
| [`course-video-studio`](skills/course-video-studio) | Turn lecture scripts and one authorized teacher portrait into talking-head lesson videos. | 0.1.4 |
| [`cover-performance-preflight`](skills/cover-performance-preflight) | Review an existing thumbnail or cover, optionally against what already ranks for the same topic, receive a practical improvement plan, and create two or three visual candidates ready to compare. | 0.1.4 |
| [`coworking-day-pack`](skills/coworking-day-pack) | Turn a coworking or daytime office brief into one office background music playlist of 8 to 15 low-stimulation instrumentals. | 0.1.3 |
| [`creator-account-teardown`](skills/creator-account-teardown) | Read a creator account from a handle, or from the screenshots, bio, captions, and visible post metrics you have, diagnose its positioning, audience, content matrix, hook pattern, and cadence, then turn all of it into your own positioning, pillars, hook formula, opening plan, and a first post produced with its cover rendered and its script voiced. | 0.1.5 |
| [`creator-drop-talking`](skills/creator-drop-talking) | Turn a confirmed new-drop script and authorized stills into one drop talking clip per still. | 0.1.4 |
| [`credit-rights-voice`](skills/credit-rights-voice) | Turn a written credit-card benefits table into one credit-rights voice clip per labeled cue. | 0.1.3 |
| [`cs-macro-card-set`](skills/cs-macro-card-set) | Turn user-supplied customer-service macro titles and talk tracks into a four-to-eight still CS macro card set. | 0.1.3 |
| [`cs-onboard-voice`](skills/cs-onboard-voice) | Turn a written customer-onboarding step list into one customer onboard voice clip per labeled cue. | 0.1.3 |
| [`demo-booking-confirm`](skills/demo-booking-confirm) | Turn confirmed booking facts into one booking confirmation voice clip per labeled notice. | 0.1.4 |
| [`douyin-comment-to-demo-clip`](skills/douyin-comment-to-demo-clip) | Turn Douyin comment objections into one comment talking clip per still. | 0.1.3 |
| [`douyin-cover-maker`](skills/douyin-cover-maker) | Turn a short-video topic, hook, portrait, product photo, or reference image into a clear vertical Douyin cover with a bold focal visual and a headline-safe composition. | 0.1.4 |
| [`douyin-data-brief`](skills/douyin-data-brief) | Give a Douyin link, a keyword, or counts you already copied, and get an attributed one-page brief. | 0.1.2 |
| [`douyin-hot-to-hook-clip`](skills/douyin-hot-to-hook-clip) | Turn a Douyin hot search topic into one talking hook clip per still. | 0.1.3 |
| [`douyin-live-commerce-visual-kit`](skills/douyin-live-commerce-visual-kit) | Turn a live-selling theme, product details, product photos, and brand references into a coordinated Douyin live-commerce visual kit with a pre-live promo cover, product selling-point card, and live-room background or overlay visual. | 0.1.2 |
| [`douyin-ugc-ad-creator`](skills/douyin-ugc-ad-creator) | Turn a product photo, selling point, and creator direction into a short vertical Douyin UGC ad with an AI presenter, natural spoken pitch, and a clear product moment. | 0.1.9 |
| [`douyin-video-comments-to-faq`](skills/douyin-video-comments-to-faq) | Turn Douyin video comments into one comment FAQ still per picked question. | 0.1.3 |
| [`douyin-video-script-maker`](skills/douyin-video-script-maker) | Turn a video topic, product, service, or creator idea into three hooks and a ready-to-film Douyin script with spoken lines, shot beats, caption cues, a title, hashtags, and a comment prompt. | 0.1.9 |
| [`duty-board-set`](skills/duty-board-set) | Turn user-supplied classroom duty roster slots and duty lines into a four-to-eight still duty board set. | 0.1.3 |
| [`earnings-script-read`](skills/earnings-script-read) | Turn an official earnings script into one spoken earnings script read per labeled section. | 0.1.4 |
| [`ecommerce-detail-module-studio`](skills/ecommerce-detail-module-studio) | Create three to six coordinated ecommerce detail modules with a product story and layout guide. | 0.1.4 |
| [`ecommerce-listing-image-set`](skills/ecommerce-listing-image-set) | Turn verified SKU facts and product photos into a cohesive ecommerce image set with a hero image, feature visuals, lifestyle scenes, size views, and in-box images. | 0.2.0 |
| [`elder-checkup-voice`](skills/elder-checkup-voice) | Turn a written elder-checkup schedule into one elder checkup voice clip per labeled cue. | 0.1.3 |
| [`exam-mnemonic-song`](skills/exam-mnemonic-song) | Turn one exam knowledge point into a mnemonic song you can replay, then turn the rest of the syllabus into a set. | 0.1.3 |
| [`field-check-set`](skills/field-check-set) | Turn user-supplied on-site inspection check item names and check points into a four-to-eight still field check set. | 0.1.3 |
| [`first-last-frame-video`](skills/first-last-frame-video) | Turn two approved images into one directed clip — generate a smooth transition from a first frame to a last frame for transformations, reveals, and scene changes. | 0.1.6 |
| [`founder-ip-avatar-studio`](skills/founder-ip-avatar-studio) | Turn one authorized founder or expert portrait and a weekly script into a talking-head IP video in that person's likeness and voice. | 0.1.3 |
| [`fund-dividend-talking`](skills/fund-dividend-talking) | Turn a user-supplied fund dividend announcement and authorized stills into one fund dividend talking clip per still. | 0.1.3 |
| [`fund-page-set`](skills/fund-page-set) | Turn user-supplied fund factsheet points into one still per page. | 0.1.3 |
| [`fund-report-talking`](skills/fund-report-talking) | Turn a user-supplied fund quarterly report highlight sheet and authorized stills into one fund quarterly report talking clip per still. | 0.1.3 |
| [`game-script-voice-pack`](skills/game-script-voice-pack) | Turn a murder-mystery or indie-game script into a labeled multi-character voice pack. | 0.1.3 |
| [`game-ui-voice-pack`](skills/game-ui-voice-pack) | Turn written game UI lines into one game voiceover clip per labeled cue. | 0.1.3 |
| [`geo-place-talking`](skills/geo-place-talking) | Turn a user-supplied geography place table and authorized stills into one geography place talking clip per still. | 0.1.3 |
| [`grid-notice-voice`](skills/grid-notice-voice) | Turn a written grid-matter list into one grid notice voice clip per labeled cue. | 0.1.3 |
| [`hall-guide-voice`](skills/hall-guide-voice) | Turn a written hall window list into one hall guide voice clip per labeled cue. | 0.1.3 |
| [`hanzi-card-set`](skills/hanzi-card-set) | Turn user-supplied character lists into a four-to-eight still hanzi card set. | 0.1.3 |
| [`hiring-avatar-studio`](skills/hiring-avatar-studio) | Turn one HR or founder portrait and a job brief into one talking-avatar hiring video per open role. | 0.1.3 |
| [`holiday-homework-voice`](skills/holiday-homework-voice) | Turn a written holiday homework list into one holiday homework voice clip per labeled cue. | 0.1.3 |
| [`homeroom-week-voice`](skills/homeroom-week-voice) | Turn a written homeroom week plan into one homeroom week voice clip per labeled cue. | 0.1.3 |
| [`hot-topic-content-maker`](skills/hot-topic-content-maker) | Bring a trending topic or seasonal peg, or have it read the trending boards for you, and get the angles, the cover, the caption, the hashtags, and a short narrated clip — ready to publish while the topic is still moving. | 0.2.2 |
| [`hotel-amenity-clip`](skills/hotel-amenity-clip) | Turn hotel amenity stills the property already took into one hotel amenity video per labeled still. | 0.1.3 |
| [`housing-subsidy-talking`](skills/housing-subsidy-talking) | Turn user-supplied public subsidy conditions and authorized stills into one housing subsidy talking clip per still. | 0.1.4 |
| [`image-to-motion`](skills/image-to-motion) | Animate one product image, portrait, photo, illustration, or AI artwork into a directed short video with purposeful motion and camera movement. | 0.1.8 |
| [`incident-brief-voice`](skills/incident-brief-voice) | Turn a written incident briefing script into one incident brief voice clip per labeled cue. | 0.1.3 |
| [`indie-game-ost-pack`](skills/indie-game-ost-pack) | Build an original indie game OST pack of 8 to 15 instrumental tracks for title, explore, battle, shop, and victory. | 0.1.2 |
| [`indiegogo-gallery-set`](skills/indiegogo-gallery-set) | Turn a written campaign and reward-tier plan into one gallery still per named slot. | 0.1.3 |
| [`influencer-fit-analyzer`](skills/influencer-fit-analyzer) | Give a category, budget, and market, or handles you already have, and get an 8-12 person memo. | 0.1.4 |
| [`instagram-highlight-cover`](skills/instagram-highlight-cover) | Instagram highlight covers are one still per named highlight after reading the account Reels and posts. | 0.1.4 |
| [`instagram-reel-to-pdp-clip`](skills/instagram-reel-to-pdp-clip) | Instagram product video is one product detail video per product still after reading a competitor Reel. | 0.1.3 |
| [`insurance-clause-talking`](skills/insurance-clause-talking) | Turn user-supplied insurance policy clauses and authorized stills into one insurance clause talking clip per still. | 0.1.4 |
| [`insurance-renew-talking`](skills/insurance-renew-talking) | Turn user-supplied policy renewal dates and authorized stills into one insurance renewal reminder talking clip per still. | 0.1.3 |
| [`intern-onboarding-avatar`](skills/intern-onboarding-avatar) | Turn authorized stills and already-written intern onboarding notes into one intern onboarding talk per still. | 0.1.3 |
| [`inventory-clearance-card`](skills/inventory-clearance-card) | Turn already-written clearance rules into one clearance explanation card per SKU. | 0.1.4 |
| [`ip-character-consistency-studio`](skills/ip-character-consistency-studio) | Build a reusable character visual pack from one to four ordered references or an original brief, then create character sheets, poses, expressions, and story scenes. | 0.1.4 |
| [`ivr-voice-pack`](skills/ivr-voice-pack) | Build a labeled IVR voice pack for a phone tree: welcome, menu, hold, transfer, after-hours, and error prompts in one consistent brand voice. | 0.1.3 |
| [`job-fair-booth-clip`](skills/job-fair-booth-clip) | Turn authorized stills and already-written job-fair role notes into one booth talking clip per still. | 0.1.3 |
| [`kyc-guide-set`](skills/kyc-guide-set) | Turn user-supplied account-opening material checklist lines into a four-to-eight still KYC guide set. | 0.1.3 |
| [`lab-cover-set`](skills/lab-cover-set) | Turn user-supplied assignment names and points into a four-to-eight still lab cover set. | 0.1.3 |
| [`legal-explainer-clip`](skills/legal-explainer-clip) | Turn one public-education legal topic into a labeled digital-human still, a speakable explainer script, and one talking clip. | 0.1.3 |
| [`listing-room-video-pack`](skills/listing-room-video-pack) | Turn listing photos into a labeled set of listing room video clips, one room at a time. | 0.1.3 |
| [`live-commerce-script-studio`](skills/live-commerce-script-studio) | Turn a product lineup into a minute-by-minute live selling schedule, a seven-step talk track per product, a library of ready-to-read lines, and the cards and spoken takes the room works from. | 0.1.4 |
| [`livestream-bgm-pack`](skills/livestream-bgm-pack) | Build an original livestream BGM playlist of 10 to 20 instrumental tracks for a room, store, or live-commerce shift. | 0.1.2 |
| [`market-calendar-talking`](skills/market-calendar-talking) | Turn a user-supplied public trading calendar and authorized stills into one trading calendar talking clip per still. | 0.1.4 |
| [`market-inspect-talking`](skills/market-inspect-talking) | Turn user-supplied merchant inspection notices and authorized stills into one market inspection talking clip per still. | 0.1.3 |
| [`marketplace-main-image-preflight`](skills/marketplace-main-image-preflight) | Review an existing marketplace main image, create a clear preflight card, and make one focused cleanup edit. | 0.1.3 |
| [`minimax-h3-ai-video`](skills/minimax-h3-ai-video) | Turn ideas, images, opening and closing frames, or multimodal references into polished 2K AI videos for ads, ecommerce, brands, dynamic posters, games, film titles, and social content. | 0.1.6 |
| [`music-generation-studio`](skills/music-generation-studio) | Turn a theme, lyric, scene, or reference audio into reviewable songs, instrumentals, BGM, and soundtracks with a clear creative direction and focused revisions. | 0.1.8 |
| [`music-lyric-set`](skills/music-lyric-set) | Turn user-supplied song lyrics into a four-to-eight still music lyric card set. | 0.1.3 |
| [`new-manager-voice`](skills/new-manager-voice) | Turn a written first-week checklist into one new manager week voice clip per labeled cue. | 0.1.3 |
| [`novel-promo-video-maker`](skills/novel-promo-video-maker) | Turn a novel chapter or story script into narrated vertical short video scenes with illustrated shots that keep every character looking the same from beat to beat. | 0.1.6 |
| [`nutrition-panel-art`](skills/nutrition-panel-art) | Turn seller-supplied nutrition facts into one nutrition panel still per SKU. | 0.1.4 |
| [`office-floor-tour`](skills/office-floor-tour) | Turn seller-supplied office floor stills into one office floor tour clip per labeled still. | 0.1.3 |
| [`oral-seeding-video-maker`](skills/oral-seeding-video-maker) | Start from a topic and get a narrated vertical recommendation video — script, ready-to-edit still frames, voice, and a clip animated from the opening frame, with nothing to upload. | 0.1.9 |
| [`origin-story-module`](skills/origin-story-module) | Turn seller-supplied origin facts into one origin story module still per SKU. | 0.1.4 |
| [`personalized-song-maker`](skills/personalized-song-maker) | Turn a person's story and occasion into original lyrics and a newly generated song. | 0.1.2 |
| [`photo-singing-video`](skills/photo-singing-video) | Animate one clear portrait with a short singing audio excerpt to create an expressive singing-photo clip. | 0.1.5 |
| [`policy-digest-set`](skills/policy-digest-set) | Turn user-supplied public policy digest points into one policy digest still per page. | 0.1.3 |
| [`poster-design-studio`](skills/poster-design-studio) | Turn a topic description, a product photo, or brand references into a scroll-stopping event poster, promotional banner, or social media graphic with strong visual hierarchy, category-matched styling, and text-safe zones. | 0.1.3 |
| [`procurement-rfp-cover`](skills/procurement-rfp-cover) | Turn seller-supplied tender facts into one RFP cover still per project. | 0.1.4 |
| [`product-launch-opening-film`](skills/product-launch-opening-film) | Turn a named product launch into three visual-tone stills, then one opening film clip for the stage screen. | 0.1.3 |
| [`product-on-model-locale-studio`](skills/product-on-model-locale-studio) | Turn apparel and wearable product photos into localized on-model ecommerce images, with one fashion-model visual for each market. | 0.1.4 |
| [`product-photo-studio`](skills/product-photo-studio) | Transform a real product photo into a studio-quality ecommerce image, lifestyle scene, or marketplace-ready hero shot with clean backgrounds, professional lighting, and composition guided by confirmed product details. | 0.2.0 |
| [`product-video-studio`](skills/product-video-studio) | Turn one product photo into a vertical product video with spoken narration, ready to post. | 0.1.6 |
| [`project-handover-sign-set`](skills/project-handover-sign-set) | Turn contractor-supplied project names, unit names, and handover dates into three handover sign stills, then turn the rest of that project into a matching set. | 0.1.3 |
| [`publish-preflight-studio`](skills/publish-preflight-studio) | Paste the copy and get a compliance read with a replacement for every flagged phrase, an audience read that names the line losing each reader, a hook and share score, the corrected copy, and a cover rendered from the fixed wording. | 0.1.4 |
| [`radio-drama-ad-break`](skills/radio-drama-ad-break) | Turn written radio-drama ad-break lines into one spoken bumper clip per labeled slot. | 0.1.4 |
| [`real-estate-listing-set`](skills/real-estate-listing-set) | Turn seller-supplied floor-plan facts into one listing still per room. | 0.1.3 |
| [`rednote-beauty-note-maker`](skills/rednote-beauty-note-maker) | Turn beauty or skincare facts into a Xiaohongshu 3:4 note concept with review copy, usage scenes, titles, cover wording, and hashtags. | 0.1.2 |
| [`rednote-carousel-maker`](skills/rednote-carousel-maker) | Turn a post outline, product details, photo set, or style reference into an ordered 3:4 Xiaohongshu carousel with a hook cover and coherent supporting slides. | 0.1.3 |
| [`rednote-cover-maker`](skills/rednote-cover-maker) | Turn a photo or a topic idea into a scroll-stopping vertical 3:4 Xiaohongshu cover with clean backgrounds, bold focal composition, and text-safe areas for beauty, food, fashion, and lifestyle notes. | 0.1.3 |
| [`rednote-food-note-maker`](skills/rednote-food-note-maker) | Turn a dish photo, restaurant visit theme, or dining-atmosphere reference into a coordinated vertical 3:4 REDnote food note with a cover and supporting restaurant-story images. | 0.1.2 |
| [`rednote-local-business-note-maker`](skills/rednote-local-business-note-maker) | Turn a storefront photo, service image, merchant brief, or brand reference into a coordinated vertical 3:4 REDnote local-business note with a cover, store or service highlight, and a closing visual with room for visit details. | 0.1.2 |
| [`rednote-note-copywriter`](skills/rednote-note-copywriter) | Turn a product, experience, topic, or audience brief into Xiaohongshu title options, a readable note body, cover text, hashtags, and a natural comment starter. | 0.1.5 |
| [`rednote-ootd-lookbook-maker`](skills/rednote-ootd-lookbook-maker) | Turn outfit photos and styling ideas into a coordinated vertical 3:4 REDnote OOTD lookbook, with cover, full-look, detail, and lifestyle images plus a ready-to-post fashion story. | 0.1.3 |
| [`rental-walkin-avatar`](skills/rental-walkin-avatar) | Turn seller-supplied floor-plan facts and an already-written walk-in script into one talking clip per still. | 0.1.3 |
| [`resident-event-set`](skills/resident-event-set) | Turn user-supplied resident event names and points into a four-to-eight still resident event set. | 0.1.3 |
| [`restock-drop-talking`](skills/restock-drop-talking) | Turn seller-supplied restock facts and an already-written restock script into one talking clip per still. | 0.1.3 |
| [`retail-new-year-pack`](skills/retail-new-year-pack) | Turn seller-supplied new-year store mood notes into one retail playlist of 8 to 15 instrumentals. | 0.1.3 |
| [`risk-grade-set`](skills/risk-grade-set) | Turn user-supplied risk-grade definitions into a four-to-eight still risk grade set. | 0.1.3 |
| [`sales-voicemail-pack`](skills/sales-voicemail-pack) | Turn seller-supplied sales voicemail scripts into one spoken voicemail clip per labeled slot. | 0.1.3 |
| [`security-aware-talking`](skills/security-aware-talking) | Turn user-supplied security-awareness talking points and authorized stills into one all-hands talking clip per still. | 0.1.4 |
| [`shift-handoff-voice`](skills/shift-handoff-voice) | Turn a written shift handoff checklist into one shift handoff voice clip per labeled cue. | 0.1.3 |
| [`shopify-pdp-set`](skills/shopify-pdp-set) | Turn seller-supplied product facts into one Shopify product-page stills set for a single SKU. | 0.1.4 |
| [`short-drama-score-pack`](skills/short-drama-score-pack) | Build an original short-drama score pack of 8 to 15 instrumental beds for tension, romance, comedy, and tearjerker scenes. | 0.1.2 |
| [`short-drama-voice-pack`](skills/short-drama-voice-pack) | Turn a vertical short-drama episode script into a labeled short drama voiceover pack with one consistent voice per role. | 0.1.3 |
| [`short-form-voiceover-audio`](skills/short-form-voiceover-audio) | Turn a final short-video script into ready-to-edit voiceover audio, with a suitable voice, pronunciation control, current price estimate, and duration review. | 0.1.9 |
| [`short-video-bgm-studio`](skills/short-video-bgm-studio) | Describe the footage and get an original instrumental track written for it, yours to keep and use commercially. | 0.1.6 |
| [`sku-comparison-chart`](skills/sku-comparison-chart) | Turn seller-supplied SKU specs into one SKU comparison chart set. | 0.1.3 |
| [`sleep-story-voice`](skills/sleep-story-voice) | Turn already-written short sleep stories into one spoken clip per labeled story. | 0.1.3 |
| [`stitch-prompt-card`](skills/stitch-prompt-card) | Turn a public TikTok stitch target into one quote reply card per chosen hook. | 0.1.3 |
| [`store-new-item-launch`](skills/store-new-item-launch) | Turn three named new-item stills into a launch board you can post, then turn the rest of the set into a matching pack. | 0.1.3 |
| [`store-pa-broadcast-pack`](skills/store-pa-broadcast-pack) | Build dated store PA announcement reads for one campaign window: open, promo, flash, and close. | 0.1.3 |
| [`suno-lyrics-to-song`](skills/suno-lyrics-to-song) | Turn complete lyrics, rough drafts, loose lines, or a hook into a structured Suno song with custom lyrics, clear sections, style, mood, arrangement, and vocal direction. | 0.2.0 |
| [`talking-avatar-video`](skills/talking-avatar-video) | Turn one portrait and a short script or speech track into a directed talking-avatar video for explainers, announcements, lessons, and product messages. | 0.2.1 |
| [`talking-pet-video`](skills/talking-pet-video) | Turn one clear pet photo and a short message or voice clip into a shareable talking-pet clip. | 0.1.7 |
| [`taobao-main-video-maker`](skills/taobao-main-video-maker) | Turn product photos and selling points into a concise Taobao or Tmall product main-image video with a clear opening, product details, and a clean finish. | 0.1.6 |
| [`tax-policy-brief-clip`](skills/tax-policy-brief-clip) | Turn a dated tax-policy source into a policy-points still and a speakable brief, then into one short tax policy brief clip. | 0.1.3 |
| [`temu-main-image-motion`](skills/temu-main-image-motion) | Turn one Temu main image into one Temu main image video for the listing video slot. | 0.1.3 |
| [`tiktok-comment-reply-voice`](skills/tiktok-comment-reply-voice) | Turn public TikTok comments into one spoken reply clip per written line. | 0.1.3 |
| [`tiktok-creator-to-brief-stills`](skills/tiktok-creator-to-brief-stills) | Turn a TikTok creator homepage and recent posts into a collaboration brief still set. | 0.1.3 |
| [`tiktok-hashtag-to-hook-clip`](skills/tiktok-hashtag-to-hook-clip) | Turn a TikTok hashtag trend into one talking hook clip per still. | 0.1.4 |
| [`tiktok-shop-product-video-maker`](skills/tiktok-shop-product-video-maker) | Turn product facts, photos, and an English or Japanese audience brief into a TikTok Shop product-video script, shot plan, captions, and localized post copy. | 0.1.6 |
| [`tool-demo-clip`](skills/tool-demo-clip) | Turn authorized tool demo photos and trainer-supplied facts into one tool demo clip per photo. | 0.1.4 |
| [`unattended-live-avatar`](skills/unattended-live-avatar) | Turn one shop portrait and short welcome, product, FAQ, and close scripts into talking-avatar clips a store can loop overnight. | 0.1.3 |
| [`unit-map-set`](skills/unit-map-set) | Turn user-supplied unit outline points into one still per unit mind map page. | 0.1.3 |
| [`used-car-walkaround`](skills/used-car-walkaround) | Turn one used-car condition sheet into a listing hero still and a speakable walkaround script, then turn that still into one used car walkaround clip. | 0.1.3 |
| [`video-generation-studio`](skills/video-generation-studio) | Generate, animate, edit, and extend short AI videos for ads, product stories, social posts, b-roll, transitions, and cinematic concepts. | 0.1.6 |
| [`video-realism-retoucher`](skills/video-realism-retoucher) | Polish an existing AI video with a focused realism pass for more natural light, materials, color balance, and less distracting repeated detail. | 0.1.5 |
| [`viral-video-teardown-remake`](skills/viral-video-teardown-remake) | Paste the link or bring the file, break a short video that worked into its hook, beats, and call to action, then rebuild that structure around your own subject as a shot list, beat frames, and narration — delivered as one vertical clip animated from your opening frame, or, when the reference cuts too fast or runs too long for a single take, as segmented sources with captions and a timecoded edit list. | 0.3.1 |
| [`visitor-desk-voice`](skills/visitor-desk-voice) | Turn a written visitor reception script into one visitor reception voice clip per labeled cue. | 0.1.3 |
| [`voice-clone-series-studio`](skills/voice-clone-series-studio) | Clone one voice you own and keep using it for a series of episodes, updates, and lessons. | 0.1.4 |
| [`voice-cloning-studio`](skills/voice-cloning-studio) | Create a reusable personal or brand voice from a clean audio sample, give it a memorable name, and hear it in a short test reading. | 0.2.1 |
| [`voiceover-narration-studio`](skills/voiceover-narration-studio) | Choose or reuse a voice, turn scripts into ready-to-edit narration, plan ordered long-form or multilingual audio, and create a reusable custom voice. | 0.1.9 |
| [`wealth-cover-set`](skills/wealth-cover-set) | Turn user-supplied session names and themes into a four-to-eight still wealth cover set. | 0.1.3 |
| [`wealth-open-cal-set`](skills/wealth-open-cal-set) | Turn user-supplied open windows into a four-to-eight still wealth open calendar. | 0.1.3 |
| [`wealth-product-talking`](skills/wealth-product-talking) | Turn a user-supplied product factsheet and authorized stills into one wealth product talking clip per still. | 0.1.4 |
| [`webinar-recap-talking`](skills/webinar-recap-talking) | Turn an authorized presenter still and a post-meeting external script into one webinar recap talking clip per still. | 0.1.4 |
| [`webnovel-serial-audio`](skills/webnovel-serial-audio) | Turn a serialized web novel into chapter-by-chapter webnovel audiobook audio with one consistent narrator. | 0.1.3 |
| [`wechat-article-visual-pack`](skills/wechat-article-visual-pack) | Turn a WeChat Official Account article, outline, or brand imagery into a coordinated lead cover and supporting article-image set. | 0.1.4 |
| [`wechat-article-visual-story`](skills/wechat-article-visual-story) | Give a topic and get title candidates, the digest line, a full article body written for phone reading, a 2.35:1 cover, and in-body images that answer specific paragraphs. | 0.1.6 |
| [`wechat-channels-cover-maker`](skills/wechat-channels-cover-maker) | Turn a video topic, title, script, key frame, portrait, product photo, or reference image into a clear WeChat Channels cover with a focal visual and text-safe space. | 0.1.4 |
| [`wechat-channels-product-video`](skills/wechat-channels-product-video) | Turn a real product photo and confirmed product details into a clear vertical WeChat Channels product showcase video, title, and publishing copy. | 0.1.9 |
| [`wechat-channels-script-studio`](skills/wechat-channels-script-studio) | Turn a product and its confirmed facts into a WeChat Channels short-video script: a second-by-second segment table, the full spoken narration, the product-link conversion beats placed on named segments, and a six-dimension score on the draft. | 0.1.5 |
| [`wechat-cover-maker`](skills/wechat-cover-maker) | Turn an article title, topic, or reference image into a WeChat Official Account cover, article hero image, post cover, or supporting article visual with headline-safe space and focused refinement. | 0.2.2 |
| [`wechat-moments-poster-maker`](skills/wechat-moments-poster-maker) | Turn a campaign message, event, offer, product photo, or brand reference into a share-ready WeChat Moments poster with a clear visual hook and text-safe composition. | 0.1.2 |
| [`wedding-opening-film`](skills/wedding-opening-film) | Turn couple-supplied ceremony facts into three wedding opening film storyboard keyframes, then one opening film. | 0.1.3 |
| [`wrong-item-talking`](skills/wrong-item-talking) | Turn a user-supplied wrong-item script and authorized stills into one wrong item talking clip per still. | 0.1.4 |
| [`xiaohongshu-hall-faq-stills`](skills/xiaohongshu-hall-faq-stills) | Turn Xiaohongshu hall FAQ complaints into a 4 to 8 still materials set. | 0.1.3 |
| [`xiaohongshu-note-research`](skills/xiaohongshu-note-research) | Give a category, a note link, or notes you already copied, and get title patterns, structure, and followable angles. | 0.1.3 |
| [`xiaohongshu-parent-faq-stills`](skills/xiaohongshu-parent-faq-stills) | Turn Xiaohongshu parent FAQ notes into a 4 to 8 still answer set. | 0.1.2 |
| [`xiaohongshu-policy-talking`](skills/xiaohongshu-policy-talking) | Turn Xiaohongshu policy-question notes into one talking policy clip per still. | 0.1.3 |
| [`xiaohongshu-wealth-faq-talking`](skills/xiaohongshu-wealth-faq-talking) | Turn Xiaohongshu wealth FAQ notes into one talking FAQ clip per still. | 0.1.4 |
| [`youtube-caption-studio`](skills/youtube-caption-studio) | Give a YouTube link or a pasted transcript and get a Chinese spoken script with remake beats. | 0.1.4 |
| [`youtube-insure-caption-talking`](skills/youtube-insure-caption-talking) | Turn YouTube insurance captions into one talking insurance clip per still. | 0.1.3 |
| [`youtube-lesson-card-set`](skills/youtube-lesson-card-set) | Turn YouTube lesson captions into a 4 to 8 takeaway card set. | 0.1.4 |
| [`youtube-thumbnail-maker`](skills/youtube-thumbnail-maker) | Turn a YouTube topic, title, script, key frame, portrait, product photo, or channel reference into three thumbnail directions described in text, then render the one you pick as a 16:9 image with the headline area kept clear. Leave with a title that matches the image and a channel rule the next video can reuse. | 0.2.3 |
| [`youtube-train-caption-cards`](skills/youtube-train-caption-cards) | Turn YouTube training captions into a 4 to 8 still handout set. | 0.1.4 |
| [`zhongcao-beauty-note-maker`](skills/zhongcao-beauty-note-maker) | Turn beauty or skincare facts into a Xiaohongshu 3:4 note concept with review copy, usage scenes, titles, cover wording, and hashtags. | 0.1.3 |
| [`zhongcao-carousel-maker`](skills/zhongcao-carousel-maker) | Turn a post outline, product details, photo set, or style reference into an ordered 3:4 Xiaohongshu carousel with a hook cover and coherent supporting slides. | 0.1.4 |
| [`zhongcao-cover-maker`](skills/zhongcao-cover-maker) | Turn a photo or a topic idea into a scroll-stopping vertical 3:4 Xiaohongshu cover with clean backgrounds, bold focal composition, and text-safe areas for beauty, food, fashion, and lifestyle notes. | 0.1.8 |
| [`zhongcao-food-note-maker`](skills/zhongcao-food-note-maker) | Turn a dish photo, restaurant visit theme, or dining-atmosphere reference into a coordinated vertical 3:4 REDnote food note with a cover and supporting restaurant-story images. | 0.1.3 |
| [`zhongcao-local-business-note-maker`](skills/zhongcao-local-business-note-maker) | Turn a storefront photo, service image, merchant brief, or brand reference into a coordinated vertical 3:4 REDnote local-business note with a cover, store or service highlight, and a closing visual with room for visit details. | 0.1.3 |
| [`zhongcao-note-copywriter`](skills/zhongcao-note-copywriter) | Turn a product, experience, topic, or audience brief into Xiaohongshu title options, a readable note body, cover text, hashtags, and a natural comment starter. | 0.1.7 |
| [`zhongcao-ootd-lookbook-maker`](skills/zhongcao-ootd-lookbook-maker) | Turn outfit photos and styling ideas into a coordinated vertical 3:4 REDnote OOTD lookbook, with cover, full-look, detail, and lifestyle images plus a ready-to-post fashion story. | 0.1.5 |

## Updates

Each installed skill checks for a new version at most once a day, verifies the
official archive before replacing itself, and leaves your installation untouched
if anything fails. Turn it off at any time — see
`references/automatic-updates-and-safety.md` inside the skill.

## License

[MIT-0](LICENSE) — free to use, modify, and redistribute, including
commercially. No attribution required. Same terms as these skills carry on
ClawHub.

## Links

- Beatra — https://beatra.ai
- Skill catalog — https://beatra.ai/skills
