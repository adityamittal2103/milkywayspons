'use client';

import { useEffect } from 'react';
import { ScrollTrigger, registerGsap } from '@/lib/motion';

/**
 * Feedback: every section's heading sits right in front of its marker. Heading
 * sizes differ by section and screen, so each waypoint is moved level with the
 * centre of its heading's first line, measured, and the flight path redrawn.
 */
export function MarkerAlign() {
  useEffect(() => {
    registerGsap();
    let raf = 0;
    const align = () => {
      document.querySelectorAll<HTMLElement>('[data-waypoint]').forEach((wp) => {
        const heading = wp.parentElement?.querySelector<HTMLElement>('h2');
        const node = wp.querySelector<HTMLElement>('[data-anchor]');
        if (!heading || !node) return;
        wp.style.translate = '';
        const range = document.createRange();
        range.selectNodeContents(heading);
        const line = [...range.getClientRects()].find((r) => r.width > 0 && r.height > 0);
        if (!line) return;
        const n = node.getBoundingClientRect();
        const shift = line.top + line.height / 2 - (n.top + n.height / 2);
        wp.style.translate = `0 ${shift.toFixed(1)}px`;
      });
      // The flight path threads the markers: redraw it through their new places.
      ScrollTrigger.refresh();
    };
    const queue = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(align);
    };
    queue();
    document.fonts?.ready.then(queue);
    window.addEventListener('resize', queue);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', queue);
    };
  }, []);
  return null;
}
