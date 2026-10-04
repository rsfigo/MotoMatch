import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { CountUp } from '@/components/ui/CountUp';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

interface RingGaugeProps {
  /** Wert von 1 bis 10 */
  score: number;
  label: string;
  className?: string;
}

const MAX = 10;

/**
 * Ring, der sich beim Sichtbarwerden bis zum Wert füllt (eigenes SVG).
 * Der Ring animiert die Strichlänge (pathLength) – bei so kleinen Flächen unkritisch.
 */
export function RingGauge({ score, label, className }: RingGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-2 text-center', className)}>
      <div className="relative size-24 sm:size-28">
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-label={`${label}: ${t.editorial.scoreOutOf(score)}`}
          className="size-full -rotate-90"
        >
          <circle cx="60" cy="60" r="50" strokeWidth="10" className="fill-none stroke-surface-3" />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            strokeWidth="10"
            strokeLinecap="round"
            className="fill-none stroke-accent"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: inView ? score / MAX : 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 1.1, ease: ease.out }}
          />
        </svg>
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center font-display text-3xl font-semibold"
        >
          <CountUp value={score} format={(value) => String(value)} />
        </span>
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
