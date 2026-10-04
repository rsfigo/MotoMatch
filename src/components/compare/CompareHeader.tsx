import { ChevronDown, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import { Container } from '@/components/layout/Container';
import { useManufacturerName, useModelFullName } from '@/hooks/useBikeData';
import { t } from '@/i18n';
import type { CompareItem } from '@/lib/compare';
import { cn } from '@/lib/cn';
import { generationYears } from '@/lib/generations';
import { duration, ease, spring } from '@/lib/motion';
import type { ScrollEdges } from '@/hooks/useScrollSync';
import { headerColumns } from './compareGrid';

interface CompareHeaderProps {
  items: readonly CompareItem[];
  canAdd: boolean;
  onAdd: () => void;
  onRemove: (modelId: string) => void;
  onGenerationChange: (modelId: string, generationId: string) => void;
  /** Bereich mit den Bike-Spalten – scrollt mit der Tabelle mit */
  viewportRef: (element: HTMLDivElement | null) => void;
  edges: ScrollEdges;
}

/** Generation wählen (nur bei mehreren Generationen, sonst stehen die Baujahre da). */
function GenerationSelect({
  item,
  onChange,
}: {
  item: CompareItem;
  onChange: (generationId: string) => void;
}) {
  const { model, generation } = item;
  const fullName = useModelFullName();
  if (model.generations.length < 2) {
    return (
      <span className="mt-1 block text-xs text-ink-muted tabular-nums">
        {generationYears(generation)}
      </span>
    );
  }

  return (
    <span className="relative mt-1 inline-flex max-w-full">
      <select
        aria-label={t.compare.generationOf(fullName(model))}
        value={generation.id}
        onChange={(event) => onChange(event.target.value)}
        className="h-7 max-w-full min-w-0 appearance-none truncate rounded-full border border-line bg-surface-2 pr-7 pl-2.5 text-xs font-medium text-ink tabular-nums hover:border-line-strong"
      >
        {[...model.generations].reverse().map((option) => (
          <option key={option.id} value={option.id}>
            {generationYears(option)}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-ink-muted"
      />
    </span>
  );
}

function BikeColumnHead({
  item,
  onRemove,
  onGenerationChange,
}: {
  item: CompareItem;
  onRemove: () => void;
  onGenerationChange: (generationId: string) => void;
}) {
  const { model } = item;
  const name = useModelFullName()(model);
  const manufacturerName = useManufacturerName()(model.manufacturerId);
  const detailUrl = `/bikes/${model.id}`;

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: spring.gentle }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: duration.fast, ease: ease.in } }}
      transition={{ layout: spring.layout }}
      className="min-w-0 px-1 py-2 sm:px-1.5 sm:py-3"
    >
      <div className="relative flex h-full flex-col gap-1.5 rounded-control border border-line bg-surface p-2 shadow-card lg:flex-row lg:items-center lg:gap-3 lg:p-2.5">
        <Link
          to={detailUrl}
          tabIndex={-1}
          aria-hidden="true"
          className="grid h-8 w-12 shrink-0 place-items-center rounded-lg bg-surface-2 sm:h-10 sm:w-16 lg:h-14 lg:w-24"
        >
          <BikeSilhouette category={model.category} className="w-10 sm:w-14 lg:w-20" />
        </Link>
        <div className="min-w-0 flex-1 lg:pr-6">
          <p
            aria-hidden="true"
            className="hidden truncate text-[11px] font-semibold tracking-[0.12em] text-accent-ink uppercase sm:block"
          >
            {manufacturerName}
          </p>
          <Link
            to={detailUrl}
            title={name}
            data-compare-name
            className="block truncate text-sm leading-tight font-semibold hover:text-accent-ink lg:text-base"
          >
            <span className="sr-only">{manufacturerName} </span>
            {model.name}
          </Link>
          <GenerationSelect item={item} onChange={onGenerationChange} />
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={t.compare.remove(name)}
          title={t.compare.remove(name)}
          className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </motion.li>
  );
}

/** Freier Platz: öffnet die Suche «Bike hinzufügen». */
function AddSlot({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onAdd}
      whileTap={{ scale: 0.97 }}
      transition={spring.snappy}
      className="group flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-control border border-dashed border-line-strong px-1 py-2 text-center text-xs font-medium text-ink-muted hover:border-accent hover:text-ink sm:text-sm"
    >
      <span className="grid size-7 place-items-center rounded-full bg-surface-2 text-ink transition-colors group-hover:bg-accent group-hover:text-on-accent">
        <Plus aria-hidden="true" className="size-4" />
      </span>
      {t.compare.addBike}
      <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 font-sans text-[11px] text-ink-subtle lg:block">
        {t.compare.paletteShortcut}
      </kbd>
    </motion.button>
  );
}

/**
 * Sticky-Kopf des Vergleichs: pro Bike Bild, Name, Generation und Entfernen-Knopf.
 * Links (über der Zeilenbeschriftung) der freie Platz zum Hinzufügen.
 */
export function CompareHeader({
  items,
  canAdd,
  onAdd,
  onRemove,
  onGenerationChange,
  viewportRef,
  edges,
}: CompareHeaderProps) {
  return (
    <div className="sticky top-16 z-30 border-y border-line bg-glass backdrop-blur-xl backdrop-saturate-150">
      <Container>
        <div className="relative flex">
          <div className="w-(--label-w) shrink-0 py-2 pr-1 sm:py-3 sm:pr-1.5">
            {canAdd && <AddSlot onAdd={onAdd} />}
          </div>
          <div ref={viewportRef} className="relative min-w-0 flex-1 overflow-hidden">
            <ul
              aria-label={t.compare.selectedBikes}
              className="grid"
              style={headerColumns(items.length)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {items.map((item) => (
                  <BikeColumnHead
                    key={item.model.id}
                    item={item}
                    onRemove={() => onRemove(item.model.id)}
                    onGenerationChange={(generationId) =>
                      onGenerationChange(item.model.id, generationId)
                    }
                  />
                ))}
              </AnimatePresence>
            </ul>
          </div>
          {/* Hinweis: rechts liegt noch ein Bike (nur wenn die Tabelle seitlich scrollt) */}
          <div
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-canvas to-transparent transition-opacity duration-300',
              edges.atEnd ? 'opacity-0' : 'opacity-100',
            )}
          />
        </div>
      </Container>
    </div>
  );
}
