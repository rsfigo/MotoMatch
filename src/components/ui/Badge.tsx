import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeTone = 'neutral' | 'accent' | 'warning';

const TONES: Record<BadgeTone, string> = {
  neutral: 'border-line bg-surface-2 text-ink-muted',
  accent: 'border-accent/40 bg-accent-soft text-accent-ink',
  warning: 'border-warning/40 bg-warning/10 text-warning',
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
  title?: string;
}

/** Kleines Etikett, z. B. für Baujahre oder Führerausweis-Kategorie. */
export function Badge({ children, tone = 'neutral', icon, className, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap tabular-nums',
        TONES[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
