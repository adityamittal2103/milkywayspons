import type { CSSProperties } from 'react';
import { fest } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink, type InkName } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './MilkyWay.module.css';

// "Floating worlds = different festival experiences" (brand kit symbolism).
// Positions are % of the sky; the dotted lines join them into a constellation.
// Deck of 8 Oct: the worlds renamed (Performing Arts, Gaming and E-Sports,
// Business Events, Informals, Pronites). The longer names need the sky spread
// wider: each label clears every other label and world at 1024–1440.
const SKY = [
  { x: 10, y: 20, size: 0.95 },
  { x: 37, y: 10, size: 0.85 },
  { x: 65, y: 19, size: 0.95 },
  { x: 27, y: 70, size: 0.9 },
  { x: 86, y: 72, size: 1.12 }, // pronites: when the sun goes down
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
          {/* Deck of 8 Oct: two tones, the statement in ink and the invitation in paper */}
          <h2 id="mw-title" className={`headline ${styles.title}`}>
            <span className={styles.titleInk}>{fest.titleParts[0]}</span> {fest.titleParts[1]}
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
