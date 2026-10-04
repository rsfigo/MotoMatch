import { motion } from 'motion/react';
import { CountUp } from '@/components/ui/CountUp';
import type { Generation } from '@/data/schema';
import { t } from '@/i18n';
import { formatChf, formatKw, formatNumber, formatRpm, formatWeight, NBSP } from '@/lib/format';
import { fadeUp, staggerContainer } from '@/lib/motion';
import { kwToPs } from '@/lib/units';

interface FigureProps {
  label: string;
  value: number;
  format: (value: number) => string;
  hint?: string;
}

/**
 * Eine Kachel. Auf sehr schmalen Handys als Zeile (Bezeichnung links, Zahl rechts),
 * damit auch lange Preise wie «CHF 19’870.–» Platz haben.
 */
function Figure({ label, value, format, hint }: FigureProps) {
  return (
    <motion.div
      variants={fadeUp}
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 rounded-card border border-line bg-surface p-4 shadow-card xs:block sm:p-5"
    >
      <dt className="col-start-1 text-xs font-medium text-ink-muted sm:text-sm">{label}</dt>
      <dd className="col-start-2 row-span-2 row-start-1 font-display text-3xl leading-tight font-semibold whitespace-nowrap xs:mt-1 sm:text-4xl">
        <CountUp value={value} format={format} />
      </dd>
      {hint && <dd className="col-start-1 mt-1 text-xs text-ink-subtle">{hint}</dd>}
    </motion.div>
  );
}

/** Die vier wichtigsten Zahlen gross – zählen beim Erscheinen hoch. */
export function KeyFigures({ generation }: { generation: Generation }) {
  const { engine, chassis, price } = generation;

  return (
    <motion.dl
      variants={staggerContainer()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="grid gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-4"
    >
      <Figure
        label={t.specs.power}
        value={kwToPs(engine.powerKw)}
        format={(ps) => `${formatNumber(ps)}${NBSP}PS`}
        hint={formatKw(engine.powerKw)}
      />
      <Figure
        label={t.specs.torque}
        value={engine.torqueNm}
        format={(nm) => `${formatNumber(nm, Number.isInteger(engine.torqueNm) ? 0 : 1)}${NBSP}Nm`}
        hint={engine.torqueRpm ? t.specs.atRpm(formatRpm(engine.torqueRpm)) : undefined}
      />
      <Figure
        label={t.specs.weight}
        value={chassis.weightKg}
        format={formatWeight}
        hint={chassis.weightNote ?? t.licence.disclaimer}
      />
      <Figure label={t.specs.price} value={price.chf} format={formatChf} />
    </motion.dl>
  );
}
