import type { CSSProperties } from 'react';
import { company, companyLogos } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { DeckLogo } from '../DeckLogo';
import { Logo } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './Company.module.css';

// Ring radius as a share of the orbit's width, and how many marks ride each.
const RINGS = [
  { r: 44, count: 11 },
  { r: 31.5, count: 8 },
  { r: 19.5, count: 6 },
];

export function Company() {
  let cursor = 0;
  const rings = RINGS.map((ring) => {
    const marks = companyLogos.slice(cursor, cursor + ring.count);
    cursor += ring.count;
    return { ...ring, marks };
  });

  return (
    <section id="company" className={`section ${styles.company}`} data-field="black" aria-labelledby="company-title">
      <CutEdge seed={8} />
      <div className="wrap content">
        <Waypoint />
        <h2 id="company-title" className={`headline ${styles.title}`}>
          {company.title}
        </h2>

        {/* The orbit: every mark rides its ring and counter-turns to stay upright. */}
        <div className={styles.orbit} aria-hidden="true">
          <svg viewBox="0 0 100 100" className={styles.tracks}>
            {RINGS.map((ring) => (
              <circle key={ring.r} cx="50" cy="50" r={ring.r} />
            ))}
          </svg>
          {rings.map((ring, ri) => (
            <div key={ring.r} className={styles.ring} data-ring={ri}>
              {ring.marks.map((m, i) => (
                <span
                  key={m.id}
                  className={styles.slot}
                  style={{ '--a': `${(360 / ring.marks.length) * i + ri * 14}deg`, '--r': `${ring.r}cqi` } as CSSProperties}
                >
                  <span className={styles.upright}>
                    <DeckLogo id={m.id} name={m.name} color={ri === 1 ? 'yellow' : 'paper'} size="7.6cqi" decorative />
                  </span>
                </span>
              ))}
            </div>
          ))}
          <Logo name="seal" label="Masters' Union University Cultural Fest 2027" color="yellow" className={styles.seal} />
        </div>

        {/* The same company as a list: read by screen readers, and the layout on phones. */}
        <ul className={styles.wall}>
          {companyLogos.map((m) => (
            <li key={m.id}>
              <DeckLogo id={m.id} name={m.name} color="paper" size="3.4rem" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
