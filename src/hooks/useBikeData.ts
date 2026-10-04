/**
 * Hooks für den Datenzugriff in Komponenten
 * -----------------------------------------
 * Sie laden über TanStack Query (src/lib/queries.ts) und «suspendieren», solange Daten
 * fehlen: Dann zeigt die Seite ihr Skeleton, bei einem Fehler die Meldung mit
 * «Erneut versuchen» (src/app/PageFrame.tsx). Die Komponenten bekommen die Daten deshalb
 * direkt – ohne undefined-Zustände.
 *
 * Kopfzeile und Vergleichsleiste liegen ausserhalb dieser Grenzen; sie nutzen
 * useLoadedBikeData, das nicht wartet, sondern bis zum Laden undefined liefert.
 */
import {
  useQuery,
  useQueryClient,
  useSuspenseQueries,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Feature, Manufacturer, Model } from '@/data/schema';
import { modelFullName, sortByFullName } from '@/lib/data';
import { bikeQueries } from '@/lib/queries';

/** Alle Modelle, alphabetisch nach vollem Namen. */
export function useModels(): readonly Model[] {
  const [{ data: models }, { data: manufacturers }] = useSuspenseQueries({
    queries: [bikeQueries.models(), bikeQueries.manufacturers()],
  });
  return useMemo(() => sortByFullName(models, manufacturers), [models, manufacturers]);
}

/**
 * Ein Modell vollständig (inkl. Quellen) für die Detailseite. Ist die Modellliste schon
 * geladen, erscheint die Seite sofort damit; die Details kommen im Hintergrund dazu.
 */
export function useModel(id: string | undefined): Model | undefined {
  const queryClient = useQueryClient();
  const { data } = useSuspenseQuery({
    ...bikeQueries.model(id ?? ''),
    initialData: () =>
      queryClient.getQueryData(bikeQueries.models().queryKey)?.find((model) => model.id === id),
    // Die Liste ist evtl. schlank (ohne Quellen) – darum gleich im Hintergrund nachladen
    initialDataUpdatedAt: 0,
  });
  return data ?? undefined;
}

export function useManufacturers(): readonly Manufacturer[] {
  return useSuspenseQuery(bikeQueries.manufacturers()).data;
}

export function useFeatures(): readonly Feature[] {
  return useSuspenseQuery(bikeQueries.features()).data;
}

/** Liefert eine Funktion für den vollen Namen, z. B. «Yamaha MT-07». */
export function useModelFullName(): (model: Model) => string {
  const manufacturers = useManufacturers();
  return (model) => modelFullName(model, manufacturers);
}

/** Liefert eine Funktion für den Herstellernamen zu einer ID. */
export function useManufacturerName(): (id: string) => string | undefined {
  const manufacturers = useManufacturers();
  return (id) => manufacturers.find((manufacturer) => manufacturer.id === id)?.name;
}

/**
 * Für Kopfzeile und Vergleichsleiste: wartet nicht, sondern liefert undefined,
 * bis Modelle und Hersteller geladen sind.
 */
export function useLoadedBikeData():
  { models: readonly Model[]; manufacturers: readonly Manufacturer[] } | undefined {
  const { data: models } = useQuery(bikeQueries.models());
  const { data: manufacturers } = useQuery(bikeQueries.manufacturers());
  return useMemo(
    () =>
      models && manufacturers
        ? { models: sortByFullName(models, manufacturers), manufacturers }
        : undefined,
    [models, manufacturers],
  );
}
