import type { CSSProperties } from 'react';
import manifest from '@/content/photos.json';
import type { InkColor } from './Ink';

const photos = manifest as Record<string, { w: number; h: number }>;

type Props = {
  id: string;
  name: string;
  color?: InkColor;
  /** Optical size in any CSS length; a square mark renders this wide, wider marks grow by √aspect. */
  size?: string;
  className?: string;
  decorative?: boolean;
};

/**
 * A partner logo from the deck (slide 25), flattened to a single ink so a
 * wall of mixed brand colours reads as one system. Wide wordmarks and square
 * marks are balanced by optical area rather than by height.
 */
export function DeckLogo({ id, name, color, size = '4rem', className, decorative }: Props) {
  const p = photos[`logo-${id}`];
  if (!p) return <span className={className}>{name}</span>;
  const ratio = p.w / p.h;
  return (
    <span
      className={`ink${className ? ` ${className}` : ''}`}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : name}
      aria-hidden={decorative || undefined}
      style={
        {
          '--src': `url(/deck/logo-${id}.png)`,
          '--ratio': ratio.toFixed(4),
          '--ink-color': color ? `var(--${color})` : undefined,
          width: `calc(${size} * ${Math.sqrt(ratio).toFixed(3)})`,
        } as CSSProperties
      }
    />
  );
}
