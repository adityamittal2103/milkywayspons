import { Glyph, type GlyphName } from './Ink';
import styles from './Waypoint.module.css';

type Props = {
  glyph?: GlyphName;
  className?: string;
  /** The route does not draw into this node: the section before it carries its own journey. */
  breakBefore?: boolean;
};

/**
 * A stop on the flight path: a node in the margin rail, drawn with the kit's
 * star glyph. The route passes through it and it fills once the comet has
 * gone by. Sections carry their own headings; the node needs no label.
 */
export function Waypoint({ glyph = 'star', className, breakBefore }: Props) {
  return (
    <div className={`${styles.waypoint}${className ? ` ${className}` : ''}`} aria-hidden="true">
      <span className={styles.node} data-anchor data-anchor-break={breakBefore || undefined}>
        <Glyph name={glyph} className={styles.glyph} />
      </span>
    </div>
  );
}
