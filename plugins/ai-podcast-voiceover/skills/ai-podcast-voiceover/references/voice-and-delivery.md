# Voice, delivery, and recovery

## Freeze one host and a viable model path

Call `beatra.voices.list` to compare available previews, then freeze one
`status: ready` opaque `voice_id` for the show. Record its display name and
preview as a human-readable snapshot, its language information, and its
`compatible_models`. A display name or a prose voice preference is never a
valid synthesis value.

Before choosing a model, language, or price, call
`beatra.models.list` with `capability: "text_to_speech"`. For an explicit
model, require a current available card that appears in the frozen voice's
`compatible_models` and supports the requested BCP-47 language. For
`model: "auto"`, build the candidate set as
`models.list.auto.candidate_order ∩ frozen_voice.compatible_models ∩ live_available_cards`,
preserving `candidate_order`. The auto set must be nonempty. A live compatible card outside
`candidate_order` is explicit-only. Compare the requested primary BCP-47
language against each auto candidate's documented
`constraints.supported_languages`, using only documented aliases. If any auto
candidate lacks that language, present viable explicit choices and wait for the
user's selection rather than using `auto`.

Unless the user or show profile requires another supported setting, use
`model: "auto"`, `format: "mp3"`, `speed: 1.0`, `volume: 1.0`, `pitch: 0`, no
emotion, and no explicit sample rate. The current model card, not remembered
capabilities, decides every other control.

## Price two separate approvals

Planning, script work, voice previews, model discovery, and price estimation
are free. Each `beatra.speech.synthesize` request is billable. Count
`beatra_weighted_characters` as two per Han ideograph and one per other
character. The card's weighted-character total is only the integer this
program prints. Run it on a file that contains the frozen synthesis text and
nothing else, including no trailing newline that is not part of that text.
Do not hand-count the total.

```text
python3 -c "import sys;R=((0x3400,0x4DBF),(0x4E00,0x9FFF),(0xF900,0xFAFF),(0x20000,0x2EBEF),(0x30000,0x323AF));t=open(sys.argv[1],encoding='utf-8').read();print(sum(2 if any(a<=ord(c)<=b for a,b in R) else 1 for c in t))" script.txt
```

Without a runtime, report only the following line, with N replaced by the
estimate. Do not present that line as a counted total, and do not add a
second figure beside it.

```text
约 N 字（估算）
```

Apply the live card's `estimate_formula`, `unit_price_credits`, and `scale`
to that total. When `auto` can resolve to more than one applicable card,
show the current range or a clearly labelled upper bound.

Every paid card states:

- the exact text scope and its weighted-character total;
- the frozen `voice_id`, model decision or applicable `auto` range, and
  BCP-47 language;
- format, sample rate when set, speed, volume, pitch, and emotion when set;
- the live pricing basis, formula, unit price or range, and estimated credits;
- the exact number of paid requests that approval creates;
- what the user keeps if they stop here: the approved script, titles, notes,
  and any audio already delivered, or plainly nothing paid for yet on the first
  paid read; and
- that a short balance is relayed with the returned message and top-up link,
  and nothing is submitted until the user says they have topped up.

Wait for explicit approval of the current card. One approved card requires no
second confirmation for the exact requests it lists, but approval of a sample
never approves an episode.

The sample card synthesizes the opening plus the most demanding short passage
in the approved script, usually about 300 characters and chosen for names,
numbers, or foreign words. Require this small paid read for a first episode,
a voice change, a control change, or a language change. When an unchanged
profile re-validates, skip the sample and present the episode card directly.

An episode card covers one approved episode. When a script exceeds 50,000
characters, it covers every separately numbered part and states the resulting
call count before any synthesis begins.

## Submit and deliver one approved read

Use only the bundled `scripts/mcp_client.py` for remote Beatra operations. The
tool name is the CLI argument and JSON arguments are passed on standard input.
Do not configure or call a host Beatra Connector, and do not use REST/OpenAPI
as a fallback.

For each approved logical request, generate one opaque `client_request_id` and
submit `beatra.speech.synthesize` exactly once. The request explicitly carries
the frozen `voice`, exact approved text, and request identity, followed by the
frozen controls:

```json
{
  "voice": "<opaque voice_id>",
  "input": "<exact approved episode text>",
  "client_request_id": "<new opaque id>",
  "model": "auto",
  "language": "<BCP-47 tag>",
  "format": "mp3",
  "speed": 1.0,
  "volume": 1.0,
  "pitch": 0
}
```

Record the returned task ID immediately and poll only that task through
`beatra.tasks.get` until it is terminal. For every succeeded part, deliver the
returned audio URL, `artifact_id`, `duration_seconds`, actual MIME type, actual
sample rate when present, resolved model, usage, and returned billing facts. If the host
can play the returned audio, review pacing, pronunciation, and host fit; if it
cannot, state that listening review is still needed rather than inventing an
audition result. A target duration remains a review goal.

When the returned audio is the sample, measure the host's words per minute
from the returned sample: divide the sample text's character count by the
returned duration in minutes (`duration_seconds / 60`) and record that rate
as `words_per_minute` on the show profile. That character count is the length
of the sample text, not the weighted billing total. Later length estimates
use the measured rate. Until a sample returns, estimate length at about 225
characters per minute and label that figure as an estimate. If
`duration_seconds` is missing, leave `words_per_minute` unset.

One input within the limit produces one episode file. An over-limit episode is
delivered in the approved order as separate audio parts. Do not represent the
parts as synchronized, mixed, merged, or published.

## Recover without duplicate charges

Keep a local episode ledger with each request's frozen JSON, card approval,
`client_request_id`, response, task ID, and terminal result. The request ID is
local: `beatra.tasks.list` neither filters nor returns it.

When a task ID is missing, call `beatra.tasks.list` with
`capability: "text_to_speech"`, follow every `next_cursor` needed for the
relevant time window, then verify candidates with `beatra.tasks.get`. Compare
capability, time, returned input and settings, and task facts; never claim to
reconcile the local request ID from a remote task.

Only when task creation remains genuinely unknown after reconciliation may the
identical frozen JSON be replayed under the same request ID. A changed text,
voice, model, language, format, or control is a new paid request with a new
card, approval, and ID. A slow task, authorization issue, update failure, or
terminal failure never authorizes an automatic replacement. Cancel only when
the user asks, using `beatra.tasks.cancel` once and then polling the same task
to a confirmed terminal state.
