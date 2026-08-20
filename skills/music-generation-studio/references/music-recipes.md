# Music recipes

These are Agent-facing payload patterns. Replace the creative content and use a
new stable `client_request_id` for each newly approved generation.

## English commercial pop song

```json
{
  "model": "suno-5.5",
  "prompt": "Contemporary English alt-pop single, intimate conversational verse, rising pre-chorus, wide vowel-led hook, warm female lead, pulsing synth bass, crisp restrained drums, bright guitar accents, final chorus gains harmony, polished modern mix",
  "lyrics": "[Verse 1]\nStreetlights draw a map across the glass\nI trace the road but let the moment pass\n\n[Pre-Chorus]\nIf I say it now, the night might change\n\n[Chorus]\nMeet me where the city turns to gold\n...",
  "instrumental": false,
  "title": "Where the City Turns",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "vocal_gender": "f",
      "negative_tags": "no spoken intro, no rap break, no excessive melisma",
      "style_weight": 0.74,
      "weirdness_constraint": 0.22
    }
  },
  "client_request_id": "music-english-pop-001"
}
```

Write the complete lyric before submission. Keep natural English stress and a
concise chorus hook.

## Instrumental BGM for video, brand, or game

```json
{
  "model": "suno-5.5",
  "prompt": "Elegant skincare film BGM, modern ambient pop, calm-to-luminous arc, 92 BPM feel, felt piano, airy pads and muted electronic pulse, space for narration, gentle lift at midpoint, clean resolved ending, polished wide mix",
  "instrumental": true,
  "title": "Quiet Radiance",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "negative_tags": "no vocals, no heavy drums, no cinematic impacts, no abrupt ending",
      "style_weight": 0.72,
      "weirdness_constraint": 0.18
    }
  },
  "client_request_id": "music-skincare-bgm-001"
}
```

For game loops, ask for a loop-friendly arrangement without promising a
sample-perfect loop point. Treat exact duration as arrangement guidance; final
timing may need editing. “Space for narration” is creative direction, not
automatic sidechain or final dialogue mixing.

## Multilingual or bilingual song

Decide the purpose of each language first. This example uses Spanish for the
personal story and English for a shared chorus phrase:

```json
{
  "model": "suno-5.5",
  "prompt": "Spanish-English contemporary Latin pop, warm expressive lead, Spanish narrative verses, bilingual pre-chorus, concise English-Spanish shared hook, acoustic guitar and modern percussion, open chorus, natural code-switching, polished radio mix",
  "lyrics": "[Verse 1 - Spanish]\nGuardé tu risa dentro del abrigo\npara cruzar la noche sin testigos\n\n[Pre-Chorus - Spanish to English]\nSi vuelves a mirar\nI'll meet you where we are\n\n[Chorus - Bilingual]\nStay, quédate un momento\nstay, que el mundo va más lento\n...",
  "instrumental": false,
  "title": "Quédate un Momento",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "negative_tags": "no spoken intro, no random language switching, no crowd vocals",
      "style_weight": 0.73,
      "weirdness_constraint": 0.23
    }
  },
  "client_request_id": "music-bilingual-latin-pop-001"
}
```

Do not translate the same line twice unless repetition is the hook. For another
language pair, write natural lyrics in both languages and explain why the
switch happens.

## Solo vocal song

Use `vocal_gender` only when a single male or female lead matters:

```json
{
  "model": "suno-5.5",
  "prompt": "Japanese city-pop night drive, natural Japanese lyrics, agile warm male lead, syncopated bass, electric piano, clean guitar, compact verses, luminous melodic chorus, sophisticated but accessible production",
  "lyrics": "[Verse 1 - Male, close]\n交差点に雨がほどけて\n言えないままの朝を待つ\n\n[Chorus - Male, open]\n遠回りでも　光のほうへ\n...",
  "instrumental": false,
  "title": "光のほうへ",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "vocal_gender": "m",
      "negative_tags": "no spoken monologue, no choir, no heavy rock drums",
      "style_weight": 0.76,
      "weirdness_constraint": 0.2
    }
  },
  "client_request_id": "music-japanese-city-pop-001"
}
```

Gender is a dedicated preference, not an identity guarantee. Accent, age,
texture, and exact timbre remain descriptive guidance.

## Duet or call-and-response

Do not set `vocal_gender`; one value cannot encode two leads.

