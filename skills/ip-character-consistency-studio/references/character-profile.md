# Character profile and references

## Build a reusable visual brief

Create a reusable profile only when the user explicitly wants one and identifies
a project location they control. A concise `character-profile.json` or Markdown
card there may record the user-approved anchor artifact, reference order, face
and silhouette cues, hairstyle, costume, palette, signature props, style, and
preferred canvas. Otherwise return the artifact references and ordered roles;
do not imply that Beatra provides a persistent character workspace. A profile
belongs to the user's project rather than the shared Beatra credential directory.

Separate character identity from the current scene:

- **Identity:** face shape, age impression, silhouette, hair, costume, colour
  palette, recurring prop, visual style, and named must-keeps.
- **Scene:** pose, expression, camera, activity, setting, mood, destination,
  and any one-off outfit or prop change the user explicitly requests.

Keep a reference set concise and ordered. A useful 1–4 image set might put a
front portrait first, then a three-quarter view, full-body silhouette, and
costume or style reference. Name the role of every image in the prompt and
carry the user's must-keeps forward into each new request.

## Choose and preserve an anchor

For an original character, make the first paid result an anchor decision rather
than a large series. Review accessible outputs with the user, select one
accepted character visual, and use that accepted artifact as the strongest
reference for later scenes. When a small repair is wanted on the accepted
anchor, keep it as `images[0]` in an edit route. When a new pose or setting is
wanted, use the ordered reference route and describe the requested scene
separately from the identity traits.

After delivery, keep only user-approved images in the reusable profile. Note
visible traits that should remain central in the next request, then use the
smallest new scene or focused adjustment that completes the user's next goal.
The profile is a reusable brief, not a guarantee that later generations will be
identical; inspect and report visible drift in every returned result.
