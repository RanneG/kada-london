# Kada London — performance audit

Lighthouse run: local `python -m http.server` (Jun 2026).

## Baseline (before fixes)

| Category | Desktop | Mobile |
|----------|---------|--------|
| Performance | 62 | 73 |
| Accessibility | 96 | — |
| Best practices | 100 | — |
| SEO | 100 | — |

**Payload:** ~16.6 MB (three reels fetched on first paint).

## After fixes (Jun 2026)

| Category | Desktop | Mobile |
|----------|---------|--------|
| Performance | **72** | **72** |
| Accessibility | 96 | — |
| Best practices | 100 | — |
| SEO | 100 | — |

**Payload:** ~2.2 MB. Speed Index desktop **17.7 s → 2.5 s**. TBT **50 ms → 0 ms**.

LCP remains ~9 s on local audit because the **cinematic intro** intentionally delays hero video playback — acceptable for the experience; use `prefers-reduced-motion` for instant path.

## Fixes shipped

1. **Video compression** — reels re-encoded to 720p H.264 (`-crf 28`, `faststart`): ~15 MB → ~4.3 MB total.
2. **Lazy video hydration** — hero/cinema use `data-src` + `preload="none"`; `loadVideo()` runs after intro or when cinema nears viewport.
3. **Hero poster** — `food-spread.jpg` as LCP-friendly poster + `<link rel="preload">`.
4. **Deferred scripts** — GSAP, Lenis, and app JS use `defer`.
5. **Font trim** — DM Sans 400/500/600 + Instrument Serif only (drop unused italics/weights).
6. **Contrast** — bumped `--muted` and paper nav text for WCAG AA.
7. **Structured data** — `Restaurant` JSON-LD in `index.html`.

## Re-run audit

```bash
cd kada-landing
python -m http.server 8767
npx lighthouse http://127.0.0.1:8767 --only-categories=performance,accessibility --quiet
```

## Still worth doing (next)

| Priority | Item | Why |
|----------|------|-----|
| P1 | WebM/AV1 alternate sources | Smaller decode on Chrome/Android |
| P1 | Self-host GSAP (or subset) | Cut third-party main-thread + CDN hop |
| P2 | Responsive JPEG/WebP for story/cinema stills | ~1.2 MB images still eager in cinema |
| P2 | `content-visibility: auto` on signatures/visit | Less layout/paint below fold |
| P3 | Signatures scroll moment | UX polish, not perf-critical |

## Re-compress reels after re-download

```powershell
ffmpeg -i assets/reel-hero.mp4 -vf "scale=-2:720" -c:v libx264 -crf 28 -preset medium -movflags +faststart -an assets/reel-hero-out.mp4
```

Replace the file when satisfied with quality.
