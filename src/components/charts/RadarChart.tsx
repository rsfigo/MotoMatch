import { motion } from 'motion/react';
import { t } from '@/i18n';
import { cn } from '@/lib/cn';
import { ease } from '@/lib/motion';

export interface RadarAxis {
  key: string;
  label: string;
}

/** Farbton einer Datenreihe – bewusst nur aus der Design-Palette. */
export type RadarTone = 'accent' | 'ink' | 'muted';

export interface RadarSeries {
  id: string;
  name: string;
  /** Ein Wert pro Achse, 1 bis `max` */
  values: readonly number[];
  tone: RadarTone;
}

interface RadarChartProps {
  axes: readonly RadarAxis[];
  series: readonly RadarSeries[];
  max?: number;
  /** Beschreibung für Screenreader, z. B. «Einsatzprofil» */
  label: string;
  /** Wechselt der Schlüssel (z. B. andere Generation), baut sich das Netz neu auf. */
  animationKey?: string;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = 110;
const RINGS = [0.2, 0.4, 0.6, 0.8, 1];

const TONES: Record<RadarTone, { area: string; point: string; dash?: string }> = {
  accent: { area: 'fill-accent/20 stroke-accent', point: 'fill-accent' },
  ink: { area: 'fill-ink/10 stroke-ink', point: 'fill-ink' },
  muted: { area: 'fill-none stroke-ink-subtle', point: 'fill-ink-subtle', dash: '6 5' },
};

/** Punkt auf der Achse `index` bei `fraction` des Radius (0 = Mitte, 1 = Rand). */
function point(index: number, count: number, fraction: number) {
  const angle = -Math.PI / 2 + (index / count) * Math.PI * 2;
  return {
    x: CENTER + Math.cos(angle) * RADIUS * fraction,
    y: CENTER + Math.sin(angle) * RADIUS * fraction,
  };
}

function polygonPoints(count: number, fractionAt: (index: number) => number): string {
  return Array.from({ length: count }, (_, index) => {
    const { x, y } = point(index, count, fractionAt(index));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

/**
 * Netzdiagramm (eigenes SVG), auch mit mehreren Bikes übereinander.
 * Die Flächen bauen sich aus der Mitte auf (nur transform/opacity).
 * Für Screenreader gibt es alle Werte als Text.
 */
export function RadarChart({ axes, series, max = 10, label, animationKey }: RadarChartProps) {
  const count = axes.length;
  const description = `${label}: ${series
    .map(
      (item) =>
        `${item.name}: ${axes
          .map((axis, index) => `${axis.label} ${t.editorial.scoreOutOf(item.values[index] ?? 0)}`)
          .join(', ')}`,
    )
    .join('; ')}`;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="img"
      aria-label={description}
      className="h-auto w-full overflow-visible"
    >
      {/* Raster */}
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={polygonPoints(count, () => ring)}
          className="fill-none stroke-line-strong"
          strokeWidth={1}
        />
      ))}
      {axes.map((axis, index) => {
        const end = point(index, count, 1);
        return (
          <line
            key={axis.key}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            className="stroke-line"
            strokeWidth={1}
          />
        );
      })}

      {/* Datenreihen: Gruppe mit unsichtbarem Kreis, damit die Skalierung genau aus der Mitte kommt */}
      {series.map((item, seriesIndex) => {
        const tone = TONES[item.tone];
        return (
          <motion.g
            key={`${item.id}-${animationKey ?? ''}`}
            initial={{ scale: 0.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: ease.out, delay: seriesIndex * 0.12 }}
          >
            <circle cx={CENTER} cy={CENTER} r={RADIUS} className="fill-none stroke-none" />
            <polygon
              points={polygonPoints(count, (index) => (item.values[index] ?? 0) / max)}
              className={tone.area}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeDasharray={tone.dash}
            />
            {axes.map((axis, index) => {
              const { x, y } = point(index, count, (item.values[index] ?? 0) / max);
              return <circle key={axis.key} cx={x} cy={y} r={4} className={tone.point} />;
            })}
          </motion.g>
        );
      })}

      {/* Beschriftungen */}
      {axes.map((axis, index) => {
        const { x, y } = point(index, count, 1.22);
        return (
          <text
            key={axis.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink-muted text-[16px] font-medium"
          >
            {axis.label}
          </text>
        );
      })}
    </svg>
  );
}

/** Legende für mehrere Datenreihen. */
export function RadarLegend({ series }: { series: readonly RadarSeries[] }) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
      {series.map((item) => (
        <li key={item.id} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              'h-0.5 w-6 rounded-full',
              item.tone === 'accent' && 'bg-accent',
              item.tone === 'ink' && 'bg-ink',
              item.tone === 'muted' && 'border-t-2 border-dashed border-ink-subtle',
            )}
          />
          {item.name}
        </li>
      ))}
    </ul>
  );
}
