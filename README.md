# Beatra Skills

Agent Skills for creative production — thumbnails, talking-avatar video, and AI
image realism. Each skill runs in your agent and renders on
[Beatra](https://beatra.ai).

Every skill here is the same package Beatra publishes to its official channels,
built from the immutable release archive on `cdn.beatra.ai` and verified by
SHA-256 before it lands in this repository.

## Skills

| Skill | What it does | Version |
| --- | --- | --- |
| [`youtube-thumbnail-maker`](skills/youtube-thumbnail-maker) | Turn a YouTube topic, title, script, key frame, portrait, product photo, or channel reference into three thumbnail directions described in text, then render the one you pick as a 16:9 image with the headline area kept clear. Leave with a title that matches the image and a channel rule the next video can reuse. | 0.2.0 |
| [`talking-avatar-video`](skills/talking-avatar-video) | Turn one portrait and a short script or speech track into a directed talking-avatar video for explainers, announcements, lessons, and product messages. | 0.1.6 |
| [`ai-image-realism`](skills/ai-image-realism) | Make existing AI portraits, product images, and marketing visuals look more natural by fixing plastic skin, malformed hands and faces, repeated textures, and inconsistent lighting. | 0.2.5 |

## Install

With the [`skills`](https://skills.sh) CLI, from this repository:

```bash
# List everything available here
npx skills add beatra-ai/beatra-skills --list

# Install one skill
npx skills add beatra-ai/beatra-skills --skill youtube-thumbnail-maker

# Install all of them
npx skills add beatra-ai/beatra-skills --all
```

From ClawHub:

```bash
npx clawhub install youtube-thumbnail-maker
```

Or copy a skill folder straight into your agent's skills directory —
`~/.claude/skills/` for Claude Code, `~/.openclaw/skills/` for OpenClaw, and the
equivalent path for any other agent that reads `SKILL.md`.

## Rendering

Rendering requires a Beatra account at [beatra.ai](https://beatra.ai) with
credits on it. Planning, direction, and review run locally in your agent.

## Updates

Each installed skill checks for a new version at most once a day, verifies the
official archive before replacing itself, and leaves your installation untouched
if anything fails. Turn it off at any time — see
`references/automatic-updates-and-safety.md` inside any skill.

## License

[MIT-0](LICENSE) — free to use, modify, and redistribute, including
commercially. No attribution required. Same terms as these skills carry on
ClawHub.

## Links

- Beatra — https://beatra.ai
- Skill catalog — https://beatra.ai/skills
- ClawHub — https://clawhub.ai/skills/skills/youtube-thumbnail-maker
