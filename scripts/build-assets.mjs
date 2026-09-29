// Builds /public/brand from the brand kit. Run scripts/extract-ai.py first.
//   logo/   official lockups, background removed, fill=currentColor, cropped
//   glyph/  single icons split out of the Basic Iconset artboard
//   ill/    curated illustrations, optimised, black ink on transparent (used as CSS masks)
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { optimize } from 'svgo';
import { svgPathBbox } from 'svg-path-bbox';

const ROOT = path.resolve(import.meta.dirname, '..');
const AI = path.join(ROOT, '.cache/ai');
const ILL = path.join(ROOT, 'brand-kit/Brand Identity Design/Illustration Set/Universal/Milky Way Illustrations');
const OUT = path.join(ROOT, 'public/brand');
const PAGE_BG = /<path transform="matrix\(1,0,0,-1,0,1080\)" d="M0 1080H1920V0H0Z"\/>/g;

for (const dir of ['logo', 'glyph', 'ill']) fs.mkdirSync(path.join(OUT, dir), { recursive: true });

const svgoConfig = {
  multipass: true,
  floatPrecision: 1,
  plugins: ['preset-default', 'removeDimensions', 'removeTitle'],
};

async function inkBounds(svg) {
  const png = await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).png().toBuffer();
  const { info } = await sharp(png).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  return { x: -info.trimOffsetLeft, y: -info.trimOffsetTop, w: info.width, h: info.height };
}

// ---------- logos ----------
const LOGOS = {
  '01': 'wordmark-stacked',
  '03': 'wordmark-horizontal',
  '05': 'lockup-tagline-stacked',
  '09': 'seal',
  11: 'lockup-presents-stacked',
  13: 'lockup-presents-horizontal',
  15: 'lockup-tagline-horizontal',
  '07': 'app-icon',
};
for (const [n, name] of Object.entries(LOGOS)) {
  let s = fs
    .readFileSync(path.join(AI, `logo-${n}.svg`), 'utf8')
    .replace(/ xmlns:inkscape="[^"]*"/, '')
    .replace(/ inkscape:[a-z]+="[^"]*"/g, '');
  const keepColor = name === 'app-icon';
  s = keepColor ? s.replace(PAGE_BG, (m, i) => (i === s.indexOf(m) ? '' : m)) : s.replace(PAGE_BG, '');
  if (!keepColor) s = s.replace(/ fill="#(ffffff|000000)"/gi, '');
  s = s.replace(/<clipPath id="clip_\d+">\s*<\/clipPath>/g, '').replace(/ clip-path="url\(#clip_\d+\)"/g, '');
  const b = await inkBounds(s);
  const pad = 2;
  s = s.replace(
    'width="1920" height="1080" viewBox="0 0 1920 1080"',
    `viewBox="${b.x - pad} ${b.y - pad} ${b.w + pad * 2} ${b.h + pad * 2}"${keepColor ? '' : ' fill="currentColor"'}`,
  );
  // Keep every letter its own path: the hero moves them independently.
  // Full precision: the lockups' small text is font glyphs drawn in 0–1 em units.
  s = optimize(s, {
    ...svgoConfig,
    floatPrecision: 4,
    plugins: [{ name: 'preset-default', params: { overrides: { mergePaths: false } } }, 'removeDimensions'],
  }).data;
  fs.writeFileSync(path.join(OUT, 'logo', `${name}.svg`), s);
}

