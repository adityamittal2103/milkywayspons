'use client';

import { useEffect, useRef } from 'react';
import { firsts, learned, moments } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { Glyph } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Origin.module.css';

/**
 * s9–11, read as one sentence: we've learned from the best, pulled off our
 * firsts, and crafted the biggest moments. The guests run past on their own
 * (s9 comment); the moments scroll sideways under arrows and show their words
 * only when a picture is hovered, focused or tapped (s11 comment).
 */
export function Origin() {
  const track = useRef<HTMLUListElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);

  // The guests drift on their own, slowly (mobile sheet: it was too fast). Hover
  // only slows them; a swipe, a scroll or the arrows hold them for a few seconds.
  useEffect(() => {
    const el = strip.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    let last = 0;
    let pos = el.scrollLeft;
    let hover = false;
    let visible = false;
    const half = () => (el.firstElementChild as HTMLElement).scrollWidth / 2;
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      if (now < holdUntil.current) pos = el.scrollLeft;
      else {
        pos += ((window.innerWidth < 768 ? 20 : 26) * (hover ? 0.4 : 1) * dt) / 1000;
        if (pos >= half()) pos -= half();
        el.scrollLeft = pos;
      }
      raf = visible ? requestAnimationFrame(tick) : 0;
    };
    const hold = () => (holdUntil.current = performance.now() + 3500);
    const enter = () => (hover = true);
    const leave = () => (hover = false);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(el);
    el.addEventListener('pointerdown', hold);
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('wheel', hold, { passive: true });
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', hold);
      el.removeEventListener('touchstart', hold);
      el.removeEventListener('wheel', hold);
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
    };
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    holdUntil.current = performance.now() + 4000;
    const card = el.querySelector('li');
    const half = (el.firstElementChild as HTMLElement).scrollWidth / 2;
    // Going back from the very start wraps to the matching point of the second copy.
    if (dir < 0 && el.scrollLeft < 4) el.scrollLeft += half;
    const gap = parseFloat(getComputedStyle(el.querySelector('ul')!).columnGap) || 0;
    el.scrollBy({ left: dir * ((card?.getBoundingClientRect().width ?? 200) + gap), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector('li');
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * ((item?.getBoundingClientRect().width ?? el.clientWidth * 0.8) + gap), behavior: 'smooth' });
  };

  return (
    <section id="origin" className={`section ${styles.origin}`} data-field="indigo" aria-labelledby="origin-title">
      <CutEdge seed={2} />
      <div className="wrap content">
        {/* The page's flight path lifts over the Road to Milky Way chart and resumes here */}
        <Waypoint breakBefore />
        <h2 id="origin-title" className={`headline ${styles.title}`}>
          {learned.title}
        </h2>
      </div>

      {/* The guests, running past. The second copy closes the loop for sighted readers only. */}
      <div ref={strip} className={`gate ${styles.marquee}`} role="region" aria-label="Guests who have spoken at Masters' Union" tabIndex={0}>
        <div className={styles.run}>
          {[0, 1].map((copy) => (
            <ul key={copy} className={styles.people} aria-hidden={copy === 1 || undefined}>
              {learned.people.map((p) => (
                <li key={p.photo} className={styles.person}>
                  <Photo
                    id={p.photo}
                    alt={copy === 1 ? '' : p.name ?? 'A guest speaker at Masters’ Union'}
                    className={styles.portrait}
                    sizes="16rem"
                  />
                  {p.name ? <span className={`headline ${styles.name}`}>{p.name}</span> : null}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className={`wrap content ${styles.stripControls}`}>
        <p className={`coord ${styles.swipe}`}>Swipe or use the arrows</p>
        <button type="button" className={styles.arrow} onClick={() => nudge(-1)} aria-label="Previous guests">
          <Glyph name="forward" className={`${styles.arrowGlyph} ${styles.back}`} />
        </button>
        <button type="button" className={styles.arrow} onClick={() => nudge(1)} aria-label="More guests">
          <Glyph name="forward" className={styles.arrowGlyph} />
        </button>
      </div>

      <div className="wrap content">
        <div className={styles.firsts}>
          <h3 className={`headline ${styles.beat}`}>{firsts.title}</h3>
          <ul className={styles.firstList}>
            {firsts.items.map((f) => (
              <li key={f.figure} className={styles.first}>
                <Photo
                  id={f.photo.id}
                  alt={f.photo.alt}
                  caption={f.photo.caption}
                  className={styles.firstPhoto}
                  sizes="(max-width: 767px) 100vw, 30vw"
                />
                <p className={`numeral ${styles.firstFigure}`}>{f.figure}</p>
                <p className={styles.firstLabel}>{f.label}</p>
              </li>
            ))}
          </ul>

          <div className={styles.scratch}>
            <p className={`display ${styles.doing}`}>{firsts.lead}</p>
            <p className={`headline ${styles.building}`}>{firsts.line}</p>
            <p className={styles.team}>
              {firsts.team.lead} <span className={`numeral ${styles.teamValue}`}>{firsts.team.value}</span> {firsts.team.label}
            </p>
            <p className={styles.support}>{firsts.support}</p>
          </div>
        </div>

        <div className={styles.moments}>
          <div className={styles.momentsHead}>
            <h3 className={`headline ${styles.beat}`}>
              {moments.title} <span className={styles.signature}>{moments.signature}</span>
            </h3>
            <div className={styles.arrows}>
              <button type="button" className={styles.arrow} onClick={() => step(-1)} aria-label="Previous moment">
                <Glyph name="forward" className={`${styles.arrowGlyph} ${styles.back}`} />
              </button>
              <button type="button" className={styles.arrow} onClick={() => step(1)} aria-label="Next moment">
                <Glyph name="forward" className={styles.arrowGlyph} />
              </button>
            </div>
          </div>
          <ul ref={track} className={styles.momentTrack}>
            {moments.items.map((m) => (
              <li key={m.name} className={styles.moment} tabIndex={0} data-focus-reveal>
                <Photo id={m.photo.id} alt={m.photo.alt} className={styles.momentPhoto} sizes="(max-width: 767px) 85vw, 40vw" />
                <Glyph name="special-point" className={styles.hint} />
                <div className={styles.momentText}>
                  <p className={`headline ${styles.momentName}`}>{m.name}</p>
                  <p className={styles.momentLine}>{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
