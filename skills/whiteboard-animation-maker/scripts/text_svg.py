#!/usr/bin/env python3
"""Build stroke-drawable SVG groups for on-screen words.

Chinese characters come from hanzi-writer-data medians (the verified hanzi
path, unchanged). ASCII letters, digits, and punctuation come from the
bundled Hershey simplex stroke data in assets/hershey-simplex.json, driven
through the same per-char translate/scale/stroke-width math and the same
drawKids stroke-dashoffset animation.

Missing characters fail the build. Do not fall back to system fonts; for a
word this tool cannot cover, draw it with a Georgia <text> wipe instead.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parents[1]
VISUAL_STROKE = 3.2
DEFAULT_GAP = 4.0
# Hershey simplex grid: cap height 21 units, baseline 0, y-up, x centered.
LATIN_UNITS = 21.0
CJK_PUNCT = "，、。"


def data_dir() -> Path:
    nm = SKILL_ROOT / "node_modules" / "hanzi-writer-data"
    if not nm.exists():
        raise SystemExit(
            f"hanzi-writer-data missing. Run npm install in {SKILL_ROOT}"
        )
    return nm


def latin_glyphs() -> dict:
    path = SKILL_ROOT / "assets" / "hershey-simplex.json"
    if not path.is_file():
        raise SystemExit(f"latin stroke data missing: {path}")
    return json.loads(path.read_text(encoding="utf-8"))["glyphs"]


def stroke_width(size: float, visual: float = VISUAL_STROKE, units: float = 1024.0) -> float:
    return visual * units / size


def load_char(ch: str, root: Path) -> dict:
    path = root / f"{ch}.json"
    if not path.exists():
        if ord(ch) < 0x3400:
            raise SystemExit(
                f"no stroke data for {ch!r}; use a Georgia <text> wipe for this word"
            )
        raise SystemExit(f"missing hanzi data for {ch!r} ({path})")
    return json.loads(path.read_text(encoding="utf-8"))


def median_d(median: list) -> str:
    parts = []
    for i, pt in enumerate(median):
        parts.append(f"{'M' if i == 0 else 'L'}{pt[0]:.1f},{pt[1]:.1f}")
    return " ".join(parts)


def text_line(
    text: str,
    gid: str,
    cx: float,
    cy: float,
    size: float,
    *,
    gap: float = DEFAULT_GAP,
    visual: float = VISUAL_STROKE,
    root: Path | None = None,
) -> str:
    root = root or data_dir()
    latin = latin_glyphs()
    chars = list(text)
    latin_scale = size / LATIN_UNITS
    # Per-character advance: hanzi cells span the full size box; latin
    # glyphs advance by their own width. This keeps a pure-Chinese word's
    # layout identical to the original hanzi-only emission.
    widths = []
    for ch in chars:
        if ch in CJK_PUNCT or not ch.isascii():
            widths.append(size)
        else:
            glyph = latin.get(ch)
            if glyph is None:
                raise SystemExit(
                    f"no stroke data for {ch!r}; use a Georgia <text> wipe for this word"
                )
            widths.append(glyph["width"] * latin_scale)
    width = sum(widths) + max(0, len(chars) - 1) * gap
    x0 = cx - width / 2
    y0 = cy - size / 2
    s = size / 1024.0
    chunks = [f'<g class="text" id="{gid}">']
    x = x0
    for ch, w in zip(chars, widths):
        if ch in CJK_PUNCT:
            chunks.append(
                f'<circle cx="{x + size / 2:.1f}" cy="{cy + size * 0.18:.1f}" '
                f'r="{max(2.5, size * 0.06):.1f}" fill="#111" stroke="none"/>'
            )
        elif ch.isascii():
            glyph = latin[ch]
            sw = stroke_width(size, visual, LATIN_UNITS)
            paths = "".join(f'<path d="{median_d(stroke)}"/>' for stroke in glyph["strokes"])
            chunks.append(
                f'<g transform="translate({x + w / 2:.1f} {y0 + size:.1f}) '
                f'scale({latin_scale:.5f} {-latin_scale:.5f})" '
                f'fill="none" stroke="#111" stroke-width="{sw:.1f}" '
                f'stroke-linecap="round" stroke-linejoin="round">{paths}</g>'
            )
        else:
            data = load_char(ch, root)
            sw = stroke_width(size, visual)
            paths = "".join(f'<path d="{median_d(m)}"/>' for m in data["medians"])
            chunks.append(
                f'<g transform="translate({x:.1f} {y0 + size:.1f}) scale({s:.5f} {-s:.5f})" '
                f'fill="none" stroke="#111" stroke-width="{sw:.1f}" '
                f'stroke-linecap="round" stroke-linejoin="round">{paths}</g>'
            )
        x += w + gap
    chunks.append("</g>")
    return "\n".join(chunks)


def main() -> int:
    p = argparse.ArgumentParser(description="Emit a stroke-drawable SVG group for a word (Chinese and/or ASCII)")
    p.add_argument("text")
    p.add_argument("--id", required=True)
    p.add_argument("--cx", type=float, required=True)
    p.add_argument("--cy", type=float, required=True)
    p.add_argument("--size", type=float, required=True)
    p.add_argument("--gap", type=float, default=DEFAULT_GAP)
    args = p.parse_args()
    print(text_line(args.text, args.id, args.cx, args.cy, args.size, gap=args.gap))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
