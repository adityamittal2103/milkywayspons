// Builds the Milky Way sponsorship deck (Deck changes, Chirag: "make this in
// ppt/pdf format also, formatted, not directly the same as the website").
//
// One layout spec, two renderers: an editable PowerPoint (pptxgenjs, theme
// colours and fonts, layouts with title placeholders, sections, notes) and an
// HTML twin at the same coordinates that Chrome prints to PDF and screenshots
// for checking. Content comes from src/content/milky-way.ts, as on the site.
//
//   node deck/build-deck.cjs            → deck/Milky-Way-Sponsorship-2027.pptx + .pdf
//
// Fonts: Bricolage Grotesque (Google Fonts). Google Slides has it built in;
// PowerPoint needs it installed, or it substitutes.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require('sharp');
const pptxgen = require('pptxgenjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = __dirname;
const BUILD = path.join(OUT, '.build');
const ASSETS = path.join(BUILD, 'assets');
fs.mkdirSync(ASSETS, { recursive: true });
const NAME = 'Milky-Way-Sponsorship-2027';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SKILL = process.env.PPTX_SKILL;

// ---------- content: the site's own content module, read as data ----------
function loadContent() {
  const ts = require(path.join(ROOT, 'node_modules/typescript'));
  const src = fs.readFileSync(path.join(ROOT, 'src/content/milky-way.ts'), 'utf8');
  const { outputText } = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', outputText)(mod.exports, mod, require);
  return mod.exports;
}
const K = loadContent();
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/india-map.json'), 'utf8'));
const photosMeta = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/photos.json'), 'utf8'));

// ---------- palette: the brand kit ----------
const HEX = {
  black: '161417',
  paper: 'F8F5ED',
  deep: '25246F',
  muted: 'CFC9BC',
  yellow: 'FFD000',
  purple: 'D845FC',
  cyan: '1BBDE3',
  lime: 'ACE635',
  plum: '8230C2',
  indigo: '2F2FA9',
  vermilion: 'DA491D',
};
const THEME = {
  name: 'Milky Way',
  headFontFace: 'Bricolage Grotesque',
  bodyFontFace: 'Bricolage Grotesque',
  colors: {
    dk1: HEX.black,
    lt1: HEX.paper,
    dk2: HEX.deep,
    lt2: HEX.muted,
    accent1: HEX.yellow,
    accent2: HEX.purple,
    accent3: HEX.cyan,
    accent4: HEX.lime,
    accent5: HEX.plum,
    accent6: HEX.indigo,
    hlink: HEX.cyan,
    folHlink: HEX.purple,
  },
};
// Brand colour name → theme slot (pptx) — every colour in the deck is one of these
const SLOT = {
  black: 'text1',
  paper: 'background1',
  deep: 'text2',
  muted: 'background2',
  yellow: 'accent1',
  purple: 'accent2',
  cyan: 'accent3',
  lime: 'accent4',
  plum: 'accent5',
  indigo: 'accent6',
};

// ---------- canvas ----------
const W = 13.333;
const H = 7.5;
const M = 0.6;
const PX = 144; // HTML px per inch: 1920 × 1080

// ---------- layouts: one per field colour ----------
const TITLE = { x: M, y: 0.85, w: 9.6, h: 1.5, size: 36 };
const LAYOUTS = {
  COVER: { bg: 'black', ink: 'paper', title: null, footer: false },
  STATEMENT: { bg: 'black', ink: 'paper', title: { x: M, y: 1.35, w: 10.4, h: 3.4, size: 66 }, footer: true },
  DARK: { bg: 'black', ink: 'paper', title: TITLE, footer: true },
  DARK_OPEN: { bg: 'black', ink: 'paper', title: null, footer: true },
  DEEP: { bg: 'deep', ink: 'paper', title: TITLE, footer: true },
  INDIGO: { bg: 'indigo', ink: 'paper', title: TITLE, footer: true },
  PLUM: { bg: 'plum', ink: 'paper', title: TITLE, footer: true },
  PURPLE: { bg: 'purple', ink: 'black', title: TITLE, footer: true },
  CYAN: { bg: 'cyan', ink: 'black', title: TITLE, footer: true },
  LIME: { bg: 'lime', ink: 'black', title: TITLE, footer: true },
  PAPER: { bg: 'paper', ink: 'black', title: TITLE, footer: true },
};
const FOOTER = { x: M, y: 7.0, w: 6, h: 0.22, size: 9, text: 'MILKY WAY  ·  SPONSORSHIP 2027' };
const PAGE_NO = { x: W - M - 0.8, y: 7.0, w: 0.8, h: 0.22, size: 9 };

// ---------- assets ----------
const cache = new Map();
const rgb = (hex) => ({ r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) });

/** A kit illustration, glyph or logo painted in one ink (its alpha is the mask, as on the site). */
async function ink(src, color, widthPx = 1200) {
  const key = `${src}|${color}|${widthPx}`;
  if (cache.has(key)) return cache.get(key);
  const file = path.join(ASSETS, `${path.basename(src).replace(/\.\w+$/, '')}-${color}-${widthPx}.png`);
  const alpha = await sharp(src, { density: 600 }).resize({ width: widthPx }).ensureAlpha().extractChannel(3).raw().toBuffer({ resolveWithObject: true });
  const { width, height } = alpha.info;
  await sharp({ create: { width, height, channels: 3, background: rgb(HEX[color]) } })
    .joinChannel(alpha.data, { raw: { width, height, channels: 1 } })
    .png()
    .toFile(file);
  const out = { file, ratio: width / height };
  cache.set(key, out);
  return out;
}
const ill = (name, color, px) => ink(path.join(ROOT, 'public/brand/ill', `${name}.svg`), color, px);
const logo = (name, color, px) => ink(path.join(ROOT, 'public/brand/logo', `${name}.svg`), color, px);
const glyph = (name, color, px = 256) => ink(path.join(ROOT, 'public/brand/glyph', `${name}.svg`), color, px);

/** A deck photograph, cropped to the box it fills (cover), as a JPEG. */
async function photo(id, w, h, focus = 'attention') {
  const meta = photosMeta[id];
  if (!meta) throw new Error(`no photo ${id}`);
  const px = Math.min(Math.round(w * 220), meta.w);
  const file = path.join(ASSETS, `${id}-${w.toFixed(2)}x${h.toFixed(2)}.jpg`);
  if (!fs.existsSync(file))
    await sharp(path.join(ROOT, 'public/deck', `${id}-1600.webp`))
      .resize({ width: px, height: Math.round((px * h) / w), fit: 'cover', position: focus })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(file);
  return file;
}

