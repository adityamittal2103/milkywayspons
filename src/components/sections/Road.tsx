'use client';

import { useRef, type CSSProperties } from 'react';
import map from '@/content/india-map.json';
import { road } from '@/content/milky-way';
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger, useGSAP } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { Glyph, Ink } from '../Ink';
import { Starfield } from '../Starfield';
import { Waypoint } from '../Waypoint';
import { placeLabels, type Pt } from './road-labels';
import styles from './Road.module.css';

type City = (typeof map.cities)[number];
type Cluster = keyof typeof map.stars.clusters;

const [VX, VY, VW, VH] = map.viewBox;
const cities = map.cities as City[];
const LEGS = map.route.legs; // way in → Delhi, Delhi → Bangalore, … Varanasi → Delhi (home), settling
const order = Object.fromEntries(cities.map((c, i) => [c.id, i])) as Record<string, number>;
// Each figure line belongs to the later of its two stars; the closing line
// (`final`) to the flight home.
const figureLit = map.figure.map((f) => ('final' in f ? -1 : Math.max(order[f.from], order[f.to])));
const EXIT = LEGS.length - 1;
const HOME = EXIT - 1; // Varanasi → Delhi: everyone meets in Delhi
const DELHI = order.delhi;
const PARK = HOME; // reduced motion: mid-flight across the north, on the way home
const pct = (x: number, y: number) => ({ left: `${((x - VX) / VW) * 100}%`, top: `${((y - VY) / VH) * 100}%` });
const pad2 = (n: number) => String(n).padStart(2, '0');
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (v: number) => v * v * (3 - 2 * v);

// The flown course is art-directed: each leg carries its own weight, and the
// way in from deep space stays faint.
const LEG_OPACITY = [0.3, 0.7, 0.82, 0.66, 0.74, 0.62, 0.92, 0.5];
// The figure's lines, each with its own weight (map.figure order); the closing
// line home to Delhi is the brightest.
// The journey's lines, in order; the closing line home is the brightest.
const FIGURE_OPACITY = [0.85, 0.8, 0.9, 0.75, 0.8, 1];
// Small sparkles discovered along the course: [leg, fraction along it, size].
const NODES: [number, number, number][] = [
  [0, 0.55, 0.8],
  [2, 0.5, 0.9],
  [3, 0.45, 1],
  [4, 0.5, 0.8],
  [5, 0.32, 1.2],
  [5, 0.7, 0.9],
  [6, 0.45, 1],
];
// The kit's four-point sparkle, cut unevenly like the Starfield's.
const SPARK = 'M0 -7.5L1.4 -1.4L6.4 0L1.5 1.7L0 6.4L-1.6 1.5L-6 0L-1.4 -1.5Z';
// The same sparkle at star size, for the cities.
const STAR = 'M0 -12L2.2 -2.2L10.2 0L2.4 2.7L0 10.2L-2.6 2.4L-9.6 0L-2.2 -2.4Z';
const DUST = 14;

