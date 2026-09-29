import { experiences, origin, visitors } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Ink } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './Origin.module.css';

export function Origin() {
  const [lead, ...rest] = origin.stats;
  return (
    <section id="origin" className={`section ${styles.origin}`} data-field="indigo" aria-labelledby="origin-title">
      <CutEdge seed={2} />
      <div className={styles.portal} aria-hidden="true">
        <Ink name="portal" color="yellow" />
      </div>

      <div className="wrap content">
        <Waypoint />

        <header className={styles.head}>
          <h2 id="origin-title" className={`display ${styles.title}`}>
            {origin.title}
          </h2>
          <p className={`lede ${styles.tail}`}>{origin.titleTail}</p>
        </header>

        <div className={styles.grid}>
          <div className={`prose ${styles.body}`}>
            <p>
              {origin.body[0]} {origin.body[1].charAt(0).toLowerCase() + origin.body[1].slice(1)}
            </p>
            <p>{origin.body[2]}</p>
            <p className={styles.kicker}>{origin.kicker}</p>
          </div>

          <dl className={styles.stats}>
            <div className={styles.lead}>
              <dt className={styles.statLabel}>{lead.label}</dt>
              <dd className={`numeral ${styles.leadValue}`}>{lead.value}</dd>
            </div>
            {rest.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={`numeral ${styles.statValue}`}>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className={styles.visitors}>
          <h3 className={`headline ${styles.subhead}`}>{visitors.title}</h3>
          <ul className={styles.people}>
            {visitors.people.map((p) => (
              <li key={p.name} className={styles.person}>
                <span className={`display ${styles.name}`}>{p.name}</span>
                <span className={styles.note}>{p.note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.experiences}>
          <h3 className={`headline ${styles.subhead}`}>{experiences.title}</h3>
          <ul className={styles.index}>
            {experiences.items.map((x) => (
              <li key={x.name} className={styles.row}>
                <h4 className={styles.rowName}>{x.name}</h4>
                {x.figure ? <p className={`numeral ${styles.rowFigure}`}>{x.figure}</p> : <span className={styles.rowFigure} />}
                <p className={styles.rowText}>{x.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
