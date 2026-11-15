# Course Narration Workflow

## Lecture ledger

Record every lesson title, teaching order, block labels, weighted-character
counts (`beatra_weighted_characters`: Han = 2, others = 1), pronunciations,
frozen `voice_id`, script direction `task_id` (if used), synthesis
`client_request_id` + `task_id`, and finishing `task_id`.

Turn each lecture into speakable text before preflight/pricing:

- keep one section to one teaching point in short spoken sentences;
- explain new terms plainly on first mention using the pronunciation table;
- preserve simplified/traditional characters and dialect wording verbatim unless
  asked; never hand-strip `/` pause markers or invent bracketed vocal-effect cues;
- strip slide titles, field labels, picture notes, and bracket stage
  directions out of synthesis `input`.

If recurring names, terms, or acronyms lack agreed readings, stop and collect
them without guessing.

## Optional narrator clone & voice maintenance

Confirm plain speaker consent BEFORE `scripts/mcp_client.py upload` (possession
is not consent). Check live limits via `beatra.models.list` with
`{"capability": "voice_clone", "include_activation_required": true}` without
naming upstream vendors or internal IDs.

- If the sample has café noise or background buzz, offer paid pre-clean via
  `beatra.audio.process` (`operation: "isolate_voice"`, **`source`** field,
  `4.6 s–5 min`, `<= 100 MB`, priced via `{"capability": "audio_voice_isolation"}`)
  on its own six-field card first.
- Choose an immediate-ready cloning route (`auto` or expressive multilingual)
  directly here, or route trial-first `pending_activation` activation
  (`voices.activate`) or slot deletion (`voices.delete`) to
  `voice-cloning-studio` / `beatra-ai-voice-studio` (`scripts/mcp_client.py tools`
  is authoritative).
- Present the six-field clone card (`If stop` states kept free deliverables at
  zero charge—never hardcoding credit counts or asking users to pre-confirm
  sufficient credits) before generating a clone `client_request_id`.
- Once ready, maintain display metadata or set default with non-billable
  `beatra.voices.update` (`make_default: true`), and audition candidates free
  with `preview_url` or `beatra.voices.preview` (`{"voice_id": "..."}`).

## Pilot, Smart Voice Director, validation, and pack loudness finishing

- **Optional Smart Voice Director (`beatra.speech.prepare_script`)**: check
  live `{"capability": "speech_script"}`, approve its six-field card, handle
  `synthesis: null` from `warnings`, and pass `scripts[i].synthesis` verbatim +
  fresh `client_request_id` into synthesis (48h free recompile holds only for
  exact same `input`/`instructions`/`language`/`context` changing just
  `voice`/`model`, subject to balance coverage and <= 2 concurrent tasks; never
  describe `prepare_script` as generally free).
- **Mandatory free check (`beatra.speech.validate`)**: preflight every block
  before paying to check `estimated_duration_seconds` and compatibility.
- **Hardest lecture pilot**: synthesize ONLY the term/number-dense pilot first
  (`subtitle_enable: true` when aligned SRT/VTT study captions help; NEVER
  `subtitles`), review readings, revise only misread blocks under new IDs, then
  approve the remaining pack card.
- **Broadcast loudness normalization**: check live `{"capability": "audio_process"}`,
  approve a finishing card, and run serialized `beatra.audio.process`
  (`operation: "normalize_loudness"`, **`source`** field, e.g. `-14 LUFS`,
  `<= 60 min`, `<= 300 MB`, output `>= 1 s`, `50` calls/day) one track at a time—never
  call finishing free or a mastering service.

## One block & normalization payloads

```json
{
  "voice": "voice_...",
  "input": "Approved lecture block",
  "format": "mp3",
  "subtitle_enable": true,
  "client_request_id": "opaque-lesson-01-a"
}
```

```json
{
  "operation": "normalize_loudness",
  "source": {"type": "artifact", "artifact_id": "artifact_lesson_01_a"},
  "loudness_lufs": -14,
  "format": "mp3",
  "client_request_id": "opaque-lesson-01-a-norm"
}
```

## Pointing to another Skill

Suggest Slide Narration Studio for narration read from the teacher's slides,
one audio file per slide, and Lecture Video Maker for lecture videos made
from the slides. Use the website wording exactly and install only after the user asks. Send the line
in the user's language:

```text
请安装 课件配音；需要登录授权时告诉我：https://beatra.ai/skills/slide-narration-studio/install.md
请安装 数字人讲课；需要登录授权时告诉我：https://beatra.ai/skills/lecture-video-maker/install.md
Install Slide Narration Studio and tell me when I need to sign in: https://beatra.ai/skills/slide-narration-studio/install.md
Install Lecture Video Maker and tell me when I need to sign in: https://beatra.ai/skills/lecture-video-maker/install.md
```
