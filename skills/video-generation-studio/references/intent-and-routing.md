# Intent and routing

Choose the route from the role of the supplied media, not from a preferred model. One logical video stage uses exactly one of the six operations below.

## The route matrix

| User's source and intent | Capability to inspect | Operation | Required source semantics |
| --- | --- | --- | --- |
| A new shot with no usable still | `text_to_image` then `image_to_video` | `beatra.images.generate` then usually `beatra.videos.animate` | One keyframe first on its own card; video only after that delivery and the admission card. `beatra.videos.generate` (`text_to_video`) remains available only after those two stops |
| One image must be the exact opening frame | `image_to_video` | `beatra.videos.animate` | One strict first-frame image, not a loose style reference |
| Two images must be the exact beginning and end | `frames_to_video` | `beatra.videos.interpolate` | One first frame and one last frame |
| Ordered images, videos, or audio should guide a new clip | `reference_to_video` | `beatra.videos.generate_from_references` | Typed ordered references within the selected live card's limits |
| Existing footage must be altered | `video_edit` | `beatra.videos.edit` | One source video, an edit instruction, and any admitted references |
| New footage must appear immediately before or after one clip | `video_extend` | `beatra.videos.extend` | Exactly one source video, `before` or `after`, an instruction, and a final returned duration |

An image that only suggests appearance is a reference; an image that must be frame zero is the strict animate source. Two required boundary images use interpolate, not two loose references. Editing changes the source's content or style. Extension preserves the source and adds adjacent footage; it is not a second edit name and never joins two source videos.

## Classify a request

### New shot from words

When the user's prompt can define the complete visual event but no usable still exists, generate one keyframe with `beatra.images.generate` first. Develop one subject, one visible action, one primary camera move, setting, light, and pacing on that still, deliver it, then show the video admission card. After the still is accepted, continue on `beatra.videos.animate` unless the user named another video route. Do not skip the keyframe to go straight to `beatra.videos.generate`.

### Exact opening image

Use image-to-video when the supplied or approved still must be the first frame. Put appearance and composition in the image; direct motion, camera, and pacing in the video prompt. Omit `aspect_ratio` to preserve the source-derived ratio unless the user approves a new canvas and a live model supports it.

### Exact first and last frames

Use frames-to-video when both boundaries matter. Check that the two images have compatible ratio, subject scale, viewpoint, light, and scene logic. Describe only the movement between them. Do not promise an exact path between every intermediate frame.

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

If the user requests a sequence, freeze the listed stages and show each required keyframe card and each video admission card in order. One combined confirmation of the plan does not authorize a video generate, animate, interpolate, reference, edit, or extend call. Every stage still receives its own stable request ID. Run dependencies in order and review each delivered artifact before it becomes a downstream source. If the artifact changes a later shot's payload or makes it unsuitable, pause and show a new admission card for the revised stage.

Deliver the outputs as separate clips. A returned last-frame artifact can anchor a following animate request when the current model supports `return_last_frame`, but that improves visual continuity rather than assembling a timeline. Do not claim transitions, captions, narration, music, or one completed long video unless the corresponding delivered artifacts and separate assembly workflow actually exist.

## When a neighboring workflow fits better

Stay in this studio when route selection across text, images, references, edits, or extensions is useful. A single already-chosen image that only needs motion is simpler in an image-to-motion workflow. A portrait plus approved speech that needs voice-led facial motion belongs in a talking-avatar workflow. Captioning, speech synthesis, music, and editing separate clips into one timeline require their own supported workflows.
