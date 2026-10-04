import { Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { duration, ease } from '@/lib/motion';

interface InfoTooltipProps {
  /** Name des Info-Knopfs für Screenreader, z. B. «Was heisst das?» */
  label: string;
  /** Inhalt des Tooltips */
  children: ReactNode;
  /** Ausrichtung des Tooltips relativ zum Knopf (an Bildschirmrändern wichtig) */
  align?: 'start' | 'center' | 'end';
  className?: string;
}

const ALIGN: Record<NonNullable<InfoTooltipProps['align']>, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

/**
 * Kleiner Info-Knopf mit Erklärung. Öffnet bei Hover, Fokus oder Antippen.
 * Screenreader bekommen den Text immer über aria-describedby.
 */
export function InfoTooltip({ label, children, align = 'center', className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const descriptionId = useId();

  return (
    <span
      className={cn('relative inline-flex align-middle', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={descriptionId}
        onClick={() => setOpen((value) => !value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setOpen(false);
        }}
        className="grid size-6 place-items-center rounded-full text-ink-subtle hover:text-ink"
      >
        <Info aria-hidden="true" className="size-4" />
      </button>
      <span id={descriptionId} className="sr-only">
        {children}
      </span>
      <AnimatePresence>
        {open && (
          <motion.span
            aria-hidden="true"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0, transition: { duration: duration.fast, ease: ease.out } }}
            exit={{ opacity: 0, y: 4, transition: { duration: duration.instant } }}
            className={cn(
              'pointer-events-none absolute bottom-full z-50 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-control border border-line-strong bg-surface-2 p-3 text-left text-xs leading-relaxed font-normal text-ink normal-case shadow-raised',
              ALIGN[align],
            )}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
