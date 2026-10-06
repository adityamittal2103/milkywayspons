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
          {/* Both halves of the festival: campus days, then Yashobhoomi */}
          {festival.legs.map((l) => (
            <p key={l.iso}>
              <time dateTime={l.iso}>{l.dates}</time>
              <br />
              {l.place}, {l.city}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}
