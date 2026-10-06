'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { audience } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { Dots } from '../Dots';
import { Photo, ratioOf } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Audience.module.css';

/**
 * s5–6: who comes, then where a brand fits in. The three ways in carry the
 * section (the deck asks for them to be highlighted by design); the festival
 * photographs sit beside the copy, smaller, as the comments on s6 ask.
 */
export function Audience() {
  const album = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const holdUntil = useRef(0);

  // Phones (mobile sheet): the collage becomes a slider that starts moving as
  // soon as it is on screen, loops without a visible rewind (copies of the first
  // photographs follow the last and are swapped back unseen), pauses when touched,
  // and shows where it is.
  useEffect(() => {
    const el = album.current;
    if (!el) return;
    const n = audience.photos.length;
    const phone = window.matchMedia('(max-width: 767px)');
    const frames = () => Array.from(el.children) as HTMLElement[];
    // Each photograph rests with its left edge where the copy above starts.
    const left = (f: HTMLElement) => f.offsetLeft - frames()[0].offsetLeft;
    const nearest = () => {
      let best = 0;
      let dist = Infinity;
      frames().forEach((f, i) => {
        const d = Math.abs(left(f) - el.scrollLeft);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      return best;
    };
    let settle = 0;
    const onScroll = () => {
      if (!phone.matches) return;
      setSlide(nearest() % n);
      // Resting on a copy: jump to the original it copies, which looks identical.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const i = nearest();
        if (i >= n) el.scrollTo({ left: left(frames()[i - n]), behavior: 'instant' });
      }, 140);
    };
    let timer = 0;
    let visible = false;
    const step = () => {
      window.clearTimeout(timer);
      if (!phone.matches || !visible || prefersReducedMotion()) return;
      const wait = holdUntil.current - performance.now();
      if (wait > 0) {
        timer = window.setTimeout(step, wait);
        return;
      }
      const next = frames()[nearest() + 1];
      if (next) el.scrollTo({ left: left(next), behavior: 'smooth' });
      timer = window.setTimeout(step, 3200);
    };
    const hold = () => (holdUntil.current = performance.now() + 5000);
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('pointerdown', hold);
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        window.clearTimeout(timer);
        // Moving within a moment of arriving, not after a dead pause.
        if (visible) timer = window.setTimeout(step, 1100);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', hold);
      el.removeEventListener('pointerdown', hold);
      io.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(settle);
    };
  }, []);

  const goTo = (i: number) => {
    const el = album.current;
    const f = el?.children[i] as HTMLElement | undefined;
    if (!el || !f) return;
    holdUntil.current = performance.now() + 5000;
    el.scrollTo({ left: f.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section id="audience" className={`section ${styles.audience}`} data-field="purple" aria-labelledby="audience-title">
      <CutEdge seed={6} />
      <div className="wrap content">
        <Waypoint />

        <div className={styles.top}>
          <div className={styles.copy}>
            <h2 id="audience-title" className={`display ${styles.title}`}>
              {audience.title}
            </h2>
            <p className={`headline ${styles.finding}`}>
              {audience.finding.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
            <p className={`lede ${styles.who}`}>{audience.who}</p>
          </div>

          <div className={`${styles.albumWrap} ${styles.gated}`}>
            <ul ref={album} className={styles.album} aria-label="Festival photographs">
              {audience.photos.map((p, n) => (
                <li key={p.id} className={styles.frame} data-frame={n} style={{ '--ar': ratioOf(p.id) } as CSSProperties}>
                  <Photo id={p.id} alt={p.alt} focus={p.focus} sizes="(max-width: 767px) 80vw, 26vw" />
                </li>
              ))}
              {/* Copies of the first two, for the slider's seamless loop on phones */}
              {audience.photos.slice(0, 2).map((p) => (
                <li
                  key={`${p.id}-loop`}
                  className={`${styles.frame} ${styles.loop}`}
                  aria-hidden="true"
                  style={{ '--ar': ratioOf(p.id) } as CSSProperties}
                >
                  <Photo id={p.id} alt="" focus={p.focus} sizes="80vw" />
                </li>
              ))}
            </ul>
            <div className={styles.dots}>
              <Dots
                count={audience.photos.length}
                current={slide}
                onPick={goTo}
                label="Choose a photograph"
                name={(n) => `Photograph ${n + 1} of ${audience.photos.length}`}
              />
            </div>
          </div>
        </div>

        <div className={styles.pitch}>
          <p className={`headline ${styles.brand}`}>{audience.brand}</p>
          {/* Three aligned columns: the lead-in, the highlighted way in, the rest */}
          <p className={`display ${styles.ways}`}>
            {audience.ways.map((w) => (
              <span key={w.word} className={styles.way}>
                <span className={styles.lead}>{w.lead}</span> <mark className={styles.word}>{w.word}</mark>{' '}
                <span className={styles.tail}>{w.tail}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
