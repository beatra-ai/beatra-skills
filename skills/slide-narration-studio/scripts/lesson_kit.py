#!/usr/bin/env python3
"""Course project, narration requests, subtitles, and render plans for lesson videos.

The course project, course.json, holds every lesson's pages: the slide image,
the approved script, and the narration recorded for it. This script never
starts another program; lesson_run.mjs runs the ffmpeg steps planned here.
Burned subtitles are drawn as pictures with Pillow, imported only for them,
because many ffmpeg builds have no text-drawing filters.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import math
import os
import re
import secrets
import sys
import urllib.error
import urllib.request
from pathlib import Path

SCHEMA = 1
PAGE_TAIL_SECONDS = 0.5
WIDTH, HEIGHT = 1920, 1080
LABELS = {"zh": "ai-label-zh.png", "en": "ai-label-en.png"}
# The AI badges, byte for byte the files in assets/. Some storefronts keep only
# text files from a Skill archive, so a copy installed from one has no assets/
# folder; plan then writes these into the course's work folder instead.
_BADGES = {
    "ai-label-zh.png": (
        "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"
    ),
    "ai-label-en.png": (
        "iVBORw0KGgoAAAANSUhEUgAAAPIAAAA6CAYAAACK0wR9AAAQV0lEQVR4nO1dCVTN2R9/JUtUSoVISf5EtGBUlv5NRbuIyTIx"
        "YxkRyaFZzDTLUQ0zmhnDmZxjZMg2zdBMtCktWoQsZUkylZKUbEWWQv/z6T/X+XneVv1+v/fy7uecd979vd927+93P/e73vtU"
        "BNwjkod7UFAoOgK4vLgKB9ekxKWg4JnYbBGZkpeCQo6k7iiRKYEpKBSA0KoduCklMQUFu4jkUyJTAlNQKJh0bqtEpiSmoOAH"
        "kVwRmZKYgoJfRLJNZEpiCgr5IJItIlMSU1DIF5EdJTIlMQWFYiCyvV5rSmIKChbQtWtX1QEDBvRC+eXLly03btx4xLY3WxyR"
        "KYkpKFiCpaWlbkFBgS/KDx48eKajo7Ozg5cMYDMhhIKCQkGgypc0/vXXXx1aWlqWk8+ECRP6t+X8rVu3Tibnbtq0yY6LOlJ0"
        "LpiZmWlD2pmammoJlAuR0ojMCYnV1NRUZ8yYYcL8bfbs2UO5uBeF8iA5OdkTKuuOHTveFSgfInlXrZ2dnQ11dXV7oEwM/ffe"
        "e89UVVWVi2mUFEoCHR2d7vKug6JAlQ8Hl6+vrym+a2trn4SHh59F2cDAoOekSZMMuLonxduNLl26qGhqanYTKDcieZPI3bp1"
        "U50+fXqrWp2UlFQRHx9fQfbNnj27leAUFG2FtrZ2dxUVqtDxRuQpU6YMIipQQkJC5c2bNxvPnz9/B9uzZs0yxcjKdR0o3j5o"
        "a2t3Gmn87NmzF1zfQ40vtfr58+cvU1NTb6CckJBQYW1trde3b191BweHgWlpaVUCOQMDykcffTRyypQphqNHj9YdPHiwZmNj"
        "Y7O6urpa9+7du4g6Z86cOakxMTH/iNpnaGiosXTp0pFeXl7GJiYmWmpqaioYxNLT02/u2LHjytmzZ+sk1ae8vNwPdUhKSqp0"
        "d3dPIIkFM2fOHLJo0aIRI0eO1NHQ0OhaWFh458yZM3WhoaFnEaOUtb1s1Q/v0tPTMxG/6enp9QgJCRnr7u5uPHTo0N6QmGZm"
        "ZgeuXr36QFiaent7D/bw8DAeNWpUn4EDB/bC88f9jx07VhUeHn6uurq6Ufie8LOcOnVqZu/evbvhQ353cHAYgGgG89iTJ0/W"
        "2tnZxXLVfibQBlzLxcVl0KBBgzQeP378vLi4+MH+/fuvbd++vejhw4fNAu4A7gYQInMCEMDb27tVrc7Jyampr69vQhkvHy+c"
        "EF3eRLaxsem3ffv2/1pYWOgKd7j2XG/NmjWWoaGh43v27Pna8x02bJg2Pv7+/uY///zzhbVr155Apo+ka/Xv378nvs3Nzfvs"
        "3bvXycrKSo+5397efgA+eM7e3t5Jly9fvsdn/UBefOPZpaamemFwJvvQoa9du1bPJOLnn38+Bp0eg5Dwtcj9Z86caTpnzpyU"
        "zMzMauZ+kI2NUNMaltqPgerbb7+1DQ4OtkRkhvyOwX/ixIn98Vm8eLFZUFBQroBjcEpkjFBk5ExMTHxlG58+ffp2XV3dE319"
        "fXVImBUrVmRDYgvkAGNjY83k5GQPQtoTJ07U/Pnnn6WQCJDMy5YtMyedtbS0tGHDhg3nyLn5+fm3RcW7V65cOYpsFxQU3MFx"
        "6NSWlpZ6eLmQrKtXr7Z48eJFS3Bw8AlpRIaWEBsb64rOj3NAjoaGhiYilXEcOvjOnTvftbGxOSTpemzXT09PTx0SNT09fRqJ"
        "TFy/fv1hU1PTi7q6uqeECFpaWt2Ki4vnkmcJ4BnDzLp3794zc3NzHQwGIES/fv3UU1JSvIYNG7Yf1yLHNzY2Pt+4ceN5lNH2"
        "adOmDUa5srLyEaQfs17i0iDZbP+uXbscFyxYMJxst7S0CDCQ4v1ASkMrGTNmjH5GRsY0QWcmMjNWDClMyni5UBnxEPDynZyc"
        "Bh49erRV7eYTCH/t27fPmZD4p59+KgwODs4jne+PP/4o3bp168W0tLRpeDEgC9Sv5OTkSlHX8/f3H0k6ye3bt58EBARkHTp0"
        "qIx5zPjx4/vGxMRMhVq6atWq0ZGRkZfKysoaJBE5Pj7eA07D6Ojoq1999VV+RUVFa+eGOrphwwbbjz/+2Ipce/LkyQbZ2dm3"
        "+Kqfvr5+DyT74D1mZWVV+/v7H4daiX1MKYWB58iRI9cXLlxolpGRcRPtyM3NvYXOTwByIjYM9RRkCg4Otlq5cmU22f/o0aPm"
        "devWnSR9ixC5rKysgfwuCWy2PyAgYBSTxKmpqVV+fn7HcF3yG7STL774YmxgYOBoAcdQ5co+7tGjRxcvL69XI2ZRUdF95n4m"
        "sX19feWSHGJvb2+AERjlkpKSB5999tlJYVUKL2bZsmXHmWqZqGv16dOn+6ZNmyagDO3Cy8srUbiTEG3k/fffP4YyOmtYWNh4"
        "SXWE+vav/Z75wQcfpBMSA5AYn3zySR5xHhIHIp/1g6R1c3Mzys3NrXFxcYknJCb3YR4bEhJy2tXVNd7R0fFwTk7OayQG0EcW"
        "L16cQbYXLVpkJqz+thd9WGw/tMyNGzfakm1oA25ubvFMEgPYDgoKylmwYEGagFtEcua1xsvV1NRsVfswEgvvhwRubm5ufdHI"
        "+sJDE/AMZhw7OTn5RlNTk0j1Hp30/v37rY4kKyur1+xoghUrVowi7Y2IiChEhxB3X6jvxC8Ae1BaYsyqVaty4IARt3/v3r0l"
        "pGxoaNiL7/o9efLkua+vb8rTp08lemehSkvTvODsunXr1mNiaxoZGWkIWMAKFtu/ZMmSEeRa0BJWr16di0FV3PUuXrx4V8Ax"
        "VPlQq//6669y4f1wfB0/frzVmYHw1NSpUwcJeAbTXistLX3llBEF2Mf4hl3fq1evNxw1JFYO7Nu37xWxxIF0JKjM0jqrNAcW"
        "U0rDGyvqGC7rt23btsuivMztAaQ0810YGRlpsnHd6Sy2n6j0AEwv+HsEcgYnRIY65OnpaYwyQiKEsMI4fPjwdXnmXiPTTNYO"
        "Y2xsrEFigghLMfdhdLa2ttYn17x06ZJUzzHT7oJTRNABMFU62KzC+7munyiNqy3A4OPj4zNk3bp1Y6Kiot6F51iahtEWaLLY"
        "fmiOiHKQbXF9m29w4uxCfJBILWRyifNIg8hbtmyZhDLiighXtTd4HhQUZLF58+aJko5xdnY+wgx1wU4jZTjcoEKJCjfAmwpJ"
        "jHJeXl6tKIcUyTKCx1U4pikN4qSorGCaBCoi0p24rp+wrSsNqAsShRCxQF+B11vcsWyYXP1ZbD/6ATOvoKSkRKIm16mJTJJA"
        "AD8/v2H4SDsHThNXV1ejuLi4N9RwrgDvLhxFSE5BfBaDATzXwk67bdu22ZNtxBfZTt6vr6+XOZGjPVCk+iEkiWmoCO2RQeDc"
        "uXN1SOAoLCy8i9ANcgwcHR0HKmL7df8NsRF0cLUPxSUyJDFG2faci9zr9hIZTpIlS5ZkSjrmypUrr3nOgYULF6bn5OTMQDz2"
        "xx9/nGBhYdEnOjq6BGEmOLa+/vrrdxAWwbG7d++++vfff4u090kZ9pKXl1dSW+peXFz8Rr3YhKLU79NPP7VGuAzS8e7du09/"
        "+OGHwl27dhUT5xYBwj4CBW1/U1PTC2E/S01NzWv1fyuIjJQ3eBtRxkgbGxsrkZhw5ZM4KMJVOBde0LbeFw4hWbKahAEpgBAB"
        "bDNsf/jhh2b4MI+B1ECHw3GirsF8kVC9YF8pggNEkeqHpBZCYrwnmDl8EaCGxfaT6AUBHGFvJZGZMeEtW7ZchBSTdg5spSFD"
        "hmhBKrq7uxuJiu9xheHDh2uHh4fboPzLL79cwiJpdnZ2/eAgQUwUnQ75sghBSRrxEWIg6qKtrW2/jjqA2IQi1G/t2rVWxE5F"
        "7JvNzq8iZRYUm+2HY5FkJRL/iaRQVqf0WqPzI36MMhxcsj4sprrKt/d6//79znCGoK7IIvLx8Uk2MDDYraGhsWPcuHEHkYQh"
        "icQEzOmZsPEUbdEEeddv3LhxrV5jQFzmWXslo+a/MV2+2s/sD7JkbYlyQHJBZNb+cBnxNTiHUEbCO3JoZTmPGWdmery5BtLw"
        "kAvLRhgB2gcxCZDmJy4DTF6Qd/2YxCETQcQl6ZBsO0mAD4OUTUxMtKR5t9lsP1PLhESeN2/ef8QdCy0zIiKC6zXmAlS5Uqtj"
        "Y2NlVo+RSUNiocwYNNdgZuNAk+hIqAOq4pdffnmabMMzixlVoqQF7oOcY2gD7b1fZ6sf/CWkHBYWZsPMwwZQD9jQmHxB1FZJ"
        "KC8vb0BWFfFKL1++3Jyv9kN7w2QLsh0dHe2EiIewlMestPz8/FlOTk6Ggs5iI8NphdACcQ7FxcXJbIMgdgtvNeYDE/Va3Dxf"
        "NoHQARwfsM/xsCsqKuZnZmbexKBC0kdJnLa2tvYxOsOpU6duMzOpmIAXFjY3aQe+kfuMua1wqkHDwv6xY8fqE6kUExNTylfI"
        "TZ71i4qKKiYdGuFJSMWUlJQbmKuL54++g0H8zp07TzH5Agkikq6H2UpRUVFXQCDB/8OCkzw9PQcXFRXdGzFihA7CRDCNuGg/"
        "BABMruzs7OkImyIXHjkM69evfwczqdAGSGrUA8ejPUhykaSJKAyRMR+WBMrz8vJq2pqyB/WaPGCSp83xhOxWLF++PCsuLs4N"
        "JgHWEZs7d65YNYkMUlggITAwMAcTLYT3L1269DiS/9evXz8ebYC0wOKD+Agfm5iYWFlZWSlyUOAK8qrfgQMHrsHJREJLMGsw"
        "L5l5zO+///5PYGBgNkgujcgApjRiYQpLS0td4hnHh5nIUVVV9YiL9l+4cOEuPO8HDx50ISmcIDVT+kJAYcGH0NDQM5mZmd58"
        "EDmgo7OgmEkgonKrpQEZV5jqhocBUmFgYE4G4ApIREBSCDzVshyPURt54UePHvW0tbU9xEzzJNi8efOFPXv2lGD2DlbLwPrL"
        "kBAYmKAFwNmDcFZbVqFgE/KqH8J3MLlgn2KhBGR0wdZFht1vv/1WTPwU1dXVMnm0oSFhFZCQkJCxsKvhlcb7gdqdlZWF2VUt"
        "XLYf0hcroGBA8vHxMYEERv+tqqpqhGaHHHRyDVnb1A60+rhUlPlvYpCul5WVNR1qDzrY/Pnz06CyiXJYoNNhCd9vvvnmHbLO"
        "GBZEwHxVuVSegoJBZKX+y5g9e/Y4g8RYhWLevHnHRJEYgFMF606FhYWdRaxZVEiFgkKeYBKZtTBUZwBmtBB7CpM3ZJ2swbT9"
        "25OBRkHBIl5xVmklMhxbpMxckVESoFIz//oGyxVxVT8KirZAmMhKI5UxgYJM/4Pti5lXko6HnYz1vchcVCS8wKvJV30pKCRx"
        "Van/HxmTNb7//ns7EhtEXPPgwYOl5eXlDxFL1tLS6opVNhE2wUQKIrnhrfTw8EhUpIkRFEqFNwSuUhOZrOX03Xff2cqSFgpn"
        "WERERAHil9Q+pugMRFYqMkNtRjYZVinBUqyYAYVVFxsaGpqR0YVYIP6BALOyEOuWd30plBoBon6UNitDachMQdEJINaHJc1r"
        "rTTOLwoKBYdELsoSfqJkpqCQL6RyUNY4MiUzBYV8IBP32pIQQslMQcEvZOZcWzO7KJkpKPhBm7jWkbWEqEebgoJ9tEtYdiTX"
        "mkpnCgp20W5OsbW6H5XOFBRyFIpcLNNJSU1BwbNGy8faxpTYFBQCbk3R/wGGFaJpDuZymQAAAABJRU5ErkJggg=="
    ),
}
LAYOUTS = ("slides", "slides+photo")
IMAGE_SUFFIXES = (".png", ".jpg", ".jpeg")
DOWNLOAD_LIMIT = 2 * 1024 * 1024 * 1024
MAX_CUE_WEIGHT = 44  # about 22 Chinese characters: two short subtitle lines
_HAN = ((0x3400, 0x4DBF), (0x4E00, 0x9FFF), (0xF900, 0xFAFF), (0x20000, 0x2EBEF), (0x30000, 0x323AF))
_SENTENCE = re.compile(r"(?<=[。！？!?；;])|\n+")
_CLAUSE = re.compile(r"(?<=[，,、：:])")

SUBTITLE_MODES = ("burn", "file")
SUBTITLE_PX = 48  # text size on the 1080p frame
SUBTITLE_LINES = 2  # lines per on-screen cue
SUBTITLE_MARGIN = 120  # side margin of the subtitle box
SUBTITLE_BOTTOM = 60  # gap under the subtitle box
SUBTITLE_PAD_X, SUBTITLE_PAD_Y, SUBTITLE_LINE_GAP, SUBTITLE_STROKE = 24, 10, 8, 2
SUBTITLE_BOX = (0, 0, 0, 150)  # translucent dark box behind white outlined text
SUBTITLE_MIN_BOX = 640
PHOTO_PX, PHOTO_MARGIN, PHOTO_GAP = 260, 40, 32  # corner photo height, its margin, room left beside it
# Characters that break between any two of them (Chinese, Japanese, Korean, full-width forms).
_WIDE_RANGES = "\u2e80-\u9fff\uac00-\ud7af\uf900-\ufaff\ufe30-\ufe4f\uff00-\uffef\U00020000-\U0003134f"
_WIDE = re.compile(f"[{_WIDE_RANGES}]")
_OPENING = "（《「『【〈“‘(\\[{"
_CLOSING = "，。、；：！？）》」』】〉”’…,.;:!?)\\]}%"
# One unbreakable unit: a wide character or a run of other non-space characters,
# with opening punctuation kept before it and closing punctuation after it.
_TOKEN = re.compile(f"[{_OPENING}]*(?:[{_WIDE_RANGES}]|[^\\s{_WIDE_RANGES}]+)[{_CLOSING}]*")
FONT_FILES = {
    "darwin": [
        "/System/Library/Fonts/PingFang.ttc",
        "/System/Library/Fonts/Hiragino Sans GB.ttc",
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/STHeiti Light.ttc",
        "/Library/Fonts/Arial Unicode.ttf",
    ],
    "win32": [
        "%WINDIR%\\Fonts\\msyh.ttc",
        "%WINDIR%\\Fonts\\msyhbd.ttc",
        "%WINDIR%\\Fonts\\simhei.ttf",
        "%WINDIR%\\Fonts\\Deng.ttf",
        "%WINDIR%\\Fonts\\simsun.ttc",
    ],
    "linux": [
        "/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/noto-cjk/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/google-noto-cjk/NotoSansCJK-Regular.ttc",
        "/usr/share/fonts/opentype/noto/NotoSansCJKsc-Regular.otf",
        "/usr/share/fonts/truetype/wqy/wqy-microhei.ttc",
        "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc",
    ],
}
LATIN_FONT_FILES = {
    "darwin": [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ],
    "win32": ["%WINDIR%\\Fonts\\arial.ttf"],
    "linux": [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/TTF/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/liberation-sans/LiberationSans-Regular.ttf",
    ],
}
FONT_FOLDERS = {
    "darwin": ["/System/Library/Fonts", "/Library/Fonts", "~/Library/Fonts", "/System/Library/AssetsV2"],
    "win32": ["%WINDIR%\\Fonts", "%LOCALAPPDATA%\\Microsoft\\Windows\\Fonts"],
    "linux": ["/usr/share/fonts", "/usr/local/share/fonts", "~/.local/share/fonts", "~/.fonts"],
}
CJK_FONT_NAMES = ("cjk", "wqy", "yahei", "pingfang", "hiragino")
LATIN_FONT_NAMES = ("arial", "helvetica", "dejavusans", "liberationsans-regular")
FONT_SUFFIXES = (".ttf", ".ttc", ".otf", ".otc")
FONT_SEARCH_DEPTH, FONT_SEARCH_FILES = 4, 20000
_FONT_STYLES = ("bold", "black", "heavy", "light", "thin", "mono", "italic", "oblique")
FONT_HELP = (
    "pass --font <path> with a .ttf, .otf, or .ttc font that has these characters, or plan with "
    "--subtitles file to keep the subtitles only in the .srt beside the video"
)

_FIT = (
    f"scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=decrease,"
    f"pad={WIDTH}:{HEIGHT}:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1"
)
_ENCODE = [
    "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2",
]
_QUIET = ["-hide_banner", "-loglevel", "error", "-y"]


class LessonError(Exception):
    """Something the Agent or the teacher fixes before the next step."""


def weighted_characters(text: str) -> int:
    """The weighting text-to-speech billing uses: a Han character counts twice."""

    return sum(2 if any(low <= ord(char) <= high for low, high in _HAN) else 1 for char in text)


def _read_json(path: Path, what: str) -> dict:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise LessonError(f"{path} not found") from exc
    except (OSError, ValueError) as exc:
        raise LessonError(f"{what} {path.name} cannot be read as JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise LessonError(f"{what} {path.name} must be a JSON object")
    return data


def load(path: Path) -> dict:
    if not path.exists():
        raise LessonError(f"{path} not found; create it with init first")
    project = _read_json(path, "the course project")
    if project.get("schema") != SCHEMA:
        raise LessonError(f"{path.name} is not a lesson project (schema {SCHEMA})")
    check_pronunciations(project.get("pronunciations", []))
    return project


def check_pronunciations(entries) -> None:
    """A misspelled reading would be skipped without a word, so refuse it instead."""

    if not isinstance(entries, list):
        raise LessonError('pronunciations must be a list of {"term": "...", "say": "..."} entries')
    for number, entry in enumerate(entries, start=1):
        if not isinstance(entry, dict) or not all(
            isinstance(entry.get(key), str) and entry[key].strip() for key in ("term", "say")
        ):
            shown = json.dumps(entry, ensure_ascii=False)
            raise LessonError(
                f'pronunciations entry {number} must be {{"term": "...", "say": "..."}} with both filled, not {shown}'
            )


def save(path: Path, project: dict) -> None:
    partial = path.with_name(path.name + ".tmp")
    partial.write_text(json.dumps(project, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    partial.replace(path)


def _relative(path: Path, root: Path) -> str:
    return Path(os.path.relpath(path.resolve(), root.resolve())).as_posix()


def _resolve(root: Path, value: str) -> Path:
    path = Path(value)
    return (path if path.is_absolute() else root / path).resolve()


def _exists(path: Path, what: str) -> None:
    if not path.is_file():
        raise LessonError(f"{what} is missing: {path}")


def _paragraphs(path: Path) -> list[str]:
    """Final lecture text: paragraphs separated by blank lines, one page each."""

    try:
        text = path.read_text(encoding="utf-8-sig")
    except FileNotFoundError as exc:
        raise LessonError(f"{path} not found") from exc
    except (OSError, UnicodeDecodeError) as exc:
        raise LessonError(f"the lecture text {path.name} cannot be read as UTF-8: {exc}") from exc
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    return [part.strip() for part in re.split(r"\n[ \t]*\n", text) if part.strip()]


def _blank_page(image: str | None, script: str) -> dict:
    return {"image": image, "script": script, "take": 1,
            "audio": None, "audio_seconds": None, "task_id": None}


_LESSON_RANGE = re.compile(r"(\d+)(?:\s*-\s*(\d+))?")


def _page_span(first: int, last: int) -> str:
    return f"page {first} is" if first == last else f"pages {first}-{last} are"


def parse_lessons(value: str, pages: int, what: str = "the deck") -> list[tuple[int, int]]:
    """--lessons: 1-based inclusive page ranges, in order, without gaps or overlaps, covering every page."""

    ranges = []
    for part in (value or "").split(","):
        match = _LESSON_RANGE.fullmatch(part.strip())
        if match is None:
            raise LessonError(f"--lessons takes slide ranges such as 1-8,9-15,16-20, not {value!r}")
        first, last = int(match.group(1)), int(match.group(2) or match.group(1))
        if last < first:
            raise LessonError(f"--lessons range {first}-{last} runs backwards")
        ranges.append((first, last))
    expected = 1
    for first, last in ranges:
        if first < expected:
            raise LessonError(
                f"--lessons range {first}-{last} overlaps the range before it; "
                "give the ranges in slide order, starting at 1, without overlaps"
            )
        if first > expected:
            raise LessonError(f"--lessons: {_page_span(expected, first - 1)} in no lesson")
        if last > pages:
            raise LessonError(f"--lessons range {first}-{last} goes past the last page; {what} has {pages} pages")
        expected = last + 1
    if expected <= pages:
        raise LessonError(f"--lessons: {_page_span(expected, pages)} in no lesson")
    return ranges


def _groups(count: int, lesson_size: int | None, lessons: str | None, what: str) -> list[tuple[int, int]]:
    """Each lesson's pages as a 0-based [start, stop) slice."""

    if lessons is not None:
        return [(first - 1, last) for first, last in parse_lessons(lessons, count, what)]
    size = lesson_size or count
    if size < 1:
        raise LessonError("lesson size must be at least 1")
    return [(start, min(start + size, count)) for start in range(0, count, size)]


