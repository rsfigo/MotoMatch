import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  DEFAULT_FILTERS,
  parseFilters,
  serializeFilters,
  type CatalogFilters,
} from '@/lib/catalog';

/**
 * Filterzustand des Katalogs – gespeichert in der URL (z. B. /bikes?marke=ktm&ausweis=a35).
 * So lässt sich jede Auswahl teilen, speichern und mit «Zurück» wiederherstellen.
 */
export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);

  /** Ändert einzelne Filter. `replace`, damit nicht jede Änderung einen Verlaufseintrag erzeugt. */
  function updateFilters(update: Partial<CatalogFilters>) {
    setSearchParams((current) => serializeFilters({ ...parseFilters(current), ...update }), {
      replace: true,
    });
  }

  /** Setzt alle Filter zurück, Suche und Sortierung bleiben. */
  function resetFilters() {
    setSearchParams(
      (current) => {
        const { query, sort } = parseFilters(current);
        return serializeFilters({ ...DEFAULT_FILTERS, query, sort });
      },
      { replace: true },
    );
  }

  return { filters, updateFilters, resetFilters };
}
