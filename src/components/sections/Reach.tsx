import type { CSSProperties } from 'react';
import { reach } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { CutLink } from '../CutLink';
import { Photo } from '../Photo';
import { Waypoint } from '../Waypoint';
import styles from './Reach.module.css';

const largest = Math.max(...reach.channels.map((c) => c.count));

export function Reach() {
  return (
    <section id="reach" className={`section ${styles.reach}`} data-field="cyan" aria-labelledby="reach-title">
      <CutEdge seed={7} />
      <div className="wrap content">
        <Waypoint />

        <div className={styles.top}>
          <h2 id="reach-title" className={styles.title}>
            <span className={`numeral ${styles.titleValue}`}>{reach.title}</span>
            <span className={`display ${styles.titleLabel}`}>{reach.titleLabel}</span>
          </h2>
          <p className={styles.headline}>
            <span className={`numeral ${styles.headlineValue}`}>{reach.headline.value}</span>
            <span className={styles.headlineLabel}>
              {reach.headline.label}
              <span className={styles.qualifier}>{reach.headline.qualifier}</span>
            </span>
          </p>
        </div>

        <ul className={styles.views}>
          {reach.views.map((v) => (
            <li key={v.channel} className={styles.view}>
              <span className={`numeral ${styles.viewValue}`}>{v.value}</span>
              <span className={styles.viewLabel}>
                {v.label}
                <span className={styles.viewChannel}>{v.channel}</span>
              </span>
            </li>
          ))}
        </ul>

        <figure className={styles.scale}>
          <figcaption className={styles.scaleHead}>
            <span className={`headline ${styles.scaleTitle}`}>The owned universe, to scale</span>
            <span className={styles.scaleNote}>
              Each disc&rsquo;s area is its audience: subscribers, follows or followers, as stated per channel.
            </span>
          </figcaption>
          <ol className={styles.bodies}>
            {reach.channels.map((c) => (
              <li
                key={c.name}
                className={styles.body}
                style={{ '--k': Math.sqrt(c.count / largest).toFixed(4) } as CSSProperties}
              >
                <span className={styles.disc} aria-hidden="true" />
                <span className={`numeral ${styles.bodyValue}`}>{c.value}</span>
                <span className={styles.bodyUnit}>{c.unit}</span>
                <span className={styles.bodyName}>{c.name}</span>
              </li>
            ))}
          </ol>
          <dl className={styles.notes}>
            {reach.channels.map((c) => (
              <div key={c.name} className={styles.noteRow}>
                <dt>{c.name}</dt>
                <dd>{c.note}</dd>
              </div>
            ))}
          </dl>
          <ul className={styles.feed} aria-label="The channels on the feed">
            {reach.feed.map((f) => (
              <li key={f.id}>
                <Photo id={f.id} alt={f.alt} caption={f.caption} treatment="color" className={styles.phone} sizes="16rem" />
              </li>
            ))}
          </ul>
        </figure>

        <div className={styles.launchpad}>
          <h3 className={`headline ${styles.launchTitle}`}>{reach.launchpad.title}</h3>
          <ul className={styles.launchList}>
            {reach.launchpad.items.map((l) => (
              <li key={l.label} className={styles.launchItem}>
                <span className={`numeral ${styles.launchValue}`}>{l.value}</span>
                <span className={styles.launchLabel}>{l.label}</span>
                <span className={styles.launchNote}>{l.note}</span>
              </li>
            ))}
          </ul>
          <ul className={styles.launchPhotos}>
            {reach.launchpadPhotos.map((l) => (
              <li key={l.id}>
                <Photo id={l.id} alt={l.alt} caption={l.caption ?? undefined} sizes="(max-width: 767px) 50vw, 25vw" />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.reels}>
          <p className={styles.reelsTitle}>From the feed</p>
          <ul className={styles.reelList}>
            {reach.reels.map((r) => (
              <li key={r.href}>
                <CutLink href={r.href} tone="ink" external glyph="forward">
                  {r.label}
                  <span className="sr-only"> (Instagram reel, opens in a new tab)</span>
                </CutLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
