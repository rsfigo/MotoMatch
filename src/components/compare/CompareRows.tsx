import { Check } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useRef, type ReactNode, type RefObject } from 'react';
import { FeatureIcon } from '@/components/bike/FeatureIcon';
import { Badge } from '@/components/ui/Badge';
import { CountUp } from '@/components/ui/CountUp';
import { t } from '@/i18n';
import {
  barFraction,
  deltaToBest,
  type CompareItem,
  type CompareRow,
  type ExtraRow,
} from '@/lib/compare';
import { cn } from '@/lib/cn';
import { duration, ease, spring } from '@/lib/motion';
import { rowColumns } from './compareGrid';

/** Zeilen blenden ein und aus; die übrigen rücken per Layout-Animation nach. */
const rowMotion = {
  layout: 'position',
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: duration.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: duration.instant, ease: ease.in } },
  transition: { layout: spring.layout },
} as const;

const ROW_CLASSES = 'grid border-b border-line';

/** Wird die Zeile zum ersten Mal sichtbar? Startet Balken, Glow und Chips. */
function useRowVisible(ref: RefObject<HTMLElement | null>): boolean {
  return useInView(ref, { once: true, margin: '-40px' });
}

/** Beschriftung links – bleibt beim seitlichen Wischen stehen. */
function RowLabel({
  label,
  hint,
  icon,
  labelRef,
}: {
  label: string;
  hint?: string;
  icon?: ReactNode;
  labelRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={labelRef}
      role="rowheader"
      className="sticky left-0 z-10 flex gap-2 bg-canvas py-3 pr-2 transition-shadow group-data-[scrolled=true]/scroll:shadow-[10px_0_12px_-10px_rgb(0_0_0/0.55)] sm:pr-4"
    >
      {icon}
      <span className="min-w-0">
        <span className="block text-[13px] leading-snug font-medium text-pretty hyphens-auto text-ink-muted sm:text-sm">
          {label}
        </span>
        {hint && (
          <span className="mt-0.5 block text-[11px] leading-snug text-ink-subtle sm:text-xs">
            {hint}
          </span>
        )}
      </span>
    </div>
  );
}

/** Weicher Lichtschein hinter dem Bestwert. */
function BestGlow({ visible }: { visible: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_28%_38%,var(--mm-glow-color),transparent_75%)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 0.8 : 0 }}
      transition={{ duration: duration.slower, delay: 0.45 }}
    />
  );
}

/** Balken, der beim Einblenden von 0 auf seine Länge wächst (nur transform). */
function ValueBar({
  fraction,
  best,
  visible,
}: {
  fraction: number;
  best: boolean;
  visible: boolean;
}) {
  return (
    <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-surface-3">
      <motion.span
        className={cn(
          'block h-full origin-left rounded-full',
          best ? 'bg-accent' : 'bg-ink-subtle',
        )}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: visible ? fraction : 0 }}
        transition={{ duration: 0.9, ease: ease.out }}
      />
    </span>
  );
}

function SpecCell({
  row,
  index,
  item,
  visible,
}: {
  row: CompareRow;
  index: number;
  item: CompareItem;
  visible: boolean;
}) {
  const { spec } = row;
  const value = row.values[index];
  const display = row.displays[index] ?? null;
  const best = row.best.has(index);
  const detail = display === null ? undefined : spec.detail?.(item.generation);
  const fraction = barFraction(row, index);
  const delta = deltaToBest(row, index);
  // Hochzählen nur, wenn die Zahl genau so angezeigt wird (nicht z. B. bei «ca. 210 km/h»)
  const format = spec.formatValue;
  const countUp =
    format && value !== undefined && format(value) === display ? { value, format } : undefined;

  return (
    <div role="cell" className="relative min-w-0 px-2 py-3 sm:px-4">
      {best && <BestGlow visible={visible} />}
      <div className="relative">
        {display === null ? (
          <span className="text-sm text-ink-subtle" title={t.data.notAvailableLong}>
            {t.data.notAvailable}
          </span>
        ) : (
          <span
            className={cn(
              'block text-[15px] leading-snug font-semibold text-pretty sm:text-base',
              best ? 'text-accent-ink' : 'text-ink',
            )}
          >
            {countUp ? (
              <CountUp value={countUp.value} format={countUp.format} />
            ) : (
              <span className="tabular-nums">{display}</span>
            )}
            {best && <span className="sr-only"> ({t.compare.best})</span>}
          </span>
        )}
        {detail && <span className="mt-0.5 block text-xs text-ink-subtle">{detail}</span>}
        {fraction !== undefined && <ValueBar fraction={fraction} best={best} visible={visible} />}
        {delta && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
            transition={{ ...spring.snappy, delay: 0.55 }}
            className="mt-2 inline-flex rounded-full border border-line bg-surface-2 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-ink-muted tabular-nums"
          >
            <span className="sr-only">{t.compare.deltaToBest}: </span>
            {delta}
          </motion.span>
        )}
      </div>
    </div>
  );
}

function SpecRowContent({ row, items }: { row: CompareRow; items: readonly CompareItem[] }) {
  const labelRef = useRef<HTMLDivElement>(null);
  const visible = useRowVisible(labelRef);

  return (
    <>
      <RowLabel labelRef={labelRef} label={row.spec.label} hint={row.spec.hint} />
      {items.map((item, index) => (
        <SpecCell key={item.model.id} row={row} index={index} item={item} visible={visible} />
      ))}
    </>
  );
}

/** Zeilen mit technischen Daten: Bestwert mit Akzent und Glow, Balken, Differenz-Chips. */
export function SpecRows({
  rows,
  items,
}: {
  rows: readonly CompareRow[];
  items: readonly CompareItem[];
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {rows.map((row) => (
        <motion.div
          key={row.spec.key}
          role="row"
          {...rowMotion}
          className={ROW_CLASSES}
          style={rowColumns(items.length)}
        >
          <SpecRowContent row={row} items={items} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

function ExtraCell({ availability }: { availability: ExtraRow['availability'][number] }) {
  return (
    <div role="cell" className="flex min-w-0 items-start px-2 py-3 sm:px-4">
      {availability === 'standard' && (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium">
          <Check aria-hidden="true" className="size-4 shrink-0 text-positive" />
          {t.availability.standard}
        </span>
      )}
      {availability === 'optional' && <Badge tone="accent">{t.availability.optional}</Badge>}
      {availability === null && (
        <span className="text-ink-subtle">
          <span aria-hidden="true">{t.data.none}</span>
          <span className="sr-only">{t.compare.extraMissing}</span>
        </span>
      )}
    </div>
  );
}

/** Zeilen der Extras: «Serie», «Optional» oder ein dezentes «–», nie eine leere Zelle. */
export function ExtraRows({
  rows,
  items,
}: {
  rows: readonly ExtraRow[];
  items: readonly CompareItem[];
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {rows.map((row) => (
        <motion.div
          key={row.feature.key}
          role="row"
          {...rowMotion}
          className={ROW_CLASSES}
          style={rowColumns(items.length)}
        >
          <RowLabel
            label={row.feature.label}
            icon={
              <FeatureIcon
                name={row.feature.icon}
                className="mt-0.5 hidden size-4 shrink-0 text-ink-subtle sm:block"
              />
            }
          />
          {items.map((item, index) => (
            <ExtraCell key={item.model.id} availability={row.availability[index] ?? null} />
          ))}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