// The Masters' Union University mark: the top band of the official stacked lockup,
// cropped by viewBox at the first clear row gap so the mark itself is untouched.
{
  const s = fs.readFileSync(path.join(OUT, 'logo', 'lockup-presents-stacked.svg'), 'utf8');
  const [vx, vy, vw, vh] = s
    .match(/viewBox="([^"]+)"/)[1]
    .split(/\s+/)
    .map(Number);
  const scale = 4;
  const { data, info } = await sharp(Buffer.from(s.replace('fill="currentColor"', 'fill="#000"')), { density: 72 * scale })
    .flatten({ background: '#fff' })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const inkRow = (y) => {
    for (let x = 0; x < info.width; x++) if (data[y * info.width + x] < 128) return true;
    return false;
  };
  let y = 0;
  while (y < info.height && !inkRow(y)) y++;
  let gap = 0;
  let end = y;
  for (; y < info.height; y++) {
    if (inkRow(y)) {
      gap = 0;
      end = y;
    } else if (++gap > 6 * scale && end > 0) {
      // "PRESENTS" sits close under the MU mark; the wordmark follows after a wider gap.
      const rowsBelow = [...Array(8 * scale).keys()].some((k) => y + k < info.height && inkRow(y + k));
      if (!rowsBelow) break;
    }
  }
  let x0 = info.width;
  let x1 = 0;
  for (let yy = 0; yy <= end; yy++) {
    for (let x = 0; x < info.width; x++) {
      if (data[yy * info.width + x] < 128) {
        x0 = Math.min(x0, x);
        x1 = Math.max(x1, x);
      }
    }
  }
  const k = vw / info.width;
  const crop = s.replace(
    /viewBox="[^"]+"/,
    `viewBox="${(vx + (x0 - 2) * k).toFixed(1)} ${vy} ${((x1 - x0 + 4) * k).toFixed(1)} ${(((end + 2) / info.height) * vh).toFixed(1)}"`,
  );
  // The top band is the Masters' Union University mark alone.
  fs.writeFileSync(path.join(OUT, 'logo', 'mu-logo.svg'), crop);
}

// The stacked wordmark ships separately as per-letter paths for the hero (see components/Wordmark).
{
  const s = fs.readFileSync(path.join(OUT, 'logo', 'wordmark-stacked.svg'), 'utf8');
  const viewBox = s.match(/viewBox="([^"]+)"/)[1];
  const paths = [...s.matchAll(/<path[^>]*d="([^"]+)"[^>]*\/>/g)].map((m) => {
    const t = m[0].match(/transform="([^"]+)"/);
    return { d: m[1], transform: t ? t[1] : null };
  });
  fs.writeFileSync(path.join(ROOT, 'src/content/wordmark-paths.json'), JSON.stringify({ viewBox, paths }, null, 1));
}