def _images(pages_dir: Path) -> list[Path]:
    images = sorted(path for path in pages_dir.glob("page-*") if path.suffix.lower() in IMAGE_SUFFIXES)
    if not images:
        raise LessonError(f"no page-NNN images in {pages_dir}; run deck_read.py pages first")
    return images


def _deck_file(deck: Path) -> tuple[list[dict], str]:
    """The deck's slides and the stem of the presentation it was read from ("" when unknown)."""

    data = _read_json(deck, "the deck")
    slides = data.get("slides")
    if not isinstance(slides, list) or not all(isinstance(slide, dict) for slide in slides):
        raise LessonError(f"the deck {deck.name} has no slides list; make it with deck_read.py slides")
    source = data.get("source")
    return slides, (Path(source).stem.strip() if isinstance(source, str) else "")


def _slide_pages(images: list[Path], slides: list[dict], project_dir: Path) -> list[dict]:
    notes = [str(slide.get("notes") or "") for slide in slides]
    return [
        _blank_page(_relative(image, project_dir), notes[number].strip() if number < len(notes) else "")
        for number, image in enumerate(images)
    ]


def _recorded(project: dict) -> list[str]:
    """Pages and clips that carry narration or a clip, or whose narration was submitted, in course order.

    A take above 1 means a request went out for that page before, even when
    nothing was recorded (a failed or canceled task, then retake).
    """

    found = []
    for lesson in project.get("lessons") or []:
        if lesson.get("intro"):
            found.append(f"{lesson.get('id')} intro")
        for number, page in enumerate(lesson.get("pages") or [], start=1):
            if page.get("audio") or page.get("task_id") or (page.get("take") or 1) > 1:
                found.append(f"{lesson.get('id')} page {number}")
        if lesson.get("outro"):
            found.append(f"{lesson.get('id')} outro")
    return found


