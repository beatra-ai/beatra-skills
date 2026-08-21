# Voice casting and delivery

## Resolve an exact current voice

Always call `beatra.voices.list`, even when the user or conversation already
contains a `voice_id`. Match that opaque ID exactly and save its current
`status`, `language`, `languages_supported`, and `compatible_models`. If the
ID is absent or not `ready`, do not submit; offer another returned current ready
voice or stop. Use `language`, `gender`, `category`, or `query` only when the
user's preferences justify the filter. A returned voice may
contain `display_name`, `category`, `language`, `languages_supported`,
`gender`, `age`, `accent`, `use_case`, `preview_url`,
`compatible_models`, `status`, and `created_at`.

Recommend only ready candidates. Keep the opaque `voice_id` exactly; a display
name, description, or previously remembered voice fact is not a substitute for
the fresh exact-ID lookup. Offer
`preview_url` only when it is returned, and never synthesize a paid audition.

## Build the possible auto set

Call `beatra.models.list` with:

```json
{"capability":"text_to_speech"}
```

Define the possible auto set as the ordered intersection of
`auto.candidate_order` and the exact current voice's `compatible_models`, using
only currently available model cards. Separately build an explicit pool from
every live available card in `compatible_models`. A compatible card outside
`candidate_order` is explicit-only and must never be mixed into the auto set.
Do not infer an auto result before admission.

Validate a supplied language against the BCP-47 shape used by the current
contract: a 2-to-8-letter primary tag followed by optional 1-to-8-character
alphanumeric subtags. Lowercase the primary tag and normalize the documented
aliases `nb` to `no` and `tl` to `fil`; normalize catalog values the same way,
so `yue-HK` compares as `yue`.

When the user supplied a valid BCP-47 language:

1. Confirm either the returned `voice.language` or one entry in
   `voice.languages_supported` has the same normalized primary tag.
2. Read `constraints.supported_languages` from every model in the possible
   auto set and compare their normalized primary tags.
3. Keep `model: "auto"` only when every candidate supports the target.
4. If the auto set is empty or any candidate fails, select one qualifying card
   from the full live voice-compatible explicit pool and obtain confirmation.
5. If the explicit pool has no qualifying card, propose another current ready
   voice, let the user voluntarily choose another supported target, or make no
   submission.

If no language was supplied, omit `language`. Do not ask for one only to make
the catalog decision. Keep a nonempty voice-first auto set; if it is empty,
propose one live card from the explicit pool. If that pool is also empty, offer
another current ready voice or no submission. Do not treat language as an
undocumented auto selection input.

## Controls and approved text

The text must be supplied or shown and approved. Preserve names, claims,
pronunciations, and meaning. Convert written constructions into speakable
phrasing only with approval when the edit is material. Use punctuation to
express breaths and pauses.

Current synthesis controls are `format` (`mp3`, `wav`, `flac`, `opus`, or
`pcm`), optional `sample_rate`, `speed` from 0.5 to 2.0, `volume` greater
than 0 and at most 10, `pitch` from -1 to 1 (normalized: 0 keeps the
voice's original pitch; use decimals like 0.25 for subtle tuning), and
optional `emotion` from the live supported values. Keep defaults unless the
destination or user requires a change.

## Calculate the current estimate

Count `beatra_weighted_characters` exactly: each Han ideograph weighs 2 and
every other character weighs 1. For every applicable model, use the card's
`estimate_formula`:

```text
(unit_price_credits * billable_quantity) / scale
```

Preserve its current `meter`, `unit`, `billing_basis`,
`unit_price_credits`, and `scale`. An explicit model produces one estimate.
Auto produces one exact estimate only if all possible candidates have the same
result; otherwise show the minimum and maximum. Never quote a remembered price
or raw character count.

## Freeze and submit one request

The production card contains the exact approved text, exact current `voice_id`,
language if supplied, model or honest auto set, format and controls, weighted
quantity, live formula and estimate, one paid call, and delivery position.
An explicit current “generate” or “make it” that fully covers this frozen card
is approval; do not ask again. A price question, comparison, preparation
request, or unfrozen batch is not. After approval, create one new local
`client_request_id` and send exactly:

```json
{
  "voice": "voice_...",
  "input": "The exact approved text.",
  "model": "auto",
  "format": "mp3",
  "speed": 1.0,
  "volume": 1.0,
  "pitch": 0,
  "client_request_id": "local-opaque-id"
}
```

Include `language`, `emotion`, or `sample_rate` only when frozen in the card.
Pass this JSON on standard input to:

```text
python3 scripts/mcp_client.py call beatra.speech.synthesize
```

Submit once and poll the returned `task_id` with `beatra.tasks.get` until a
terminal state. Do not create an alternate take or automatic retry.

## Review and deliver returned facts

A successful `SpeechOutput` contains:

- `type: "text_to_speech"`, concrete `model`, and `voice_id`;
- `audio.url`, `audio.artifact_id`, `audio.duration_seconds`,
  `audio.mime_type`, `audio.size_bytes`, and optional `audio.sample_rate`;
- `characters` and optional `subtitles`.

Return those facts with the task's actual status, resolved model, usage, and
billing when present. Compare returned duration with a target without claiming
exact timing. Ask the user to listen for readings, pauses, pace, tone, and
destination fit; do not claim to have heard audio unless it was actually
available for review.

A revision changes the production card, needs a new approval and request
identity, and re-synthesizes only the approved affected segment. Keep every
accepted artifact unchanged.
