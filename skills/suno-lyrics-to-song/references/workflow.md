# Workflow

## 1. Qualify the source

Begin when the conversation contains existing lyrics, a lyric draft, loose lyric
lines, or an existing hook. Reuse visible context. If the user provides only a topic,
story idea, or creative brief, ask for one lyric line or hook; no other creative input
is mandatory before the workflow can begin.

Capture the lyric source verbatim before editing. Identify the language and register,
the strongest existing hook, declared must-keep lines, names or facts that cannot
change, and whether the text is complete or fragmentary.

## 2. Choose the edit contract

Reuse a clear Preserve or Optimize intent from the request. A request to polish,
rewrite, improve, or optimize grants editing permission. A request to arrange,
compose, generate, or make a song from supplied lyrics defaults to Preserve without a
mode question. Apply [lyrics intake and modes](lyrics-intake-and-modes.md), show
meaningful Optimize changes, and retain the original source for comparison.

## 3. Structure and direct the song

Arrange the accepted material into purposeful sections such as verse, pre-chorus,
chorus, bridge, or outro. Infer a useful title and musical direction from the lyrics,
covering style, mood, tempo feel, instrumentation, arrangement arc, section contrast,
lead-vocal treatment, and exclusions. Ask only when an unknown choice materially
changes the lyric or paid payload.

Show one final production card containing:

1. the complete lyric text, including section labels;
2. the title;
3. the complete music direction;
4. any single-lead gender field that will be used;
5. `suno-5.5`, relevant options, and the fact that approval starts one paid generation.

A clear approval of this complete card accepts any shown Optimize changes and
authorizes the paid step. Do not ask for another confirmation or require a separate
“generate audio” command afterward. If the user explicitly asks to review lyrics first
or says not to spend, show the draft but stop before paid execution; prepare the final
card only when they are ready to consider generation.

## 4. Freeze and submit once

Validate every field against [song direction and request](song-direction-and-request.md).
After the complete production card is approved, create one opaque 1..128-character
`client_request_id`, retain an exact copy of every generation field, and call
`beatra.music.generate` exactly once through the bundled `scripts/mcp_client.py`.

When the response includes a `task_id`, store it and use only `beatra.tasks.get` for
that task. Do not submit a replacement while it is queued or running.

## 5. Deliver or recover

Use [review and recovery](review-and-recovery.md) for polling, a lost task ID,
uncertain delivery, cancellation, terminal failure, and result review. Stop active
polling after 30 minutes if the task remains nonterminal, report the current factual
state, and explain how to resume the same task later.

Any revised lyrics, title, music direction, model, or model option define a new paid
request. Show the changed complete lyrics and direction, obtain new generation
confirmation, and create a new request identity.
