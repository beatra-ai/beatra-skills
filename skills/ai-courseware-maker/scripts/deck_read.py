#!/usr/bin/env python3
"""Read a slide deck the teacher already has.

slides: the text and speaker notes of every slide of a .pptx, in show order.
pages:  one image per slide, from a folder of slide images exported by
        PowerPoint or WPS, or from a PDF when PyMuPDF is installed.

Standard library only; this script never starts another program.
"""

from __future__ import annotations

import argparse
import json
import posixpath
import re
import shutil
import sys
import zipfile
import zlib
from pathlib import Path
from xml.etree import ElementTree

NS = {
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "rel": "http://schemas.openxmlformats.org/package/2006/relationships",
}
NOTES_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/notesSlide"
TITLE_TYPES = {"title", "ctrTitle"}
IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg"}


class DeckError(Exception):
    """A deck the teacher should fix or export another way."""


def _xml(archive: zipfile.ZipFile, name: str) -> ElementTree.Element:
    try:
        return ElementTree.fromstring(archive.read(name))
    except KeyError as exc:
        raise DeckError(f"{name} is missing; the file is not a complete .pptx") from exc
    except (ElementTree.ParseError, zipfile.BadZipFile, zlib.error, RuntimeError, OSError) as exc:
        raise DeckError(f"{name} cannot be read; the file is damaged, save it as .pptx again") from exc


def _relationships(archive: zipfile.ZipFile, part: str) -> dict[str, tuple[str, str]]:
    folder, name = posixpath.split(part)
    rels_name = posixpath.join(folder, "_rels", name + ".rels")
    if rels_name not in archive.namelist():
        return {}
    found = {}
    for rel in _xml(archive, rels_name).findall("rel:Relationship", NS):
        target = posixpath.normpath(posixpath.join(folder, rel.get("Target", "")))
        found[rel.get("Id", "")] = (rel.get("Type", ""), target)
    return found


def _paragraphs(element: ElementTree.Element) -> list[str]:
    lines = []
    for paragraph in element.iter("{%s}p" % NS["a"]):
        text = "".join(run.text or "" for run in paragraph.iter("{%s}t" % NS["a"])).strip()
        if text:
            lines.append(text)
    return lines


def _placeholder(shape: ElementTree.Element) -> str | None:
    placeholder = shape.find("p:nvSpPr/p:nvPr/p:ph", NS)
    return None if placeholder is None else placeholder.get("type", "body")


def _slide_text(root: ElementTree.Element) -> tuple[str, list[str]]:
    title, lines = "", []
    for shape in root.iter("{%s}sp" % NS["p"]):
        paragraphs = _paragraphs(shape)
        if _placeholder(shape) in TITLE_TYPES and not title:
            title = " ".join(paragraphs)
        else:
            lines.extend(paragraphs)
    for frame in root.iter("{%s}graphicFrame" % NS["p"]):
        lines.extend(_paragraphs(frame))
    return title, lines


def _notes(root: ElementTree.Element) -> str:
    lines = []
    for shape in root.iter("{%s}sp" % NS["p"]):
        if _placeholder(shape) == "body":
            lines.extend(_paragraphs(shape))
    return "\n".join(lines)


def read_slides(path: Path) -> list[dict]:
    try:
        archive = zipfile.ZipFile(path)
    except (zipfile.BadZipFile, OSError) as exc:
        raise DeckError(f"{path.name} is not a .pptx file; save it as .pptx from PowerPoint or WPS") from exc
    with archive:
        presentation = _xml(archive, "ppt/presentation.xml")
        relationships = _relationships(archive, "ppt/presentation.xml")
        slides = []
        slide_ids = presentation.findall("p:sldIdLst/p:sldId", NS)
        for index, slide_id in enumerate(slide_ids, start=1):
            rel_id = slide_id.get("{%s}id" % NS["r"], "")
            if rel_id not in relationships:
                raise DeckError(f"slide {index} points to a missing part; open and save the deck again")
            part = relationships[rel_id][1]
            title, text = _slide_text(_xml(archive, part))
            notes = ""
            for kind, target in _relationships(archive, part).values():
                if kind == NOTES_REL:
                    notes = _notes(_xml(archive, target))
            slides.append({"index": index, "title": title, "text": text, "notes": notes})
        return slides


def _natural_key(name: str) -> list:
    return [int(part) if part.isdigit() else part.lower() for part in re.split(r"(\d+)", name)]


def export_pages(source: Path, out_dir: Path, width: int = 1920) -> list[str]:
    if out_dir.is_dir() and any(out_dir.glob("page-*")):
        raise DeckError(f"{out_dir} already has pages; choose an empty folder")
    out_dir.mkdir(parents=True, exist_ok=True)
    written = []
    if source.is_dir():
        images = sorted(
            (path for path in source.iterdir() if path.suffix.lower() in IMAGE_SUFFIXES),
            key=lambda path: _natural_key(path.name),
        )
        if not images:
            raise DeckError(f"no .png or .jpg slide images in {source}")
        for number, image in enumerate(images, start=1):
            suffix = ".png" if image.suffix.lower() == ".png" else ".jpg"
            target = out_dir / f"page-{number:03d}{suffix}"
            shutil.copyfile(image, target)
            written.append(target.name)
        return written
    if source.suffix.lower() == ".pdf":
        try:
            import pymupdf as fitz  # PyMuPDF 1.24+
        except ImportError:
            fitz = None
        try:
            if fitz is None:
                import fitz  # older PyMuPDF releases
        except ImportError as exc:
            raise DeckError(
                "PDF pages need PyMuPDF: python3 -m pip install --user pymupdf "
                "(or export the slides as PNG images instead)"
            ) from exc
        with fitz.open(source) as document:
            for number, page in enumerate(document, start=1):
                zoom = width / page.rect.width
                target = out_dir / f"page-{number:03d}.png"
                page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False).save(target)
                written.append(target.name)
        return written
    raise DeckError(f"{source.name}: give a folder of exported slide images or a PDF")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="deck_read.py")
    commands = parser.add_subparsers(dest="command", required=True)
    slides = commands.add_parser("slides", help="text and notes of every slide")
    slides.add_argument("deck", type=Path)
    slides.add_argument("--out", type=Path, required=True)
    pages = commands.add_parser("pages", help="one image per slide")
    pages.add_argument("source", type=Path)
    pages.add_argument("--out-dir", type=Path, required=True)
    pages.add_argument("--width", type=int, default=1920)
    args = parser.parse_args(argv)
    try:
        if args.command == "slides":
            found = read_slides(args.deck)
            args.out.parent.mkdir(parents=True, exist_ok=True)
            args.out.write_text(
                json.dumps({"source": args.deck.name, "slides": found}, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(json.dumps({"slides": len(found), "out": str(args.out)}, ensure_ascii=False))
        else:
            made = export_pages(args.source, args.out_dir, args.width)
            print(json.dumps({"pages": len(made), "out_dir": str(args.out_dir)}, ensure_ascii=False))
    except (DeckError, OSError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    sys.exit(main())
