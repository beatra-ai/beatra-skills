window.__timelines = window.__timelines || {};
const tl = gsap.timeline({paused: true});

function drawable(el) {
  return el && typeof el.getTotalLength === "function";
}

function darkFill(el) {
  const fill = (el.getAttribute("fill") || "").toLowerCase();
  return fill && fill !== "none" && fill !== "#fff" && fill !== "#ffffff" && fill !== "white";
}

function prepHidden(el) {
  if (!el) return;
  el.style.opacity = "0";
  if (!drawable(el) || el.getTotalLength() < 1) return;
  const len = el.getTotalLength();
  el.style.strokeDasharray = String(len);
  el.style.strokeDashoffset = String(len + 24);
  if (!el.getAttribute("data-cap")) {
    el.setAttribute("data-cap", el.getAttribute("stroke-linecap") || "round");
  }
  el.setAttribute("stroke-linecap", "butt");
  if (darkFill(el)) {
    if (!el.getAttribute("data-orig-fill")) el.setAttribute("data-orig-fill", el.getAttribute("fill"));
    el.setAttribute("fill", "none");
  }
}

function drawOne(el, dur, at) {
  if (!el || dur <= 0) return;
  tl.set(el, {opacity: 1}, at);
  if (!drawable(el) || el.getTotalLength() < 1) return;
  const cap = el.getAttribute("data-cap") || "round";
  const origFill = el.getAttribute("data-orig-fill");
  tl.to(el, {strokeDashoffset: 0, duration: dur, ease: "none"}, at);
  tl.set(el, {attr: {"stroke-linecap": cap}}, at + dur);
  if (origFill) tl.set(el, {attr: {fill: origFill}}, at + dur);
}

function kids(sel) {
  const root = document.querySelector(sel);
  if (!root) return [];
  return [...root.querySelectorAll("path,circle,ellipse,rect,line,polyline,polygon")];
}

function drawKids(sel, total, at) {
  const els = kids(sel);
  if (!els.length) return at + total;
  const lens = els.map((el) => {
    try { return Math.max(el.getTotalLength(), 10); } catch (e) { return 20; }
  });
  const sum = lens.reduce((a, b) => a + b, 0);
  let t = at;
  els.forEach((el, i) => {
    const d = total * lens[i] / sum;
    drawOne(el, d, t);
    t += d;
  });
  return t;
}

function wipe(sel, dur, at) {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.clipPath = "inset(0 100% 0 0)";
  tl.to(el, {clipPath: "inset(0 0% 0 0)", duration: dur, ease: "power1.inOut"}, at);
}

function fade(sel, dur, at) {
  const el = document.querySelector(sel);
  if (!el) return;
  el.style.opacity = "0";
  tl.to(el, {opacity: 1, duration: dur, ease: "power1.out"}, at);
}

function xfade(from, to, t) {
  tl.to(from, {opacity: 0, duration: 0.3, ease: "sine.inOut"}, t);
  tl.to(to, {opacity: 1, duration: 0.3, ease: "sine.inOut"}, t);
}

document.querySelectorAll("#root path, #root circle, #root ellipse, #root rect, #root line, #root polyline, #root polygon").forEach(prepHidden);
