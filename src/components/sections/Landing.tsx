import { festival, venue } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Landing.module.css';

/**
 * s7: the venue. The capacity takes the page; the place, the dates and the
 * promise sit around it. Set in deep indigo (the kit's Indigo drawn toward
 * Phantom Black) so the venue stays inside the Deep Space world.
 */
export function Landing() {
  return (
    <section id="landing" className={`section ${styles.landing}`} data-field="deep" aria-labelledby="landing-title">
      <CutEdge seed={5} />
      <div className={styles.flag} aria-hidden="true">
        <Ink name="badge-flag" color="indigo" />
      </div>

      <div className="wrap content">
        <Waypoint glyph="location" />

        <header className={styles.head}>
          <h2 id="landing-title" className={`display ${styles.title}`}>
            {venue.title}
          </h2>
          <p className={`lede ${styles.lead}`}>{venue.lead}</p>
          <p className={`headline ${styles.place}`}>{venue.place}</p>
          <p className={styles.booked}>{venue.booked}</p>
        </header>

        <div className={styles.figureBlock}>
          <p className={styles.figure}>
            <span className={styles.figureLead}>{venue.capacity.lead}</span>
            <span className={`numeral ${styles.figureValue}`}>{venue.capacity.value}</span>
            <span className={`display ${styles.figureLabel}`}>{venue.capacity.label}</span>
          </p>
          <div className={styles.promise}>
            <p className={`lede ${styles.memorable}`}>{venue.memorable}</p>
            <p className={styles.draw}>{venue.draw}</p>
          </div>
        </div>

        <div className={styles.venue}>
          {venue.photos.map((p, n) => (
            <Photo
              key={p.id}
              id={p.id}
              alt={p.alt}
              className={styles.venuePhoto}
              style={{ gridArea: `p${n}` }}
              sizes="(max-width: 767px) 100vw, 50vw"
            />
          ))}
        </div>

        <p className={styles.dateline}>
          <time dateTime="2027-02-20">{festival.dates}</time>
          <span aria-hidden="true" className={styles.sep}> ✱ </span>
          {festival.venue}
          <span aria-hidden="true" className={styles.sep}> ✱ </span>
          {festival.city}
        </p>
      </div>
    </section>
  );
}
