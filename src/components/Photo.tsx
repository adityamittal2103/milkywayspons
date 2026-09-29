import type { CSSProperties } from 'react';
import manifest from '@/content/photos.json';
import styles from './Photo.module.css';

// Written by scripts/build-photos.mjs: dimensions plus the deck slide each raster came from.
const photos = manifest as Record<string, { w: number; h: number; source: string; file: string }>;

export type PhotoId = string;

type Props = {
  id: PhotoId;
  alt: string;
  className?: string;
  /** 'print' = duotone in the section's ink; 'color' = the photograph as shot */
  treatment?: 'print' | 'color';
  sizes?: string;
  priority?: boolean;
  style?: CSSProperties;
  caption?: string;
};

/**
 * A photograph from the sponsorship deck, printed in the ink of the field it
 * sits on (a duotone, like a spot-colour print) so real photography lives
 * inside the brand's flat-ink world. Hover returns it to colour.
 */
export function Photo({ id, alt, className, treatment = 'print', sizes = '(max-width: 767px) 100vw, 50vw', priority, style, caption }: Props) {
  const p = photos[id];
  const img = (
    <img
      src={`/deck/${id}-1600.webp`}
      srcSet={`/deck/${id}-800.webp 800w, /deck/${id}-1600.webp ${Math.min(1600, p.w)}w`}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={styles.img}
    />
  );
  const cls = `${styles.photo} ${treatment === 'print' ? styles.print : ''}${className ? ` ${className}` : ''}`;
  return caption ? (
    <figure className={cls} style={style}>
      {img}
      <figcaption className={styles.caption}>{caption}</figcaption>
    </figure>
  ) : (
    <div className={cls} style={style}>
      {img}
    </div>
  );
}
