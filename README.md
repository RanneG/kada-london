# Kada London — landing page

Award-tier marketing site for [Kada London](https://www.kadalondon.com) (Filipino Kitchen & Bar).

## Three signature animations

1. **Logo cinematic intro** — progress ring, counter, curtain wipe into hero
2. **Dual-reel cinema** — pinned fullscreen section; food + restaurant Instagram reels crossfade on scroll
3. **Sticky category menu** — vertical scroll with side nav (desktop) or filter chips (mobile)

## Stack

- **GSAP + ScrollTrigger + Lenis** — smooth scroll, pinning, playback
- **Self-hosted reel MP4s** in `assets/` (from [@kada_ldn](https://www.instagram.com/kada_ldn/))
- **Brand logo** — `assets/logo.svg`

## Preview locally

```bash
cd kada-landing
python -m http.server 8080
```

Open http://localhost:8080

## Build (production paths)

```bash
python deploy.py _site
python -m http.server 8080 --directory _site
```

## Deploy

**GitHub Actions** deploys to **GitHub Pages** on every push to `main`.

1. Enable **Pages** in repo settings → Source: **GitHub Actions**
2. Set custom domain **`www.kadalondon.com`** (CNAME written by `deploy.py` into `_site`)
3. Point DNS at GitHub Pages (CNAME `www` → `<user>.github.io` or A records for apex)

Manual build to a sibling site folder (optional):

```bash
python deploy.py ../kada-london-site
```

## Assets

| File | Source |
|------|--------|
| `reel-hero.mp4` | [Instagram reel](https://www.instagram.com/reel/DZDNeHINiXT/) |
| `reel-food.mp4` | [Instagram reel](https://www.instagram.com/reel/C6RbKdnM3V-/) |
| `reel-restaurant.mp4` | [Instagram reel](https://www.instagram.com/reel/DUv2QQKiFa_/) |

Re-download a reel:

```bash
python -m yt_dlp -f "best[ext=mp4]/best" -o "assets/reel-hero.%(ext)s" "https://www.instagram.com/reel/DZDNeHINiXT/"
```

## Menu

Full menu is in `script.js` (`MENU_PANELS`). Update prices/items there.
