import { useSyncExternalStore } from 'react';
import { MAX_COMPARE } from '@/lib/compareSelection';
import { compareStore } from '@/lib/compareStore';
import { getModel } from '@/lib/data';

const EMPTY: readonly string[] = [];

/** Aktuelle Vergleichsauswahl und Aktionen dazu. */
export function useCompareSelection() {
  const stored = useSyncExternalStore(
    compareStore.subscribe,
    compareStore.getSnapshot,
    () => EMPTY,
  );
  // Unbekannte IDs (z. B. ein entferntes Modell) ignorieren
  const ids = stored.filter((id) => getModel(id) !== undefined);

  return {
    ids,
    isSelected: (id: string) => ids.includes(id),
    isFull: ids.length >= MAX_COMPARE,
    toggle: compareStore.toggle,
    remove: compareStore.remove,
    clear: compareStore.clear,
  };
}
