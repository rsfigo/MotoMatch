import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { CountUp } from '@/components/ui/CountUp';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

interface PercentRingProps {
  percent: number;
  /** Platz 1 etwas grösser */
  large?: boolean;
  /** Verzögerung, damit die Ringe nacheinander loslaufen (Sekunden) */
  delay?: number;
}

/** Match-Prozent als Ring, der sich füllt, mit hochzählender Zahl. */
export function PercentRing({ percent, large = false, delay = 0 }: PercentRingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn('relative shrink-0', large ? 'size-24 sm:size-28' : 'size-20 sm:size-24')}
    >
      <span className="sr-only">{t.match.results.percentLabel(percent)}</span>
      <svg viewBox="0 0 120 120" aria-hidden="true" className="size-full -rotate-90">
        <circle cx="60" cy="60" r="52" strokeWidth="9" className="fill-none stroke-surface-3" />
        <motion.circle
          cx="60"
          cy="60"
          r="52"
          strokeWidth="9"
          strokeLinecap="round"
          className="fill-none stroke-accent"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: inView ? percent / 100 : 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.2, ease: ease.out, delay }}
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center font-display font-bold"
      >
        <span className={cn('flex items-baseline', large ? 'text-3xl' : 'text-2xl')}>
          <CountUp value={percent} format={(value) => String(value)} />
          <span className="ml-0.5 text-sm text-ink-muted">%</span>
        </span>
      </span>
    </div>
  );
}
