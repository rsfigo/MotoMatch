import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';

interface OptionCardProps {
  /** radio = eine Antwort, checkbox = mehrere */
  type: 'radio' | 'checkbox';
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
  /** Symbol links, z. B. ein Icon oder ein Kürzel wie «A35» */
  icon: ReactNode;
}

/**
 * Antwort als Karte. Darin steckt ein echtes (unsichtbares) Radio-Button- bzw.
 * Checkbox-Feld: Tastatur, Screenreader und Formular-Semantik funktionieren wie gewohnt.
 */
export function OptionCard({
  type,
  name,
  value,
  checked,
  onChange,
  label,
  description,
  icon,
}: OptionCardProps) {
  return (
    <motion.label
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
      className={cn(
        'flex cursor-pointer items-center gap-3 rounded-card border p-3.5 transition-colors select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent sm:gap-4 sm:p-4',
        checked
          ? 'border-accent bg-accent-soft'
          : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2',
      )}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold transition-colors',
          checked ? 'bg-accent text-on-accent' : 'bg-surface-2 text-ink-muted',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">{label}</span>
        {description && <span className="mt-0.5 block text-sm text-ink-muted">{description}</span>}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'grid size-6 shrink-0 place-items-center border-2 transition-colors',
          type === 'radio' ? 'rounded-full' : 'rounded-md',
          checked ? 'border-accent bg-accent text-on-accent' : 'border-line-strong',
        )}
      >
        <AnimatePresence initial={false}>
          {checked && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={spring.bouncy}
            >
              <Check className="size-3.5" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.label>
  );
}