export function Road() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const st = stage.current!;
      const all = <T extends Element>(sel: string) => Array.from(st.querySelectorAll<T>(sel));
      const one = <T extends Element>(sel: string) => st.querySelector<T>(sel)!;
      const camera = one<HTMLElement>('[data-camera]');
      const legEls = all<SVGPathElement>('[data-leg]');
      const figEls = all<SVGPathElement>('[data-figure]');
      const course = one<SVGGElement>('[data-course]');
      const stars = all<SVGPathElement>('[data-star]');
      const tails = all<SVGPathElement>('[data-tail]');
      const spark = one<SVGPathElement>('[data-spark]');
      const sites = all<HTMLElement>('[data-site]');
      const labels = all<HTMLElement>('[data-label]');
      const leaders = all<SVGLineElement>('[data-leader]');
      const clusters = all<SVGGElement>('[data-cluster]').map((g) => Array.from(g.children) as SVGCircleElement[]);
      const nodes = all<SVGPathElement>('[data-node]');
      const dust = all<SVGCircleElement>('[data-dust]');
      const sky = one<SVGGElement>('[data-sky]');
      const asteroid = one<HTMLElement>('[data-asteroid]');
      const readN = one<HTMLElement>('[data-read-n]');
      const readName = one<HTMLElement>('[data-read-name]');
      const readCoord = one<HTMLElement>('[data-read-coord]');

      // ---------- geometry, in map units ----------
      const legLen = legEls.map((l) => l.getTotalLength());
      const cum = legLen.reduce<number[]>((a, L) => [...a, a[a.length - 1] + L], [0]);
      const total = cum[cum.length - 1];
      const tailTotal = tails[0].getTotalLength();
      const figLen = figEls.map((e) => e.getTotalLength());
      // Animated lines are dashed in map units, so they scale with the chart; their
      // widths are held constant on screen through --u (map units per pixel).
      const svg = one<SVGSVGElement>('svg');
      const coastEl = one<SVGPathElement>('[data-coast]');
      const coastLen = coastEl.getTotalLength();
      /** Show a path from `from` to `to` (map units along it); nothing when empty. */
      const reveal = (el: SVGGeometryElement & ElementCSSInlineStyle, from: number, to: number, length: number) => {
        const v = to - from;
        el.style.visibility = v > 0.05 ? 'visible' : 'hidden';
        el.style.strokeDasharray = from > 0.05 ? `0 ${from} ${v} ${length + 4}` : `${Math.max(v, 0)} ${length + 4}`;
      };
      const cityAt = cities.map((_, i) => cum[i + 1]);
      const nodeAt = NODES.map(([k, f]) => cum[k] + f * legLen[k]);
      const legOf = (s: number) => {
        let k = 0;
        while (k < EXIT && s > cum[k + 1]) k++;
        return k;
      };
      const pointAt = (s: number) => {
        const v = clamp(s, 0, total);
        const k = legOf(v);
        return legEls[k].getPointAtLength(v - cum[k]);
      };
      const sampleAll = (els: SVGGeometryElement[], step: number) =>
        els.flatMap((el) => {
          const L = el.getTotalLength();
          const out: Pt[] = [];
          for (let s = 0; s <= L; s += step) {
            const p = el.getPointAtLength(s);
            out.push([p.x, p.y]);
          }
          return out;
        });
      const routePts = sampleAll(legEls, 5);
      const figPts = sampleAll(figEls, 6);
      const coastPts = sampleAll([coastEl], 8);

      nodes.forEach((n, i) => {
        const p = pointAt(nodeAt[i]);
        n.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${NODES[i][2]})`);
      });

      // ---------- labels: placed against everything else on the chart ----------
      const place = () => {
        const w = camera.offsetWidth;
        if (!w) return;
        const unit = VW / w;
        svg.style.setProperty('--u', unit.toFixed(4));
        const pin = one<HTMLElement>('[data-pin]');
        // Negative when the chart runs past the screen edge: labels then keep inside the visible width.
        const side = ((st.clientWidth - w) / 2 - 10) * unit;
        const band = Math.max(0, (st.clientHeight - camera.offsetHeight) / 2 - 72) * unit;
        const placed = placeLabels({
          cities,
          sizes: labels.map((l) => ({ w: l.offsetWidth * unit, h: l.offsetHeight * unit })),
          pin: { w: pin.offsetWidth * unit, h: pin.offsetHeight * unit },
          unit,
          allow: {
            x0: VX - Math.min(side, 340),
            x1: VX + VW + Math.min(side, 340),
            y0: VY - Math.min(band, 30),
            y1: VY + VH + Math.min(band, 30),
          },
          route: routePts,
          figure: figPts,
          coast: coastPts,
        });
        placed.forEach(({ box, leader }, i) => {
          Object.assign(labels[i].style, pct(box.x0, box.y0));
          const l = leaders[i];
          if (leader) {
            l.setAttribute('x1', leader[0][0].toFixed(1));
            l.setAttribute('y1', leader[0][1].toFixed(1));
            l.setAttribute('x2', leader[1][0].toFixed(1));
            l.setAttribute('y2', leader[1][1].toFixed(1));
            l.style.display = '';
          } else l.style.display = 'none';
        });
        st.dataset.placed = '';
      };
      let queued = 0;
      const ro = new ResizeObserver(() => {
        cancelAnimationFrame(queued);
        queued = requestAnimationFrame(place);
      });
      ro.observe(camera);
      document.fonts?.ready.then(place);

      // ---------- the asteroid ----------
      const setAsteroid = (s: number, alpha: number, scale = 1) => {
        const p = pointAt(s);
        const q = s < 4 ? pointAt(s + 4) : pointAt(s - 4);
        const dir = s < 4 ? Math.atan2(q.y - p.y, q.x - p.x) : Math.atan2(p.y - q.y, p.x - q.x);
        const k = camera.offsetWidth / VW;
        // The kit's comet flies toward its lower left (135°); a slow tumble on top.
        const turn = (dir * 180) / Math.PI - 135 + Math.sin(s / 38) * 6;
        asteroid.style.transform = `translate(${((p.x - VX) * k).toFixed(1)}px, ${((p.y - VY) * k).toFixed(1)}px) rotate(${turn.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
        asteroid.style.opacity = alpha.toFixed(3);
        return { p, dir };
      };

      const cleanup = () => {
        ro.disconnect();
        cancelAnimationFrame(queued);
      };

      // Reduced motion: the finished constellation at rest, the asteroid mid-flight across the north.
      if (prefersReducedMotion()) {
        setAsteroid(cum[PARK] + legLen[PARK] * 0.42, 1);
        return cleanup;
      }

      const mm = gsap.matchMedia();
      mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, (ctx) => {
        const wide = !!ctx.conditions?.wide;
        const TAIL = wide ? [34, 110] : [22, 70];

        // Before the journey: sky, outline, dormant cities.
        legEls.forEach((l, k) => reveal(l, 0, 0, legLen[k]));
        figEls.forEach((e, j) => reveal(e, 0, 0, figLen[j]));
        gsap.set(stars, { opacity: 0.4, scale: 1, transformOrigin: '50% 50%' });
        tails.forEach((t) => reveal(t, 0, 0, tailTotal));
        gsap.set(all('[data-pin]'), { autoAlpha: 0, scale: 0.5, transformOrigin: '50% 100%' });
        gsap.set(all('[data-ring]'), { autoAlpha: 0 });
        gsap.set(clusters.flat(), { opacity: 0.2, transformOrigin: '50% 50%' });
        gsap.set(nodes, { opacity: 0 });
        sites.forEach((s) => (s.dataset.state = 'dormant'));
        labels.forEach((l) => (l.dataset.state = 'dormant'));
        leaders.forEach((l) => (l.dataset.state = 'dormant'));
        // Delhi is home only once the journey returns to it.
        sites[DELHI].removeAttribute('data-home');
        labels[DELHI].removeAttribute('data-home');

        // India draws itself as the stage rises into view.
        const approach = { trigger: st, start: 'top 92%', end: 'top 8%', scrub: 0.6 };
        gsap.fromTo(coastEl, { strokeDasharray: `0 ${coastLen}` }, { strokeDasharray: `${coastLen} 0`, ease: 'power1.inOut', scrollTrigger: approach });
        gsap.fromTo(one('[data-islands]'), { opacity: 0 }, { opacity: 0.55, ease: 'none', scrollTrigger: { ...approach, start: 'top 40%' } });

        // ---------- scroll → distance along the course ----------
        // One beat per leg, longer legs taking longer; a short settle before, stillness after.
        const beats = legLen.map((L, k) => (k === 0 ? 1.1 : k === EXIT ? 1.3 : 0.5 + L / 380));
        const LEAD = 0.3;
        const HOLD = 1.5;
        const span = LEAD + beats.reduce((a, b) => a + b, 0) + HOLD;
        const locate = (p: number) => {
          let b = p * span - LEAD;
          if (b <= 0) return 0;
          for (let k = 0; k < beats.length; k++) {
            if (b < beats[k]) {
              const u = b / beats[k];
              // Eases into each city and out again without stopping: speed dips to a quarter.
              return cum[k] + (u - (0.75 * Math.sin(2 * Math.PI * u)) / (2 * Math.PI)) * legLen[k];
            }
            b -= beats[k];
          }
          return total;
        };

        // ---------- arrivals ----------
        const run = { at: 0 };
        const pinOf = (i: number) => sites[i].querySelector('[data-pin]')!;
        const ringsOf = (i: number) => Array.from(sites[i].querySelectorAll('[data-ring]'));
        const arrive = (i: number, animate: boolean) => {
          const pin = pinOf(i);
          const rings = ringsOf(i);
          gsap.killTweensOf([pin, ...rings, ...clusters[i], stars[i]]);
          if (!animate) {
            gsap.set(pin, { autoAlpha: 1, scale: 1, y: 0 });
            gsap.set(clusters[i], { opacity: 0.6, scale: 1 });
            gsap.set(stars[i], { opacity: 1, scale: 1 });
            return;
          }
          gsap.fromTo(stars[i], { opacity: 1, scale: 2.6 }, { scale: 1, duration: 1.4, ease: 'expo.out' });
          gsap.fromTo(pin, { autoAlpha: 0, scale: 0.2, y: -8 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(2.2)' });
          gsap.fromTo(rings, { scale: 0.3, autoAlpha: 0.9 }, { scale: 3.3, autoAlpha: 0, duration: 1.7, ease: 'expo.out', stagger: 0.32 });
          gsap.fromTo(
            clusters[i],
            { opacity: 1, scale: 2.3 },
            { opacity: 0.6, scale: 1, duration: 1.8, ease: 'power2.out', stagger: 0.07 },
          );
          // A point of light retraces the leg just flown, sealing the connection.
          if (i > 0) {
            const L = legLen[i];
            spark.setAttribute('d', LEGS[i]);
            gsap.killTweensOf([spark, run]);
            gsap.set(spark, { opacity: 1 });
            gsap.fromTo(
              run,
              { at: 0 },
              {
                at: L + 18,
                duration: 1.1,
                ease: 'power2.inOut',
                onUpdate: () => reveal(spark, Math.max(0, run.at - 18), Math.min(run.at, L), L),
              },
            );
            gsap.to(spark, { opacity: 0, duration: 0.35, delay: 0.85 });
          }
        };
        // Home: the asteroid comes back to Delhi, where the festival happens. A
        // stronger arrival than any city's: the star flares, three rings, and the
        // whole figure brightens once as it completes.
        const converge = () => {
          const i = DELHI;
          const pin = pinOf(i);
          const rings = ringsOf(i);
          gsap.killTweensOf([pin, ...rings, ...clusters[i], stars[i]]);
          gsap.fromTo(stars[i], { opacity: 1, scale: 3.8 }, { scale: 1.35, duration: 1.8, ease: 'expo.out' });
          gsap.fromTo(pin, { scale: 1.6, y: -6 }, { scale: 1.25, y: 0, duration: 1, ease: 'back.out(2)' });
          gsap.fromTo(rings, { scale: 0.3, autoAlpha: 1 }, { scale: 4.6, autoAlpha: 0, duration: 2.2, ease: 'expo.out', stagger: 0.28 });
          gsap.fromTo(clusters.flat(), { opacity: 1 }, { opacity: 0.6, duration: 1.8, ease: 'power2.out', stagger: 0.012 });
          gsap.fromTo(figEls, { opacity: 1 }, { opacity: (j: number) => FIGURE_OPACITY[j], duration: 1.6, ease: 'power2.out', clearProps: 'opacity' });
        };
        const leaveHome = () => {
          const i = DELHI;
          gsap.killTweensOf([pinOf(i), stars[i]]);
          gsap.to(pinOf(i), { scale: 1, duration: 0.3 });
          gsap.to(stars[i], { scale: 1, duration: 0.3 });
        };
        const depart = (i: number) => {
          const pin = pinOf(i);
          const rings = ringsOf(i);
          gsap.killTweensOf([pin, ...rings, ...clusters[i], stars[i]]);
          gsap.to(pin, { autoAlpha: 0, scale: 0.5, duration: 0.3 });
          gsap.to(stars[i], { opacity: 0.4, scale: 1, duration: 0.3 });
          gsap.set(rings, { autoAlpha: 0 });
          gsap.to(clusters[i], { opacity: 0.2, scale: 1, duration: 0.4 });
        };

        let lit = -1;
        let active = -2;
        let home = false;
        const setHome = (on: boolean, forward: boolean) => {
          if (on === home) return;
          home = on;
          sites[DELHI].toggleAttribute('data-home', on);
          labels[DELHI].toggleAttribute('data-home', on);
          if (on && forward) converge();
          else if (!on) leaveHome();
        };
        const setCities = (n: number, current: number, forward: boolean) => {
          for (let i = 0; i < cities.length; i++) {
            const state = i >= n ? 'dormant' : i === current ? 'active' : 'resolved';
            const prev = sites[i].dataset.state;
            if (prev === state) continue;
            sites[i].dataset.state = state;
            labels[i].dataset.state = state;
            leaders[i].dataset.state = state;
            if (prev === 'dormant') arrive(i, forward && n - lit === 1 && i === n - 1);
            else if (state === 'dormant') depart(i);
          }
          if (n !== lit) readN.textContent = pad2(n);
          lit = n;
          if (current !== active) {
            // Home in Delhi, the reading names where the festival lands.
            readName.textContent =
              current >= 0
                ? home && current === DELHI
                  ? 'Delhi · Yashobhoomi'
                  : cities[current].name
                : n === cities.length
                  ? 'Everyone meets in Delhi'
                  : '';
            active = current;
          }
        };

        // ---------- dust: a few grains shed behind the asteroid ----------
        type Grain = { el: SVGCircleElement; x: number; y: number; vx: number; vy: number; t: number; r: number };
        const grains: Grain[] = [];
        let next = 0;
        let ticking = false;
        const tick = () => {
          const now = gsap.ticker.time;
          for (let g = grains.length - 1; g >= 0; g--) {
            const d = grains[g];
            const age = (now - d.t) / 0.9;
            if (age >= 1) {
              d.el.setAttribute('opacity', '0');
              grains.splice(g, 1);
              continue;
            }
            d.el.setAttribute('cx', (d.x + d.vx * age).toFixed(1));
            d.el.setAttribute('cy', (d.y + d.vy * age).toFixed(1));
            d.el.setAttribute('r', (d.r * (1 - age * 0.6)).toFixed(2));
            d.el.setAttribute('opacity', ((1 - age) * 0.75).toFixed(2));
          }
          if (!grains.length) {
            gsap.ticker.remove(tick);
            ticking = false;
          }
        };
        const shed = (p: DOMPoint, dir: number) => {
          const el = dust[next++ % (wide ? DUST : DUST / 2)];
          const side = (Math.random() - 0.5) * 2;
          const idx = grains.findIndex((d) => d.el === el);
          if (idx >= 0) grains.splice(idx, 1);
          grains.push({
            el,
            x: p.x - Math.cos(dir) * 5,
            y: p.y - Math.sin(dir) * 5,
            vx: -Math.cos(dir) * 10 - Math.sin(dir) * side * 9,
            vy: -Math.sin(dir) * 10 + Math.cos(dir) * side * 9,
            t: gsap.ticker.time,
            r: 0.9 + Math.random() * 1.3,
          });
          if (!ticking) {
            gsap.ticker.add(tick);
            ticking = true;
          }
        };

        // ---------- at rest: the finished figure breathes, one city at a time ----------
        let breath: gsap.core.Tween | null = null;
        let beat = 0;
        let inView = true;
        const breathe = () => {
          const i = beat++ % cities.length;
          gsap.fromTo(ringsOf(i)[0], { scale: 0.5, autoAlpha: 0.38 }, { scale: 2.4, autoAlpha: 0, duration: 2.2, ease: 'expo.out' });
          const star = clusters[i][beat % clusters[i].length];
          gsap.fromTo(star, { opacity: 1, scale: 1.8 }, { opacity: 0.6, scale: 1, duration: 1.6, ease: 'power2.out' });
          breath = gsap.delayedCall(2.6, breathe);
        };
        const rest = (on: boolean) => {
          if (on && !breath && inView) breath = gsap.delayedCall(0.8, breathe);
          if (!on && breath) {
            breath.kill();
            breath = null;
          }
        };

        // ---------- one frame of the scene, from one number ----------
        let lastS = -1;
        let lastShed: DOMPoint | null = null;
        let lastCoord = '';
        const render = (prog: number) => {
          const s = locate(prog);
          const forward = s >= lastS;
          const k = legOf(s);

          legEls.forEach((l, j) => reveal(l, 0, clamp(s - cum[j], 0, legLen[j]), legLen[j]));
          const ts = (s / total) * tailTotal;
          tails.forEach((t, j) => reveal(t, Math.max(0, ts - TAIL[j]), ts, tailTotal));

          // Settling into Delhi: the asteroid shrinks away and the course it flew
          // sits back so the constellation reads first.
          const out = k === EXIT ? (s - cum[EXIT]) / legLen[EXIT] : s >= total ? 1 : 0;
          figEls.forEach((e, j) => {
            // A line forms as its second star lights; the closing line draws
            // alongside the asteroid on its way home to Delhi.
            const r =
              figureLit[j] < 0
                ? smooth(clamp((s - cum[HOME]) / legLen[HOME]))
                : smooth(clamp((s - cityAt[figureLit[j]]) / (figLen[j] * 0.45 + 50)));
            reveal(e, 0, figLen[j] * r, figLen[j]);
          });
          course.style.opacity = `${1 - 0.58 * smooth(clamp((out - 0.3) / 0.5))}`;

          const alpha = Math.min(clamp(s / (legLen[0] * 0.2)), 1 - clamp((out - 0.4) / 0.45));
          const { p, dir } = setAsteroid(s, alpha, 1 - 0.45 * smooth(clamp(out)));
          tails.forEach((t) => (t.style.opacity = `${alpha}`));

          // A camera that leans after the asteroid, never far enough to lose India.
          const env = smooth(Math.min(clamp(s / legLen[0]), 1 - clamp(out / 0.8)));
          const nx = (p.x - (VX + VW / 2)) / VW;
          const ny = (p.y - (VY + VH / 2)) / VH;
          camera.style.transform =
            env > 0.001
              ? `translate(${(-nx * (wide ? 3.4 : 1.8) * env).toFixed(3)}%, ${(-ny * (wide ? 2.6 : 1.4) * env).toFixed(3)}%) scale(${(1 + (wide ? 0.045 : 0.02) * env).toFixed(4)})`
              : '';
          sky.setAttribute('transform', `translate(${(nx * 14 * env).toFixed(2)} ${(ny * 10 * env).toFixed(2)})`);

          const n = cityAt.filter((c) => s >= c - 0.5).length;
          // Back in Delhi: Delhi is the city in focus again until the asteroid settles.
          const atHome = s >= cum[EXIT] - 0.5;
          const current = out > 0.5 ? -1 : atHome ? DELHI : n - 1;
          setHome(atHome, forward);
          setCities(n, current, forward);

          nodes.forEach((nd, i) => {
            const on = s >= nodeAt[i];
            if (on === nd.hasAttribute('data-on')) return;
            nd.toggleAttribute('data-on', on);
            gsap.killTweensOf(nd);
            if (on && forward) gsap.fromTo(nd, { opacity: 1 }, { opacity: 0.7, duration: 1.2, ease: 'power2.out' });
            else gsap.to(nd, { opacity: on ? 0.7 : 0, duration: 0.3 });
          });

          if (forward && alpha > 0.4 && (!lastShed || Math.hypot(p.x - lastShed.x, p.y - lastShed.y) > (wide ? 9 : 14))) {
            shed(p, dir);
            lastShed = p;
          }

          // The instrument reads the asteroid's own position back off the chart.
          const { lon0, lat0, k: kk, s: ss } = map.projection;
          // Off the chart (before the way in, after the way out) it reads nothing.
          const coord = alpha > 0.05 ? `${(lat0 - p.y / ss).toFixed(2)}° N  ${(p.x / (kk * ss) + lon0).toFixed(2)}° E` : '';
          if (coord !== lastCoord) {
            readCoord.textContent = coord;
            lastCoord = coord;
          }

          rest(s >= total - 0.5);
          lastS = s;
        };

        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: 'none',
          onUpdate: () => render(proxy.p),
          scrollTrigger: {
            trigger: st,
            start: 'top top',
            end: () => `+=${window.innerHeight * (wide ? 6.4 : 5.6)}`,
            pin: true,
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        });
        const seen = ScrollTrigger.create({
          trigger: st,
          start: 'top bottom',
          end: 'bottom top',
          onToggle: (self) => {
            inView = self.isActive;
            if (!inView) rest(false);
            else rest(lastS >= total - 0.5);
          },
        });
        render(0);

        return () => {
          rest(false);
          seen.kill();
          gsap.ticker.remove(tick);
          dust.forEach((d) => d.setAttribute('opacity', '0'));
          course.style.opacity = '';
          gsap.set(stars, { clearProps: 'opacity,transform' });
          [...legEls, ...figEls, ...tails].forEach((e) => {
            e.style.strokeDasharray = '';
            e.style.visibility = '';
            e.style.opacity = '';
          });
          camera.style.transform = '';
          sky.removeAttribute('transform');
          sites.forEach((s) => (s.dataset.state = 'resolved'));
          labels.forEach((l) => (l.dataset.state = 'resolved'));
          sites[DELHI].setAttribute('data-home', '');
          labels[DELHI].setAttribute('data-home', '');
          leaders.forEach((l) => (l.dataset.state = 'resolved'));
          nodes.forEach((nd) => nd.removeAttribute('data-on'));
          setAsteroid(cum[PARK] + legLen[PARK] * 0.42, 1);
        };
      });

      return () => {
        mm.revert();
        cleanup();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="road" className={`section ${styles.road}`} data-field="black" aria-labelledby="road-title">
      <CutEdge seed={4} />
      <div className={`wrap content ${styles.intro}`}>
        <Waypoint />
        <header className={styles.head}>
          <div className={styles.titleBlock}>
            <h2 id="road-title" className={`display ${styles.title}`}>
              {road.title}
            </h2>
            <p className={`lede ${styles.strapline}`}>{road.strapline}</p>
          </div>
          <div className={styles.lead}>
            <p className={styles.what}>
              <strong className={styles.name}>{road.name}</strong> {road.what}
            </p>
            <p className={`headline ${styles.subhead}`}>{road.subhead}</p>
          </div>
        </header>
        <ol className="sr-only" aria-label={`${road.name}: the ${cities.length} cities, in order`}>
          {cities.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ol>
      </div>

      <div ref={stage} className={styles.stage}>
        <div className={styles.deep} aria-hidden="true">
          <Starfield className={styles.canvas} density={4} seed={23} />
        </div>

        <div className={styles.frame} aria-hidden="true">
          <div className={styles.camera} data-camera style={{ aspectRatio: `${VW} / ${VH}` } as CSSProperties}>
            <svg className={styles.map} viewBox={map.viewBox.join(' ')}>
              <g className={styles.grid}>
                {map.graticule.lon.map((g) => (
                  <g key={`lon${g.value}`}>
                    <line x1={g.x} x2={g.x} y1={VY} y2={VY + VH} />
                    <text x={g.x + 4} y={VY + VH - 6}>
                      {g.value}°E
                    </text>
                  </g>
                ))}
                {map.graticule.lat.map((g) => (
                  <g key={`lat${g.value}`}>
                    <line x1={VX} x2={VX + VW} y1={g.y} y2={g.y} />
                    <text x={VX + 4} y={g.y - 5}>
                      {g.value}°N
                    </text>
                  </g>
                ))}
              </g>

              <g data-sky>
                {map.stars.field.map(([x, y, r], i) => (
                  <circle key={i} className={styles.fieldStar} cx={x} cy={y} r={r} style={{ '--d': `${(i * 0.37) % 5}s` } as CSSProperties} />
                ))}
              </g>

              <path className={styles.outline} d={map.mainland} data-coast />
              <path className={styles.islands} d={map.islands} data-islands />

              {cities.map((c) => (
                <g key={c.id} className={styles.cluster} data-cluster={c.id}>
                  {map.stars.clusters[c.id as Cluster].map(([x, y, r], i) => (
                    <circle key={i} cx={x} cy={y} r={r} />
                  ))}
                </g>
              ))}

              <path className={styles.ghost} d={map.route.d} />
              <g className={styles.course} data-course>
                {LEGS.map((d, k) => (
                  <path
                    key={k}
                    className={styles.leg}
                    d={d}
                    data-leg={k}
                    style={{ '--o': LEG_OPACITY[k] } as CSSProperties}
                  />
                ))}
              </g>
              {map.figure.map((f, i) => (
                <path
                  key={i}
                  className={styles.figure}
                  d={f.d}
                  style={{ '--o': FIGURE_OPACITY[i] } as CSSProperties}
                  data-figure
                />
              ))}
              {cities.map((c) => (
                <g key={c.id} transform={`translate(${c.x} ${c.y})`}>
                  <path className={styles.star} d={STAR} data-star />
                </g>
              ))}
              <path className={styles.tailFar} d={map.route.d} data-tail />
              <path className={styles.tailNear} d={map.route.d} data-tail />
              <path className={styles.spark} data-spark />

              {NODES.map((_, i) => (
                <path key={i} className={styles.node} d={SPARK} data-node />
              ))}
              {cities.map((c) => (
                <line key={c.id} className={styles.leader} data-leader />
              ))}
              {Array.from({ length: DUST }, (_, i) => (
                <circle key={i} className={styles.grain} r={1} opacity={0} data-dust />
              ))}
            </svg>

            <div className={styles.pins}>
              {cities.map((c) => (
                <div
                  key={c.id}
                  className={styles.site}
                  style={pct(c.x, c.y)}
                  data-site
                  data-state="resolved"
                  data-home={c.id === 'delhi' || undefined}
                >
                  <span className={styles.ring} data-ring />
                  <span className={styles.ring} data-ring />
                  <span className={styles.pin} data-pin>
                    <Glyph name="location" className={styles.pinGlyph} />
                  </span>
                </div>
              ))}
              {cities.map((c, i) => (
                <p
                  key={c.id}
                  className={styles.label}
                  style={pct(c.x + 14, c.y - 14)}
                  data-label
                  data-state="resolved"
                  data-home={c.id === 'delhi' || undefined}
                >
                  <span className={`coord ${styles.labelN}`}>{pad2(i + 1)}</span>
                  <span className={styles.labelName}>{c.name}</span>
                </p>
              ))}
              <div className={styles.asteroid} data-asteroid>
                <Ink name="comet-1" color="yellow" className={styles.comet} />
              </div>
            </div>
          </div>

          <div className={styles.readout}>
            <p className="coord">
              <span data-read-n>{pad2(cities.length)}</span>/{pad2(cities.length)}
              <span className={styles.readName} data-read-name>
                Everyone meets in Delhi
              </span>
            </p>
            <p className={`coord ${styles.readCoord}`} data-read-coord />
          </div>
        </div>
      </div>

      {/* s8, to the sponsor: after the stillness, the invitation */}
      <div className={`wrap content ${styles.coda}`}>
        <p className={`headline ${styles.ride}`}>{road.body}</p>
      </div>
    </section>
  );
}
