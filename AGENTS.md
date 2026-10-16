# AGENTS.md

This repository publishes Beatra Agent Skills. Each skill lives in `skills/<slug>/` and starts at its `SKILL.md`;
follow that file, not this one, when you run the skill.

## Install

```bash
npx skills add beatra-ai/beatra-skills --skill <slug>
```

## Rules for agents

- Rendering uses credits on the person's Beatra account. A paid step runs only when the person asks for that
  exact render or approves the confirmation card the skill shows; follow the skill's own card rules.
- The skills contain no self-updater and never replace their own files. Update with the tool that installed
  them: `npx skills update <slug>` or `gh skill update <slug>`.
- Do not quote model names, limits, or prices from this repository; read the live catalog:
  https://docs.beatra.ai/en/docs/models
- Full reference for every Beatra skill: https://beatra.ai/llms-full.txt
