import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

interface CountUpProps {
  value: number;
  /** Formatiert die Zahl, z. B. formatChf */
  format: (value: number) => string;
  /** Nachkommastellen während des Zählens (Standard: wie der Zielwert) */
  decimals?: number;
  className?: string;
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Zahl, die beim ersten Sichtbarwerden von 0 hochzählt.
 * Ändert sich der Wert (z. B. andere Generation), zählt sie vom alten zum neuen Wert.
 * Screenreader lesen immer den Endwert. Bei reduzierter Bewegung steht der Wert sofort da.
 */
export function CountUp({ value, format, decimals, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const current = useMotionValue(0);
  const precision = decimals ?? (Number.isInteger(value) ? 0 : 1);
  // Zwischenwerte gerundet (keine «CHF 4’523.71»), der Endwert exakt – sonst würde doppelt
  // gerundet (145.48 → 145.5 → «146 PS» statt «145 PS»).
  const text = useTransform(current, (latest) =>
    latest === value ? format(value) : format(roundTo(latest, precision)),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      current.jump(value);
      return;
    }
    const controls = animate(current, value, { duration: 0.9, ease: ease.out });
    return () => controls.stop();
  }, [inView, value, reduceMotion, current]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      <span className="sr-only">{format(value)}</span>
      <motion.span aria-hidden="true">{text}</motion.span>
    </span>
  );
}
