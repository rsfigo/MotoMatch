import { Search } from 'lucide-react';
import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { BikeSilhouette } from '@/components/bike/BikeSilhouette';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useManufacturers, useModels } from '@/hooks/useBikeData';
import { t } from '@/i18n';
import { matchesQuery, toCatalogEntry, type CatalogEntry } from '@/lib/catalog';
import { cn } from '@/lib/cn';
import { formatChf, formatPs } from '@/lib/format';
import { generationYears } from '@/lib/generations';

interface AddBikePaletteProps {
  open: boolean;
  onClose: () => void;
  onSelect: (modelId: string) => void;
  /** Bikes, die schon im Vergleich sind */
  excludeIds: readonly string[];
  /** Fokus nach dem Schliessen, falls der auslösende Knopf weg ist */
  fallbackFocus?: () => HTMLElement | null | undefined;
}

/** Suche im Stil einer Befehlspalette: tippen, mit Pfeiltasten wählen, Enter fügt hinzu. */
export function AddBikePalette({
  open,
  onClose,
  onSelect,
  excludeIds,
  fallbackFocus,
}: AddBikePaletteProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={t.compare.paletteTitle}
      fallbackFocus={fallbackFocus}
    >
      <PaletteContent onClose={onClose} onSelect={onSelect} excludeIds={excludeIds} />
    </Modal>
  );
}

function PaletteContent({
  onClose,
  onSelect,
  excludeIds,
}: Omit<AddBikePaletteProps, 'open' | 'fallbackFocus'>) {
  const models = useModels();
  const manufacturers = useManufacturers();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();
  const optionId = (index: number) => `${listId}-option-${index}`;

  const entries = useMemo(
    () =>
      models
        .filter((model) => !excludeIds.includes(model.id))
        .map((model) =>
          toCatalogEntry(
            model,
            manufacturers.find((manufacturer) => manufacturer.id === model.manufacturerId),
            t.categories[model.category],
          ),
        ),
    [models, manufacturers, excludeIds],
  );
  const results = entries.filter((entry) => matchesQuery(entry, query));
  const activeIndex = Math.min(active, results.length - 1);

  function choose(entry: CatalogEntry | undefined) {
    if (!entry) return;
    onSelect(entry.model.id);
    onClose();
  }

  function move(step: number) {
    if (results.length === 0) return;
    const next = (activeIndex + step + results.length) % results.length;
    setActive(next);
    requestAnimationFrame(() =>
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' }),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      move(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      move(-1);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[activeIndex]);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search aria-hidden="true" className="size-5 shrink-0 text-ink-subtle" />
        <input
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results.length > 0 ? optionId(activeIndex) : undefined}
          aria-label={t.compare.paletteTitle}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={t.compare.palettePlaceholder}
          className="h-14 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle"
        />
        <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-[11px] text-ink-subtle sm:block">
          Esc
        </kbd>
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label={t.compare.paletteTitle}
        className="max-h-[min(50vh,26rem)] overflow-y-auto overscroll-contain p-2"
      >
        {results.map((entry, index) => (
          <li
            key={entry.model.id}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            onMouseMove={() => setActive(index)}
            onClick={() => choose(entry)}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-control px-3 py-2.5',
              index === activeIndex && 'bg-surface-2',
            )}
          >
            <span className="grid h-10 w-14 shrink-0 place-items-center rounded-lg bg-surface">
              <BikeSilhouette category={entry.model.category} className="w-12" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{entry.fullName}</span>
              <span className="block truncate text-xs text-ink-muted tabular-nums">
                {generationYears(entry.generation)} · {formatPs(entry.generation.engine.powerKw)} ·{' '}
                {formatChf(entry.generation.price.chf)}
              </span>
            </span>
            {/* Auf schmalen Handys ohne Badge, damit der Preis Platz hat */}
            <span className="hidden shrink-0 xs:block">
              <Badge>{t.licence.short[entry.licence.required]}</Badge>
            </span>
          </li>
        ))}
        {results.length === 0 && (
          <li className="px-3 py-8 text-center text-sm text-ink-muted">{t.compare.paletteEmpty}</li>
        )}
      </ul>

      <p className="hidden border-t border-line px-4 py-2.5 text-xs text-ink-subtle sm:block">
        {t.compare.paletteHint}
      </p>
    </div>
  );
}