async function remote(url, name) {
  const file = path.join(ASSETS, name);
  if (!fs.existsSync(file)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return file;
}

// ---------- the spec ----------
class Slide {
  constructor(layout, { section, title, notes }) {
    this.layout = layout;
    this.section = section;
    this.title = title; // string or runs
    this.notes = notes;
    this.ops = [];
  }
  /** content: string or [{ text, o: { color, bold, size, highlight, br } }] */
  text(x, y, w, h, content, o = {}) {
    this.ops.push({ kind: 'text', x, y, w, h, content, o });
    return this;
  }
  image(x, y, w, h, file, o = {}) {
    this.ops.push({ kind: 'image', x, y, w, h, file, o });
    return this;
  }
  rect(x, y, w, h, color, o = {}) {
    this.ops.push({ kind: 'rect', x, y, w, h, color, radius: o.radius, name: o.name });
    return this;
  }
  /** A cut plate, the site's skewed card: corners nudged by `k` inches */
  plate(x, y, w, h, color, o = {}) {
    const k = o.k ?? 0.06;
    const pts = [
      [0, k],
      [w - k * 0.6, 0],
      [w, h - k],
      [k * 0.6, h],
    ];
    this.ops.push({ kind: 'plate', x, y, w, h, color, pts, link: o.link, name: o.name });
    return this;
  }
  table(x, y, colW, rows, o = {}) {
    this.ops.push({ kind: 'table', x, y, colW, rows, o });
    return this;
  }
}

const slides = [];
const add = (layout, opts) => {
  const s = new Slide(layout, opts);
  slides.push(s);
  return s;
};
const caps = (s) => s.toUpperCase();
const kicker = (s, text, color) => s.text(M, 0.5, 9, 0.3, caps(text), { size: 11, bold: true, color, charSpacing: 2.5 });

async function compose() {
  const { festival, sky, fest, audience, venue, campus, road, learned, firsts, moments, reach, company, companyLogos, tiers, deliverables, tiersIntro, signal } = K;
  const [onCampus, atVenue] = festival.legs;

  // 1 · Cover
  {
    const s = add('COVER', {
      section: 'Opening',
      notes: `${festival.name}, presented by ${festival.presenter}. ${festival.line}. ${festival.dates}: ${onCampus.dates} at ${onCampus.place}, ${onCampus.city}; ${atVenue.dates} at ${atVenue.place}, ${atVenue.city}.`,
    });
    const planet = await ill('ringed-planet-2', 'purple', 1600);
    s.image(8.35, -0.95, 5.6, 5.6 / planet.ratio, planet.file, { name: 'Planet' });
    // The kit's presents lockup, set from its parts: its artwork reads "MU Fest 2027",
    // which the team corrected to "A Masters' Union University Fest" (6 Oct)
    const mu = await logo('mu-logo', 'paper', 1200);
    const mark = await logo('wordmark-stacked', 'paper', 1400);
    s.image(1.55, 0.9, 3.4, 3.4 / mu.ratio, mu.file, { alt: festival.presenter });
    s.text(0.85, 1.72, 4.8, 0.3, 'PRESENTS', { size: 11, bold: true, color: 'paper', charSpacing: 4, align: 'center' });
    s.image(0.85, 2.2, 4.8, 4.8 / mark.ratio, mark.file, { name: 'Milky Way', alt: 'Milky Way' });
    s.text(0.6, 2.2 + 4.8 / mark.ratio + 0.2, 5.3, 0.45, festival.lockupLine, { size: 17, bold: true, color: 'paper', align: 'center', name: 'Descriptor' });
    s.text(6.55, 3.55, 6.2, 1.5, festival.line, { size: 36, bold: true, color: 'paper', line: 0.92, name: 'Line' });
    s.text(6.55, 5.15, 6.2, 0.45, festival.dates, { size: 20, bold: true, color: 'yellow', name: 'Dates' });
    // Deck of 8 Oct: "Campus" named; the Sponsorship 2027 label dropped
    s.text(6.55, 5.62, 6.2, 0.7, `${onCampus.place} Campus, Gurugram  ·  ${atVenue.place}, Delhi`, { size: 13, color: 'muted', name: 'Places' });
    const sp = await ill('sparkle', 'yellow', 200);
    s.image(5.95, 1.0, 0.22, 0.22 / sp.ratio, sp.file);
    s.image(12.45, 4.6, 0.16, 0.16 / sp.ratio, sp.file);
    const sp2 = await ill('sparkle', 'paper', 200);
    s.image(7.1, 2.55, 0.14, 0.14 / sp2.ratio, sp2.file);
    s.image(2.4, 6.5, 0.12, 0.12 / sp2.ratio, sp2.file);
  }

  // 2 · Under one sky
  {
    const [a, b, c] = sky.title;
    const [num, ...rest] = a.split(' ');
    const s = add('STATEMENT', {
      section: 'Opening',
      title: [
        { text: num, o: { color: 'yellow' } },
        { text: ` ${rest.join(' ')}`, o: { br: true } },
        { text: b, o: { br: true } },
        { text: c, o: { color: 'yellow' } },
      ],
      notes: `${sky.title.join(' ')} The festival lands at ${sky.place}.`,
    });
    const comet = await ill('comet-1', 'yellow', 1200);
    s.image(9.7, 2.3, 2.9, 2.9 / comet.ratio, comet.file, { name: 'Comet' });
    const pin = await glyph('location', 'vermilion');
    s.image(M, 5.55, 0.42, 0.42, pin.file, { name: 'Pin' });
    s.text(1.2, 5.45, 6, 0.3, 'LANDING AT', { size: 11, bold: true, color: 'paper', charSpacing: 3 });
    s.text(1.2, 5.78, 6, 0.4, caps(sky.place), { size: 18, bold: true, color: 'yellow', charSpacing: 2 });
    const sp = await ill('sparkle', 'paper', 200);
    for (const [x, y, w] of [[11.6, 0.8, 0.18], [8.4, 1.1, 0.12], [12.3, 5.4, 0.14], [7.6, 6.1, 0.1], [10.9, 6.5, 0.16]]) s.image(x, y, w, w / sp.ratio, sp.file);
  }

  // 3 · The fest
  {
    const s = add('PLUM', {
      section: 'The festival',
      title: [{ text: `${fest.titleParts[0]} `, o: { color: 'black' } }, { text: fest.titleParts[1] }],
      notes: `${fest.label}. ${fest.title} ${fest.subhead}`,
    });
    kicker(s, fest.label, 'yellow');
    const galaxy = await ill('spiral-galaxy', 'black', 1200);
    s.image(10.25, 0.35, 2.7, 2.7 / galaxy.ratio, galaxy.file, { name: 'Galaxy' });
    s.text(M, 2.75, 8, 0.4, fest.subhead, { size: 18, color: 'paper' });
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    fest.stats.forEach((st, i) => {
      const x = M + i * (cw + 0.3);
      s.text(x, 4.1, cw, 1.2, st.value, { size: 60, bold: true, color: 'yellow', valign: 'bottom', line: 0.9, name: `Stat ${st.label}` });
      s.text(x, 5.4, cw, 0.5, st.label, { size: 18, bold: true, color: 'paper' });
    });
  }

  // 4 · The events
  {
    const [day, night] = fest.events.split(/(?<=\.) /);
    const s = add('DARK', { section: 'The festival', title: day, notes: `${fest.events} ${fest.body}` });
    s.text(M, 2.05, 9.6, 0.5, night, { size: 20, color: 'yellow', bold: true });
    const n = fest.symbols.length;
    const cw = (W - 2 * M - (n - 1) * 0.3) / n;
    for (let i = 0; i < n; i++) {
      const sym = fest.symbols[i];
      const art = await ill(sym.art, 'yellow', 900);
      const aw = 1.75;
      const x = M + i * (cw + 0.3);
      s.image(x + (cw - aw) / 2, 3.05, aw, aw / art.ratio, art.file, { name: sym.name });
      // Two-word-plus names break after "and", never at a hyphen (deck of 8 Oct)
      const [first, rest] = sym.name.split(/ and /i);
      const label = rest ? [{ text: caps(`${first} and`), o: { br: true } }, { text: caps(rest) }] : caps(sym.name);
      s.text(x, 5.0, cw, 0.6, label, { size: 13, bold: true, color: 'paper', align: 'center', charSpacing: 1 });
    }
    s.text(M, 5.9, 11.5, 0.8, fest.body, { size: 16, color: 'muted' });
  }

  // 5 · Road to Milky Way
  {
    const s = add('DARK', {
      section: 'Road to Milky Way',
      title: road.title,
      notes: `${road.name} ${road.what} ${road.subhead} The cities, in order: ${road.stops.join(', ')}; then everyone meets in Delhi, at Yashobhoomi.`,
    });
    kicker(s, road.name, 'yellow');
    s.text(M, 1.6, 5.4, 0.7, road.strapline, { size: 18, color: 'yellow', bold: true });
    s.text(M, 2.55, 5.3, 1.3, [
      { text: road.name, o: { bold: true, color: 'yellow' } },
      { text: ` ${road.what}` },
    ], { size: 16, color: 'paper', line: 1.05 });
    s.text(M, 4.0, 5.3, 1.3, road.subhead, { size: 24, bold: true, color: 'paper', line: 0.95 });
    s.text(M, 5.7, 5.0, 0.9, road.body, { size: 14, color: 'muted' });
    await roadMap(s, 6.15, 0.3, 6.6);
  }

  // 6 · Campus (18th–19th, before the venue), composed as in the deck of 8 Oct:
  // the two halves side by side, the campus tour beneath
  {
    const s = add('DARK_OPEN', {
      section: 'The destination',
      notes: `${campus.kicker}: ${onCampus.dates} at ${onCampus.place}, ${onCampus.city}. ${venue.kicker}: ${atVenue.dates} at ${atVenue.place}, ${atVenue.city}. The campus tour: youtube.com/watch?v=${campus.video.youtube}`,
    });
    const pin = await glyph('location', 'vermilion');
    [onCampus, atVenue].forEach((l, i) => {
      const x = i === 0 ? M : 6.85;
      const here = l === onCampus;
      s.image(x, 0.86, 0.28, 0.28, pin.file);
      s.text(x + 0.45, 0.62, 5.6, 1.1, [
        { text: caps(here ? campus.kicker : venue.kicker), o: { color: here ? 'cyan' : 'yellow', size: 10, br: true } },
        { text: caps(l.dates), o: { color: 'yellow', size: 15, br: true } },
        { text: caps(`${l.place} ✱ ${l.city}`), o: { color: 'paper' } },
      ], { size: 13, bold: true, line: 1.12, name: here ? 'Campus days' : 'Main festival' });
    });
    const vw = 7.8;
    const vh = vw * (9 / 16);
    const vx = (W - vw) / 2;
    const vy = 2.05;
    const still = await remote(`https://i.ytimg.com/vi/${campus.video.youtube}/maxresdefault.jpg`, 'campus-tour.jpg');
    const link = `https://www.youtube.com/watch?v=${campus.video.youtube}`;
    s.image(vx, vy, vw, vh, still, { link, name: 'Campus tour', alt: campus.video.title });
    s.plate(vx + vw / 2 - 0.5, vy + vh / 2 - 0.4, 1.0, 0.8, 'black', { link, name: 'Play' });
    const play = await glyph('forward', 'cyan');
    s.image(vx + vw / 2 - 0.17, vy + vh / 2 - 0.17, 0.34, 0.34, play.file, { link });
    s.text(vx, vy + vh + 0.12, vw, 0.3, [{ text: `${campus.video.title}  ·  watch on YouTube`, o: { link } }], { size: 12, color: 'cyan', align: 'center' });
  }

  // 7 · The venue
  {
    const s = add('DEEP', {
      section: 'The destination',
      title: venue.title,
      notes: `${venue.kicker}: ${venue.place}. ${venue.booked}. ${venue.statement}.`,
    });
    kicker(s, venue.kicker, 'yellow');
    const vw = 5.55;
    s.image(W - vw, 0, vw, H, await photo('yashobhoomi-outside', vw, H), { name: 'Yashobhoomi', alt: venue.photos[1].alt });
    s.text(M, 1.6, 6.6, 0.55, venue.place, { size: 26, bold: true, color: 'yellow' });
    s.text(M, 2.18, 6.6, 0.4, venue.booked, { size: 15, color: 'muted' });
    s.text(M, 3.3, 7.1, 2.4, venue.statement, { size: 46, bold: true, color: 'paper', line: 0.95, name: 'Statement' });
  }

  // 8 · The venue: the experience
  {
    const s = add('DEEP', { section: 'The destination', title: venue.memorable, notes: `${venue.memorable}. ${venue.draw}` });
    s.text(M, 2.0, 7.6, 0.5, venue.draw, { size: 17, color: 'paper' });
    const flag = await ill('badge-flag', 'indigo', 1000);
    s.image(10.7, 0.3, 2.2, 2.2 / flag.ratio, flag.file, { name: 'Flag planet' });
    const top = 2.85;
    const ph = 7.0 - 0.2 - top;
    s.image(M, top, 3.3, ph, await photo('venue-stage', 3.3, ph), { alt: venue.photos[0].alt });
    s.image(M + 3.3 + 0.2, top, W - 2 * M - 3.5, ph, await photo('venue-hall', W - 2 * M - 3.5, ph), { alt: venue.photos[2].alt });
  }

  // 9 · The audience
  {
    const s = add('PURPLE', { section: 'The audience', title: audience.title, notes: `${audience.finding.join(' ')} ${audience.who}` });
    s.text(M, 2.0, 5.2, 1.5, audience.finding.map((t, i, a) => ({ text: t, o: { br: i < a.length - 1 } })), { size: 24, bold: true, color: 'black', line: 1.0 });
    s.text(M, 3.75, 4.9, 1.2, audience.who, { size: 17, color: 'black' });
    const gx = 6.05;
    const gw = W - M - gx;
    const g = 0.12;
    const top = 0.6;
    const rowH = (6.75 - top - g) / 2;
    const half = (gw - g) / 2;
    s.image(gx, top, half, rowH, await photo('fest-01', half, rowH), { alt: audience.photos[0].alt });
    s.image(gx + half + g, top, half, rowH, await photo('fest-06', half, rowH), { alt: audience.photos[1].alt });
    const wide = gw * 0.62;
    s.image(gx, top + rowH + g, wide, rowH, await photo('fest-03', wide, rowH), { alt: audience.photos[2].alt });
    s.image(gx + wide + g, top + rowH + g, gw - wide - g, rowH, await photo('hyrox-crowd', gw - wide - g, rowH), { alt: audience.photos[6].alt });
  }

  // 10 · The ways in
  {
    const s = add('PURPLE', { section: 'The audience', title: audience.brand.replace(/,$/, ''), notes: `${audience.brand} ${audience.ways.map((w) => `${w.lead} ${w.word} ${w.tail}`).join(' ')}` });
    const star = await ill('shooting-star-1', 'black', 1200);
    s.image(10.3, 0.45, 2.45, 2.45 / star.ratio, star.file, { name: 'Shooting star' });
    s.text(
      M,
      2.55,
      W - 2 * M,
      3.9,
      audience.ways.flatMap((w, i) => [
        { text: `${caps(w.lead)} ` },
        { text: ` ${caps(w.word)} `, o: { color: 'yellow', highlight: 'black' } },
        { text: ` ${caps(w.tail)}`, o: { br: i < audience.ways.length - 1 } },
      ]),
      { size: 40, bold: true, color: 'black', line: 1.15, name: 'Ways in' },
    );
  }

  // 11 · Learned from the best (deck of 8 Oct: a subtitle, and each guest on a card)
  {
    const s = add('INDIGO', { section: 'Our story', title: learned.title.replace(/,$/, ''), notes: `${learned.subtitle}: ${learned.people.map((p) => p.name).join(', ')}.` });
    s.text(M, 1.45, 9, 0.35, learned.subtitle, { size: 16, bold: true, color: 'yellow' });
    const st = await ill('star-outline', 'yellow', 800);
    s.image(11.85, 0.6, 0.85, 0.85 / st.ratio, st.file, { name: 'Star' });
    const g = 0.22;
    const cw = (W - 2 * M - 3 * g) / 4;
    const ch = 2.38;
    const inset = 0.08;
    for (let i = 0; i < learned.people.length; i++) {
      const p = learned.people[i];
      const x = M + (i % 4) * (cw + g);
      const y = 1.98 + Math.floor(i / 4) * (ch + g);
      s.rect(x, y, cw, ch, 'deep', { radius: 0.1, name: `${p.name} card` });
      const ph = 1.72;
      s.image(x + inset, y + inset, cw - 2 * inset, ph, await photo(p.photo, cw - 2 * inset, ph), { alt: p.name });
      s.text(x + 0.2, y + inset + ph + 0.14, cw - 0.4, 0.35, p.name, { size: 13, bold: true, color: 'paper' });
    }
  }

  // 12 · Firsts
  {
    const s = add('INDIGO', { section: 'Our story', title: firsts.title, notes: firsts.items.map((f) => `${f.figure} ${f.label} (${f.photo.caption}).`).join(' ') });
    s.text(M, 1.45, 9, 0.35, firsts.subtitle, { size: 16, bold: true, color: 'yellow' });
    const cw = (W - 2 * M - 2 * 0.3) / 3;
    for (let i = 0; i < firsts.items.length; i++) {
      const f = firsts.items[i];
      const x = M + i * (cw + 0.3);
      const ph = 2.65;
      s.image(x, 2.0, cw, ph, await photo(f.photo.id, cw, ph), { alt: f.photo.alt });
      s.text(x, 2.0 + ph + 0.08, cw, 0.3, f.photo.caption, { size: 11, color: 'muted' });
      s.text(x, 5.05, cw, 0.85, f.figure, { size: 46, bold: true, color: 'yellow', valign: 'bottom' });
      s.text(x, 5.95, cw, 0.7, f.label, { size: 16, bold: true, color: 'paper' });
    }
  }

  // 13 · Moments
  {
    const s = add('INDIGO', { section: 'Our story', title: moments.title, notes: moments.items.map((m) => `${m.name}: ${m.text}`).join(' ') });
    s.text(M, 1.45, 9, 0.35, moments.signature, { size: 16, bold: true, color: 'yellow' });
    const cw = (W - 2 * M - 2 * 0.3) / 3;
    for (let i = 0; i < moments.items.length; i++) {
      const m = moments.items[i];
      const x = M + i * (cw + 0.3);
      const ph = 2.75;
      s.image(x, 2.05, cw, ph, await photo(m.photo.id, cw, ph), { alt: m.photo.alt });
      s.text(x, 5.0, cw, 0.45, m.name, { size: 20, bold: true, color: 'yellow' });
      s.text(x, 5.5, cw, 1.1, m.text, { size: 15, color: 'paper' });
    }
  }

  // 14 · Reach
  {
    const s = add('CYAN', { section: 'Reach and company', title: reach.title, notes: reach.platforms.map((p) => `${p.name}: ${p.value} ${p.unit}${p.label ? ` (${p.label})` : ''}.`).join(' ') });
    for (let i = 0; i < reach.platforms.length; i++) {
      const p = reach.platforms[i];
      const y = 2.05 + i * 1.55;
      const ic = await ink(path.join(ROOT, 'public/deck', `logo-${p.id}.png`), 'black', 400);
      const ih = 0.5;
      s.image(M, y + 0.12, Math.min(1.1, ih * ic.ratio), Math.min(1.1, ih * ic.ratio) / ic.ratio, ic.file, { alt: p.name });
      s.text(M + 1.25, y - 0.05, 2.6, 0.8, p.value, { size: 40, bold: true, color: 'black', line: 0.9 });
      s.text(M + 1.25, y + 0.75, 2.6, 0.5, [
        { text: p.unit, o: { bold: true, br: !!p.label } },
        ...(p.label ? [{ text: p.label, o: { bold: true } }] : []),
      ], { size: 13, color: 'black' });
    }
    const rx = 4.55;
    const g = 0.22;
    const rw = (W - M - rx - 2 * g) / 3;
    const rh = rw * (16 / 9);
    for (let i = 0; i < 3; i++) {
      const r = reach.reels[i];
      const x = rx + i * (rw + g);
      s.rect(x - 0.05, 1.95 - 0.05, rw + 0.1, rh + 0.1, 'black');
      s.image(x, 1.95, rw, rh, await photo(r.cover, rw, rh, 'centre'), { link: r.href, alt: r.alt });
    }
  }

  // 15 · Brands in our orbit
  {
    const s = add('DARK', { section: 'Reach and company', title: company.title.replace(/\.$/, ''), notes: `${company.lines.join(' ')} ${company.across} ${company.names.join(', ')}.` });
    s.text(M, 1.75, 4.6, 1.0, company.lines.map((t, i, a) => ({ text: t, o: { br: i < a.length - 1 } })), { size: 18, bold: true, color: 'paper' });
    s.text(M, 2.85, 4.3, 1.0, company.across, { size: 14, color: 'muted' });
    const mu = await logo('mu-logo', 'paper', 1200);
    s.image(M, 5.9, 3.2, 3.2 / mu.ratio, mu.file, { alt: "Masters' Union University" });
    const gx = 5.35;
    const cols = 5;
    const cw = (W - M - gx) / cols;
    const ch = 0.96;
    for (let i = 0; i < companyLogos.length; i++) {
      const l = companyLogos[i];
      const lg = await ink(path.join(ROOT, 'public/deck', `logo-${l.id}.png`), 'paper', 600);
      const bw = cw * 0.72;
      const bh = 0.44;
      let w = bw;
      let h = w / lg.ratio;
      if (h > bh) {
        h = bh;
        w = h * lg.ratio;
      }
      const cx = gx + (i % cols) * cw + cw / 2;
      const cy = 1.95 + Math.floor(i / cols) * ch + ch / 2;
      s.image(cx - w / 2, cy - h / 2, w, h, lg.file, { alt: l.name });
    }
  }

  // 16 · Tiers
  {
    const s = add('DARK', { section: 'Sponsorship', title: tiersIntro.title, notes: `${tiersIntro.lede} ${tiers.map((t) => `${t.name}: ${t.pitch}`).join(' ')}` });
    kicker(s, 'Sponsorship 2027', 'yellow');
    s.text(M, 2.0, 9, 0.5, tiersIntro.lede, { size: 18, color: 'paper' });
    const ring = await ill('ringed-planet-4', 'paper', 1000);
    s.image(10.6, 0.45, 2.15, 2.15 / ring.ratio, ring.file, { name: 'Planet' });
    const cw = (W - 2 * M - 3 * 0.25) / 4;
    tiers.forEach((t, i) => {
      const x = M + i * (cw + 0.25);
      s.plate(x, 3.05, cw, 3.55, t.ink, { name: t.name });
      s.text(x + 0.3, 3.35, cw - 0.6, 0.3, String(i + 1).padStart(2, '0'), { size: 12, bold: true, color: 'black' });
      s.text(x + 0.3, 3.75, cw - 0.5, 1.2, caps(t.name), { size: 24, bold: true, color: 'black', line: 0.92 });
      s.text(x + 0.3, 5.15, cw - 0.6, 1.3, t.pitch, { size: 15, color: 'black' });
    });
  }

  // 17–18 · Deliverables
  {
    const cell = (v) => (v === true ? '✓' : v === null ? '—' : v);
    const head = [
      { text: 'DELIVERABLE', o: { bold: true, color: 'black', fill: 'paper', size: 10, charSpacing: 1.5 } },
      ...tiers.map((t) => ({ text: caps(t.name), o: { bold: true, color: 'black', fill: t.ink, size: 13 } })),
    ];
    const parts = [deliverables.slice(0, 8), deliverables.slice(8)];
    const colW = [2.25, ...Array(4).fill((W - 2 * M - 2.25) / 4)];
    parts.forEach((rows, k) => {
      const s = add('PAPER', {
        section: 'Sponsorship',
        title: 'What Each Orbit Carries',
        notes: rows.map((d) => `${d.name}: ${tiers.map((t) => `${t.name} ${cell(d.values[t.id])}`).join('; ')}.`).join(' '),
      });
      const start = k === 0 ? 0 : parts[0].length;
      const body = rows.map((d, r) => [
        { text: `${String(start + r + 1).padStart(2, '0')}  ${d.name}`, o: { bold: true, color: 'black', size: 11 } },
        ...tiers.map((t) => ({ text: cell(d.values[t.id]), o: { color: 'black', size: 11, fill: t.id === 'title' ? 'yellow' : undefined } })),
      ]);
      s.table(M, 1.6, colW, [head, ...body], { rowH: [0.42, ...rows.map(() => 0.54)], rule: 'black' });
      if (k === 1) s.text(M, 6.62, 9, 0.3, `*${tiersIntro.footnote}`, { size: 12, bold: true, color: 'black' });
    });
  }

  // 19 · Signal
  {
    const s = add('LIME', {
      section: 'Contact',
      title: signal.title.replace(/\.$/, ''),
      notes: `${signal.line} ${signal.team}: ${signal.contacts.map((c) => `${c.name}, ${c.email}, ${c.phone}`).join('; ')}. ${signal.general.label} ${signal.general.email}.`,
    });
    const mail = `mailto:${signal.general.email}?subject=${encodeURIComponent(signal.subject)}`;
    s.text(M, 2.25, 6, 0.5, signal.line, { size: 22, bold: true, color: 'black' });
    s.plate(M, 3.0, 2.9, 0.75, 'black', { link: mail, name: signal.cta });
    s.text(M + 0.3, 3.0, 2.4, 0.75, [{ text: `${signal.cta}  ↗`, o: { link: mail } }], { size: 16, bold: true, color: 'lime', valign: 'middle' });
    s.text(M, 4.25, 6, 0.3, caps(signal.team), { size: 11, bold: true, color: 'black', charSpacing: 2.5 });
    signal.contacts.forEach((c, i) => {
      const x = M + i * 6.2;
      s.text(x, 4.65, 6, 0.6, c.name, { size: 30, bold: true, color: 'black' });
      s.text(x, 5.3, 6, 0.6, [
        { text: c.email, o: { br: true } },
        { text: c.phone, o: { bold: true } },
      ], { size: 13, color: 'black', line: 1.15 });
    });
    s.text(M, 6.2, 6, 0.6, [
      { text: signal.general.label, o: { br: true } },
      { text: signal.general.email, o: { bold: true } },
    ], { size: 13, color: 'black' });
    const burst = await ill('starburst', 'black', 1000);
    s.image(10.55, 0.55, 2.2, 2.2 / burst.ratio, burst.file, { name: 'Starburst' });
  }

  // 20 · Close
  {
    const s = add('COVER', { section: 'Contact', notes: `${festival.name}: ${festival.tagline}. ${festival.lockupLine}.` });
    const mark = await logo('wordmark-stacked', 'paper', 1400);
    const mw = 5.4;
    s.text(0, 0.75, W, 0.5, caps(festival.tagline), { size: 18, bold: true, color: 'paper', align: 'center', charSpacing: 2 });
    s.image((W - mw) / 2, 1.4, mw, mw / mark.ratio, mark.file, { alt: festival.name });
    s.text(0, 1.55 + mw / mark.ratio, W, 0.5, festival.lockupLine, { size: 22, bold: true, color: 'paper', align: 'center' });
    const mu = await logo('mu-logo', 'paper', 1200);
    s.image((W - 2.6) / 2, 6.0, 2.6, 2.6 / mu.ratio, mu.file, { alt: festival.presenter });
    const planet = await ill('ringed-planet-1', 'purple', 1200);
    s.image(-1.1, 4.6, 3.6, 3.6 / planet.ratio, planet.file, { name: 'Planet' });
  }
}

// The Road to Milky Way chart: the site's map, finished state, with pins and labels on top.
async function roadMap(s, x, y, h) {
  const [VX, VY, VW, VH] = map.viewBox;
  const w = h * (VW / VH);
  const px = 1800;
  const k = px / VW;
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${map.viewBox.join(' ')}" width="${px}" height="${Math.round(VH * k)}">`,
    `<path d="${map.mainland}" fill="none" stroke="#${HEX.paper}" stroke-width="1.6" stroke-linejoin="round" opacity="0.9"/>`,
    `<path d="${map.islands}" fill="none" stroke="#${HEX.paper}" stroke-width="1" opacity="0.5"/>`,
    ...map.route.legs.slice(1, -1).map((d) => `<path d="${d}" fill="none" stroke="#${HEX.paper}" stroke-width="1.5" stroke-dasharray="1 7" stroke-linecap="round" opacity="0.6"/>`),
    ...map.figure.map((f) => `<path d="${f.d}" fill="none" stroke="#${f.final ? HEX.yellow : HEX.paper}" stroke-width="${f.final ? 2.6 : 2}" opacity="${f.final ? 1 : 0.85}"/>`),
    ...Object.values(map.stars.clusters).flat().map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#${HEX.paper}" opacity="0.55"/>`),
    ...map.cities.map((c) => {
      const home = c.id === 'delhi';
      const sc = home ? 1.5 : 1;
      return `<path transform="translate(${c.x} ${c.y}) scale(${sc})" d="M0 -12L2.2 -2.2L10.2 0L2.4 2.7L0 10.2L-2.6 2.4L-9.6 0L-2.2 -2.4Z" fill="#${home ? HEX.yellow : HEX.paper}"/>`;
    }),
    '</svg>',
  ].join('');
  const file = path.join(ASSETS, 'road-map.png');
  await sharp(Buffer.from(svg)).png().toFile(file);
  s.image(x, y, w, h, file, { name: 'Road to Milky Way map', alt: `India, with the six Road to Milky Way cities: ${map.cities.map((c) => c.name).join(', ')}; the course returns to Delhi` });
  const pin = await glyph('location', 'vermilion');
  const at = (c) => ({ cx: x + ((c.x - VX) / VW) * w, cy: y + ((c.y - VY) / VH) * h });
  const left = new Set(['jaipur', 'mumbai']);
  map.cities.forEach((c, i) => {
    const { cx, cy } = at(c);
    const home = c.id === 'delhi';
    const ps = home ? 0.26 : 0.19;
    s.image(cx - ps / 2, cy - ps - 0.04, ps, ps, pin.file, { name: `${c.name} pin` });
    const label = [
      { text: `${String(i + 1).padStart(2, '0')}  `, o: { size: 8, color: home ? 'yellow' : 'muted' } },
      { text: caps(c.name), o: { color: home ? 'yellow' : 'paper' } },
    ];
    const lw = 1.5;
    if (left.has(c.id)) s.text(cx - 0.16 - lw, cy - 0.13, lw, 0.24, label, { size: 11, bold: true, align: 'right', charSpacing: 1 });
    else s.text(cx + 0.16, cy - 0.13, lw, 0.24, label, { size: home ? 13 : 11, bold: true, charSpacing: 1 });
  });
}

