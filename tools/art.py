#!/usr/bin/env python3
"""Prepare artwork photos for the gallery on the Drawing & painting card.

Usage: python3 tools/art.py SLUG SOURCE_IMAGE [SLUG SOURCE_IMAGE ...]

For each image this writes, with EXIF orientation applied and all metadata
(including phone GPS) stripped:
  img/art/SLUG.jpg         full view, longest edge at most 1800px
  img/art/thumbs/SLUG.jpg  400x400 centre-cropped thumbnail
It then prints the list item to paste into the art grid in index.html.
"""
import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FULL_DIR = os.path.join(ROOT, 'img', 'art')
THUMB_DIR = os.path.join(FULL_DIR, 'thumbs')
FULL_EDGE = 1800
THUMB = 400


def prepare(slug, src):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    full = im.copy()
    full.thumbnail((FULL_EDGE, FULL_EDGE), Image.LANCZOS)
    full.save(os.path.join(FULL_DIR, slug + '.jpg'), 'JPEG', quality=84, optimize=True, progressive=True)
    thumb = ImageOps.fit(im, (THUMB, THUMB), Image.LANCZOS)
    thumb.save(os.path.join(THUMB_DIR, slug + '.jpg'), 'JPEG', quality=80, optimize=True, progressive=True)
    w, h = full.size
    print(f'''              <li><a class="art-thumb" href="img/art/{slug}.jpg" data-title="TITLE" data-meta="MEDIUM · YEAR" data-w="{w}" data-h="{h}">
                <img src="img/art/thumbs/{slug}.jpg" alt="ALT TEXT" width="{THUMB}" height="{THUMB}" loading="lazy" decoding="async">
              </a></li>''')


if __name__ == '__main__':
    args = sys.argv[1:]
    if not args or len(args) % 2:
        sys.exit(__doc__)
    os.makedirs(THUMB_DIR, exist_ok=True)
    for i in range(0, len(args), 2):
        prepare(args[i], args[i + 1])
