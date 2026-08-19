---
name: "ai-image-realism"
description: "Improve AI image realism without starting over. This focused AI image editor and humanizer targets visible AI image artifacts—plastic skin, malformed hands or faces, extra fingers, repeated textures, and inconsistent lighting—with focused AI image retouching through a local repair or natural whole-image refinement. Use it to make AI portraits, product images, marketing graphics, and social covers look more realistic, remove the obvious AI look, fix AI hands and extra fingers, or refine product imagery, while aiming to keep identity, product shape, brand details, and composition recognizable where possible."
---

# AI Image Realism & Artifact Fixer

Repair the most visible artificial-looking defect in an existing image while keeping the parts the user already accepts recognizable where possible. The host Agent must be able to inspect the source image; uploading a file is transport, not image diagnosis, and this Skill has no separate Beatra image-analysis call.

## Best-fit scenes and preservation priorities

Use this workflow to improve an existing portrait, product image, marketing visual, or social cover with plastic skin, malformed hands or faces, repeated textures, inconsistent light, or another visible generated-image artifact. Start from the user's selected image and repair the highest-impact issue without unnecessarily changing the rest.

Treat text, logo geometry, identity, product shape, packaging, and composition named by the user as must-keep priorities. Prefer the smallest local repair that can address the issue, then compare the result with the source and report any visible drift. Use a reinterpretation route only when the user asks for a new scene or composition; never silently replace an edit request with a newly generated image.

## Inputs and defaults

The only hard input is one existing image the host Agent can inspect. Reuse the user's destination, named defect, must-keep details, and accepted composition when already known. Ask only for missing information that changes the repair route or paid payload.

Unless the user asks otherwise:

- fix one highest-impact problem cluster per pass;
- use `model=auto` and `count=1`;
- preserve the source aspect ratio for edits;
- avoid changing unrelated areas;
- use one stable `client_request_id` for one logical paid request.

## Golden path

1. **Inspect the visible source.** Compare anatomy, skin and materials, light, background repetition, composition, text, branding, and destination fit. If the host cannot inspect the image, request an accessible file and stop.
2. **Diagnose one priority problem.** Use [diagnosis and routing](references/diagnosis-and-routing.md) when several defects compete or preservation constraints conflict.
3. **Choose the smallest useful repair.**
   - Use `beatra.images.edit` with one or two normalized regions for bounded local defects.
   - Use `beatra.images.edit` without `edit_regions` for image-wide texture, skin, sharpness, or light.
   - Use `beatra.images.transform` for an explicitly requested new scene or composition. Reuse the user's stated must-keeps, set the intended canvas explicitly, and ask only when missing information would materially change the result or paid payload; never inherit its 16:9 default by accident.
4. **Preview and confirm.** Show the problem to fix, route, canvas, must-keeps, output count, and one paid-execution boundary. Follow [repair recipes](references/repair-recipes.md) for the exact payload. Query `beatra.models.list` only when a live capability, availability, count, or price decision matters.
5. **Upload and execute once.** Use the bundled `scripts/mcp_client.py` to upload a local file and call the selected MCP tool. Do not configure or call a host Beatra Connector and do not use REST/OpenAPI as a fallback. Create the request identifier only after the payload is final, then submit once.
6. **Poll and review.** Follow the same task with `beatra.tasks.get`; slow polling is never a reason to resubmit. Inspect the returned result when the host can view it. If it cannot, say visual review is incomplete instead of inventing a conclusion.
7. **Deliver or recover.** Present every returned artifact or link, actual dimensions, final `billing.net_charged_credits`, task ID, whether the priority defect improved, and any must-keep drift. Use [review and recovery](references/review-and-recovery.md) for one focused unexecuted revision. A changed payload requires a new identifier and fresh confirmation.

## Decisions that require confirmation

Confirm before a paid call, before changing the composition or canvas, before accepting weaker preservation, before increasing output count, or before replacing `model=auto` with a chosen paid model. If a task remains non-terminal after the bounded polling window, return its task ID and current state for later recovery rather than creating another task.

## References by task

- Multiple visible problems, uncertain route, or preservation conflicts: [diagnosis and routing](references/diagnosis-and-routing.md)
- Edit regions, transform canvas, prompts, and payload construction: [repair recipes](references/repair-recipes.md)
- Result comparison, drift, recovery, or one revision: [review and recovery](references/review-and-recovery.md)
- First installation or expired authorization: [installation and authentication](references/installation-and-auth.md)
- Bundled MCP Client diagnostics: [Bundled MCP Client diagnostics](references/mcp-connection.md)
- Lost, slow, or cancellable tasks: [tasks and results](references/tasks-and-results.md)
- Balance, validation, uncertain submissions, and errors: [billing, errors, and recovery](references/billing-errors-and-recovery.md)
- Disconnecting the installation: [uninstall and disconnect](references/uninstall-and-disconnect.md)
- Official sources, integrity checks, recovery, and update controls: [automatic updates and safety](references/automatic-updates-and-safety.md)

## Runtime and safe automatic updates

Before ordinary Beatra commands, the bundled client may silently check this installed package channel for a newer version, at most once every 24 hours. When a higher version is available, it installs the update automatically without separate confirmation. It downloads only from the fixed official Beatra discovery and immutable CDN paths, and replaces only files owned by this package after verifying the archive, manifest, and every packaged file. It rejects redirects, downgrades, unsafe archives, unexpected destinations, and a different package, channel, or locale. If any update or recovery step fails, the current installation remains usable and the user's original command continues.

The setting persists for this installation:

```text
python3 scripts/mcp_client.py update --auto off
python3 scripts/mcp_client.py update --auto on
python3 scripts/mcp_client.py update --check
```

Use the first command to disable silent checks, the second to restore them, and the third to inspect the official available version without changing files. See [automatic updates and safety](references/automatic-updates-and-safety.md) for the complete behavior.
