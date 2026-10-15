# program mode

Elements enter with short fades/offsets. Cross-fade transitions run about
0.28s. No `stroke-dashoffset`, no stroke-drawn words.

```js
const tl = gsap.timeline({paused: true});
tl.from('#h1', {y: 18, opacity: 0, duration: 0.4, ease: 'power2.out'}, sceneT('s1', 0.02));
tl.from('#card1', {opacity: 0, y: 16, duration: 0.4, ease: 'power2.out'}, sceneT('s1', 0.12));
xfade('#s1', '#s2', sceneStart('s2'));
window.__timelines.main = tl;
```

Without voiceover, on-screen words are the reading track at roughly 56–64px.
With voiceover, narration carries reading and the screen keeps short words —
never copy the full caption onto the canvas. In-diagram Chinese labels run
44–48px in PingFang. Latin proper nouns use Georgia. Timeline positions map
to `script.txt`'s `# sN`. Voiceover follows
[voiceover and sync](voiceover-and-sync.md); canvas rules follow
[visual rules](visual-rules.md).