def _refuse_existing(project_path: Path, replace: bool) -> None:
    """Lessons and page numbers are part of every narration request, so they settle before the first one."""

    if not project_path.exists():
        return
    try:
        recorded = _recorded(load(project_path))
    except LessonError:
        if replace:
            raise
        recorded = []
    if recorded:
        shown = ", ".join(recorded[:3]) + (", …" if len(recorded) > 3 else "")
        raise LessonError(
            f"{project_path} already exists with narration recorded or submitted ({shown}); lessons and page "
            "numbers are fixed once narration starts, so edit it instead of starting over"
        )
    if not replace:
        raise LessonError(
            f"{project_path} already exists; edit it, or, while nothing is narrated yet, run init again "
            "with --replace to start it over"
        )


def init(
    project_dir: Path,
    *,
    title: str,
    pages_dir: Path | None = None,
    scripts: Path | None = None,
    deck: Path | None = None,
    language: str = "zh-CN",
    lesson_size: int | None = None,
    lessons: str | None = None,
    decks: list[tuple[Path, Path | None]] | None = None,
    replace: bool = False,
) -> dict:
    """Create course.json.

    decks lists one (pages folder, deck.json or None) pair per lesson. A lesson is
    titled with its deck's first slide title, else the deck's source file name,
    else its pages folder name.
    """

    if (pages_dir is not None or bool(decks)) == (scripts is not None):
        raise LessonError("give exactly one of --pages or --scripts")
    if pages_dir is not None and decks:
        raise LessonError("give one --deck for each --pages, in the same order")
    if scripts is not None and deck is not None:
        raise LessonError("--deck goes with --pages; lecture text already holds the scripts")
    if decks and (lessons is not None or lesson_size):
        raise LessonError(
            "with one --deck for each --pages every deck is one lesson; leave out --lessons and --lesson-size"
        )
    if lessons is not None and lesson_size:
        raise LessonError("give --lessons or --lesson-size, not both")
    project_path = project_dir / "course.json"
    _refuse_existing(project_path, replace)
    differs = False
    built: list[dict] = []
    outline: list[dict] = []
    if decks:
        for number, (folder, deck_path) in enumerate(decks, start=1):
            images = _images(folder)
            slides, source = _deck_file(deck_path) if deck_path is not None else ([], "")
            if deck_path is not None:
                differs = differs or len(slides) != len(images)
            first = str(slides[0].get("title") or "").strip() if slides else ""
            built.append({"id": f"L{number:02d}", "title": first or source or folder.name, "intro": None,
                          "outro": None, "pages": _slide_pages(images, slides, project_dir)})
            # each deck's own slide count, beside its page count
            outline.append({"slides": len(slides)} if deck_path is not None else {})
    else:
        if scripts is not None:
            paragraphs = _paragraphs(scripts)
            if not paragraphs:
                raise LessonError(f"no paragraphs in {scripts}; separate the pages with blank lines")
            pages = [_blank_page(None, paragraph) for paragraph in paragraphs]
            what = "the lecture text"
        else:
            assert pages_dir is not None
            images = _images(pages_dir)
            slides = _deck_file(deck)[0] if deck is not None else []
            differs = deck is not None and len(slides) != len(images)
            pages = _slide_pages(images, slides, project_dir)
            what = "the deck"
        groups = _groups(len(pages), lesson_size, lessons, what)
        for number, (start, stop) in enumerate(groups, start=1):
            built.append({"id": f"L{number:02d}", "title": title if len(groups) == 1 else f"{title} {number}",
                          "intro": None, "outro": None, "pages": pages[start:stop]})
            outline.append({})
    outline = [
        {"lesson": lesson["id"], "title": lesson["title"], "pages": len(lesson["pages"]), **slides_of}
        for lesson, slides_of in zip(built, outline)
    ]
    project_dir.mkdir(parents=True, exist_ok=True)
    project = {
        "schema": SCHEMA,
        "project_id": secrets.token_hex(4),
        "title": title,
        "language": language,
        "layout": "slides",
        "label": "zh" if language.lower().startswith("zh") else "en",
        "photo": None,
        "voice": {"voice_id": None, "model": "auto", "format": "mp3"},
        "pronunciations": [],
        "lessons": built,
    }
    save(project_path, project)
    empty = [
        f"{lesson['id']} page {number}"
        for lesson in built
        for number, page in enumerate(lesson["pages"], start=1)
        if not page["script"]
    ]
    return {
        "project": str(project_path),
        "lessons": len(built),
        "pages": sum(len(lesson["pages"]) for lesson in built),
        "pages_without_script": empty,
        "slide_count_differs": differs,
        "outline": outline,
    }


