import type { CSSProperties } from 'react';
import { road } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Glyph } from '../Ink';
import { Starfield } from '../Starfield';
import { Waypoint } from '../Waypoint';
import styles from './Road.module.css';

// Where each stop sits across the page (% of the content width). The route
// threads them in order, so this zigzag is the constellation. The deck does
// not name the cities; the stops stay numbered.
const DESKTOP_X = [6, 40, 78, 58, 18, 46, 86];
const MOBILE_X = [8, 62, 30, 82, 12, 58, 86];
// Micro copy from the deck sits beside alternate stops, on the open side.
const MICRO_AT: Record<number, number> = { 1: 0, 3: 1, 5: 2 };

export function Road() {
  return (
    <section id="road" className={`section ${styles.road}`} data-field="black" aria-labelledby="road-title">
      <CutEdge seed={4} />
      <div className={styles.sky} aria-hidden="true">
        <Starfield className={styles.canvas} density={5} seed={23} />
      </div>

      <div className="wrap content">
        <Waypoint />
        <header className={styles.head}>
          <h2 id="road-title" className={`headline ${styles.title}`}>
            {road.title}
          </h2>
          <p className={`lede ${styles.strap}`}>{road.strapline}</p>
        </header>

        <ol className={styles.stops} aria-label={`Road to Milky Way: ${road.cities} city stops before the Delhi finale`}>
          {Array.from({ length: road.cities }, (_, i) => {
            const micro = MICRO_AT[i];
            const side = DESKTOP_X[i] < 50 ? 'right' : 'left';
            return (
              <li
                key={i}
                className={styles.stop}
                data-side={side}
                style={{ '--x': `${DESKTOP_X[i]}%`, '--xm': `${MOBILE_X[i]}%` } as CSSProperties}
              >
                <span className={styles.node} data-anchor>
                  <Glyph name="star" className={styles.glyph} />
                </span>
                <span className={styles.stopLabel}>
                  <span className="sr-only">City </span>
                  <span className="coord">
                    {String(i + 1).padStart(2, '0')}/{String(road.cities).padStart(2, '0')}
                  </span>
                </span>
                {micro !== undefined ? <p className={styles.micro}>{road.micro[micro]}</p> : null}
              </li>
            );
          })}
        </ol>

        <p className={styles.next}>
          <span className={styles.nextLine}>
            Then {road.finale.city}: {road.finale.venue}
          </span>
        </p>
      </div>
    </section>
  );
}
