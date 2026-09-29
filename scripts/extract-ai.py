"""One-time vector extraction from the brand kit's Illustrator masters.

Illustrator .ai files are PDF-compatible; PyMuPDF renders each artboard to SVG
with text converted to outlines, so the official lockups stay vector.

  python3 -m venv .venv && .venv/bin/pip install pymupdf
  .venv/bin/python scripts/extract-ai.py
Outputs to .cache/ai/, consumed by scripts/build-assets.mjs.
"""
import os
import pymupdf

KIT = "brand-kit/Brand Identity Design"
SOURCES = {
    "logo": f"{KIT}/Final Logo Unit/Monochrome/Updated MU-MW Logo B&W Design.ai",
    "icons": f"{KIT}/Basic Iconset/Milkyway basic Icon set .ai",
}
os.makedirs(".cache/ai", exist_ok=True)
for prefix, src in SOURCES.items():
    doc = pymupdf.open(src)
    for i, page in enumerate(doc):
        out = f".cache/ai/{prefix}-{i + 1:02d}.svg"
        with open(out, "w") as fh:
            fh.write(page.get_svg_image(text_as_path=True))
    print(prefix, len(doc), "artboards")
