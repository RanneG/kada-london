"""Build the Kada London static site for deploy (UTF-8 safe).

Usage:
  python deploy.py              # sibling ../kada-london-site (legacy)
  python deploy.py _site        # GitHub Actions / local Pages preview

Environment (optional, for `python deploy.py _site` / CI):
  PAGES_URL   Public site URL (default: https://ranneg.github.io/kada-london)
  PAGES_CNAME Custom domain for CNAME file (omit until you own the domain)
"""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent
DEFAULT_SITE = SRC.parent / "kada-london-site"
DEFAULT_PAGES_URL = "https://ranneg.github.io/kada-london"
LEGACY_SITE_URL = "https://www.kadalondon.com"

PATH_REWRITES = {
    'href="styles.css"': 'href="assets/kada.css"',
    'src="script.js"': 'src="assets/kada.js"',
}


def main() -> None:
    site = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SITE
    site.mkdir(parents=True, exist_ok=True)
    assets = site / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    html = (SRC / "index.html").read_text(encoding="utf-8")
    for old, new in PATH_REWRITES.items():
        html = html.replace(old, new)

    if site.name == "_site":
        pages_url = os.environ.get("PAGES_URL", DEFAULT_PAGES_URL).rstrip("/")
        html = html.replace(f"{LEGACY_SITE_URL}/", f"{pages_url}/")
        html = html.replace(LEGACY_SITE_URL, pages_url)

    (site / "index.html").write_text(html, encoding="utf-8", newline="\n")
    print("index.html")

    shutil.copy2(SRC / "styles.css", assets / "kada.css")
    shutil.copy2(SRC / "script.js", assets / "kada.js")
    print("assets/kada.css, assets/kada.js")

    src_assets = SRC / "assets"
    if src_assets.is_dir():
        for f in src_assets.iterdir():
            if f.is_file():
                shutil.copy2(f, assets / f.name)
        print("assets/* (logo, reels, photos)")

    cname = os.environ.get("PAGES_CNAME", "").strip()
    if site.name == "_site" and cname:
        (site / "CNAME").write_text(f"{cname}\n", encoding="utf-8", newline="\n")
        print(f"CNAME -> {cname}")

    print(f"\nDone -> {site}")


if __name__ == "__main__":
    main()
