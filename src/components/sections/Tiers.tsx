'use client';

import { useEffect, useRef, useState } from 'react';
import { deliverables, tiers, tiersIntro, type Entitlement, type TierId } from '@/content/milky-way';
import { prefersReducedMotion } from '@/lib/motion';
import { CutEdge } from '../CutEdge';
import { CutLink } from '../CutLink';
import { Distort } from '../Distort';
import { Glyph } from '../Ink';
import { Waypoint } from '../Waypoint';
import styles from './Tiers.module.css';

// Title Partner sits closest to the core: nearest orbit, deepest integration.
const ORBITS = [
  { rx: 118, period: 26 },
  { rx: 176, period: 38 },
  { rx: 232, period: 52 },
  { rx: 286, period: 68 },
];
const TILT = -16;
const RY = 0.4;

// Deck changes (Chirag): each tier is introduced by what the brand becomes, not by
// its access passes ("brand doesn't care much about access passes").
const association = (id: TierId) => deliverables.find((d) => d.name === 'Brand Association')!.values[id] as string;

function Cell({ value }: { value: Entitlement }) {
  if (value === true)
    return (
      <>
        <Glyph name="checked" className={styles.tick} />
        <span className="sr-only">Included</span>
      </>
    );
  if (value === null)
    return (
      <>
        <span aria-hidden="true" className={styles.dash}>
          —
        </span>
        <span className="sr-only">Not included</span>
      </>
    );
  return <>{value}</>;
}

export function Tiers() {
  const [active, setActive] = useState<TierId>('title');
  // Mobile sheet: compare all four by default
  const [compareAll, setCompareAll] = useState(true);
  const [stuck, setStuck] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);

  // Mobile sheet: choosing a tier above takes the reader to it in the table, where
  // its lines are highlighted (on phones the table reads downwards, one deliverable
  // at a time, so there is no sideways scrolling to line up).
  const choose = (id: TierId) => {
    setActive(id);
    if (!window.matchMedia('(max-width: 767px)').matches) return;
    plate.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (prefersReducedMotion()) svgRef.current?.pauseAnimations();
    // When the table's top edge passes under the nav line, its header is stuck.
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < 0), {
      rootMargin: '-74px 0px 0px 0px',
    });
    if (sentinel.current) io.observe(sentinel.current);
    return () => io.disconnect();
  }, []);

  const activeIndex = tiers.findIndex((t) => t.id === active);

  return (
    <section id="tiers" className={`section ${styles.tiers}`} data-field="black" aria-labelledby="tiers-title">
      <CutEdge seed={9} />
      <div className="wrap content">
        <Waypoint />

        <header className={styles.head}>
          <h2 id="tiers-title" className={styles.title}>
            <Distort text={tiersIntro.title} seed={31} amount={3.5} className="display" />
          </h2>
          <p className={`lede ${styles.lede}`}>
            Four orbits around one festival. Pick one to see what it carries, then compare all four in the table below.
          </p>
        </header>

        <div className={styles.system}>
          <div className={styles.diagram} aria-hidden="true">
            <svg ref={svgRef} viewBox="-310 -310 620 620" className={styles.svg}>
              <g transform={`rotate(${TILT})`}>
                {ORBITS.map((o, i) => {
                  const ry = o.rx * RY;
                  const d = `M${-o.rx} 0 a${o.rx} ${ry} 0 1 1 ${o.rx * 2} 0 a${o.rx} ${ry} 0 1 1 ${-o.rx * 2} 0`;
                  const t = tiers[i];
                  const on = i === activeIndex;
                  return (
                    <g
                      key={t.id}
                      className={styles.orbit}
                      data-on={on || undefined}
                      style={{ ['--tier' as string]: `var(--${t.ink})` }}
                      onClick={() => choose(t.id)}
                    >
                      <path id={`orbit-${i}`} d={d} className={styles.path} />
                      <path d={d} className={styles.hit} />
                      <text className={styles.orbitLabel} dy={-8}>
                        <textPath href={`#orbit-${i}`} startOffset={`${[31, 21, 12, 4][i]}%`}>
                          {t.name}
                        </textPath>
                      </text>
                      <circle r={on ? 15 : 10} className={styles.body}>
                        <animateMotion dur={`${o.period}s`} repeatCount="indefinite" path={d} begin={`-${i * 7}s`} />
                      </circle>
                    </g>
                  );
                })}
              </g>
              <image href="/brand/logo/app-icon.svg" x="-38" y="-38" width="76" height="76" />
            </svg>
          </div>

          <fieldset className={styles.picker}>
            <legend className={styles.legend}>Choose a tier</legend>
            {tiers.map((t, i) => (
              <label
                key={t.id}
                className={styles.option}
                data-on={t.id === active || undefined}
                style={{ ['--tier' as string]: `var(--${t.ink})` }}
              >
                <input
                  type="radio"
                  name="tier"
                  value={t.id}
                  checked={t.id === active}
                  onChange={() => choose(t.id)}
                  className={styles.radio}
                />
                <span className={`coord ${styles.optionN}`}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.optionName}>{t.name}</span>
                <span className={styles.optionMeta}>{association(t.id)}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div ref={plate} className={styles.plate} data-field="paper">
          <div className={styles.plateHead}>
            <h3 className={`headline ${styles.plateTitle}`}>What Each Orbit Carries</h3>
            <label className={styles.compare}>
              <input type="checkbox" checked={compareAll} onChange={(e) => setCompareAll(e.target.checked)} />
              <span>Compare all four</span>
            </label>
          </div>

          <div ref={sentinel} aria-hidden="true" />
          <div className={styles.scroller} role="region" aria-label="Sponsorship deliverables by tier" tabIndex={0}>
            <table
              className={styles.table}
              data-active={active}
              data-compare={compareAll || undefined}
              data-stuck={stuck || undefined}
            >
              <caption className="sr-only">
                Sponsorship deliverables for each Milky Way tier. {tiers[activeIndex].name} is highlighted.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className={styles.corner}>
                    Deliverable
                  </th>
                  {tiers.map((t, i) => (
                    <th key={t.id} scope="col" data-tier={t.id} style={{ ['--tier' as string]: `var(--${t.ink})` }}>
                      <span className="coord">{String(i + 1).padStart(2, '0')}</span>
                      <span className={styles.colName}>{t.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {deliverables.map((d, r) => (
                  <tr key={d.name}>
                    <th scope="row">
                      <span className={`coord ${styles.rowN}`}>{String(r + 1).padStart(2, '0')}</span>
                      {d.name}
                    </th>
                    {tiers.map((t) => (
                      <td key={t.id} data-tier={t.id} style={{ ['--tier' as string]: `var(--${t.ink})` }}>
                        {/* Phones: the table reads downwards, so each value carries its tier's name */}
                        <span className={styles.cellTier} aria-hidden="true">
                          {t.name}
                        </span>
                        <Cell value={d.values[t.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.plateFoot}>
            <div className={styles.footnotes}>
              <p>*{tiersIntro.footnote}</p>
              <p>The deck lists deliverables, not prices. Investment details come from the sponsorship team.</p>
            </div>
            <CutLink href="#signal" tone="ink">
              Ask About {tiers[activeIndex].name}
            </CutLink>
          </div>
        </div>
      </div>
    </section>
  );
}
