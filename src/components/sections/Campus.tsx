import { campus, festival, venue } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Glyph, Ink } from '../Ink';
import { TourVideo } from '../TourVideo';
import { Waypoint } from '../Waypoint';
import styles from './Campus.module.css';

/**
 * The festival in calendar order (team's final overrides, 6 Oct): the campus days
 * first, then Yashobhoomi. Composed as in the deck of 8 Oct: the two halves side
 * by side, the campus days in front and the main festival after it, then the
 * campus tour across the column.
 */
export function Campus() {
  const [onCampus, atVenue] = festival.legs;
  return (
    <section id="campus" className={`section ${styles.campus}`} data-field="black" aria-labelledby="campus-title">
      <CutEdge seed={11} />
      <div className={styles.moon} aria-hidden="true">
        <Ink name="crescent" color="indigo" />
      </div>
      <div className="wrap content">
        {/* The page's flight path lifts over the Road to Milky Way chart and resumes here */}
        <Waypoint glyph="location" breakBefore />

        <div className={styles.legs}>
          <h2 id="campus-title" className={styles.leg} data-here>
            <time dateTime={onCampus.iso} className={`display ${styles.dates}`}>
              {onCampus.dates}
            </time>
            <span className={styles.place}>
              {onCampus.place} <span className={styles.star}>✱</span> {onCampus.city}
            </span>
            {/* Shown first (CSS order); after the date in the markup so the route's marker sits level with the date */}
            <span className={styles.tag}>
              <Glyph name="location" className={styles.pin} />
              {campus.kicker}
            </span>
          </h2>

          <span className={styles.next} aria-hidden="true">
            <Glyph name="forward" className={styles.nextGlyph} />
          </span>

          <p className={styles.leg}>
            <time dateTime={atVenue.iso} className={`display ${styles.dates}`}>
              {atVenue.dates}
            </time>
            <span className={styles.place}>
              {atVenue.place} <span className={styles.star}>✱</span> {atVenue.city}
            </span>
            <span className={styles.tag}>
              <Glyph name="location" className={styles.pin} />
              {venue.kicker}
            </span>
          </p>
        </div>

        <div className={styles.media}>
          <TourVideo id={campus.video.youtube} title={campus.video.title} />
        </div>
      </div>
    </section>
  );
}
