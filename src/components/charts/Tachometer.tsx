import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useEffect, type RefObject } from 'react';
import { formatNumber } from '@/lib/format';
import { ease, followSpring } from '@/lib/motion';

/** Skala in 1000 U/min */
const MAX_RPM = 14;
const REDLINE_RPM = 11;
const IDLE_RPM = 1.2;

const CENTER = 200;
const RADIUS = 150;
/** Die Skala läuft über 270°: von unten links (135°) im Uhrzeigersinn bis unten rechts (405°). */
const START_ANGLE = 135;
const SWEEP = 270;

function angleFor(rpm: number): number {
  return START_ANGLE + (rpm / MAX_RPM) * SWEEP;
}

function polar(angleDegrees: number, radius: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  return { x: CENTER + Math.cos(radians) * radius, y: CENTER + Math.sin(radians) * radius };
}

function arcPath(fromRpm: number, toRpm: number, radius: number): string {
  const start = polar(angleFor(fromRpm), radius);
  const end = polar(angleFor(toRpm), radius);
  const largeArc = angleFor(toRpm) - angleFor(fromRpm) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

const TICKS = Array.from({ length: MAX_RPM * 2 + 1 }, (_, index) => index / 2);

interface TachometerProps {
  /** Bereich, dessen Scroll-Fortschritt die Drehzahl steigen lässt */
  scrollTarget: RefObject<HTMLElement | null>;
  label: string;
  className?: string;
}

/**
 * Drehzahlmesser für den Hero (eigene SVG-Grafik, keine Chart-Bibliothek).
 * Beim Laden schlägt die Nadel bis kurz vor den roten Bereich aus und fällt auf Leerlauf
 * zurück – wie beim Einschalten eines Motorrads. Beim Scrollen steigt die Drehzahl.
 * Bei reduzierter Bewegung steht die Nadel still.
 */
export function Tachometer({ scrollTarget, label, className }: TachometerProps) {
  const reduceMotion = useReducedMotion();
  const sweep = useMotionValue(reduceMotion ? IDLE_RPM : 0);
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ['start start', 'end start'],
  });
  const scrollRpm = useTransform(scrollYProgress, [0, 1], [0, MAX_RPM * 0.72]);

  // Ziel-Drehzahl = Startanimation + Scroll. Die Feder lässt die Nadel leicht nachschwingen.
  const targetRpm = useTransform(() => sweep.get() + (reduceMotion ? 0 : scrollRpm.get()));
  const rpm = useSpring(targetRpm, followSpring.needle);
  const rotate = useTransform(rpm, (value) => angleFor(Math.min(Math.max(value, 0), MAX_RPM)) + 90);
  const readout = useTransform(rpm, (value) =>
    formatNumber(Math.max(0, Math.round(value * 20) * 50)),
  );

  useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(sweep, [0, REDLINE_RPM - 0.6, IDLE_RPM], {
      duration: 1.8,
      times: [0, 0.42, 1],
      ease: [ease.out, ease.inOut],
      delay: 0.35,
    });
    return () => controls.stop();
  }, [reduceMotion, sweep]);

  return (
    <figure className={className}>
      <svg
        viewBox="0 0 400 400"
        role="img"
        aria-label={label}
        className="h-auto w-full overflow-visible"
      >
        {/* Hintergrund-Scheibe */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 34}
          className="fill-surface stroke-line"
          strokeWidth={1.5}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS + 22}
          className="fill-none stroke-line"
          strokeWidth={1}
        />

        {/* Skala und roter Bereich */}
        <path
          d={arcPath(0, MAX_RPM, RADIUS)}
          className="fill-none stroke-surface-3"
          strokeWidth={10}
          strokeLinecap="round"
        />
        <path
          d={arcPath(REDLINE_RPM, MAX_RPM, RADIUS)}
          className="fill-none stroke-accent"
          strokeWidth={10}
          strokeLinecap="round"
        />

        {TICKS.map((value) => {
          const isMajor = Number.isInteger(value);
          const outer = polar(angleFor(value), RADIUS - 14);
          const inner = polar(angleFor(value), RADIUS - (isMajor ? 32 : 22));
          return (
            <line
              key={value}
              x1={outer.x}
              y1={outer.y}
              x2={inner.x}
              y2={inner.y}
              strokeWidth={isMajor ? 3 : 1.5}
              strokeLinecap="round"
              className={
                value >= REDLINE_RPM
                  ? 'stroke-accent'
                  : isMajor
                    ? 'stroke-ink-muted'
                    : 'stroke-ink-subtle'
              }
            />
          );
        })}
        {TICKS.filter((value) => Number.isInteger(value) && value % 2 === 0).map((value) => {
          const position = polar(angleFor(value), RADIUS - 54);
          return (
            <text
              key={value}
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`font-display text-[19px] font-semibold ${value >= REDLINE_RPM ? 'fill-accent-ink' : 'fill-ink-muted'}`}
            >
              {value}
            </text>
          );
        })}

        {/* Digitale Anzeige */}
        <motion.text
          x={CENTER}
          y={CENTER + 74}
          textAnchor="middle"
          className="fill-ink font-display text-[34px] font-semibold tabular-nums"
        >
          {readout}
        </motion.text>
        <text
          x={CENTER}
          y={CENTER + 100}
          textAnchor="middle"
          className="fill-ink-subtle text-[13px] tracking-[0.2em] uppercase"
        >
          U/min
        </text>

        {/* Nadel: zeigt nach oben und wird um die Mitte gedreht */}
        <Needle rotate={rotate} />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={16}
          className="fill-surface-3 stroke-line-strong"
          strokeWidth={2}
        />
        <circle cx={CENTER} cy={CENTER} r={5} className="fill-accent" />
      </svg>
    </figure>
  );
}

function Needle({ rotate }: { rotate: MotionValue<number> }) {
  return (
    <motion.g style={{ rotate, originX: '50%', originY: '100%' }}>
      {/* breiter, halbtransparenter Strich als «Glow» (günstiger als ein SVG-Filter) */}
      <path
        d={`M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - RADIUS + 18}`}
        className="stroke-accent/25"
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d={`M ${CENTER - 4} ${CENTER} L ${CENTER} ${CENTER - RADIUS + 18} L ${CENTER + 4} ${CENTER} Z`}
        className="fill-accent"
      />
    </motion.g>
  );
}