// ---------- renderer 1: PowerPoint ----------
async function renderPptx(file) {
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_WIDE';
  pres.title = 'Milky Way · Sponsorship 2027';
  pres.author = "Masters' Union University";
  pres.company = "Masters' Union University";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  const C = pres.SchemeColor;
  const col = (name) => C[SLOT[name]];

  for (const [name, L] of Object.entries(LAYOUTS)) {
    const objects = [];
    if (L.footer)
      objects.push({ text: { text: FOOTER.text, options: { x: FOOTER.x, y: FOOTER.y, w: FOOTER.w, h: FOOTER.h, fontSize: FOOTER.size, bold: true, color: col(L.ink), charSpacing: 2, margin: 0, valign: 'middle' } } });
    if (L.title)
      objects.push({
        placeholder: {
          options: { name: 'title', type: 'title', x: L.title.x, y: L.title.y, w: L.title.w, h: L.title.h, fontSize: L.title.size, bold: true, color: col(L.ink), valign: 'top', margin: 0, lineSpacingMultiple: 0.92 },
          text: '',
        },
      });
    pres.defineSlideMaster({
      title: name,
      background: { color: HEX[L.bg] },
      objects,
      ...(L.footer ? { slideNumber: { x: PAGE_NO.x, y: PAGE_NO.y, w: PAGE_NO.w, h: PAGE_NO.h, fontSize: PAGE_NO.size, bold: true, color: col(L.ink), align: 'right', margin: 0 } } : {}),
    });
  }

  const runsOf = (content, base) =>
    (typeof content === 'string' ? [{ text: content }] : content).map((r) => {
      const o = r.o || {};
      return {
        text: r.text,
        options: {
          ...(o.color ? { color: col(o.color) } : {}),
          ...(o.bold !== undefined ? { bold: o.bold } : {}),
          ...(o.size ? { fontSize: o.size } : {}),
          ...(o.highlight ? { highlight: HEX[o.highlight] } : {}),
          ...(o.link ? { hyperlink: { url: o.link } } : {}),
          ...(o.br ? { breakLine: true } : {}),
          ...(base || {}),
        },
      };
    });

  let section = null;
  for (const S of slides) {
    if (S.section !== section) {
      pres.addSection({ title: S.section });
      section = S.section;
    }
    const slide = pres.addSlide({ masterName: S.layout, sectionTitle: S.section });
    if (S.title) slide.addText(runsOf(S.title), { placeholder: 'title' });
    for (const op of S.ops) {
      const o = op.o || {};
      if (op.kind === 'text') {
        slide.addText(runsOf(op.content), {
          x: op.x,
          y: op.y,
          w: op.w,
          h: op.h,
          margin: 0,
          fontSize: o.size,
          bold: !!o.bold,
          color: col(o.color || LAYOUTS[S.layout].ink),
          align: o.align || 'left',
          valign: o.valign || 'top',
          lineSpacingMultiple: o.line || 1.0,
          ...(o.charSpacing ? { charSpacing: o.charSpacing } : {}),
          fit: 'none',
          isTextBox: true,
          objectName: o.name || (typeof op.content === 'string' ? op.content.slice(0, 40) : 'Text'),
        });
      } else if (op.kind === 'image') {
        slide.addImage({
          path: op.file,
          x: op.x,
          y: op.y,
          w: op.w,
          h: op.h,
          altText: o.alt || '',
          objectName: o.name || o.alt || 'Image',
          ...(o.link ? { hyperlink: { url: op.o.link, tooltip: o.alt || o.name } } : {}),
        });
      } else if (op.kind === 'rect') {
        slide.addShape(op.radius ? pres.shapes.ROUNDED_RECTANGLE : pres.shapes.RECTANGLE, {
          x: op.x,
          y: op.y,
          w: op.w,
          h: op.h,
          fill: { color: col(op.color) },
          line: { type: 'none' },
          ...(op.radius ? { rectRadius: op.radius } : {}),
          objectName: op.name || 'Frame',
        });
      } else if (op.kind === 'plate') {
        slide.addShape(pres.shapes.CUSTOM_GEOMETRY, {
          x: op.x,
          y: op.y,
          w: op.w,
          h: op.h,
          points: [...op.pts.map(([px, py]) => ({ x: px, y: py })), { close: true }],
          fill: { color: col(op.color) },
          line: { type: 'none' },
          objectName: op.name || 'Plate',
          ...(op.link ? { hyperlink: { url: op.link } } : {}),
        });
      } else if (op.kind === 'table') {
        const rows = op.rows.map((row) =>
          row.map((c) => ({
            text: c.text,
            options: {
              bold: !!c.o.bold,
              color: col(c.o.color),
              fontSize: c.o.size,
              ...(c.o.fill ? { fill: { color: col(c.o.fill) } } : {}),
              ...(c.o.charSpacing ? { charSpacing: c.o.charSpacing } : {}),
            },
          })),
        );
        slide.addTable(rows, {
          x: op.x,
          y: op.y,
          w: op.colW.reduce((a, b) => a + b, 0),
          colW: op.colW,
          rowH: op.o.rowH,
          valign: 'middle',
          margin: [0.06, 0.1, 0.06, 0.1],
          border: { type: 'solid', pt: 1, color: HEX[op.o.rule] },
          objectName: 'Deliverables',
        });
      }
    }
    if (S.notes) slide.addNotes(S.notes);
  }
  await pres.writeFile({ fileName: file });
  if (SKILL) {
    const { applyTheme } = require(path.join(SKILL, 'scripts/apply_theme.js'));
    await applyTheme(file, THEME);
  }
}

