import { Fragment, type ElementType } from 'react';
import { seeded } from '@/lib/motion-seed';
import styles from './Distort.module.css';

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Maximum rotation in degrees; the wordmark itself sits around ±6. */
  amount?: number;
  seed?: number;
};

/**
 * "Humanistic distortion" (the kit's name for the wordmark style) applied to
 * display type: each letter is set slightly off-axis and off-baseline, with a
 * seeded offset so every render cuts the same way. Screen readers get the
 * plain string from a visually hidden copy; the letters are presentation only.
 */
export function Distort({ text, as: Tag = 'span', className, amount = 4, seed = 7 }: Props) {
  const rand = seeded(seed);
  const words = text.split(' ');
  return (
    <Tag className={`${styles.distort}${className ? ` ${className}` : ''}`}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className={styles.word} aria-hidden="true">
            {[...word].map((ch, ci) => {
              const r = (rand() * 2 - 1) * amount;
              const y = (rand() * 2 - 1) * 0.045;
              return (
                <span
                  key={ci}
                  className={styles.char}
                  style={{ transform: `translateY(${y.toFixed(3)}em) rotate(${r.toFixed(2)}deg)` }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}
