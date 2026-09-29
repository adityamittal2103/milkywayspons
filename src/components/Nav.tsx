'use client';

import { useEffect, useRef, useState } from 'react';
import { waypoints } from '@/content/milky-way';
import { CutLink } from './CutLink';
import { Glyph } from './Ink';
import styles from './Nav.module.css';

const pad = (i: number) => String(i).padStart(2, '0');

/**
 * Navigation as an instrument, not a bar: the mark top-left, the one action
 * top-right, and a readout bottom-left that names the current waypoint and
 * opens the full index.
 */
export function Nav() {
  const [current, setCurrent] = useState(0);
  const [tucked, setTucked] = useState(false);
  const [inHero, setInHero] = useState(true);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const sections = [...waypoints.map((w) => w.id), 'prologue']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // The prologue belongs to the launch waypoint.
          if (e.isIntersecting)
            setCurrent(
              Math.max(
                0,
                waypoints.findIndex((w) => w.id === e.target.id),
              ),
            );
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));

    // The readout sits over content; it steps aside while the reader moves down.
    let last = window.scrollY;
    let idle = 0;
    const onScroll = () => {
      const y = window.scrollY;
      // The hero carries its own readout and action; the index waits until it has flown past.
      setInHero(y < window.innerHeight * 0.9);
      if (Math.abs(y - last) > 6) setTucked(y > last && y > 400);
      last = y;
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setTucked(false), 1100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idle);
    };
  }, []);

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  const here = waypoints[Math.max(0, current)];

  return (
    <>
      <a href="#launch" className={styles.home} aria-label="Milky Way, back to the top">
        <img src="/brand/logo/app-icon.svg" alt="" width={44} height={44} />
      </a>

      <div className={styles.action}>
        <CutLink href="#signal" glyph="forward">
          Send a signal
        </CutLink>
      </div>

      <button
        type="button"
        className={styles.readout}
        onClick={open}
        aria-haspopup="dialog"
        data-tucked={tucked || inHero || undefined}
      >
        <span className={styles.readoutN} aria-hidden="true">
          {pad(Math.max(0, current))}/{pad(waypoints.length - 1)}
        </span>
        <span className={styles.readoutLabel}>
          <span className="sr-only">Index. Current section: </span>
          {here.label}
        </span>
        <span className={styles.readoutTrack} aria-hidden="true">
          {waypoints.map((w, i) => (
            <span key={w.id} className={styles.tick} data-on={i <= current || undefined} />
          ))}
        </span>
      </button>

      <dialog ref={dialog} className={styles.index} aria-label="Index" onClick={(e) => e.target === dialog.current && close()}>
        <div className={styles.indexInner}>
          <div className={styles.indexHead}>
            <p className={styles.indexTitle}>Flight plan</p>
            <button type="button" className={styles.close} onClick={close}>
              Close
            </button>
          </div>
          <nav aria-label="Sections">
            <ol className={styles.list}>
              {waypoints.map((w, i) => (
                <li key={w.id}>
                  <a
                    href={`#${w.id}`}
                    onClick={close}
                    className={styles.item}
                    aria-current={i === current ? 'location' : undefined}
                  >
                    <span className={`coord ${styles.itemN}`}>{pad(i)}</span>
                    <span className={styles.itemLabel}>{w.label}</span>
                    {i === current ? <Glyph name="star" className={styles.itemHere} /> : null}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </dialog>
    </>
  );
}
