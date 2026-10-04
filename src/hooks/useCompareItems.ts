import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useModels } from '@/hooks/useBikeData';
import { useCompareSelection } from '@/hooks/useCompareSelection';
import { resolveCompareItems, serializeCompareItems, type CompareItem } from '@/lib/compare';
import { compareUrl, MAX_COMPARE } from '@/lib/compareSelection';
import { compareStore } from '@/lib/compareStore';
import { findGeneration, latestGeneration } from '@/lib/generations';

/** Link zur Vergleichsseite für einen URL-Wert wie «a,b-2021». */
function urlFor(value: string): string {
  return compareUrl(value.split(',').filter(Boolean));
}

/**
 * Die Bikes auf der Vergleichsseite.
 *
 * Quelle ist die URL (?bikes=a,b-2021,c), damit sich jeder Vergleich teilen lässt.
 * Fehlt der Parameter, gilt die Auswahl aus der Vergleichsleiste. Jede Änderung landet
 * in beiden: in der URL und in der Vergleichsleiste.
 */
export function useCompareItems() {
  const models = useModels();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { ids: storedIds } = useCompareSelection();

  const param = searchParams.get('bikes');
  const source = param ?? storedIds.join(',');
  const items = useMemo(() => resolveCompareItems(source, models), [source, models]);
  const serialized = serializeCompareItems(items);
  const modelIds = items.map((item) => item.model.id).join(',');

  // URL bereinigen (Unbekanntes, Doppeltes) bzw. die gespeicherte Auswahl in die URL holen
  useEffect(() => {
    if (serialized !== (param ?? '')) void navigate(urlFor(serialized), { replace: true });
  }, [serialized, param, navigate]);

  // Vergleichsleiste nachführen, z. B. nach dem Öffnen eines geteilten Links
  useEffect(() => {
    compareStore.replace(modelIds ? modelIds.split(',') : []);
  }, [modelIds]);

  function update(next: readonly CompareItem[]) {
    compareStore.replace(next.map((item) => item.model.id));
    void navigate(urlFor(serializeCompareItems(next)), { replace: true });
  }

  return {
    items,
    /** Teilbarer Pfad, z. B. /compare?bikes=yamaha-mt-07,kawasaki-z650 */
    sharePath: urlFor(serialized),
    canAdd: items.length < MAX_COMPARE,

    add: (modelId: string) => {
      const model = models.find((candidate) => candidate.id === modelId);
      if (!model || items.length >= MAX_COMPARE) return;
      if (items.some((item) => item.model.id === modelId)) return;
      update([...items, { model, generation: latestGeneration(model) }]);
    },

    remove: (modelId: string) => {
      update(items.filter((item) => item.model.id !== modelId));
    },

    setGeneration: (modelId: string, generationId: string) => {
      update(
        items.map((item) =>
          item.model.id === modelId
            ? { model: item.model, generation: findGeneration(item.model, generationId) }
            : item,
        ),
      );
    },
  };
}
