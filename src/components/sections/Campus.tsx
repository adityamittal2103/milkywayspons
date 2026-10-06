import { campus, festival } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Glyph } from '../Ink';
import { TourVideo } from '../TourVideo';
import { Waypoint } from '../Waypoint';
import styles from './Campus.module.css';

/**
 * Deck changes (Chirag), placed by the team's brief of 6 Oct 2026: after
 * Yashobhoomi, the festival's other half, at a smaller scale. Two days at
 * Masters' Union University in Gurugram, with the campus tour. The two lines
 * keep the doc's own order: Yashobhoomi first, then the campus.
 */
export function Campus() {
  const [onCampus] = festival.legs;
  const lines = [...festival.legs].reverse();
  return (
    <section id="campus" className={`section ${styles.campus}`} data-field="black" aria-labelledby="campus-title">
      <CutEdge seed={11} />
      <div className="wrap content">
        <Waypoint glyph="location" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={`coord ${styles.kicker}`}>{campus.kicker}</p>
            <h2 id="campus-title" className={styles.title}>
              <span className={`headline ${styles.dates}`}>{onCampus.dates}</span>
              <span className={styles.place}>
                {onCampus.place} <span className={styles.star}>✱</span> {onCampus.city}
              </span>
            </h2>

            <ol className={styles.route} aria-label="Where Milky Way happens">
              {lines.map((l) => (
                <li key={l.iso} className={styles.leg} data-here={l.iso === onCampus.iso || undefined}>
                  <span className={styles.pin}>
                    <Glyph name="location" className={styles.pinGlyph} />
                  </span>
                  <span className={styles.legText}>
                    <time dateTime={l.iso} className={styles.legDates}>
                      {l.dates}
                    </time>
                    <span className={styles.legSep}> ✱ </span>
                    <span className={styles.legPlace}>
                      {l.place}
                      <span className={styles.legSep}> ✱ </span>
                      {l.city}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.media}>
            <TourVideo id={campus.video.youtube} title={campus.video.title} />
          </div>
        </div>
      </div>
    </section>
  );
}
