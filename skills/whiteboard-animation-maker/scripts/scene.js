(function () {
  const root = document.getElementById("root");
  const ids = [...document.querySelectorAll("#root > .scene, #root > section.scene")]
    .map((el) => el.id)
    .filter(Boolean);
  const attrDur = parseFloat(root?.getAttribute("data-duration") || "20");
  const voice = window.__voice;
  const hasScenes = voice && Array.isArray(voice.scenes) && voice.scenes.length;
  const covers = hasScenes && ids.every((id) => voice.scenes.some((s) => s.id === id));
  const silent = !voice || voice.method === "silent" || voice.method === "silent-split";
  if (!hasScenes || (silent && ids.length && !covers)) {
    const n = Math.max(ids.length, 1);
    const each = attrDur / n;
    window.__voice = {
      duration: attrDur,
      method: "silent-split",
      scenes: (ids.length ? ids : ["s1"]).map((id, i) => ({
        id,
        start: +(i * each).toFixed(3),
        end: +((i + 1) * each).toFixed(3),
        text: "",
      })),
    };
  }
  const dur = window.__voice.duration || attrDur;
  if (root && dur) root.setAttribute("data-duration", String(dur));
})();

function sceneOf(id) {
  const scenes = (window.__voice && window.__voice.scenes) || [];
  return scenes.find((s) => s.id === id) || scenes[0] || { id, start: 0, end: 8 };
}

function sceneStart(id) {
  return sceneOf(id).start || 0;
}

function sceneHold(id) {
  const s = sceneOf(id);
  return Math.max((s.end || 0) - (s.start || 0), 0.4);
}

function sceneT(id, frac) {
  const f = Math.max(0, Math.min(1, frac));
  return sceneStart(id) + sceneHold(id) * f;
}

function sceneDraw(id, planned, fill) {
  const hold = sceneHold(id);
  const f = fill == null ? (hold < 2.2 ? 0.88 : 0.72) : fill;
  const budget = Math.max(hold * f, 0.18);
  return planned <= budget ? planned : budget;
}
