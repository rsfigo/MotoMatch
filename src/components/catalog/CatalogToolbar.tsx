import { ArrowDownUp, Search, SlidersHorizontal, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { t } from '@/i18n';
import { SORT_KEYS, type SortKey } from '@/lib/catalog';
import { spring } from '@/lib/motion';

interface CatalogToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  sort: SortKey;
  onSortChange: (sort: SortKey) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

/** Klebende Leiste mit Suche, Sortierung und (auf kleinen Bildschirmen) dem Filter-Knopf. */
export function CatalogToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  activeFilterCount,
  onOpenFilters,
}: CatalogToolbarProps) {
  return (
    <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-glass px-4 py-3 backdrop-blur-xl backdrop-saturate-150 sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-panel lg:border lg:px-3">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            aria-label={t.catalog.searchLabel}
            className="h-11 w-full rounded-full border border-line bg-surface pr-10 pl-10 text-sm text-ink placeholder:text-ink-subtle focus-visible:border-accent [&::-webkit-search-cancel-button]:appearance-none"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                type="button"
                onClick={() => onQueryChange('')}
                aria-label={t.catalog.clearSearch}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={spring.snappy}
                className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink"
              >
                <X aria-hidden="true" className="size-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <label className="relative">
          <span className="sr-only">{t.catalog.sortLabel}</span>
          <ArrowDownUp
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-subtle"
          />
          <select
            value={sort}
            aria-label={t.catalog.sortLabel}
            onChange={(event) => onSortChange(event.target.value as SortKey)}
            className="h-11 w-11 appearance-none rounded-full border border-line bg-surface text-sm text-transparent sm:w-auto sm:pr-4 sm:pl-10 sm:text-ink"
          >
            {SORT_KEYS.map((key) => (
              <option key={key} value={key} className="bg-surface text-ink">
                {t.catalog.sort[key]}
              </option>
            ))}
          </select>
        </label>

        <motion.button
          type="button"
          onClick={onOpenFilters}
          aria-label={t.catalog.filterButtonLabel(activeFilterCount)}
          aria-haspopup="dialog"
          whileTap={{ scale: 0.95 }}
          transition={spring.snappy}
          className="relative inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink lg:hidden"
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          {/* Auf sehr schmalen Handys nur das Icon */}
          <span aria-hidden="true" className="hidden xs:inline">
            {t.catalog.filters}
          </span>
          {activeFilterCount > 0 && (
            <span
              aria-hidden="true"
              className="grid size-5 place-items-center rounded-full bg-accent text-[11px] font-bold text-on-accent tabular-nums"
            >
              {activeFilterCount}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
