import { prologue } from '@/content/milky-way';
import { Glyph } from '../Ink';
import styles from './Prologue.module.css';

/** Silence after the launch: two lines of story and the coordinates the route starts from. */
export function Prologue() {
  return (
    <section id="prologue" className={styles.prologue} data-field="black" aria-label="Prologue">
      <div className={`wrap content ${styles.grid}`}>
        <p className={`headline ${styles.opening}`}>{prologue.opening}</p>
        <p className={`lede ${styles.line}`}>{prologue.line}</p>
        <p className={styles.launch}>
          <span className={styles.origin} data-anchor>
            <Glyph name="location" className={styles.pin} />
          </span>
          <span className={styles.launchText}>
            {prologue.launch}
            <span className={`coord ${styles.coords}`}>{prologue.coordinates}</span>
          </span>
        </p>
      </div>
    </section>
  );
}
