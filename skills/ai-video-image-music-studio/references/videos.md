# Videos

Choose exactly one video action from the transformation the user wants.

- Use `beatra.videos.generate` for text-to-video without a required visual source.
- Use `beatra.videos.enhance_prompt` to create a text-only production prompt from
  a creative brief and optional multimodal context before a separate video request.
- Use `beatra.videos.animate` when one image must be the opening frame.
- Use `beatra.videos.interpolate` when a strict last image defines the destination;
  add a strict first image when both boundaries matter.
- Use `beatra.videos.generate_from_references` when ordered image, video, or audio media
  should guide a new video without being a strict endpoint.
- Use `beatra.videos.edit` to change an existing video's content or style.
- Use `beatra.videos.extend` to generate footage immediately before or after one source
  clip.

These operations are not interchangeable. Editing transforms source content; extension
adds footage immediately before or after one source clip; reference generation uses media
as guidance. A strict opening
image belongs in `animate`, and a required strict last image belongs in `interpolate`.

After choosing the action, load [video controls](video-controls.md). Load
[video recipes](video-recipes.md) when constructing the payload. Call
`beatra.models.list` for the chosen capability whenever a model or non-universal control
matters.

Upload local media before generation. Omit `model` unless the user explicitly requests a
concrete model. A concrete model is never silently replaced. Assemble the final arguments,
submit the billable tool once, and poll with `beatra.tasks.get`. Any change to the model,
media, instruction, prompt, resolution, ratio, duration, or optional control creates a new
logical request and requires a new `client_request_id`.

When a create call is rejected, preserve the complete structured error. Use `param` to
locate the field and `details.candidate_failures[].code` to distinguish resolution,
duration, aspect-ratio, media, route, or optional-control incompatibility. Change the
request before retrying a non-retryable error.

When polling ends with `status: "failed"`, preserve the complete `Task.error`, including
`code`, `type`, `message`, `retryable`, `param`, `details`, and `request_id`.
`model_output_invalid` means the generated artifact could not be downloaded after three
attempts; report the failure because there is no result artifact to deliver.
