import { festival, landing } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Landing.module.css';

/** The deck's "wow" slide: the route touches down and the number takes the page. */
export function Landing() {
  return (
    <section id="landing" className={`section ${styles.landing}`} data-field="yellow" aria-labelledby="landing-title">
      <CutEdge seed={5} />
      <div className={styles.flag} aria-hidden="true">
        <Ink name="badge-flag" color="black" />
      </div>

      <div className="wrap content">
        <Waypoint glyph="location" />

        <h2 id="landing-title" className={`headline ${styles.title}`}>
          {landing.title}
        </h2>

        <div className={styles.figureBlock}>
          <p className={styles.figure}>
            <span className={`numeral ${styles.figureValue}`}>{landing.figure}</span>
            <span className={`display ${styles.figureLabel}`}>{landing.figureLabel}</span>
          </p>
          <p className={`lede ${styles.note}`}>{landing.figureNote}</p>
        </div>

        <div className={styles.venue}>
          {landing.photos.map((p, n) => (
            <Photo
              key={p.id}
              id={p.id}
              alt={p.alt}
              caption={p.caption}
              className={styles.venuePhoto}
              style={{ gridColumn: n === 0 ? '1 / 8' : '8 / 13' }}
              sizes="(max-width: 767px) 100vw, 55vw"
            />
          ))}
        </div>

        <ul className={styles.facts}>
          {landing.facts.map((f) => (
            <li key={f.label} className={styles.fact}>
              <span className={`numeral ${styles.factValue}`}>{f.value}</span>
              <span className={styles.factLabel}>{f.label}</span>
            </li>
          ))}
        </ul>

        <p className={styles.dateline}>
          <time dateTime="2027-02-20">{festival.dates}</time>
          <span aria-hidden="true"> ✱ </span>
          {festival.venue}
          <span aria-hidden="true"> ✱ </span>
          {festival.city}
        </p>
      </div>
    </section>
  );
}
