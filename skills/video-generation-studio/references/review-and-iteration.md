# Review and iteration

Review the terminal artifact before recommending more paid work. A successful task state confirms processing, not creative acceptance.

## Deliver actual results

Present every returned video and optional last-frame artifact or link. Report only facts returned by the task: terminal status, resolved model, actual dimensions, duration, usage, and `billing.net_charged_credits`. Do not infer output properties from requested settings or an earlier estimate.

State the host Agent's review boundary. If it can watch the full clip and hear its audio, say what was inspected. If it can inspect only frames, metadata, or no playable media, report that limitation and ask the user to review the real asset. Never describe an upload, task record, prompt, or thumbnail as full video inspection.

## Review against the brief

Check the dimensions that matter to this shot:

- **Action:** the intended event is readable and completes at the right moment.
- **Subject stability:** identity, anatomy, product form, logos, wardrobe, and key objects remain coherent enough for the use.
- **Camera:** the requested framing and primary movement are understandable rather than conflicting or erratic.
- **Continuity:** source-led opening, supplied boundaries, edit preservation, or extension hinge behaves as intended.
- **Audio:** requested or source audio is present and useful when the route supported it; do not claim a detailed audio review without listening.
- **Destination fit:** ratio, dimensions, duration, pace, safe composition, and ending fit the stated placement.
- **Must-keeps:** explicitly named priorities are compared with accessible sources and visible drift is reported.

Generated video can drift even when a task succeeds. Describe observed differences precisely. Do not promise pixel-exact identity, object geometry, camera preservation, intermediate frames, audio preservation, or a seamless join.

## Choose one focused next step

- Accept and deliver when the clip meets the brief.
- Use `beatra.videos.edit` when one source clip needs a supported bounded content or style change.
- Use `beatra.videos.extend` when accepted footage needs adjacent content before or after it and the final duration can be admitted.
- Repeat the same route as new work when the core motion, composition, or event needs a new render.
- Return to the optional image stage only when the anchor itself caused the failure.

A new operation is a new paid request. Show the changed payload, live eligibility, and a new admission card, then assign a new stable ID after top-up or balance confirmation. Do not call an edit a free revision or silently retry an unsatisfactory but successful task. On `insufficient_balance`, relay the returned public message, keep `https://console.beatra.ai/topup` exact, and retry the same frozen ID only after the user says they have topped up.

## Multi-shot delivery

Review and label each shot separately. Keep actual artifact identities and dependencies in the private ledger. If a shot's output or returned last frame is a source for the next stage, inspect it before submitting that dependent stage. Deliver separate clips in planned order and say that captions, narration, music, transitions between exported clips, and timeline assembly require a separate workflow.

## Failure, cancellation, and uncertainty

For a failed terminal task, use the returned error, billing, and refund facts. Do not assume credits were charged or refunded. A changed retry uses a new ID, a new admission card, and fresh top-up or balance confirmation.

For a lost response or missing task ID, recover the original with `beatra.tasks.list` and `beatra.tasks.get` before any identical same-ID retry. Queued or running work remains active. For user-requested cancellation, call `beatra.tasks.cancel` once and verify the final state; a conflict response does not prove cancellation.