def _lesson(project: dict, lesson_id: str) -> dict:
    for lesson in project["lessons"]:
        if lesson["id"] == lesson_id:
            return lesson
    known = ", ".join(item["id"] for item in project["lessons"])
    raise LessonError(f"no lesson {lesson_id}; the lessons are {known}")


def _lesson_page(project: dict, lesson_id: str, number: int) -> dict:
    pages = _lesson(project, lesson_id)["pages"]
    if not 1 <= number <= len(pages):
        raise LessonError(f"{lesson_id} has pages 1 to {len(pages)}")
    return pages[number - 1]


def spoken(project: dict, script: str) -> str:
    """The script as it is read aloud: approved pronunciations replace their terms."""

    text = script
    for entry in project.get("pronunciations", []):
        if entry.get("term") and entry.get("say"):
            text = text.replace(entry["term"], entry["say"])
    return text


def narration_key(project: dict, page: dict) -> str:
    """What a page's narration depends on: voice, model, format, spoken text, and take.

    The page's position is left out, so inserting, deleting, or moving slides
    does not make narrated pages look changed.
    """

    voice = project["voice"]
    basis = json.dumps(
        [voice.get("voice_id"), voice.get("model"), voice.get("format"),
         spoken(project, page["script"]), page.get("take", 1)],
        ensure_ascii=False,
    )
    return hashlib.sha256(basis.encode("utf-8")).hexdigest()[:12]


def request_id(project: dict, lesson_id: str, number: int, page: dict) -> str:
    return f"lk-{project['project_id']}-{lesson_id}-p{number:03d}-{narration_key(project, page)}"


def changed_since_narrated(project: dict, page: dict) -> bool:
    """A recorded page whose script, reading, voice, or take no longer matches its audio.

    A page recorded without narrated_key counts as current.
    """

    narrated = page.get("narrated_key")
    return bool(page.get("audio") and narrated and narrated != narration_key(project, page))


def needs_narration(project: dict, page: dict) -> bool:
    return not page.get("audio") or changed_since_narrated(project, page)


def parse_pages(value: str) -> tuple[int, int]:
    match = re.fullmatch(r"\s*(\d+)\s*-\s*(\d+)\s*", value or "")
    if match is None:
        raise LessonError(f"--pages takes a range such as 1-4, not {value!r}")
    return int(match.group(1)), int(match.group(2))


def _numbered(lesson: dict, pages: tuple[int, int] | None) -> list[tuple[int, dict]]:
    """The lesson's pages with their 1-based numbers, limited to an inclusive range."""

    numbered = list(enumerate(lesson["pages"], start=1))
    if pages is None:
        return numbered
    first, last = pages
    if not 1 <= first <= last <= len(numbered):
        raise LessonError(f"{lesson['id']} has pages 1 to {len(numbered)}; --pages {first}-{last} is outside them")
    return numbered[first - 1:last]


def speech_payload(project: dict, lesson_id: str, number: int, page: dict) -> dict:
    voice = project["voice"]
    payload = {
        "voice": voice["voice_id"],
        "input": spoken(project, page["script"]),
        "model": voice.get("model") or "auto",
        "format": voice.get("format") or "mp3",
    }
    if project.get("language"):
        payload["language"] = project["language"]
    payload["client_request_id"] = request_id(project, lesson_id, number, page)
    return payload


def next_page(project: dict, lesson_id: str | None = None) -> dict:
    if not project["voice"].get("voice_id"):
        raise LessonError("choose the voice first: set voice.voice_id in course.json")
    for lesson in project["lessons"]:
        if lesson_id and lesson["id"] != lesson_id:
            continue
        for number, page in enumerate(lesson["pages"], start=1):
            if not needs_narration(project, page):
                continue
            if not page["script"].strip():
                raise LessonError(f"{lesson['id']} page {number} has no script; write it before narration")
            found = {"lesson": lesson["id"], "page": number,
                     "payload": speech_payload(project, lesson["id"], number, page)}
            if page.get("audio"):
                found["changed_since_narrated"] = True
            return found
    return {"done": True}


def estimate(
    project: dict,
    credits_per_1k: float,
    lesson_id: str | None = None,
    pages: tuple[int, int] | None = None,
) -> dict:
    if pages is not None and not lesson_id:
        raise LessonError("--pages needs --lesson")
    if lesson_id:
        _lesson(project, lesson_id)
    rows, total = [], 0
    for lesson in project["lessons"]:
        if lesson_id and lesson["id"] != lesson_id:
            continue
        pending = [page for _, page in _numbered(lesson, pages) if needs_narration(project, page)]
        credits = sum(
            math.ceil(weighted_characters(spoken(project, page["script"])) * credits_per_1k / 1000)
            for page in pending
        )
        rows.append({
            "lesson": lesson["id"],
            "pages": len(pending),
            "credits": credits,
            "without_script": sum(1 for page in pending if not page["script"].strip()),
        })
        total += credits
    return {"lessons": rows, "credits": total}


