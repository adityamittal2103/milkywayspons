import { venue } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Landing.module.css';

/**
 * s7: the venue, the main festival and the page's destination (team brief,
 * 6 Oct 2026): the Road to Milky Way converges here. The place's standing takes
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
        {/* The page's flight path lifts over the Road to Milky Way chart and resumes here,
            at the venue the journey converges on */}
        <Waypoint glyph="location" breakBefore />

        <header className={styles.head}>
          <p className={`coord ${styles.kicker}`}>{venue.kicker}</p>
          <h2 id="landing-title" className={`display ${styles.title}`}>
            {venue.title}
          </h2>
          <p className={`headline ${styles.place}`}>{venue.place}</p>
          <p className={styles.booked}>{venue.booked}</p>
        </header>

        {/* Deck changes: the place's standing, not a number, takes the page */}
        <p className={`display ${styles.statement}`}>{venue.statement}</p>
      </div>

      {/* Yashobhoomi itself: from the content column to the right edge */}
      <div className={styles.vista}>
        <Photo id={outside.id} alt={outside.alt} treatment="color" className={styles.vistaPhoto} sizes="(max-width: 767px) 100vw, 92vw" />
      </div>

      <div className="wrap content">
        <div className={styles.more}>
          <Photo id={stage.id} alt={stage.alt} className={styles.stagePhoto} sizes="(max-width: 767px) 50vw, 34vw" />
          <Photo id={hall.id} alt={hall.alt} className={styles.hallPhoto} sizes="(max-width: 767px) 50vw, 60vw" />
          <div className={styles.promise}>
            <p className={`headline ${styles.memorable}`}>{venue.memorable}</p>
            <p className={`lede ${styles.draw}`}>{venue.draw}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
