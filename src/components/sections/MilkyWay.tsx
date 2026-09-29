import { milkyWay } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink, Logo } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './MilkyWay.module.css';

export function MilkyWay() {
  return (
    <section id="milky-way" className={`section ${styles.mw}`} data-field="plum" aria-labelledby="mw-title">
      <CutEdge seed={3} />
      <div className={styles.galaxy} aria-hidden="true">
        <Ink name="spiral-galaxy" color="black" />
      </div>

      <div className="wrap content">
        <Waypoint />

        <h2 id="mw-title" className={styles.title}>
          <span className={`headline ${styles.lead}`}>{milkyWay.title}</span>
          <Logo name="wordmark-horizontal" label={milkyWay.titleName} color="yellow" className={styles.wordmark} />
        </h2>

        <div className={`prose ${styles.body}`}>
          {milkyWay.paragraphs.map((p) => (
            <p key={p.slice(0, 16)}>{p}</p>
          ))}
        </div>

        <p className={`display ${styles.ask}`}>{milkyWay.ask}</p>
      </div>
    </section>
  );
}
