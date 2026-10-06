'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import { Glyph } from './Ink';
import styles from './TourVideo.module.css';

type Props = { id: string; title: string };

/**
 * The campus tour, framed as part of the page rather than an embedded player
 * (team review, 6 Oct): no YouTube chrome; the film plays on its own (on hover
 * where there is a pointer, while mostly on screen on a phone), muted, as
 * browsers require. The site's own controls carry play and sound; YouTube is a
 * link away. The player loads only as the section approaches, behind the film's
 * own still. Reduced motion: nothing plays until asked.
 */
export function TourVideo({ id, title }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const [load, setLoad] = useState(false);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const ready = useRef(false);
  const want = useRef<'play' | 'pause' | null>(null);
  const held = useRef(false); // the reader pressed pause: hover and scroll stop starting it

  const send = (func: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute') => {
    player.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
  };
  // The still lifts only once the player is running, so YouTube's own loading
  // screen never shows.
  const reveal = () => window.setTimeout(() => want.current === 'play' && setStarted(true), 900);
  const play = (byHand = false) => {
    if (held.current && !byHand) return;
    if (byHand) held.current = false;
    want.current = 'play';
    setLoad(true);
    setPlaying(true);
    if (ready.current) {
      send('playVideo');
      reveal();
    }
  };
  const pause = (byHand = false) => {
    if (byHand) held.current = true;
    want.current = 'pause';
    setPlaying(false);
    if (ready.current) send('pauseVideo');
  };
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    if (next) play(true);
    if (ready.current) send(next ? 'unMute' : 'mute');
  };

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    // Load the player a little before it is reached.
    const near = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          near.disconnect();
        }
      },
      { rootMargin: '600px 0px' },
    );
    near.observe(el);
    if (prefersReducedMotion()) return () => near.disconnect();

    const enter = () => play();
    const leave = () => pause();
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointerleave', leave);
      return () => {
        near.disconnect();
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointerleave', leave);
      };
    }
    // Phones: no hover, so it plays while it is mostly in view.
    const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()), { threshold: 0.6 });
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLoad = () => {
    // The player takes commands once its own scripts have started.
    window.setTimeout(() => {
      ready.current = true;
      if (sound) send('unMute');
      if (want.current === 'play') {
        send('playVideo');
        reveal();
      }
    }, 600);
  };

  const params = `enablejsapi=1&mute=1&controls=0&disablekb=1&iv_load_policy=3&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}`;

  return (
    <figure className={styles.figure}>
      <div ref={frame} className={styles.frame} data-started={started || undefined}>
        {load ? (
          <iframe
            ref={player}
            className={styles.player}
            src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            tabIndex={-1}
            onLoad={onLoad}
          />
        ) : null}
        {/* The film's own still, until it first plays */}
        <img className={styles.still} src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" decoding="async" />
        {/* Over the player, so YouTube's own overlays never appear; a click plays or pauses */}
        <button
          type="button"
          className={styles.cover}
          onClick={() => (playing ? pause(true) : play(true))}
          aria-label={playing ? `Pause: ${title}` : `Play: ${title}`}
        >
          {!started ? (
            <span className={styles.play} aria-hidden="true">
              <Glyph name="forward" className={styles.playGlyph} />
            </span>
          ) : null}
        </button>
      </div>
      <figcaption className={styles.bar}>
        <span className={styles.caption}>{title}</span>
        <span className={styles.controls}>
          <button type="button" className={styles.control} onClick={() => (playing ? pause(true) : play(true))}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className={styles.control} onClick={toggleSound} aria-pressed={sound}>
            {sound ? 'Sound On' : 'Sound Off'}
          </button>
          <a className={styles.control} href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
            YouTube <Glyph name="forward" className={styles.out} />
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
