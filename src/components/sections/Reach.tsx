'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { reach } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { DeckLogo } from '../DeckLogo';
import { Glyph } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Reach.module.css';

/**
 * s12–14: the platforms in one row, icons all one size, then six reels on a
 * carousel (comments on s12–13): the best three first, the reel in front
 * larger while its neighbours recede, arrows or a swipe for the rest. A tap on
 * a reel at the side brings it forward; a tap on the reel in front opens it.
 */
export function Reach() {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(1);
  const total = reach.reels.length;

  const cards = () => Array.from(track.current?.querySelectorAll<HTMLElement>('[data-reel]') ?? []);
  const centre = (i: number, smooth = true) => {
    const el = track.current;
    const card = cards()[i];
    if (!el || !card) return;
    el.scrollTo({
      left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2,
      behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto',
    });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // Open on the best three: the second of them in front, the first and third beside it.
    centre(1, false);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = el.scrollLeft + el.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        cards().forEach((c, i) => {
          const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
          if (d < dist) {
            dist = d;
            best = i;
          }
        });
        setActive(best);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => onScroll());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const onCard = (i: number) => (e: MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      centre(i);
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

      <div className={styles.reels} role="region" aria-roledescription="carousel" aria-label="Selected reels">
        <ul ref={track} className={styles.track}>
          {reach.reels.map((r, i) => (
            <li key={r.href} className={styles.reel} data-reel data-active={i === active || undefined}>
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.reelLink}
                onClick={onCard(i)}
                onFocus={() => centre(i)}
              >
                <Photo id={r.cover} alt="" treatment="color" className={styles.cover} sizes="(max-width: 767px) 62vw, 20rem" />
                <span className={styles.play} aria-hidden="true">
                  <Glyph name="forward" className={styles.playGlyph} />
                </span>
                <span className="sr-only">
                  Reel {i + 1} of {total}: {r.alt} (opens Instagram in a new tab)
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="wrap content">
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => centre(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Previous reel"
          >
            <Glyph name="forward" className={`${styles.arrowGlyph} ${styles.back}`} />
          </button>
          <p className={`coord ${styles.count}`} aria-live="polite">
            {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => centre(Math.min(total - 1, active + 1))}
            disabled={active === total - 1}
            aria-label="Next reel"
          >
            <Glyph name="forward" className={styles.arrowGlyph} />
          </button>
        </div>
      </div>
    </section>
  );
}
