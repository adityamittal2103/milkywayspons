import type { CSSProperties } from 'react';
import { reach } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { CutLink } from '../CutLink';
import { DeckLogo } from '../DeckLogo';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Reach.module.css';

// The deck sets the four platforms in descending scale, Instagram first (s15).
const MARK = ['clamp(5rem, 9vw, 8.5rem)', 'clamp(4.2rem, 7vw, 6.8rem)', 'clamp(3.6rem, 5.8vw, 5.6rem)', 'clamp(3rem, 4.6vw, 4.5rem)'];

export function Reach() {
  return (
    <section id="reach" className={`section ${styles.reach}`} data-field="cyan" aria-labelledby="reach-title">
      <CutEdge seed={7} />
      <div className="wrap content">
        <Waypoint />

        <h2 id="reach-title" className={`display ${styles.title}`}>
          {reach.title}
        </h2>

        <ul className={styles.platforms}>
          {reach.platforms.map((p, i) => (
            <li key={p.id} className={styles.platform} style={{ '--mark': MARK[i] } as CSSProperties}>
              <span className={styles.markBox}>
                <DeckLogo id={p.id} name={p.name} color="black" size="var(--mark)" className={styles.mark} />
              </span>
              <span className={`numeral ${styles.value}`}>{p.value}</span>
              <span className={styles.label}>
                <span className={styles.unit}>{p.unit}</span> {p.label}
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.student}>
          <h3 className={`headline ${styles.studentTitle}`}>{reach.studentTitle}</h3>
          <ul className={styles.pages}>
            {reach.studentPages.map((s) => (
              <li key={s.name} className={styles.page}>
                <Photo id={s.photo.id} alt={s.photo.alt} className={styles.frame} sizes="(max-width: 767px) 50vw, 22vw" />
                <p className={styles.pageName}>{s.name}</p>
                <p className={styles.pageMetric}>
                  <span className="numeral">{s.value}</span> {s.unit}
                </p>
                <p className={styles.pageNote}>{s.note}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.reels}>
          <p className={styles.reelsTitle}>From the feed</p>
          <ul className={styles.reelList}>
            {reach.reels.map((r) => (
              <li key={r.href}>
                <CutLink href={r.href} tone="ink" external glyph="forward">
                  {r.label}
                  <span className="sr-only"> (Instagram reel, opens in a new tab)</span>
                </CutLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
