# Intent and routing

Choose the route from the requested result and the role of supplied media. One
logical stage uses exactly one of the seven operations below.

## The route matrix

| User's source and intent | Capability to inspect | Operation | Required source semantics |
| --- | --- | --- | --- |
| Text-led with no usable still | `video_prompt_enhancement` or `text_to_image` | `beatra.videos.enhance_prompt` or one `beatra.images.generate` keyframe | Gift-sized first win on its own card; does not authorize any later video call |
| A new shot after that gift, still with no required visual source | `text_to_video` | `beatra.videos.generate` | A non-empty prompt; optional driving audio only when a live card admits it; video admission card required |
| One image must be the exact opening frame | `image_to_video` | `beatra.videos.animate` | One strict first-frame image, not a loose style reference; video admission card required |
| An image must be the exact end, optionally with an exact beginning | `frames_to_video` | `beatra.videos.interpolate` | One last frame; optional first frame; video admission card required |
| Ordered images, videos, or audio should guide a new clip | `reference_to_video` | `beatra.videos.generate_from_references` | Typed ordered references within the selected live card's limits; video admission card required |
| Existing footage must be altered | `video_edit` | `beatra.videos.edit` | One source video, an edit instruction, and any admitted references; video admission card required |
| New footage must appear immediately before or after one clip | `video_extend` | `beatra.videos.extend` | Exactly one source video, `before` or `after`, an instruction, and a final returned duration; video admission card required |

Prompt enhancement returns text only and never starts video generation. A
delivered keyframe is a still, not a video authorization. An image that only
suggests appearance is a reference; an image that must be frame zero is the
strict animate source. A required closing frame, with or without an opening
frame, uses interpolate rather than loose references. Editing changes the
source's content or style. Extension preserves the source and adds adjacent
footage; it is not a second edit name and never joins two source videos.

## Classify a request

### New shot from words

When the request is text-led and there is no usable still, the first paid stage is `beatra.videos.enhance_prompt` or one `beatra.images.generate` keyframe. Show that stage's own card, deliver the text or still, then show the video admission card before `beatra.videos.generate` or `beatra.videos.animate`. Develop one subject, one visible action, one primary camera move, setting, light, and pacing. Do not treat the gift delivery as video approval.

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

A text-led shot with no usable still still needs its gift-sized prompt or keyframe card first. One combined confirmation of the plan does not authorize any video stage. Each generate, animate, interpolate, reference, edit, or extend call still needs its own admission card and top-up or balance confirmation. Every stage still receives its own stable request ID. Run dependencies in order and review each delivered artifact before it becomes a downstream source. If the artifact changes a later shot's payload or makes it unsuitable, pause and show a new admission card for the revised stage.

Deliver the outputs as separate clips. A returned last-frame artifact can anchor a following animate request when the current model supports `return_last_frame`, but that improves visual continuity rather than assembling a timeline. Do not claim transitions, captions, narration, music, or one completed long video unless the corresponding delivered artifacts and separate assembly workflow actually exist.

## When a neighboring workflow fits better

Stay in this studio when route selection across text, images, references, edits, or extensions is useful. A single already-chosen image that only needs motion is simpler in an image-to-motion workflow. A portrait plus approved speech that needs voice-led facial motion belongs in a talking-avatar workflow. Captioning, speech synthesis, music, and editing separate clips into one timeline require their own supported workflows.
