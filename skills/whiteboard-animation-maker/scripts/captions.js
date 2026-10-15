function mountCaptions(timeline) {
  const tl = timeline || (window.__timelines && window.__timelines.main);
  const cues = (window.__voice && window.__voice.cues) || [];
  if (!tl || !cues.length) return;
  const root = document.getElementById("root");
  if (!root) return;
  let box = document.getElementById("caps");
  if (!box) {
    box = document.createElement("div");
    box.id = "caps";
    root.appendChild(box);
  }
  if (box.dataset.mounted === "1") return;
  box.dataset.mounted = "1";
  const fade = 0.1;
  cues.forEach((cue) => {
    const el = document.createElement("p");
    el.className = "cap";
    el.id = `cap-${cue.id}`;
    el.textContent = cue.text;
    el.style.opacity = "0";
    box.appendChild(el);
    tl.set(el, { opacity: 0 }, 0);
    tl.to(el, { opacity: 1, duration: fade, ease: "none" }, cue.start);
    const outAt = Math.max(cue.start + fade + 0.04, cue.end - fade);
    tl.to(el, { opacity: 0, duration: fade, ease: "none" }, outAt);
  });
}

if (typeof tl !== "undefined") mountCaptions(tl);
else if (window.__timelines && window.__timelines.main) mountCaptions(window.__timelines.main);
