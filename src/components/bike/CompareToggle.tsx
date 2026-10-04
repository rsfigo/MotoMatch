import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCompareSelection } from '@/hooks/useCompareSelection';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';

interface CompareToggleProps {
  modelId: string;
  /** Liefert die Position des Bildes – Startpunkt der Flug-Animation in die Vergleichsleiste. */
  getOrigin?: () => DOMRect | undefined;
  className?: string;
}

/** Checkbox «Vergleichen». Bei drei gewählten Bikes sind weitere gesperrt. */
export function CompareToggle({ modelId, getOrigin, className }: CompareToggleProps) {
  const { isSelected, isFull, toggle } = useCompareSelection();
  const selected = isSelected(modelId);
  const disabled = !selected && isFull;

  return (
    <label
      title={disabled ? t.card.compareFull : undefined}
      className={cn(
        'relative z-10 inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium select-none',
        'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
        selected
          ? 'border-accent bg-accent text-on-accent'
          : 'border-line-strong bg-surface text-ink hover:bg-surface-2',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={selected}
        disabled={disabled}
        onChange={() => toggle(modelId, selected ? undefined : getOrigin?.())}
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid size-4 place-items-center rounded-[5px] border',
          selected ? 'border-on-accent/40 bg-on-accent text-accent' : 'border-ink-subtle',
        )}
      >
        <AnimatePresence initial={false}>
          {selected && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={spring.bouncy}
            >
              <Check className="size-3" strokeWidth={3.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {t.card.compare}
    </label>
  );
}
