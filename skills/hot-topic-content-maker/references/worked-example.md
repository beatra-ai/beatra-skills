# One run, end to end

A single worked run from the topic to the delivered post, with the actual output
at every step. The rules stay where they live — [finding the angle](angle-finding.md),
[building the post](post-plan.md), and [hot topic workflow](workflow.md). This
file shows what those rules produce, and where the money enters.

The sample artifacts below are Chinese because the cover-length and
narration-rate budgets are counted in Chinese characters, so an English
rendering of them would stop demonstrating the rule it is there to show. The
route itself also fits TikTok, Reels and Shorts, where the same shapes apply at
the English word rates. Each block is an artifact, not instruction;
the two carrying a cross and a check are a rejected artifact and a kept one.

## What the user brought

```text
我们是做保温杯的，小红书账号，主打通勤人群。到处在说这波断崖式降温，
能不能蹭一下，今天就要发。
```

A topic, an account, a platform, and a deadline. That is a complete input: no
lookup is needed, because the user brought the topic. Nothing so far costs
anything.

## Free stages: three angles and a pick

Offered in the first reply, before any question. Each connects the cold snap to
this specific account rather than to homeware in general.

Each row is the angle and the connection it makes to this account.

```text
1  通勤路上那杯还热着      产品在寒冷通勤里真正做的事
2  降温第一天办公室的三种人  观察向，杯子作为角色出现
3  保温杯到底能撑几个小时    好奇心，且是品牌能拿出依据的说法
```

**Picked: 1.** It carries the account's own audience, needs no comparison to a
competitor, and states nothing the brand cannot back. Angle 3 was the runner-up
and was set aside for a reason worth saying out loud: it invites a specific
hours-held number, which is a substantiation the user has not supplied, so it
would have to open with a request for test data rather than with a post.

The risk read on the chosen angle: a weather peg carries no named people, no
disputed event, and no regulated category. It runs.

## The free screening, shown

This is the stage that pays for itself, so here it is actually catching
something. A third cover wording was drafted and cut:

```text
✗  通勤路上
   唯一的热        ← 含极限词，已删，不可复用
```

The second line opens with an absolute — the Chinese word for "the only one",
which appears verbatim on the banned-term lists this repo's sibling packages
carry. It claims totality about the product, on the highest visibility surface
the post has, and the rule in [building the post](post-plan.md) applies to
local-language equivalents whether or not the claim happens to be true. It was
replaced rather than softened.

The same screen removed nothing else from this run. The caption's line about
steam still rising when the bottle is opened at the office is the sanctioned
shape: a specific thing that happened, not a rank.

It also correctly kept something a literal substring match would have cut. Angle
2 and the delivered caption both open on the cold snap's first day:

```text
✓  降温第一天   ← 「第一」是时间序数，不是排名，保留
```

Screening by substring is how a compliant line gets destroyed; read what the
phrase asserts.

## Approval gate 1 — the production card

Free until the user says yes. Two cover wordings are offered because it costs
nothing and it is the highest-leverage line in the post.

```text
A   断崖式降温
    那杯还热着
```

```text
B   通勤路上
    手里还热
```

Both are two lines, headline first, and both lead with the surprising half
rather than the topic. A picks up the trend's own phrasing, which helps in
search; B is stronger as an image. Both cleared the screen above. **The user
picked A.**

The card then freezes, in one message: the chosen angle and cover wording, the
9:16 canvas with the warning that changing the ratio later means paying for
every artifact again, the caption and hashtags as written below, whether a clip
is included, the live per-image price read from the model card, the number of
paid calls and the stable request ID each will carry, the statement that cover
text is generated artwork and will be read back against the approved wording,
and the resulting total. This run is **cover only** — the user
declined the clip at this gate — so the card names one paid image call.

The clip is offered exactly once, here. Declining now does not close it: the
same clip can be added later, but it is new paid work with its own gate.

## Production, and what came back

One `beatra.images.generate` call at the frozen 9:16 canvas. The delivered
caption and hashtags cost nothing and were written during the free stage.

```text
降温第一天，地铁口全是缩着脖子的人。

我今年做对的一件事，是出门前把杯子灌满。到公司拧开还冒热气，
那一口下去整个人才算醒。

通勤这段路谁都改变不了，能改变的是手里那杯是热的还是凉的。

你们那儿今天几度？
```

Opens on the angle rather than the topic, delivers in short paragraphs, and
closes with one question — a question rather than a follow ask, because comments
are what keep a trending post moving.

```text
#断崖式降温   #通勤日常   #保温杯   #冬日好物   #XX日常
```

One tag is the topic's own, spelled the way people are actually using it. Three
are category tags where this account competes — its audience, its product, and
the seasonal shelf it sits on. One is the account tag, for continuity across
posts. That is 1 / 3 / 1, inside the documented range.

## What a clip would have added

Had the user accepted the clip at gate 1, the beat plan would have been written
free, alongside the cover. On-screen and spoken stay in separate fields, because
they are written for different calls. **Everything in this section is what the
run did not produce** — it is shown so the shape of a clip run is legible before
paying for one.

The two column labels are the on-screen field and the spoken field.

```text
1  画面  清晨地铁口，人群缩着脖子快走，冷白光，镜头缓慢前推
   口播  今天是真的冷

2  画面  工位特写，拧开杯盖，热气升起，暖光
   口播  出门前灌满的那杯，还热着

3  画面  手捧杯子看向窗外，画面转暖，镜头轻微后拉
   口播  你们那儿今天几度
```

Three beats: the hook that names the topic, the angle delivered, the one ask.
Spoken fields total 25 Chinese characters, which at four to five characters per
second is roughly five to six seconds of narration — comfortably inside the
12-second default, leaving room for the pauses real delivery adds.

**Approval gate 2 would then be its own card**, shown before any video request
and after the beat stills and narration were reviewed: the route and tool, the
approved opening frame and narration, the motion direction, the selected model
— chosen explicitly, never left to `auto` on this route — the audio-led
duration, the resolution if one was set, the provisional estimate, the note
that the 600-credit signup gift usually cannot start it, and what happens if
the balance is short.

Approving the cover at gate 1 does not authorize the shoot. That is the whole
reason there are two production gates rather than one: the cheap, reversible
work is approved separately from the expensive, irreversible work, and the user
sees the second price only when there is something real to price. A run that
opens with a trend lookup has a third confirmation before either of them.

## Delivery

The cover image beside its wording so the two can be checked against each other,
the caption as one block, the hashtags on their own line in posting order, and
for each generation task its ID, artifact link, resolved model, returned
dimensions, and `billing.net_charged_credits`. Had a clip run, every beat still
is delivered too, not only the frame that ended up animated.

## Where this run could have gone differently

**The user brings no topic.** Then the optional lookup opens the run, priced and
confirmed on its own before anything else. See
[looking up what is trending](trend-lookup.md).

**The user wants a different ratio.** Say it at gate 1. After production, a ratio
change means producing every paid artifact again.

**The user wants the clip after seeing the cover.** Allowed, and normal. The beat
plan is written free, the beat stills and narration are their own paid stage, and
gate 2 still comes before the video.

**A cover comes back wrong.** Redo the cover; it reuses the clip artifacts
unchanged rather than restarting the run. See
[hot topic workflow](workflow.md) for what a redo does and does not re-charge.
