import { useEffect, useRef, useState } from 'react';
import { t } from '@/i18n';
import type { Range } from '@/lib/catalog';
import { cn } from '@/lib/cn';

interface RangeSliderProps {
  label: string;
  /** Kleinster und grösster möglicher Wert */
  min: number;
  max: number;
  step: number;
  /** Aktueller Filter. Leere Grenze = nicht eingeschränkt. */
  value: Range;
  /** Wird kurz nach dem Loslassen aufgerufen (nicht bei jeder Bewegung). */
  onChange: (range: Range) => void;
  format: (value: number) => string;
}

/** Wartezeit, bevor ein neuer Wert übernommen wird (schont die Browser-URL). */
const COMMIT_DELAY_MS = 200;

const THUMB =
  'pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent outline-none ' +
  '[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none ' +
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent ' +
  '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md ' +
  '[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full ' +
  '[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-white ' +
  '[&:focus-visible::-webkit-slider-thumb]:ring-4 [&:focus-visible::-webkit-slider-thumb]:ring-accent/40 ' +
  '[&:focus-visible::-moz-range-thumb]:ring-4 [&:focus-visible::-moz-range-thumb]:ring-accent/40';

/** Schieberegler mit zwei Griffen (von–bis), gebaut aus zwei nativen Range-Inputs. */
export function RangeSlider({ label, min, max, step, value, onChange, format }: RangeSliderProps) {
  const [low, setLow] = useState(value.min ?? min);
  const [high, setHigh] = useState(value.max ?? max);

  // Ändert sich der Filter von aussen (z. B. «zurücksetzen»), übernehmen wir ihn.
  const [previousValue, setPreviousValue] = useState(value);
  if (previousValue.min !== value.min || previousValue.max !== value.max) {
    setPreviousValue(value);
    setLow(value.min ?? min);
    setHigh(value.max ?? max);
  }

  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function scheduleCommit(nextLow: number, nextHigh: number) {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onChange({
        min: nextLow > min ? nextLow : undefined,
        max: nextHigh < max ? nextHigh : undefined,
      });
    }, COMMIT_DELAY_MS);
  }

  const span = max - min || 1;
  const lowPercent = ((low - min) / span) * 100;
  const highPercent = ((high - min) / span) * 100;

  return (
    <fieldset>
      <legend className="flex w-full items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-ink">{label}</span>
        <span className="text-xs text-ink-muted tabular-nums">
          {format(low)} – {format(high)}
        </span>
      </legend>
      <div className="relative mt-2 h-8">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-surface-3" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-accent"
          style={{ left: `${lowPercent}%`, right: `${100 - highPercent}%` }}
        />
        <input
          type="range"
          aria-label={`${label}: ${t.catalog.filter.minimum}`}
          aria-valuetext={format(low)}
          min={min}
          max={max}
          step={step}
          value={low}
          onChange={(event) => {
            const next = Math.min(Number(event.target.value), high);
            setLow(next);
            scheduleCommit(next, high);
          }}
          // Liegen beide Griffe rechts übereinander, muss der linke oben liegen.
          className={cn(THUMB, lowPercent > 90 ? 'z-20' : 'z-10')}
        />
        <input
          type="range"
          aria-label={`${label}: ${t.catalog.filter.maximum}`}
          aria-valuetext={format(high)}
          min={min}
          max={max}
          step={step}
          value={high}
          onChange={(event) => {
            const next = Math.max(Number(event.target.value), low);
            setHigh(next);
            scheduleCommit(low, next);
          }}
          className={cn(THUMB, 'z-10')}
        />
      </div>
    </fieldset>
  );
}
