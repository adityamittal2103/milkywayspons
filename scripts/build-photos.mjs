// Photos and logos from the sponsorship deck ("V1: Master Sponsorship deck").
// Input: a folder of images exported from the deck, named s<slide>-<n>.<ext>,
// and scripts/photos.map.json, which names each one used on the site.
//   node scripts/build-photos.mjs <folder>
// Output: public/deck/<id>-{800,1600}.webp, public/deck/logo-<id>.png and
// src/content/photos.json (dimensions + provenance for every shipped raster).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, '.cache/deck-images'));
const OUT = path.join(ROOT, 'public/deck');
const map = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'photos.map.json'), 'utf8'));
fs.mkdirSync(OUT, { recursive: true });

const manifest = {};
for (const [id, spec] of Object.entries(map.photos)) {
  const file = path.join(SRC, spec.file);
  if (!fs.existsSync(file)) {
    console.warn('missing', spec.file);
    continue;
  }
  const base = sharp(file).rotate();
  const meta = await base.metadata();
  const crop = spec.crop; // optional [left, top, width, height] in source pixels
  const pipeline = () => (crop ? sharp(file).rotate().extract({ left: crop[0], top: crop[1], width: crop[2], height: crop[3] }) : sharp(file).rotate());
  const w = crop ? crop[2] : meta.width;
  const h = crop ? crop[3] : meta.height;
  for (const width of [800, 1600]) {
    await pipeline()
      .resize({ width: Math.min(width, w), withoutEnlargement: true })
      .webp({ quality: 72 })
      .toFile(path.join(OUT, `${id}-${width}.webp`));
  }
  manifest[id] = { w: Math.min(1600, w), h: Math.round((Math.min(1600, w) / w) * h), source: `deck slide ${spec.slide}`, file: spec.file };
}

// Logos: flattened to a single ink so a mixed wall reads as one system.
// alpha = how far a pixel is from the logo's own background colour.
for (const [id, spec] of Object.entries(map.logos || {})) {
  const file = path.join(SRC, spec.file);
  if (!fs.existsSync(file)) {
    console.warn('missing logo', spec.file);
    continue;
  }
  const img = sharp(file).rotate().ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  // The logo's own ground: an opaque corner pixel (a black HYROX plate, a red
  // SuperYou plate), or white when the corners are transparent.
  const px = (x, y) => [...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4)];
  const corner = [px(1, 1), px(info.width - 2, 1), px(1, info.height - 2), px(info.width - 2, info.height - 2)].find((c) => c[3] > 200);
  const bg = spec.bg || (corner ? corner.slice(0, 3) : [255, 255, 255]);
  const t = spec.threshold ?? 0.12;
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3] / 255;
    // 'dark' keeps only dark marks (Ferrari's horse off its yellow shield).
    const d =
      spec.mode === 'dark'
        ? 1 - (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
        : Math.max(Math.abs(r - bg[0]), Math.abs(g - bg[1]), Math.abs(b - bg[2])) / 255;
    const ink = Math.min(1, Math.max(0, (d - t) / 0.5)) * a;
    out[i * 4] = 255;
    out[i * 4 + 1] = 255;
    out[i * 4 + 2] = 255;
    out[i * 4 + 3] = Math.round((spec.invert ? 1 - ink : ink) * 255);
  }
  const trimmed = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png()
    .toBuffer({ resolveWithObject: true });
  await sharp(trimmed.data)
    .resize({ height: Math.min(240, trimmed.info.height), withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, `logo-${id}.png`));
  manifest[`logo-${id}`] = { w: trimmed.info.width, h: trimmed.info.height, source: `deck slide ${spec.slide}`, file: spec.file };
}

fs.writeFileSync(path.join(ROOT, 'src/content/photos.json'), JSON.stringify(manifest, null, 1));
console.log(Object.keys(manifest).length, 'rasters');
