# Vocal, language, and tags

Distinguish dedicated request fields from descriptive guidance.

## Dedicated controls available with Suno 5.5 custom mode

- `vocal_gender: "m"` requests a male lead.
- `vocal_gender: "f"` requests a female lead.
- `instrumental: true` requests no vocal and requires lyrics to be omitted.
- `negative_tags` requests exclusion of unwanted musical or production traits.
- `style_weight`, `weirdness_constraint`, and `audio_weight` accept values from
  0 to 1 in increments of 0.01.

These fields require:

```json
{
  "model": "suno-5.5",
  "model_options": {
    "suno": {
      "custom_mode": true
    }
  }
}
```

Custom vocal songs also require a non-empty `title` and `lyrics`.

## Soft guidance

Language, accent, vocal age/color, rasp, intimacy, power, rap/singing balance,
duet roles, choir size, and exact section behavior have no dedicated
field. Express them consistently in:

1. the production prompt;
2. lyric language and natural word choice;
3. concise section/performance tags.

Examples:

- English indie pop: `natural conversational English, intimate and slightly
  breathy lead, restrained verses, open vowel-led chorus`.
- Japanese opening theme: `natural Japanese lyrics, agile bright lead, compact
  verse phrasing, explosive melodic chorus`; confirm mora density in the lyric.
- Spanish-English chorus: state which section uses each language, why the
  switch happens, and write each line in its intended language.
- Mandarin pop: `natural Mandarin lyrics, warm clear lead, intimate verses,
  open and soaring chorus`.
- Cantonese ballad: `colloquial Cantonese lyrics, expressive lead, restrained
  verse delivery, emotionally lifted chorus`.
- Duet: `male-female conversational duet, alternating verses, shared chorus
  with close harmony`, reinforced by role tags.

Never claim these descriptive cues guarantee a specific accent, exact singer count, or
line assignment. If casting is essential, generate one carefully directed
version first, evaluate it, then discuss a revision.

When the requested language has no dedicated example, describe the language,
regional variety, register, and section plan in the positive prompt; use
natural lyrics in that language; then verify pronunciation by listening. Never
use a negative tag as a substitute for correct language writing.

## Practical control defaults

Use controls only when the brief justifies them. A balanced custom request may
start near:

- `style_weight: 0.70` for a clear but not rigid style direction;
- `weirdness_constraint: 0.25` for accessible songwriting;
- `audio_weight: 0.70` only when reference audio should strongly guide the
  result.

These are creative starting points, not universal quality scores. Increase
weirdness for experimental form or texture; reduce it for functional BGM,
jingles, children's songs, or a conventional commercial chorus. Do not set
`audio_weight` without reference audio.

## Negative guidance

Keep `negative_tags` short and outcome-focused, for example:

- `no aggressive drums, no distorted guitar, no spoken intro`
- `no vocals, no cinematic impacts, no abrupt ending`
- `no rap section, no excessive melisma, no crowd ambience`

Do not negate something the positive brief simultaneously requests.
Do not treat a negative language phrase such as `no Mandarin pronunciation` as
a pronunciation lock. Guide language through natural lyrics and the positive
prompt, then verify the finished performance by ear.
