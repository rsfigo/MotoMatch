import { motion } from 'motion/react';
import { useId, useRef, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { spring } from '@/lib/motion';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Auswahl aus wenigen Optionen mit gleitendem Indikator (Radio-Gruppe).
 * Tastatur: Pfeiltasten wechseln die Auswahl.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const indicatorId = useId();
  const groupRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const index = options.findIndex((option) => option.value === value);
    const next = options[(index + step + options.length) % options.length];
    if (!next) return;
    onChange(next.value);
    // Fokus auf die neu gewählte Option setzen
    requestAnimationFrame(() => {
      groupRef.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    });
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('flex rounded-full border border-line bg-surface p-1', className)}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative min-w-0 flex-1 rounded-full px-2 py-1.5 text-[13px] font-medium whitespace-nowrap',
              selected ? 'text-ink' : 'text-ink-muted hover:text-ink',
            )}
          >
            {selected && (
              <motion.span
                layoutId={indicatorId}
                className="absolute inset-0 rounded-full bg-surface-3 shadow-sm"
                transition={spring.snappy}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
