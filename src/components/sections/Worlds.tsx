import type { CSSProperties } from 'react';
import { worlds } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink, type InkName } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './Worlds.module.css';

// "Floating worlds = different festival experiences" (brand kit symbolism).
// Positions are % of the sky; the lines join them into the constellation the
// deck's heading names.
const SKY = [
  { x: 10, y: 16, size: 1 },
  { x: 42, y: 6, size: 0.9 },
  { x: 80, y: 20, size: 1 },
  { x: 22, y: 70, size: 0.95 },
  { x: 64, y: 64, size: 1.35 }, // pronites: the nights
];

export function Worlds() {
  const items = [
    ...worlds.categories.map((c) => ({ name: c.name, art: c.art as InkName, count: null as string | null })),
    { name: worlds.nights.name, art: worlds.nights.art as InkName, count: worlds.nights.count },
  ];
  return (
    <section id="worlds" className={`section ${styles.worlds}`} data-field="purple" aria-labelledby="worlds-title">
      <CutEdge seed={6} />
      <div className="wrap content">
        <Waypoint />

        <div className={styles.head}>
          <h2 id="worlds-title" className={`display ${styles.title}`}>
            {worlds.title}
          </h2>
          <div className={styles.intro}>
            <p className={`numeral ${styles.figure}`} aria-hidden="true">
              {worlds.figure}
            </p>
            <p className={styles.text}>{worlds.text}</p>
          </div>
        </div>

        <div className={styles.sky}>
          <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={SKY.map((p) => `${p.x},${p.y}`).join(' ')} />
            <line x1={SKY[0].x} y1={SKY[0].y} x2={SKY[3].x} y2={SKY[3].y} />
          </svg>
          <ul className={styles.list} aria-label="Event categories named in the programme">
            {items.map((w, i) => (
              <li
                key={w.name}
                className={styles.world}
                style={
                  {
                    '--x': `${SKY[i].x}%`,
                    '--y': `${SKY[i].y}%`,
                    '--size': SKY[i].size,
                    '--bob': `${7 + i * 1.3}s`,
                  } as CSSProperties
                }
                data-nights={w.count ? '' : undefined}
              >
                <span className={styles.art}>
                  <Ink name={w.art} color="black" />
                </span>
                <span className={`headline ${styles.name}`}>
                  {w.count ? <span className={`numeral ${styles.count}`}>{w.count}</span> : null}
                  {w.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
