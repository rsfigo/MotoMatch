import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent shadow-glow',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-surface-2',
  ghost: 'text-ink-muted hover:bg-surface-2 hover:text-ink',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
};

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** CSS-Klassen eines Buttons – auch für Elemente nutzbar, die wie ein Button aussehen sollen. */
export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: ButtonStyleProps = {}) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none',
    'disabled:pointer-events-none disabled:opacity-45',
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  );
}
