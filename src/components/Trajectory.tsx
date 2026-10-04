'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion, registerGsap, ScrollTrigger } from '@/lib/motion';
import { Ink } from './Ink';
import styles from './Trajectory.module.css';

type Anchor = { el: HTMLElement; x: number; y: number; len: number; brk: boolean };

/**
 * The flight path. One route threads every [data-anchor] on the page in
 * document order: from the landing pin through the fest and the venue to the
 * Road to Milky Way, where the India constellation takes over the journey,
 * then from Masters' Union's story on to the sponsor's signal. An anchor marked
 * data-anchor-break starts a new leg rather than joining the last one. The
 * planned route is dashed; scrolling flies it, and a comet from the brand kit
 * rides the head. Anchors behind the head are marked data-passed.
 */
export function Trajectory() {
  const svgRef = useRef<SVGSVGElement>(null);
  const casingRef = useRef<SVGPathElement>(null);
  const plannedRef = useRef<SVGPathElement>(null);
  const flownRef = useRef<SVGPathElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    const svg = svgRef.current!;
    // The overlay fills its positioned parent (<main>); anchors live anywhere inside it.
    const host = svg.parentElement!.parentElement!;
    const casing = casingRef.current!;
    const planned = plannedRef.current!;
    const flown = flownRef.current!;
    const head = headRef.current!;
    const reduce = prefersReducedMotion();

    let anchors: Anchor[] = [];
    let total = 0;
    let raf = 0;

    const build = () => {
      const hostRect = host.getBoundingClientRect();
      const width = host.scrollWidth;
      const height = host.scrollHeight;
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.style.height = `${height}px`;

      const els = Array.from(host.querySelectorAll<HTMLElement>('[data-anchor]')).filter((el) => el.offsetParent !== null);
      anchors = els
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            el,
            x: r.left - hostRect.left + r.width / 2,
            y: r.top - hostRect.top + r.height / 2,
            len: 0,
            brk: el.hasAttribute('data-anchor-break'),
          };
        })
        .sort((a, b) => a.y - b.y);
      if (anchors.length < 2) return;

      // Each leg leaves and arrives vertically: long S-curves, like a plotted course.
      let d = `M${anchors[0].x.toFixed(1)} ${anchors[0].y.toFixed(1)}`;
      const probe = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      svg.appendChild(probe);
      total = 0;
      for (let i = 1; i < anchors.length; i++) {
        const a = anchors[i - 1];
        const b = anchors[i];
        if (b.brk) {
          // A handover: the pen lifts and the route resumes here.
          b.len = total;
          d += ` M${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
          continue;
        }
        const k = (b.y - a.y) * 0.5;
        const seg = `C${a.x.toFixed(1)} ${(a.y + k).toFixed(1)} ${b.x.toFixed(1)} ${(b.y - k).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        probe.setAttribute('d', `M${a.x} ${a.y} ${seg}`);
        total += probe.getTotalLength();
        b.len = total;
        d += ` ${seg}`;
      }
      probe.remove();
      [casing, planned, flown].forEach((p) => p.setAttribute('d', d));
      flown.style.strokeDasharray = `${total} ${total}`;
      update();
    };

    const update = () => {
      raf = 0;
      if (anchors.length < 2) return;
      let len = total;
      let lifted = false;
      if (!reduce) {
        const hostTop = host.getBoundingClientRect().top + window.scrollY;
        const target = window.scrollY + window.innerHeight * 0.58 - hostTop;
        len = 0;
        if (target >= anchors[anchors.length - 1].y) len = total;
        else {
          for (let i = 1; i < anchors.length; i++) {
            const a = anchors[i - 1];
            const b = anchors[i];
            if (target < b.y) {
              const t = Math.max(0, (target - a.y) / (b.y - a.y));
              len = target < anchors[0].y ? 0 : a.len + t * (b.len - a.len);
              lifted = b.brk && target > a.y;
              break;
            }
          }
        }
      }
      flown.style.strokeDashoffset = `${total - len}`;
      for (const a of anchors) a.el.toggleAttribute('data-passed', len >= a.len - 1);

      // The comet emerges from the landing pin rather than sitting on its words.
      const visible = len > 56 && len < total && !lifted;
      head.style.opacity = visible ? '1' : '0';
      if (visible) {
        const p = flown.getPointAtLength(len);
        const q = flown.getPointAtLength(Math.max(0, len - 6));
        const angle = (Math.atan2(p.y - q.y, p.x - q.x) * 180) / Math.PI;
        // The kit's comet travels toward its lower-left (135°); turn it to face the course.
        head.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${angle - 135}deg)`;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    build();
    const ro = new ResizeObserver(() => build());
    ro.observe(host);
    ScrollTrigger.addEventListener('refresh', build);
    document.fonts?.ready.then(build);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      ScrollTrigger.removeEventListener('refresh', build);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Two layers: the route runs beneath the page's content, in the margin rail;
  // the comet flies above it as the page's one foreground object. Moving photo
  // bands fade out before they reach the rail (the gate), so nothing crosses it.
  return (
    <>
      <div className={styles.layer} aria-hidden="true">
        <svg ref={svgRef} className={styles.svg} preserveAspectRatio="none">
          <path ref={casingRef} className={styles.casing} />
          <path ref={plannedRef} className={styles.planned} />
          <path ref={flownRef} className={styles.flown} />
        </svg>
      </div>
      <div className={styles.sky} aria-hidden="true">
        <div ref={headRef} className={styles.head}>
          <span className={styles.drift}>
            <Ink name="comet-1" color="yellow" className={styles.comet} />
          </span>
        </div>
      </div>
    </>
  );
}