```json
{
  "model": "suno-5.5",
  "prompt": "Conversational pop duet, distinct warm Voice A and clear Voice B, opposed viewpoints in alternating verses, call-and-response pre-chorus, shared soaring chorus with close harmony, cinematic piano-pop arrangement, balanced vocal presence",
  "lyrics": "[Verse 1 - Voice A]\nI kept the ticket by the door\n...\n\n[Verse 2 - Voice B]\nYou kept the light on one night more\n...\n\n[Pre-Chorus - Alternating lines]\n[Voice A] I thought the road was closing\n[Voice B] I saw another way\n\n[Chorus - Duet, harmony]\nMeet me in the middle\n...",
  "instrumental": false,
  "title": "Meet Me in the Middle",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "negative_tags": "no solo-only performance, no choir, no rap",
      "style_weight": 0.76,
      "weirdness_constraint": 0.24
    }
  },
  "client_request_id": "music-duet-001"
}
```

Role tags and arrangement request a duet but cannot guarantee singer count or
exact line assignment.

## Reimagine a reference recording

Ask what should remain and what should change. After
`python3 scripts/mcp_client.py upload <path> --mime-type <type>` validates the
grant, uploads the file, and returns an artifact:

```json
{
  "model": "suno-5.5",
  "prompt": "Transform the reference into an upbeat synth-pop arrangement while retaining its broad melodic contour, brighter chorus, modern electronic drums, remove the acoustic folk texture, confident contemporary lead",
  "lyrics": "[Verse 1]\n...\n\n[Chorus]\n...",
  "instrumental": false,
  "title": "Toward the Light",
  "reference_audio": {
    "type": "artifact",
    "artifact_id": "art_..."
  },
  "model_options": {
    "suno": {
      "custom_mode": true,
      "audio_weight": 0.72,
      "style_weight": 0.7,
      "weirdness_constraint": 0.2
    }
  },
  "client_request_id": "music-reference-transform-001"
}
```

Listen for whether the requested musical identity remains clear and whether the
new genre, energy, language, vocals, and production direction come through.
Turn the largest remaining gap into one focused revision.

## Explicit alternative-model request

First call `beatra.models.list` and use the returned contract. This is a current
MiniMax example, not a permanent second-model assumption:

```json
{
  "model": "minimax-music-3.0",
  "prompt": "Bright contemporary pop with an uplifting chorus and acoustic guitar",
  "instrumental": false,
  "title": "New Morning",
  "model_options": {
    "minimax": {
      "lyrics_optimizer": true
    }
  },
  "client_request_id": "music-minimax-explicit-001"
}
```

Do not copy Suno controls into a MiniMax or newly discovered model request.

## Mandarin pop song

```json
{
  "model": "suno-5.5",
  "prompt": "Contemporary Mandarin dream-pop ballad, warm clear female lead, intimate verse, rising pre-chorus, wide memorable chorus, piano and shimmering synths, restrained drums, emotional but not melodramatic, polished radio mix",
  "lyrics": "[Verse 1]\n雨停在玻璃的边缘\n...\n\n[Pre-Chorus]\n...\n\n[Chorus]\n...",
  "instrumental": false,
  "title": "雨停以后",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "vocal_gender": "f",
      "negative_tags": "no rap, no spoken intro, no excessive melisma",
      "style_weight": 0.74,
      "weirdness_constraint": 0.22
    }
  },
  "client_request_id": "music-mandarin-pop-001"
}
```

Prioritize natural syntax, breathable lines, and one memorable Chinese hook.
Do not claim deterministic tone-to-melody control.

## Cantonese conversational song

Write complete natural Cantonese lyrics before the call. Default colloquial
Hong Kong Cantonese to Traditional Chinese unless the user asks otherwise.

```json
{
  "model": "suno-5.5",
  "prompt": "Modern Cantonese pop ballad, colloquial Cantonese lyrics, expressive male lead, close restrained verses, live bass and piano, subtle strings, chorus opens emotionally without shouting, clear diction, contemporary Hong Kong pop production",
  "lyrics": "[Verse 1 - Male, intimate]\n...\n\n[Pre-Chorus]\n...\n\n[Chorus - Male, open]\n...",
  "instrumental": false,
  "title": "留低的光",
  "model_options": {
    "suno": {
      "custom_mode": true,
      "vocal_gender": "m",
      "negative_tags": "no rap section, no arena-rock drums, no spoken intro, no excessive melisma",
      "style_weight": 0.78,
      "weirdness_constraint": 0.18
    }
  },
  "client_request_id": "music-cantonese-male-001"
}
```

Check syntax, particles, rhyme finals, line density, and pronunciation by ear.
Do not treat a negative tag as a pronunciation lock.
