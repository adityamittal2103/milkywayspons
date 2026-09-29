import type { ReactNode } from 'react';
import { Glyph, type GlyphName } from './Ink';
import styles from './CutLink.module.css';

type Props = {
  href: string;
  children: ReactNode;
  /** 'solid' = yellow plate, 'ink' = plate in the field's ink colour */
  tone?: 'solid' | 'ink' | 'paper';
  size?: 'md' | 'lg';
  glyph?: GlyphName;
  external?: boolean;
  className?: string;
};

/**
 * The site's one action shape: a plate cut with uneven angles, like the
 * wordmark's letters. On hover the cut shifts (see CutLink.module.css).
 */
export function CutLink({ href, children, tone = 'solid', size = 'md', glyph = 'forward', external, className }: Props) {
  return (
    <a
      href={href}
      className={`${styles.link} ${styles[tone]} ${styles[size]}${className ? ` ${className}` : ''}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <span className={styles.label}>{children}</span>
      <Glyph name={glyph} className={styles.glyph} />
    </a>
  );
}
