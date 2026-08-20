# Intent and routing

Choose the route from the requested result and the role of supplied media. One
logical stage uses exactly one of the seven operations below.

## The route matrix

| User's source and intent | Capability to inspect | Operation | Required source semantics |
| --- | --- | --- | --- |
| A creative brief needs a stronger production prompt before generation | `video_prompt_enhancement` | `beatra.videos.enhance_prompt` | A prompt, target duration and ratio; optional strict frames or ordered references |
| A new shot with no required visual source | `text_to_video` | `beatra.videos.generate` | A non-empty prompt; optional driving audio only when a live card admits it |
| One image must be the exact opening frame | `image_to_video` | `beatra.videos.animate` | One strict first-frame image, not a loose style reference |
| An image must be the exact end, optionally with an exact beginning | `frames_to_video` | `beatra.videos.interpolate` | One last frame; optional first frame |
| Ordered images, videos, or audio should guide a new clip | `reference_to_video` | `beatra.videos.generate_from_references` | Typed ordered references within the selected live card's limits |
| Existing footage must be altered | `video_edit` | `beatra.videos.edit` | One source video, an edit instruction, and any admitted references |
| New footage must appear immediately before or after one clip | `video_extend` | `beatra.videos.extend` | Exactly one source video, `before` or `after`, an instruction, and a final returned duration |

Prompt enhancement returns text only and never starts video generation. An
image that only suggests appearance is a reference; an image that must be
frame zero is the strict animate source. A required closing frame, with or
without an opening frame, uses interpolate rather than loose references.
Editing changes the source's content or style. Extension preserves the source
and adds adjacent footage; it is not a second edit name and never joins two
source videos.

## Classify a request

### New shot from words

Use text-to-video when the user's prompt can define the complete visual event. Develop one subject, one visible action, one primary camera move, setting, light, and pacing. Do not add an image stage merely because one might improve consistency; offer it only when identity, product geometry, composition, or a strict boundary is important enough to justify another paid checkpoint.

### Exact opening image

Use image-to-video when the supplied or approved still must be the first frame. Put appearance and composition in the image; direct motion, camera, and pacing in the video prompt. Omit `aspect_ratio` to preserve the source-derived ratio unless the user approves a new canvas and a live model supports it.

### Exact closing frame, with optional opening frame

Use frames-to-video when the closing frame must be exact. Add a first frame when
both boundaries matter. When both are present, check compatible ratio, subject
scale, viewpoint, light, and scene logic. Describe only the movement toward the
last frame. Do not promise an exact path between intermediate frames.

### Loose multimodal guidance

Use reference-to-video when sources should influence rather than dictate frame boundaries. Preserve their order and identify each reference's purpose in the prompt. Set `role` only if the selected typed model card advertises that exact top-level `reference_roles` value. Set `reference_voice` only when the selected model card supports it and the media passes current input admission. Read the current card for reference counts, supported kinds, combinations, and aggregate media duration.

### Edit existing footage

Use video edit for a bounded visual or stylistic change to one source video. State what changes and what remains important. `audio_setting: "origin"` requests source-audio preservation only when the live card supports it; it is not a guarantee that a generative edit leaves audio or camera motion exact. Duration may be derived from the input or otherwise constrained by the selected card.

### Extend existing footage

Use video extend to add content directly before or after exactly one primary source video. The required integer `duration` is the final returned-video duration, must exceed the trusted source duration, and must satisfy the selected card. For example, extending a trusted 6-second source to `duration: 10` asks for a 10-second result, not 10 additional seconds. Additional ordered video references are allowed only when the selected live card advertises them; they guide the single primary extension rather than creating a join operation.

## Multi-shot requests

Treat each shot as a separate output and select its route independently. A useful planning table records:

- shot number and purpose;
- exact source role and route;
- one visible action and one camera move;
- planned duration, ratio, resolution, and audio intent;
- optional still dependency;
- must-keeps and continuity anchors;
- paid request count and execution order.

If the user requests a sequence and accepts the entire frozen plan, one combined confirmation can authorize the listed stages. Every stage still receives its own stable request ID. Run dependencies in order and review each delivered artifact before it becomes a downstream source. If the artifact changes a later shot's payload or makes it unsuitable, pause and obtain approval for the revised stage.

Deliver the outputs as separate clips. A returned last-frame artifact can anchor a following animate request when the current model supports `return_last_frame`, but that improves visual continuity rather than assembling a timeline. Do not claim transitions, captions, narration, music, or one completed long video unless the corresponding delivered artifacts and separate assembly workflow actually exist.

## When a neighboring workflow fits better

Stay in this studio when route selection across text, images, references, edits, or extensions is useful. A single already-chosen image that only needs motion is simpler in an image-to-motion workflow. A portrait plus approved speech that needs voice-led facial motion belongs in a talking-avatar workflow. Captioning, speech synthesis, music, and editing separate clips into one timeline require their own supported workflows.
