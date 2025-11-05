#!/usr/bin/env python3
"""
add_image_aspects.py

- Uruchom z katalogu `public` (gdzie jest folder `images/`).
- Czyta plik z kodem (domyślnie `code.txt`) i zapisuje wersję ze zastąpionymi ścieżkami (domyślnie `code_with_aspects.txt`).
- Wyszukuje wystąpienia quoted stringów zaczynających się od `/dominik-home/images/...` i zamienia je na obiekt:
    { path: '/dominik-home/images/..', aspect: <width/height> }
- Wspiera rozszerzenia: png, jpg, jpeg, JPG, JPEG.

Przykład użycia:
    python3 add_image_aspects.py --code code.txt --out code_with_aspects.txt

Uwaga:
- Wymaga Pillow (pip install pillow).
- Jeśli plik graficzny nie istnieje, zostawi oryginalny string i wypisze warning.

"""

import os
import re
import argparse
from PIL import Image


def compute_aspect(path):
    with Image.open(path) as im:
        w, h = im.size
    if h == 0:
        raise ValueError("height is zero")
    return w / h


def main():
    p = argparse.ArgumentParser(description='Replace image paths in code with {path, aspect}')
    p.add_argument('--code', '-c', default='code.txt', help='input code file (default: code.txt)')
    p.add_argument('--out', '-o', default='code_with_aspects.txt', help='output file (default: code_with_aspects.txt)')
    p.add_argument('--site-prefix', default='/dominik-home', help='prefix to strip from web path to find files (default: /dominik-home)')
    p.add_argument('--round', type=int, default=6, help='number of decimals for aspect (default: 6)')
    args = p.parse_args()

    if not os.path.isfile(args.code):
        print(f"Error: input file not found: {args.code}")
        return

    txt = open(args.code, 'r', encoding='utf-8').read()

    # regex: captures the surrounding quote and the web path
    pattern = re.compile(r"(['\"])({}/images/[^'\"\\]+\.(?:png|jpg|jpeg|PNG|JPG|JPEG))\1".format(re.escape(args.site_prefix)))

    cache = {}

    def repl(m):
        webpath = m.group(2)  # e.g. /dominik-home/images/portfolio/main.png
        # build filesystem path by removing site-prefix and making it relative to cwd
        fs_rel = webpath.replace(args.site_prefix, '')
        fs_rel = fs_rel.lstrip('/')  # e.g. images/portfolio/main.png
        fs_path = os.path.join(os.getcwd(), fs_rel)

        if webpath in cache:
            return cache[webpath]

        if not os.path.exists(fs_path):
            print(f"Warning: image not found for {webpath} -> {fs_path}")
            return m.group(0)  # leave original (with quotes)

        try:
            aspect = compute_aspect(fs_path)
            aspect_str = str(round(aspect, args.round))
            replacement = "{ path: '%s', aspect: %s }" % (webpath, aspect_str)
            cache[webpath] = replacement
            print(f"OK: {webpath} -> aspect={aspect_str}")
            return replacement
        except Exception as e:
            print(f"Error reading {fs_path}: {e}")
            return m.group(0)

    new_txt = pattern.sub(repl, txt)

    with open(args.out, 'w', encoding='utf-8') as f:
        f.write(new_txt)

    print('\nFinished. Output:', args.out)


if __name__ == '__main__':
    main()