def media_result(result: dict, kind: str) -> dict:
    data = result.get("structuredContent") or result
    task = data.get("task") or data
    status = data.get("status") or task.get("status")
    task_id = data.get("task_id") or task.get("task_id")
    if status != "succeeded":
        raise LessonError(f"task {task_id} is {status}; record only a succeeded task")
    output = task.get("output") or data.get("output") or {}
    media = output.get(kind) if isinstance(output.get(kind), dict) else {}
    url = media.get("url")
    if not url:
        for item in data.get("artifacts") or task.get("artifacts") or []:
            if isinstance(item, dict) and str(item.get("url", "")).startswith("https://"):
                url = item["url"]
                break
    if not url:
        raise LessonError(f"task {task_id} returned no {kind} URL")
    seconds = media.get("duration_seconds") or output.get("duration_seconds")
    return {"task_id": task_id, "url": url, "seconds": float(seconds) if seconds else None}


class _HttpsOnly(urllib.request.HTTPRedirectHandler):
    """Refuse a redirect to anything but https before it is followed."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if not newurl.startswith("https://"):
            raise LessonError("the result URL redirected away from https")
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def _opener():
    return urllib.request.build_opener(_HttpsOnly())


def fetch(url: str, target: Path) -> int:
    if not url.startswith("https://"):
        raise LessonError("only https result URLs are downloaded")
    request = urllib.request.Request(url, headers={"User-Agent": "beatra-lesson-kit"})
    partial = target.with_name(target.name + ".part")
    try:
        with _opener().open(request, timeout=300) as response:
            if not response.geturl().startswith("https://"):
                raise LessonError("the result URL redirected away from https")
            target.parent.mkdir(parents=True, exist_ok=True)
            size = 0
            with partial.open("wb") as handle:
                while chunk := response.read(1 << 20):
                    size += len(chunk)
                    if size > DOWNLOAD_LIMIT:
                        raise LessonError("the download is larger than a lesson file should be")
                    handle.write(chunk)
        partial.replace(target)
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        partial.unlink(missing_ok=True)
        raise LessonError(f"the file could not be downloaded: {exc}") from exc
    except LessonError:
        partial.unlink(missing_ok=True)
        raise
    return size


def record(
    project_path: Path,
    project: dict,
    lesson_id: str,
    number: int,
    *,
    task_result: dict | None = None,
    audio: Path | None = None,
    seconds: float | None = None,
    downloader=fetch,
) -> dict:
    page = _lesson_page(project, lesson_id, number)
    root = project_path.parent
    task_id = None
    if task_result is not None:
        found = media_result(task_result, "audio")
        task_id = found["task_id"]
        audio = root / "audio" / f"{lesson_id}-p{number:03d}.{project['voice'].get('format') or 'mp3'}"
        downloader(found["url"], audio)
        seconds = seconds or found["seconds"]
    if audio is None:
        raise LessonError("give the finished task result or an audio file")
    if not seconds or seconds <= 0:
        raise LessonError(
            f"{lesson_id} page {number} has no duration; run node scripts/lesson_run.mjs probe "
            f"{audio} and record again with --seconds"
        )
    page.update({
        "audio": _relative(audio, root),
        "audio_seconds": round(float(seconds), 3),
        "task_id": task_id,
        "narrated_key": narration_key(project, page),
    })
    save(project_path, project)
    return {"lesson": lesson_id, "page": number, "audio": page["audio"], "seconds": page["audio_seconds"]}


def record_clip(
    project_path: Path,
    project: dict,
    lesson_id: str,
    slot: str,
    *,
    task_result: dict | None = None,
    video: Path | None = None,
    seconds: float | None = None,
    script: str | None = None,
    downloader=fetch,
) -> dict:
    """Record an opening or closing clip; its narration script, when given, becomes its subtitles."""

    if slot not in ("intro", "outro"):
        raise LessonError("slot is intro or outro")
    lesson = _lesson(project, lesson_id)
    root = project_path.parent
    if task_result is not None:
        found = media_result(task_result, "video")
        video = root / "clips" / f"{lesson_id}-{slot}.mp4"
        downloader(found["url"], video)
        seconds = seconds or found["seconds"]
    if video is None:
        raise LessonError("give the finished task result or a video file")
    if not seconds or seconds <= 0:
        raise LessonError(
            f"the {slot} clip has no duration; run node scripts/lesson_run.mjs probe {video} "
            "and record again with --seconds"
        )
    lesson[slot] = {"video": _relative(video, root), "seconds": round(float(seconds), 3),
                    "script": (script or "").strip() or None}
    save(project_path, project)
    return {"lesson": lesson_id, "slot": slot, **lesson[slot]}


def retake(project_path: Path, project: dict, lesson_id: str, number: int) -> dict:
    page = _lesson_page(project, lesson_id, number)
    page.update({"take": page.get("take", 1) + 1, "audio": None, "audio_seconds": None, "task_id": None,
                 "narrated_key": None})
    save(project_path, project)
    return {"lesson": lesson_id, "page": number, "take": page["take"]}


def _pieces(text: str) -> list[str]:
    pieces = []
    for sentence in (part.strip() for part in _SENTENCE.split(text) if part and part.strip()):
        if weighted_characters(sentence) <= MAX_CUE_WEIGHT:
            pieces.append(sentence)
            continue
        buffer = ""
        for clause in (part for part in _CLAUSE.split(sentence) if part):
            if buffer and weighted_characters(buffer + clause) > MAX_CUE_WEIGHT:
                pieces.append(buffer.strip())
                buffer = clause
            else:
                buffer += clause
        if buffer.strip():
            pieces.append(buffer.strip())
    return pieces


def _spread(text: str | None, seconds: float, offset: float) -> list[tuple[float, float, str]]:
    """Cues for one stretch of speech: its time shared by weighted characters."""

    pieces = _pieces(text or "")
    total = sum(weighted_characters(piece) for piece in pieces) or 1
    cues, cursor = [], offset
    for piece in pieces:
        length = seconds * weighted_characters(piece) / total
        cues.append((cursor, cursor + length, piece))
        cursor += length
    return cues


def _timeline(lesson: dict) -> list[tuple[str, float, list[tuple[float, float, str]]]]:
    """(kind, start, cues) for the opening clip, each page, and the closing clip, in playing order.

    A clip without a recorded script has no cues but still takes its time.
    """

    parts = []
    offset = 0.0
    if lesson.get("intro"):
        intro = lesson["intro"]
        parts.append(("intro", offset, _spread(intro.get("script"), intro["seconds"], offset)))
        offset += intro["seconds"]
    for page in lesson["pages"]:
        seconds = page.get("audio_seconds") or 0.0
        parts.append(("page", offset, _spread(page["script"], seconds, offset)))
        offset += seconds + PAGE_TAIL_SECONDS
    if lesson.get("outro"):
        outro = lesson["outro"]
        parts.append(("outro", offset, _spread(outro.get("script"), outro["seconds"], offset)))
    return parts


def lesson_cues(lesson: dict) -> list[tuple[float, float, str]]:
    return [cue for _, _, cues in _timeline(lesson) for cue in cues]


def wrap_spans(text: str, measure, width: float) -> list[tuple[int, int]]:
    """Lines no wider than width, as (start, end) slices of text.

    Chinese breaks between characters and other text between words; punctuation
    stays with its neighbour; a word wider than a line is cut where it must be.
    """

    spans: list[tuple[int, int]] = []
    start = end = None
    for match in _TOKEN.finditer(text):
        if start is not None and measure(text[start:match.end()]) <= width:
            end = match.end()
            continue
        if start is not None:
            spans.append((start, end))
        start, end = match.span()
        while end - start > 1 and measure(text[start:end]) > width:
            cut = start + 1
            while cut + 1 < end and measure(text[start:cut + 1]) <= width:
                cut += 1
            spans.append((start, cut))
            start = cut
    if start is not None:
        spans.append((start, end))
    return spans


def fit_cues(
    cues: list[tuple[float, float, str]], measure, width: float, lines: int = SUBTITLE_LINES
) -> list[tuple[float, float, str, list[str]]]:
    """Split each cue that wraps to more than `lines` lines; the time is shared by weighted characters.

    Returns (start, end, text, wrapped lines); the burned pictures and the SRT use this one list.
    """

    fitted = []
    for start, end, text in cues:
        spans = wrap_spans(text, measure, width) or [(0, len(text))]
        groups = [spans[index:index + lines] for index in range(0, len(spans), lines)]
        parts = [text[group[0][0]:group[-1][1]] for group in groups]
        total = sum(weighted_characters(part) for part in parts) or 1
        cursor = start
        for number, (group, part) in enumerate(zip(groups, parts), start=1):
            stop = end if number == len(groups) else cursor + (end - start) * weighted_characters(part) / total
            fitted.append((cursor, stop, part, [text[first:last] for first, last in group]))
            cursor = stop
    return fitted


def _timestamp(seconds: float) -> str:
    millis = int(round(seconds * 1000))
    hours, millis = divmod(millis, 3_600_000)
    minutes, millis = divmod(millis, 60_000)
    whole, millis = divmod(millis, 1000)
    return f"{hours:02d}:{minutes:02d}:{whole:02d},{millis:03d}"


def srt_text(cues: list[tuple[float, float, str]]) -> str:
    return "\n".join(
        f"{number}\n{_timestamp(start)} --> {_timestamp(end)}\n{text}\n"
        for number, (start, end, text) in enumerate(cues, start=1)
    )


def needs_cjk(text: str) -> bool:
    return bool(_WIDE.search(text))


def _pillow():
    """Pillow, imported only when subtitles are burned into the picture."""

    try:
        from PIL import Image, ImageDraw, ImageFont
    except ImportError as exc:
        raise LessonError(
            "burned subtitles need Pillow, which is not installed. Ask the user before installing it with "
            "python3 -m pip install --user pillow, or plan with --subtitles file to keep the subtitles only "
            "in the .srt beside the video"
        ) from exc
    return Image, ImageDraw, ImageFont


def _platform_key(platform: str) -> str:
    if platform == "darwin":
        return "darwin"
    return "win32" if platform.startswith(("win", "cygwin")) else "linux"


def _expand(entry: str) -> Path:
    return Path(os.path.expanduser(os.path.expandvars(entry)))


def _search_fonts(folders: list[Path]) -> tuple[list[Path], list[Path]]:
    """A bounded walk of the font folders: (fonts named like CJK fonts, common Latin fonts)."""

    cjk: list[Path] = []
    latin: list[Path] = []
    seen = 0
    for folder in folders:
        if not folder.is_dir():
            continue
        for current, children, files in os.walk(folder):
            depth = len(Path(current).relative_to(folder).parts)
            children[:] = sorted(children) if depth < FONT_SEARCH_DEPTH else []
            for name in sorted(files):
                seen += 1
                if seen > FONT_SEARCH_FILES:
                    break
                lowered = name.lower()
                if not lowered.endswith(FONT_SUFFIXES):
                    continue
                if any(token in lowered for token in CJK_FONT_NAMES):
                    cjk.append(Path(current) / name)
                elif lowered.rsplit(".", 1)[0] in LATIN_FONT_NAMES:
                    latin.append(Path(current) / name)
            if seen > FONT_SEARCH_FILES:
                break

    def regular_first(path: Path) -> bool:
        return any(style in path.name.lower() for style in _FONT_STYLES)

    return sorted(cjk, key=regular_first), sorted(latin, key=regular_first)


def _font_candidates(cjk: bool, platform: str | None = None):
    """Installed fonts that can show the subtitles, best first; Latin-only fonts only when no CJK is needed."""

    key = _platform_key(platform or sys.platform)
    seen: set[str] = set()

    def fresh(paths):
        for path in paths:
            if path.is_file() and str(path) not in seen:
                seen.add(str(path))
                yield path

    yield from fresh(_expand(entry) for entry in FONT_FILES.get(key, []))
    found_cjk, found_latin = _search_fonts([_expand(entry) for entry in FONT_FOLDERS.get(key, [])])
    yield from fresh(found_cjk)
    if not cjk:
        yield from fresh(_expand(entry) for entry in LATIN_FONT_FILES.get(key, []))
        yield from fresh(found_latin)


def _pick_face(families: list[str], language: str) -> int:
    """In a font collection, the Simplified (or Traditional) Chinese face for a Chinese course, else the first."""

    lang = (language or "").lower()
    if not lang.startswith("zh"):
        return 0
    tag = "TC" if any(mark in lang for mark in ("-tw", "-hk", "-mo", "hant")) else "SC"
    for index, family in enumerate(families):
        if not family.startswith(".") and family.split()[-1:] == [tag]:
            return index
    return 0


def _open_font(path: Path, size: int, language: str):
    _, _, image_font = _pillow()
    face = 0
    if path.suffix.lower() in (".ttc", ".otc"):
        families = []
        for index in range(16):
            try:
                families.append(image_font.truetype(str(path), size, index=index).getname()[0] or "")
            except OSError:
                break
        face = _pick_face(families, language)
    try:
        return image_font.truetype(str(path), size, index=face), face
    except OSError as exc:
        raise LessonError(f"the font {path} cannot be opened ({exc}); {FONT_HELP}") from exc


def _missing(font, text: str) -> str:
    """The characters of text, in order and once each, that the font draws as its missing-glyph shape."""

    image, draw, _ = _pillow()
    size = 2 * SUBTITLE_PX

    def shape(char: str) -> tuple:
        canvas = image.new("L", (size, size))
        draw.Draw(canvas).text((0, 0), char, font=font, fill=255)
        return font.getlength(char), canvas.tobytes()

    absent = shape("\U0010fffd")  # a private-use code point no font maps
    found: dict[str, None] = {}
    for char in dict.fromkeys(text):
        if char.isprintable() and not char.isspace() and shape(char) == absent:
            found[char] = None
    return "".join(found)


def _drawable(text: str) -> list[str]:
    """The characters a subtitle font has to draw, once each, in order."""

    return [char for char in dict.fromkeys(text) if char.isprintable() and not char.isspace()]


def choose_fonts(
    font: Path | None, texts: list[str], language: str
) -> tuple[list[tuple[Path, int, object]], list[int], list[str]]:
    """Pick a subtitle font for each cue text.

    Returns the fonts opened (path, face, font), the index of each text's font,
    and each text's characters that its font cannot draw. --font is used as
    given for every text. Otherwise each text takes the first installed font
    that draws all of it; when none does, the one that draws the most, and the
    rest are left out of the picture. Only a course whose Chinese (or other
    CJK) letters no installed font draws at all stops here.
    """

    needed = [_drawable(text) for text in texts]
    if font is not None:
        if not font.is_file():
            raise LessonError(f"--font {font} is not a font file; {FONT_HELP}")
        loaded, face = _open_font(font, SUBTITLE_PX, language)
        lacks = set(_missing(loaded, "".join(dict.fromkeys(char for chars in needed for char in chars))))
        return [(font, face, loaded)], [0] * len(texts), ["".join(c for c in chars if c in lacks) for chars in needed]
    whole = "".join(texts)
    cjk = needs_cjk(whole)
    letters = {char for char in whole if char.isalpha() and _WIDE.match(char)}
    fonts: list[tuple[Path, int, object]] = []
    gaps: list[set[str]] = []
    choice: list[int | None] = [None] * len(texts)
    pending = list(range(len(texts)))
    drawn_letters: set[str] = set()
    for candidate in _font_candidates(cjk):
        if fonts and not pending:
            break
        try:
            loaded, face = _open_font(candidate, SUBTITLE_PX, language)
        except LessonError:
            continue
        checked = list(dict.fromkeys(char for index in pending for char in needed[index]))
        lacks = set(_missing(loaded, "".join(checked)))
        drawn_letters |= {char for char in checked if char in letters and char not in lacks}
        fonts.append((candidate, face, loaded))
        gaps.append(lacks)
        for index in list(pending):
            if not lacks.intersection(needed[index]):
                choice[index] = len(fonts) - 1
                pending.remove(index)
    if not fonts or (letters and not drawn_letters):
        what = "font with Chinese characters" if cjk else "font"
        raise LessonError(f"no {what} for burned subtitles was found on this computer; {FONT_HELP}")
    missing = [""] * len(texts)
    for index in pending:
        counts = [len(gap.intersection(needed[index])) for gap in gaps]
        best = counts.index(min(counts))
        choice[index] = best
        missing[index] = "".join(char for char in needed[index] if char in gaps[best])
    return fonts, [number for number in choice if number is not None], missing


def _photo_width(image, photo: Path) -> int:
    """The corner photo's width on the frame, where it is scaled to PHOTO_PX high."""

    try:
        with image.open(photo) as picture:
            width, height = picture.size
            turned = picture.getexif().get(0x0112) in (5, 6, 7, 8)
    except (OSError, ValueError) as exc:
        raise LessonError(f"the teacher photo {photo} cannot be read as an image: {exc}") from exc
    ratio = max(width / height, height / width) if turned else width / height
    return 2 * math.ceil(PHOTO_PX * ratio / 2)


