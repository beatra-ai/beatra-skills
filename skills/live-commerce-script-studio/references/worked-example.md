# One session, end to end

A single worked run from the merchant's brief to the delivered pieces, with the
actual output at every step. The rules stay where they live —
[planning the session](session-plan.md), [writing the talk track](talk-track.md),
and [live-commerce workflow](workflow.md). This file shows what those rules
produce, and where the money enters.

The sample lines are Chinese because that is the language these sessions are read
in, and because the compliance screen operates on Chinese wording. Each block is
an artifact, not instruction.

## What the merchant brought

```text
抖音自播，晚上 8 点到 11 点，三小时。主推一款便携榨汁杯，日常价 129 一台，
直播价 89 一台，同一个规格。杯体 400ml，USB-C 充电，充满大概能打六杯。
质检报告有，挂在链接里。库存今天还没盘，晚点给你。
另外带四个日常品走走量。主播是我们自己的运营，第一次上镜。
```

A platform, a length, a lineup, both prices with their specification, four
product facts, and a host. Stock is explicitly **not** supplied — that matters
below. Everything the session claims about the product comes from this message;
nothing else may be invented. Stages 1 to 5 cost nothing.

## Stage 1-2: the frame and the schedule

Three hours, three phases, five products. The featured product takes the middle
phase where the room is largest; the four volume products take the slots either
side of it, while the opening warm-up and the closing recap carry no product of
their own.

```text
20:00-20:20  暖场          自我介绍、今晚清单、停留福袋
20:20-21:00  日常品 A / B   各 20 分钟，快节奏
21:00-21:40  榨汁杯（主推） 六段成交链完整走一遍
21:40-22:20  日常品 C / D   各 20 分钟
22:20-23:00  返场           主推二次讲解、未拍订单催付、下播预告
```

The featured slot is 40 minutes because the six-stage selling chain needs room to
run once and be repeated for viewers who arrived late. A first-time host gets the
volume products first, so the highest-value slot is not also their first slot.

## Stage 3: the talk track, seven steps

The featured product's block, in order. These are lines to be read, not stage
directions to interpret.

```text
1 问题   下午三点想喝点鲜的，楼下买一杯不便宜，自己榨又要洗半天
2 引入   这就是今天这台便携榨汁杯要解决的事
3 卖点   杯体 400ml，一次打完够倒两杯，上午下午各一次中间不用洗
        ——400ml 是商家标的容量
        USB-C 充电，充满大概能打六杯，出差一周不用专门找插座
        ——六杯这个数是商家给的
4 信任   质检报告挂在链接里，是商家提供的，可以自己点进去看
5 价格   日常价 129 一台，今晚直播价 89 一台，同一个规格
6 紧迫   这个价格只在今晚这场，下播就恢复日常价
7 常问   能不能打冰？多久充满？坏了走什么售后？
```

Two selling points, not five. Each carries the four beats — feature, what it
does, what it means, evidence — and every fact in the block traces to the
merchant's message. Nothing was added to make a beat land.

**Step 6 is written around the gap.** Stock was not supplied, so the urgency
line is time-based rather than stock-based. The alternative — naming a quantity
nobody verified — is the one thing this step must never do, because the room
watches whether the number moves.

## Stage 5: the compliance pass, shown

This is the stage that pays for itself, so here it is actually catching
something. Three lines were drafted and changed:

```text
✗ 全网最低价 89     → 日常价 129 一台，今晚直播价 89 一台   （极限词：最低）
✗ 什么水果都能打     → 商家只给了容量和续航，能打什么没给数据  （绝对化：什么都）
✗ 喝了排毒养颜       → 删除，且不可补件恢复                  （器具不能带功效宣称）
```

The first replacement uses what the merchant actually supplied, and it keeps its
specification — a price without its unit fails the screen on its own. The second
had nothing to replace it with, so it states the absence instead: naming a range
the merchant never gave would be the same violation as the claim it replaced.

The third is a different kind of rejection and the annotation says so. This is
an appliance; no document exists that would let it carry a health-efficacy
claim, so unlike a missing certification this one has no path back. Saying
"needs a document" here would be wrong and would send the merchant looking for
one.

One line was deliberately kept:

```text
✓ 第一次上镜   ← 「第一」是次序，不是排名，保留
```

Screening by substring is how a compliant line gets destroyed. Read what the
phrase asserts.

The compliance list ships with the plan: what was checked, what changed and to
what, that the efficacy line is out permanently rather than pending paperwork,
and that stock is still owed before any stock-based urgency line can be written.

## Stage 7: the one approval gate

Everything above is free. This is the only confirmation, and it covers the cards
and the spoken takes together — there is no second gate, because nothing here
depends on an earlier paid artifact.

The card freezes: every card to be rendered with the exact figures it will carry,
every line getting a spoken take, the ready voice ID with its language and
controls, each paid call with its current maximum price and stable request ID,
and the statement that card text is generated artwork whose figures are read back
against the approved schedule after rendering.

This run: three cards (the price anchor, the two selling points, the urgency
line) and two takes (the featured product's introduce step and its close), so
five paid calls with five request IDs.

## Stage 8-9: production and delivery

Cards render one call each through `beatra.images.generate`; takes synthesize
through `beatra.speech.synthesize`. The returned duration, size and MIME type are
read from each task rather than assumed.

The read-back caught one card: the price card rendered `89` correctly but the
regular price as `12.9`. That card was re-rendered under a new request ID; the
other two were not touched, and the takes were unaffected.

Delivered together: the schedule, the talk track, the twelve-category line
library, the compliance list, the three cards beside the figures they were
approved to carry, and the two takes with their actual durations.

## Where this run could have gone differently

**A held slot is planned.** Unlike the urgency step, which can switch to a
time-based line as this run did, a hold states its release time and quantity by
definition — there is no substitute. Hold the slot itself until the merchant
supplies the number, rather than announcing one.

**The lineup grows past eight products, or the session past six hours.** Both are
confirmed rather than absorbed — they change the schedule's shape, not just its
length.

**The host wants different wording.** Rewrite in their register before
production and keep the seven steps and twelve categories intact; those carry the
selling logic rather than the voice.

**A price changes after approval.** New paid work, new request ID, fresh
approval — the figure is baked into the artwork. A price that moves mid-session
is read from the schedule instead, and only cards need re-rendering.