// ---------- renderer 2: the HTML twin → PDF and slide images ----------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const px = (v) => `${Math.round(v * PX * 100) / 100}px`;
const LINE = 1.2; // Bricolage Grotesque's single line, as PowerPoint sets it

function htmlRuns(content, base = {}) {
  const runs = typeof content === 'string' ? [{ text: content }] : content;
  return runs
    .map((r) => {
      const o = { ...base, ...(r.o || {}) };
      const st = [];
      if (r.o?.color) st.push(`color:#${HEX[r.o.color]}`);
      if (r.o?.bold !== undefined) st.push(`font-weight:${r.o.bold ? 700 : 400}`);
      if (r.o?.size) st.push(`font-size:${r.o.size * 2}px`);
      if (r.o?.highlight) st.push(`background:#${HEX[r.o.highlight]};box-decoration-break:clone;-webkit-box-decoration-break:clone`);
      let h = `<span style="${st.join(';')}">${esc(r.text)}</span>`;
      if (o.link) h = `<a href="${esc(o.link)}">${h}</a>`;
      return h + (r.o?.br ? '<br>' : '');
    })
    .join('');
}

function textBox(op, ink) {
  const o = op.o || {};
  const just = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[o.valign || 'top'];
  const st = [
    `left:${px(op.x)}`,
    `top:${px(op.y)}`,
    `width:${px(op.w)}`,
    `height:${px(op.h)}`,
    `justify-content:${just}`,
    `text-align:${o.align || 'left'}`,
    `font-size:${(o.size || 18) * 2}px`,
    `font-weight:${o.bold ? 700 : 400}`,
    `color:#${HEX[o.color || ink]}`,
    `line-height:${(o.line || 1) * LINE}`,
    o.charSpacing ? `letter-spacing:${o.charSpacing * 2}px` : '',
  ].join(';');
  return `<div class="t" style="${st}"><div>${htmlRuns(op.content)}</div></div>`;
}

