# Planning the images

The pictures are planned from the finished writing, which is the whole advantage of producing both in one pass: every image knows what its paragraph says.

## The cover

WeChat Official Account covers are wide — 2.35:1 — and they appear small in a subscription feed. Two consequences.

2.35:1 is how the ratio is discussed with the user; when the image is actually requested it is written as the aspect `47:20` or as explicit dimensions such as 1880 × 800, per [article workflow](workflow.md).

**Composition.** One clear focal subject, positioned off-centre so the crop that some surfaces apply does not decapitate it. Heavy negative space reads as empty at feed size.

**Text.** A cover with no text usually outperforms one with mangled text, and rendered text is where generated images most often fail. When the user wants a headline on the cover, keep it to four to six characters or two to three words, and read it back after rendering. Offer the text-free version as the alternative rather than as a fallback after a failure.

## In-body images

Three by default. Each one is placed against a specific paragraph and carries a specific job.

| Job | Where it goes | What it does |
| --- | --- | --- |
| The situation | After the open | Puts the reader in the scene the article describes |
| The mechanism | Inside the substance | Shows the thing the paragraph is explaining |
| The result | At the bring-it-home | Shows what changes |

An image that is not answering a paragraph is decoration, and decoration in a long article costs scroll depth without buying anything. If a fourth image cannot name its paragraph and its job, it does not get made.

Pick one in-body ratio for the whole set — 16:9 or 3:2 — and state it once above the plan table beside the shared look. Both sit naturally in the reading column; mixing them inside one article is the most visible way a set drifts.

## Hold one look

A set that drifts in style reads as stock images pasted into a document. Fix the look once, before writing any prompt, and repeat it in every prompt:

- one palette, stated as specific colours rather than a mood;
- one light direction and quality;
- one level of abstraction — either all of them are literal scenes or all of them are conceptual, never mixed;
- one distance from the subject, unless a specific image's job is to change it.

Write the look as a sentence, and put that same sentence in every prompt in the set. This is the single highest-leverage thing in the image plan.

When the user has brand references, upload one and use it as the anchor for the look rather than describing their brand from memory.

## Writing the prompts

Build each prompt from three parts, in this order: the subject and what is happening, the composition and framing, then the shared look sentence.

Keep the prompt about what is visible. A prompt asking for "a sense of trust" produces nothing in particular; a prompt asking for the specific scene that would make a reader feel that produces an image.

Keep text out of in-body image prompts entirely. In-body images carry no wording — the paragraph beside them is the text.

## The plan the user approves

One table, before anything is rendered.

| Column | Contents |
| --- | --- |
| # | Cover, then in-body images in reading order |
| Placement | The paragraph it follows, quoted by its first few words |
| Job | Situation, mechanism, result, or the cover |
| What is in it | The visible subject and composition |
| Ratio | 2.35:1 for the cover, 16:9 or 3:2 in body |

Show the shared look sentence once, above the table. When the user changes it, every prompt changes with it — which is why it is settled before rendering rather than after.
