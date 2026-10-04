import { useSyncExternalStore } from 'react';
import { useLoadedBikeData } from '@/hooks/useBikeData';
import { MAX_COMPARE } from '@/lib/compareSelection';
import { compareStore } from '@/lib/compareStore';

const EMPTY: readonly string[] = [];

/**
 * Aktuelle Vergleichsauswahl und Aktionen dazu. Wartet nicht auf die Daten (auch die
 * Kopfzeile nutzt den Hook); sobald die Modelle geladen sind, fallen unbekannte IDs weg.
 */
export function useCompareSelection() {
  const stored = useSyncExternalStore(
    compareStore.subscribe,
    compareStore.getSnapshot,
    () => EMPTY,
  );
  const loaded = useLoadedBikeData();
  // Unbekannte IDs (z. B. ein entferntes Modell) ignorieren
  const ids = loaded
    ? stored.filter((id) => loaded.models.some((model) => model.id === id))
    : stored;

  return {
    ids,
    isSelected: (id: string) => ids.includes(id),
    isFull: ids.length >= MAX_COMPARE,
    toggle: compareStore.toggle,
    remove: compareStore.remove,
    clear: compareStore.clear,
  };
}
