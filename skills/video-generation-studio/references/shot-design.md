# Shot design

Turn the user's outcome into one economical shot brief before selecting paid settings. Reuse everything already known and ask only about choices that materially change the route, canvas, cost, or result.

## Write one readable event

A strong short-video direction includes:

1. **Subject and setting** — who or what is present, where, and the stable visual facts.
2. **Visible action** — one primary event with a clear beginning and change.
3. **Camera** — one main framing and movement, such as locked-off, slow push-in, pan, tilt, orbit, tracking, or handheld drift.
4. **Pacing** — restrained, brisk, escalating, floating, or another concrete rhythm.
5. **Light and finish** — only details that support the result rather than an adjective pile.
6. **Audio intent** — generated audio, source audio, a supplied guide, or no requested audio, subject to the live card.
7. **Must-keeps** — identity, product form, label, logo, wardrobe, composition, background, or source timing that should guide both direction and review.

Prefer temporal language: what happens first, what changes, where attention lands, and how the shot ends. Avoid contradictory camera instructions or several equally important actions in a few seconds.

## Fit the destination

Use an explicitly requested aspect ratio only when a live eligible model card accepts it. When a source determines the canvas, preserve its ratio by omitting `aspect_ratio` unless the user approves a change. Do not silently crop, stretch, or convert a source-led shot to another frame.

Choose duration and resolution from current eligible model cards. Write the shortest integer duration that card admits unless the user named a longer one. Duration is integer seconds; do not omit it on `model: "auto"` and do not hard-code 8, 10, or 15 when a shorter admitted integer exists. Video extension requires a concrete integer final duration greater than the trusted source. Use the lowest admitted resolution unless the user named a higher tier. Omit other optional controls unless the user or shot needs them.

For ads and social clips, identify the destination and the one job of the shot: hook, demonstrate, reveal, transition, establish, or close. This shapes the direction but does not imply captions, layout, timeline editing, or delivery to a platform.

## Direct source-led shots

For animation, the image already owns appearance and opening composition. Describe what starts moving, what stays quiet, the camera path, pacing, and ending. Treat named details as must-keeps and inspect for drift rather than promising exact preservation.

For interpolation, first make the two boundaries compatible. Use the prompt for the transition path and timing. Do not instruct the model to redesign either boundary.

For reference-guided generation, number each input and state its role in the desired result. Ordered references are guidance rather than exact frame promises.

For editing, split the direction into the requested change and preservation priorities. Prefer one bounded change when possible.

For extension, describe the newly added action and how it enters or exits the trusted source. Keep the existing source's ending or beginning as the continuity hinge.

## Honest preservation

Generated motion can drift. Carry the user's protected details into the prompt and the delivery review. Do not require the user to weaken a viable request in advance, and do not guarantee pixel-exact identity, labels, camera geometry, intermediate motion, audio, or continuity. If the result drifts, identify where and recommend the smallest route-specific change.

## Confirm high-impact choices

Seek a decision before:

- changing a source-derived canvas or cropping a source;
- replacing a supplied asset or treating a strict frame as a loose reference;
- changing a named model or unsupported control;
- adding a separate paid image stage;
- changing the number of paid clips or stages;
- altering a frozen payload after approval.

Shot planning and critique are free. A request to make the clip is not approval. Video confirmation is the admission card plus top-up or sufficient-credit confirmation, immediately before the frozen paid video stage. A keyframe image card is a separate earlier stop and does not authorize video.
