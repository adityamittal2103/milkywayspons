import { seeded } from '@/lib/motion-seed';

type Props = { seed?: number; depth?: number };

/**
 * The top edge of a colour field, cut like paper with a blade: uneven angles,
 * no curves. It overlaps the field above so each section reads as a sheet
 * laid over the last.
 */
export function CutEdge({ seed = 1, depth = 2.6 }: Props) {
  const rand = seeded(seed);
  const pts: string[] = ['0,100'];
  let x = 0;
  while (x < 100) {
    pts.push(`${x.toFixed(2)},${(rand() * 70 + 5).toFixed(2)}`);
    x += 4 + rand() * 9;
  }
  pts.push(`100,${(rand() * 70 + 5).toFixed(2)}`, '100,100');
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: 0,
        top: `calc(-${depth}vw + 1px)`,
        width: '100%',
        height: `${depth}vw`,
        minHeight: 14,
        fill: 'var(--field)',
        pointerEvents: 'none',
      }}
    >
      <polygon points={pts.join(' ')} />
    </svg>
  );
}
