import { seeded } from '@/lib/motion-seed';

/**
 * Label placement for the Road to Milky Way chart.
 *
 * Every city label is tried at sixteen bearings and four distances from its
 * pin. Each spot is scored against everything already on the chart, in map
 * units: the asteroid's course, the constellation's lines, the coastline,
 * every pin, and the frame's edge. Labels are then placed greedily
 * over several orderings, and the arrangement with the lowest total wins. A
 * label set well away from its pin gets a leader line. It reruns whenever the
 * chart's size or the type's metrics change, so it holds at any width.
 */

export type Pt = [number, number];
export type Box = { x0: number; y0: number; x1: number; y1: number };
export type Placement = { box: Box; leader: [Pt, Pt] | null };

type Input = {
  cities: { x: number; y: number }[];
  /** label sizes, in map units */
  sizes: { w: number; h: number }[];
  /** pin glyph size, in map units (the pin stands on its point) */
  pin: { w: number; h: number };
  /** px → map units */
  unit: number;
  allow: Box;
  route: Pt[];
  figure: Pt[];
  coast: Pt[];
};

const BEARINGS = Array.from({ length: 16 }, (_, i) => (i * Math.PI) / 8);
const REACH_PX = [7, 18, 34, 56];

const grow = (b: Box, m: number): Box => ({ x0: b.x0 - m, y0: b.y0 - m, x1: b.x1 + m, y1: b.y1 + m });
const hit = (a: Box, b: Box) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;
const overlap = (a: Box, b: Box) =>
  Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
const inside = (p: Pt, b: Box) => p[0] > b.x0 && p[0] < b.x1 && p[1] > b.y0 && p[1] < b.y1;
const count = (pts: Pt[], b: Box) => {
  let n = 0;
  for (const p of pts) if (inside(p, b)) n++;
  return n;
};

/** Closest point of a box to p, for the leader's far end. */
function nearest(p: Pt, b: Box): Pt {
  return [Math.min(Math.max(p[0], b.x0), b.x1), Math.min(Math.max(p[1], b.y0), b.y1)];
}

function nearSegment(pts: Pt[], [a, b]: [Pt, Pt], r: number) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy || 1;
  let n = 0;
  for (const p of pts) {
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2));
    if (Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy) < r) n++;
  }
  return n;
}

function segmentHitsBox([a, b]: [Pt, Pt], box: Box) {
  for (let t = 0.1; t < 1; t += 0.1) if (inside([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], box)) return true;
  return false;
}

export function placeLabels({ cities, sizes, pin, unit, allow, route, figure, coast }: Input): Placement[] {
  const pins: Box[] = cities.map((c) => ({ x0: c.x - pin.w / 2, y0: c.y - pin.h, x1: c.x + pin.w / 2, y1: c.y + 3 * unit }));
  const gap = 3 * unit;

  // Every candidate's fixed cost: what it sits on, before other labels are considered.
  const options = cities.map((c, i) => {
    const { w, h } = sizes[i];
    const list: { box: Box; leader: [Pt, Pt] | null; cost: number }[] = [];
    REACH_PX.forEach((px, ri) => {
      const r = px * unit;
      for (const a of BEARINGS) {
        const sin = Math.sin(a);
        const cos = Math.cos(a);
        const cx = c.x + cos * (r + w / 2);
        // Above the point the pin is in the way: clear it first.
        const cy = c.y + sin * (r + h / 2) + (sin < 0 ? sin * pin.h * 0.85 : 0);
        const box = { x0: cx - w / 2, y0: cy - h / 2, x1: cx + w / 2, y1: cy + h / 2 };
        const far = ri >= 2;
        let leader: [Pt, Pt] | null = null;
        if (far) {
          const end = nearest([c.x, c.y], box);
          const d = Math.hypot(end[0] - c.x, end[1] - c.y) || 1;
          const k = 4 * unit;
          leader = [
            [c.x + ((end[0] - c.x) / d) * k, c.y + ((end[1] - c.y) / d) * k],
            [end[0] - ((end[0] - c.x) / d) * 2 * unit, end[1] - ((end[1] - c.y) / d) * 2 * unit],
          ];
        }
        let cost = ri * 7;
        // Reading order: slight preference for the right, then for level placements.
        if (cos < -0.3) cost += 1.5;
        if (Math.abs(sin) > 0.92) cost += 2;
        if (box.x0 < allow.x0 || box.x1 > allow.x1 || box.y0 < allow.y0 || box.y1 > allow.y1) cost += 1000;
        const padded = grow(box, gap);
        cost += 12 * count(route, padded) + 20 * count(figure, padded) + 0.8 * count(coast, box);
        pins.forEach((p) => {
          if (hit(p, grow(box, 2 * unit))) cost += 120;
        });
        if (leader) cost += 5 * nearSegment(route, leader, 3 * unit) + 8 * nearSegment(figure, leader, 3 * unit);
        list.push({ box, leader, cost });
      }
    });
    return list;
  });

  // The crowded west first, then the rest; plus shuffled orders, keeping the best.
  const crowd = cities.map((c, i) => ({ i, n: cities.filter((o) => Math.hypot(o.x - c.x, o.y - c.y) < 190).length }));
  const first = crowd.sort((a, b) => b.n - a.n).map((c) => c.i);
  const rand = seeded(19);
  let best: { total: number; picks: typeof options[number] } | null = null;
  for (let t = 0; t < 60; t++) {
    const order = t === 0 ? first : [...first].sort(() => rand() - 0.5);
    const picks: typeof options[number] = [];
    let total = 0;
    for (const i of order) {
      let pick = options[i][0];
      let pickCost = Infinity;
      for (const o of options[i]) {
        let cost = o.cost;
        const padded = grow(o.box, 4 * unit);
        for (const j of order) {
          const other = picks[j];
          if (!other) continue;
          if (hit(padded, other.box)) cost += 500 + overlap(padded, other.box) / unit;
          if (o.leader && segmentHitsBox(o.leader, other.box)) cost += 200;
          if (other.leader && segmentHitsBox(other.leader, o.box)) cost += 200;
        }
        if (cost < pickCost) {
          pickCost = cost;
          pick = o;
        }
      }
      picks[i] = pick;
      total += pickCost;
    }
    if (!best || total < best.total) best = { total, picks };
  }
  return best!.picks.map((p) => ({ box: p.box, leader: p.leader }));
}
