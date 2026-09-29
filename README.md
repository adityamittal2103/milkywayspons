# Milky Way — Sponsorship microsite

The sponsorship site for **Milky Way**, Masters' Union University's intercollegiate cultural festival (MU Fest 2027, theme Deep Space). 20th–21st February 2027, Yashobhoomi Convention Center, Delhi.

Next.js (App Router), exported as a fully static site. GSAP for scroll and motion. No backend.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/milky-way.ts` | Every fact, number, tier and contact on the site, with the deck slide it came from. Edit copy here, not in components. |
| `src/components/sections/` | One file per section, in page order: Hero, Prologue, Origin, MilkyWay, Road, Landing, Worlds, Reach, Company, Tiers, Signal, Footer. |
| `src/components/Trajectory.tsx` | The flight path: one route through every `[data-anchor]` on the page, drawn as you scroll. |
| `src/app/globals.css` | Tokens: the brand palette, type scale, spacing, the margin rail, field colours per section. |
| `public/brand/` | Official logos, glyphs and illustrations, generated from the brand kit (below). |
| `PRODUCT.md` | Product context and the content rules: what may and may not be claimed. |

## Content rules

The source of truth for facts is the Master Sponsorship deck (live slides 1–29; slides 30+ are marked as backup). Copy may be shortened for layout, never strengthened. Not in the deck, so not on the site: prices, the names of the seven Road to Milky Way cities, headliners, venue capacity.

## Brand assets

Assets are built from the Milky Way brand kit (Google Drive, not committed: the Figma master alone is 247 MB). To rebuild them, place the kit at `brand-kit/` and run:

```bash
python3 -m venv .venv && .venv/bin/pip install pymupdf
.venv/bin/python scripts/extract-ai.py   # Illustrator masters -> SVG
npm run assets                           # clean, crop, optimise into public/brand
```

## Deck photos and logos

Photos and partner logos come from the sponsorship deck. Export the deck's images into `.cache/deck-images/` (named `s<slide>-<n>.<ext>`), map them in `scripts/photos.map.json`, then:

```bash
node scripts/build-photos.mjs .cache/deck-images
```

This writes two WebP widths per photo to `public/deck/`, flattens each logo to a single white ink (the site paints it via CSS mask), and records dimensions plus source slide in `src/content/photos.json`. On the page, photos are printed in the ink of the section they sit on and return to colour on hover.

## Fonts

The kit names Roadland (cultural fest display) and Brandon Grotesque (support) as brand typefaces. Both are commercial and were not supplied as files, so the site uses Bricolage Grotesque (the face used in the kit's own wordmark-rationale sheet) and Geist Mono for coordinates and data, both open-licensed. Swap in licensed webfont files via `next/font/local` in `src/app/layout.tsx` when available.
