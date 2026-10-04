import { sky } from '@/content/milky-way';
import { Glyph } from '../Ink';
import styles from './Sky.module.css';

/** s2: the audience in one line, then where it all lands, pinned and linked to the map. */
export function Sky() {
  const [first, ...rest] = sky.title;
  const [count, ...firstTail] = first.split(' ');
  return (
    <section id="sky" className={styles.sky} data-field="black" aria-labelledby="sky-title">
      <div className={`wrap content ${styles.grid}`}>
        <h2 id="sky-title" className={`headline ${styles.title}`}>
          <span className={styles.line}>
            <span className={`numeral ${styles.count}`}>{count}</span> {firstTail.join(' ')}
          </span>
          {rest.map((l) => (
            <span key={l} className={styles.line}>
              {l}
            </span>
          ))}
        </h2>
        <a className={styles.landing} href={sky.mapHref} target="_blank" rel="noopener noreferrer">
          <span className={styles.node} data-anchor>
            <Glyph name="location" className={styles.pin} />
          </span>
          <span className={styles.landingText}>
            <span>{sky.landing}</span>
            <span className={`coord ${styles.coords}`}>{sky.coordinates}</span>
            <span className={styles.place}>
              {sky.place}
              <Glyph name="forward" className={styles.go} />
            </span>
            <span className="sr-only"> (opens Google Maps in a new tab)</span>
          </span>
        </a>
      </div>
    </section>
  );
}
