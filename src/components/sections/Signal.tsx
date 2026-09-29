import { signal } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { CutLink } from '../CutLink';
import { Waypoint } from '../Waypoint';
import styles from './Signal.module.css';

const mailto = (email: string) => `mailto:${email}?subject=${encodeURIComponent(signal.subject)}`;

/** Where the route ends: the sponsor's signal back to the team. */
export function Signal() {
  return (
    <section id="signal" className={`section ${styles.signal}`} data-field="lime" aria-labelledby="signal-title">
      <CutEdge seed={10} />
      <div className="wrap content">
        <div className={styles.beacon}>
          <span className={styles.rings} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <Waypoint glyph="live" />
        </div>

        <h2 id="signal-title" className={`display ${styles.title}`}>
          {signal.title}
        </h2>
        <p className={`lede ${styles.line}`}>
          {signal.line}
          <br />
          {signal.lineTail}
        </p>

        <div className={styles.primary}>
          <CutLink href={mailto(signal.general.email)} tone="ink" size="lg" glyph="forward">
            Send a signal
          </CutLink>
          <a className={styles.address} href={mailto(signal.general.email)}>
            {signal.general.email}
          </a>
        </div>

        <div className={styles.contacts}>
          <p className={styles.team}>{signal.team}</p>
          <ul className={styles.people}>
            {signal.contacts.map((c) => (
              <li key={c.email} className={styles.person}>
                <span className={`display ${styles.name}`}>{c.name}</span>
                <a className={styles.email} href={mailto(c.email)}>
                  {c.email}
                </a>
              </li>
            ))}
          </ul>
          <p className={styles.general}>
            {signal.general.label} <a href={mailto(signal.general.email)}>{signal.general.email}</a>
          </p>
          <address className={styles.postal}>{signal.address}</address>
        </div>
      </div>
    </section>
  );
}