// ---------- glyphs from the Basic Iconset artboard ----------
// Cells are in the artboard's 1920x1080 space (measured from the kit's JPG proof).
const GLYPHS = {
  star: [154, 86, 278, 202],
  music: [336, 86, 442, 206],
  energy: [480, 91, 586, 202],
  explore: [634, 96, 768, 202],
  opportunity: [1651, 96, 1766, 197],
  live: [998, 274, 1094, 374],
  forward: [1344, 274, 1450, 360],
  tickets: [1517, 274, 1632, 360],
  location: [1018, 461, 1085, 538],
  crew: [634, 643, 778, 763],
  flagship: [1402, 643, 1488, 768],
  'special-point': [518, 845, 643, 955],
  checked: [318, 850, 435, 955],
  milestone: [1114, 854, 1200, 955],
};
{
  const sheet = fs.readFileSync(path.join(AI, 'icons-01.svg'), 'utf8');
  const body = sheet.replace(/<defs>[\s\S]*?<\/defs>/, '');
  const items = [...body.matchAll(/<path([^>]*)\/>/g)]
    .map((m) => {
      const attrs = m[1];
      const d = attrs.match(/ d="([^"]+)"/)?.[1];
      const t = attrs
        .match(/transform="matrix\(([^)]+)\)"/)?.[1]
        ?.split(',')
        .map(Number) ?? [1, 0, 0, 1, 0, 0];
      const fill = attrs.match(/fill="([^"]+)"/)?.[1] ?? '#000000';
      const rule = attrs.match(/fill-rule="([^"]+)"/)?.[1];
      if (!d) return null;
      const [x0, y0, x1, y1] = svgPathBbox(d);
      const [a, b, c, dd, e, f] = t;
      const pts = [
        [x0, y0],
        [x1, y0],
        [x0, y1],
        [x1, y1],
      ].map(([x, y]) => [a * x + c * y + e, b * x + dd * y + f]);
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      return { d, t, fill, rule, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] };
    })
    .filter(Boolean);
  const glyphManifest = {};
  for (const [name, [cx0, cy0, cx1, cy1]] of Object.entries(GLYPHS)) {
    const mine = items.filter(({ box }) => {
      const cx = (box[0] + box[2]) / 2;
      const cy = (box[1] + box[3]) / 2;
      return cx > cx0 && cx < cx1 && cy > cy0 && cy < cy1 && box[2] - box[0] < 400;
    });
    if (!mine.length) {
      console.warn('glyph not found', name);
      continue;
    }
    const bx0 = Math.min(...mine.map((p) => p.box[0]));
    const by0 = Math.min(...mine.map((p) => p.box[1]));
    const bx1 = Math.max(...mine.map((p) => p.box[2]));
    const by1 = Math.max(...mine.map((p) => p.box[3]));
    // Light (#ffffff) paths are ink; dark paths drawn over them are cut-outs (the eye's pupil).
    // A mask keeps those cut-outs as real holes whatever colour the glyph is painted.
    const paths = mine
      .map((p) => {
        const ink = /^#f/i.test(p.fill) ? '#fff' : '#000';
        return `<path transform="matrix(${p.t.join(',')})" d="${p.d}"${p.rule ? ` fill-rule="${p.rule}"` : ''} fill="${ink}"/>`;
      })
      .join('');
    const pad = 1;
    const [vx, vy, vw, vh] = [bx0 - pad, by0 - pad, bx1 - bx0 + pad * 2, by1 - by0 + pad * 2].map((v) => +v.toFixed(1));
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}"><mask id="g" maskUnits="userSpaceOnUse" x="${vx}" y="${vy}" width="${vw}" height="${vh}">${paths}</mask><rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="currentColor" mask="url(#g)"/></svg>`;
    svg = optimize(svg, svgoConfig).data;
    fs.writeFileSync(path.join(OUT, 'glyph', `${name}.svg`), svg);
    glyphManifest[name] = +(vw / vh).toFixed(4);
  }
  fs.writeFileSync(path.join(ROOT, 'src/content/glyphs.json'), JSON.stringify(glyphManifest, null, 1));
}

