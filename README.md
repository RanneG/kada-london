# Kada London — landing page

Award-tier marketing site for **Kada London** (Filipino Kitchen & Bar).

**Live (GitHub Pages):** https://ranneg.github.io/kada-london/

## v2 — Smoke & Ember

Editorial direction: **street grill → the table**. Instrument Serif + DM Sans, ember accent, scroll-driven palette morph (night → paper menu), asymmetric cinema split, menu curtain wipe, custom cursor (desktop).

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

1. Repo **Settings → Pages → Build and deployment → Source:** **GitHub Actions**
2. After the workflow succeeds, the site is at **https://ranneg.github.io/kada-london/**

### Client preview (hide source, not the site)

Anyone with the link can **view** the site. You cannot fully stop someone from saving what loads in a browser — but you can keep them off your **editable source**:

| Step | Why |
|------|-----|
| **Settings → General → Danger zone → Change visibility → Private** | Source repo is not browsable on GitHub. Pages stays public at the `github.io` URL. |
| **Only send the `github.io` link** | Don’t link to the repo or invite them as collaborators. |
| **Production build minifies HTML/CSS/JS** | Deploy strips comments and minifies assets (`PREVIEW_MODE=1` in CI). View-source is ugly, not a clean copy. |
| **`noindex` on preview** | Search engines won’t list the preview URL. |

**Reality check:** a motivated dev can still reconstruct a static site from DevTools. For a client sign-off, private repo + minified Pages is the standard approach. For stronger lock-down later, use password-protected hosting (Netlify/Vercel) or a screen recording.

### Custom domain later

When you buy **kadalondon.com**, in repo **Settings → Pages → Custom domain** add `www.kadalondon.com`, point DNS at GitHub, then set the deploy secret/env:

```yaml
# .github/workflows/deploy.yml — add to the build job env:
env:
  PAGES_CNAME: www.kadalondon.com
  PAGES_URL: https://www.kadalondon.com
```

Until then, no CNAME file is written — the default `*.github.io` URL works as-is.

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
