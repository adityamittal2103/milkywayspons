'use client';

import { useEffect, useRef, useState } from 'react';
import { audience } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { Photo } from '../Photo';
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

  // Phones (mobile sheet): the collage becomes a slider that advances on its
  // own, pauses when touched, and shows where it is.
  useEffect(() => {
    const el = album.current;
    if (!el) return;
    const phone = window.matchMedia('(max-width: 767px)');
    const frames = () => Array.from(el.children) as HTMLElement[];
    const onScroll = () => {
      if (!phone.matches) return;
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      frames().forEach((f, i) => {
        if (Math.abs(f.offsetLeft + f.offsetWidth / 2 - mid) < Math.abs(frames()[best].offsetLeft + frames()[best].offsetWidth / 2 - mid)) best = i;
      });
      setSlide(best);
    };
    const hold = () => (holdUntil.current = performance.now() + 5000);
    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('touchstart', hold, { passive: true });
    el.addEventListener('pointerdown', hold);
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    const timer = window.setInterval(() => {
      if (!phone.matches || !visible || prefersReducedMotion() || performance.now() < holdUntil.current) return;
      const list = frames();
      const mid = el.scrollLeft + el.clientWidth / 2;
      const now = list.findIndex((f) => f.offsetLeft + f.offsetWidth > mid);
      const next = list[(now + 1) % list.length];
      el.scrollTo({ left: next.offsetLeft - (el.clientWidth - next.offsetWidth) / 2, behavior: 'smooth' });
    }, 3200);
    return () => {
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('touchstart', hold);
      el.removeEventListener('pointerdown', hold);
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  const goTo = (i: number) => {
    const el = album.current;
    const f = el?.children[i] as HTMLElement | undefined;
    if (!el || !f) return;
    holdUntil.current = performance.now() + 5000;
    el.scrollTo({ left: f.offsetLeft - (el.clientWidth - f.offsetWidth) / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
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

          <div className={styles.albumWrap}>
            <ul ref={album} className={styles.album} aria-label="Festival photographs">
              {audience.photos.map((p, n) => (
                <li key={p.id} className={styles.frame} data-frame={n}>
                  <Photo id={p.id} alt={p.alt} sizes="(max-width: 767px) 80vw, 26vw" />
                </li>
              ))}
            </ul>
            <div className={styles.dots} role="group" aria-label="Choose a photograph">
              {audience.photos.map((p, n) => (
                <button
                  key={p.id}
                  type="button"
                  className={styles.dot}
                  data-on={n === slide || undefined}
                  onClick={() => goTo(n)}
                  aria-label={`Photograph ${n + 1} of ${audience.photos.length}`}
                  aria-current={n === slide || undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.pitch}>
          <p className={`headline ${styles.brand}`}>{audience.brand}</p>
          <p className={`display ${styles.ways}`}>
            {audience.ways.map((w) => (
              <span key={w.word} className={styles.way}>
                {w.lead} <mark className={styles.word}>{w.word}</mark> {w.tail}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
