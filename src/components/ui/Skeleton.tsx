import { cn } from '@/lib/cn';

/**
 * Platzhalter, solange Inhalte laden (statt eines Spinners).
 * Der Lichtschimmer bewegt sich per transform und fällt bei reduzierter Bewegung weg.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative overflow-hidden rounded-control bg-surface-2', className)}
    >
      <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-ink/[0.06] to-transparent motion-reduce:hidden" />
    </div>
  );
}
