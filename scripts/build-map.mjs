// Builds src/content/india-map.json for the Road to Milky Way constellation.
// Source: Natural Earth 1:10m (public domain), India point-of-view boundaries
// (ne_10m_admin_0_countries_ind), so the outline follows India's official
// external boundary.
//   curl -L -o .cache/geo/ne_10m_admin_0_countries_ind.geojson \
//     https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries_ind.geojson
//   node scripts/build-map.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const GEO = path.join(ROOT, '.cache/geo');

// Road to Milky Way stops, in the order the journey runs. The Milky Way team
// asked for an order that draws the clearest figure: it zigzags across the
// country (south, east, back west, north) without a line crossing another,
// and ends in Delhi, where the festival lands.
const CITIES = [
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.8777 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { id: 'bangalore', name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { id: 'delhi', name: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.209 },
];

// The asteroid's course, in map units (x east, y south). Cities are fixed by
// their coordinates; between them the course bows to the outside of the figure
// it is drawing, so it never crosses a constellation line or itself. It comes
// in over the Arabian Sea, where the page's flight path hands over, and
// settles into Delhi.
const ROUTE = [
  [-170, 560],
  [0, 596],
  [104, 640],
  'mumbai',
  [196, 696],
  'pune',
  [236, 808],
  'bangalore',
  [410, 944],
  [548, 912],
  [650, 800],
  [706, 660],
  'kolkata',
  [612, 462],
  [462, 432],
  [300, 470],
  'ahmedabad',
  [128, 478],
  [184, 404],
  'jaipur',
  [278, 334],
  'delhi',
  [338, 300],
  [346, 292],
];

// The constellation the journey leaves behind: the seven cities as stars,
// joined in journey order. Each line is listed from the star lit first.
const FIGURE = [
  ['mumbai', 'pune'],
  ['pune', 'bangalore'],
  ['bangalore', 'kolkata'],
  ['kolkata', 'ahmedabad'],
  ['ahmedabad', 'jaipur'],
  ['jaipur', 'delhi'],
];

// Equirectangular, corrected for latitude at India's middle (22°N).
const LON0 = 67.6;
const LAT0 = 37.6;
const K = Math.cos((22 * Math.PI) / 180);
const S = 1000 / ((97.8 - LON0) * K);
const project = ([lon, lat]) => [(lon - LON0) * K * S, (LAT0 - lat) * S];

// Douglas–Peucker in projected units.
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len;
      if (d > max) {
        max = d;
        idx = i;
      }
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const area = (ring) => Math.abs(ring.reduce((s, p, i) => s + p[0] * ring[(i + 1) % ring.length][1] - ring[(i + 1) % ring.length][0] * p[1], 0) / 2);
const toPath = (ring) => 'M' + ring.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L') + 'Z';

function polygons(geometry) {
  return geometry.type === 'MultiPolygon' ? geometry.coordinates : [geometry.coordinates];
}

function outline(geometry, tol, minArea) {
  const out = [];
  for (const poly of polygons(geometry)) {
    const ring = poly[0].map(project); // outer ring only: no interior detail
    if (area(ring) < minArea) continue;
    // A closed ring has a zero-length baseline; split it at its farthest point first.
    let far = 0;
    let best = 0;
    ring.forEach(([x, y], i) => {
      const d = Math.hypot(x - ring[0][0], y - ring[0][1]);
      if (d > best) {
        best = d;
        far = i;
      }
    });
    const s = [...simplify(ring.slice(0, far + 1), tol), ...simplify(ring.slice(far), tol).slice(1)];
    if (s.length >= 4) out.push(toPath(s));
  }
  return out.join('');
}

const countries = JSON.parse(fs.readFileSync(path.join(GEO, 'ne_10m_admin_0_countries_ind.geojson'), 'utf8'));
const india = countries.features.find((f) => f.properties.ADM0_A3 === 'IND');

// Mainland at fine tolerance; the island chains kept, simplified harder.
const mainland = outline(india.geometry, 0.9, 400);
const islands = outline(india.geometry, 0.6, 0.4)
  .split('Z')
  .filter(Boolean)
  .map((d) => d + 'Z')
  .filter((d) => !mainland.includes(d))
  .join('');


const [, yTop] = project([0, 37.1]);
const [, yBottom] = project([0, 6.7]);
const [xLeft] = project([68.1, 0]);
const [xRight] = project([97.4, 0]);
const pad = 24;
const viewBox = [xLeft - pad, yTop - pad, xRight - xLeft + pad * 2, yBottom - yTop + pad * 2].map((v) => +v.toFixed(1));

const graticule = {
  lon: [70, 75, 80, 85, 90, 95].map((lon) => ({ value: lon, x: +project([lon, 0])[0].toFixed(1) })),
  lat: [10, 15, 20, 25, 30, 35].map((lat) => ({ value: lat, y: +project([0, lat])[1].toFixed(1) })),
  tropic: { value: 23.4362, y: +project([0, 23.4362])[1].toFixed(1) },
};

const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;
const cities = CITIES.map((c) => {
  const [x, y] = project([c.lon, c.lat]);
  return { ...c, x: +x.toFixed(1), y: +y.toFixed(1), coords: `${fmt(c.lat, 'N', 'S')}, ${fmt(c.lon, 'E', 'W')}` };
});

// ---------- the course: centripetal Catmull-Rom through the waypoints ----------
const byId = Object.fromEntries(cities.map((c) => [c.id, c]));
const pts = ROUTE.map((w) => (typeof w === 'string' ? [byId[w].x, byId[w].y] : w));
const stopAt = ROUTE.map((w, i) => (typeof w === 'string' ? i : -1)).filter((i) => i >= 0);
const f1 = (v) => +v.toFixed(1);
function bezier(p0, p1, p2, p3) {
  const d = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]) ** 0.5 || 1e-6;
  const d1 = d(p0, p1);
  const d2 = d(p1, p2);
  const d3 = d(p2, p3);
  const c1 = [0, 1].map((k) => (d1 * d1 * p2[k] - d2 * d2 * p0[k] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[k]) / (3 * d1 * (d1 + d2)));
  const c2 = [0, 1].map((k) => (d3 * d3 * p1[k] - d2 * d2 * p3[k] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[k]) / (3 * d3 * (d3 + d2)));
  return `C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
}
const segs = pts.slice(0, -1).map((p, i) => bezier(pts[i - 1] || p, p, pts[i + 1], pts[i + 2] || pts[i + 1]));
// One leg per stretch between stops: entry → Jaipur, Jaipur → Delhi, … Kolkata → exit.
const bounds = [0, ...stopAt, pts.length - 1];
const d = `M${f1(pts[0][0])} ${f1(pts[0][1])}` + segs.join('');
const legs = bounds.slice(0, -1).map((a, k) => `M${f1(pts[a][0])} ${f1(pts[a][1])}` + segs.slice(a, bounds[k + 1]).join(''));
// Star-chart convention: a figure's lines stop just short of its stars.
const GAP = 11;
const figure = FIGURE.map(([a, b]) => {
  const [p, q] = [byId[a], byId[b]];
  const len = Math.hypot(q.x - p.x, q.y - p.y);
  const [ux, uy] = [(q.x - p.x) / len, (q.y - p.y) / len];
  return { from: a, to: b, x1: f1(p.x + ux * GAP), y1: f1(p.y + uy * GAP), x2: f1(q.x - ux * GAP), y2: f1(q.y - uy * GAP) };
});

// ---------- stars: a sparse chart field, and a small cluster around each city ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(1947);
const field = Array.from({ length: 64 }, () => [f1(viewBox[0] + rand() * viewBox[2]), f1(viewBox[1] + rand() * viewBox[3]), +(0.6 + rand() * 1.5).toFixed(2)]);
const clusters = Object.fromEntries(
  cities.map((c) => [
    c.id,
    Array.from({ length: 7 }, () => {
      const a = rand() * Math.PI * 2;
      const r = 26 + rand() * 62;
      return [f1(c.x + Math.cos(a) * r), f1(c.y + Math.sin(a) * r), +(0.7 + rand() * 1.4).toFixed(2)];
    }),
  ]),
);

const out = {
  source: 'Natural Earth 1:10m, India point of view (public domain)',
  viewBox,
  mainland,
  islands,
  graticule,
  cities,
  // For reading live coordinates back off the chart: lon = x / (k·s) + lon0, lat = lat0 − y / s
  projection: { lon0: LON0, lat0: LAT0, k: +K.toFixed(6), s: +S.toFixed(4) },
  route: { d, legs },
  figure,
  stars: { field, clusters },
};
fs.writeFileSync(path.join(ROOT, 'src/content/india-map.json'), JSON.stringify(out));
console.log('viewBox', viewBox.join(' '), '| mainland', mainland.length, 'chars | islands', islands.length, '| legs', legs.length);
