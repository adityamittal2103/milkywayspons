import type { CSSProperties } from 'react';
import { fest } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink, type InkName } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './MilkyWay.module.css';

// "Floating worlds = different festival experiences" (brand kit symbolism).
// Positions are % of the sky; the dotted lines join them into a constellation.
// Team review (6 Oct): Performing Arts sat under the Pronites world; it now
// rises up and to the left, and Pronites settles lower right, with clear sky between.
const SKY = [
  { x: 9, y: 22, size: 0.95 },
  { x: 34, y: 8, size: 0.85 },
  { x: 57, y: 18, size: 0.95 },
  { x: 24, y: 72, size: 0.9 },
  { x: 84, y: 70, size: 1.15 }, // pronites: when the sun goes down
];

/** s3: what Milky Way is, in numbers; then the day and night of it, drawn as worlds (s4 comment). */
export function MilkyWay() {
  return (
    <section id="milky-way" className={`section ${styles.mw}`} data-field="plum" aria-labelledby="mw-title">
      <CutEdge seed={3} />
      <div className={styles.galaxy} aria-hidden="true">
        <Ink name="spiral-galaxy" color="black" />
      </div>

      <div className="wrap content">
        <Waypoint />

        <header className={styles.head}>
          <p className={styles.label}>{fest.label}</p>
          <h2 id="mw-title" className={`headline ${styles.title}`}>
            {fest.title}
          </h2>
          <p className={`lede ${styles.subhead}`}>{fest.subhead}</p>
        </header>

        {/* Four callouts side by side, all one size */}
        <dl className={styles.stats}>
          {fest.stats.map((s) => (
            <div key={s.label} className={styles.stat}>
              <dt className={styles.statLabel}>{s.label}</dt>
              <dd className={`numeral ${styles.statValue}`}>{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className={styles.days}>
          <p className={`lede ${styles.events}`}>{fest.events}</p>
          <p className={styles.body}>{fest.body}</p>
        </div>

        <div className={styles.sky}>
          <svg className={styles.lines} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polyline points={SKY.map((p) => `${p.x},${p.y}`).join(' ')} />
            <line x1={SKY[0].x} y1={SKY[0].y} x2={SKY[3].x} y2={SKY[3].y} />
          </svg>
          <ul className={styles.list} aria-label="What the festival days hold">
            {fest.symbols.map((w, i) => (
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
                data-nights={i === fest.symbols.length - 1 || undefined}
              >
                <span className={styles.art}>
                  <Ink name={w.art as InkName} color="black" />
                </span>
                <span className={`headline ${styles.name}`}>{w.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
