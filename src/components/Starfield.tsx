'use client';

import { useEffect, useRef } from 'react';
import { finePointer, prefersReducedMotion } from '@/lib/motion';
import { seeded } from '@/lib/motion-seed';

type Props = {
  className?: string;
  /** stars per 100k px² of canvas */
  density?: number;
  seed?: number;
};

type Star = { x: number; y: number; r: number; layer: number; tilt: number; pinch: number; yellow: boolean };

/**
 * A field of cut four-point stars, the kit's sparkle drawn by hand in code
 * rather than glowing dots. Three depth layers drift against the pointer and
 * the scroll. It redraws only when something moves.
 */
export function Starfield({ className, density = 7, seed = 11 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = prefersReducedMotion();
    const pointer = finePointer() && !reduce;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let scrollShift = 0;
    let raf = 0;
    let visible = true;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      const rand = seeded(seed);
      const count = Math.round(((w * h) / 100000) * density);
      stars = Array.from({ length: count }, () => {
        const layer = rand() < 0.62 ? 0 : rand() < 0.75 ? 1 : 2;
        return {
          x: rand() * w,
          y: rand() * h,
          r: [1.4, 2.6, 4.6][layer] * (0.7 + rand() * 0.7),
          layer,
          tilt: (rand() - 0.5) * 0.5,
          pinch: 0.18 + rand() * 0.16,
          yellow: rand() < 0.1,
        };
      });
      draw();
    };

    // A four-point star with uneven arms: the "humanistic distortion" of a sparkle.
    const spark = (s: Star, ox: number, oy: number) => {
      const { r, pinch } = s;
      const x = s.x + ox;
      const y = s.y + oy;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(s.tilt);
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.25);
      ctx.lineTo(r * pinch, -r * pinch);
      ctx.lineTo(r, 0);
      ctx.lineTo(r * pinch, r * pinch * 1.2);
      ctx.lineTo(0, r * 1.05);
      ctx.lineTo(-r * pinch * 1.1, r * pinch);
      ctx.lineTo(-r * 0.9, 0);
      ctx.lineTo(-r * pinch, -r * pinch);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const shifts = [4, 11, 22];
      for (const s of stars) {
        const k = shifts[s.layer];
        const ox = -px * k;
        const oy = -py * k - scrollShift * (s.layer + 1) * 0.06;
        ctx.fillStyle = s.yellow ? '#ffd000' : s.layer === 0 ? 'rgba(248,245,237,0.55)' : '#f8f5ed';
        let yy = (s.y + oy) % h;
        if (yy < -10) yy += h;
        spark({ ...s, y: yy - oy }, ox, oy);
      }
    };

    const loop = () => {
      px += (tx - px) * 0.06;
      py += (ty - py) * 0.06;
      draw();
      if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      kick();
    };
    const onScroll = () => {
      const rect = canvas.getBoundingClientRect();
      scrollShift = -rect.top;
      if (visible) draw();
    };

    const ro = new ResizeObserver(build);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    if (pointer) window.addEventListener('pointermove', onMove, { passive: true });
    if (!reduce) window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [density, seed]);

  return <canvas ref={ref} className={`starfield${className ? ` ${className}` : ''}`} aria-hidden="true" />;
}