function renderHtml(file) {
  const pages = slides.map((S, n) => {
    const L = LAYOUTS[S.layout];
    const parts = [];
    for (const op of S.ops) {
      const o = op.o || {};
      if (op.kind === 'text') parts.push(textBox(op, L.ink));
      else if (op.kind === 'image') {
        const img = `<img src="${esc(path.relative(BUILD, op.file))}" alt="${esc(o.alt || '')}" style="left:${px(op.x)};top:${px(op.y)};width:${px(op.w)};height:${px(op.h)}">`;
        parts.push(o.link ? `<a href="${esc(o.link)}">${img}</a>` : img);
      } else if (op.kind === 'rect') parts.push(`<div class="r" style="left:${px(op.x)};top:${px(op.y)};width:${px(op.w)};height:${px(op.h)};background:#${HEX[op.color]}${op.radius ? `;border-radius:${px(op.radius)}` : ''}"></div>`);
      else if (op.kind === 'plate') {
        const poly = op.pts.map(([a, b]) => `${((a / op.w) * 100).toFixed(2)}% ${((b / op.h) * 100).toFixed(2)}%`).join(',');
        const div = `<div class="r" style="left:${px(op.x)};top:${px(op.y)};width:${px(op.w)};height:${px(op.h)};background:#${HEX[op.color]};clip-path:polygon(${poly})"></div>`;
        parts.push(op.link ? `<a href="${esc(op.link)}">${div}</a>` : div);
      } else if (op.kind === 'table') {
        const cols = op.colW.map((w) => `<col style="width:${px(w)}">`).join('');
        const rows = op.rows
          .map((row, r) => {
            const tds = row
              .map((c) => {
                const st = [`color:#${HEX[c.o.color]}`, `font-weight:${c.o.bold ? 700 : 400}`, `font-size:${c.o.size * 2}px`, c.o.fill ? `background:#${HEX[c.o.fill]}` : '', c.o.charSpacing ? `letter-spacing:${c.o.charSpacing * 2}px` : ''].join(';');
                return `<td style="${st}">${esc(c.text)}</td>`;
              })
              .join('');
            return `<tr style="height:${px(op.o.rowH[r])}">${tds}</tr>`;
          })
          .join('');
        parts.push(`<table style="left:${px(op.x)};top:${px(op.y)};width:${px(op.colW.reduce((a, b) => a + b, 0))};--rule:#${HEX[op.o.rule]}"><colgroup>${cols}</colgroup>${rows}</table>`);
      }
    }
    if (L.title && S.title)
      parts.unshift(
        textBox({ x: L.title.x, y: L.title.y, w: L.title.w, h: L.title.h, content: S.title, o: { size: L.title.size, bold: true, color: L.ink, line: 0.92 } }, L.ink),
      );
    if (L.footer) {
      parts.push(textBox({ ...FOOTER, content: FOOTER.text, o: { size: FOOTER.size, bold: true, color: L.ink, charSpacing: 2, valign: 'middle' } }, L.ink));
      parts.push(textBox({ ...PAGE_NO, content: String(n + 1), o: { size: PAGE_NO.size, bold: true, color: L.ink, align: 'right', valign: 'middle' } }, L.ink));
    }
    return `<section class="s" id="s${n + 1}" style="background:#${HEX[L.bg]}">${parts.join('')}</section>`;
  });
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Milky Way · Sponsorship 2027</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=block" rel="stylesheet">
<style>
@page { size: 1920px 1080px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #${HEX.black}; }
.s { position: relative; width: 1920px; height: 1080px; overflow: hidden; break-after: page; font-family: 'Bricolage Grotesque', sans-serif; font-optical-sizing: auto; }
.s:last-child { break-after: auto; }
.s > *, .s > a > * { position: absolute; }
.t { display: flex; flex-direction: column; white-space: pre-wrap; overflow-wrap: break-word; }
.t a { color: inherit; text-decoration: none; }
img { display: block; object-fit: fill; }
table { border-collapse: collapse; table-layout: fixed; font-family: inherit; }
td { border: 2px solid var(--rule); padding: 8.6px 14.4px; vertical-align: middle; line-height: 1.2; }
body.one .s { display: none; } body.one .s.on { display: block; }
</style></head><body>${pages.join('\n')}
<script>const m = location.hash.match(/^#(\\d+)$/); if (m) { document.body.classList.add('one'); document.getElementById('s' + m[1]).classList.add('on'); }</script>
</body></html>`;
  fs.writeFileSync(file, html);
}

(async () => {
  await compose();
  const pptx = path.join(OUT, `${NAME}.pptx`);
  await renderPptx(pptx);
  const html = path.join(BUILD, 'deck.html');
  renderHtml(html);
  const url = `file://${html}`;
  const pdf = path.join(OUT, `${NAME}.pdf`);
  execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=20000', `--print-to-pdf=${pdf}`, url], { stdio: 'ignore' });
  if (process.argv.includes('--shots')) {
    const dir = path.join(BUILD, 'shots');
    fs.mkdirSync(dir, { recursive: true });
    const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7).split(',').map(Number);
    for (let i = 1; i <= slides.length; i++) {
      if (only && !only.includes(i)) continue;
      execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1920,1080', '--virtual-time-budget=12000', `--screenshot=${path.join(dir, `slide-${String(i).padStart(2, '0')}.png`)}`, `${url}#${i}`], { stdio: 'ignore' });
    }
  }
  console.log(`${slides.length} slides → ${path.relative(ROOT, pptx)}, ${path.relative(ROOT, pdf)}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
