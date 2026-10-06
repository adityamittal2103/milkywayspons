import { venue } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Landing.module.css';

/**
 * s7: the venue, the main festival and the page's destination (team brief,
 * 6 Oct 2026): after the campus days, the festival lands here. The place's standing takes
 * the page at full width, then Yashobhoomi itself, wide and in colour, easing in
 * as it scrolls past; the stage, the hall and the promise follow. Set in deep
 * indigo (the kit's Indigo drawn toward Phantom Black) inside the Deep Space world.
 */
export function Landing() {
  const [stage, outside, hall] = venue.photos;
  return (
    <section id="landing" className={`section ${styles.landing}`} data-field="deep" aria-labelledby="landing-title">
      <CutEdge seed={5} />
      <div className={styles.flag} aria-hidden="true">
        <Ink name="badge-flag" color="indigo" />
      </div>

      <div className="wrap content">
        <Waypoint glyph="location" />

        {/* "The Venue", then the place and dates beside it, not stacked into one narrow column */}
        <header className={styles.head}>
          <div className={styles.titleBlock}>
            <p className={`coord ${styles.kicker}`}>{venue.kicker}</p>
            <h2 id="landing-title" className={`display ${styles.title}`}>
              {venue.title}
            </h2>
          </div>
          <div className={styles.where}>
            <p className={`headline ${styles.place}`}>{venue.place}</p>
            <p className={styles.booked}>{venue.booked}</p>
          </div>
        </header>

        {/* Deck changes: the place's standing, not a number, takes the page, in two lines */}
        <p className={`display ${styles.statement}`}>{venue.statement}</p>
      </div>

      {/* Yashobhoomi itself: from the content column to the right edge */}
      <div className={styles.vista}>
        <Photo id={outside.id} alt={outside.alt} treatment="color" className={styles.vistaPhoto} sizes="(max-width: 767px) 100vw, 92vw" />
      </div>

      <div className="wrap content">
        {/* The promise reads first, on the page's left edge; the stage and the hall follow */}
        <div className={styles.promise}>
          <p className={`headline ${styles.memorable}`}>{venue.memorable}</p>
          <p className={`lede ${styles.draw}`}>{venue.draw}</p>
        </div>
        <div className={styles.more}>
          <Photo id={stage.id} alt={stage.alt} className={styles.stagePhoto} sizes="(max-width: 767px) 50vw, 34vw" />
          <Photo id={hall.id} alt={hall.alt} className={styles.hallPhoto} sizes="(max-width: 767px) 50vw, 60vw" />
        </div>
      </div>
    </section>
  );
}
