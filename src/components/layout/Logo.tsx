import { cn } from '@/lib/cn';

/** Bildmarke: ein kleiner Tacho mit Nadel. Rein dekorativ. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-8 shrink-0', className)}>
      <rect width="32" height="32" rx="9" className="fill-surface-3" />
      <path
        d="M7 21a9 9 0 1 1 18 0"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-line-strong"
      />
      <path
        d="M7 21a9 9 0 0 1 11.8-8.56"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="stroke-accent"
      />
      <path d="M16 21l2.8-6.9" strokeWidth="2.4" strokeLinecap="round" className="stroke-ink" />
      <circle cx="16" cy="21" r="2.3" className="fill-ink" />
    </svg>
  );
}

/** Wortmarke «MotoMatch» mit Bildmarke. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="font-display text-lg font-semibold tracking-tight text-ink">
        Moto<span className="text-accent-ink">Match</span>
      </span>
    </span>
  );
}
