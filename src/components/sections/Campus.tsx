import { campus, festival, venue } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Glyph, Ink } from '../Ink';
import { TourVideo } from '../TourVideo';
import { Waypoint } from '../Waypoint';
import styles from './Campus.module.css';

/**
 * Deck changes (Chirag), placed by the team's brief of 6 Oct 2026: after
 * Yashobhoomi, the festival's other half, at a smaller scale. Two days at
 * Masters' Union University in Gurugram, with the campus tour. The page's order
 * puts the venue first (it is the main event); the dates run in calendar order,
 * campus first, and say which half is which.
 */
export function Campus() {
  const [onCampus] = festival.legs;
  return (
    <section id="campus" className={`section ${styles.campus}`} data-field="black" aria-labelledby="campus-title">
      <CutEdge seed={11} />
      <div className={styles.moon} aria-hidden="true">
        <Ink name="crescent" color="indigo" />
      </div>
      <div className="wrap content">
        <Waypoint glyph="location" />
        <div className={styles.grid}>
          <div className={styles.copy}>
            <p className={`coord ${styles.kicker}`}>{campus.kicker}</p>
            <h2 id="campus-title" className={styles.title}>
              <span className={`display ${styles.dates}`}>{onCampus.dates}</span>
              <span className={styles.place}>
                {onCampus.place} <span className={styles.star}>✱</span> {onCampus.city}
              </span>
            </h2>

            {/* The festival in calendar order: the campus days, then the main festival */}
            <ol className={styles.route} aria-label="Milky Way, day by day">
              {festival.legs.map((l) => {
                const here = l.iso === onCampus.iso;
                return (
                  <li key={l.iso} className={styles.leg} data-here={here || undefined}>
                    <span className={styles.pin}>
                      <Glyph name="location" className={styles.pinGlyph} />
                    </span>
                    <span className={styles.legText}>
                      <span className={styles.legTag}>{here ? campus.kicker : venue.kicker}</span>
                      <time dateTime={l.iso} className={styles.legDates}>
                        {l.dates}
                      </time>
                      <span className={styles.legPlace}>
                        {l.place}
                        <span className={styles.legSep}> ✱ </span>
                        {l.city}
                      </span>
                    </span>
                  </li>
                );
              })}
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
