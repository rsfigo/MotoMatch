import { motion, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';

type ChipProps = HTMLMotionProps<'button'> & { selected: boolean };

/** Umschaltbarer Chip, z. B. für Hersteller oder Kategorien im Filter. */
export function Chip({ selected, className, children, ...props }: ChipProps) {
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      whileTap={{ scale: 0.94 }}
      transition={spring.snappy}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium select-none',
        selected
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink',
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
