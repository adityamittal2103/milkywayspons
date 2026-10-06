import styles from './Dots.module.css';

type Props = {
  count: number;
  current: number;
  onPick: (i: number) => void;
  /** Names the group, e.g. "Choose a guest" */
  label: string;
  /** Names one dot, e.g. "Rohit Sharma" */
  name: (i: number) => string;
  className?: string;
};

/**
 * The site's one carousel control (team review): small diamonds under the
 * pictures, the current one larger and solid. Every slider and strip uses it,
 * in place of the earlier arrows and page counts.
 */
export function Dots({ count, current, onPick, label, name, className }: Props) {
  return (
    <div className={`${styles.dots}${className ? ` ${className}` : ''}`} role="group" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={styles.dot}
          data-on={i === current || undefined}
          aria-current={i === current || undefined}
          aria-label={name(i)}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}
