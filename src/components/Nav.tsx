'use client';

import { useEffect, useRef, useState } from 'react';
import { waypoints } from '@/content/milky-way';
import { CutLink } from './CutLink';
import { Glyph } from './Ink';
import styles from './Nav.module.css';

const pad = (i: number) => String(i).padStart(2, '0');

/**
 * One floating header: the mark, where you are (it opens the index), and the
 * two actions. It stays out of the hero, which carries its own actions, slips
 * away while the reader scrolls down and comes back the moment they scroll up.
 * An action steps aside while its own section is on screen.
 */
export function Nav() {
  const [current, setCurrent] = useState(0);
  const [shown, setShown] = useState(false);
  const [here, setHere] = useState({ tiers: false, signal: false });
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const sections = [...waypoints.map((w) => w.id), 'sky']
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // The sky slide belongs to the launch waypoint.
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

    // Which action's own section is on screen
    const own = new IntersectionObserver(
      (entries) => {
        setHere((h) => {
          const next = { ...h };
          for (const e of entries) next[e.target.id as 'tiers' | 'signal'] = e.isIntersecting;
          return next;
        });
      },
      { rootMargin: '-30% 0px -30% 0px' },
    );
    ['tiers', 'signal'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) own.observe(el);
    });

    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const hero = document.getElementById('launch');
        const past = y > (hero ? hero.offsetHeight * 0.85 : window.innerHeight);
        if (!past) setShown(false);
        else if (y < last - 4) setShown(true);
        else if (y > last + 4) setShown(false);
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      own.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Sticky elements below (the tiers table's column heads) sit under the header
  // while it is out, and at the very top while it is away.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-nav-shown', shown);
  }, [shown]);

  const open = () => dialog.current?.showModal();
  const close = () => dialog.current?.close();

  const at = waypoints[Math.max(0, current)];

  return (
    <>
      {/* Keyboard focus inside the header always brings it back (see Nav.module.css) */}
      <header className={styles.bar} data-shown={shown || undefined}>
        <a href="#launch" className={styles.home} aria-label="Milky Way, back to the top">
          <img src="/brand/logo/app-icon.svg" alt="" width={40} height={40} />
        </a>

        <button type="button" className={styles.where} onClick={open} aria-haspopup="dialog">
          <span className={`coord ${styles.whereN}`} aria-hidden="true">
            {pad(Math.max(0, current))}/{pad(waypoints.length - 1)}
          </span>
          <span className={styles.whereLabel}>
            <span className="sr-only">Index. Current section: </span>
            {at.label}
          </span>
        </button>

        <div className={styles.actions}>
          <span className={styles.slot} data-away={here.tiers || undefined}>
            <CutLink href="#tiers" glyph="forward">
              Sponsorship tiers
            </CutLink>
          </span>
          <span className={styles.slot} data-away={here.signal || undefined}>
            <CutLink href="#signal" tone="paper" glyph="forward">
              Contact us
            </CutLink>
          </span>
        </div>
      </header>

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
