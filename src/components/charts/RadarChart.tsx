import { motion } from 'motion/react';
import { t } from '@/i18n';
import { ease } from '@/lib/motion';

export interface RadarValue {
  key: string;
  label: string;
  /** 1 bis `max` */
  value: number;
}

interface RadarChartProps {
  values: readonly RadarValue[];
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
 * Netzdiagramm (eigenes SVG). Die Fläche baut sich aus der Mitte auf (nur transform/opacity).
 * Für Screenreader gibt es alle Werte als Text.
 */
export function RadarChart({ values, max = 10, label, animationKey }: RadarChartProps) {
  const count = values.length;
  const description = `${label}: ${values
    .map((item) => `${item.label} ${t.editorial.scoreOutOf(item.value)}`)
    .join(', ')}`;

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
      {values.map((item, index) => {
        const end = point(index, count, 1);
        return (
          <line
            key={item.key}
            x1={CENTER}
            y1={CENTER}
            x2={end.x}
            y2={end.y}
            className="stroke-line"
            strokeWidth={1}
          />
        );
      })}

      {/* Werte: Gruppe mit unsichtbarem Kreis, damit die Skalierung genau aus der Mitte kommt */}
      <motion.g
        key={animationKey}
        initial={{ scale: 0.2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: ease.out }}
      >
        <circle cx={CENTER} cy={CENTER} r={RADIUS} className="fill-none stroke-none" />
        <polygon
          points={polygonPoints(count, (index) => (values[index]?.value ?? 0) / max)}
          className="fill-accent/20 stroke-accent"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        {values.map((item, index) => {
          const { x, y } = point(index, count, item.value / max);
          return <circle key={item.key} cx={x} cy={y} r={4.5} className="fill-accent" />;
        })}
      </motion.g>

      {/* Beschriftungen */}
      {values.map((item, index) => {
        const { x, y } = point(index, count, 1.22);
        return (
          <text
            key={item.key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-ink-muted text-[16px] font-medium"
          >
            {item.label}
          </text>
        );
      })}
    </svg>
  );
}
