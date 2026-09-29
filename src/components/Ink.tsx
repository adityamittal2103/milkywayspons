import type { CSSProperties } from 'react';
import illustrations from '@/content/illustrations.json';
import glyphs from '@/content/glyphs.json';

export type InkName = keyof typeof illustrations;
export type GlyphName = keyof typeof glyphs;
export type InkColor = 'paper' | 'black' | 'yellow' | 'purple' | 'lime' | 'cyan' | 'indigo' | 'plum' | 'vermilion' | 'flame';

type Props = {
  className?: string;
  color?: InkColor;
  /** Accessible name. Omit for decorative art (the default). */
  label?: string;
  style?: CSSProperties;
};

/** A brand-kit illustration painted in one ink (the SVG is used as a mask). */
export function Ink({ name, className, color, label, style }: Props & { name: InkName }) {
  return (
    <span
      className={`ink${className ? ` ${className}` : ''}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={
        {
          '--src': `url(/brand/ill/${name}.svg)`,
          '--ratio': illustrations[name].ratio,
          '--ink-color': color ? `var(--${color})` : undefined,
          ...style,
        } as CSSProperties
      }
    />
  );
}

const LOGO_RATIO = {
  'mu-logo': 4.7847,
  'wordmark-horizontal': 4.8165,
  'wordmark-stacked': 1.5653,
  'lockup-tagline-horizontal': 3.0433,
  'lockup-tagline-stacked': 1.15,
  'lockup-presents-horizontal': 2.3284,
  'lockup-presents-stacked': 0.9428,
  seal: 1,
} as const;
export type LogoName = keyof typeof LOGO_RATIO;

/** An official lockup from the kit, painted in one ink. Always carries its name. */
export function Logo({ name, className, color, label, style }: Props & { name: LogoName; label: string }) {
  return (
    <span
      className={`ink${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={label}
      style={
        {
          '--src': `url(/brand/logo/${name}.svg)`,
          '--ratio': LOGO_RATIO[name],
          '--ink-color': color ? `var(--${color})` : undefined,
          ...style,
        } as CSSProperties
      }
    />
  );
}

/** A glyph from the kit's Basic Iconset, painted in one ink. */
export function Glyph({ name, className, color, label, style }: Props & { name: GlyphName }) {
  return (
    <span
      className={`ink glyph${className ? ` ${className}` : ''}`}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={
        {
          '--src': `url(/brand/glyph/${name}.svg)`,
          '--ratio': glyphs[name],
          '--ink-color': color ? `var(--${color})` : undefined,
          ...style,
        } as CSSProperties
      }
    />
  );
}
