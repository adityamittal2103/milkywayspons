'use client';

import { useEffect } from 'react';

/**
 * Phones have no hover (mobile sheet): whatever a desktop reader would hover
 * to reveal comes alive on its own as it reaches the middle of the screen.
 * Duotone photographs return to colour; the moments show their words. Marks
 * the element with data-focus while it sits in the central band.
 */
export function FocusLight() {
  useEffect(() => {
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute('data-focus', e.isIntersecting);
      },
      // A band across the middle of the screen, narrowed at the sides so a
      // sideways row lights one item at a time.
      { rootMargin: '-34% -12% -34% -12%' },
    );
    const watch = () => document.querySelectorAll('[data-print], [data-focus-reveal]').forEach((el) => io.observe(el));
    watch();
    // Sections that render client-side later are picked up once.
    const late = window.setTimeout(watch, 1500);
    return () => {
      io.disconnect();
      window.clearTimeout(late);
    };
  }, []);
  return null;
}