// ---------- illustrations ----------
// (glyph ratios are written inside the glyph block above)
const ILLUSTRATIONS = {
  'ringed-planet-1': '03 Planets/Ringed planet 1.svg',
  'ringed-planet-2': '03 Planets/Ringed planet 2.svg',
  'ringed-planet-4': '03 Planets/Ringed planet 4.svg',
  asteroid: '03 Planets/Asteroid.svg',
  'comet-1': '02 Comets/Comet 1.svg',
  'comet-4': '02 Comets/Comet 4.svg',
  'shooting-star-1': '05 Shooting Stars/Shooting star 1.svg',
  'shooting-star-6': '05 Shooting Stars/Shooting star 6.svg',
  'spiral-galaxy': '04 Phenomena/Spiral galaxy 1.svg',
  portal: '04 Phenomena/Portal 1.svg',
  'black-hole': '04 Phenomena/Black hole 1.svg',
  starburst: '04 Phenomena/Starburst 1.svg',
  'burst-2': '06 Stars and Bursts/Burst 2.svg',
  'star-outline': '06 Stars and Bursts/Star 1.svg',
  'star-solid': '06 Stars and Bursts/Star 4.svg',
  'full-moon': '07 Moons/Full moon 1.svg',
  crescent: '07 Moons/Crescent moon 2.svg',
  'playground-1': '01 Planet Playgrounds/Planet playground 1.svg',
  'playground-3': '01 Planet Playgrounds/Planet playground 3.svg',
  'playground-5': '01 Planet Playgrounds/Planet playground 5.svg',
  'playground-9': '01 Planet Playgrounds/Planet playground 9.svg',
  'badge-guitar': '01 Planet Playgrounds/Badges/Planet playground badge - Guitar star (light).svg',
  'badge-keyboard': '01 Planet Playgrounds/Badges/Planet playground badge - Keyboard star (light).svg',
  'badge-rollercoaster': '01 Planet Playgrounds/Badges/Planet playground badge - Rollercoaster (light).svg',
  'badge-skate': '01 Planet Playgrounds/Badges/Planet playground badge - Skate ramp (light).svg',
  'badge-crystal': '01 Planet Playgrounds/Badges/Planet playground badge - Crystal blocks (light).svg',
  'badge-flag': '01 Planet Playgrounds/Badges/Planet playground badge - Flag peak (light).svg',
  sparkle: '08 Icon Sets/All icons 1/Sparkle.svg',
};
const manifest = {};
for (const [slug, rel] of Object.entries(ILLUSTRATIONS)) {
  const src = fs.readFileSync(path.join(ILL, rel), 'utf8');
  if (/<rect[^>]*fill="#000000"/i.test(src)) console.warn('has background plate (not mask-safe):', rel);
  const out = optimize(src, svgoConfig).data;
  const vb = out
    .match(/viewBox="([^"]+)"/)[1]
    .split(/\s+/)
    .map(Number);
  manifest[slug] = { ratio: +(vb[2] / vb[3]).toFixed(4), source: rel };
  fs.writeFileSync(path.join(OUT, 'ill', `${slug}.svg`), out);
}
fs.writeFileSync(path.join(ROOT, 'src/content/illustrations.json'), JSON.stringify(manifest, null, 1));

// ---------- icons for the browser ----------
{
  const icon = fs.readFileSync(path.join(OUT, 'logo', 'app-icon.svg'), 'utf8');
  fs.writeFileSync(path.join(ROOT, 'src/app/icon.svg'), icon);
  await sharp(Buffer.from(icon), { density: 300 }).resize(180, 180).png().toFile(path.join(ROOT, 'src/app/apple-icon.png'));
}

// ---------- social card (1200x630): official lockup + kit planet, no added copy ----------
{
  const lockup = fs
    .readFileSync(path.join(OUT, 'logo', 'lockup-presents-horizontal.svg'), 'utf8')
    .replace('fill="currentColor"', 'fill="#f8f5ed"');
  const planet = fs.readFileSync(path.join(OUT, 'ill', 'ringed-planet-2.svg'), 'utf8');
  const lockupPng = await sharp(Buffer.from(lockup), { density: 300 }).resize({ width: 820 }).png().toBuffer();
  // The illustration is black ink on transparent: use it as a mask over Electric Purple.
  const planetMask = await sharp(Buffer.from(planet), { density: 200 })
    .resize({ width: 560 })
    .rotate(-14, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const pm = await sharp(planetMask).metadata();
  const planetPng = await sharp({ create: { width: pm.width, height: pm.height, channels: 4, background: '#d845fc' } })
    .composite([{ input: planetMask, blend: 'dest-in' }])
    .png()
    .toBuffer();
  const lm = await sharp(lockupPng).metadata();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#161417' } })
    .composite([
      { input: planetPng, left: 820, top: -150 },
      { input: lockupPng, left: Math.round((1200 - lm.width) / 2) - 40, top: Math.round((630 - lm.height) / 2) + 20 },
    ])
    .png()
    .toFile(path.join(ROOT, 'public/og.png'));
}

const size = (dir) => fs.readdirSync(path.join(OUT, dir)).reduce((n, f) => n + fs.statSync(path.join(OUT, dir, f)).size, 0);
console.log('logo', size('logo'), 'glyph', size('glyph'), 'ill', size('ill'), 'bytes');
