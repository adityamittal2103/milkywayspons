import type { Ref } from 'react';
import wordmark from '@/content/wordmark-paths.json';

type Props = {
  className?: string;
  letterClassName?: string;
  ref?: Ref<SVGSVGElement>;
  title?: string;
};

/**
 * The official stacked wordmark, drawn from the kit's Illustrator master with
 * every letter kept as its own path so the letters can move independently.
 * Each letter sits in a <g>: scroll choreography moves the group, pointer
 * gravity moves the path, so the two never fight over one transform.
 * Paths are in the master file's drawing order, not reading order.
 */
export function Wordmark({ className, letterClassName, ref, title = 'Milky Way' }: Props) {
  return (
    <svg
      ref={ref}
      className={className}
      viewBox={wordmark.viewBox}
      fill="currentColor"
      role="img"
      aria-label={title}
      overflow="visible"
    >
      {wordmark.paths.map((p, i) => (
        <g key={i} data-letter={i}>
          <path className={letterClassName} d={p.d} />
        </g>
      ))}
    </svg>
  );
}
