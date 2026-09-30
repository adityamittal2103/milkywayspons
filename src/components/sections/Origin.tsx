import type { CSSProperties } from 'react';
import manifest from '@/content/photos.json';
import { experiences, impact, origin, visitors } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { DeckLogo } from '../DeckLogo';
import { Drift } from '../Drift';
import { Ink } from '../Ink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Origin.module.css';

const dims = manifest as Record<string, { w: number; h: number }>;
const ar = (id: string) => (dims[id] ? `${dims[id].w} / ${dims[id].h}` : '4 / 5');

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

        <Photo id={origin.photo.id} alt={origin.photo.alt} className={styles.band} sizes="(max-width: 767px) 100vw, 88vw" />

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
                <Photo id={p.photo} alt={`${p.name} at Masters' Union`} className={styles.portrait} sizes="10rem" />
                <span className={`display ${styles.name}`}>{p.name}</span>
                <span className={styles.note}>{p.note}</span>
              </li>
            ))}
          </ul>
          <Drift label="Guest sessions at Masters' Union" className={styles.sessions}>
            {visitors.sessions.map((id) => (
              <li key={id} style={{ '--ar': ar(id) } as CSSProperties}>
                <Photo id={id} alt="A guest speaker in a session at Masters' Union" sizes="24rem" />
              </li>
            ))}
          </Drift>
        </div>

        <div className={styles.experiences}>
          <h3 className={`headline ${styles.subhead}`}>{experiences.title}</h3>
          <ul className={styles.index}>
            {experiences.items.map((x) => (
              <li key={x.name} className={styles.row}>
                <h4 className={styles.rowName}>
                  {x.logo ? <DeckLogo id={x.logo} name={x.name} color="paper" size="clamp(2.6rem, 4vw, 4rem)" /> : x.name}
                </h4>
                {x.figure ? <p className={`numeral ${styles.rowFigure}`}>{x.figure}</p> : <span className={styles.rowFigure} />}
                <p className={styles.rowText}>{x.text}</p>
                <Photo id={x.photo.id} alt={x.photo.alt} className={styles.rowPhoto} sizes="(max-width: 767px) 100vw, 18rem" />
              </li>
            ))}
          </ul>
          <ul className={styles.mosaic} aria-label="Moments from those experiences">
            {experiences.gallery.map((g, i) => (
              <li key={g.id} className={styles.tile} data-tile={i}>
                <Photo id={g.id} alt={g.alt} sizes="(max-width: 767px) 50vw, 33vw" />
              </li>
            ))}
          </ul>
        </div>

        <div id="impact" className={styles.impact}>
          <h3 className={`headline ${styles.subhead}`}>{impact.title}</h3>
          <ul className={styles.impactList}>
            {impact.items.map((it) => (
              <li key={it.figure} className={styles.impactItem}>
                <Photo id={it.photo.id} alt={it.photo.alt} className={styles.impactPhoto} sizes="(max-width: 767px) 100vw, 30vw" />
                <p className={`numeral ${styles.impactFigure}`}>{it.figure}</p>
                <p className={styles.impactLead}>{it.lead}</p>
                {it.detail ? <p className={styles.impactDetail}>{it.detail}</p> : null}
                <p className={styles.impactNote}>{it.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
