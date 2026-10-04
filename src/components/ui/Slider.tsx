import { cn } from '@/lib/cn';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  /** Wert als Text für Screenreader, z. B. «175 cm» */
  valueText: string;
  disabled?: boolean;
  className?: string;
}

/** Durchmesser des Griffs in px – für die Länge der orangen Füllung. */
const THUMB_SIZE = 28;

const INPUT =
  'absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed ' +
  '[&::-webkit-slider-thumb]:size-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full ' +
  '[&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-white ' +
  '[&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110 ' +
  '[&::-moz-range-thumb]:size-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] ' +
  '[&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent ' +
  '[&:focus-visible::-webkit-slider-thumb]:ring-4 [&:focus-visible::-webkit-slider-thumb]:ring-accent/40 ' +
  '[&:focus-visible::-moz-range-thumb]:ring-4 [&:focus-visible::-moz-range-thumb]:ring-accent/40';

/** Schieberegler mit einem Griff (natives Range-Input: Pfeiltasten, Bild↑/↓, Pos1/Ende). */
export function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  valueText,
  disabled,
  className,
}: SliderProps) {
  const fraction = (value - min) / (max - min || 1);
  // Die Füllung endet in der Mitte des Griffs (der Griff bleibt immer ganz im Regler)
  const fillWidth = `calc(${fraction * 100}% + ${(0.5 - fraction) * THUMB_SIZE}px)`;

  return (
    <div className={cn('relative h-10', disabled && 'opacity-40', className)}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-surface-3"
      >
        <div className="h-full rounded-full bg-accent" style={{ width: fillWidth }} />
      </div>
      <input
        type="range"
        aria-label={label}
        aria-valuetext={valueText}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className={INPUT}
      />
    </div>
  );
}
