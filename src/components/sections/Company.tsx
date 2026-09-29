import { company } from '@/content/milky-way';
import { CutEdge } from '../CutEdge';
import { Logo } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './Company.module.css';

const RINGS = [460, 350, 245];
const SEP = '  ✱  ';

/** Split the names across the rings in proportion to each ring's circumference. */
function toRings(names: readonly string[]) {
  const circ = RINGS.map((r) => 2 * Math.PI * r);
  const totalCirc = circ.reduce((a, b) => a + b, 0);
  const totalChars = names.reduce((n, s) => n + s.length + SEP.length, 0);
  const rings: string[][] = RINGS.map(() => []);
  let ring = 0;
  let used = 0;
  for (const name of names) {
    const budget = (circ[ring] / totalCirc) * totalChars;
    if (used + name.length / 2 > budget && ring < RINGS.length - 1) {
      ring += 1;
      used = 0;
    }
    rings[ring].push(name);
    used += name.length + SEP.length;
  }
  return rings;
}

export function Company() {
  const rings = toRings(company.names);
  return (
    <section id="company" className={`section ${styles.company}`} data-field="black" aria-labelledby="company-title">
      <CutEdge seed={8} />
      <div className="wrap content">
        <Waypoint />
        <h2 id="company-title" className={`headline ${styles.title}`}>
          {company.title}
        </h2>

        <div className={styles.orbit} aria-hidden="true">
          <svg viewBox="0 0 1000 1000" className={styles.svg}>
            <defs>
              {RINGS.map((r, i) => (
                <path key={r} id={`ring-${i}`} d={`M500 ${500 - r} a${r} ${r} 0 1 1 -0.01 0`} />
              ))}
            </defs>
            {RINGS.map((r, i) => (
              <g key={r} className={styles.ring} data-ring={i}>
                <circle cx="500" cy="500" r={r + 30} className={styles.track} />
                <text className={styles.names}>
                  <textPath href={`#ring-${i}`} textLength={(2 * Math.PI * r - 40).toFixed(0)} lengthAdjust="spacing">
                    {rings[i].join(SEP) + SEP}
                  </textPath>
                </text>
              </g>
            ))}
          </svg>
          <Logo name="seal" label="Masters' Union University Cultural Fest 2027" color="yellow" className={styles.seal} />
        </div>

        <ul className={styles.wall}>
          {company.names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
