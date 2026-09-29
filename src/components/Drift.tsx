'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, registerGsap, useGSAP } from '@/lib/motion';
import styles from './Drift.module.css';

type Props = { children: ReactNode; label: string; className?: string };

/**
 * A row of photographs that drifts sideways while it crosses the viewport,
 * like film running through a gate. On phones and under reduced motion it is
 * a plain swipeable row.
 */
export function Drift({ children, label, className }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      registerGsap();
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - root.current!.clientWidth);
        gsap.fromTo(
          el,
          { x: 0 },
          {
            x: () => -distance(),
            ease: 'none',
            scrollTrigger: {
              trigger: root.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className={`${styles.drift}${className ? ` ${className}` : ''}`}
      role="region"
      aria-label={label}
      tabIndex={0}
    >
      <ul ref={track} className={styles.track}>
        {children}
      </ul>
    </div>
  );
}
