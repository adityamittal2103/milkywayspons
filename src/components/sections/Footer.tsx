import { festival } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Logo } from '../Ink';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} data-field="black">
      <CutEdge seed={12} depth={1.8} />
      <div className={`wrap ${styles.inner}`}>
        {/* The kit's tagline lockup, set from its parts: its artwork reads "MU Fest 2027",
            which the team corrected to "A Masters' Union University Fest" (6 Oct) */}
        <div className={styles.lockup}>
          <p className={styles.tagline}>{festival.tagline}</p>
          <Logo name="wordmark-horizontal" label={festival.name} color="paper" className={styles.mark} />
          <p className={styles.descriptor}>{festival.lockupLine}</p>
        </div>
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
