'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './TourVideo.module.css';

type Props = { id: string; title: string };

/**
 * The campus tour plays on its own: on hover where there is a pointer, and as
 * soon as it is mostly on screen on a phone. It starts muted (browsers allow
 * nothing else); YouTube's own controls carry the sound. The player loads only
 * as the section approaches, behind the film's own still.
 */
export function TourVideo({ id, title }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const [load, setLoad] = useState(false);
  const [started, setStarted] = useState(false);
  const [still, setStill] = useState(false);
  const ready = useRef(false);
  const want = useRef<'play' | 'pause' | null>(null);

  const send = (func: 'playVideo' | 'pauseVideo') => {
    player.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
  };
  const play = () => {
    want.current = 'play';
    setStarted(true);
    if (ready.current) send('playVideo');
  };
  const pause = () => {
    want.current = 'pause';
    if (ready.current) send('pauseVideo');
  };

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const reduce = prefersReducedMotion();
    setStill(reduce);
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
    if (reduce) return () => near.disconnect();

    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (pointer) {
      el.addEventListener('pointerenter', play);
      el.addEventListener('pointerleave', pause);
      return () => {
        near.disconnect();
        el.removeEventListener('pointerenter', play);
        el.removeEventListener('pointerleave', pause);
      };
    }
    // Phones: no hover, so it plays while it is mostly in view.
    const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause()), { threshold: 0.6 });
    seen.observe(el);
    return () => {
      near.disconnect();
      seen.disconnect();
    };
  }, []);

  const onLoad = () => {
    // The player takes commands once its own scripts have started.
    window.setTimeout(() => {
      ready.current = true;
      if (want.current === 'play') send('playVideo');
    }, 600);
  };

  const params = `enablejsapi=1&mute=1&playsinline=1&rel=0&modestbranding=1&loop=1&playlist=${id}`;

  return (
    <div ref={frame} className={styles.frame} data-started={started || still || undefined}>
      {load ? (
        <iframe
          ref={player}
          className={styles.player}
          src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={onLoad}
        />
      ) : null}
      {/* The film's own still, until it first plays */}
      <img className={styles.still} src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" loading="lazy" decoding="async" />
    </div>
  );
}
