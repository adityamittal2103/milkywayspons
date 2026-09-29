'use client';

import { useRef } from 'react';
import { festival, milkyWay, prologue } from '@/content/milky-way';
import { finePointer, gsap, prefersReducedMotion, registerGsap, seeded, useGSAP } from '@/lib/motion';
import { CutLink } from '../CutLink';
import { Ink, Logo } from '../Ink';
import { Starfield } from '../Starfield';
import { Wordmark } from '../Wordmark';
import styles from './Hero.module.css';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const mark = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      registerGsap();
      const section = root.current!;
      const svg = mark.current!;
      const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]', section);
      const groups = gsap.utils.toArray<SVGGElement>('[data-letter]', svg);
      const paths = groups.map((g) => g.querySelector('path')!);
      reveals.forEach((el) => el.classList.add('is-live'));

      if (prefersReducedMotion()) return;

      const vb = svg.viewBox.baseVal;
      const cx = vb.x + vb.width / 2;
      const cy = vb.y + vb.height / 2;
      const centers = paths.map((p) => {
        const b = p.getBBox();
        return { x: b.x + b.width / 2 - cx, y: b.y + b.height / 2 - cy };
      });
      const rand = seeded(19);
      const scatter = centers.map((c) => ({
        x: c.x * 2.2 + (rand() - 0.5) * vb.width * 0.9,
        y: c.y * 2.6 + (rand() - 0.5) * vb.height * 0.9,
        r: (rand() - 0.5) * 150,
      }));

      // Entrance: the letters fall into formation from scattered orbits.
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .fromTo(svg, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 })
        .from(paths, {
          x: (i) => scatter[i].x,
          y: (i) => scatter[i].y,
          rotation: (i) => scatter[i].r,
          scale: 0.35,
          opacity: 0,
          transformOrigin: '50% 50%',
          duration: 1.7,
          stagger: { each: 0.075, from: 'random' },
        })
        .from('[data-intro="planet"]', { xPercent: 30, yPercent: -25, rotation: 25, autoAlpha: 0, duration: 2.2 }, 0.1)
        .from('[data-intro="fade"]', { y: 28, autoAlpha: 0, duration: 1.1, stagger: 0.08 }, 0.9)
        .from('[data-intro="stars"]', { autoAlpha: 0, duration: 2, ease: 'power1.out' }, 0);

      // Gravity: fine pointers pull nearby letters toward themselves.
      let gravityOn = false;
      const onMove = (e: PointerEvent) => {
        if (!gravityOn) return;
        const svgRect = svg.getBoundingClientRect();
        const unit = vb.width / svgRect.width;
        const reach = Math.max(window.innerWidth, 900) * 0.42;
        paths.forEach((p, i) => {
          const r = groups[i].getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const dist = Math.hypot(dx, dy) || 1;
          const pull = Math.max(0, 1 - dist / reach) ** 2;
          gsap.to(p, {
            x: (dx / dist) * pull * 34 * unit,
            y: (dy / dist) * pull * 34 * unit,
            rotation: (dx / dist) * pull * 7,
            duration: 1.1,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });
      };
      const onLeave = () => gsap.to(paths, { x: 0, y: 0, rotation: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' });
      if (finePointer()) {
        intro.eventCallback('onComplete', () => {
          gravityOn = true;
        });
        section.addEventListener('pointermove', onMove);
        section.addEventListener('pointerleave', onLeave);
      }

      // Scroll: fly into the identity. The letters part around the viewer.
      const mm = gsap.matchMedia();
      mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, (ctx) => {
        const wide = ctx.conditions?.wide;
        const fly = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: wide ? '+=85%' : 'bottom top',
            scrub: 0.7,
            pin: wide ? section : false,
            onToggle: (self) => {
              gravityOn = self.isActive && intro.progress() === 1 && finePointer();
            },
          },
        });
        if (!wide) {
          // Phones read the hero in flow: the letters drift apart as it
          // scrolls away, and nothing the reader needs fades out.
          fly
            .to(
              groups,
              { x: (i) => centers[i].x * 0.45, y: (i) => centers[i].y * 0.7, rotation: (i) => (centers[i].x > 0 ? 6 : -6) },
              0,
            )
            .to('[data-intro="planet"]', { yPercent: -20, rotation: -6 }, 0);
          return;
        }
        fly
          .to(svg, { scale: 2.4, transformOrigin: '50% 55%' }, 0)
          .to(
            groups,
            { x: (i) => centers[i].x * 1.5, y: (i) => centers[i].y * 2.2, rotation: (i) => (centers[i].x > 0 ? 14 : -14) },
            0,
          )
          .to('[data-fly="mark"]', { autoAlpha: 0, duration: 0.35 }, 0.65)
          .to('[data-fly="down"]', { y: 90, autoAlpha: 0, duration: 0.45 }, 0)
          .to('[data-fly="up"]', { y: -60, autoAlpha: 0, duration: 0.45 }, 0)
          .to('[data-intro="planet"]', { yPercent: -35, xPercent: 12, rotation: -8, scale: 1.25 }, 0);
      });

      return () => {
        section.removeEventListener('pointermove', onMove);
        section.removeEventListener('pointerleave', onLeave);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="launch" className={styles.hero} data-field="black" aria-labelledby="launch-title">
      <div className={styles.stars} data-intro="stars">
        <Starfield className={styles.canvas} density={9} />
      </div>
      <div className={styles.planet} data-intro="planet" aria-hidden="true">
        <Ink name="ringed-planet-2" color="purple" />
      </div>

      <div className={styles.stage}>
        <div className={styles.top} data-fly="up">
          <div className={styles.presents} data-intro="fade" data-reveal>
            <Logo name="mu-logo" label={festival.presenter} className={styles.mu} color="paper" />
            <span className={styles.presentsWord}>presents</span>
          </div>
        </div>

        <h1 id="launch-title" className={styles.markWrap} data-reveal data-fly="mark">
          <Wordmark ref={mark} className={styles.mark} title={festival.name} />
          <span className="sr-only">
            {' '}
            — {festival.lockupLine}, {festival.dates}, {festival.venue}, {festival.city}. Sponsorship.
          </span>
        </h1>

        <div className={styles.bottom} data-fly="down">
          <div className={styles.meta} data-intro="fade" data-reveal>
            <p className={`display ${styles.tagline}`}>
              The universe is <span className={styles.yours}>yours</span>
            </p>
            <p className={styles.when}>
              <time dateTime="2027-02-20">{festival.dates}</time>
              <br />
              {festival.venue}, {festival.city}
            </p>
            <div className={styles.actions}>
              <CutLink href="#tiers" size="lg">
                See the sponsorship tiers
              </CutLink>
            </div>
          </div>

          <dl className={styles.readout} data-intro="fade" data-reveal>
            {milkyWay.stats.map((s) => (
              <div key={s.label} className={styles.stat}>
                <dt className={styles.statLabel}>{s.label}</dt>
                <dd className={`numeral ${styles.statValue}`}>{s.value}</dd>
              </div>
            ))}
          </dl>

          <p className={`coord ${styles.coord}`} data-intro="fade" data-reveal>
            {prologue.launch} {prologue.coordinates}
          </p>
        </div>
      </div>
    </section>
  );
}