LEFT_OUT_NOTE = (
    "no installed font draws these characters, so they are left out of the burned subtitles (the SRT keeps "
    "them); tell the teacher, and offer --font <path> with a font that has them, or --subtitles file"
)


def _without(line: str, left_out: str) -> str:
    kept = "".join(char for char in line if char not in left_out)
    return re.sub(r"\s{2,}", " ", kept).strip()


class _Burner:
    """Draws each subtitle cue as a transparent picture, in the font chosen for it, low on the 1080p frame."""

    def __init__(self, pillow, fonts, choice: list[int], missing: list[str], photo_width: int | None) -> None:
        self.image, self.draw = pillow[0], pillow[1]
        self.fonts, self.choice, self.missing = fonts, choice, missing
        self.used: list[int] = []  # fonts that drew a subtitle, in order of first use
        if photo_width is None:
            self.right = WIDTH - SUBTITLE_MARGIN
        else:
            self.right = WIDTH - PHOTO_MARGIN - photo_width - PHOTO_GAP
        box = self.right - SUBTITLE_MARGIN
        if box < SUBTITLE_MIN_BOX:
            raise LessonError(
                "the corner photo is too wide to keep the subtitles beside it; use a portrait or square "
                "photo, or plan with --subtitles file"
            )
        self.text_width = box - 2 * (SUBTITLE_PAD_X + SUBTITLE_STROKE)

    def picture(self, lines: list[str], font, target: Path) -> tuple[int, int]:
        ascent, descent = font.getmetrics()
        line_height = ascent + descent
        widths = [math.ceil(font.getlength(line)) for line in lines]
        inset_x, inset_y = SUBTITLE_PAD_X + SUBTITLE_STROKE, SUBTITLE_PAD_Y + SUBTITLE_STROKE
        width = max(widths) + 2 * inset_x
        height = len(lines) * line_height + (len(lines) - 1) * SUBTITLE_LINE_GAP + 2 * inset_y
        width, height = width + width % 2, height + height % 2
        canvas = self.image.new("RGBA", (width, height), (0, 0, 0, 0))
        pen = self.draw.Draw(canvas)
        pen.rounded_rectangle((0, 0, width - 1, height - 1), radius=12, fill=SUBTITLE_BOX)
        top = inset_y
        for line, line_width in zip(lines, widths):
            pen.text(((width - line_width) / 2, top), line, font=font, fill=(255, 255, 255, 255),
                     stroke_width=SUBTITLE_STROKE, stroke_fill=(0, 0, 0, 255))
            top += line_height + SUBTITLE_LINE_GAP
        canvas.save(target)
        return width, height

    def burn(self, cues, first: int, offset: float, folder: Path, segment: int):
        """Fit, draw, and place one segment's cues; first is the lesson-wide index of its first cue.

        Returns the cues as shown, which the SRT lists; the placed pictures as
        (picture, x, y, start, end) with times counted from the start of the
        segment; and the characters left out of the pictures.
        """

        shown, placed, left_out = [], [], ""
        for index, cue in enumerate(cues, start=first):
            chosen, drop = self.choice[index], self.missing[index]
            font = self.fonts[chosen][2]
            left_out += drop
            for start, end, text, lines in fit_cues([cue], font.getlength, self.text_width):
                shown.append((start, end, text))
                drawn = [line for line in (_without(line, drop) for line in lines) if line]
                if not drawn:
                    continue
                if chosen not in self.used:
                    self.used.append(chosen)
                target = folder / f"cue-{segment:03d}-{len(placed) + 1:03d}.png"
                width, height = self.picture(drawn, font, target)
                x = min((WIDTH - width) // 2, self.right - width)
                y = HEIGHT - SUBTITLE_BOTTOM - height
                placed.append((target, x, y, max(0.0, start - offset), max(0.0, end - offset)))
        return shown, placed, "".join(dict.fromkeys(left_out))


def _cue_overlays(base: str, first_input: int, cues) -> tuple[list[str], str, str]:
    """Inputs and filter chain that lay each cue picture over base during its own time; returns the new base.

    Each picture is a single frame that overlay keeps showing, so the segment still
    ends with its slide or clip. The window is half-open, so a cue and the next
    never share a frame.
    """

    argv, graph = [], ""
    for number, (picture, x, y, start, end) in enumerate(cues, start=1):
        argv += ["-i", str(picture)]
        graph += (f";[{base}][{first_input + number - 1}:v]overlay={x}:{y}"
                  f":enable='gte(t,{start:.3f})*lt(t,{end:.3f})'[cue{number}]")
        base = f"cue{number}"
    return argv, graph, base


def _page_argv(
    image: Path, audio: Path, seconds: float, label: Path, photo: Path | None, output: Path, cues=()
) -> list[str]:
    argv = [*_QUIET, "-loop", "1", "-framerate", "30", "-i", str(image), "-i", str(audio)]
    graph = f"[0:v]{_FIT}[bg]"
    base, label_input = "bg", 2
    if photo is not None:
        argv += ["-loop", "1", "-i", str(photo)]
        graph += f";[2:v]scale=-2:{PHOTO_PX}[ph];[bg][ph]overlay=W-w-{PHOTO_MARGIN}:H-h-{PHOTO_MARGIN}[withphoto]"
        base, label_input = "withphoto", 3
    argv += ["-loop", "1", "-i", str(label)]
    cue_argv, cue_graph, base = _cue_overlays(base, label_input + 1, cues)
    argv += cue_argv
    graph += cue_graph
    graph += f";[{label_input}:v]scale=-2:44[lb];[{base}][lb]overlay=W-w-24:24,format=yuv420p[v]"
    return [*argv, "-filter_complex", graph, "-map", "[v]", "-map", "1:a", "-af", "apad",
            "-t", f"{seconds:.3f}", *_ENCODE, str(output)]


def _clip_argv(video: Path, label: Path, output: Path, cues=()) -> list[str]:
    cue_argv, cue_graph, base = _cue_overlays("bg", 2, cues)
    graph = (f"[0:v]{_FIT},fps=30[bg]{cue_graph};[1:v]scale=-2:44[lb];"
             f"[{base}][lb]overlay=W-w-24:24:shortest=1,format=yuv420p[v]")
    return [*_QUIET, "-i", str(video), "-loop", "1", "-i", str(label), *cue_argv, "-filter_complex", graph,
            "-map", "[v]", "-map", "0:a", *_ENCODE, str(output)]


def _aigc(produce_id: str) -> str:
    """The implicit AI label every delivered file carries in its metadata."""

    return json.dumps({"Label": "1", "ContentProducer": "Beatra", "ProduceID": produce_id}, separators=(",", ":"))


def _concat_argv(listing: Path, output: Path, title: str, produce_id: str) -> list[str]:
    return [*_QUIET, "-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy",
            "-movflags", "+faststart+use_metadata_tags", "-metadata", f"title={title}",
            "-metadata", f"AIGC={_aigc(produce_id)}", str(output)]


def _audio_argv(audio: Path, output: Path, title: str, produce_id: str) -> list[str]:
    argv = [*_QUIET, "-i", str(audio), "-map", "0:a", "-c", "copy"]
    if output.suffix.lower() == ".mp3":
        argv += ["-id3v2_version", "3"]
    return [*argv, "-metadata", f"title={title}", "-metadata", f"AIGC={_aigc(produce_id)}", str(output)]


def _title(project: dict, lesson: dict) -> str:
    """The course title, then the lesson's when it says something more."""

    named = [project["title"]] + ([lesson["title"]] if lesson["title"] != project["title"] else [])
    return " · ".join(named)


def _stem(lesson_id: str, pages: tuple[int, int] | None) -> str:
    return lesson_id if pages is None else f"{lesson_id}-p{pages[0]:03d}-{pages[1]:03d}"


def _check_pages(project: dict, root: Path, lesson_id: str, numbered: list[tuple[int, dict]], *, video: bool) -> None:
    """Refuse a page that cannot be delivered yet, naming it. Audio needs no slide image or duration."""

    for number, page in numbered:
        where = f"{lesson_id} page {number}"
        if video and not page.get("image"):
            raise LessonError(f"{where} has no slide image; this lesson is audio only")
        if not page["script"].strip():
            raise LessonError(f"{where} has no script")
        if not page.get("audio"):
            raise LessonError(f"{where} has no narration yet; run next, then record")
        if changed_since_narrated(project, page):
            raise LessonError(f"{where} changed since it was narrated; run next")
        if video and not page.get("audio_seconds"):
            raise LessonError(
                f"{where} has no duration; run node scripts/lesson_run.mjs probe on its audio "
                "and record again with --seconds"
            )
        if video:
            _exists(_resolve(root, page["image"]), f"{where} image")
        _exists(_resolve(root, page["audio"]), f"{where} audio")


def plan_audio(
    project_path: Path,
    project: dict,
    lesson_id: str,
    pages: tuple[int, int] | None = None,
) -> Path:
    """Plan tagged copies of each page's narration: same audio, no re-encoding, AI metadata added."""

    lesson = _lesson(project, lesson_id)
    numbered = _numbered(lesson, pages)
    stem = _stem(lesson_id, pages)
    root = project_path.parent.resolve()
    _check_pages(project, root, lesson_id, numbered, video=False)
    folder = root / "out" / f"{stem}-audio"
    folder.mkdir(parents=True, exist_ok=True)
    for old in folder.iterdir():
        if old.is_file() and re.fullmatch(r"p\d{3}\.\w+", old.name):
            old.unlink()
    steps: list[dict] = []
    for number, page in numbered:
        source = _resolve(root, page["audio"])
        output = folder / f"p{number:03d}{source.suffix.lower() or '.mp3'}"
        title = f"{_title(project, lesson)} · {number}"
        produce_id = f"{project['project_id']}-{lesson_id}-p{number:03d}"
        steps.append({"makes": output.name, "argv": _audio_argv(source, output, title, produce_id)})
    work = root / "work" / f"{stem}-audio"
    work.mkdir(parents=True, exist_ok=True)
    job_path = work / "render-job.json"
    job = {"lesson": lesson_id, "steps": steps, "outputs": {"audio": str(folder)}}
    job_path.write_text(json.dumps(job, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return job_path


def badge_file(assets_dir: Path | None, label: str, root: Path) -> Path:
    """The AI badge for label: the Skill's assets/ copy, or the built-in one written under work/badges/."""

    if label not in LABELS:
        raise LessonError(f"label must be one of {', '.join(LABELS)}")
    name = LABELS[label]
    if assets_dir is not None and (assets_dir / name).is_file():
        return (assets_dir / name).resolve()
    data = base64.b64decode(_BADGES[name])
    target = root / "work" / "badges" / name
    if not target.is_file() or target.read_bytes() != data:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    return target.resolve()


def plan_render(
    project_path: Path,
    project: dict,
    lesson_id: str,
    assets_dir: Path | None,
    pages: tuple[int, int] | None = None,
    *,
    subtitles: str = "burn",
    font: Path | None = None,
) -> Path:
    """Plan a lesson video. subtitles="burn" draws them into the picture; both modes write the SRT."""

    if subtitles not in SUBTITLE_MODES:
        raise LessonError(f"--subtitles is one of {', '.join(SUBTITLE_MODES)}")
    lesson = _lesson(project, lesson_id)
    numbered = _numbered(lesson, pages)
    stem = _stem(lesson_id, pages)
    with_clips = pages is None
    root = project_path.parent.resolve()
    if project.get("layout", "slides") not in LAYOUTS:
        raise LessonError(f"layout must be one of {', '.join(LAYOUTS)}")
    label = badge_file(assets_dir, project.get("label", "zh"), root)
    photo = None
    if project["layout"] == "slides+photo":
        if not project.get("photo"):
            raise LessonError("layout slides+photo needs photo in course.json")
        photo = _resolve(root, project["photo"])
        _exists(photo, "the teacher photo")
    _check_pages(project, root, lesson_id, numbered, video=True)
    shown = {"intro": lesson.get("intro") if with_clips else None,
             "pages": [page for _, page in numbered],
             "outro": lesson.get("outro") if with_clips else None}
    clips = {}
    for slot in ("intro", "outro"):
        if shown[slot]:
            clips[slot] = _resolve(root, shown[slot]["video"])
            _exists(clips[slot], f"the {slot} clip")
    timeline = _timeline(shown)
    burner = None
    if subtitles == "burn":
        pillow = _pillow()
        texts = [text for _, _, cues in timeline for _, _, text in cues]
        fonts, choice, missing = choose_fonts(font, texts, project.get("language") or "")
        burner = _Burner(pillow, fonts, choice, missing,
                         _photo_width(pillow[0], photo) if photo is not None else None)
    work = root / "work" / stem
    work.mkdir(parents=True, exist_ok=True)
    for old in work.glob("cue-*.png"):
        old.unlink()
    steps: list[dict] = []
    segments: list[str] = []
    shown_cues: list[tuple[float, float, str]] = []
    warnings: list[dict] = []
    page_steps = iter(numbered)
    first = 0
    for kind, offset, cues in timeline:
        name = f"seg-{len(segments) + 1:03d}.mp4"
        segments.append(name)
        out = work / name
        number, page = next(page_steps) if kind == "page" else (None, None)
        if burner:
            shown_here, overlays, left_out = burner.burn(cues, first, offset, work, len(segments))
            if left_out:
                warnings.append({"lesson": lesson_id, "page": number if kind == "page" else kind,
                                 "characters": left_out, "note": LEFT_OUT_NOTE})
        else:
            shown_here, overlays = list(cues), []
        first += len(cues)
        shown_cues += shown_here
        if kind == "page":
            argv = _page_argv(_resolve(root, page["image"]), _resolve(root, page["audio"]),
                              page["audio_seconds"] + PAGE_TAIL_SECONDS, label, photo, out, overlays)
        else:
            argv = _clip_argv(clips[kind], label, out, overlays)
        steps.append({"makes": out.name, "argv": argv})
    listing = work / "concat.txt"
    listing.write_text("".join(f"file '{name}'\n" for name in segments), encoding="utf-8")
    out_dir = root / "out"
    out_dir.mkdir(exist_ok=True)
    video = out_dir / f"{stem}.mp4"
    srt = out_dir / f"{stem}.srt"
    srt.write_text(srt_text(shown_cues), encoding="utf-8")
    steps.append({
        "makes": video.name,
        "argv": _concat_argv(listing, video, _title(project, lesson), f"{project['project_id']}-{stem}"),
    })
    job_path = work / "render-job.json"
    used = [burner.fonts[index] for index in burner.used] if burner else []
    job = {
        "lesson": lesson_id,
        "subtitles": subtitles,
        "font": str(used[0][0]) if used else None,
        "font_face": used[0][1] if used else None,
        "fonts": [{"path": str(path), "face": face} for path, face, _ in used],
        "warnings": warnings,
        "steps": steps,
        "outputs": {"video": str(video), "subtitles": str(srt)},
    }
    job_path.write_text(json.dumps(job, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return job_path


def status(project_path: Path, project: dict) -> list[dict]:
    out_dir = project_path.parent / "out"
    rows = []
    for lesson in project["lessons"]:
        pages = lesson["pages"]
        rows.append({
            "lesson": lesson["id"],
            "title": lesson["title"],
            "pages": len(pages),
            "scripted": sum(1 for page in pages if page["script"].strip()),
            "voiced": sum(1 for page in pages if page.get("audio")),
            "changed": sum(1 for page in pages if changed_since_narrated(project, page)),
            "minutes": round(sum(page.get("audio_seconds") or 0 for page in pages) / 60, 1),
            "rendered": (out_dir / f"{lesson['id']}.mp4").is_file(),
        })
    return rows


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="lesson_kit.py")
    commands = parser.add_subparsers(dest="command", required=True)
    start = commands.add_parser("init")
    start.add_argument("course", type=Path)
    start.add_argument("--title", required=True)
    start.add_argument("--pages", type=Path, action="append", default=[])
    start.add_argument("--scripts", type=Path)
    start.add_argument("--deck", type=Path, action="append", default=[])
    start.add_argument("--language", default="zh-CN")
    start.add_argument("--lesson-size", type=int)
    start.add_argument("--lessons")
    start.add_argument("--replace", action="store_true")
    for name in ("next", "estimate", "record", "clip", "retake", "plan", "status"):
        command = commands.add_parser(name)
        command.add_argument("project", type=Path)
        if name in ("next", "estimate"):
            command.add_argument("--lesson")
        if name == "estimate":
            command.add_argument("--credits-per-1k", type=float, required=True)
        if name in ("estimate", "plan"):
            command.add_argument("--pages", dest="page_range")
        if name in ("record", "clip", "retake", "plan"):
            command.add_argument("--lesson", required=True)
        if name in ("record", "retake"):
            command.add_argument("--page", type=int, required=True)
        if name == "clip":
            command.add_argument("--slot", choices=("intro", "outro"), required=True)
        if name in ("record", "clip"):
            command.add_argument("--task-result", type=Path)
            command.add_argument("--seconds", type=float)
        if name == "record":
            command.add_argument("--audio", type=Path)
        if name == "clip":
            command.add_argument("--video", type=Path)
            command.add_argument("--script")
        if name == "plan":
            command.add_argument("--assets", type=Path)
            command.add_argument("--audio-only", action="store_true")
            command.add_argument("--subtitles", choices=SUBTITLE_MODES, default="burn")
            command.add_argument("--font", type=Path)
    args = parser.parse_args(argv)
    try:
        if args.command == "init":
            pages, decks, pairs = args.pages, args.deck, None
            if len(pages) > 1 or len(decks) > 1:
                if decks and len(pages) != len(decks):
                    raise LessonError(
                        f"give one --deck for each --pages, in the same order, or no --deck at all "
                        f"({len(pages)} --pages, {len(decks)} --deck)"
                    )
                pairs, pages, decks = list(zip(pages, decks or [None] * len(pages))), [], []
            result = init(args.course, title=args.title, pages_dir=pages[0] if pages else None,
                          scripts=args.scripts, deck=decks[0] if decks else None, language=args.language,
                          lesson_size=args.lesson_size, lessons=args.lessons, decks=pairs, replace=args.replace)
        else:
            project = load(args.project)
            task = _read_json(args.task_result, "the task result") if getattr(args, "task_result", None) else None
            page_range = parse_pages(args.page_range) if getattr(args, "page_range", None) else None
            if args.command == "next":
                result = next_page(project, args.lesson)
            elif args.command == "estimate":
                result = estimate(project, args.credits_per_1k, args.lesson, page_range)
            elif args.command == "record":
                result = record(args.project, project, args.lesson, args.page,
                                task_result=task, audio=args.audio, seconds=args.seconds)
            elif args.command == "clip":
                result = record_clip(args.project, project, args.lesson, args.slot,
                                     task_result=task, video=args.video, seconds=args.seconds, script=args.script)
            elif args.command == "retake":
                result = retake(args.project, project, args.lesson, args.page)
            elif args.command == "plan":
                if args.audio_only:
                    job = plan_audio(args.project, project, args.lesson, page_range)
                else:
                    job = plan_render(args.project, project, args.lesson, args.assets, page_range,
                                      subtitles=args.subtitles, font=args.font)
                result = {"job": str(job)}
                if not args.audio_only:
                    result["warnings"] = json.loads(job.read_text(encoding="utf-8"))["warnings"]
            else:
                result = status(args.project, project)
    except (LessonError, OSError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
