'use client';

import { useEffect, useRef, useState } from 'react';
import { firsts, learned, moments } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { Dots } from '../Dots';
import { Glyph } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Origin.module.css';

// One guest's step along the strip, and one copy of the whole row (the loop length)
const pitch = (el: HTMLElement) => {
  const li = el.querySelectorAll('li');
  return li.length > 1 ? li[1].offsetLeft - li[0].offsetLeft : el.clientWidth;
};
const copy = (el: HTMLElement) => {
  const rows = el.querySelectorAll('ul');
  return rows[1] && rows[1].offsetWidth ? rows[1].offsetLeft - rows[0].offsetLeft : el.scrollWidth;
};

/**
 * s9–11, read as one sentence: we've learned from the best, pulled off our
 * firsts, and crafted the biggest moments. The guests run past on their own
 * (s9 comment); the moments scroll sideways, one at a time, and show their words
 * only when a picture is hovered, focused or tapped (s11 comment). Both use the
 * site's indicator dots (team review), not arrows.
 */
export function Origin() {
  const track = useRef<HTMLUListElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const holdUntil = useRef(0);
  const [guest, setGuest] = useState(0);
  const [moment, setMoment] = useState(0);
  // Where the moments can come to rest: one per picture on phones, fewer where
  // two fit side by side (the last stop is the end of the row).
  const [stops, setStops] = useState<number[]>(() => moments.items.map((_, i) => i));
  const guests = learned.people.length;

  // The guests drift on their own, slowly (mobile sheet: it was too fast). Hover
  // only slows them; a swipe, a scroll or a dot holds them for a few seconds.
  useEffect(() => {
    const el = strip.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    let last = 0;
    let pos = el.scrollLeft;
    let hover = false;
    let visible = false;
    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      if (now < holdUntil.current) pos = el.scrollLeft;
      else {
        pos += ((window.innerWidth < 768 ? 20 : 26) * (hover ? 0.4 : 1) * dt) / 1000;
        if (pos >= copy(el)) pos -= copy(el);
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

  // Which guest is at the head of the strip (just clear of the gate), and which
  // moment is in front: both follow the scroll, however it was moved.
  useEffect(() => {
    const el = strip.current;
    const row = track.current;
    if (!el || !row) return;
    const onStrip = () => setGuest(Math.round(el.scrollLeft / pitch(el)) % guests);
    let rest: number[] = [];
    const measure = () => {
      const items = Array.from(row.children) as HTMLElement[];
      const first = items[0]?.offsetLeft ?? 0;
      const max = row.scrollWidth - row.clientWidth;
      rest = items.map((it) => it.offsetLeft - first).filter((x) => x < max - 2);
      rest.push(Math.max(0, max));
      setStops([...rest]);
      onTrack();
    };
    const onTrack = () => {
      let best = 0;
      rest.forEach((x, i) => {
        if (Math.abs(x - row.scrollLeft) < Math.abs(rest[best] - row.scrollLeft)) best = i;
      });
      setMoment(best);
    };
    measure();
    el.addEventListener('scroll', onStrip, { passive: true });
    row.addEventListener('scroll', onTrack, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      el.removeEventListener('scroll', onStrip);
      row.removeEventListener('scroll', onTrack);
      window.removeEventListener('resize', measure);
    };
  }, [guests]);

  const toGuest = (i: number) => {
    const el = strip.current;
    if (!el) return;
    holdUntil.current = performance.now() + 4500;
    // Of the two copies, go to whichever is nearer, so the strip never rewinds.
    const a = i * pitch(el);
    const b = a + copy(el);
    const left = Math.abs(b - el.scrollLeft) < Math.abs(a - el.scrollLeft) ? b : a;
    el.scrollTo({ left, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
  const toMoment = (i: number) => {
    track.current?.scrollTo({ left: stops[i] ?? 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <section id="origin" className={`section ${styles.origin}`} data-field="indigo" aria-labelledby="origin-title">
      <CutEdge seed={2} />
      <div className="wrap content">
        <Waypoint />
        <h2 id="origin-title" className={`headline ${styles.title}`}>
          {learned.title} <span className={styles.signature}>{learned.subtitle}</span>
        </h2>
      </div>

      {/* The guests, running past. The second copy closes the loop for sighted readers only. */}
      <div ref={strip} className={`gate ${styles.marquee}`} role="region" aria-label={`Guests: ${learned.subtitle}`} tabIndex={0}>
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

      <div className="wrap content">
        <Dots
          className={styles.dots}
          count={guests}
          current={guest}
          onPick={toGuest}
          label="Choose a guest"
          name={(i) => learned.people[i].name}
        />
      </div>

      <div className="wrap content">
        <div className={styles.firsts}>
          <h3 className={`headline ${styles.beat}`}>
            {firsts.title} <span className={styles.signature}>{firsts.subtitle}</span>
          </h3>
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
        </div>

        {/* Team review (6 Oct): "We learn by doing" is dropped; the firsts lead straight into the moments */}
        <div className={styles.moments}>
          <div className={styles.momentsHead}>
            <h3 className={`headline ${styles.beat}`}>
              {moments.title} <span className={styles.signature}>{moments.signature}</span>
            </h3>
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
          <Dots
            className={styles.dots}
            count={stops.length}
            current={moment}
            onPick={toMoment}
            label="Choose a moment"
            name={(i) => moments.items[i === stops.length - 1 ? moments.items.length - 1 : i].name}
          />
        </div>
      </div>
    </section>
  );
}
