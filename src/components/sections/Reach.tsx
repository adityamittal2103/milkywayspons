'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import { reach } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { DeckLogo } from '../DeckLogo';
import { Dots } from '../Dots';
import { Glyph } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Reach.module.css';

const STEP_MS = 2800;

/**
 * s12–14: the platforms in one row, icons all one size, then the six reels as
 * a revolving three-card system: one reel in front, one either side, the rest
 * waiting behind. It turns on its own from the moment it is in view, forever;
 * a swipe turns it by hand, a tap on a side reel brings it forward, a tap on the
 * reel in front opens it. The site's indicator dots sit beneath (team review).
 */
export function Reach() {
  const stage = useRef<HTMLDivElement>(null);
  const total = reach.reels.length;
  // The best three open the sequence: reel 2 in front, 1 and 3 beside it.
  const [active, setActive] = useState(1);
  const [still, setStill] = useState(false);
  const timer = useRef(0);
  const visible = useRef(false);
  const press = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const schedule = useCallback(() => {
    window.clearTimeout(timer.current);
    if (!visible.current || prefersReducedMotion()) return;
    timer.current = window.setTimeout(() => {
      setActive((a) => (a + 1) % total);
      schedule();
    }, STEP_MS);
  }, [total]);

  useEffect(() => {
    setStill(prefersReducedMotion());
    const el = stage.current;
    if (!el) return;
    // Starts the moment the reels are on screen; rests while they are not.
    const io = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (visible.current) schedule();
        else window.clearTimeout(timer.current);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer.current);
    };
  }, [schedule]);

  const go = (i: number) => {
    setActive(((i % total) + total) % total);
    schedule();
  };

  // Where each reel sits relative to the one in front: 0 front, ±1 beside, ±2 waiting, 3 behind.
  const offset = (i: number) => {
    let d = (i - active + total) % total;
    if (d > total / 2) d -= total;
    return d;
  };

  const onCard = (i: number) => (e: MouseEvent) => {
    // The click that ends a swipe opens nothing.
    if (swiped.current) {
      swiped.current = false;
      e.preventDefault();
      return;
    }
    if (offset(i) !== 0) {
      e.preventDefault();
      go(i);
    }
  };

  // Swipe (or drag) sideways to turn the reels; vertical moves still scroll the page.
  const onDown = (e: PointerEvent) => {
    press.current = { x: e.clientX, y: e.clientY };
    swiped.current = false;
  };
  const onUp = (e: PointerEvent) => {
    const p = press.current;
    press.current = null;
    if (!p) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      swiped.current = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  };

  return (
    <section id="reach" className={`section ${styles.reach}`} data-field="cyan" aria-labelledby="reach-title">
      <CutEdge seed={7} />
      <div className="wrap content">
        <Waypoint />

        <h2 id="reach-title" className={`display ${styles.title}`}>
          {reach.title}
        </h2>

        <ul className={styles.platforms}>
          {reach.platforms.map((p) => (
            <li key={p.id} className={styles.platform}>
              <span className={styles.icon}>
                <DeckLogo id={p.id} name={p.name} color="black" size="3rem" />
              </span>
              <span className={`numeral ${styles.value}`}>{p.value}</span>
              <span className={styles.unit}>
                {p.unit}
                {p.label ? <span className={styles.handle}>{p.label}</span> : null}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={stage}
        className={`gate ${styles.reels}`}
        role="region"
        aria-roledescription="carousel"
        aria-label="Selected reels"
        data-still={still || undefined}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (press.current = null)}
      >
        <ul className={styles.system}>
          {reach.reels.map((r, i) => {
            const d = offset(i);
            const shown = Math.abs(d) <= 1;
            return (
              <li key={r.href} className={styles.reel} data-slot={d} style={{ '--d': d } as CSSProperties}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.reelLink}
                  onClick={onCard(i)}
                  tabIndex={shown ? 0 : -1}
                  aria-hidden={!shown || undefined}
                  draggable={false}
                >
                  <Photo id={r.cover} alt="" treatment="color" priority className={styles.cover} sizes="(max-width: 767px) 50vw, 18rem" />
                  <span className={styles.play} aria-hidden="true">
                    <Glyph name="forward" className={styles.playGlyph} />
                  </span>
                  <span className="sr-only">
                    {d === 0 ? `Reel ${i + 1} of ${total}, in front: ${r.alt} (opens Instagram in a new tab)` : `Bring reel ${i + 1} forward: ${r.alt}`}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="wrap content">
        <Dots
          className={styles.dots}
          count={total}
          current={active}
          onPick={go}
          label="Choose a reel"
          name={(i) => `Reel ${i + 1} of ${total}: ${reach.reels[i].alt}`}
        />
      </div>
    </section>
  );
}
