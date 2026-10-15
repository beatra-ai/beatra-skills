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
能不能蹭一下，今天就要发。时间紧，先只出封面和文案。
```

A topic, an account, a platform, a deadline, and a scope: the cover and the copy
only, which the user asked for in so many words. That is a complete input: no
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
3:4 canvas — the note opens on the cover, and 3:4 is the ratio its inner cards
would use — with the warning that changing the ratio later means paying for
every artifact again, the caption and hashtags as written below, whether a clip
is included, the live per-image price read from the model card, the number of
paid calls and the stable request ID each will carry, the statement that cover
text is generated artwork and will be read back against the approved wording,
that the angle, caption, and hashtags stay the user's if they stop here, what
happens if the balance is short (the official message and top-up URL relayed,
and the same request ID retried only after they top up), and the resulting
total. In this run the user asked for the cover and copy only, so the card names one paid image call. For a Xiaohongshu post the default set is the image set — the cover plus inner cards — and the sections after delivery show what that, and a video, would have added.

## Production, and what came back

One `beatra.images.generate` call at the frozen 3:4 canvas. The delivered
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

## What the full image set adds

Illustrative: this run stopped at the cover. The default image set adds inner cards, planned free with the cover and listed on the same gate-1 card, each with its own request ID and price, under one estimated total.

Each block is one card: a short headline, then at most three short lines.

```text
卡 1  降温第一天
      地铁口全是缩着脖子的人

卡 2  出门前灌满
      到公司拧开还冒热气

卡 3  通勤三件套
      围巾 · 手套 · 一杯热的

卡 4  你们那儿几度
      评论区报个温度
```

The cards follow the caption's order, so the post reads the same in pictures and in text. After rendering, each card is read back against this text. A wrong card gets one `beatra.images.edit`, on its own card with its live price; if it is still wrong, the user chooses between taking it as returned with the text alongside and one more carded call for a text-free base.

## The same angle as a scene video

Illustrative. Had the user also posted to Douyin, this product-and-moment angle defaults to a scene video. The shots are written free, with on-screen and spoken fields apart because they feed different calls.

The two column labels are the on-screen field and the spoken field.

```text
1  画面  清晨地铁口，人群缩着脖子快走，冷白光，镜头缓慢前推
   口播  降温第一天，早上八点的地铁口全是缩着脖子的人。

2  画面  玄关，出门前把热水灌进保温杯，蒸汽升起
   口播  我今年做对的一件事，是每天出门前把杯子灌满热水。

3  画面  工位特写，拧开杯盖，热气升起，暖光
   口播  到公司拧开还冒热气，那一口下去整个人才算醒。

4  画面  手捧杯子看向窗外，画面转暖，镜头轻微后拉
   口播  路改不了，手里那杯可以是热的。你们那儿今天几度？
```

The spoken fields total 84 Chinese characters, not counting punctuation, roughly 17 to 21 seconds at four to five characters per second: inside the 15-to-30-second plan, and past what one take holds. So each shot becomes its own clip. The narration is one speech call; once its real duration comes back, each shot's share is set from its line's length, each clip is requested at the smallest whole second the card admits at or above that share, and the edit list trims it to the share. The music brief reads "warm, light acoustic guitar and soft percussion, unhurried, no vocals".

Say the narration comes back at 18.9 seconds. The four spoken lines are 21, 22, 20, and 21 characters long, 84 in all, so the first three shots take 4.7, 5.0, and 4.5 seconds and the last takes the remaining 4.7. Each clip was requested at 5 seconds, so every span fits inside its clip. Once the four clips are back, one join lays the narration from the start, the four muted clips over it in order, the music under it at 0.25, and the subtitles on top, and returns one 9:16 video of 18.9 seconds. It costs no credits.

Had the narration come in at 15 seconds or under, it would have been one take: the opening still animated with the narration as its driving audio, and the other stills delivered as stills. The join would then add the music and the subtitles to that one take, keeping its sound.

**Gate 2 is its own card**, after the stills, narration, and music were reviewed: each video call with its still, the motion, the model, the duration, and the provisional estimate, whether the card's first-video offer applies to any of them, and what happens if the balance runs out partway. Approving gate 1 does not authorize it: the cheap, reversible work is approved separately from the expensive work. The video's estimate was already part of the gate-1 total; gate 2 prices each call again from the live card, now that the real narration length is known. The card ends with the join, which costs nothing and needs no approval of its own.

## A news angle as a presenter video

Illustrative, a different topic. An account that writes about home insurance picks the angle "before the typhoon, photograph your home for any claim" for Douyin. A news-and-explainer angle defaults to the presenter video with a virtual presenter.

```text
台风登陆前，先做一件事：给家里拍照留证。
门窗、车辆、贵重物品，各拍一张，记得带上日期。
```

The script is about 35 Chinese characters, roughly 7 to 9 seconds. That fits one take, so it stays one take even though it has two sentences: one narration call and one video call. Gate 1 lists the virtual presenter image, the narration, the music, and the cover at 9:16, since this post is a video on its own, with the estimated total including the take. Gate 2 lists the one take with the explicitly selected model that accepts narration. Once the take is back, the join keeps its lip-synced sound, lays the music under it, and burns in the subtitles. Delivery brings that finished clip first, then the take, the music, and the SRT as files, and the reminder to switch on the platform's AI-generated content label. A script past 15 seconds would split at a sentence boundary into takes, one narration slice and one video call each, and the takes are joined into one video, each keeping its own sound.

## Delivery

The cover image beside its wording so the two can be checked against each other, every card beside its text, the caption as one block, the hashtags on their own line in posting order, and for each generation task its ID, artifact link, resolved model, returned dimensions, and `billing.net_charged_credits`. For a video, the finished video comes first, then every still, not only the one that was animated, each clip, the narration, the music, and the subtitles. The edit list is delivered only when the finished video could not be made.

## Where this run could have gone differently

**The user brings no topic.** Then the optional lookup opens the run, priced and confirmed on its own before anything else, and its first reply already offers topics with angles and asks where the post will go. See [looking up what is trending](trend-lookup.md).

**The user wants a different ratio.** Say it at gate 1. After production, a ratio change means producing every affected paid artifact again.

**The user wants the video after seeing the images.** Allowed, and normal. The shots or script are written free, the stills, narration, and music are their own paid stage, and gate 2 still comes before the video.

**A card or the cover comes back wrong.** One `beatra.images.edit` for that image, on its own card with its live price; if it is still wrong, the user takes it as returned with its text alongside, or approves one more call for a text-free base. Everything else is reused. See [hot topic workflow](workflow.md) for what a redo does and does not re-charge.

**The user offers their own photo as the presenter.** They confirm they are the person pictured or have that person's consent; otherwise the virtual presenter is used. With that confirmation the photo is uploaded with the bundled client and checked against the video card before it goes on gate 1. After the video is delivered, they can save it as an avatar for later posts, once they confirm the consent sentence for whoever is pictured.

**The finished video could not be joined.** The parts are delivered with the edit list. See [questions and anti-patterns](faq.md).
