import { motion } from 'motion/react';
import { useId } from 'react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Zusätzliche Erklärung unter dem Label */
  hint?: string;
  disabled?: boolean;
  className?: string;
}

/** Ein/Aus-Schalter mit federndem Knopf (role="switch"). */
export function Switch({ label, checked, onChange, hint, disabled, className }: SwitchProps) {
  const hintId = useId();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={hint ? hintId : undefined}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center justify-between gap-4 rounded-control py-1.5 text-left disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && (
          <span id={hintId} className="mt-0.5 block text-xs text-ink-muted">
            {hint}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5',
          checked ? 'bg-accent' : 'bg-ink-subtle',
        )}
      >
        <motion.span
          className="size-5 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 20 : 0 }}
          transition={spring.snappy}
        />
      </span>
    </button>
  );
}
