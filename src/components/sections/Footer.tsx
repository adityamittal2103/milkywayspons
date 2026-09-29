import { festival } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Logo } from '../Ink';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} data-field="black">
      <CutEdge seed={12} depth={1.8} />
      <div className={`wrap ${styles.inner}`}>
        <Logo
          name="lockup-tagline-horizontal"
          label={`${festival.name}: ${festival.tagline}. ${festival.lockupLine}`}
          color="paper"
          className={styles.lockup}
        />
        <div className={styles.meta}>
          <Logo name="mu-logo" label={festival.presenter} color="paper" className={styles.mu} />
          <p>
            <time dateTime="2027-02-20">{festival.dates}</time>
            <br />
            {festival.venue}, {festival.city}
          </p>
          <p className={styles.small}>Wordmark, glyphs and illustrations from the Milky Way brand kit.</p>
        </div>
      </div>
    </footer>
  );
}
