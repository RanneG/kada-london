"""Build the Kada London static site for deploy (UTF-8 safe).

Usage:
  python deploy.py              # sibling ../kada-london-site (legacy)
  python deploy.py _site        # GitHub Actions / local Pages preview

Environment (optional, for `python deploy.py _site` / CI):
  PAGES_URL      Public site URL (default: https://ranneg.github.io/kada-london)
  PAGES_CNAME    Custom domain for CNAME file (omit until you own the domain)
  PREVIEW_MODE   "1" (default) injects noindex + minifies assets for client previews
"""
from __future__ import annotations

import os
import re
import shutil
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parent
DEFAULT_SITE = SRC.parent / "kada-london-site"
DEFAULT_PAGES_URL = "https://ranneg.github.io/kada-london"
LEGACY_SITE_URL = "https://www.kadalondon.com"
ROBOTS_PREVIEW = '  <meta name="robots" content="noindex, nofollow" />\n'

PATH_REWRITES = {
    'href="styles.css"': 'href="assets/kada.css"',
    'src="script.js"': 'src="assets/kada.js"',
}


def _truthy(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def minify_html(html: str) -> str:
    html = re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)
    html = re.sub(r">\s+<", "><", html)
    return re.sub(r"\s{2,}", " ", html).strip()


def harden_production(site: Path) -> None:
    try:
        from rcssmin import cssmin
        from rjsmin import jsmin
    except ImportError:
        print("minify skipped (pip install rjsmin rcssmin)")
        return

    index = site / "index.html"
    index.write_text(minify_html(index.read_text(encoding="utf-8")), encoding="utf-8")

    css_path = site / "assets" / "kada.css"
    css_path.write_text(cssmin(css_path.read_text(encoding="utf-8")), encoding="utf-8")

    js_path = site / "assets" / "kada.js"
    js_path.write_text(jsmin(js_path.read_text(encoding="utf-8")), encoding="utf-8")
    print("hardened: minified HTML, CSS, JS")


def main() -> None:
    site = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SITE
    is_pages_build = site.name == "_site"
    preview_mode = _truthy(os.environ.get("PREVIEW_MODE"), default=is_pages_build)

    site.mkdir(parents=True, exist_ok=True)
    assets = site / "assets"
    assets.mkdir(parents=True, exist_ok=True)

    html = (SRC / "index.html").read_text(encoding="utf-8")
    for old, new in PATH_REWRITES.items():
        html = html.replace(old, new)

    if is_pages_build:
        pages_url = os.environ.get("PAGES_URL", DEFAULT_PAGES_URL).rstrip("/")
        html = html.replace(f"{LEGACY_SITE_URL}/", f"{pages_url}/")
        html = html.replace(LEGACY_SITE_URL, pages_url)
        if preview_mode and 'name="robots"' not in html:
            html = html.replace("</head>", f"{ROBOTS_PREVIEW}</head>", 1)

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

    if is_pages_build:
        (site / ".nojekyll").write_text("", encoding="utf-8")
        if preview_mode:
            harden_production(site)

    cname = os.environ.get("PAGES_CNAME", "").strip()
    if is_pages_build and cname:
        (site / "CNAME").write_text(f"{cname}\n", encoding="utf-8", newline="\n")
        print(f"CNAME -> {cname}")

    print(f"\nDone -> {site}")


if __name__ == "__main__":
    main()
